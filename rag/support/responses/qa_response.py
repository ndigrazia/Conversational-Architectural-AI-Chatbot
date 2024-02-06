from core.responses import Response
from langchain_core.documents.base import Document
from typing import List
import re

class QAResponse(Response):

    BASE_URL = "http://localhost:9090/app/static"

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
        str_references = "References: "
        for reference in self.references:
            str_references += "\n- " + reference
        return str_references

    def to_link_references(self) -> List[str]:
        link_references = []
        for reference in self.references:
            # Extract the string from the file path
            match = re.search(r'([^/]+)\.(md|pdf)$', reference)
            extracted_string = "Ups! Undefined file name."
            if match:
                extracted_string = match.group(1)
            link = f"[{extracted_string}]({self.BASE_URL}{reference})"
            link_references.append(link)
        return link_references