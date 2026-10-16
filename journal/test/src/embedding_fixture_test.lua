local test = require("test")
local llm = require("llm")
local types = require("types")

local run_cases = test.run_cases(function()
    test.describe("Journal embedding fixture", function()
        test.it("resolves the background worker's embedding class with its declared dimensions", function()
            local result, err = llm.embed({"Journal fixture"}, {
                model = types.EMBEDDING_MODEL,
                dimensions = types.EMBEDDING_DIMENSIONS,
            })
            test.is_nil(err, tostring(err))
            test.not_nil(result)
            test.eq(#result.result, 1)
            test.eq(#result.result[1], types.EMBEDDING_DIMENSIONS)
        end)
    end)
end)
return {run = run_cases}
