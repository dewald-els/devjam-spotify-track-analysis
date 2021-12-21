import { determineChordsFromKey } from "./music.js";

const UIController = (() => {

    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const trackList = document.getElementById('track-list');
    const trackAnalysis = document.getElementById('track-analysis');

    const _createCardHeader = (title, subTitle = '') => {
        let titleHTML = title.trim() ? `<h4 class="card-title mb-0">${title}</h4>` : ''
        let subTitleHTML = subTitle.trim() ? `<p class="card-subtitle text-muted">${subTitle}</p>` : ''
        
        return `<header class="card-header">
            ${titleHTML}            
            ${subTitleHTML}
        </header>`
    }

    const _createCardBody = () => {
        const cardBody = document.createElement('div')
        cardBody.className = 'card-body p-0'
        return cardBody
    }

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
        trackList.insertAdjacentHTML('beforeend', _createCardHeader('Tracks'))
        const cardBody = _createCardBody()
        for (const track of tracks) {
            cardBody.insertAdjacentHTML('beforeend', _createTrack(track))
        }
        trackList.appendChild(cardBody)
    }

    const _createTrackMetaSection = (img, text) => {
        return `
        <li class="track-meta-section list-group-item py-3">
            <aside>
                <img src="img/${img}" alt="Tuning fork in music" />
            </aside>
            <div>${ text }</div>
        </li>
        `
    }

    const _createTrackMeta = ({ track, meta, beats, sections, bars }) => {
        trackAnalysis.innerHTML = '';
        const cycle = determineChordsFromKey(track.mode, track.key)
        const chordList = cycle.chords.map((chord, idx) => {
            if (idx === 0 || idx === 4) {
                return `<span><b>${ chord }</b></span>`
            }
            return `<span>${ chord }</span>`
        }).join(' - ')

        const displayKeySection = _createTrackMetaSection('tuning-fork.png', `<b>Key of the Song:</b> <br> <b>${ cycle.displayKey } ${ cycle.mode }</b>`);
        const tempoSection = _createTrackMetaSection('metronome.png', `<b>Tempo of the song is:</b> <br> ${ Math.floor(track.tempo) }bpm`)
        const durationSection = _createTrackMetaSection('hourglass.png', `<b>Duration of the song:</b> <br> ${ (track.duration / 60).toFixed(2) }`)
        const chordsSection = _createTrackMetaSection('sheet.png', `<b>Chords for Key:</b> <br> <div>${ chordList }</div>`)

        const html = `
            
            <ul class="list-group">
                <li class="list-group-item bg-dark text-white">
                    <h4 class="mb-0">Overview</h4>
                    <p class="mb-0 text-muted">The following data is an approximation</p>
                </li>
                ${ displayKeySection }
                ${ tempoSection }
                ${ durationSection }
                ${ chordsSection }
            </ul>
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

export default UIController