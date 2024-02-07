export default null

declare global {
  interface Window {
    /** Copies a string to the clipboard. */
    copy: (t: string) => void
    /** Inserts an element at the cursor caret. */
    insertElementAtCursor: (el: Node) => void
    /** Converts a string into a data URL */
    toDataURL: (src: string, outputFormat: string) => Promise<string>
  }
  const Vue: any
}

const toDataURL = (src: string, outputFormat: string): Promise<string> => new Promise((s, _) => {
  const img = document.createElement('img')
  img.crossOrigin = "Anonymous"

  img.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return;
    canvas.height = img.naturalHeight
    canvas.width = img.naturalWidth
    ctx.drawImage(img, 0, 0)
    const dataURL = canvas.toDataURL(outputFormat)
    s(dataURL)
  }

  img.src = src
  if (img.complete ?? true) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
    img.src = src
  }
})

window.toDataURL = toDataURL

window.copy = (t: string) => {
  const el = document.createElement('textarea')
  el.value = t
  el.setAttribute('readonly', '')
  el.style.position = 'absolute'
  el.style.left = '-9999px'
  document.body.appendChild(el)
  const selection = document.getSelection()
  if (!selection) return;
  const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false
  el.select()
  document.execCommand('copy')
  document.body.removeChild(el)
  if (selected) {
    const selection_ = document.getSelection() ?? selection
    if (!selection_) return;
    selection_.removeAllRanges()
    selection_.addRange(selected)
  }
}

//! this has been modified from older versions and needs checking
window.insertElementAtCursor = (el: Node) => {
  const selection = window.getSelection()
  if (!selection) throw Error("Can't find the cursor caret.")
  const range = selection.getRangeAt(0)
  range.deleteContents()
  range.insertNode(el)
}
