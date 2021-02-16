import './Frame.css';
import React from 'react';
import { Frame } from './Frame';

// there are 21 frames in a framerule!
const frameruleFrames = 21;

export const Framerule = (props: { powerup: number, fr: number, runStartedFrame: number, videoIndex: number, setVideoIndex: (v: number) => void }) => {
    let images = [];
    for (let i=0; i<frameruleFrames; ++i) {
        images.push(<Frame key={i} powerup={props.powerup} fr={props.fr} i={i} runStartedFrame={props.runStartedFrame} videoIndex={props.videoIndex} setVideoIndex={props.setVideoIndex} />)
    }

    return (
        <div style={{ maxWidth: 2000, margin: '32px auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px 8px' }}>
            {images}
        </div>
    );
}
