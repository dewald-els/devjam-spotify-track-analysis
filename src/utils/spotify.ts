import axios, { AxiosError } from "axios";
import { btoa } from "buffer";
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
        'Authorization': `Bearer ${ accessToken }`
    }
}

export let spotifyTokenData: SpotifyAccessData = {
    access_token: '',
    expires_in: 0,
    token_type: ''
}


async function getToken(): Promise<void> {

    console.log("Attempting to get token.");

    const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
    const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!spotifyClientId) {
        console.log("getToken: SpotifyClientID was not found");
        throw new Error('Spotify ClientId not found.')
    }

    if (!spotifyClientSecret) {
        console.log("getToken: Spotify ClientSecret was not found");
        throw new Error('Spotify ClientSecret not found.')
    }

    try {
        const { data }: SpotifyTokenResponse = await axios('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(spotifyClientId + ':' + spotifyClientSecret),
            },
            data: 'grant_type=client_credentials'
        });

        console.log("Found data from Token: ", JSON.stringify(data));

        spotifyTokenData = {
            access_token: data.access_token,
            token_type: data.token_type,
            expires_in: data.expires_in
        };
    } catch (e: unknown) {
        if (e instanceof Error) {
            console.log("Unable to get token: ")
            throw new Error(e.message);
        }
        throw new Error("Could not fetch token");
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
        const { data }: SpotifyTrackSearchResponse = await axios('https://api.spotify.com/v1/search?type=track&limit=2&q=' + trackText, {
            method: 'GET',
            headers: createBearerHeader(spotifyTokenData.access_token),
        });

        if (data?.error && data.error.status === 401) {
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

        console.log("getTrackAnalysis.currentRetries", retryCount)

        if (spotifyTokenData.access_token === '') {
            console.log("getTrackAnalysis.getToken");
            await getToken();
        }

        console.log("getTrackAnalysis.calling: ", "https://api.spotify.com/v1/audio-analysis/");
        const { data }: SpotifyAnalysisResponse = await axios('https://api.spotify.com/v1/audio-analysis/' + trackId, {
            method: 'GET',
            headers: createBearerHeader(spotifyTokenData.access_token),
        });



        if (data?.error && data.error.status === 401) {
            console.log("Failed to find data: ", JSON.stringify(data));
            retryCount++;
            await getToken()
            return getTrackAnalysis(trackId);
        }

        console.log("Found data: ", JSON.stringify(data));
        retryCount = 0;
        return [null, data];
    } catch (e: any) {
        console.log("Failed to fetch track analysis with: ", e);
        return [e.message, null];
    }
}