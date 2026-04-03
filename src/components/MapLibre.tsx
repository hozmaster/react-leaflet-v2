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
        console.log('Map is ready!', map);

        // export type NavigationControlOptions = {
        //     /**
        //      * If `true` the compass button is included.
        //      */
        //     showCompass?: boolean;
        //     /**
        //      * If `true` the zoom-in and zoom-out buttons are included.
        //      */
        //     showZoom?: boolean;
        //     /**
        //      * If `true` the pitch is visualized by rotating X-axis of compass.
        //      */
        //     visualizePitch?: boolean;
        //     /**
        //      * If `true` the roll is visualized by rotating the compass.
        //      */
        //     visualizeRoll?: boolean;
        // };
        // map.addControl(new maplibregl.NavigationControl({
        //     showCompass: true,
        //     showZoom: true,
        //     visualizePitch: true,
        // }), 'top-right');

        // You can now safely call most MapLibre methods:
        // 65.01236 25.46816
        map.flyTo({ center: [25.46816, 65.01236], zoom: 12 });
        // map.setZoom(10);
        // map.getBounds(), map.queryRenderedFeatures(), etc.
    }, []);


    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <Map
                ref={mapRef}
                initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 15
                }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
                mapStyle="https://tiles.openfreemap.org/styles/liberty"
                onLoad={onMapLoad}
            >
                {/*<NavigationControl*/}
                {/*    position="top-left"*/}
                {/*    showZoom={true}*/}
                {/*    showCompass={true}*/}
                {/*/>*/}
            </Map>
        </div>
    )
}

export default MapLibre;
