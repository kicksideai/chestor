local function embed(input: any): (any?, error?)
    if type(input) ~= "table" or type(input.input) ~= "table" then
        return nil, errors.new({kind = errors.INVALID, message = "embedding fixture requires a text batch"})
    end
    local dimensions = input.options and input.options.dimensions
    if dimensions ~= 512 then
        return nil, errors.new({kind = errors.INVALID, message = "embedding fixture requires 512 dimensions"})
    end
    local embeddings = {}
    for _, text in ipairs(input.input) do
        if type(text) ~= "string" or text == "" then
            return nil, errors.new({kind = errors.INVALID, message = "embedding fixture requires nonempty text"})
        end
        local vector = {}
        for index = 1, dimensions do vector[index] = 0 end
        for index = 1, #text do
            local slot = (string.byte(text, index) + index) % dimensions + 1
            vector[slot] = vector[slot] + 1
        end
        local magnitude = 0
        for _, value in ipairs(vector) do magnitude = magnitude + value * value end
        magnitude = math.sqrt(magnitude)
        for index, value in ipairs(vector) do vector[index] = value / magnitude end
        embeddings[#embeddings + 1] = vector
    end
    return {success = true, result = {embeddings = embeddings}, model = input.model}, nil
end
return {embed = embed, status = function(): any return {success = true, status = "healthy"} end}
