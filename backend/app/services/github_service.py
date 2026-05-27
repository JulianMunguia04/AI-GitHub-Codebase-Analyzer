import os
import base64
import requests

from dotenv import load_dotenv

load_dotenv()

GITHUB_API_BASE_URL = os.getenv("GITHUB_API_BASE_URL")
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

HEADERS = {
    "Accept": "application/vnd.github+json"
}

if GITHUB_TOKEN:
    HEADERS["Authorization"] = f"Bearer {GITHUB_TOKEN}"


IGNORED_DIRECTORIES = [
    "node_modules",
    "dist",
    "build",
    ".git",
    "__pycache__",
    ".next",
    "coverage",
    "vendor"
]

IGNORED_EXTENSIONS = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".lock",
    ".exe",
    ".dll",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".mp4",
    ".mp3",
    ".zip",
    ".tar",
    ".gz"
]


def search_repositories(query):
    url = f"{GITHUB_API_BASE_URL}/search/repositories"

    params = {
        "q": query,
        "sort": "stars",
        "per_page": 10
    }

    response = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    if response.status_code != 200:
        return {
            "error": "Failed to fetch repositories",
            "status_code": response.status_code
        }

    data = response.json()

    repositories = []

    for repo in data.get("items", []):
        repositories.append({
            "name": repo["name"],
            "owner": repo["owner"]["login"],
            "stars": repo["stargazers_count"],
            "url": repo["html_url"],
            "language": repo["language"],
            "description": repo["description"]
        })

    return repositories


def get_default_branch(owner, repo):
    url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}"

    response = requests.get(
        url,
        headers=HEADERS
    )

    if response.status_code != 200:
        return None

    data = response.json()

    return data["default_branch"]


def get_repository_tree(owner, repo):
    default_branch = get_default_branch(owner, repo)

    if not default_branch:
        return {
            "error": "Could not fetch default branch"
        }

    url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}/git/trees/{default_branch}"

    params = {
        "recursive": "1"
    }

    response = requests.get(
        url,
        headers=HEADERS,
        params=params
    )

    if response.status_code != 200:
        return {
            "error": "Failed to fetch repository tree",
            "status_code": response.status_code
        }

    data = response.json()

    return data.get("tree", [])


def is_relevant_file(file_path):
    path_parts = file_path.split("/")

    for directory in path_parts:
        if directory in IGNORED_DIRECTORIES:
            return False

    lower_path = file_path.lower()

    for extension in IGNORED_EXTENSIONS:
        if lower_path.endswith(extension):
            return False

    return True


def filter_repository_files(tree):
    filtered_files = []

    for item in tree:
        if item["type"] != "blob":
            continue

        file_path = item["path"]

        if not is_relevant_file(file_path):
            continue

        filtered_files.append({
            "path": file_path,
            "sha": item["sha"],
            "size": item.get("size", 0),
            "url": item["url"]
        })

    return filtered_files


def get_file_content(owner, repo, sha):
    url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}/git/blobs/{sha}"

    response = requests.get(
        url,
        headers=HEADERS
    )

    if response.status_code != 200:
        return None

    data = response.json()

    encoded_content = data.get("content")

    if not encoded_content:
        return None

    try:
        decoded_content = base64.b64decode(
            encoded_content
        ).decode("utf-8")

        return decoded_content

    except Exception:
        return None


def get_repository_contents(owner, repo):
    tree = get_repository_tree(owner, repo)

    if isinstance(tree, dict) and tree.get("error"):
        return tree

    filtered_files = filter_repository_files(tree)

    repository_files = []

    for file in filtered_files[:50]:
        content = get_file_content(
            owner,
            repo,
            file["sha"]
        )

        if not content:
            continue

        repository_files.append({
            "path": file["path"],
            "sha": file["sha"],
            "size": file["size"],
            "content": content
        })

    return repository_files