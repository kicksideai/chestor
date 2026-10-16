local llm = require("llm")
local db = require("db")

-- The model seam the refine pass runs on. It is deliberately thin: one text
-- prompt in, one text answer out, so the pass can be exercised against a
-- scripted judge and the live class alike. _llm stays swappable for that.
local M = {}

M._llm = llm :: any

M.TIMEOUT_SECONDS = 60
M.MAX_TOKENS = 900

-- Returns a judge callable bound to one model class. Failure comes back as an
-- error string; the caller decides that only the refine pass is lost.
function M.for_model(model: string): any
    local resolved = db.trim(model)
    return function(prompt_text: string): (string?, string?)
        local engine = M._llm
        if type(engine) ~= "table" then return nil, "no model runtime is configured" end
        if resolved == "" then return nil, "refine model is required" end
        local response, err = (engine :: any).generate(prompt_text, {
            model = resolved,
            temperature = 0,
            max_tokens = M.MAX_TOKENS,
            timeout = M.TIMEOUT_SECONDS,
        })
        if err then return nil, err end
        local text = type(response) == "table" and response.result or nil
        if type(text) ~= "string" or db.trim(text) == "" then
            return nil, "refine model returned no text"
        end
        return text, nil
    end
end

return M
