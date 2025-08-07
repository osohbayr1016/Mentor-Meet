import { Request, Response } from "express";
import { StudentModel } from "../model/student-model";

// 🧑‍🎓 Student profile авах
export const getStudentProfile = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email шаардлагатай!" });
    }

    const student = await StudentModel.findOne({ email });

    if (!student) {
      return res.status(404).json({ error: "Student олдсонгүй." });
    }

    const profile = {
      name: student.nickname || "Unknown",
      email: student.email,
      phoneNumber: student.phoneNumber,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    res.json(profile);
  } catch (err) {
    console.error("getStudentProfile error:", err);
    res.status(500).json({ error: "Student profile авахад алдаа гарлаа." });
  }
};

// 📝 Student profile шинэчлэх
export const updateStudentProfile = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const { nickname, phoneNumber } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email шаардлагатай!" });
    }

    const updateData: any = {};
    if (nickname) updateData.nickname = nickname;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    updateData.updatedAt = new Date(); // ✅ зөв нэршил

    const student = await StudentModel.findOneAndUpdate({ email }, updateData, {
      new: true,
    });

    if (!student) {
      return res.status(404).json({ error: "Student олдсонгүй." });
    }

    const profile = {
      name: student.nickname || "Unknown",
      email: student.email,
      phoneNumber: student.phoneNumber,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    };

    res.json(profile);
  } catch (err) {
    console.error("updateStudentProfile error:", err);
    res.status(500).json({ error: "Student profile шинэчлэхэд алдаа гарлаа." });
  }
};

// 🧾 Бүх student-уудын жагсаалт авах
export const getAllStudents = async (_req: Request, res: Response) => {
  try {
    const students = await StudentModel.find({}, { password: 0 }); // password-г хасаж авна

    const profiles = students.map((student) => ({
      name: student.nickname || "Unknown",
      email: student.email,
      phoneNumber: student.phoneNumber,
      createdAt: student.createdAt,
      updatedAt: student.updatedAt,
    }));

    res.json(profiles);
  } catch (err) {
    console.error("getAllStudents error:", err);
    res
      .status(500)
      .json({ error: "Student-уудын жагсаалт авахад алдаа гарлаа." });
  }
};
