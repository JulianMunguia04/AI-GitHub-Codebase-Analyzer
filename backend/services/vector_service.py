from backend.services.db_service import get_db
from backend.services.embedding_service import embed_text


def store_chunks(repo_name, chunks):
    conn = get_db()
    cur = conn.cursor()

    # Check whether embeddings already exist for this repo
    cur.execute("""
        SELECT EXISTS (
            SELECT 1
            FROM repo_chunks
            WHERE repo_name = %s
        );
    """, (repo_name,))

    already_embedded = cur.fetchone()[0]

    if already_embedded:
        cur.close()
        conn.close()
        return False

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
    return True

def search_chunks(repo_name, query_embedding, limit=5):
    conn = get_db()
    cur = conn.cursor()

    vector = "[" + ",".join(map(str, query_embedding)) + "]"

    cur.execute("""
        SELECT
            file_path,
            content
        FROM repo_chunks
        WHERE repo_name = %s
        ORDER BY embedding <-> %s::vector
        LIMIT %s;
    """, (
        repo_name,
        vector,
        limit
    ))

    rows = cur.fetchall()

    cur.close()
    return rows 