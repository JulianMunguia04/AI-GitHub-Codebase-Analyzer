from flask import Flask, request
import requests

from dotenv import load_dotenv
import os

from backend.api.search_routes import search_routes
from backend.api.repo_routes import repo_routes

load_dotenv()

GITHUB_API_BASE_URL = os.getenv("GITHUB_API_BASE_URL")

app = Flask(__name__)

@app.route("/")
def home():
    return "Flask is working!"

@app.route("/health")
def health_check():
    return {"status": 200}

app.register_blueprint(search_routes)
app.register_blueprint(repo_routes)

if __name__ == "__main__":
    app.run(debug=True)