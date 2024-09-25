import os
from dotenv import load_dotenv
from rag.answer_generator import AnswerGenerator
from rag.chat_answer_generator import ChatAnswerGenerator
from rag.retriever import Retriever
import streamlit as st
import streamlit_authenticator as stauth
from support.responses.qa_response import QAResponse
from support.vectorstore_connectors.chroma import ChromaConnector
from utils.ai import create_embeddings
#from langchain_openai import OpenAIEmbeddings
#from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings

import yaml
from yaml.loader import SafeLoader

with open(os.getenv("AUTH_FILENAME")) as file:
    config = yaml.load(file, Loader=SafeLoader)

authenticator = stauth.Authenticate(
    config['credentials'],
    config['cookie']['name'],
    config['cookie']['key'],
    config['cookie']['expiry_days'],
    config['pre-authorized']
)

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

#embeddings = OpenAIEmbeddings()
#embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
embeddings = create_embeddings()

index_collection_name = os.getenv("INDEX_COLLECTION_NAME")

number_of_results = int(os.getenv("NUMBER_OF_RESULTS"))
number_of_results_to_view = int(os.getenv("NUMBER_OF_RESULTS_TO_VIEW"))

vector_connector = ChromaConnector(embeddings, index_collection_name)
doc_search = vector_connector.get_client()

retriever = Retriever(doc_search)

answer_generator = ChatAnswerGenerator(retriever)

def get_session_id():
    from streamlit.runtime import get_instance
    from streamlit.runtime.scriptrunner import get_script_run_ctx
    runtime = get_instance()
    session_id = get_script_run_ctx().session_id
    session_info = runtime._session_mgr.get_session_info(session_id)
    if session_info is None:
        raise RuntimeError("Couldn't get your Streamlit Session object.")
    return session_info.session.id

session_id = get_session_id()

if not st.session_state["authentication_status"]:
    authenticator.login(fields={'Form name':'Iniciar sesión', 'Username':'Usuario', 
                            'Password':'Contraseña', 'Login':'Login'})

def chat_view():
    authenticator.logout(button_name='Cerrar sesión', location='sidebar')
    if st.session_state["authentication_status"] is not None:
        st.write(f'Bienvenido *{st.session_state["name"]}*')
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

        if prompt := st.chat_input("¿Cuál es tu pregunta?"):
            st.session_state.messages.append({"role": "user", "content": prompt})
            with st.chat_message("user"):
                st.markdown(prompt)
            with st.chat_message("assistant"):
                message_placeholder = st.empty()
                message_placeholder.markdown("...")
                response = answer_generator.get_answer(prompt, session_id)
                obj = {
                    "answer": response.answer,
                    "link_reference": response.to_link_references()
                }
                message_placeholder.empty()
                show_resume(obj)
            st.session_state.messages.append({"role": "assistant", "content": obj})

if st.session_state["authentication_status"]:
    chat_view()
elif st.session_state["authentication_status"] is False:
    st.error('Usuario/contraseña incorrecto.')
elif st.session_state["authentication_status"] is None:
    st.warning('Por favor, ingrese su usuario y contraseña.')