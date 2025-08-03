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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testComponents = void 0;
const index_1 = require("./index");
// Test function to demonstrate the new components
const testComponents = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=== Testing detectIntent Component ===");
    const testMessages = [
        "Надад python сурахад туслах ментор хэрэгтэй байна.",
        "Яаж бүртгүүлэх вэ?",
        "Сайт ажиллахгүй байна",
        "Сайн байна уу?",
    ];
    for (const message of testMessages) {
        const intent = yield (0, index_1.detectIntent)(message);
        console.log(`Message: "${message}" -> Intent: ${intent}`);
    }
    console.log("\n=== Testing getAiReply Component ===");
    const testMessage = "Надад python сурахад туслах ментор хэрэгтэй байна.";
    const intent = yield (0, index_1.detectIntent)(testMessage);
    // Test with rule-based response
    const response = yield (0, index_1.getAiReply)(testMessage, intent);
    console.log(`Message: "${testMessage}"`);
    console.log(`Intent: ${intent}`);
    console.log(`Response: ${response}`);
});
exports.testComponents = testComponents;
// Example usage in other files:
/*
import { detectIntent, getAiReply } from '../utils';

// In your controller or service:
const intent = await detectIntent(userMessage);
const aiResponse = await getAiReply(userMessage, intent, studentProfile, mentors);
*/
