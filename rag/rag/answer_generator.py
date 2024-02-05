from dotenv import load_dotenv
from typing import Optional
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAI
from rag.retriever import Retriever
from support.responses.qa_response import QAResponse

load_dotenv()

class AnswerGenerator:
    llm = OpenAI(temperature=0)
    number_of_results_default = 4

    @property
    def retriever(self) -> Retriever:
        return self._retriever

    def __init__(self, retriever: Retriever):
        self._retriever = retriever

    def get_answer(self, question: str, 
                   number_of_results: Optional[int] = number_of_results_default
                   ) -> QAResponse:
        similar_docs = self._retriever.get_similar_documents(question, number_of_results)
        chain = load_qa_chain(self.llm, chain_type="stuff")
        answer = chain.run(input_documents=similar_docs, question=question)
        response = QAResponse(query=question, answer=answer, docs=similar_docs)
        return response