import { html, neverland, render, useEffect, useState } from 'neverland'
import Duration from 'luxon/src/duration'
import validFrames from '../valid-frames.json'

let IMAGE_URL = 'http://localhost:8000';
if (process.env.NODE_ENV === 'production') {
    IMAGE_URL = '../bowserframes-screenshots';
}


const changeFnNumber = fn => evt => fn(Number(evt.target.value));

const maxImage = 105;
const frame = 1000 / 60.098813897441;

const useLocalState = (name, initialValue) => {
    const [value, setValue] = useState(localStorage[name] === undefined ? initialValue : JSON.parse(localStorage[name]));
    useEffect(() => { localStorage[name] = JSON.stringify(value); }, [value]);
    return [value, setValue];
}

const App = neverland(() => {
    const [fr, setFr] = useLocalState("fr", 743); // 765
    const [delay, setDelay] = useLocalState("delay", 0);
    const [offset, setOffset] = useState(0);
    const [image, setImage] = useState(maxImage);
    
    const delaySeconds = Duration.fromMillis(480 + (delay + 8) * (21 * frame)).toFormat("s.SS");

    const baseOffset = 2269 - 21;
    const start = ((fr * 21) + baseOffset + (offset * 21));
    const getRNGUrl = f => {
        let folderName = f.toString().padStart(6, '0');
        return `${IMAGE_URL}/seed-${folderName}/${image.toString().padStart(3, '0')}.png`
    }

    const estimateTime = i => {
        let endingFrame = start + i + 437;
        let startingFrame = (9 + Number(delay)) * 21;
        let seconds = (endingFrame - startingFrame) / 60.098813897441;
        let duration = Duration.fromMillis(Math.ceil(seconds * 1000)).toFormat("m:ss.SSS");
        return `${duration}`;
    }

    const estimateLeniency = l => {
        if (l === undefined) return html`<span style="color:gray">Unmapped</span>`;
        if (l === -1) return html`<span style="color:green">Forward</span>`;
        if (l < 1) return html`<span style="color:red">Impossible</span>`;
        if (l == 1) return html`<span style="color:red">Frame perfect</span>`;
        if (l < 4) return html`<span style="color:red">${l} frames</span>`;
        if (l < 8) return html`<span style="color:orange">${l} frames</span>`;
        if (l >= 8) return html`<span style="color:green">Safe</span>`;
    }

    const setFrV = (v) => setFr(v > 0 ? v : 743);
    const setDelayV = (v) => setDelay(Math.max(0, Math.min(1000, v)));
    const setImageV = v => setImage(Math.min(maxImage, Math.max(v, 0)));
    const reduceOffset = v => setOffset(ofs => ofs - 1)
    const increaseOffset = v => setOffset(ofs => ofs + 1)

    let images = [];
    for (let i=0; i<21; ++i) {
        const startingFrame = (start+i) % (0x7FFF);
        const leniency = validFrames[startingFrame];
        
        images.push(html`<div style="background:rgba(0, 0, 0, 0.3);padding:8px;border-radius:8px;">
                <img style="margin:auto;max-width:256px;width:100%;display:block;" src=${getRNGUrl(startingFrame)} />
                <div style="text-align:center;margin-top:8px;">
                    ${fr+110+offset}-${(20-i).toString(21).toUpperCase()}
                </div>
                <div style="text-align:center;">${estimateTime(i)}</div>
                <div style="text-align:center;">${estimateLeniency(leniency)}</div>
        </div>`);
    }
    return html`<div>
        <div style="max-width:400px;margin:auto;display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:12px;">
            <label>
                <div>8-4 Framerule</div>
                <input type="number" value=${fr} onInput=${changeFnNumber(setFrV)} />
            </label>
            <label>
                <div>Starting delay (${delaySeconds}s)</div>
                <input type="number" value=${delay} onInput=${changeFnNumber(setDelayV)} />
            </label>
        </div>
        <div style="max-width:400px;margin:12px auto;display:flex;justify-content:space-between;align-items:center;">
            <button onClick=${reduceOffset}>Faster</button>
            <span style="line-height:1;">FR ${fr+110+offset}</span>
            <button onClick=${increaseOffset}>Slower</button>
        </div>
        <div style="margin:32px auto;display:grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;gap:16px 8px;">
            ${images}
        </div>
        <div style="max-width:400px;margin:auto;display:flex;justify-content:space-between;align-items:center;">
            <label>
                <div>Frame</div>
                <input type="range" min="1" max=${maxImage} style="width:400px" value=${image} onChange=${changeFnNumber(setImageV)} />
            </label>
        </div>
    </div>`;
});

render(document.getElementById('app'), App);
