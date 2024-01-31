import chromadb
import os
from dotenv import load_dotenv
from core.vectorstore_connectors import VectorStoreConnector
from langchain.vectorstores.chroma import Chroma

load_dotenv()

class ChromaConnector(VectorStoreConnector):
    @property
    def http_client(self):
        return self._http_client

    def __init__(self, embeddings, index_collection_name):
        super().__init__(embeddings, index_collection_name)
        self._http_client = chromadb.HttpClient(host=os.getenv("CHROMA_HOST"), port=os.getenv("CHROMA_PORT"))
        
    def get_client(self):
        doc_search = (Chroma(collection_name=self.index_collection_name, 
                             client=self._http_client, embedding_function=self.embeddings))
        return doc_search