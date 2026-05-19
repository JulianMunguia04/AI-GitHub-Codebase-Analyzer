from flask import Blueprint, request, jsonify
import requests
from dotenv import load_dotenv
import os

load_dotenv()

GITHUB_API_BASE_URL = os.getenv("GITHUB_API_BASE_URL")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

analyze = Blueprint("analyze", __name__)

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}

# Ignore useless directories
IGNORE_DIRS = {
    "node_modules",
    ".git",
    "dist",
    "build",
    "__pycache__",
    ".next",
    "coverage"
}

# Keep only useful code files
RELEVANT_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".java",
    ".go",
    ".rs",
    ".cpp",
    ".c",
    ".md"
}


def is_relevant_file(path):

    parts = path.split("/")

    # ignore junk directories
    for part in parts:
        if part in IGNORE_DIRS:
            return False

    # check extension
    ext = os.path.splitext(path)[1].lower()

    return ext in RELEVANT_EXTENSIONS


@analyze.route("/analyze", methods=["POST"])
def analyze_github_repo():

    # JSON input
    data = request.get_json()

    owner = data.get("owner")
    repo = data.get("repo")

    if not owner or not repo:
        return jsonify({
            "error": "owner and repo are required"
        }), 400

    # STEP 1 — fetch repo details
    repo_url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}"

    repo_response = requests.get(repo_url, headers=HEADERS)

    if repo_response.status_code != 200:
        return jsonify({
            "error": "repository not found"
        }), 404

    repo_data = repo_response.json()

    # get default branch automatically
    default_branch = repo_data["default_branch"]

    # STEP 2 — fetch recursive repo tree
    tree_url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}/git/trees/{default_branch}?recursive=1"

    tree_response = requests.get(tree_url, headers=HEADERS)

    if tree_response.status_code != 200:
        return jsonify({
            "error": "failed to fetch repository tree"
        }), 500

    tree_data = tree_response.json()

    files = []

    # STEP 3 — filter files
    for item in tree_data.get("tree", []):

        # only files
        if item["type"] != "blob":
            continue

        path = item["path"]

        if is_relevant_file(path):

            ext = os.path.splitext(path)[1]

            files.append({
                "path": path,
                "extension": ext,
                "size": item.get("size", 0),
                "sha": item.get("sha"),
                "url": item.get("url")
            })

    # STEP 4 — metadata summary
    response = {
        "repository": repo,
        "owner": owner,
        "default_branch": default_branch,
        "total_files": len(tree_data.get("tree", [])),
        "relevant_files": len(files),
        "files": files[:100]  # limit response
    }

    return jsonify(response)