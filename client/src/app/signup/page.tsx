"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Image from "next/image";

const stepTitles = [
  "Сайн байна уу, Ментор!",
  "Имэйл баталгаажуулах",
  "Нууц үг үүсгэх",
];

const initialValues = {
  email: "",
  code: "",
  password: "",
  confirmPassword: "",
};

const getStepSchema = (step: number) => {
  return z
    .object({
      email: step === 0 ? z.string().email("Зөв имэйл оруулна уу") : z.string(),
      code:
        step === 1 ? z.string().min(4, "Код 4 оронтой байх ёстой") : z.string(),
      password:
        step === 2
          ? z.string().min(6, "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой")
          : z.string(),
      confirmPassword: step === 2 ? z.string() : z.string(),
    })
    .refine(
      (data) => {
        if (step === 2) {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: "Нууц үг таарахгүй байна",
        path: ["confirmPassword"],
      }
    );
};

const MentorSignUp = () => {
  const [step, setStep] = useState(0);

  const handleNext = (values: typeof initialValues, actions: any) => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      alert("Бүртгэл амжилттай!\n" + JSON.stringify(values, null, 2));
      actions.resetForm();
      setStep(0);
    }
    actions.setSubmitting(false);
  };

  return (
    <div className="relative w-full h-screen">
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
          <div className="w-full h-full border-gray-400/50 border-1 backdrop-blur-md bg-black/20 flex flex-col items-center rounded-[20px]">
            <div className="h-[140px] flex flex-col items-center justify-between pt-[40px]">
              <div className="flex gap-3 pb-[60px]">
                <Image src="/image709.png" alt="image" width={29} height={24} />
                <p className="font-[700] text-[22px] text-white">Mentor Meet</p>
              </div>
              <p className="font-[600] text-[24px] text-white spacing-[100%]">
                {stepTitles[step]}
              </p>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={
                toFormikValidationSchema(getStepSchema(step)) as any
              }
              onSubmit={handleNext}
              enableReinitialize={false}
            >
              {({
                isSubmitting,
                values,
              }: {
                isSubmitting: boolean;
                values: typeof initialValues;
              }) => (
                <Form className="w-full h-full flex flex-col justify-center items-center">
                  {step === 0 && (
                    <div className="w-[300px] flex flex-col gap-[32px]">
                      <div className="flex gap-1 flex-col">
                        <p className="font-[500] text-[14px] text-white">
                          Email
                        </p>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Мэйл хаягаа оруулна уу..."
                          className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white] bg-transparent"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-red-400 text-xs mt-1"
                        />
                      </div>
                      <div className="flex w-full justify-center">
                        <button
                          type="submit"
                          className="border-1 border-white text-white rounded-[40px] py-[8px] px-[50px] transition-colors"
                        >
                          Үргэлжлүүлэх
                        </button>
                      </div>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="flex flex-col gap-[32px] w-[300px] items-center">
                      <div className="flex">
                        <p className="font-[500] text-[20px] text-white w-[272px] text-center flex justify-center ">
                          Та мэйл хаягаа шалгаж баталгаажуулах кодыг оруулна уу.
                        </p>
                      </div>
                      <div className="flex gap-1 flex-col items-center w-full">
                        <Field
                          name="code"
                          type="text"
                          placeholder="Код оруулна уу..."
                          className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white] bg-transparent"
                        />
                        <ErrorMessage
                          name="code"
                          component="div"
                          className="text-red-400 text-xs mt-1"
                        />
                      </div>
                      <div className="flex w-full justify-center">
                        <button
                          type="submit"
                          className="border-1 border-white text-white rounded-[40px] py-[8px] px-[50px] transition-colors"
                        >
                          Үргэлжлүүлэх
                        </button>
                      </div>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="w-[300px] flex flex-col gap-[32px]">
                      <div className="flex flex-col gap-2">
                        <p className="font-[500] text-[14px] text-white">
                          Password
                        </p>
                        <Field
                          name="password"
                          type="password"
                          placeholder="Нууц үгээ оруулна уу..."
                          className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white] bg-transparent"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-red-400 text-xs mt-1"
                        />
                        <p className="font-[500] text-[14px] text-white">
                          Confirm password
                        </p>
                        <Field
                          name="confirmPassword"
                          type="password"
                          placeholder="Нууц үгээ давтана уу"
                          className="border-1 border-white rounded-[40px] py-[8px] px-[20px] w-full text-[white] bg-transparent"
                        />
                        <ErrorMessage
                          name="confirmPassword"
                          component="div"
                          className="text-red-400 text-xs mt-1"
                        />
                      </div>
                      <div className="flex w-full justify-center">
                        <button
                          type="submit"
                          className="border-1 border-white text-white rounded-[40px] py-[8px] px-[50px] transition-colors"
                        >
                          Үргэлжлүүлэх
                        </button>
                      </div>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
            <div className="pb-[60px] flex gap-2 w-full justify-center">
              <p className="font-[400] text-[16px] text-white">
                Бүртгэлтэй юу?
              </p>
              <button className="font-[400] cursor-pointer text-[16px] text-[#2468FF]">
                Нэвтрэх
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorSignUp;
