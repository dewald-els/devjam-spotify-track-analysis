import axios from "axios";
import {btoa} from "buffer";
import {
    SpotifyAccessData,
    SpotifyAnalysisResponse, SpotifyAnalysisResponseData,
    SpotifyTokenResponse,
    SpotifyTrack,
    SpotifyTrackSearchResponse
} from "./spotify.types";

function createBearerHeader(accessToken: string) {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    }
}

export let spotifyTokenData: SpotifyAccessData = {
    access_token: '',
    expires_in: 0,
    token_type: ''
}


async function getToken(): Promise<void> {
    const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    try {
        const {data}: SpotifyTokenResponse = await axios('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotifyClientId + ':' + spotifyClientSecret),
            },
            data: 'grant_type=client_credentials'
        });
        spotifyTokenData = {
            access_token: data.access_token,
            token_type: data.token_type,
            expires_in: data.expires_in
        };
    } catch (e: any) {
        throw new Error(e.message);
    }
}

let retryCount = 0;

function retryCountCheck() {
    if (retryCount === 4) {
        retryCount = 0;
        throw new Error('Too many retries on Track search.');
    }
}

export async function searchTracks(trackText: string): Promise<[string | null, SpotifyTrack[]]> {
    retryCountCheck();
    try {
        if (spotifyTokenData.access_token === '') {
            await getToken();
        }
        const {data}: SpotifyTrackSearchResponse = await axios('https://api.spotify.com/v1/search?type=track&limit=2&q=' + trackText, {
            method: 'GET',
            headers: createBearerHeader(spotifyTokenData.access_token),
        });

        console.log('searchTracks', data)

        if (data?.error && (data.error.status === 401 && data.error.message === 'The access token expired')) {
            retryCount++;
            await getToken()
            return searchTracks(trackText);
        }
        retryCount = 0;
        return [null, data.tracks.items];
    } catch (e: any) {
        return [e.message, []];
    }
}

export async function getTrackAnalysis(trackId: string): Promise<[string | null, SpotifyAnalysisResponseData | null]> {
    try {
        retryCountCheck();

        if (spotifyTokenData.access_token === '') {
            await getToken();
        }

        const {data}: SpotifyAnalysisResponse = await axios('https://api.spotify.com/v1/audio-analysis/' + trackId, {
            method: 'GET',
            headers: createBearerHeader(spotifyTokenData.access_token),
        });
        if (data?.error && data.error.status === 401) {
            retryCount++;
            await getToken()
            return getTrackAnalysis(trackId);
        }
        retryCount = 0;
        return [null, data];
    } catch (e: any) {
        return [e.message, null];
    }
}