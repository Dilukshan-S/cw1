import os
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

import sqlite3
from dotenv import load_dotenv
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token,
    jwt_required, get_jwt_identity
)
import bcrypt
import requests

# Load .env 
load_dotenv()  # looks for backend/.env

# Flask App Setup 
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')
CORS(app)
jwt = JWTManager(app)

# Database Helpers
DATABASE_PATH = os.getenv('DATABASE_URL', 'users.db')

def get_db():
    """Reuse connection per request."""
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        # Return rows as tuples by default; you can customize if needed
    return g.db

@app.teardown_appcontext
def close_db(exc):
    """Close DB at end of request."""
    db = g.pop('db', None)
    if db is not None:
        db.close()

def init_db():
    """Create table if it doesn't exist."""
    db = get_db()
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT    UNIQUE NOT NULL,
            password BLOB    NOT NULL
        )
        """
    )
    db.commit()

@app.before_first_request
def init_db_if_needed():
    init_db()

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    if not username or not password:
        return jsonify(msg="Username and password required"), 400

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    try:
        db = get_db()
        db.execute(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            (username, pw_hash)
        )
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify(msg="Username already exists"), 400

    return jsonify(msg="User registered"), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '')

    db = get_db()
    row = db.execute(
        "SELECT password FROM users WHERE username = ?",
        (username,)
    ).fetchone()

    if row and bcrypt.checkpw(password.encode(), row[0]):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200

    return jsonify(msg="Bad credentials"), 401

@app.route('/countries', methods=['GET'])
@jwt_required()
def countries():
    resp = requests.get('https://restcountries.com/v3.1/all', timeout=10)
    resp.raise_for_status()
    items = []
    for c in resp.json():
        items.append({
            "name":       c.get("name", {}).get("common", ""),
            "capital":    (c.get("capital") or [""])[0],
            "currency":   ",".join(c.get("currencies", {}).keys()),
            "languages":  list(c.get("languages", {}).values()),
            "flag":       c.get("flags", {}).get("png", "")
        })
    return jsonify(items), 200

# Entry Point
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
