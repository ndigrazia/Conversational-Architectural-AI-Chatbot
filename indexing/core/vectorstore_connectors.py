from abc import ABC, abstractmethod
from langchain_core.vectorstores import VectorStore

class VectorStoreConnector(ABC):

    @property
    def embeddings(self):
        return self._embeddings
    
    @property
    def index_collection_name(self):
        return self._index_collection_name

    def __init__(self, embeddings, index_collection_name):
        self._embeddings = embeddings
        self._index_collection_name = index_collection_name

    @abstractmethod
    def getClient(self) -> VectorStore:
        pass