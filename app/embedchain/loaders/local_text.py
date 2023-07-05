class LocalTextLoader:
    def load_data(self, content):
        meta_data = {"url": "local", "text": ""}
        return [
            {
                "content": content,
                "meta_data": meta_data,
            }
        ]
