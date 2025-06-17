/*
 * Copyright (c) 2025.  Olli-Pekka Wallin All rights reserved
 */

import L from 'leaflet'
import "leaflet-editable/src/Leaflet.Editable.js"

import {useEffect, useRef} from "react";
import useLocalStorage from "../hooks/useLocalStorage.jsx";

const Map = () => {
    const mapRef = useRef(null);
    const userMarkerRef = useRef(null);

    const [userPosition, setUserPosition] = useLocalStorage("user_position", {
        latitude: 51.47924,
        longitude: -0.1582,
    })

    const [zoomLevel, setZoomLevel] = useLocalStorage("zoomLevel", 13);
    const [nearbyMarkers, setNearbyMarkers] = useLocalStorage('nearby_markers', [])

    useEffect(() => {
        if (mapRef.current._leaflet_id !== undefined) {
            return;
        }

        mapRef.current = L.map('map', {editable: true}).setView([userPosition.latitude, userPosition.longitude], zoomLevel);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            zoom: zoomLevel,
            mapConfig: {zoomControl: true},
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(mapRef.current);

        L.EditControl = L.Control.extend({
            options: {
                position: 'topleft',
                callback: null,
                kind: '',
                html: ''
            },
            onAdd: function (map) {
                const container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
                    link = L.DomUtil.create('a', '', container);

                link.href = '#';
                link.title = 'Create a new ' + this.options.kind;
                link.innerHTML = this.options.html;
                L.DomEvent.on(link, 'click', L.DomEvent.stop)
                    .on(link, 'click', function () {
                        window.LAYER = this.options.callback.call(mapRef.current.editTools);
                    }, this);

                // container.style.display = 'block';
                // mapRef.current.editTools.on('editable:enabled', function (e) {
                //     container.style.display = 'none';
                // });
                // mapRef.current.editTools.on('editable:disable', function (e) {
                //     container.style.display = 'block';
                // });
                return container;
            }
        });


        L.NewPolygonControl = L.EditControl.extend({
            options: {
                position: 'topleft',
                callback: mapRef.current.editTools.startPolygon,
                kind: 'polygon',
                html: '▰'
            }
        })

        mapRef.current.addControl(new L.NewPolygonControl());

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

        mapRef.current.addEventListener("zoom", (e) => {
            const zoomLevel = mapRef.current.getZoom();
            setZoomLevel(zoomLevel);
        });

        mapRef.current.addEventListener("moveend", (e) => {
            const position = mapRef.current.getCenter();
            if (position) {
                setUserPosition({latitude: position.lat, longitude: position.lng});
            }
        })
    }, []);

    // useEffect(() => {
    //     // setUserPosition({...userPosition});
    //     // if (userMarkerRef.current) {
    //     //     mapRef.current.removeLayer(userMarkerRef.current);
    //     // }
    //
    //     // userMarkerRef.current = L
    //     //     .marker([location.latitude, location.longitude])
    //     //     .addTo(mapRef.current)
    //     //     .bindPopup("User");
    //     //
    //     // const el = userMarkerRef.current.getElement();
    //     // if (el) {
    //     //     el.style.filter = "hue-rotate(120deg)";
    //     // }
    //     //
    //     // mapRef.current.setView([userPosition.latitude, userPosition.longitude]);
    //
    // }, [location, userPosition.latitude, userPosition.longitude]);

    return (
        <div id="map" ref={mapRef}></div>
    )
}

export default Map;
