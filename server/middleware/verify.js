"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verify = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Verify = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.Verify = Verify;
