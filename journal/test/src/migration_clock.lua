local M = { sleeps = 0, failure = nil }
function M.sleep(_duration: string)
    M.sleeps = M.sleeps + 1
end
return M
