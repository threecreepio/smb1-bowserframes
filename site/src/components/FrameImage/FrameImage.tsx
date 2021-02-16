import React from 'react';

let IMAGE_URL = 'http://localhost:8001';
if (process.env.NODE_ENV === 'production') {
    IMAGE_URL = '../bowserframes-screenshots';
}

// strip off the start of the video
const offsetIntoVideo = 61;
const videoImageCount = 44;

// find the full path to the rng images
const getRNGImage = (frame, videoIndex) => {
    let folderName = (frame % 0x7FFF).toString().padStart(6, '0');
    //let folderName = ((frame+2248)%0x7FFF).toString(16).padStart(4, '0');
    return `${IMAGE_URL}/seed-${folderName}/${(offsetIntoVideo + videoIndex).toString().padStart(3, '0')}.png`
}

export const FrameImage = (props: { overrideImage: string | null, frame: number, videoIndex: number, setVideoIndex: (v: number) => void }) => {
    // const practiseFrame = (((startingRNGOffset+i) + lagFrames + 40) % rngWraparound)
    const setImage = evt => props.setVideoIndex(Math.max(0, Math.min(videoImageCount, Number(evt.target.value))));
    const idx = Math.min(videoImageCount, props.videoIndex);
    return (
        <div className="image">
            <img
                style={{ margin: 'auto', maxWidth: '256px', width: '100%', display:'block' }}
                src={props.overrideImage || getRNGImage(props.frame, props.videoIndex)} />
            <input className="frameslider" type="range" min="1" max={videoImageCount} value={idx} onChange={setImage} />
        </div>
    );
}