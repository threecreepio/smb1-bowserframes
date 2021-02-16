import './Jumpbar.css';
import React from 'react';
import { jumpFrames } from '../../data/data';

// converts a leniency value from the tas to a text description.
const describeLeniency = l => {
    if (l >= 18) return 'Great';
    if (l < 1) return 'Impossible';
    if (l == 1) return 'Frame perfect';
    return `${l} frames`;
}

// classes to change color of the jumpbar
const jumpbarClass = l => {
    if (l < 1) return 'impossible';
    if (l < 4) return 'bad';
    if (l < 8) return 'ok';
}

export const Jumpbar = (props: { videoIndex: number, frame: number }) => {
    const set = jumpFrames.readUInt32LE((props.frame % 0x7FFF) * 4);

    let el = [];
    let good = 0;
    for (let i=0; i<18; ++i) {
        let isselected = ((props.videoIndex - 19) * 2) == i;
        let isgood = (set & (1 << i));
        if (isgood) good++;
        el.push(<div key={i} className={`${isselected ? "selected" : ""} ${isgood ? "good" : ""}`} />);
    }
    return <div title={describeLeniency(good)} className={`jumpbar jb-${jumpbarClass(good)}`}>{el}</div>;
}
