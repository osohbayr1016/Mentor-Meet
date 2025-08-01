"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findmail = void 0;
const mentor_model_1 = require("../model/mentor-model");
const Otp_model_1 = require("../model/Otp-model");
const nodemailer_1 = __importDefault(require("nodemailer"));
const findmail = async (req, res) => {
    const { email } = req.body;
    try {
        // if (!email) {
        //   return res.status(400).send({ message: "Имайл шаардлагатай!" });
        // }
        const user = await mentor_model_1.MentorModel.findOne({ email });
        if (user) {
            const code = Math.floor(1000 + Math.random() * 9000).toString();
            const transport = nodemailer_1.default.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "baabarmx@gmail.com",
                    pass: "yignruoqpvxgluyq",
                },
            });
            const options = {
                from: "baabarmx@gmail.com",
                to: email,
                subject: "Hello",
                html: `<div style="color:red"> ${code}</div> `,
            };
            await Otp_model_1.OtpModel.create({ code, email });
            await transport.sendMail(options);
        }
        return res.status(200).json({ message: "success" });
    }
    catch (error) {
        console.error("Checkemail error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.findmail = findmail;
