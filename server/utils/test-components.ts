import { detectIntent, getAiReply, type IntentType } from "./index";

// Test function to demonstrate the new components
export const testComponents = async () => {
  console.log("=== Testing detectIntent Component ===");

  const testMessages = [
    "Надад python сурахад туслах ментор хэрэгтэй байна.",
    "Яаж бүртгүүлэх вэ?",
    "Сайт ажиллахгүй байна",
    "Сайн байна уу?",
  ];

  for (const message of testMessages) {
    const intent = await detectIntent(message);
    console.log(`Message: "${message}" -> Intent: ${intent}`);
  }

  console.log("\n=== Testing getAiReply Component ===");

  const testMessage = "Надад python сурахад туслах ментор хэрэгтэй байна.";
  const intent = await detectIntent(testMessage);

  // Test with rule-based response
  const response = await getAiReply(testMessage, intent);
  console.log(`Message: "${testMessage}"`);
  console.log(`Intent: ${intent}`);
  console.log(`Response: ${response}`);
};

// Example usage in other files:
/*
import { detectIntent, getAiReply } from '../utils';

// In your controller or service:
const intent = await detectIntent(userMessage);
const aiResponse = await getAiReply(userMessage, intent, studentProfile, mentors);
*/
