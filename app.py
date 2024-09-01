from flask import Flask, jsonify, request, render_template
import requests
import os

app = Flask(__name__)

# Replace with your actual OpenWeatherMap API key
API_KEY = '32ef4f515d1b4385a41bc26b124fa6db'  # Sign up at https://openweathermap.org/ to get an API key

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City is required"}), 400

    # Call the OpenWeatherMap API
    url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&APPID={API_KEY}&units=metric"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    data = response.json()
    weather_info = {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "description": data["weather"][0]["description"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"]
    }
    return jsonify(weather_info)

if __name__ == '__main__':
    app.run(debug=True)