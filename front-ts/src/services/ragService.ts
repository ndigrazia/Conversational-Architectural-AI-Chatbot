import request from "request-promise";
//import request from "request";
import dotenv from "dotenv-flow";

dotenv.config();
async function callRag(question: string, session_id: string): Promise<any> {
  try {
    console.log("invocando api rag...");
    console.log("session_id: " + session_id);

    const endpoint: string = process.env.RAG_API_ENDPOINT || "una_url";
    const timeout: number = parseInt(process.env.RAG_API_TIMEOUT || "10000", 10);

    const options = {
      headers: { 'content-type': 'application/json' },
      uri: endpoint,
      timeout: timeout,
      json: {
        question: question,
        session_id: session_id
      }
    };

    const result = await request.post(options);

    console.log("resultado de invocación");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    return `An error occurred while processing the request: ${error}`;
  }
}

export { callRag };