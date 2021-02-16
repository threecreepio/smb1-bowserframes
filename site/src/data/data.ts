import fs from 'fs';

export const jumpFrames = fs.readFileSync(__dirname + '/valid-frames.bin');
