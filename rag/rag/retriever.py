from langchain_core.documents.base import Document
from langchain_core.vectorstores import VectorStore
from typing import List

class Retriever:
    @property
    def vector_store(self) -> VectorStore:
        return self._vector_store

    def __init__(self, vector_store: VectorStore):
        self._vector_store = vector_store        

    def get_similar_documents(self, query: str,
                            number_of_results: int
                            ) -> List[Document]:    
        similar_docs = self._vector_store.similarity_search(query, k=number_of_results)
        return similar_docs