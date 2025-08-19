// controllers/chatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const historyByUser = new Map();
const MAX_TURNS = 8; // keep last 8 exchanges

const MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash"; // fast & free tier friendly
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn(" GEMINI_API_KEY is missing. Set it in your .env");
}


const getHistory = (userId) => {
  if (!userId) return [];
  return historyByUser.get(userId) || [];
};


const saveTurn = (userId, role, text) => {
  if (!userId) return;
  const arr = historyByUser.get(userId) || [];
  arr.push({ role, parts: [{ text }] });
  // keep only the last N turns (user+assistant)
  while (arr.length > MAX_TURNS * 2) arr.shift();
  historyByUser.set(userId, arr);
};

exports.chatOnce = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "message is required (string)" });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL });

    // build chat with prior history for this user
    const chat = model.startChat({
      history: [
        // system prompt as an assistant “instruction”
        { role: "user", parts: [{ text: "System: You are a helpful, practical assistant. Be concise and friendly." }] },
        ...getHistory(userId)
      ],
    });

    // send the new user message
    const result = await chat.sendMessage(message);
    const text = result.response.text() || "(no reply)";

    // save turns in memory
    saveTurn(userId, "user", message);
    saveTurn(userId, "model", text);

    res.json({ reply: text });
  } catch (err) {
    console.error("Gemini chat error:", err?.response?.data || err);
    res.status(500).json({
      error: "chat_failed",
      detail: (err?.response?.data?.error?.message || err.message || "unknown error")
    });
  }
};
