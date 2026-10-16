local function run(input: table): table
    local input_tbl: table = type(input) == "table" and input or {}
    local projection: table = type(input_tbl.projection) == "table" and input_tbl.projection or {}
    local body: table = type(projection.body) == "table" and projection.body or {}
    local range: table = type(input_tbl.range) == "table" and input_tbl.range or {}
    body.processed = (tonumber(body.processed) or 0) + (tonumber(range.processed_count) or 0)
    return {
        body = body,
        last_seq = tonumber(range.to_seq) or nil,
    }
end

return { run = run }
