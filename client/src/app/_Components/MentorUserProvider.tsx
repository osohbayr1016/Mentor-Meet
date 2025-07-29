"use client";
import axios from "axios";
import { redirect, useRouter } from "next/navigation";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type MentorData = {
  mentorId: string | null;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
  nickName?: string;
  category?: string;
  careerDuration?: string;
  profession?: string;
  image?: string;
};

type AuthContextType = {
  mentor: MentorData | null;
  tokenChecker: (_token: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const [mentor, setMentor] = useState<MentorData | null>(null);

  const tokenChecker = async (token: string) => {
    try {
      const response: any = await axios.post("http://localhost:8000/verify", {
        token,
      });

      const { mentorId, isAdmin } = response.data.destructToken;
      localStorage.setItem(mentorId, "mentorId");
      localStorage.setItem(isAdmin, "Admin");
      // localStorage.setItem("isAdmin", JSON.stringify(isAdmin));

      const resProf = await axios.get("http://localhost:8000/mentorProfile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const profile: any = resProf.data;

      setMentor({
        mentorId,
        isAdmin,
        firstName: profile.firstName,
        lastName: profile.lastName,
        nickName: profile.nickName,
        category: profile.category,
        careerDuration: profile.careerDuration,
        profession: profile.profession,
        image: profile.image,
        bio: profile.bio,
      });
    } catch (err) {
      // redirect("/");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("mentorToken");
    if (token) {
      tokenChecker(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ mentor, tokenChecker }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
