"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import BookingModal from "../../../components/BookingModal";
import { ArrowLeft, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { useRouter } from "next/router";
import { useParams, useSearchParams } from "next/navigation";

interface Mentor {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profession: string;
  experience: {
    work: string;
    position: string;
    careerDuration: string;
  };
  education: {
    schoolName: string;
    major: string;
    endedYear: string;
  };
  bio: string;
  rating: number;
  hourlyPrice: number;
  image: string;
  category?: {
    categoryId: string;
    price: number;
  };
}

const MentorPayment = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const mentorId = Array.isArray(params.id) ? params.id[0] : params.id || "";
  const [open, setOpen] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [selectedTimesByDate, setSelectedTimesByDate] = useState<
    Record<string, string[]>
  >({});
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (agreed) {
      savePayment();
      setShowQr(true);
    }
  };

  useEffect(() => {
    if (!mentorId) return;

    const fetchMentor = async () => {
      try {
        const res = await fetch(`http://localhost:8000/mentor/${mentorId}`);
        if (!res.ok) {
          throw new Error("Mentor олдсонгүй");
        }
        const data = await res.json();
        setMentor(data);
      } catch (err: any) {}
    };

    fetchMentor();
  }, [mentorId]);

  // Parse selected times from URL parameters
  useEffect(() => {
    const timesParam = searchParams.get("times");
    if (timesParam) {
      try {
        const parsedTimes = JSON.parse(decodeURIComponent(timesParam));
        setSelectedTimesByDate(parsedTimes);

        // Calculate total price
        if (mentor) {
          const totalHours = Object.values(parsedTimes).flat().length;
          setTotalPrice(totalHours * mentor.hourlyPrice);
        }
      } catch (error) {
        console.error("Error parsing times parameter:", error);
      }
    }
  }, [searchParams, mentor]);

const getAllSelectedTimes = async () => {
  try {


    const response = await axios.get<{
      availabilities: { date: string; times: string[] }[];
    }>(`http://localhost:8000/calendar/${mentorId}`);

    const allTimes = response.data.availabilities.flatMap((a) => a.times);
    return allTimes;
    
  } catch (err) {
    console.error("Цаг авахад алдаа гарлаа:", err);
    return [];
  }
};

