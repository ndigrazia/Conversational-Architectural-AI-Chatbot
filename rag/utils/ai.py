import os

from langchain_openai import OpenAIEmbeddings
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_community.llms import HuggingFaceHub
from langchain_openai import OpenAI

def create_embeddings():
    if is_open_source():
        return SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    else:
        return OpenAIEmbeddings()
        
def create_llm():
    if is_open_source():
        return HuggingFaceHub(repo_id="bigscience/bloom", model_kwargs={"temperature":1e-10,
            "max_new_tokens":200, "repetition_penalty":2.0})
    else:
        return OpenAI(temperature=0)

def is_open_source():
    value_from_env = os.getenv("IS_OPEN_SOURCE", default=None)
    return value_from_env is not None and value_from_env.lower() == "true"