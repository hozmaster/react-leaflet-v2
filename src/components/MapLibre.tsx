/*
 * Copyright (c) 2026.  Olli-Pekka Wallin All rights reserved
 */

import 'maplibre-gl/dist/maplibre-gl.css';
import {Map, Marker, NavigationControl, Popup, useControl} from '@vis.gl/react-maplibre';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {MapRef} from '@vis.gl/react-maplibre';
import MaplibreGeocoder from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import localization from "@maplibre/maplibre-gl-geocoder/lib/localization";

const locations = [
    {
        id: 1,
        longitude: 24.9414754336235,
        latitude: 60.17101772676071,
        title: 'Helsingin päärautatieasema',
        city: "Helsinki",
        importance: 0.6308181604536974,
        description: 'The main railway station of the Finland.',
    },
    {
        id: 2,
        longitude: 24.92518563853449,
        latitude: 60.17301930560103,
        title: 'Temppeliaukio Church',
        city: "Helsinki",
        importance: 0.9295913704622313,
        description: 'Communion Service in Temppeliaukio Church in Sundays 10.00-12.00.',
    },
    {
        id: 3,
        longitude: 24.657670895125875,
        latitude: 60.205054912231766,
        title: 'K-Citymarket',
        city: "Espoo",
        importance: 0.5221210578394438,
        description: 'The shopping centre',
    },
];

function obj2Feature(obj) {
    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [obj.longitude, obj.latitude]   // Note: [lng, lat] order
        },
        place_name: obj.title,
        properties: {
            place_id: obj.id,
            namee: obj.title,
            description: obj.description,
            display_name: obj.title
        },
        text: obj.title,
        center: [
            obj.longitude,
            obj.latitude
        ]
    }
}

// Free Nominatim Geocoder (no API key required)
const geocoderApi = {
    forwardGeocode: async (config) => {
        const features = [];
        try {
            // const query = encodeURIComponent(config.query);
            // const response = await fetch(
            //     `https://nominatim.openstreetmap.org/search?q=${query}&format=geojson&addressdetails=1&limit=5`
            // );
            // const geojson = await response.json();
            for (const location of locations) {
                // const bbox = feature.bbox;
                // const center = [
                //     bbox[0] + (bbox[2] - bbox[0]) / 2,
                //     bbox[1] + (bbox[3] - bbox[1]) / 2,
                // ];

                features.push(obj2Feature(location))
                // features.push({
                //     type: 'Feature',
                //     geometry: {type: 'Point', coordinates: center},
                //     place_name: feature.properties.display_name,
                //     properties: feature.properties,
                //     text: feature.properties.display_name,
                //     center,
                // });
            }
        } catch (e) {
            console.error('Geocoding error:', e);
        }

        return {features};
    },
};

// Geocoder Control Component
function GeocoderControl({position = 'top-right', onResult}) {
    const geocoder = useMemo(() => {
        return new MaplibreGeocoder(geocoderApi, {
            maplibregl: window.maplibregl,
            placeholder: 'Search for a place...',
            showResultsWhileTyping: true,
            limit: 5,
        });
    }, []);

    useControl(() => geocoder, {position});

    useEffect(() => {
        if (!onResult) return;

        const handleResult = (e) => onResult(e.result);
        geocoder.on('result', handleResult);

        return () => geocoder.off('result', handleResult);
    }, [geocoder, onResult]);
    return null;
}

const MapLibre = () => {
    const mapRef = useRef<MapRef>(null);
    const [selectedId, setSelectedId] = useState(null);
    const selectedLocation = locations.find((loc) => loc.id === selectedId);

    const onMapLoad = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;
        // map.flyTo({ center: [25.46816, 65.01236], zoom: 12 });
    }, []);

    // Handle search result
    const handleSearchResult = useCallback((result) => {
        // setSearchedResult(result);
        // setSelectedStaticId(null); // Close static popup
        //
        // if (map && result?.center) {
        //     map.flyTo({
        //         center: result.center,
        //         zoom: 14,
        //         duration: 1200,
        //     });
        // }
    }, [mapRef]);

    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: 24.927723,
                    latitude: 60.163787,
                    zoom: 13
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                mapStyle={{
                    version: 8,
                    sources: {
                        'raster-tiles': {
                            type: 'raster',
                            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                            tileSize: 256,
                            attribution: '© OpenStreetMap contributors'
                        }
                    },
                    layers: [{
                        id: 'simple-tiles',
                        type: 'raster',
                        source: 'raster-tiles',
                        minzoom: 0,
                        maxzoom: 22
                    }]
                }}
                onLoad={onMapLoad}
            >
                {locations.map((loc) => (
                    <Marker
                        key={loc.id}
                        longitude={loc.longitude}
                        latitude={loc.latitude}
                        color="#FF0000"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation(); // Prevent map click from closing popup
                            setSelectedId(loc.id);
                        }}
                    />
                ))}

                {selectedLocation && (
                    <Popup
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        offset={25}                    // Shift popup up to avoid overlapping marker
                        closeOnClick={false}           // Keep open when clicking elsewhere on map
                        onClose={() => setSelectedId(null)}
                    >
                        <div style={{padding: '10px', minWidth: '200px'}}>
                            <h3>{selectedLocation.title}</h3>
                            <p>{selectedLocation.description}</p>
                        </div>
                    </Popup>
                )}
                <NavigationControl
                    position="top-left"
                    showZoom={true}
                    showCompass={false}
                />
                <GeocoderControl position="top-right" onResult={handleSearchResult}/>
            </Map>
        </div>
    )
}

export default MapLibre;
