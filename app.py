from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import requests
import bcrypt
import sqlite3
import os

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# SQLite Database Setup
def get_db():
    conn = sqlite3.connect('users.db')
    return conn

# Create the users table if it doesn't exist
def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY,
                        username TEXT UNIQUE,
                        password TEXT)''')
    conn.commit()
    conn.close()

# Initialize the database
init_db()

# Serve the frontend HTML pages
@app.route('/')
def serve_frontend():
    return send_from_directory(os.getcwd(), 'frontend.html')

@app.route('/login')
def serve_login():
    return send_from_directory(os.getcwd(), 'login.html')

# Define the route for getting country data (rendering HTML page with data)
@app.route('/countries', methods=['GET'])
def get_country_data():
    url = 'https://restcountries.com/v3.1/all'  # Endpoint for all countries
    try:
        response = requests.get(url)

        # Check if the response status code is OK
        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch data from RestCountries API", "status_code": response.status_code}), 500
        
        countries = response.json()
        country_info = []

        # Extract the necessary information for each country
        for country in countries:
            country_info.append({
                "name": country["name"]["common"],
                "currency": list(country["currencies"].keys())[0] if "currencies" in country else "N/A",
                "capital": country.get("capital", ["N/A"])[0],
                "languages": list(country["languages"].values()) if "languages" in country else ["N/A"],
                "flag": country["flags"]["png"]
            })

        # Render the HTML page with the country data
        return render_template('countries.html', countries=country_info)

    except requests.exceptions.RequestException as e:
        # Handle request errors such as network issues
        return jsonify({"error": f"Request failed: {str(e)}"}), 500

# User Registration
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    password = data['password'].encode('utf-8')  # Ensure password is in byte format
    
    # Hash the password
    hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (username, password) VALUES (?, ?)', (username, hashed_pw))
        conn.commit()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 400

# User Login
@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password'].encode('utf-8')  # The password from the request is still a string

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE username = ?', (username,))
    user = cursor.fetchone()
    conn.close()

    if user and bcrypt.checkpw(password, user[2]):  # No need to encode user[2] since it's already bytes
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
