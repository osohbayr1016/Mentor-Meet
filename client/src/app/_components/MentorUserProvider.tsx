"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type MentorData = {
  mentorId: string;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  nickName?: string;
  category?: string;
  careerDuration?: string;
  profession?: string;
  image?: string;
  email: string;
};

type LoginResponse = {
  message: string;
  token: string;
  mentorId: string;
};

type ProfileResponse = {
  mentor: MentorData;
};

type AuthContextType = {
  mentor: MentorData | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    redirectTo?: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Prevent multiple login attempts

  const login = async (
    email: string,
    password: string,
    redirectTo?: string
  ): Promise<{ success: boolean; message: string }> => {
    // Prevent multiple simultaneous login attempts
    if (isLoggingIn) {
      console.log("Login already in progress, ignoring request");
      return { success: false, message: "Нэвтрэх үйлдэл хийгдэж байна..." };
    }

    console.log("Starting login process for:", email);
    setIsLoggingIn(true);
    setIsLoading(true);

    try {
      const response = await axios.post<LoginResponse>(
        "https://mentor-meet-o3rp.onrender.com/mentorLogin",
        {
          email,
          password,
        }
      );

      console.log("Login response:", response.data);
      const { token, mentorId, message } = response.data;

      if (token && mentorId) {
        console.log("Login successful, fetching mentor data...");

        try {
          // Fetch mentor profile data using the token
          const profileResponse = await axios.get<ProfileResponse>(
            "https://mentor-meet-o3rp.onrender.com/mentorProfile",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("Profile fetch successful:", profileResponse.data);
          const mentorData = profileResponse.data.mentor;

          if (mentorData) {
            console.log("Mentor data received:", mentorData);
            // Store token and user data
            localStorage.setItem("mentorToken", token);
            localStorage.setItem(
              "mentorUser",
              JSON.stringify(mentorData.mentorId)
            );
            localStorage.setItem("mentorEmail", mentorData.email); // Email-г тусад нь хадгалах

            setMentor(mentorData);
            console.log("Mentor state updated, login complete");

            // Optional redirect only if explicitly requested
            if (redirectTo) {
              console.log("Redirecting to:", redirectTo);
              setTimeout(() => {
                try {
                  router.push(redirectTo);
                  console.log("Router.push executed");
                } catch (error) {
                  console.error(
                    "Router.push failed, using window.location:",
                    error
                  );
                  window.location.href = redirectTo;
                }
              }, 100);
            }

            return {
              success: true,
              message: message || "Амжилттай нэвтэрлээ!",
            };
          } else {
            console.log("Failed to fetch mentor profile");
            return { success: false, message: "Профайл мэдээлэл олдсонгүй" };
          }
        } catch (profileError: any) {
          console.error("Profile fetch error:", profileError);
          console.error("Profile fetch error details:", {
            status: profileError.response?.status,
            statusText: profileError.response?.statusText,
            data: profileError.response?.data,
            message: profileError.message,
          });

          // Fallback: create minimal user object from available data
          const minimalUser: MentorData = {
            mentorId: mentorId,
            email: email,
            isAdmin: false,
            firstName: "",
            lastName: "",
          };

          localStorage.setItem("mentorToken", token);
          localStorage.setItem("mentorUser", JSON.stringify(minimalUser));
          localStorage.setItem("mentorEmail", minimalUser.email); // Email-г тусад нь хадгалах
          setMentor(minimalUser);

          // Optional redirect only if explicitly requested
          if (redirectTo) {
            console.log("Redirecting to:", redirectTo);
            setTimeout(() => {
              try {
                router.push(redirectTo);
                console.log("Router.push executed");
              } catch (error) {
                console.error(
                  "Router.push failed, using window.location:",
                  error
                );
                window.location.href = redirectTo;
              }
            }, 100);
          }

          return { success: true, message: message || "Амжилттай нэвтэрлээ!" };
        }
      } else {
        console.log("Login failed - no token or user");
        return { success: false, message: message || "Нэвтрэхэд алдаа гарлаа" };
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Нэвтрэхэд алдаа гарлаа";
      return { success: false, message };
    } finally {
      setIsLoading(false);
      setIsLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("mentorToken");
    localStorage.removeItem("mentorUser");
    localStorage.removeItem("mentorEmail"); // Email-г устгах
    setMentor(null);
    router.push("/");
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("mentorToken");
      const userStr = localStorage.getItem("mentorUser");

      if (!token || !userStr) {
        setIsLoading(false);
        return false;
      }

      // Try to parse stored user data
      try {
        const userData = JSON.parse(userStr) as MentorData;
        setMentor(userData);
        setIsLoading(false);
        return true;
      } catch (parseError) {
        console.error("Error parsing user data:", parseError);
        logout();
        return false;
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        mentor,
        isLoading,
        login,
        logout,
        checkAuth,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
