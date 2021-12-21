import { determineChordsFromKey } from './music.js'
import APIController from "./api.controller.js";

const UIController = (() => {

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const trackList = document.getElementById('track-list');
    const trackAnalysis = document.getElementById('track-analysis');

    const _createTrack = (track) => {
        const { id, name, artists, album } = track;
        const trackArtists = artists.map(a => a.name).join(', ');
        return `
            <li id="${ id }" class="spotify-track list-group-item">
                <div class="no-pointer-event d-flex align-items-center">
                    <aside class="me-3 rounded overflow-hidden border-1 border border-light">
                        <img src=${ album.images[0].url } alt=${ album.name } width="55"/>
                    </aside>
                    <article>
                        <p class="mb-0"><b>${ trackArtists } - ${ name }</b></p>
                        <p class="text-muted mb-0">${ album.name }</p>
                    </article>
                </div>      
            </li>
        `
    }

    const _createTracks = tracks => {
        trackList.innerHTML = '';
        for (const track of tracks) {
            trackList.insertAdjacentHTML('beforeend', _createTrack(track));
        }
    }

    const _createTrackMeta = ({ track, meta, beats, sections, bars }) => {
        trackAnalysis.innerHTML = '';
        const cycle = determineChordsFromKey(track.mode, track.key)
        const chordList = cycle.chords.map((chord, idx) => {
            if (idx === 0 || idx === 4) {
                return `<b>${ chord }</b>`
            }
            return `<span>${ chord }</span>`
        }).join(' ')

        const html = `
            <h4>Overview</h4>
            <p>This song is probaly in the key of <b>${ cycle.displayKey } ${ cycle.mode }</b></p>
            <p>Approximate tempo of the song is: ${ Math.floor(track.tempo) }bpm</p>
            <p>Duration: ${ (track.duration / 60).toFixed(2) }</p>
            <p>Chords for Key: </p>
            ${ chordList }
        `;
        trackAnalysis.insertAdjacentHTML('beforeend', html);
    }

    return {
        getDOMElements() {
            return {
                searchForm,
                searchInput,
                searchButton,
                trackList,
                trackAnalysis
            }
        },
        createTracks(tracks) {
            return _createTracks(tracks);
        },
        createTrackMeta(track) {
            return _createTrackMeta(track);
        }
    }
})();

const AppController = ((APICtrl, UICtrl) => {

    const { searchForm, searchInput, trackList } = UICtrl.getDOMElements();

    const onSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchInput.value.trim()) {
            alert('Please enter a track name first...');
            return;
        }
        const { tracks } = await APICtrl.searchTracks(searchInput.value.trim());
        UICtrl.createTracks(tracks);
    }

    const onTrackClicked = async (event) => {
        const { target: trackItem } = event;
        const { trackAnalysis } = await APICtrl.getTrackAnalysis(trackItem.id);
        UICtrl.createTrackMeta(trackAnalysis);
    }

    const _init = () => {
        searchForm.addEventListener('submit', onSearchSubmit);
        trackList.addEventListener('click', onTrackClicked);
    }

    return {
        init() {
            return _init();
        }
    }

})(APIController, UIController)

AppController.init();
