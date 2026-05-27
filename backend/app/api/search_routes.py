from flask import Blueprint, request
from services.github_service import search_repositories

search_routes = Blueprint("search_routes", __name__)

@search_routes.route("/search")
def search():
    query = request.args.get("q")

    if not query:
        return {"error": "Missing query parameter"}, 400

    repos = search_repositories(query)

    return repos