document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value; // Get the city input
    if (!city) {
        alert("Please enter a city name."); // Alert if no city is entered
        return;
    }
    fetch(`/weather?city=${city}`) // Make a request to the weather endpoint
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            const weatherResult = document.getElementById('weatherResult');
            weatherResult.innerHTML = `
                <h2>Weather in ${data.city}</h2>
                <p>Temperature: ${data.temperature} °C</p>
                <p>Description: ${data.description}</p>
                <p>Humidity: ${data.humidity}%</p>
                <p>Wind Speed: ${data.wind_speed} m/s</p>
            `;
        })
        .catch(error => {
            document.getElementById('weatherResult').innerHTML = `<p>${error.message}</p>`;
        });
});