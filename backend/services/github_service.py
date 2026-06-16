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

def get_repo_metadata(owner, repo):
    url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}"

    res = requests.get(url, headers=HEADERS)

    if res.status_code != 200:
        return None

    data = res.json()

    return {
        "name": data["name"],
        "owner": data["owner"]["login"],
        "default_branch": data["default_branch"]
    }

def get_repo_tree(owner, repo, branch):
    url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}/git/trees/{branch}"

    params = {
        "recursive": "1"
    }

    res = requests.get(url, headers=HEADERS, params=params)

    if res.status_code != 200:
        return None

    return res.json().get("tree", [])

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

def get_file_content(owner, repo, path):
    url = f"{GITHUB_API_BASE_URL}/repos/{owner}/{repo}/contents/{path}"

    res = requests.get(url, headers=HEADERS)

    if res.status_code != 200:
        return None

    data = res.json()

    # skip folders
    if isinstance(data, list):
        return None

    if data.get("type") != "file":
        return None

    content = data.get("content")
    encoding = data.get("encoding")

    if encoding == "base64" and content:
        decoded = base64.b64decode(content).decode("utf-8", errors="ignore")
        return {
            "path": path,
            "content": decoded
        }

    return None