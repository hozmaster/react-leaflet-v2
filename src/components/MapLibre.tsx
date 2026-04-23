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
import {finnish_pois} from "../Library/POI.js";

// const geocoderStyles = `
//   .maplibregl-ctrl-geocoder .suggestions {
//     width: 380px !important;
//     max-width: 92vw !important;
//     min-width: 320px !important;
//   }
//   .maplibregl-ctrl-geocoder .suggestions li {
//     white-space: normal !important;
//     word-break: break-word !important;
//     line-height: 1.45 !important;
//     padding: 10px 14px !important;
//   }
//   .maplibregl-ctrl-geocoder {
//     width: 380px !important;
//   }
// `;

function obj2Feature(obj) {
    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [obj.longitude, obj.latitude]
        },
        place_name: obj.name + ',' + obj.city,
        properties: {
            place_id: obj.id,
            name: obj.city,
            display_name: obj.description,
        },
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
            const query = config.query;
            finnish_pois.forEach((poi) => {
                if (poi.city.indexOf(query) >= 0 ||
                    poi.name.indexOf(query) >= 0 ||
                    poi.description.indexOf(query) >= 0) {
                    features.push(obj2Feature(poi))
                }
            });
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
    const selectedLocation = finnish_pois.find((loc) => loc.id === selectedId);

    const onMapLoad = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;
    }, []);

    // Handle search result
    const handleSearchResult = useCallback((result) => {
        setSelectedId(null); // Close static popup
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
                {finnish_pois.map((loc) => (
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
                            <h3>{selectedLocation.name}</h3>
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
