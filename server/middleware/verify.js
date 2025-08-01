"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Verify = async (request, response) => {
    const { token } = request.body;
    // const tokenPassword = "mentor-meet";
    const tokenPassword = process.env.JWT_SECRET;
    const isValid = jsonwebtoken_1.default.verify(token, tokenPassword);
    try {
        if (isValid) {
            const destructToken = jsonwebtoken_1.default.decode(token);
            response.send(destructToken);
            return;
        }
        else {
            response.status(401).send({ message: "Хүчингүй токен байна!" });
            return;
        }
    }
    catch (err) {
        response.status(401).send({ message: "Хүчингүй токен байна!" });
        return;
    }
};
exports.Verify = Verify;
