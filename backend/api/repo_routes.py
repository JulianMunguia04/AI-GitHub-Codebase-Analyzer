from flask import Blueprint, request, jsonify

from backend.services.github_service import get_repo_metadata, get_repo_tree
from backend.utils.tree_builder import build_tree

repo_routes = Blueprint("repo_routes", __name__)


@repo_routes.route("/repo/tree", methods=["GET"])
def get_repo_full_tree():
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

    return jsonify({
        "repo": metadata["name"],
        "owner": metadata["owner"],
        "tree": nested_tree
    })