// import fetch from "node-fetch"

type OpenAIResponse = {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
};

export const detectIntent = async (
  message: string
): Promise<" issue" | "request" | "help" | "other"> => {
  const fetch = (await import("node-fetch")).default;

  const prompt = `
You are an assistant for a website called "Mentor Meet", a platform connecting students and mentors.
Classify the user's message strictly as one of these categories: issue, request, help, or other.
Respond with exactly one word ONLY: "issue", "request", "help", or "other".

Here are some examples:
- If the user reports a problem, respond with "issue".
- If the user asks for something or makes a request, respond with "request".
- If the user is asking for assistance or guidance, respond with "help".
- If the message does not fit the above categories, respond with "other".
`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: prompt.trim(),
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0,
    }),
  });

  const data = (await res.json()) as OpenAIResponse;

  const intentRaw = data.choices?.[0]?.message?.content;

  if (typeof intentRaw !== "string") return "other";

  const intent = intentRaw.toLowerCase().trim();

  if (["issue", "request", "help"].includes(intent)) return intent as any;

  return "other";
};
