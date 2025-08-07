import Image from "next/image";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import axios from "axios";

// const isEmailAvailable = async (email: string) => {
//   const response = await axios.post('https://mentor-meet-h0tx.onrender.com/mentorEmail')
// }

interface Props {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
  onGoogleSignIn?: (userData: any) => void;
}

const FirstStudentSignup = ({
  email,
  setEmail,
  onSubmit,
  loading,
  error,
  onGoogleSignIn,
}: Props) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn("google", {
        callbackUrl: "/student-signup",
        redirect: false,
      });

      if (result?.ok && session?.user) {
        // Google sign-in successful
        const userData = {
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          accessToken: session.accessToken,
        };

        if (onGoogleSignIn) {
          onGoogleSignIn(userData);
        }
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <div className="relative w-full h-screen">
      {/* Overlay and background image */}
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src={
          "https://images.unsplash.com/photo-1706074740295-d7a79c079562?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt="background image"
        fill
        className="absolute inset-0 -z-20 object-cover "
      />
      <div className="relative z-10 w-full h-full flex justify-center items-center">
        <div className="w-6/10 h-7/10 flex items-center justify-center">
          <div className="w-full h-full  border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center rounded-[20px]">
            <div className="h-[140px] flex flex-col items-center justify-between pt-[40px]">
              <div className="flex gap-3 pb-[60px]">
                <Image
                  src={"/image709.png"}
                  alt="image"
                  width={29}
                  height={24}
                />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
              <p className="font-[600] text-[24px] text-white spacing-[100%]">
                Сайн байна уу, Суралцагч!
              </p>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="w-[300px] flex flex-col gap-[32px]">
                {/* Google Sign-In Button */}
                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleGoogleSignIn}
                    className="flex items-center justify-center gap-3 bg-white text-gray-700 rounded-[40px] py-[12px] px-[20px] w-full font-medium hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google-р бүртгүүлэх
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/30"></div>
                    <span className="text-white/60 text-sm">эсвэл</span>
                    <div className="flex-1 h-px bg-white/30"></div>
                  </div>
                </div>

                <div className="flex gap-1 flex-col">
                  <p className="font-[500] text-[14px] text-white">Email</p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Мэйл хаягаа оруулна уу..."
                    className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white]"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    title="Please enter a valid email address"
                  />
                  {error && (
                    <div className="text-red-400 text-xs mt-1">{error}</div>
                  )}
                </div>
                <div className="flex w-full justify-center">
                  <button
                    className="border-1 border-white text-white rounded-[40px] py-[8px] px-[50px] disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={onSubmit}
                    disabled={loading || !email.trim()}
                  >
                    {loading ? "Түр хүлээнэ үү..." : "Үргэлжлүүлэх"}
                  </button>
                </div>
              </div>
            </div>
            <div className="pb-[60px] flex gap-2 w-full justify-center">
              <p className="font-[400] text-[16px] text-white">
                Бүртгэлтэй юу?
              </p>
              <Link href="/student-login">
                <span className="font-[400] cursor-pointer text-[16px] text-[#2468FF]">
                  Нэвтрэх
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstStudentSignup;
