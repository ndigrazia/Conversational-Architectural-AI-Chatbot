const { callRag } = require("../services/ragService");

let chatLog =
  "Chat Log: Chat Bot: Hi, I'm a Chat Bot. What can I help you with today?\n";

async function handleMessage(req, res) {
  const question = req.body.question;

  if (question.trim() === "") {
    return res.status(400).json({ error: "Empty message" });
  }

  session_id = "pendiente"
  const response = await callRag(question,session_id)

  answer = response.answer;

  chatLog += "User: " + question + "\n";
  chatLog += "Chat Bot: " + answer + "\n";

  link_references = response.link_references;

  return res.json({ answer: answer , link_references : link_references});
}

module.exports = { handleMessage };
