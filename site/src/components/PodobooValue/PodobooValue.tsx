import './PodobooValue.css'
import React, { useState } from 'react';
import images from './images/*.png';
import { usePromise } from '../../utils';
import heightFiles from './heights/*.bin';

//  extended set of podoboo rngs!
const podobooWraparound = 0x7FFF * 3;

// diff between the screenshots and the podoboo data
const dataOffset = -3;

const data = [];
const setPowerup = async pup => {
    if (data[pup]) return await data[pup];
    return data[pup] = (async () => {
        const res = await fetch(heightFiles[`podoboo-heights-${pup || 0}`]);
        const bin = Buffer.from(await res.arrayBuffer());
        if (res.status === 200 && res.headers.get('content-type') === 'application/octet-stream') {
            return bin;
        }
    })();
}

const difficulties = [
    [100, 109],
    [ 96, 109],
    [100, 109],
];

export const PodobooValue = (props: { powerup: number, frame: number, setOverrideImage: (v: string | null) => void }) => {
    const [height, setHeight] = useState(-1);

    usePromise(async () => {
        const data = await setPowerup(props.powerup);
        if (!data) setHeight(-1);
        else {
            const height = data.readUInt8((props.frame + dataOffset) % podobooWraparound);
            setHeight(height);
        }
    }, [props.powerup, props.frame]);

    const enableOverride = () => props.setOverrideImage(images[height]);
    const disableOverride = () => props.setOverrideImage(null);

    let difficulty = 'easy';
    if (height > difficulties[props.powerup][0]) difficulty = 'hard';
    if (height > difficulties[props.powerup][1]) difficulty = 'impossible';

    if (height === -1) {
        return <div className="podoboo" />;
    }

    return (
        <div onMouseOver={enableOverride} onMouseOut={disableOverride} className={`podoboo podoboo-${difficulty}`} title={`${height} - ${difficulty} podoboo. preview shows smallest possible jump to clear the gap.`}>
            <img src={require('./podoboo.png')} />
        </div>
    )
}
