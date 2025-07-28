import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { MentorModel } from "../model/mentor-model";
import { config } from "dotenv";
import { StudentModel } from "../model/student-model";


export const StudentLogin = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            return res.status(400).send({ message: "Имайл болон нууц үг шаардлагатай!" });
        }


        const student = await StudentModel.findOne({ email });

    if (!student) {
      return res.status(400).send({ message: "Имайл буруу байна!" });
    }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
          return res.status(401).send({ message: "Нууц үг буруу байна!" });
        }

    const token = jwt.sign(
    { userId: student.id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "24h",
    }
  );

  res.json({
    token,
    user: {
      id: student.id,
      email: student.email
    },
  });


    }catch (error: any) {
        console.log("Login error:",error.message)
        res.status(500).json({message: " Серверийн алдаа!", error: error.message});
        return 
    }
}