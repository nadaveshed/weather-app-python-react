import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './Map.css';


// Map component to display weather information for cities on a map.
const Map = ({ cities }) => {
    // Ref to hold the map container element.
    const mapContainer = useRef(null);
    // Ref to hold the map instance.
    const map = useRef(null);
    // Initial longitude, latitude, and zoom level for the map.
    const [lng] = useState(34.7814619);
    const [lat] = useState(32.0833);
    const [zoom] = useState(7);
    // API key for MapTiler services.
    const [API_KEY] = useState('tYGeNXinxbqLH9aGZm5O');

    // useEffect hook to initialize the map and update it when cities data changes.
    useEffect(() => {
        // Create the map if it does not exist.
        if (!map.current) {
            map.current = new maplibregl.Map({
                container: mapContainer.current,
                style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
                center: [lng, lat],
                zoom: zoom,
            });
        }

        // Add popups for each city on the map.
        cities.forEach(city => {
            new maplibregl.Popup()
                .setLngLat([city.lon, city.lat])
                .setHTML(`<p>Temperature: ${city.temperature}°C</p>`)
                .addTo(map.current);
        });

    }, [API_KEY, cities, lat, lng, zoom]);

    // Render the map container element.
    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
        </div>
    );
};

export default Map;
