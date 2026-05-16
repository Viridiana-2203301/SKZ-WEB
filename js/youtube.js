// youtube.js - Integración con YouTube API v3

const YouTube = {
    API_KEY: 'YOUR_YOUTUBE_API_KEY', // Reemplazar con tu clave
    BASE_URL: 'https://www.googleapis.com/youtube/v3',

    // Buscar videos
    async searchVideos(query, maxResults = 10) {
        if (this.API_KEY === 'YOUR_YOUTUBE_API_KEY') {
            console.warn('YouTube API KEY no configurada');
            return [];
        }

        try {
            const url = `${this.BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=${maxResults}&key=${this.API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error buscando videos:', error);
            return [];
        }
    },

    // Obtener detalles del canal
    async getChannelInfo(channelId) {
        if (this.API_KEY === 'YOUR_YOUTUBE_API_KEY') {
            console.warn('YouTube API KEY no configurada');
            return null;
        }

        try {
            const url = `${this.BASE_URL}/channels?part=snippet,statistics&id=${channelId}&key=${this.API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.items?.[0] || null;
        } catch (error) {
            console.error('Error obteniendo info del canal:', error);
            return null;
        }
    },

    // Obtener videos del canal
    async getChannelVideos(channelId, maxResults = 20) {
        if (this.API_KEY === 'YOUR_YOUTUBE_API_KEY') {
            console.warn('YouTube API KEY no configurada');
            return [];
        }

        try {
            const url = `${this.BASE_URL}/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=${maxResults}&key=${this.API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error('Error obteniendo videos del canal:', error);
            return [];
        }
    },

    // Obtener estadísticas del video
    async getVideoStats(videoId) {
        if (this.API_KEY === 'YOUR_YOUTUBE_API_KEY') {
            console.warn('YouTube API KEY no configurada');
            return null;
        }

        try {
            const url = `${this.BASE_URL}/videos?part=statistics,snippet&id=${videoId}&key=${this.API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            return data.items?.[0] || null;
        } catch (error) {
            console.error('Error obteniendo estadísticas:', error);
            return null;
        }
    },

    // Generar URL del video
    getVideoUrl(videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    },

    // Generar URL de embed
    getEmbedUrl(videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
    }
};

// Exportar para uso global
window.YouTubeAPI = YouTube;
