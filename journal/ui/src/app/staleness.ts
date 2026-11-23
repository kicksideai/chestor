import { relativeAge } from './format'

/** Three days without a fact is the point where work stops being paused and starts being abandoned. */
export const DORMANT_AFTER_S = 3 * 86400

export interface Age { seconds: number; label: string; tier: 'live' | 'recent' | 'dormant' }

export function ageOf(updatedAt: number, nowS: number): Age {
  const seconds = Math.max(0, Math.floor(nowS - updatedAt))
  const tier = seconds < 3600 ? 'live' : seconds < DORMANT_AFTER_S ? 'recent' : 'dormant'
  return { seconds, label: relativeAge(updatedAt, nowS), tier }
}

export interface TaskLike { id: string; title: string; status: string; parent_task_id?: string; updated_at: number }

export interface Subtree {
  root: TaskLike
  /** Every task under the root, the root excluded. */
  members: TaskLike[]
  /** Newest activity anywhere in the subtree, the root included. */
  lastActivityAt: number
  age: Age
  openCount: number
  blockedCount: number
  doneCount: number
}

const ENDED = new Set([
  'done', 'closed', 'completed', 'resolved', 'retired', 'canceled', 'cancelled', 'folded',
  'failed', 'abandoned', 'inconclusive', 'rejected', 'superseded',
])

/** Completed, cancelled and folded work alike: a decision already taken, not open work. */
export function isEnded(status: string): boolean {
  return ENDED.has(String(status || '').toLowerCase())
}

function childrenOf(tasks: TaskLike[]): Map<string, TaskLike[]> {
  const known = new Set(tasks.map(task => task.id))
  const children = new Map<string, TaskLike[]>()
  for (const task of tasks) {
    const parent = task.parent_task_id && task.parent_task_id !== task.id && known.has(task.parent_task_id)
      ? task.parent_task_id
      : ''
    const siblings = children.get(parent) || []
    siblings.push(task)
    children.set(parent, siblings)
  }
  return children
}

/**
 * The shape a task list has, read once.
 *
 * Rolled-up activity answers a question about the data alone — where the newest
 * fact under each task is — so it does not change when the reading clock ticks.
 * The dormancy reading takes it from here, keyed by the list it was handed, and
 * a list that has not been re-projected is not walked again. The table holds
 * only what the current lists reference, so it cannot outgrow the data.
 */
interface Shape { children: Map<string, TaskLike[]>; activity: Map<string, number> }

const SHAPES = new WeakMap<readonly TaskLike[], Shape>()

function shapeOf(tasks: TaskLike[]): Shape {
  const held = SHAPES.get(tasks)
  if (held) return held
  const children = childrenOf(tasks)
  const shape: Shape = { children, activity: rollUp(tasks, children) }
  SHAPES.set(tasks, shape)
  return shape
}

/**
 * Every task under one root, in walk order. A parent that names a descendant as
 * its own parent would otherwise walk forever, so a task is visited once.
 */
function descendants(root: TaskLike, children: Map<string, TaskLike[]>, seen: Set<string>): TaskLike[] {
  const out: TaskLike[] = []
  const queue = [...(children.get(root.id) || [])]
  while (queue.length) {
    const task = queue.shift() as TaskLike
    if (seen.has(task.id)) continue
    seen.add(task.id)
    out.push(task)
    queue.push(...(children.get(task.id) || []))
  }
  return out
}

/**
 * The newest fact anywhere beneath a task, the task itself included. Work is
 * alive wherever it is being done, so a parent nobody has edited in a month is
 * still live while a task under it moved an hour ago.
 *
 * One post-order walk answers this for every task at once: a task's roll-up is
 * its own timestamp against the roll-ups of its children, which the walk has
 * already settled. Descending afresh per task would re-read every subtree once
 * per ancestor and cost the square of a deep program.
 */
