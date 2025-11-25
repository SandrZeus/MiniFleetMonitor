import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
    process.env = loadEnv(mode, path.resolve(__dirname, '../'));

    return defineConfig({
        plugins: [react()],
        server: {
            port: parseInt(process.env.VITE_PORT),
        },
    });
}
