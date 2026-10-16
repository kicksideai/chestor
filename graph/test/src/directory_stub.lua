return { resolve = function(input: any): any
    if input.id then return { exists = input.id:match("^member%-[%w%-]+$") ~= nil } end
    local out = {}
    for _, ref in ipairs(input.refs or {}) do
        local id = ref.type == "user" and ref.id:match("^(member%-[%w%-]+)@northwind.example$") or nil
        out[#out + 1] = { type = ref.type, id = id or ref.id, label = "Northwind Member", sublabel = ref.id }
    end
    return { principals = out }
end }
