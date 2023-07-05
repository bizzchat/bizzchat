import pinecone
import os
import chromadb

from embedchain.vectordb.base_vector_db import BaseVectorDB




class PineconeDB(BaseVectorDB):
    def __init__(self, db_dir=None):
        if db_dir is None:
            db_dir = "db"
        self.client_settings = chromadb.config.Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=db_dir,
            anonymized_telemetry=False
        )
        super().__init__()

    def _get_or_create_db(self):
        return pinecone.init(api_key="ec394e05-d39a-40a4-8eb7-f639e90d1d6b",environment="asia-southeast1-gcp-free")

    def _get_or_create_collection(self):
        return pinecone.Index("bizzchat")