import React from 'react';

// how many framerules we should offset the selected 8-4 by to arrive at the bowser room
const bowserroomFrameruleOffset = 110;

export const PellssonFR = (props: { fr: number, frame: number }) => {
    const frame = props.frame;
    // figure out the framerule number this page
    const fr = bowserroomFrameruleOffset + props.fr - (frame == 20 ? 1 : 0);

    return (
        <div title="Pellsson values when entering the bowser room" style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
            <div>Pellsson</div>
            <div>{fr}-{frame.toString(21).toUpperCase()}</div>
        </div>
    );
}