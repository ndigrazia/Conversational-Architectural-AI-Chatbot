import * as express from 'express';
import { callRag } from '../services/ragService.js';

let chatLog: string =
  "Chat Log: Chat Bot: Hi, I'm a Chat Bot. What can I help you with today?\n";

async function handleMessage(req : any, res : any, next : any) {

  console.log(req.body);
  const question: string = req.body.question;

  if ( !question || question.trim() === "") {
    return res.status(400).json({ error: "Empty message" });
  }
  // la session se crea por cada ventana de browser. El usuario no tiene control de eso por ahora.
  // los valores van a depender si se usa la cookie o el access token.
  var session_id: string = "";
  if ( !req.session.passport || !req.session.passport.user ) {
    var session_id: string = req.user.email +":"+ req.user.preferred_username +":"+ req.user.jti
  } else {
    var session_id: string = req.session.passport.user.email +":"+ req.session.passport.user.preferred_username +":"+ req.session.id
  }
  
  if ( !session_id || session_id.trim() === "") {
    return res.status(400).json({ error: "No authorization" });
  }

  const response: any = await callRag(question, session_id);

  const answer: string = response.answer;

  chatLog += "User: " + question + "\n";
  chatLog += "Chat Bot: " + answer + "\n";

  const link_references: any = response.link_references;

  return res.json({ answer, link_references });
}
export { handleMessage };