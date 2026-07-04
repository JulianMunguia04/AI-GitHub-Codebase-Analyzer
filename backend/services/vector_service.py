from backend.services.db_service import get_db
from backend.services.embedding_service import embed_text


def store_chunks(repo_name, chunks):
    conn = get_db()
    cur = conn.cursor()

    for chunk in chunks:
        embedding = embed_text(chunk["content"])

        cur.execute("""
            INSERT INTO repo_chunks (repo_name, file_path, content, embedding)
            VALUES (%s, %s, %s, %s)
        """, (
            repo_name,
            chunk["path"],
            chunk["content"],
            embedding
        ))

    conn.commit()
    cur.close()