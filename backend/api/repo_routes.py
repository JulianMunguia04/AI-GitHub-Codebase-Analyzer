from flask import Blueprint, request, jsonify

from backend.services.github_service import get_repo_metadata, get_repo_tree, get_file_content
from backend.utils.tree_builder import build_tree
from backend.services.chunk_service import extract_chunks
from backend.services.vector_service import store_chunks, search_chunks
from backend.services.embedding_service import embed_text
from backend.services.chat_service import ask_repository

repo_routes = Blueprint("repo_routes", __name__)

ALLOWED_EXTENSIONS = {
    ".py", ".js", ".ts", ".html", ".css",
    ".java", ".go", ".cpp", ".c", ".md"
}

def is_code_file(filename):
    return any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)

@repo_routes.route("/repo/tree", methods=["GET"])
def get_repo_full_tree():
    #Hit end point: http://127.0.0.1:5000/repo/tree?owner=facebook&repo=react
    owner = request.args.get("owner")
    repo = request.args.get("repo")

    if not owner or not repo:
        return {"error": "Missing owner or repo"}, 400

    metadata = get_repo_metadata(owner, repo)

    if not metadata:
        return {"error": "Repo not found"}, 404

    tree = get_repo_tree(owner, repo, metadata["default_branch"])

    if tree is None:
        return {"error": "Failed to fetch tree"}, 500

    nested_tree = build_tree(tree)

    def inject_content(node, path=""):
        for name, value in list(node.items()):
            current_path = f"{path}/{name}" if path else name

            # file node
            if isinstance(value, dict) and value.get("type") == "blob":
                if is_code_file(name):
                    file_data = get_file_content(owner, repo, current_path)

                    if file_data:
                        node[name]["content"] = file_data["content"]

            # folder
            elif isinstance(value, dict):
                inject_content(value, current_path)

    inject_content(nested_tree)

    return jsonify({
        "repo": metadata["name"],
        "owner": metadata["owner"],
        "tree": nested_tree
    })

@repo_routes.route("/repo/file", methods=["GET"])
def get_file():
    owner = request.args.get("owner")
    repo = request.args.get("repo")
    path = request.args.get("path")

    from backend.services.github_service import get_file_content

    return get_file_content(owner, repo, path)

@repo_routes.route("/repo/chunks", methods=["GET"])
def get_repo_chunks():
    #Access this route /repo/chunks?owner=JulianMunguia04&repo=LadLadder
    owner = request.args.get("owner")
    repo = request.args.get("repo")

    if not owner or not repo:
        return {"error": "Missing owner or repo"}, 400

    metadata = get_repo_metadata(owner, repo)

    if not metadata:
        return {"error": "Repo not found"}, 404

    tree = get_repo_tree(owner, repo, metadata["default_branch"])

    if tree is None:
        return {"error": "Failed to fetch tree"}, 500

    nested_tree = build_tree(tree)

    # inject contents (your existing logic)
    def inject_content(node, path=""):
        for name, value in list(node.items()):
            current_path = f"{path}/{name}" if path else name

            if isinstance(value, dict) and value.get("type") == "blob":
                if is_code_file(name):
                    file_data = get_file_content(owner, repo, current_path)

                    if file_data:
                        node[name]["content"] = file_data["content"]

            elif isinstance(value, dict):
                inject_content(value, current_path)

    inject_content(nested_tree)

    chunks = extract_chunks(nested_tree)

    store_chunks(
        repo_name=metadata["name"],
        chunks=chunks
    )

    return jsonify({
        "repo": metadata["name"],
        "owner": metadata["owner"],
        "chunks_created": len(chunks),
        "message": "Repository successfully embedded and stored."
    })

@repo_routes.route("/repo/chat", methods=["POST"])
def ask_chat_repo():
    data = request.get_json()

    repo = data["repo"]
    question = data["question"]

    embedding = embed_text(question)

    chunks = search_chunks(
        repo,
        embedding
    )

    answer = ask_repository(
        question,
        chunks
    )

    return jsonify({
        "answer": answer
    })