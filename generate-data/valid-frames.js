const f = require('fs').readFileSync('./valid-frames.csv').toString().split(/\r?\n/).map(x => x.split(','));

const bfr = Buffer.alloc(0x7FFF * 4);

for (let i=0; i<0x7FFF; ++i) {
    if (f[i][0] == 'F') {
        bfr.writeUIntLE(0xFFFFFFFF, i * 4, 4);
    } else {
        let v = 0;
        f[i][0].split('').forEach((c, i) => {
            v = v | (c == '_' ? 0 : (1 << i));
        });
        bfr.writeUIntLE(v, i * 4, 4);
    }
}

require('fs').writeFileSync('valid-frames.bin', bfr);
