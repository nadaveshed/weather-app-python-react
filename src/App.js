import React, { useState, useEffect } from 'react';
import Map from './components/Map';

const App = () => {
    // State to hold the list of cities for weather information.
    const [cities, setCities] = useState([]);

    // Fetches weather cities data from the server.
    const fetchWeatherSites = async () => {
        try {
            const response = await fetch('http://localhost:8000/weather-sites');
            const data = await response.json();
            setCities(data);
        } catch (error) {
            console.error('Error fetching weather sites:', error);
        }
    };

    // useEffect hook to fetch weather sites data when the component mounts.
    useEffect(() => {
        fetchWeatherSites();
    }, []);

    // Handles the refresh button click, triggering a request to refresh weather data.
    const handleRefresh = async () => {
        try {
            const response = await fetch('http://localhost:8000/refresh-weather', {
                method: 'POST',
            });
            const data = await response.json();
            console.log(data.message);
            fetchWeatherSites();
        } catch (error) {
            console.error('Error refreshing weather:', error);
        }
    };

    // Handles the form submission for adding a new weather site.
    const handleAddSite = async (e) => {
        e.preventDefault();

        const cityName = e.target.cityName.value;
        const cityLat = parseFloat(e.target.cityLat.value);
        const cityLon = parseFloat(e.target.cityLon.value);

        const newCityData = { name: cityName, lat: cityLat, lon: cityLon };

        try {
            const response = await fetch('http://localhost:8000/add-site', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCityData),
            });

            const newCity = await response.json();
            console.log('New city added:', newCity);
            fetchWeatherSites();
        } catch (error) {
            console.error('Error adding new city:', error);
        }
    };

    // Render the main application UI.
    return (
        <div>
            <h1>Weather Map </h1>
            <button onClick={handleRefresh}>Refresh Weather</button>
            <div>
                <form onSubmit={handleAddSite}>
                    <label htmlFor="cityName">City Name:</label>
                    <input type="text" id="cityName" name="cityName" required/>

                    <label htmlFor="cityLat">Latitude:</label>
                    <input type="number" id="cityLat" name="cityLat" step="any" required/>

                    <label htmlFor="cityLon">Longitude:</label>
                    <input type="number" id="cityLon" name="cityLon" step="any" required/>

                    <button type="submit">Add Site</button>
                </form>
            </div>
            <Map cities={cities}/>
        </div>
    );
};

export default App;
