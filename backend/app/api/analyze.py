from flask import Blueprint, request

from services.github_service import get_repository_contents

analyze = Blueprint("analyze", __name__)

@analyze.route("/analyze", methods=["POST"])
def analyze_repository():
    data = request.json

    owner = data.get("owner")
    repo = data.get("repo")

    if not owner or not repo:
        return {
            "error": "Missing owner or repo"
        }, 400

    repository_contents = get_repository_contents(
        owner,
        repo
    )

    return repository_contents