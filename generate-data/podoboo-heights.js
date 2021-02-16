
const files = {
    'podoboo-heights.csv': 'podoboo-heights-0.bin',
    'podoboo-heights-fire.csv': 'podoboo-heights-1.bin',
    'podoboo-heights-smallfire.csv': 'podoboo-heights-2.bin',
};

for (const fname of Object.keys(files)) {
    const f = require('fs').readFileSync('./' + fname).toString().replace(/\s/ig, '');
    const o = Buffer.alloc(0x8000 * 3);
    for (let i=0; i<o.byteLength; i++) {
        const v = parseInt(f.substring(i * 2, (i * 2) + 2), 16);
        o[i] = v;
    }
    require('fs').writeFileSync('./' + files[fname], o);
}