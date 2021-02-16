import React from 'react';

// offset required for the pictures to match the practise rom!
const practiseromOffset = 40;

// the rng wraps around after 21 framerules, this will adjust the practise rom offset.
const practiseromWrap = 4681 * 21;

export const PractiseFrame = (props: { frame: number }) => {
    // const practiseFrame = (((startingRNGOffset+i) + lagFrames + 40) % rngWraparound)
    const practiseFrame = ((props.frame + practiseromOffset) % practiseromWrap).toString(16).padStart(5, ' ').toUpperCase();
    return (
        <div title="Enter this value in the bowser rom to test the pattern" style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
            <div>Practise rom</div>
            <div>{practiseFrame}</div>
        </div>
    );
}