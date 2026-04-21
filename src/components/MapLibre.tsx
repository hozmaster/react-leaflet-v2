/*
 * Copyright (c) 2026.  Olli-Pekka Wallin All rights reserved
 */

import 'maplibre-gl/dist/maplibre-gl.css';
import {Map, Marker, NavigationControl, Popup} from '@vis.gl/react-maplibre';
import {useCallback, useRef, useState} from "react";
import type { MapRef } from '@vis.gl/react-maplibre';

// 60.17101772676071, 24.94147543362352

const locations = [
    {
        id: 1,
        longitude: 24.9414754336235,
        latitude: 60.17101772676071,
        title: 'Helsingin päärautatieasema',
        description: 'The main railway station of the Finland.',
    },
    {
        id: 2,
        longitude: 24.92518563853449,
        latitude: 60.17301930560103,
        title: 'Temppleliaukio Church',
        description: 'Communion Service in Temppeliaukio Church in Sundays 10.00-12.00.',
    },
];

const MapLibre = () => {
    const mapRef = useRef<MapRef>(null);
    const [selectedId, setSelectedId] = useState(null);
    const selectedLocation = locations.find((loc) => loc.id === selectedId);


    const onMapLoad = useCallback(() => {
        const map = mapRef.current;
        if (!map) return;
        // map.flyTo({ center: [25.46816, 65.01236], zoom: 12 });
    }, []);

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
            </Map>
        </div>
    )
}

export default MapLibre;
