export function isEqualNode(node1: Node, node2: Node): boolean {
  return node1.isEqualNode(node2)
}

export function createElem(
  tagName: string,
  attributes?: Record<string, string>
): HTMLElement {
  const element = document.createElement(tagName)

  if (attributes) {
    for (const attr in attributes) {
      element.setAttribute(attr, attributes[attr])
    }
  }

  return element
}

export function removeElem(element: HTMLElement): void {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element)
  }
}

export function appendChild(parent: HTMLElement, child: HTMLElement): void {
  parent.appendChild(child)
}

export function insertBefore(
  parent: HTMLElement,
  newChild: HTMLElement,
  referenceChild: HTMLElement
): void {
  parent.insertBefore(newChild, referenceChild)
}

export function setInnerHTML(element: HTMLElement, html: string): void {
  element.innerHTML = html
}

export function setContent(element: HTMLElement, content: string): void {
  element.textContent = content
}

export function setAttr(
  element: HTMLElement,
  attributeName: string,
  value: string
): void {
  element.setAttribute(attributeName, value)
}

export function removeAttr(element: HTMLElement, attributeName: string): void {
  element.removeAttribute(attributeName)
}

export function addClass(element: HTMLElement, className: string): void {
  element.classList.add(className)
}

export function removeClass(element: HTMLElement, className: string): void {
  element.classList.remove(className)
}

export function setStyle(
  element: HTMLElement,
  styleName: string,
  value: string
): void {
  // @ts-ignore
  element.style[styleName] = value
}

export function addEvent(
  element: HTMLElement,
  eventName: string,
  handler: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions
): void {
  element.addEventListener(eventName, handler, options)
}

export function removeEvent(
  element: HTMLElement,
  eventName: string,
  handler: EventListenerOrEventListenerObject
): void {
  element.removeEventListener(eventName, handler)
}

export function querySelector(selectors: string): HTMLElement | null {
  return document.querySelector(selectors)
}

export function getElemById(id: string): HTMLElement | null {
  return document.getElementById(id)
}

export function getDataset(
  element: HTMLElement,
  attributeName: string
): string | undefined {
  return element.dataset[attributeName]
}

export function setDataset(
  element: HTMLElement,
  attributeName: string,
  value: string
): void {
  element.dataset[attributeName] = value
}
