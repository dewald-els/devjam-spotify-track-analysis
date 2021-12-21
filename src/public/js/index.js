import APIController from "./api.controller.js"
import UIController from './ui.controller.js'

const App = ((APICtrl, UICtrl) => {

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

App.init();
