local context = require("context")
local queries = require("queries")
local recall = require("recall")
local graph = require("graph")
local support = require("support")

local function one_line(value: any): string
    return (support.trim(value):gsub("%s+", " "))
end

local function branch_resume_prompt(branch: any): string
    local task = branch and branch.task
    if type(task) ~= "table" then
        return "You are at the task tree root. Open a task branch to see where work stands, "
            .. "record facts under its task_id, and decompose it into subtasks when work splits."
    end
    local titles: { string } = {}
    for _, ancestor in ipairs(branch.ancestors or {}) do
        local title = one_line((ancestor :: any).title)
        if title ~= "" then titles[#titles + 1] = title end
    end
    local chain = #titles > 0 and table.concat(titles, " > ") or "(root)"
    local open_children = branch.counts and tonumber((branch.counts :: any).open_children) or 0
    if branch.resolved == "active" then
        local title = one_line((task :: any).title or (task :: any).id)
        return "You are on the active task \"" .. tostring(title) .. "\" under " .. chain
            .. ". It has " .. tostring(open_children) .. " open subtasks. Entries, checkpoints, and artifacts "
            .. "recorded without a task_id land here; record focus on an ancestor to go back up before working "
            .. "elsewhere, and decompose this task into subtasks when the work splits."
    end
    local title = one_line((task :: any).title or (task :: any).id)
    return "You are on task \"" .. tostring(title) .. "\" under " .. chain
        .. ". It has " .. tostring(open_children) .. " open subtasks. Record facts (entries, checkpoints, "
        .. "artifacts) under this task_id, and decompose it into subtasks when the work splits."
end

local function handler(input: any): (any?, error?)
    local journal_id, id_err = support.journal_id(input)
    if not journal_id then return { success = false, error = id_err } end
    local view = support.trim(input and input.view)
    if view == "" then view = "context" end
    local value: any = nil
    local err: any = nil
    if view == "brief" then
        value, err = queries.brief(journal_id, { limit = input.limit })
        if value then value = { brief = value } end
    elseif view == "context" then
        value, err = context.pack(journal_id, { tail_limit = input.limit })
        if value and not err then
            local page, page_err = graph.catalog(journal_id, { limit = 50 })
            if page then
                value.graphs = (page :: any).items
                value.graphs_truncated = (page :: any).has_more == true
                value.graphs_next_cursor = (page :: any).next_cursor
            end
            err = page_err
        end
        if value then value = { context = value } end
    elseif view == "cursor" then
        value, err = context.cursor(journal_id, {
            cursor_id = input.cursor_id,
            agent_id = input.agent or input.agent_id,
            limit = input.limit,
            inherited_limit = input.inherited_limit,
            delta_limit = input.delta_limit,
        })
        if value then value = { context = value } end
    elseif view == "tail" then
        value, err = queries.state(journal_id, input)
    elseif view == "authority" then
        value, err = queries.authority(journal_id, { limit = input.limit, offset = input.offset })
        if value then value = { authority = value } end
    elseif view == "event" then
        value, err = queries.event(journal_id, support.trim(input.event_id))
        if value then value = { event = value } end
    elseif view == "search" then
        local limit = math.max(1, math.min(math.floor(tonumber(input.limit) or 20), 100))
        local offset = math.max(0, math.floor(tonumber(input.offset) or 0))
        local options = { limit = limit + 1, offset = offset, validity = input.validity }
        if support.trim(input.search_mode) == "semantic" then
            value, err = recall.search_vector(journal_id, tostring(input.query or ""), options)
        else
            value, err = queries.search_text(journal_id, tostring(input.query or ""), options)
        end
        if value then
            local has_more = #value > limit
            if has_more then table.remove(value) end
            value = { events = value, has_more = has_more,
                next_cursor = has_more and { offset = offset + #value } or nil }
        end
    elseif view == "references" then
        value, err = queries.references(journal_id, {
            graph_id = input.graph_id,
            node_id = input.node_id,
            ref_id = input.ref_id,
            query = input.query,
            include_removed = input.include_removed == true,
            limit = input.limit,
            offset = input.offset,
        })
        if value then value = { references = value } end
    elseif view == "graphs" then
        local page, page_err = graph.catalog(journal_id, {
            query = input.query,
            limit = input.limit,
            after_rank = input.after_rank,
            after_updated_at = input.after_updated_at,
            after_graph_id = input.after_graph_id,
            fields = input.fields,
        })
        err = page_err
        if page then
            value = {
                graphs = (page :: any).items,
                has_more = (page :: any).has_more,
                next_cursor = (page :: any).next_cursor,
            }
        end
    elseif view == "tasks" then
        local rows, rows_err, cursor, has_more = queries.tasks(journal_id, {
            query = input.query,
            status = input.task_status or "active",
            limit = input.limit,
            after_sort_order = input.after_sort_order,
            after_updated_at = input.after_updated_at,
            after_id = input.after_id,
        })
        err = rows_err
        if rows then value = { tasks = rows, next_cursor = cursor, has_more = has_more } end
    elseif view == "branch" then
        local branch, branch_err = queries.branch(journal_id, input.task_id, {
            fact_limit = input.limit,
            lease_id = input.lease_id,
            roots = input.roots == true,
        })
        if branch then
            value = { branch = branch, resume_prompt = branch_resume_prompt(branch) }
        else err = branch_err end
    elseif view == "frontier" then
        value, err = queries.frontier(journal_id, {
            drill = input.category,
            root_task_id = input.task_id,
            limit = input.limit,
            cursor = input.cursor,
        })
        if value then value = { frontier = value } end
    elseif view == "changes" then
        value, err = queries.changes(journal_id, {
            since_seq = input.since_seq,
            since_checkpoint = input.agent,
            scope = input.scope,
            task_id = input.task_id,
            limit = input.limit,
        })
        if value then value = { changes = value } end
    elseif view == "tree" then
        value, err = queries.tree(journal_id, input.task_id, input.depth, input.limit)
        if value then value = { tree = value } end
    elseif view == "health" then
        value, err = queries.health(journal_id)
        if value then value = { health = value } end
    elseif view == "spans" then
        value, err = queries.spans(journal_id, {
            state = input.span_state,
            agent_id = input.span_agent_id or input.agent,
            task_id = input.task_id,
            since = input.since,
            limit = input.limit,
            after_activity_at = input.after_activity_at,
            after_span_id = input.after_span_id,
        })
        if value then value = { spans = value } end
    elseif view == "activity" then
        value, err = queries.activity(journal_id, {
            bucket = input.bucket,
            agent_id = input.span_agent_id or input.agent,
            since = input.since,
            until_ts = input.until_ts,
            limit = input.limit,
            after_bucket_at = input.after_bucket_at,
            after_agent_id = input.after_agent_id,
        })
        if value then value = { activity = value } end
    else
        return { success = false, error = "unknown Journal read view", view = view, journal_id = journal_id }
    end
    if err then return nil, err end
    local out = { success = true, view = view, journal_id = journal_id }
    for key, item in pairs(value or {}) do out[key] = item end
    if view == "search" or view == "tasks" or view == "tail" then
        for _, key in ipairs({ "events", "tasks", "artifacts" }) do
            if out[key] then out[key] = support.summary_rows(out[key], input.fields) end
        end
    elseif view == "references" then
        out.references.items = support.summary_rows(out.references.items, input.fields)
    elseif view == "brief" then
        out.brief.recent_events = support.summary_rows(out.brief.recent_events, input.fields)
        out.brief.active_tasks = support.summary_rows(out.brief.active_tasks, input.fields)
    end
    return support.maintain_position(journal_id, {
        cursor_id = input and input.cursor_id,
        agent_id = input and input.agent_id,
    }, out)
end

return { handler = handler }
