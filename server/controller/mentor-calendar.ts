import { Request, Response } from "express";
import { MentorCalendarModel } from "../model/calendar-model";

export const UpdateMentorAvailability = async (req: Request, res: Response) => {
  const { mentorId } = res.locals;
  const { availabilities } = req.body;

  try {
    const existing = await MentorCalendarModel.findOne({ mentorId });
    console.log(mentorId);

    if (existing) {
      existing.availabilities = availabilities;

      await existing.save();
    } else {
      await MentorCalendarModel.create({
        mentorId,
        availabilities,
      });
    }

    return res.status(200).json({ message: "Амжилттай хадгалагдлаа" });
  } catch (err) {
    console.error("Calendar save error:", err);
    return res.status(500).json({ message: "Серверийн алдаа" });
  }
};

// import { Request, Response } from "express";
// import { MentorCalendarModel } from "../model/calendar-model";

// export const UpdateMentorAvailability = async (req: Request, res: Response) => {
//   const { mentorId } = res.locals;
//   const { availabilities } = req.body;

//   if (!Array.isArray(availabilities) || availabilities.length === 0) {
//     return res.status(400).json({ message: "availabilities хоосон байна" });
//   }

//   try {
//     const existing = await MentorCalendarModel.findOne({ mentorId });

//     if (existing) {
//       // Merge or replace logic — here we replace the old availabilities
//       existing.availabilities = availabilities;
//       await existing.save();
//     } else {
//       await MentorCalendarModel.create({
//         mentorId,
//         availabilities, // ✅ send the full array as-is
//       });
//     }

//     return res.status(200).json({ message: "Амжилттай хадгалагдлаа" });
//   } catch (err) {
//     console.error("Calendar save error:", err);
//     return res.status(500).json({ message: "Серверийн алдаа" });
//   }
// };
