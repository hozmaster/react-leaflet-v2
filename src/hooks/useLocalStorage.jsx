/*
 * Copyright (c) 2025.  Olli-Pekka Wallin All rights reserved
 */

import {useState} from "react";
import {useEffect} from "react";

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}
