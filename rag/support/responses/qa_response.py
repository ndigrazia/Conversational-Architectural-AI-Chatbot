from core.responses import Response
from langchain_core.documents.base import Document
from typing import List

class QAResponse(Response):
    @property
    def query(self) -> List[str]:
        return self._query
    
    @property
    def references(self) -> List[str]:
        return self._references

    def __init__(self, query: str, answer: str, docs: List[Document]):
        super().__init__(answer, docs)
        self._query = query
        self._references = self._extract_references()

    def _extract_references(self) -> List[str]:
        references_set = set()    
        for doc in self._docs:
            references_set.add(doc.metadata.get("source"))
        return list(references_set)
    
    def to_printable_references(self) -> str:
        str_references = "Referencias: "
        for reference in self.references:
            str_references += "\n- " + reference
        return str_references