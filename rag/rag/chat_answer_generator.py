import os
from dotenv import load_dotenv
from typing import Optional
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import ChatOpenAI, OpenAI
from rag.retriever import Retriever
from support.responses.qa_response import QAResponse
from langchain_core.retrievers import RetrieverOutputLike

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain_core.runnables import Runnable
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

load_dotenv()

class ChatAnswerGenerator:
    llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    number_of_results_default = 4
    
    contextualize_q_system_prompt = os.getenv("SYSTEM_PROMPT_TO_CONTEXTUALIZE")
    contextualize_q_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    qa_system_prompt = os.getenv("SYSTEM_PROMPT_TO_QA") + "{context}"
    qa_prompt = ChatPromptTemplate.from_messages(
        [
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ]
    )

    question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
    store = {}
    
    @property
    def retriever(self) -> Retriever:
        return self._retriever
    
    @property
    def history_aware_retriever(self) -> RetrieverOutputLike:
        return self._history_aware_retriever
    
    @property
    def rag_chain_chat(self) -> Runnable:
        return self._rag_chain_chat
    
    @property
    def rag_chain_chat(self) -> Runnable:
        return self._rag_chain_chat
    
    @property
    def conversational_rag_chain(self) -> RunnableWithMessageHistory:
        return self._conversational_rag_chain

    def __init__(self, retriever: Retriever):
        self._retriever = retriever
        self._history_aware_retriever = create_history_aware_retriever(self.llm, 
                                                                       self._retriever.get_vector_store_retriever(), 
                                                                       self.contextualize_q_prompt)
        self._rag_chain_chat = create_retrieval_chain(self._history_aware_retriever, self.question_answer_chain)

        self._conversational_rag_chain = RunnableWithMessageHistory(
            self._rag_chain_chat,
            self._get_session_history,
            input_messages_key="input",
            history_messages_key="chat_history",
            output_messages_key="answer",
        )

    def _get_session_history(self, session_id: str) -> BaseChatMessageHistory:
        if session_id not in self.store:
            self.store[session_id] = ChatMessageHistory()
        return self.store[session_id]
    
    def get_answer(self, question: str, session_history: str,
                   number_of_results: Optional[int] = number_of_results_default
                   ) -> QAResponse:
        invoke_output = self._conversational_rag_chain.invoke({"input": question},config={"configurable": {"session_id": session_history}})
        response = QAResponse(query=question, answer=invoke_output["answer"], docs=invoke_output['context'])

        return response