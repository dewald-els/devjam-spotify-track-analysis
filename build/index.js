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
const express_1 = __importDefault(require("express"));
const path_1 = require("path");
const dotenv_1 = __importDefault(require("dotenv"));
const spotify_1 = require("./utils/spotify");
if (process.env.NODE_ENV !== 'production') {
    dotenv_1.default.config();
}
const { PORT = 3000 } = process.env;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static((0, path_1.join)(__dirname, 'public')));
app.get('/', (req, res) => {
    return res.sendFile((0, path_1.join)(__dirname, 'public', 'index.html'));
});
app.get('/spotify/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query = '' } = req.query;
    const [errorMessage, tracks] = yield (0, spotify_1.searchTracks)(query);
    if (errorMessage) {
        return res.status(500).json({ error: { message: errorMessage } });
    }
    return res.status(200).json({ tracks });
}));
app.get('/spotify/track-analysis', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { trackId } = req.query;
    if (!trackId) {
        return res.status(400).json({ error: { message: 'No TrackId received' } });
    }
    const [errorMessage, trackAnalysis] = yield (0, spotify_1.getTrackAnalysis)(trackId.toString());
    if (errorMessage) {
        return res.status(500).json({ error: { message: errorMessage } });
    }
    return res.status(200).json({ trackAnalysis });
}));
app.listen(PORT, () => {
    console.log('Server started on port ' + PORT);
});
