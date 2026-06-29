/**
 * Writer Bus - Centralized DOM manipulation and field targeting for Writing Agent
 * Handles: field detection, safe injection, snapshots, and undo
 */

import mitt from 'mitt'

const bus = mitt()

/**
 * Generate a stable CSS-like path for an element
 */
function domPath(el) {
  if (!el || el.nodeType !== 1) return ''
  
  const idx = (e) => {
    if (!e.parentNode) return 1
    return [...e.parentNode.children].indexOf(e) + 1
  }
  
  const parts = []
  let current = el
  
  while (current && current.nodeType === 1 && parts.length < 7) {
    const tag = current.tagName.toLowerCase()
    const nth = idx(current)
    parts.unshift(`${tag}:nth-child(${nth})`)
    current = current.parentNode
  }
  
  return parts.join('>')
}

/**
 * Get element by CSS path
 */
function getByPath(path) {
  try {
    return document.querySelector(path)
  } catch {
    return null
  }
}

/**
 * Read value from an element
 */
function read(el) {
  if (!el) return ''
  
  if (el.isContentEditable) {
    return el.innerHTML
  }
  
  if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    return el.value
  }
  
  return el.textContent || ''
}

/**
 * Write value to an element and trigger events for Vue reactivity
 */
function write(el, val) {
  if (!el) return
  
  if (el.isContentEditable) {
    el.innerHTML = val
  } else if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
    el.value = val
  } else {
    el.textContent = val
  }
  
  // Trigger events for Vue reactivity
  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Create a snapshot of all fillable fields on the page
 */
function snapshotAll() {
  const selectors = [
    'input:not([type="password"]):not([type="hidden"]):not([data-ai-skip])',
    'textarea:not([data-ai-skip])',
    '[contenteditable="true"]:not([data-ai-skip])',
    '[data-ai-slot]'
  ]
  
  const nodes = [...document.querySelectorAll(selectors.join(','))]
  
  return nodes.map(n => ({
    path: domPath(n),
    value: read(n),
    slot: n.getAttribute('data-ai-slot') || null
  }))
}

/**
 * Restore a snapshot
 */
function restoreSnapshot(snap) {
  if (!snap || !Array.isArray(snap)) return
  
  snap.forEach(s => {
    const el = getByPath(s.path)
    if (el) {
      write(el, s.value)
    }
  })
}

/**
 * Find target elements for filling
 */
function findTargets(mappingHints = {}) {
  const targets = {
    explicit: {},
    heuristic: {}
  }
  
  // 1. Explicit slots (highest priority)
  document.querySelectorAll('[data-ai-slot]').forEach(el => {
    const slot = el.getAttribute('data-ai-slot')
    targets.explicit[slot] = el
  })
  
  // 2. Heuristic matching by label/placeholder
  const all = [...document.querySelectorAll('input, textarea, [contenteditable="true"]')]
  
  const byKeyword = (keywords) => {
    return all.find(el => {
      const placeholder = (el.placeholder || '').toLowerCase()
      const name = (el.name || '').toLowerCase()
      const id = el.id || ''
      const label = id ? (document.querySelector(`label[for="${id}"]`)?.innerText || '').toLowerCase() : ''
      
      const searchText = `${placeholder} ${name} ${label}`
      return keywords.some(kw => searchText.includes(kw.toLowerCase()))
    })
  }
  
  targets.heuristic.subject = byKeyword(['subject', 'title'])
  targets.heuristic.body = byKeyword(['body', 'message', 'content', 'description'])
  targets.heuristic.intro = byKeyword(['intro', 'introduction'])
  targets.heuristic.cta = byKeyword(['cta', 'call to action', 'action'])
  
  return targets
}

/**
 * Fill fields with generated content
 */
function fill(draft) {
  if (!draft || !draft.parts) return
  
  const { explicit, heuristic } = findTargets(draft.mappingHints || {})
  const filled = []
  
  // Priority 1: Fill explicit slots
  Object.entries(draft.parts).forEach(([partName, text]) => {
    if (!text) return
    
    // Try exact match
    let el = explicit[partName]
    
    // Try with format prefix (e.g., email.subject, proposal.body)
    if (!el) {
      const prefixes = ['email', 'proposal', 'note', 'generic']
      for (const prefix of prefixes) {
        el = explicit[`${prefix}.${partName}`]
        if (el) break
      }
    }
    
    if (el) {
      write(el, text)
      filled.push({
        slot: partName,
        path: domPath(el),
        value: text
      })
    }
  })
  
  // Priority 2: Fill heuristic matches for unmapped parts
  Object.entries(draft.parts).forEach(([partName, text]) => {
    if (!text) return
    
    // Skip if already filled via explicit slot
    if (filled.some(f => f.slot === partName)) return
    
    const el = heuristic[partName]
    if (el) {
      write(el, text)
      filled.push({
        slot: partName,
        path: domPath(el),
        value: text
      })
    }
  })
  
  // Priority 3: Fallback - fill focused field or first body field with flat content
  if (filled.length === 0 && draft.flat) {
    const focus = document.activeElement
    
    if (focus && (focus.matches('input, textarea') || focus.isContentEditable)) {
      write(focus, draft.flat)
      filled.push({
        slot: 'flat',
        path: domPath(focus),
        value: draft.flat
      })
    } else if (heuristic.body) {
      write(heuristic.body, draft.flat)
      filled.push({
        slot: 'flat',
        path: domPath(heuristic.body),
        value: draft.flat
      })
    }
  }
  
  return filled
}

/**
 * Check if Writing Agent should be disabled (safety checks)
 */
function shouldBlock(el) {
  if (!el) return true
  
  // Block password fields
  if (el.type === 'password') return true
  
  // Block if explicitly marked
  if (el.hasAttribute('data-ai-skip') || el.hasAttribute('data-ai-lock')) return true
  
  // Block if label/name suggests sensitive data
  const name = (el.name || '').toLowerCase()
  const id = el.id || ''
  const label = id ? (document.querySelector(`label[for="${id}"]`)?.innerText || '').toLowerCase() : ''
  
  const sensitiveKeywords = ['password', 'secret', 'api key', 'token', 'ssn', 'credit card']
  const searchText = `${name} ${label}`
  
  return sensitiveKeywords.some(kw => searchText.includes(kw))
}

export default {
  // Event bus
  on: bus.on,
  emit: bus.emit,
  
  // DOM utilities
  domPath,
  getByPath,
  read,
  write,
  
  // Snapshot/undo
  snapshotAll,
  restoreSnapshot,
  
  // Field targeting
  findTargets,
  fill,
  
  // Safety
  shouldBlock
}
