import express from 'express';
import { join } from 'path';
import dotenv from 'dotenv';
import { getTrackAnalysis, searchTracks } from "./utils/spotify";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { PORT = 3000 } = process.env;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
    return res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/spotify/search', async (req, res) => {
    type SearchRequest = {
        query: string;
    };
    const { query = '' }: Partial<SearchRequest> = req.query;
    const [errorMessage, tracks] = await searchTracks(query);
    if (errorMessage) {
        return res.status(500).json({ error: { message: errorMessage } })
    }

    return res.status(200).json({ tracks })
});

app.get('/spotify/track-analysis', async (req, res) => {

    const { trackId } = req.query

    if (!trackId) {
        return res.status(400).json({ error: { message: 'No TrackId received' } });
    }

    const [errorMessage, trackAnalysis] = await getTrackAnalysis(trackId.toString());
    if (errorMessage) {
        return res.status(500).json({ error: { message: errorMessage } });
    }

    return res.status(200).json({ trackAnalysis });
})

app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});