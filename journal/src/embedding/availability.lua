local llm = require("llm")
local types = require("types")

local M = {}

function M.state(): any
    local model, err = llm.resolve_model(types.EMBEDDING_MODEL)
    if not model then
        return { status = "unavailable", kind = errors.UNAVAILABLE,
            message = "Journal embedding model unavailable: " .. tostring(err) }
    end
    return { status = "available" }
end

return M
