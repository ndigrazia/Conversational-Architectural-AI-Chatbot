import os

from langchain_openai import OpenAIEmbeddings
from langchain.embeddings.sentence_transformer import SentenceTransformerEmbeddings
from langchain_community.llms import HuggingFaceHub
from langchain_openai import OpenAI
from langchain_openai import AzureChatOpenAI

def create_embeddings():
    if is_open_source():
        return SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
    else:
        return OpenAIEmbeddings()
        
def create_llm():
    if is_open_source():
        #return HuggingFaceHub(
        #        repo_id="bigscience/bloom", 
        #        #repo_id="sambanovasystems/BLOOMChat-176B-v2", 
        #        model_kwargs={"temperature":1e-10
        #        ,"max_new_tokens":200, "repetition_penalty":2.0
		#})

        # debe definirse AZURE_OPENAI_ENDPOINT (https://YOUR-ENDPOINT.openai.azure.com/)
        # debe definirse AZURE_OPENAI_API_KEY
        azure_deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")
        azure_version = os.getenv("AZURE_OPENAI_VERSION")
        return AzureChatOpenAI(
                azure_deployment=azure_deployment,  # or your deployment
                api_version=azure_version,  # or your api version
                temperature=0,
                max_tokens=None,
                timeout=None,
                max_retries=1)
    else:
        return OpenAI(temperature=0)

def is_open_source():
    value_from_env = os.getenv("IS_OPEN_SOURCE", default=None)
    return value_from_env is not None and value_from_env.lower() == "true"
