/*
 * Copyright (c) 2025.  Olli-Pekka Wallin All rights reserved
 */

import L from 'leaflet'
import "leaflet-calendar/js/leaflet-calendar.js"

import {useEffect, useRef} from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";
import useGeoLocation from "../hooks/useGeoLocation.jsx";

const Map = () => {
    const mapRef = useRef(null);
    const userMarkerRef = useRef(null);

    const [userPosition, setUserPosition] = useLocalStorage("react-leaflet-v2", {
        latitude: 51.47924,
        longitude: -0.1582,
    })

    const [nearbyMarkers, setNearbyMarkers] = useLocalStorage('nearby_markers', [])
    const location = useGeoLocation()

    useEffect(() => {
        // let container = L.DomUtil.get('map');
        // if(container != null){
        //     container._leaflet_id = null;
        // }

        mapRef.current = L.map('map').setView([userPosition.latitude, userPosition.longitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            mapConfig: {zoomControl: false},
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapRef.current);

        L.control.calendar({
            minDate: "2023-04-01",
            maxDate: "2050-12-31",
            onSelectDate: (value) => onSelectDate(value),
            position: "topleft",
        }).addTo(mapRef.current);

        nearbyMarkers.forEach(({latitude, longitude}) => {
            L.marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(
                    `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                );
        });

        mapRef.current.addEventListener("click", (e) => {
            const {lat: latitude, lng: longitude} = e.latlng;
            L
                .marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(
                    `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                );

            setNearbyMarkers((prevMarkers) => [
                ...prevMarkers,
                {latitude, longitude},
            ]);

        });
    }, []);

    useEffect(() => {
        setUserPosition({...userPosition});

        if (userMarkerRef.current) {
            mapRef.current.removeLayer(userMarkerRef.current);
        }

        userMarkerRef.current = L
            .marker([location.latitude, location.longitude])
            .addTo(mapRef.current)
            .bindPopup("User");

        const el = userMarkerRef.current.getElement();
        if (el) {
            el.style.filter = "hue-rotate(120deg)";
        }

        mapRef.current.setView([location.latitude, location.longitude]);

    }, [location, userPosition.latitude, userPosition.longitude]);

    function onSelectDate(value) {
        alert(`Date: ${value}`);
        setNearbyMarkers([]);   // Refresh the map to see that all markers are now gone
    }

    return (
        <div id="map" ref={mapRef}></div>
    )
}

export default Map;
