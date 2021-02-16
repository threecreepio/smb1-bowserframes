
require('./utils')
inputs = load_tas_file("podoboo-heights.tas")

local offs = 0
if emu.nesl then offs = -1 end

emu.poweron()
for i=1,2649,1 do
    joypad.set(1, inputs[emu.framecount() + offs] or {})
    emu.frameadvance()
end
local start = savestate.object()
savestate.save(start)

local aligment_itc = {17,10,3}
local count = 0
for al=1,3 do
    local seed = prng_init(38)
    local itc = aligment_itc[al]
    for rng=1,0x7FFF do
        count = count + 1
        savestate.load(start)
        memory.writebyte(IntervalTimerControl, itc)
        prng_apply(seed)
        if itc == 0 then itc = 21 else itc = itc - 1 end
        seed = prng_advance(seed)
        print(string.format("%5d : %02X%02X%02X%02X%02X%02X%02X : %d", count, seed[1], seed[2], seed[3], seed[4], seed[5], seed[6], seed[7], itc))
    end
end

emu.pause()
