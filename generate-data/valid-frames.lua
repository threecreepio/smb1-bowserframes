
require('./utils')
local log = io.open("valid-frames.json", "w")

log:write("[\n")
inputs = load_tas_file("valid-frames.tas")
local seed = prng_init()
frame_inputs = nil

emu.poweron()
for i=1,2651,1 do
    joypad.set(1, inputs[emu.framecount()] or {})
    emu.frameadvance()
end
local start = savestate.object()
savestate.save(start)


for rng=0,0x7FFE,1 do
    frame_inputs = nil
    if rng > 0 then
        log:write(",\n")
    end
    log:flush()
    savestate.load(start)
    seed = prng_advance(seed)
    prng_apply(seed)

    for i=1,300,1 do
        joypad.set(1, inputs[emu.framecount()] or {})
        emu.frameadvance()
    end

    -- jump over low fireball if needed
    if EnemyY(0) == 96 then
        joypad.set(1, { right = true, B = true, A = true })
    end
    for i=1,1,1 do
        emu.frameadvance()
    end
    frame_inputs = nil

    for i=1,30,1 do
        joypad.set(1, inputs[emu.framecount()] or {})
        emu.frameadvance()
    end

    local bowserdir = memory.readbyte(BowserMovementSpeed)
    if bowserdir >= 0x80 then
        log:write("-1")
    else
        local startjumping = savestate.object()
        savestate.save(startjumping)
        local victories = 0
        for i=1,15,1 do
            savestate.load(startjumping)
            for j=1,i,1 do
                joypad.set(1, { right = true, B = true })
                emu.frameadvance()
            end
            for j=1,59,1 do
                local inp = { right = true, B = true, A = true }
                if j > 32 - i then
                    inp = {}
                end
                joypad.set(1, inp)
                emu.frameadvance()
                if memory.readbyte(GameEngineSubroutine) == 0xB then
                    -- mario is dead :(
                    break
                end
                if memory.readbyte(OperMode) == 0x2 then
                    -- victory!
                    victories = victories + 1
                    break
                end
            end
        end
        log:write(string.format("%d", victories))
    end
end

log:write("]");
log:close()
emu.pause()
