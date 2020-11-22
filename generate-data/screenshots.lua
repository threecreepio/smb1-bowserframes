
require('./utils')
inputs = load_tas_file("screenshots.tas")
local seed = prng_init()

emu.poweron()
for i=1,2651,1 do
    joypad.set(1, inputs[emu.framecount()] or {})
    emu.frameadvance()
end
local start = savestate.object()
savestate.save(start)

for rng=0,0x7FFE,1 do
    print(rng)
    emu.registerafter(nil)
    savestate.load(start)
    seed = prng_advance(seed)
    prng_apply(seed)
    local nn = 0

    for i=1,170,1 do
        joypad.set(1, inputs[emu.framecount()] or {})
        emu.frameadvance()
    end

    startframe = emu.framecount()
    emu.registerafter(function ()
        local fc = emu.framecount() - startframe
        if fc % 2 == 0 then
            gui.savescreenshotas(string.format("screenshots/seed-%06d/%03d.png", rng, fc / 2))
        end
    end)
    
    for i=1,130,1 do
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
        for j=1,70,1 do
            joypad.set(1, inputs[emu.framecount()] or {})
            emu.frameadvance()
            if memory.readbyte(OperMode) == 0x2 then
                emu.frameadvance()
                emu.frameadvance()
                emu.frameadvance()
                break
            end
        end
    else
        local startjumping = savestate.object()
        savestate.save(startjumping)
        local victories = 0
        for i=1,15,1 do
            if victories > 0 then
                break
            end
            savestate.load(startjumping)
            for j=1,i,1 do
                joypad.set(1, { right = true, B = true })
                emu.frameadvance()
            end
            local c = false
            for j=1,59,1 do
                local inp = { right = true, B = true, A = true }
                if j > 32 - i then
                    inp = {}
                end
                joypad.set(1, inp)
                emu.frameadvance()
                if c == false and memory.readbyte(OperMode) == 0x2 then
                    -- victory!
                    c = true
                    victories = victories + 1
                end
            end
        end
    end
end

emu.pause()
