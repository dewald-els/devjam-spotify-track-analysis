import { determineChordsFromKey } from './music.js'

const TrackChartController = (() => {
    const context = document.getElementById('trackChart').getContext('2d')

    const _createSectionChart = (sections) => {

        const labels = sections.map((section, idx) => {
            const cycle = determineChordsFromKey(section.mode, section.key);
            return `${ cycle.displayKey + ' ' + cycle.mode }`
        })

        const keyConfidence = sections.map((section, idx) => {
            return section.key_confidence
        })

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Key Confidence (1 - Confident, 0 - Not Confident)',
                    data: keyConfidence,
                    borderColor: 'orange',
                    backgroundColor: 'red',
                }
            ]
        }
    }

    const _draw = ({ sections }) => {
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
                        text: 'Track Analysis - Sections'
                    }
                }
            },
        };

        let activeChart = Chart.getChart("trackChart")
        if (activeChart) {
            activeChart.destroy();
        }
        new Chart(context, config)
    }

    return {
        draw(data) {
            _draw(data)
        }
    }
})()

export default TrackChartController