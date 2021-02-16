
require('./utils')
local log = io.open("valid-frames.csv", "w")
inputs = load_tas_file("valid-frames.tas")
-- was 33!
local seed = prng_init(37 - 4)

local offs = 0
if emu.nesl then offs = -1 end

emu.poweron()
for i=1,2649,1 do
    joypad.set(1, inputs[emu.framecount() + offs] or {})
    emu.frameadvance()
end
local startjumping = savestate.object()
local start = savestate.object()
savestate.save(start)

for rng=1,0x7FFF,1 do
    frame_inputs = nil
    log:flush()
    savestate.load(start)
    seed = prng_advance(seed)
    prng_apply(seed)

    for i=1,250,1 do
        joypad.set(1, inputs[emu.framecount() + offs] or {})
        emu.frameadvance()
    end
    log:write(string.format("%02X,", memory.readbyte(Enemy_Y_Position + 2)))
    for i=1,50,1 do
        joypad.set(1, inputs[emu.framecount() + offs] or {})
        emu.frameadvance()
    end

    -- jump over low fireball if needed
    memory.writebyte(0x79E, 0x00)
    -- jump over low fireball if needed
    if EnemyY(0) == 96 then
        joypad.set(1, { right = true, B = true, A = true })
    end
    emu.frameadvance()

    for i=1,32 do
        joypad.set(1, { right = true, B = true })
        emu.frameadvance()
    end

    local victories = 0
    local psv = 0
    local bowserdir = memory.readbyte(BowserMovementSpeed)
    if bowserdir >= 0x80 then
        log:write("F")
        victories = 15
    else
        savestate.save(startjumping)
        for i=1,18,1 do
            local win = false
            savestate.load(startjumping)
            for j=1,i,1 do
                joypad.set(1, { right = true, B = true })
                emu.frameadvance()
            end
            for j=1,59,1 do
                local inp = { right = true, B = true, A = j <= 32 - i }
                joypad.set(1, inp)
                emu.frameadvance()
                if memory.readbyte(OperMode) == 0x2 then
                    -- victory!
                    win = true
                    break
                end
            end
            if win then
                victories = victories + 1
                log:write("O")
            else
                log:write("_")
            end
        end
    end

    log:write(string.format(",%d\n", victories))
    log:flush()
end

emu.pause()
