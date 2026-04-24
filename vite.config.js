/*
 * Copyright (c) 2026.  Olli-Pekka Wallin All rights reserved
 */

import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000,
    },
});
