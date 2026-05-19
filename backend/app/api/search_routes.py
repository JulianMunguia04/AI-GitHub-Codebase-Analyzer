from flask import Blueprint, render_template, request
import requests

from dotenv import load_dotenv
import os

load_dotenv()

GITHUB_API_BASE_URL = os.getenv("GITHUB_API_BASE_URL")

search_routes = Blueprint("search_routes", __name__, )

@search_routes.route("/search")
def search():
    query = request.args.get("q")
    if not query:
        return {
            "error": "Missing query parameter"
        }, 400

    url = f"{GITHUB_API_BASE_URL}/search/repositories?q={query}"

    params = {
        "q": query
    }
    response = requests.get(url, params=params)

    data= response.json()
    
    repos = []
    
    for repo in data["items"]:
        repos.append({
            "name": repo["name"],
            "owner": repo["owner"]["login"],
            "stars": repo["stargazers_count"],
            "url": repo["html_url"],
            "language": repo["language"]
        })
    return repos