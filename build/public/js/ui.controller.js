import { determineChordsFromKey } from "./music.js";
import TrackChartController from "./track-chart.controller.js";
import COLOURS from "./random-colours.js";

const UIController = ((trackChartCtrl) => {
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const trackList = document.getElementById("track-list");
  const trackAnalysis = document.getElementById("track-analysis");

  const _createCardHeader = (title, subTitle = "") => {
    let titleHTML = title.trim()
      ? `<h4 class="card-title mb-0">${title}</h4>`
      : "";
    let subTitleHTML = subTitle.trim()
      ? `<p class="card-subtitle text-muted">${subTitle}</p>`
      : "";

    return `<header class="card-header">
            ${titleHTML}            
            ${subTitleHTML}
        </header>`;
  };

  const _createCardBody = () => {
    const cardBody = document.createElement("div");
    cardBody.className = "card-body p-0";
    return cardBody;
  };

  const _createTrack = (track) => {
    const { id, name, artists, album } = track;
    const trackArtists = artists.map((a) => a.name).join(", ");
    return `
            <li id="${id}" class="spotify-track list-group-item">
                <div class="no-pointer-event d-flex align-items-center">
                    <aside class="me-3 rounded overflow-hidden border-1 border border-light">
                        <img src=${album.images[0].url} alt=${album.name} width="55"/>
                    </aside>
                    <article>
                        <p class="mb-0"><b>${trackArtists} - ${name}</b></p>
                        <p class="text-muted mb-0">${album.name}</p>
                    </article>
                </div>      
            </li>
        `;
  };

  const _createTracks = (tracks) => {
    trackList.innerHTML = "";
    trackList.insertAdjacentHTML("beforeend", _createCardHeader("Tracks"));
    const cardBody = _createCardBody();
    for (const track of tracks) {
      cardBody.insertAdjacentHTML("beforeend", _createTrack(track));
    }
    trackList.appendChild(cardBody);
  };

  const _createTrackMetaSection = (img, text) => {
    return `
        <li class="track-meta-section list-group-item py-3">
            <aside>
                <img src="img/${img}" alt="Tuning fork in music" />
            </aside>
            <div>${text}</div>
        </li>
        `;
  };

  const _createChordList = (chords) => {
    return chords
      .map((chord, idx) => {
        if (idx === 0 || idx === 4) {
          return `<span><b>${chord}</b></span>`;
        }
        return `<span>${chord}</span>`;
      })
      .join(" - ");
  };

  const _createSectionBlocks = (track, sections) => {
    const calculateWidth = (sectionDuration, trackDuration) => {
      return (sectionDuration / trackDuration) * 100;
    };
    const sectionBlocks = sections.map((section, idx) => {
      const sectionWidth =
        calculateWidth(section.duration, track.duration) + "%";
      const sectionKey = determineChordsFromKey(section.mode, section.key);
      const startTime =
        section.start === 0 ? "0:00" : (section.start / 60).toFixed(2);
      const endTime = ((section.start + section.duration) / 60).toFixed(2);
      const colour = COLOURS[idx];
      return `
                <div class="d-flex flex-column p-1" style="width: ${sectionWidth}; font-size: .7rem; height: 95px; background: ${colour}">
                    <span style="font-weight: bold; color: #333;">${sectionKey.displayKey} ${sectionKey.mode}</span>
                    <span class="mt-auto">${startTime} - ${endTime}</span>
                </div>
            `;
    });
    return sectionBlocks.join("");
  };

  const _createTrackMeta = ({ track, meta, beats, sections, bars }) => {
    trackAnalysis.innerHTML = "";
    console.log("BUILD._createTrackMeta determineChordsFromKey");
    const cycle = determineChordsFromKey(track.mode, track.key);
    const chordList = _createChordList(cycle.chords);

    const displayKeySection = _createTrackMetaSection(
      "tuning-fork.png",
      `<b>Key of the Song:</b> <br> <b>${cycle.displayKey} ${cycle.mode}</b>`
    );
    const tempoSection = _createTrackMetaSection(
      "metronome.png",
      `<b>Tempo of the song is:</b> <br> ${Math.floor(track.tempo)}bpm`
    );
    const durationSection = _createTrackMetaSection(
      "hourglass.png",
      `<b>Duration of the song:</b> <br> ${(track.duration / 60).toFixed(2)}`
    );
    const chordsSection = _createTrackMetaSection(
      "sheet.png",
      `<b>Chords for Key:</b> <br> <div>${chordList}</div>`
    );
    const timeSignature = _createTrackMetaSection(
      "metronome.png",
      `<b>Time Signature</b> <br> ${track.time_signature}/4`
    );
    const trackSectionBlocks = _createSectionBlocks(track, sections);
    const html = `
            <ul class="list-group">
                <li class="list-group-item bg-dark text-white d-flex align-items-center">
                    <aside class="me-3">
                        <img src="img/file.png" alt="File icon" width="32" />
                    </aside>
                    <div>
                        <h4 class="mb-0">Overview</h4>
                        <p class="mb-0 text-muted">The following data may not be 100% accurate</p>
                    </div>
                </li>
                ${displayKeySection}
                ${tempoSection}
                ${durationSection}
                ${chordsSection}
                ${timeSignature}
            </ul>
            <hr />
            <div>
                <h4>Section Duration and keys</h4>
                <div class="d-flex rounded overflow-hidden">${trackSectionBlocks}</div>
            </div>
        `;
    trackAnalysis.insertAdjacentHTML("beforeend", html);
    trackChartCtrl.draw({ sections, bars, beats });
  };

  return {
    getDOMElements() {
      return {
        searchForm,
        searchInput,
        searchButton,
        trackList,
        trackAnalysis,
      };
    },
    createTracks(tracks) {
      return _createTracks(tracks);
    },
    createTrackMeta(track) {
      return _createTrackMeta(track);
    },
  };
})(TrackChartController);

export default UIController;
