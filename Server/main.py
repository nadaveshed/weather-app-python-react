from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler
import requests
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

# CORS (Cross-Origin Resource Sharing) setup to allow all origins.
origins = ["*"]

# OpenWeatherMap API key for weather data retrieval.
# api_key = "2c537018f2452d778bf8bfd7de917c7a"

# Initial list of cities with their coordinates.
cities = [
    {"name": "Tel Aviv", "lat": 32.0766384, "lon": 34.7765534},
    {"name": "Jerusalem", "lat": 31.769, "lon": 35.2163},
    {"name": "Haifa", "lat": 32.8156, "lon": 34.9892},
    {"name": "Beer Sheva", "lat": 31.2525, "lon": 34.7906},
    {"name": "Eilat", "lat": 29.5581, "lon": 34.9482},
]


# Function to update weather information for each city.
def update_weather():
    for city in cities:
        try:
            # Fetch weather data from OpenWeatherMap API.
            response = requests.get(
                f"http://api.openweathermap.org/data/2.5/weather",
                params={"lat": city['lat'], "lon": city['lon'], "appid": api_key, "units": "metric"}
            )
            response.raise_for_status()
            data = response.json()
            # Update the temperature information for each city.
            city["temperature"] = data.get("main", {}).get("temp", None)
        except requests.exceptions.RequestException as e:
            print(f"Error updating weather for {city['name']}: {e}")


# Set up a scheduler to periodically update weather information.
scheduler = BackgroundScheduler()
scheduler.add_job(update_weather, trigger="interval", minutes=5)
scheduler.start()

# Add CORS middleware to the FastAPI app.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic model to define the structure of City data.
class City(BaseModel):
    name: str
    lat: float
    lon: float
    temperature: Optional[float] = None


# Endpoint to get weather information for all cities.
@app.get("/weather-sites", response_model=List[City])
async def get_weather_sites():
    update_weather()
    return cities


# Endpoint to refresh weather information for all cities.
@app.post("/refresh-weather")
async def refresh_weather():
    update_weather()
    return {"message": "Weather information refreshed successfully"}


# Endpoint to add a new city to the list.
@app.post("/add-site")
async def add_site(city: City):
    new_city = {"name": city.name, "lat": city.lat, "lon": city.lon}
    cities.append(new_city)
    return new_city

# Run the FastAPI app using uvicorn if executed as the main module.
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000)
