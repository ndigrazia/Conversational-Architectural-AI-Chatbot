import os
from dotenv import load_dotenv
from rag.answer_generator import AnswerGenerator
from rag.retriever import Retriever
import streamlit as st
from support.responses.qa_response import QAResponse
from support.vectorstore_connectors.chroma import ChromaConnector
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings()
index_collection_name = os.getenv("INDEX_COLLECTION_NAME")

vector_connector = ChromaConnector(embeddings, index_collection_name)
doc_search = vector_connector.get_client()

retriever = Retriever(doc_search)
answer_generator = AnswerGenerator(retriever)

st.title('🤖 Chatbot Arquitectura Hispam')

if "messages" not in st.session_state:
    st.session_state.messages = []

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("Ingresa tu consulta..."):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    with st.chat_message("assistant"):
        message_placeholder = st.empty()
        response = answer_generator.get_answer(prompt)
        full_response = response.answer + "\n\n" + response.to_printable_references()
        message_placeholder.markdown(full_response)
    st.session_state.messages.append({"role": "assistant", "content": full_response})