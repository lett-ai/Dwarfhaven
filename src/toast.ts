export const toast = (text: string) => null // TODO: change this to an actual toast

declare global {
  interface Window {
    /** Placeholder: this function exists for polyfill purposes. */
    toast: (text: string) => null
  }
}

window.toast = toast