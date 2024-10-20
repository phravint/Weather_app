// Assuming you fetch the weather data on button click
document.querySelector('button').addEventListener('click', function() {
    const city = document.querySelector('input').value;

    if (city) {
        // Show the weather summary after the city is entered and data is available
        document.getElementById('weather-summary').style.display = 'block';

        // Fetch the weather data (implement your API logic here)
        // Update the weather summary content dynamically
    }
});


document.getElementById('search-btn').addEventListener('click', function() {
    let cityName = document.getElementById('city-input').value;
    const apiKey = 'b1b15e88fa797225412429c1c50c122a1'; // Replace with your API key
    const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
    const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`;

    // Fetch current weather data
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            document.querySelector('.weather-info').style.display = 'block';
            document.getElementById('city-name').textContent = data.name;

            // Update temperature
            document.getElementById('temperature').textContent = `${data.main.temp}°C`;
            document.getElementById('temp-icon').src = 'https://img.icons8.com/ios-filled/50/ffffff/temperature.png';

            // Update weather
            document.getElementById('weather').textContent = data.weather[0].description;
            document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            // Update humidity
            document.getElementById('humidity').textContent = `${data.main.humidity}%`;
            document.getElementById('humidity-icon').src = 'https://img.icons8.com/ios-filled/50/ffffff/humidity.png';

            // Update wind speed
            document.getElementById('wind').textContent = `${data.wind.speed} m/s`;
            document.getElementById('wind-icon').src = 'https://img.icons8.com/ios-filled/50/ffffff/wind.png';

            // Change background color based on weather
            changeBackground(data.weather[0].main.toLowerCase());

            // Display weather summary
            document.getElementById('avg-temp').textContent = `Average Temp: ${(data.main.temp_min + data.main.temp_max) / 2}°C`;
            document.getElementById('max-temp').textContent = `Max Temp: ${data.main.temp_max}°C`;
            document.getElementById('min-temp').textContent = `Min Temp: ${data.main.temp_min}°C`;
            document.getElementById('dominant-weather').textContent = `Dominant Weather: ${data.weather[0].main}`;
            document.getElementById('reason').textContent = `Reason: ${getWeatherReason(data.weather[0].main)}`;

            // Check for temperature alert
            if (data.main.temp > 35) {
                console.log('Alert: Temperature exceeds 35°C');
            }
        })
        .catch(error => alert('City not found'));

    // Fetch 5-day forecast
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            const fiveDayDiv = document.getElementById('five-day');
            fiveDayDiv.innerHTML = '';
            const uniqueDays = [...new Set(data.list.map(item => item.dt_txt.split(' ')[0]))];
            uniqueDays.forEach(day => {
                const dayData = data.list.find(item => item.dt_txt.startsWith(day));
                if (dayData) {
                    const forecastDay = document.createElement('div');
                    forecastDay.classList.add('forecast-day');
                    forecastDay.innerHTML = `
                        <img src="https://openweathermap.org/img/wn/${dayData.weather[0].icon}@2x.png" alt="Weather Icon">
                        <p>${dayData.main.temp}°C</p>
                        <p>${dayData.weather[0].description}</p>
                    `;
                    fiveDayDiv.appendChild(forecastDay);
                }
            });
        });

    // Fetch hourly forecast
    fetch(forecastURL)
        .then(response => response.json())
        .then(data => {
            const hourlyDiv = document.getElementById('hourly');
            hourlyDiv.innerHTML = '';
            data.list.forEach(item => {
                const dateTime = item.dt_txt.split(' '); // Split into date and time
                const date = dateTime[0]; // Extract date
                const time = dateTime[1].slice(0, 5); // Extract time (HH:MM)

                // Displaying hourly data for specific times
                if (time === "15:00") { // Example: Displaying forecast for 3 PM
                    const hourlyItem = document.createElement('div');
                    hourlyItem.classList.add('hourly-item');
                    hourlyItem.innerHTML = `
                        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="Weather Icon">
                        <p>${date} ${time}</p>  <!-- Display Date and Time -->
                        <p>${item.main.temp}°C</p>
                    `;
                    hourlyDiv.appendChild(hourlyItem);
                }
            });
        })
        .catch(error => console.error('Error fetching forecast:', error));
});

// Function to change background color based on weather
function changeBackground(weather) {
    const body = document.body;
    switch (weather) {
        case 'clear':
            body.style.background = 'linear-gradient(to bottom, #00c6ff, #0072ff)';
            break;
        case 'clouds':
            body.style.background = 'linear-gradient(to bottom, #b0c4de, #4682b4)';
            break;
        case 'rain':
        case 'drizzle':
            body.style.background = 'linear-gradient(to bottom, #1e3c72, #2a5298)';
            break;
        case 'snow':
            body.style.background = 'linear-gradient(to bottom, #e0eafc, #cfdef3)';
            break;
        case 'thunderstorm':
            body.style.background = 'linear-gradient(to bottom, #4a4e69, #22223b)';
            break;
        default:
            body.style.background = '#222'; // Fallback color
    }
}

// Function to provide a reason for the dominant weather
function getWeatherReason(weather) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return 'Clear skies due to high atmospheric pressure.';
        case 'clouds':
            return 'Cloudy weather due to low atmospheric pressure.';
        case 'rain':
        case 'drizzle':
            return 'Rainy conditions caused by moisture in the atmosphere.';
        case 'snow':
            return 'Snowfall due to freezing temperatures.';
        case 'thunderstorm':
            return 'Thunderstorms occur due to unstable atmospheric conditions.';
        default:
            return 'Weather conditions are normal.';
    }
}
