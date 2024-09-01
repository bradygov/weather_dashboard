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
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            weatherResult.innerHTML = `
                <h2>Weather in ${data.city}</h2>
                <img src="https://example.com/weather-icon.png" alt="Weather Icon" class="weather-icon"> <!-- Replace with your weather icon URL -->
                <p>Temperature: ${Math.round(data.temperature)} °C</p> <!-- Rounded temperature -->
                <p>Description: ${data.description}</p>
                <p>Humidity: ${data.humidity}%</p>
                <p>Wind Speed: ${data.wind_speed} m/s</p>
            `;
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