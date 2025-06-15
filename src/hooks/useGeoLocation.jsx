/*
 * Copyright (c) 2025.  Olli-Pekka Wallin All rights reserved
 */

import {useEffect, useState} from "react";

export default function useGeoLocation() {
    const [position, setPosition] = useState({
        latitude: 51.47924,
        longitude: -0.1582,
    });

    useEffect(() => {
        // const geo = navigator.geolocation;
        //
        // function onSuccess(position) {
        //     setPosition({
        //         latitude: position.coords.latitude,
        //         longitude: position.coords.longitude,
        //     })
        // }
        //
        // function onError(error) {
        //     console.error('Error retrieving geolocation', error);
        // }
        //
        // const watcher = geo.watchPosition(onSuccess, onError);
        //
        // return () => geo.clearWatch(watcher);
    }, []);

    return position;
}
