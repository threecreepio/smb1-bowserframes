import React, { useState } from 'react';
import { FrameImage } from '../FrameImage/FrameImage';
import { Jumpbar } from '../Jumpbar/Jumpbar';
import { PellssonFR } from './PellssonFR';
import { PodobooValue } from '../PodobooValue/PodobooValue';
import { TimeEstimate } from './TimeEstimate';
import { PractiseFrame } from './PractiseFrame';

// there are 21 frames in a framerule!
const frameruleFrames = 21;

// this number is an offset to convert the rng offset to the exported folder names. trial and error..
const rngBaseOffset = 2248;

// adjust data based on lag frames from powerup grabs.
const powerupFrameLag = [0, 122, 435];

export const Frame = (props: { powerup: number, fr: number, i: number, runStartedFrame: number, videoIndex: number, setVideoIndex: (v: number) => void }) => {
    const runFrame = rngBaseOffset + (frameruleFrames * props.fr) + props.i;
    const actualFrame = runFrame + powerupFrameLag[props.powerup];
    const [overrideImage, setOverrideImage] = useState<string | null>(null);
    
    return (
        <div className="frame" style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px', borderRadius: '8px' }}>
            <FrameImage frame={actualFrame} overrideImage={overrideImage} videoIndex={props.videoIndex} setVideoIndex={props.setVideoIndex} />
            <Jumpbar frame={actualFrame} videoIndex={props.videoIndex} />
            <div style={{ display: 'flex', margin: '8px 0 2px', gap: 8 }}>
                <PodobooValue powerup={props.powerup} frame={actualFrame} setOverrideImage={setOverrideImage} />
                <div className="frameinfo">
                    <PellssonFR fr={props.fr} frame={frameruleFrames - 1 - props.i} />
                    <PractiseFrame frame={actualFrame} />
                    <TimeEstimate startingFrame={props.runStartedFrame} frame={runFrame} />
                </div>
            </div>
        </div>
    );
}