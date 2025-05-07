from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

# Initialize the Flask application
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS)

# Define the route for getting country data
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

        return jsonify(country_info)

    except requests.exceptions.RequestException as e:
        # Handle request errors such as network issues
        return jsonify({"error": f"Request failed: {str(e)}"}), 500

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)