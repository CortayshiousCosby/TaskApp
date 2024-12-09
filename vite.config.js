import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [
        laravel({
            input: ["resources/js/app.tsx"], // Changed 'app.js' to 'app.tsx'
            refresh: true,
        }),
        react(), // Added React plugin
    ],
    resolve: {
        alias: {
            "@": "/resources/js", // Optional alias for cleaner imports
        },
        extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
    },
});
