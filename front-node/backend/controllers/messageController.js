const { callRag } = require("../services/ragService");

let chatLog =
  "Chat Log: Chat Bot: Hi, I'm a Chat Bot. What can I help you with today?\n";

async function handleMessage(req, res) {
  const content = req.body.message;

  if (content.trim() === "") {
    return res.status(400).json({ error: "Empty message" });
  }

  session_id = "pendiente"
  const response = await callRag(content,session_id)

  chatLog += "User: " + content + "\n";
  chatLog += "Chat Bot: " + response + "\n";

  answer = response.answer

  return res.json({ message: answer });
}

module.exports = { handleMessage };
