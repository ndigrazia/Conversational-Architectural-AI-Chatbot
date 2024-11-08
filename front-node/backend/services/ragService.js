const request = require("request-promise");

const dotenv = require("dotenv");

//dotenv.config({ path: '.env'})
dotenv.config()

async function callRag(question, session_id) {
  try {

    console.log("invocando api rag...");
    console.log(process.cwd());
    console.log(process.env.RAG_API_ENDPOINT);

    options = {
      headers: {'content-type' : 'application/json'},
      uri:     process.env.RAG_API_ENDPOINT,
      json:    {
        question: question,
        session_id: session_id
      }
    }

    var result = await request(options);

    console.log(1);
    console.log(result.body);
    return result.body;
  } catch (error) {
    console.error("Error:", error);
    return `An error occurred while processing the request: ${error}`;
  }
}

module.exports = { callRag };
