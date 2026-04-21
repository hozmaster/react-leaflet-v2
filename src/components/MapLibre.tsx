/*
 * Copyright (c) 2026.  Olli-Pekka Wallin All rights reserved
 */

import 'maplibre-gl/dist/maplibre-gl.css';
import {Map, NavigationControl} from '@vis.gl/react-maplibre';
import {useCallback, useRef} from "react";
import type { MapRef } from '@vis.gl/react-maplibre';
import {NavigationControlOptions} from "maplibre-gl";

const MapLibre = () => {
    const mapRef = useRef<MapRef>(null);

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
