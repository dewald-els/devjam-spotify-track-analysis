const APIController = (() => {
    const asyncFetch = async (url, params = []) => {
        try {
            if (params.length > 0) {
                url += '?' + params.join('&');
            }
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            return [null, data];
        } catch (error) {
            return [error.message, null];
        }
    }

    const _searchTrack = async trackText => {
        const [error, data] = await asyncFetch('/spotify/search', [`query=${ trackText }`]);
        if (error) {
            throw new Error(error);
        }
        return data;
    }

    const _getTrackAnalysis = async trackId => {
        const [error, data] = await asyncFetch('/spotify/track-analysis', [`trackId=${ trackId }`]);
        if (error) {
            throw new Error(error);
        }
        return data;
    }

    return {
        searchTracks(trackText) {
            return _searchTrack(trackText);
        },
        getTrackAnalysis(trackId) {
            return _getTrackAnalysis(trackId);
        }
    }
})();

export default APIController;