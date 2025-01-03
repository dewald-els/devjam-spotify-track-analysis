import express from "express";
import { join } from "path";
import dotenv from "dotenv";
import { getTrackAnalysis, searchTracks } from "./utils/spotify";

dotenv.config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  return res.sendFile(join(__dirname, "public", "index.html"));
});

app.get("/spotify/search", async (req, res) => {
  type SearchRequest = {
    query: string;
  };
  const { query = "" }: Partial<SearchRequest> = req.query;
  const [errorMessage, tracks] = await searchTracks(query);
  if (errorMessage) {
    return res.status(500).json({ error: { message: errorMessage } });
  }

  return res.status(200).json({ tracks });
});

app.get("/spotify/track-analysis", async (req, res) => {
  const { trackId } = req.query;

  console.log("track-analysis for ", trackId);

  if (!trackId) {
    return res.status(400).json({ error: { message: "No TrackId received" } });
  }

  // const [errorMessage, trackAnalysis] = await getTrackAnalysis(trackId.toString());
  // if (errorMessage) {
  //     return res.status(500).json({ error: { message: errorMessage } });
  // }

  return res.status(200).json({ trackAnalysis: MOCK_TRACK_ANALYSIS });
});

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});

const MOCK_TRACK_ANALYSIS = {
  meta: {
    analyzer_version: "4.0.0",
    platform: "Linux",
    detailed_status: "OK",
    status_code: 0,
    timestamp: 1495193577,
    analysis_time: 6.93906,
    input_process: "libvorbisfile L+R 44100->22050",
  },
  track: {
    num_samples: 4585515,
    duration: 207.95985,
    sample_md5: "string",
    offset_seconds: 0,
    window_seconds: 0,
    analysis_sample_rate: 22050,
    analysis_channels: 1,
    end_of_fade_in: 0,
    start_of_fade_out: 201.13705,
    loudness: -5.883,
    tempo: 118.211,
    tempo_confidence: 0.73,
    time_signature: 4,
    time_signature_confidence: 0.994,
    key: 9,
    key_confidence: 0.408,
    mode: 0,
    mode_confidence: 0.485,
    codestring: "string",
    code_version: 3.15,
    echoprintstring: "string",
    echoprint_version: 4.15,
    synchstring: "string",
    synch_version: 1,
    rhythmstring: "string",
    rhythm_version: 1,
  },
  bars: [
    {
      start: 0.49567,
      duration: 2.18749,
      confidence: 0.925,
    },
  ],
  beats: [
    {
      start: 0.49567,
      duration: 2.18749,
      confidence: 0.925,
    },
  ],
  sections: [
    {
      start: 0,
      duration: 6.97092,
      confidence: 1,
      loudness: -14.938,
      tempo: 113.178,
      tempo_confidence: 0.647,
      key: 9,
      key_confidence: 0.297,
      mode: -1,
      mode_confidence: 0.471,
      time_signature: 4,
      time_signature_confidence: 1,
    },
  ],
  segments: [
    {
      start: 0.70154,
      duration: 0.19891,
      confidence: 0.435,
      loudness_start: -23.053,
      loudness_max: -14.25,
      loudness_max_time: 0.07305,
      loudness_end: 0,
      pitches: [0.212, 0.141, 0.294],
      timbre: [42.115, 64.373, -0.233],
    },
  ],
  tatums: [
    {
      start: 0.49567,
      duration: 2.18749,
      confidence: 0.925,
    },
  ],
};
