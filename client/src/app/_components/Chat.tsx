"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessagesSquare, SendHorizonal, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

type Message = {
  _id?: string;
  email?: string;
  message: string;
  senderType?: "student" | "mentor" | "admin" | "bot" | "unknown";
  createdAt?: string;
};

export const HomeChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const studentToken = localStorage.getItem("studentToken");
    const mentorToken = localStorage.getItem("mentorToken");
    const studentEmail = localStorage.getItem("studentEmail");
    const mentorEmail = localStorage.getItem("mentorEmail");
    const studentUser = localStorage.getItem("studentUser");
    const mentorUser = localStorage.getItem("mentorUser");

    console.log("localStorage debug:");
    console.log("studentToken:", studentToken);
    console.log("mentorToken:", mentorToken);
    console.log("studentEmail:", studentEmail);
    console.log("mentorEmail:", mentorEmail);
    console.log("studentUser:", studentUser);
    console.log("mentorUser:", mentorUser);

    setToken(studentToken || mentorToken);

   
    let email = studentEmail || mentorEmail;


    if (!email) {
      if (studentUser) {
        try {
          const userData = JSON.parse(studentUser);
          email = userData.email;
        } catch (e) {
          console.error("Error parsing studentUser:", e);
        }
      } else if (mentorUser) {
        try {
          const userData = JSON.parse(mentorUser);
          email = userData.email;
        } catch (e) {
          console.error("Error parsing mentorUser:", e);
        }
      }
    }

    setUserEmail(email || "");

    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
      }/getMessages`,
      {
        headers: {
          Authorization: `Bearer ${studentToken || mentorToken}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data: Message[]) => {
        setMessages(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) {
      alert("Асуултаа бичнэ үү!");
      return;
    }
    if (!token) {
      alert("Нэвтрэх хэрэгтэй!");
      return;
    }
    if (!userEmail) {
      alert("Хэрэглэгчийн мэдээл олдсонгүй. Дахин нэвтэрнэ үү!");
      return;
    }
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    const newMsg = {
      email: userEmail,
      message: input,
    
    };

    console.log("Sending message with email:", userEmail);

    try {
      const local = localStorage.getItem("studentUser");
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/createMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newMsg),
        }
      );

      const data = await res.json();
      console.log("API Response:", data);

      if (!res.ok) {
        console.error("API Error:", data);
        alert(data.error || "Алдаа гарлаа.");
        return;
      }

      console.log("Messages received:", data.messages);
      setMessages((prev) => [...prev, ...data.messages]);
      setInput("");
    } catch (error) {
      console.error("Network error:", error);
      alert("Сервертэй холбогдож чадсангүй.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div
        className="w-[44px] h-[44px] rounded-full bg-transparent  flex justify-center items-center border border-[#00000040] mt-2 cursor-pointer fixed bottom-6 right-6 z-50"
        onClick={() => setOpen(true)}
      >
        <MessagesSquare className="h-[20px]" />
      </div>

      <div
        className={`
          fixed bottom-20 right-6 z-50
          transition-all duration-300
          ${
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-10 pointer-events-none"
          }
        `}
      >
        <div className="w-[320px] h-[400px] bg-white rounded-[20px] p-4 flex flex-col gap-2 border-2 border-[#808080] shadow-2xl relative">
          <div
            className="absolute right-4 top-4 cursor-pointer"
            onClick={() => setOpen(false)}
          >
            <X />
          </div>
          <p className="text-[16px] font-semibold mb-2 pt-[1px] pl-[20px]">
            👋 Бид танд хэрхэн туслах вэ?
          </p>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
            style={{ wordBreak: "break-word" }}
          >
            {messages.map((el, index) => (
              <div
                key={el._id || index}
                className={`max-w-[80%] px-4 py-2 rounded-xl shadow ${
                  el.senderType === "student" || el.senderType === "mentor"
                    ? "bg-green-600 font-medium text-white self-end"
                    : "bg-[#666] text-white self-start"
                }`}
              >
                {el.message}
              </div>
            ))}
          </div>

          {!token ? (
            <div className="flex flex-col items-center mt-4">
              <p className="text-[14px] font-semibold">
                Нэвтэрсэн хэрэглэгч бичих боломжтой.
              </p>
              <Link href={"student-login"}>
                <Button className="w-[93px] h-[32px] text-white bg-[#000000] rounded-[40px] font-semibold mt-2">
                  Нэвтрэх
                </Button>
              </Link>
            </div>
          ) : (
            <div className="w-full h-[32px] flex flex-row items-center gap-2 mt-auto">
              <Input
                className="w-[240px] h-[32px] rounded-[40px] shadow-lg border border-[#80808080] p-4"
                placeholder={
                  isLoading ? "Илгээж байна..." : "Асуудлаа бичнэ үү.."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) handleSend();
                }}
                disabled={isLoading}
              />
              <button
                className={`w-[32px] h-[32px] flex justify-center items-center ${
                  isLoading ? "text-gray-400" : "text-[#808080]"
                }`}
                onClick={handleSend}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <SendHorizonal />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
