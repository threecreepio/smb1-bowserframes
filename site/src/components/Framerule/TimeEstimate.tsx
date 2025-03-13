import React from 'react';
import Duration from 'luxon/src/duration'

// how many frames it takes to get through an optimal bowser room
const bowserroomFrames = 437;

// duration of an NES frame in milliseconds
const frameMillis = 16.63926349135486;

export const TimeEstimate = (props: { startingFrame: number, frame: number }) => {
    let endingFrame = props.frame + bowserroomFrames;
    // figure out the exact second time of the run
    let totalMillis = Math.round((endingFrame - props.startingFrame) * frameMillis);

    return (
        <div title="Estimated time assuming no lag frames, first frame axe grab with a standard bowser room." style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
            <div>Run time</div>
            <div>{Duration.fromMillis((totalMillis)).toFormat("m:ss.SSS")}</div>
        </div>
    );
}
