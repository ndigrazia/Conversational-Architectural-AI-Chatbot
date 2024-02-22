from dotenv import load_dotenv
from typing import Optional
from langchain.chains.question_answering import load_qa_chain
#from langchain_openai import OpenAI
from rag.retriever import Retriever
from support.responses.qa_response import QAResponse
#from langchain import HuggingFaceHub
from utils.ai import create_llm

load_dotenv()

class AnswerGenerator:

    NUMBER_OF_RESULTS_DEFAULT = 4
    NUMBER_OF_RESULTS_TO_VIEW_DEFAULT = 20

    #llm = OpenAI(temperature=0)
    #llm=HuggingFaceHub(repo_id="bigscience/bloom", model_kwargs={"temperature":1e-10})
    llm=create_llm()

    @property
    def retriever(self) -> Retriever:
        return self._retriever

    def __init__(self, retriever: Retriever):
        self._retriever = retriever
   
    def get_answer(self, question: str, 
                   number_of_results: Optional[int] = NUMBER_OF_RESULTS_DEFAULT
                   number_of_results_to_view: Optional[int] = NUMBER_OF_RESULTS_TO_VIEW_DEFAULT
                   ) -> QAResponse:
        similar_docs = self._retriever.get_similar_documents(question, number_of_results_to_view)
        chain = load_qa_chain(self.llm, chain_type="stuff")
        answer = chain.run(input_documents=similar_docs[:number_of_results], question=question)
        response = QAResponse(query=question, answer=answer, docs=similar_docs)
        return response