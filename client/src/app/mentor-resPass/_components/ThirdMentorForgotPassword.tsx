import Image from "next/image";

interface Props {
  password: string;
  confirmPassword: string;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string;
}

const ThirdMentorForgotPassword = ({
  password,
  confirmPassword,
  setPassword,
  setConfirmPassword,
  onSubmit,
  loading,
  error,
}: Props) => {
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
                Сайн байна уу, Ментор!
              </p>
            </div>
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="w-[300px] flex flex-col gap-[32px]">
                <div className="flex flex-col gap-2">
                  <p className="font-[500] text-[14px] text-white">
                    New password
                  </p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Шинэ нууц үгээ оруулна уу..."
                    className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white]"
                  />
                  <p className="font-[500] text-[14px] text-white">
                    Confirm password
                  </p>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Нууц үгээ давтана уу"
                    className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white]"
                  />
                  {password &&
                    confirmPassword &&
                    password !== confirmPassword && (
                      <div className="text-red-400 text-xs mt-1">
                        * Нууц үг таарахгүй байна. Нууц үгээ давтан оруулна уу!
                      </div>
                    )}
                  {/* {error && (
                    <div className="text-red-400 text-xs mt-1">{error}</div>
                  )} */}
                </div>
                <div className="flex w-full justify-center">
                  <button
                    className="border-1 border-white text-white rounded-[40px] py-[8px] px-[50px]"
                    onClick={onSubmit}
                    disabled={loading || !password || !confirmPassword}
                  >
                    {loading ? "Түр хүлээнэ үү..." : "Үргэлжлүүлэх"}
                  </button>
                </div>
              </div>
            </div>
            <div className="pb-[60px] flex gap-2 w-full justify-center">
              <p className="font-[400] text-[16px] text-white">
                Бүртгэлгүй юу?
              </p>
              <button className="font-[400] cursor-pointer text-[16px] text-[#2468FF]">
                Бүртгүүлэх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThirdMentorForgotPassword;
