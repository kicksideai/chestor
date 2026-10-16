import { relativeAge } from './assembly'
import { isFolded, isSettled } from './tree'
import type { GraphNode } from './types'

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

/**
 * A task carries the journal's outcome vocabulary, so the tree's reading of an
 * ended record decides here too. Folding ends a task as finally as completion:
 * both are decisions already taken and neither is open work.
 */
export function isEnded(status: string): boolean {
  const node = { status } as GraphNode
  return isSettled(node) || isFolded(node)
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
 * Both readings below take it from here, keyed by the list they were handed, and
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
 * Which tasks are still being worked. The split reads rolled-up activity, so a
 * program whose leaves moved today never lands in the dormant half, and every
 * task lands in exactly one half — the list is a reordering, not a filter.
 */
export function splitByActivity<T extends TaskLike>(tasks: T[], nowS: number): { worked: T[]; dormant: T[] } {
  const { activity } = shapeOf(tasks)
  const worked: T[] = []
  const dormant: T[] = []
  for (const task of tasks) {
    const at = activity.get(task.id) ?? task.updated_at
    if (ageOf(at, nowS).tier === 'dormant') dormant.push(task)
    else worked.push(task)
  }
  return { worked, dormant }
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
