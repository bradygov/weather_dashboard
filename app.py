from flask import Flask, render_template, request
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather')
def weather():
    city = request.args.get('city')
    weather_data = fetch_weather_data(city)
    return weather_data

def fetch_weather_data(city):
    # Replace with your actual weather API call
    api_key = "YOUR_WEATHER_API_KEY"  # Replace with your actual weather API key
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        return {
            "city": data["name"],
            "weather": [{"main": data["weather"][0]["main"]}],
            "temperature": data["main"]["temp"],
            "description": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "wind_speed": data["wind"]["speed"]
        }
    else:
        return {"error": "City not found"}

if __name__ == '__main__':
    app.run(debug=True)