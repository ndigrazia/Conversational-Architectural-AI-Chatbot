import os
from dotenv import load_dotenv
from rag.answer_generator import AnswerGenerator
from rag.retriever import Retriever
from support.vectorstore_connectors.chroma import ChromaConnector
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings()
index_collection_name = os.getenv("INDEX_COLLECTION_NAME")

def main():
    vector_connector = ChromaConnector(embeddings, index_collection_name)
    doc_search = vector_connector.get_client()

    retriever = Retriever(doc_search)
    answer_generator = AnswerGenerator(retriever)

    while(True):
        question = input("Pregunta: ")
        qa_response = answer_generator.get_answer(question)
        print("Respuesta: " + qa_response.answer)
        print(qa_response.to_printable_references())

main()