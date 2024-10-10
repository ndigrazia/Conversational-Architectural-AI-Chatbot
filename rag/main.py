# https://fastapi.tiangolo.com/tutorial/body/#declare-it-as-a-parameter

# para probar:
# pip install fastapi
# pip install fastapi-cli

# export
# export INDEX_COLLECTION_NAME=""
# export NUMBER_OF_RESULTS=""
# export NUMBER_OF_RESULTS_TO_VIEW=""


# fastapi dev main.py

import os
from dotenv import load_dotenv
from rag.answer_generator import AnswerGenerator
from rag.chat_answer_generator import ChatAnswerGenerator
from rag.retriever import Retriever
from support.responses.qa_response import QAResponse
from support.vectorstore_connectors.chroma import ChromaConnector
from utils.ai import create_embeddings



from fastapi import FastAPI
from pydantic import BaseModel
from typing import List


class Request(BaseModel):
    question: str
    session_id: str

class Response(BaseModel):
    answer: str
    link_references: List[str] = []
#    def __init__(self):
#        self.answer = ""
#        self.link_references = []


load_dotenv()

print("----------------ENV---------------------")

for key, value in os.environ.items():
    print(f"{key}={value}")

print("----------------ENV---------------------")

embeddings = create_embeddings()
index_collection_name = os.getenv("INDEX_COLLECTION_NAME")
number_of_results = int(os.getenv("NUMBER_OF_RESULTS"))
number_of_results_to_view = int(os.getenv("NUMBER_OF_RESULTS_TO_VIEW"))
vector_connector = ChromaConnector(embeddings, index_collection_name)

doc_search = vector_connector.get_client()
retriever = Retriever(doc_search)

answer_generator = ChatAnswerGenerator(retriever)


app = FastAPI()


@app.post("/rag/", response_model=Response)
async def rag(request: Request):

    response = answer_generator.get_answer(request.question,request.session_id)

    print("Respuesta: " + response.answer)

    api_response = Response(answer=response.answer)
    api_response.link_references = response.to_link_references()

    return api_response