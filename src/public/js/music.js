export const KEY_LEGEND = {
    0: 'C',
    1: 'C#',
    2: 'D',
    3: 'D#',
    4: 'E',
    5: 'F',
    6: 'F#',
    7: 'G',
    8: 'G#',
    9: 'A',
    10: 'A#',
    11: 'B',
}

const KEY_MAJOR = 1
const KEY_MINOR = 0

const CYCLE_OF_FIFTHS = [
    {
        key: 'C',
        displayKey: 'C',
        chords: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'Bdim']
    },
    {
        key: 'G',
        displayKey: 'G',
        chords: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']
    },
    {
        key: 'D',
        displayKey: 'D',
        chords: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#dim']
    },
    {
        key: 'A',
        displayKey: 'A',
        chords: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#dim']
    },
    {
        key: 'E',
        displayKey: 'E',
        chords: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#dim']
    },
    {
        key: 'B',
        displayKey: 'B',
        chords: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#dim']
    },
    {
        key: 'F#',
        displayKey: 'F#',
        chords: ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#dim']
    },
    {
        key: 'C#',
        displayKey: 'D♭',
        chords: ['D♭', 'E♭m', 'Fm', 'G♭', 'A♭', 'B♭m', 'Cdim']
    },
    {
        key: 'G#',
        displayKey: 'A♭',
        chords: ['A♭', 'B♭m', 'Cm', 'D♭', 'E♭', 'Fm', 'Gdim']
    },
    {
        key: 'D#',
        displayKey: 'E♭',
        chords: ['E♭', 'Fm', 'Gm', 'A♭', 'B♭', 'Cm', 'Ddim']
    },
    {
        key: 'A#',
        displayKey: 'B♭',
        chords: ['B♭', 'Cm', 'Dm', 'E♭', 'F', 'Gm', 'Adim']
    },
    {
        key: 'F',
        displayKey: 'F',
        chords: ['F', 'Gm', 'Am', 'B♭', 'C', 'Dm', 'Edim']
    }
]

export function determineChordsFromKey(mode, keyIndex) {
    const keyChord = KEY_LEGEND[keyIndex];
    const majorMinor = mode === KEY_MINOR ? 'Minor' : 'Major';
    return {
        ...CYCLE_OF_FIFTHS.find(cycle => cycle.key === keyChord),
        mode: majorMinor
    };
}
