from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

# Replace with your actual WeatherAPI key
API_KEY = "bd48514b4bb84b639f6164914240109"  # Sign up at https://www.weatherapi.com/ to get an API key

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def get_weather():
    city = request.args.get('city')
    if not city:
        return jsonify({"error": "City is required"}), 400

    # Call the WeatherAPI to fetch current weather and forecast
    url = f"https://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={city}&days=7&aqi=no&alerts=no"
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "City not found"}), 404

    data = response.json()
    current_day = data['forecast']['forecastday'][0]
    hourly_data = current_day['hour']
    weekly_forecast = data['forecast']['forecastday']

    weather_info = {
        "city": data["location"]["name"],
        "temperature": current_day["day"]["avgtemp_c"],
        "description": current_day["day"]["condition"]["text"],
        "humidity": current_day["day"]["avghumidity"],
        "wind_speed": current_day["day"]["maxwind_kph"],
        "hourly_data": hourly_data,
        "weekly_forecast": weekly_forecast
    }
    return jsonify(weather_info)

if __name__ == '__main__':
    app.run(debug=True)