import os
from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, UnstructuredMarkdownLoader
from langchain_core.documents.base import Document
from langchain_core.vectorstores import VectorStore
from langchain_openai import OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from support.vectorstore_connectors.chroma import ChromaConnector
from typing import Iterable, List, Optional

load_dotenv()

print("----------------ENV---------------------")

for key, value in os.environ.items():
    print(f"{key}={value}")

print("----------------ENV---------------------")

embeddings = OpenAIEmbeddings()
index_collection_name = os.getenv("INDEX_COLLECTION_NAME")
adrs_path = os.getenv("ADRS_PATH")

chunk_size_default = 1000
chunk_overlap_default = 200
add_start_index_default = True

# Indexing: Load
def load_documents(path: str) -> List[Document]:
    loader = DirectoryLoader(path, glob="**/*.md", loader_cls=UnstructuredMarkdownLoader)
    return loader.load()

# Indexing: Split
def split_documents(documents: Iterable[Document], 
                    chunk_size: Optional[int] = chunk_size_default,
                    chunk_overlap: Optional[int] = chunk_overlap_default,
                    add_start_index: Optional[bool] = add_start_index_default) -> List[Document]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap, add_start_index=add_start_index
    )
    return text_splitter.split_documents(documents)

# Indexing: Store
def store_embed_documents(client_store:VectorStore, documents: Iterable[Document]):
    client_store.add_documents(documents)

# Main
def main():
    print("Cargando datos...")
    docs = load_documents(adrs_path)
    print(f"{len(docs)} documentos obtenidos.")

    print("Generando splits...")
    all_splits = split_documents(docs)
    print(f"{len(all_splits)} splits generados.")

    print("Generando vectores y guardando...")
    vector_connector = ChromaConnector(embeddings, index_collection_name)
    client_store = vector_connector.getClient()
    store_embed_documents(client_store, all_splits)
    print("Documentos vectoriales guardados.")

main()