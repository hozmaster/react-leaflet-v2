/*
 * Copyright (c) 2026.  Olli-Pekka Wallin All rights reserved
 */

import 'maplibre-gl/dist/maplibre-gl.css';
import {GeolocateControl, Map, NavigationControl} from '@vis.gl/react-maplibre';

const MapLibre = () => {
    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <Map
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 15
                }}
                style={{
                    width: '100%',
                    height: '100%',        // or any height you need (e.g. 600px)
                }}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
            >
                <NavigationControl
                position="top-left"
                showZoom={true}
                showCompass={true}
            />
            </Map>
        </div>
    )
}

export default MapLibre;
