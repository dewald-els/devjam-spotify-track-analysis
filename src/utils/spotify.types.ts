export type SpotifyAccessData = {
    access_token: string,
    expires_in: number,
    token_type: string
};

export type SpotifyErrorResponse = {
    status: number;
    message: string;
}
export type SpotifyTokenResponse = {
    data: SpotifyAccessData
}

export type SpotifyTracks = {
    href: string,
    items: SpotifyTrack[],
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: number
}
export type SpotifyArtist = {
    id: string,
    name: string,
}
export type SpotifyAlbumImage = {
    height: number,
    url: string,
    width: number
}
export type SpotifyAlbum = {
    id: string,
    images: SpotifyAlbumImage[],
    name: string,
    release_date: string,
}
export type SpotifyTrack = {
    id: string,
    name: string,
    href: string,
    artists: SpotifyArtist[],
    album: SpotifyAlbum,
}

export type SpotifyTrackSearchResponse = {
    data: {
        tracks: SpotifyTracks;
        error?: SpotifyErrorResponse
    },
}

export type SpotifyAnalysisMeta = {
    status_code: number;
    input_process: string;
    detailed_status: string;
}

export type SpotifyAnalysisTrack = {
    num_samples: number;
    duration: number;
    sample_md5: string;
    offset_seconds: number;
    window_seconds: number;
    analysis_sample_rate: number;
    analysis_channels: number;
    end_of_fade_in: number;
    start_of_fade_out: number;
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    codestring: string;
    code_version: number;
    echoprintstring: string;
    echoprint_version: number;
    synchstring: string;
    synch_version: number;
    rhythmstring: string;
    rhythm_version: number;
}

export interface SpotifyAnalysisTrackBase {
    start: number;
    duration: number;
    confidence: number;
}

export interface SpotifyAnalysisSections extends SpotifyAnalysisTrackBase {
    loudness: number;
    tempo: number;
    tempo_confidence: number;
    key: number;
    key_confidence: number;
    mode: number;
    mode_confidence: number;
    time_signature: number;
    time_signature_confidence: number;
}

export interface SpotifyAnalysisSegments extends SpotifyAnalysisTrackBase {
    "loudness_start": number;
    "loudness_max_time": number;
    "loudness_max": number;
    "loudness_end": number;
    "pitches": number[],
    "timbre": number[]
}

export type SpotifyAnalysisResponseData = {
    meta: SpotifyAnalysisMeta,
    track: SpotifyAnalysisTrack,
    bars: SpotifyAnalysisTrackBase[],
    sections: SpotifyAnalysisSections[],
    segments: SpotifyAnalysisSegments[],
    tatums: SpotifyAnalysisTrackBase[]
    error?: SpotifyErrorResponse
}

export type SpotifyAnalysisResponse = {
    data: SpotifyAnalysisResponseData
}