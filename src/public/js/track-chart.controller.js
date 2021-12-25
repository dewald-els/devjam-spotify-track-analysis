import { determineChordsFromKey } from './music.js'
const TrackChartController = (() => {
    const context = document.getElementById('trackChart').getContext('2d')

    const _createSectionChart = (sections) => {

        const labels = sections.map((section, idx) => {
            const cycle = determineChordsFromKey(section.mode, section.key);
            return cycle.displayKey + ' ' + cycle.mode
        })

        const keyConfidence = sections.map((section, idx) => {
            return section.key_confidence
        })

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Key Confidence',
                    data: keyConfidence,
                    borderColor: 'red',
                    backgroundColor: 'orange',
                }
            ]
        }
    }

    const _draw = ({ sections, bars, beats }) => {
        const data = _createSectionChart(sections)
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Track Analysis'
                    }
                }
            },
        };

        const chart = new Chart(context, config)
    }

    return {
        draw(data) {
            _draw(data)
        }
    }
})()

export default TrackChartController