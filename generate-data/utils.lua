require('./consts')

-- get level x coordinate of a specific object
function EnemyX(enemy_id)
    local x = memory.readbyte(Enemy_X_Position + enemy_id)
    local xpage = memory.readbyte(Enemy_PageLoc + enemy_id)
    return x + (xpage * 0x100)
end

-- get level y coordinate of a specific object
function EnemyY(enemy_id)
    local y = memory.readbyte(Enemy_Y_Position + enemy_id)
    return 240 - y
end

function prng_advance(seed)
    local carry = bit.bxor(bit.band(seed[1], 0x02), bit.band(seed[2], 0x02)) > 0
    local nseed = {}
    for i=1,7,1 do
        local v = bit.band(bit.rshift(seed[i], 1), 0xFF)
        if carry then
            v = bit.bor(v, 0x80)
        end
        carry = bit.band(seed[i], 1) > 0
        nseed[i] = v
    end
    return nseed
end

function prng_advance_by(seed,n)
    for i=1,n do
        seed = prng_advance(seed)
    end
    return seed
end

prng_init_count = 42

function prng_init(count)
    if count == nil then
        count = 37
    end
    local seed = { 0xA5, 0, 0, 0, 0, 0, 0 }
    for i=0,count,1 do
        seed = prng_advance(seed)
    end
    return seed
end

function prng_apply(seed)
    for i=1,7,1 do
        memory.writebyte(0x7A6 + i, seed[i])
    end
end

function prng_read(seed)
    local result = {}
    for i=1,7,1 do
        result[i] = memory.readbyte(0x7A6 + i)
    end
    return result
end


function abs(v)
    if v < 0 then
        return -v
    end
    return v
end

function load_tas_file(filename)
    local f = io.open(filename,'r')
    if f == nil then
        print(string.format("could not open file %s.", filename))
    end
    f:read()
    result = {}
    for i=0,1000000,1 do
        line = f:read()
        if line == nil then
            break
        end
        local inp = {}
        for c in line:gmatch(".") do
            if c == "A" then
                inp["A"] = true
            end
            if c == "B" then
                inp["B"] = true
            end
            if c == "S" then
                inp["select"] = true
            end
            if c == "T" then
                inp["start"] = true
            end
            if c == "U" then
                inp["up"] = true
            end
            if c == "D" then
                inp["down"] = true
            end
            if c == "L" then
                inp["left"] = true
            end
            if c == "R" then
                inp["right"] = true
            end
        end
        result[i] = inp
    end
    result["filename"] = filename
    return result
end