useEffect(() => {
  const fetchTimes = async () => {
    const times = await getAllSelectedTimes();
    console.log("Сонгосон цагууд:", times);
  };

  fetchTimes();
}, []);




  // Get total selected hours
  const getTotalSelectedHours = () => {
    return Object.values(selectedTimesByDate).flat().length;
  };

  // Format selected times for display
  const formatSelectedTimes = () => {
    const formattedTimes = [];
    for (const [date, times] of Object.entries(selectedTimesByDate)) {
      if (times.length > 0) {
        formattedTimes.push(`08/${date}: ${times.join(", ")}`);
      }
    }
    return formattedTimes;
  };

    const savePayment = async () => {
      const token = localStorage.getItem("studentToken");
const studentId = JSON.parse(localStorage.getItem("studentUser") || "{}")
const calendarId = localStorage.getItem("calendarId")
const paymentStatus = "pending"
const studentEmail = localStorage.getItem("studentEmail")

      try{

   const response = await axios.post(`http://localhost:8000/payment${studentId}`, {
        mentorId,
        calendarId,
        price:totalPrice,
        paymentStatus,
        email:studentEmail
  
      });
        console.log(response.data, "savepayment")
        setPaymentSuccess(true)
    } catch (err){
    console.error("Төлбөр илгээхэд алдаа гарлаа:", err);
      }
    }
  
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black/30 -z-10" />
      <Image
        src="/home.jpg"
        alt="background"
        fill
        className="absolute object-cover -z-20"
      />

      <div className="relative z-10 flex justify-center items-center ">
        <div className="w-320 h-[600px] mt-[70px] flex rounded-3xl backdrop-blur-[20px] bg-[#33333366] text-white overflow-hidden shadow-xl ">
          <div className="w-[300px] p-6 flex flex-col  gap-15  bg-[#333333B2]">
            <Link href={`/mentor/${mentorId}`}>
              <div className="flex flex-row items-center gap-3 text-[20px] font-semibold">
                <p>
                  <ArrowLeft />
                </p>{" "}
                <p>Буцах</p>{" "}
              </div>
            </Link>

            <div className="text-[16px] font-medium flex flex-col gap-3">
              <img
                src={mentor?.image}
                alt="mentor"
                className="rounded-[40px] h-[260px] w-[300px] p-[20px] object-cover"
              />
              <div>
                <h2 className="text-[18px]">{mentor?.firstName} </h2>
                <p>{mentor?.profession}</p>
                <p className="text-[14px] text-[#FFFFFFCC]">
                  Салбар: {mentor?.bio}
                </p>
                <div>⭐ {mentor?.rating}</div>
              </div>
            </div>
          </div>

          <div className="flex-1 px-10 py-6 flex flex-row justify-around  items-center ">
            <div className="space-y-4 mt-4">
              <p>
                <span className="text-white/60">Уулзалтын өдрүүд:</span> <br />
                <strong>
                  {formatSelectedTimes().length > 0
                    ? formatSelectedTimes().map((time, index) => (
                        <span key={index}>
                          {time}
                          <br />
                        </span>
                      ))
                    : "Сонгосон цаг байхгүй"}
                </strong>
              </p>
              <p>
                <span className="text-white/60">Нийт цаг:</span> <br />{" "}
                <strong>{getTotalSelectedHours()} цаг</strong>
              </p>
              <p>
                <span className="text-white/60">Уулзалтын үнэ:</span> <br />{" "}
                <strong>₮{totalPrice.toLocaleString()}</strong>
              </p>
              <p>
                <span className="text-white/60">Суралцагч:</span> <br />{" "}
                <strong>{mentor?.email}</strong>
              </p>
            </div>

            <div className="w-[1px] h-[500px] border border-[#FFFFFF80]"></div>

            <div className="flex justify-end mt-6">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white text-black px-8 py-2 rounded-full hover:bg-gray-200 transition font-semibold w-[200px] h-[40px"
                    onClick={() => {
                      setShowQr(false);
                      setAgreed(false);
                      setOpen(true);
                    }}
                  >
                    {" "}
                    Цаг захиалах
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[440px] h-[325px] bg-[white] rounded-[20px] flex flex-col justify-center items-center">
                  {!showQr ? (
                    <form
                      onSubmit={handlePayment}
                      className="flex flex-col justify-center items-center gap-3"
                    >
                      <DialogHeader>
                        <DialogTitle className="text-[white]">sss</DialogTitle>
                        <DialogDescription className="font-semibold text-[16px] flex justify-center">
                          Сануулга
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 text-[14px] text-[#00000099] font-medium px-6 ">
                        <p>
                          1. Та уулзалтаа цагаас нь 4 цагийн өмнө цуцлах
                          боломжтой.
                        </p>
                        <p>
                          2. Өөр суралцагч тухайн менторын цагийг захиалсан
                          тохиолдолд таны мөнгө буцаан олгогдоно.
                        </p>
                        <div className="flex flex-row justify-center items-center gap-3">
                          <Checkbox
                            id="terms"
                            checked={agreed}
                            onCheckedChange={(value) => setAgreed(!!value)}
                          />
                          <Label
                            htmlFor="terms"
                            className="text-[14px] text-[#000000] font-normal"
                          >
                            Зөвшөөрөх
                          </Label>
                        </div>
                      </div>
                      <DialogFooter className="mt-4">
                        <Button
                          type="submit"
                          className="w-[200px] h-[40px] rounded-[40px] bg-[#000000] text-[#FFFFFF]"
                          disabled={!agreed}
                        >
                          Төлбөр төлөх
                        </Button>
                      </DialogFooter>
                    </form>
                  ) : (
                    <div className=" flex flex-col justify-center items-center gap-40">
                      <div>
                        <p className="text-black font-medium">
                          Төлбөр төлөх QR:
                        </p>
                        <Image
                          src="/qr.png"
                          alt="background"
                          width={135}
                          height={135}
                          className="absolute object-cover -z-20"
                        />
                      </div>

                      <DialogClose asChild>
                        <Link href={"/payment-successfully"}>
                          <Button
                            type="submit"
                            className="w-[200px] h-[40px] rounded-[40px] bg-[#000000] text-[#FFFFFF]"
                          >
                            Төлбөр шалгах
                          </Button>
                        </Link>
                      </DialogClose>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-2 left-6 text-xs text-white/60 z-30">
        <div>Copyright © 2025 Mentor Meet</div>
        <div>All rights reserved.</div>
      </div>
    </div>
  );
};

export default MentorPayment;


