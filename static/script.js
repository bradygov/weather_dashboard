document.getElementById('getWeather').addEventListener('click', function() {
    const city = document.getElementById('city').value;
    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    getWeatherData(city); // Call the function to fetch weather data
});

// Function to fetch weather data
function getWeatherData(city) {
    // Show loading message
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = '<p>Loading...</p>';
    weatherResult.style.display = 'block'; // Show the container

    // Store the searched city in local storage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }

    fetch(`/weather?city=${city}`)
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
            return response.json();
        })
        .then(data => {
            // Display current weather
            weatherResult.innerHTML = `
                <h2>Weather in ${data.city}</h2>
                <p>Temperature: ${data.temperature} °C</p>
                <p>Description: ${data.description}</p>
                <p>Humidity: ${data.humidity}%</p>
                <p>Wind Speed: ${data.wind_speed} km/h</p>
            `;

            // Display hourly forecast
            const hourlyForecast = data.hourly_data; // Assuming you have this in your response
            const hourlyHtml = document.createElement('div');
            hourlyHtml.innerHTML = '<h3>Hourly Forecast</h3>';
            hourlyForecast.forEach(hour => {
                hourlyHtml.innerHTML += `
                    <p>${hour.time}: ${hour.condition.text}, ${hour.temp_c} °C</p>
                `;
            });
            weatherResult.appendChild(hourlyHtml);

            // Display weekly forecast
            const weeklyForecast = data.weekly_forecast; // Assuming you have this in your response
            const weeklyHtml = document.createElement('div');
            weeklyHtml.innerHTML = '<h3>Weekly Forecast</h3>';
            weeklyForecast.forEach(day => {
                weeklyHtml.innerHTML += `
                    <p>${day.date}: ${day.day.condition.text}, Max: ${day.day.maxtemp_c} °C, Min: ${day.day.mintemp_c} °C</p>
                `;
            });
            weatherResult.appendChild(weeklyHtml);

            displaySearchHistory(); // Call to display the search history
        })
        .catch(error => {
            weatherResult.innerHTML = `<p>Error: ${error.message}. Please try again.</p>`;
        });
}

// Function to display search history
function displaySearchHistory() {
    const historyContainer = document.getElementById('searchHistory');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    historyContainer.innerHTML = '<h3>Search History</h3>'; // Keep the heading
    searchHistory.forEach(city => {
        const historyItem = document.createElement('div');
        historyItem.textContent = city;
        historyItem.classList.add('history-item');
        historyItem.onclick = () => {
            document.getElementById('city').value = city; // Populate the input with the clicked city
            getWeatherData(city); // Fetch weather data for the clicked city
        };
        historyContainer.appendChild(historyItem);
    });
}

// Call displaySearchHistory on page load
document.addEventListener('DOMContentLoaded', displaySearchHistory);