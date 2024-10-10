import os
from dotenv import load_dotenv
import streamlit as st
import streamlit_authenticator as stauth

import httpx
import asyncio
import requests
import json

from typing import List
import yaml
from yaml.loader import SafeLoader

class Struct:
    def __init__(self, **entries):
        self.__dict__.update(entries)

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

rag_api_endpoint = os.getenv("RAG_API_ENDPOINT")

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
        
class Response():
    answer: str
    link_references: List[str] = []

def get_answer(question: str, session_id: str, user: str) -> Response:

    request={
        "question": question,
        "session_id": session_id
    }
    print("user: " + user)
    print("request: ")
    print(request)
    response_obj = requests.post(rag_api_endpoint, json=request)
    print("response status: ")
    print(response_obj.status_code)
    response = response_obj.json()
    print("response: ")
    print(response)
    return Struct(**response)


def chat_view():
    authenticator.logout(button_name='Cerrar sesión', location='sidebar')
    if st.session_state["authentication_status"] is not None:
        user=st.session_state["name"]
        st.write(f'Bienvenido *{user}*')
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
                response = get_answer(prompt, session_id, user)
                obj = {
                    "answer": response.answer,
                    "link_reference": response.link_references
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


