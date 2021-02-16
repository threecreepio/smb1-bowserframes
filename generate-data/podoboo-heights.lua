
require('./utils')
outputv = "podoboo-heights.csv"
local log = io.open(outputv, "w")
inputs = load_tas_file("podoboo-heights.tas")

local offs = 0
if emu.nesl then offs = -1 end

emu.poweron()
if emu.nesl then
    emu.frameadvance()
end

for i=1,2649,1 do
    joypad.set(1, inputs[emu.framecount() + offs] or {})
    emu.frameadvance()
end
local start = savestate.object()
savestate.save(start)

local n = {}
local aligment_itc = {3,17,10}
local count = 0
local seed = prng_init(38)

memory.writebyte(IntervalTimerControl, aligment_itc[1])
prng_apply(seed)

local images = {}
for al=1,3 do
    local itc = aligment_itc[al]
    for rng=1,0x7FFF do
        count = count + 1
        savestate.load(start)
        memory.writebyte(IntervalTimerControl, itc)
        prng_apply(seed)

        if itc == 0 then itc = 20 else itc = itc - 1 end
        seed = prng_advance(seed)

        for i=2649,2898,1 do
            joypad.set(1, inputs[emu.framecount() + offs] or {})
            emu.frameadvance()
        end
        local height = memory.readbyte(Enemy_Y_Position + 2)

        if images[height] == nil then
            images[height] = true
            gui.savescreenshotas(string.format("ss/%d.png", height))
        end

        log:write(string.format("%02X\n", height))
        log:flush()
        emu.frameadvance()
    end
end

emu.pause()
