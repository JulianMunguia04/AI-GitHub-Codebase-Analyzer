from flask import Flask, request

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

    return f"You searched for: {query}"

if __name__ == "__main__":
    app.run(debug=True)