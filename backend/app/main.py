from flask import Flask, request
import requests

from dotenv import load_dotenv
import os

load_dotenv()

GITHUB_API_BASE_URL = os.getenv("GITHUB_API_BASE_URL")

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask is working!"

@app.route("/health")
def health_check():
    return {"status": 200}

@app.route("/search")
def search():
    query = request.args.get("q")

    url = f"{GITHUB_API_BASE_URL}/search/repositories?q={query}"

    response = requests.get(url)

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

if __name__ == "__main__":
    app.run(debug=True)