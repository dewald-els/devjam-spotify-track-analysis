"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrackAnalysis = exports.searchTracks = exports.spotifyTokenData = void 0;
const axios_1 = __importDefault(require("axios"));
const buffer_1 = require("buffer");
function createBearerHeader(accessToken) {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    };
}
exports.spotifyTokenData = {
    access_token: '',
    expires_in: 0,
    token_type: ''
};
function getToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
        const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        try {
            const { data } = yield (0, axios_1.default)('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (0, buffer_1.btoa)(spotifyClientId + ':' + spotifyClientSecret),
                },
                data: 'grant_type=client_credentials'
            });
            exports.spotifyTokenData = {
                access_token: data.access_token,
                token_type: data.token_type,
                expires_in: data.expires_in
            };
        }
        catch (e) {
            throw new Error(e.message);
        }
    });
}
let retryCount = 0;
function retryCountCheck() {
    if (retryCount === 4) {
        retryCount = 0;
        throw new Error('Too many retries on Track search.');
    }
}
function searchTracks(trackText) {
    return __awaiter(this, void 0, void 0, function* () {
        retryCountCheck();
        try {
            if (exports.spotifyTokenData.access_token === '') {
                yield getToken();
            }
            const { data } = yield (0, axios_1.default)('https://api.spotify.com/v1/search?type=track&limit=2&q=' + trackText, {
                method: 'GET',
                headers: createBearerHeader(exports.spotifyTokenData.access_token),
            });
            console.log('searchTracks', data);
            if ((data === null || data === void 0 ? void 0 : data.error) && (data.error.status === 401 && data.error.message === 'The access token expired')) {
                retryCount++;
                yield getToken();
                return searchTracks(trackText);
            }
            retryCount = 0;
            return [null, data.tracks.items];
        }
        catch (e) {
            return [e.message, []];
        }
    });
}
exports.searchTracks = searchTracks;
function getTrackAnalysis(trackId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            retryCountCheck();
            if (exports.spotifyTokenData.access_token === '') {
                yield getToken();
            }
            const { data } = yield (0, axios_1.default)('https://api.spotify.com/v1/audio-analysis/' + trackId, {
                method: 'GET',
                headers: createBearerHeader(exports.spotifyTokenData.access_token),
            });
            if ((data === null || data === void 0 ? void 0 : data.error) && data.error.status === 401) {
                retryCount++;
                yield getToken();
                return getTrackAnalysis(trackId);
            }
            retryCount = 0;
            return [null, data];
        }
        catch (e) {
            return [e.message, null];
        }
    });
}
exports.getTrackAnalysis = getTrackAnalysis;
