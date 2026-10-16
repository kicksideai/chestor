-- Shared constants. The workspace owns no tables, no tree, and no class of its
-- own: an entry IS a component (parent_id/position give the tree, the access
-- cascade gives sharing), and its KIND is its impl's contract.binding meta. This
-- module only holds access masks + error strings.

local consts = {}

-- Mirrors component.ACCESS; kept for handlers that reason about masks.
consts.ACCESS = { READ = 1, WRITE = 2, DELETE = 4, ADMIN = 8, FULL = 15 }

consts.ERROR = {
    NOT_FOUND = "entry not found",
    NAME_REQUIRED = "entry name is required",
    SERVICE = "component service unavailable",
}

return consts
