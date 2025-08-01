"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentVerify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const studentVerify = async (req, res) => {
    const { token } = req.body;
    const TokenPassword = "Student-Meet";
    try {
        const isValid = jsonwebtoken_1.default.verify(token, TokenPassword);
        if (isValid) {
            const destruck = jsonwebtoken_1.default.decode(token);
            res.status(200).send({ destruck });
            return;
        }
        else {
            res.status(401).send({ message: "token is not valid " });
            return;
        }
    }
    catch (error) {
        res.status(401).send({ message: "token is not valid " });
        return;
    }
};
exports.studentVerify = studentVerify;
