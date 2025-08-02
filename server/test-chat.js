// Test script for chat system
const { getAiReply } = require("./utils/getAiReply");

async function testChat() {
  console.log("Testing chat system...");

  const testMessages = [
    "Надад программ сурахад туслах ментор хэрэгтэй байна.",
    "Хууль, эрх зүйн талаар асуулт байна",
    "Эрүүл мэндийн зөвлөгөө хэрэгтэй",
    "Дизайн, графикийн талаар суралцах хүсэлтэй",
    "Бизнес стратегийн талаар асуулт байна",
  ];

  for (const message of testMessages) {
    console.log(`\n--- Testing: "${message}" ---`);
    try {
      const response = await getAiReply(message, "хүсэлт", "test@example.com");
      console.log("Response:", response);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testChat().catch(console.error);
}

module.exports = { testChat };
