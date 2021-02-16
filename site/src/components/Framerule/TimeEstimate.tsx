import React from 'react';
import Duration from 'luxon/src/duration'

// how many frames it takes to get through an optimal bowser room
const bowserroomFrames = 437;

// duration of an NES frame in milliseconds
const frameMillis = 16.639263492063357;

export const TimeEstimate = (props: { startingFrame: number, frame: number }) => {
    let endingFrame = props.frame + bowserroomFrames;
    // figure out the exact millisecond time of the run
    let millis = Math.ceil((endingFrame - props.startingFrame) * frameMillis);
    // and convert to a friendly string
    return (
        <div title="Estimated time assuming no lag frames, first frame axe grab with a standard bowser room." style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
            <div>Run time</div>
            <div>{Duration.fromMillis(millis).toFormat("m:ss.SSS")}</div>
        </div>
    );
}
