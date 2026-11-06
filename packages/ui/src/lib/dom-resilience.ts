export function initDomResilience(): void {
  if (typeof window === "undefined" || typeof Node === "undefined") {
    return
  }

  const win = window as unknown as { __DOM_RESILIENCE_INITIALIZED__?: boolean }
  if (win.__DOM_RESILIENCE_INITIALIZED__) {
    return
  }
  win.__DOM_RESILIENCE_INITIALIZED__ = true

  const originalRemoveChild = Node.prototype.removeChild
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (!child) {
      return child
    }
    if (child.parentNode !== this) {
      if (child.parentNode) {
        return child.parentNode.removeChild(child)
      }
      return child
    }
    return originalRemoveChild.call(this, child) as T
  }

  const originalInsertBefore = Node.prototype.insertBefore
  Node.prototype.insertBefore = function <T extends Node>(
    newNode: T,
    referenceNode: Node | null
  ): T {
    if (!newNode) {
      return newNode
    }
    if (referenceNode && referenceNode.parentNode !== this) {
      return originalInsertBefore.call(this, newNode, null) as T
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T
  }

  window.addEventListener(
    "error",
    (event: ErrorEvent) => {
      const message =
        event.message ||
        (event.error instanceof Error ? event.error.message : "")
      if (
        typeof message === "string" &&
        (message.includes("removeChild") ||
          message.includes("not a child of this node"))
      ) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    },
    true
  )
}

initDomResilience()

