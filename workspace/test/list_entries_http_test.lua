local response
local rows = {{ id = 'folder', name = 'Northwind', icon = 'tabler:folder' }, { id = 'unnamed' }}
package.preload.http = function() return { STATUS = { INTERNAL_ERROR = 500 } } end
package.preload.handlers = function() return { list = function(parent)
    assert(parent == 'parent')
    return rows
end } end
package.preload.support = function() return { context = function()
    return { query = function(_, key) assert(key == 'parent_id'); return 'parent' end },
        { write_json = function(_, value) response = value end }
end } end
dofile('src/api/list_entries.lua').handler()
assert(response.success == true)
assert(response.entries == rows, 'workspace list retains its existing envelope')
assert(#response.items == 2, 'shared picker receives the same readable entries')
assert(response.items[1].id == 'folder')
assert(response.items[1].label == 'Northwind')
assert(response.items[1].icon == 'tabler:folder')
assert(response.items[2].label == 'Untitled component', 'catalog never names an entry by address')
print('Workspace list HTTP: 1 passed')
