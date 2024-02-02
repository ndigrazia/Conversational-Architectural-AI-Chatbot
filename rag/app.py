import os
from dotenv import load_dotenv
from rag.answer_generator import AnswerGenerator
from rag.retriever import Retriever
import streamlit as st
from support.responses.qa_response import QAResponse
from support.vectorstore_connectors.chroma import ChromaConnector
from langchain_openai import OpenAIEmbeddings

load_dotenv()

print("----------------ENV---------------------")

for key, value in os.environ.items():
    print(f"{key}={value}")

print("----------------ENV---------------------")

def show_resume(obj):
    st.markdown(obj["answer"])
    st.markdown("References:")
    for link in obj["link_reference"]:
        st.markdown(link, unsafe_allow_html=True)

embeddings = OpenAIEmbeddings()
index_collection_name = os.getenv("INDEX_COLLECTION_NAME")

vector_connector = ChromaConnector(embeddings, index_collection_name)
doc_search = vector_connector.get_client()

retriever = Retriever(doc_search)
answer_generator = AnswerGenerator(retriever)

st.title('🤖 Conversational Architectural AI Chatbot')

if 'messages' not in st.session_state:
    st.session_state['messages'] = []

for message in st.session_state.messages:
    if message["role"] == "user":
        with st.chat_message(message["role"]):
             st.markdown(message["content"])
    if message["role"] == "assistant":
        with st.chat_message(message["role"]):
             obj = message["content"]
             show_resume(obj)

if prompt := st.chat_input("Go ahead, hit me with your question. What's on your mind?"):
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)
    with st.chat_message("assistant"):
        response = answer_generator.get_answer(prompt)
        obj = {
            "answer": response.answer,
            "link_reference": response.to_link_references()
        }
        show_resume(obj)
    st.session_state.messages.append({"role": "assistant", "content": obj})

