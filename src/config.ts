const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_BASE_URL = (() => {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    // When deployed on Vercel or any non-localhost domain, never call localhost
    if (!isLocal) {
        if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
            return envUrl;
        }
        return 'https://lms-backend-vzds.onrender.com';
    }
    // In local development, use envUrl if configured or default to localhost:5000
    return envUrl || 'http://localhost:5000';
})();
