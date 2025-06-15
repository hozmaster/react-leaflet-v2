/*
 * Copyright (c) 2025.  Olli-Pekka Wallin All rights reserved
 */

import L from 'leaflet'
import "leaflet-editable/src/Leaflet.Editable.js"

import {useEffect, useRef} from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";
// import useGeoLocation from "../hooks/useGeoLocation.jsx";

const Map = () => {
    const mapRef = useRef(null);
    const userMarkerRef = useRef(null);

    const [userPosition, setUserPosition] = useLocalStorage("user_position", {
        latitude: 51.47924,
        longitude: -0.1582,
    })

    const [zoomLevel, setZoomLevel] = useLocalStorage("zoomLevel", 13);

    const [nearbyMarkers, setNearbyMarkers] = useLocalStorage('nearby_markers', [])
    // const location = useGeoLocation()

    useEffect(() => {
        mapRef.current = L.map('map').setView([userPosition.latitude, userPosition.longitude], 13);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: zoomLevel,
            mapConfig: {zoomControl: false},
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapRef.current);

        nearbyMarkers.forEach(({latitude, longitude}) => {
            L.marker([latitude, longitude])
                .addTo(mapRef.current)
                .bindPopup(
                    `lat: ${latitude.toFixed(2)}, long: ${longitude.toFixed(2)}`
                );
        });

        mapRef.current.addEventListener("click", (e) => {
            // const changedPos = e.latlng;
            // console.log(changedPos);
        });

        mapRef.current.addEventListener("moveend", (e) => {
            const position = mapRef.current.getCenter();
            if (position) {
                setUserPosition({latitude: position.lat, longitude: position.lng});
            }
        })
    }, []);

    useEffect(() => {
        // setUserPosition({...userPosition});
        // if (userMarkerRef.current) {
        //     mapRef.current.removeLayer(userMarkerRef.current);
        // }

        // userMarkerRef.current = L
        //     .marker([location.latitude, location.longitude])
        //     .addTo(mapRef.current)
        //     .bindPopup("User");
        //
        // const el = userMarkerRef.current.getElement();
        // if (el) {
        //     el.style.filter = "hue-rotate(120deg)";
        // }
        //
        // mapRef.current.setView([userPosition.latitude, userPosition.longitude]);

    }, [location, userPosition.latitude, userPosition.longitude]);

    return (
        <div id="map" ref={mapRef}></div>
    )
}

export default Map;
