const request = require("request-promise");

const dotenv = require("dotenv");

//dotenv.config({ path: '.env'})
dotenv.config()

async function callRag(question, session_id) {
  try {

    console.log("invocando api rag...");
    console.log(process.cwd());

    endpoint = process.env.RAG_API_ENDPOINT;
    //endpoint = "http://localhost:3000/example"

    timeout = process.env.RAG_API_TIMEOUT || 10000;


    console.log(endpoint);

    options = {
      headers: {'content-type' : 'application/json'},
      uri:     endpoint,
      timeout: timeout,
      json:    {
        question: question,
        session_id: session_id
      }
    }

    var result = await request.post(options);

    console.log(1);
    console.log("resultado de invocación");
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error:", error);
    return `An error occurred while processing the request: ${error}`;
  }
}

module.exports = { callRag };
