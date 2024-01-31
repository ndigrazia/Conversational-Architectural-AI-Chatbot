from typing import List
from langchain_core.documents.base import Document

class Response:
    @property
    def answer(self) -> str:
        return self._answer
    
    @property
    def docs(self) -> List[Document]:
        return self._docs

    def __init__(self, answer: str, docs: List[Document]):
        self._answer = answer
        self._docs = docs