function rollUp(tasks: TaskLike[], children: Map<string, TaskLike[]>): Map<string, number> {
  const activity = new Map<string, number>()
  const entered = new Set<string>()
  // An explicit stack rather than recursion: a journal's task tree is as deep as
  // the work is, and the call stack is not a budget a reader should feel.
  const stack: Array<{ task: TaskLike; opened: boolean }> = []

  const settle = (root: TaskLike) => {
    stack.push({ task: root, opened: false })
    while (stack.length) {
      const frame = stack.pop() as { task: TaskLike; opened: boolean }
      const task = frame.task
      if (frame.opened) {
        let newest = task.updated_at
        // A child the walk turned back from carries no roll-up yet, so it
        // speaks for itself; the cycle stops here rather than looping.
        for (const child of children.get(task.id) || []) {
          newest = Math.max(newest, activity.get(child.id) ?? child.updated_at)
        }
        activity.set(task.id, newest)
        continue
      }
      // A parent that names a descendant as its own parent would otherwise walk
      // forever, so a task is entered once.
      if (entered.has(task.id)) continue
      entered.add(task.id)
      stack.push({ task, opened: true })
      for (const child of children.get(task.id) || []) stack.push({ task: child, opened: false })
    }
  }

  for (const root of children.get('') || []) settle(root)
  // A task whose whole component hangs off a cycle is never reached from a
  // root. It is still work in this journal, so it is walked from where it
  // stands rather than dropped from the reading.
  for (const task of tasks) if (!entered.has(task.id)) settle(task)
  return activity
}

/**
 * The programs a review can propose to close. A subtree qualifies only when
 * nothing inside it has moved since the dormancy threshold, and only the
 * highest such task is returned: a dormant parent already speaks for its
 * dormant children, so the reader makes one decision per program instead of
 * one per task. The oldest program comes first.
 */
export function dormantSubtrees(tasks: TaskLike[], nowS: number): Subtree[] {
  const { children, activity } = shapeOf(tasks)
  const byId = new Map(tasks.map(task => [task.id, task]))
  const isDormant = (task: TaskLike) => ageOf(activity.get(task.id) ?? task.updated_at, nowS).tier === 'dormant'

  const subtrees: Subtree[] = []
  for (const task of tasks) {
    if (!isDormant(task)) continue
    const parent = task.parent_task_id && task.parent_task_id !== task.id ? byId.get(task.parent_task_id) : undefined
    if (parent && isDormant(parent)) continue
    const members = descendants(task, children, new Set<string>([task.id]))
    const lastActivityAt = activity.get(task.id) ?? task.updated_at
    const subtree: Subtree = {
      root: task,
      members,
      lastActivityAt,
      age: ageOf(lastActivityAt, nowS),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0,
    }
    for (const member of [task, ...members]) {
      const status = String(member.status || '').toLowerCase()
      if (isEnded(status)) subtree.doneCount += 1
      else if (status === 'blocked') subtree.blockedCount += 1
      else subtree.openCount += 1
    }
    subtrees.push(subtree)
  }
  return subtrees.sort((a, b) => a.lastActivityAt - b.lastActivityAt || a.root.title.localeCompare(b.root.title))
}

export interface DormantProgram {
  root: TaskLike
  /** Every task the dormant parts of this program hold, their roots included. */
  tasks: number
  open: number
  lastActivityAt: number
}

/**
 * Open work nothing has touched for days, grouped under the top-level task it hangs from. A program that
 * still has one live child comes back from the subtree reading as many small
 * dormant parts; a person settles the program, so the parts are counted under it.
 * A program whose quiet parts are all ended has nothing left to settle.
 */
export function dormantPrograms(tasks: TaskLike[], nowS: number): DormantProgram[] {
  const byId = new Map(tasks.map(task => [task.id, task]))
  const rootOf = (task: TaskLike): TaskLike => {
    let current = task
    const seen = new Set<string>()
    while (current.parent_task_id && byId.has(current.parent_task_id) && !seen.has(current.id)) {
      seen.add(current.id)
      current = byId.get(current.parent_task_id) as TaskLike
    }
    return current
  }
  const groups = new Map<string, DormantProgram>()
  for (const part of dormantSubtrees(tasks, nowS)) {
    if (!part.openCount && !part.blockedCount) continue
    const root = rootOf(part.root)
    const group = groups.get(root.id) || { root, tasks: 0, open: 0, lastActivityAt: 0 }
    group.tasks += part.members.length + 1
    group.open += part.openCount + part.blockedCount
    group.lastActivityAt = Math.max(group.lastActivityAt, part.lastActivityAt)
    groups.set(root.id, group)
  }
  return [...groups.values()].sort((a, b) => a.lastActivityAt - b.lastActivityAt)
}
