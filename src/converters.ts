export default {}

declare global {
  interface Window {
    /** Unescapes HTML to a string representation */
    unescapeHTML: (s: string) => string
    /** Parses text from HTML string */
    html2Text: (html: string) => string
    /** Converts HTML to string to a valid DOM element */
    html2Element: (html: string) => ChildNode | null
    /** Converts an ObjectID (e.g. from MongoDB) to a Date */
    objectId2Date: (id: string) => Date
    /** Converts an RGB channel (0-255) to a 2-digit hex */
    channel2Hex: (c: number) => string
    /** Converts RGB channels to a 6-digit hex code, without leading `#` */
    rgb2Hex: (r: number, g: number, b: number) => string
    /** Returns `true` if the color is considered "dark" for contrast purposes */
    rgbIsDark: (r: number, g: number, b: number) => boolean
    /** Identifies the accent color (returned as hex code without leading `#`). */
    image2Color: (url: string, dark?: boolean) => Promise<string | null>
    /** Converts a file extension to a FontAwesom icon. */
    ext2Icon: (ext: string) => string
    /** Decodes a JWT token to a JSON object */
    decodeJWT: (token: string) => any
    ColorThief: any
  }
}

window.unescapeHTML = (
  () => {
    const element = document.createElement('div')
    const entity = /&(?:#x[a-f0-9]+|#[0-9]+|[a-z0-9]+);?/ig
    return (str: string) => {
      str = str.replace(entity, (m: string) => {
        element.innerHTML = m
        return element.textContent ?? ""
      })
      element.textContent = ""
      return str
    }
  }
)();

const parser = new DOMParser()

window.html2Text = (html: string) => {
  if (html.length < 5000) html = html.replace(/<style[^>]*>([^<]|\n|\r\n)*<\/style>/gi, '')
  const doc = parser.parseFromString(html, 'text/html')
  doc.close()
  return doc.body.innerText.trim().replace(/( |\n)+/g, ' ')
}

window.html2Element = (html: string) => {
  const template = document.createElement('template')
  html = html.trim() // Never return a text node of whitespace as the result
  template.innerHTML = html
  return template.content.firstChild
}

window.objectId2Date = (id: string) => {
  const timestamp = id.substring(0, 8)
  return new Date(parseInt(timestamp, 16) * 1000)
}

window.channel2Hex = (c: number) => c.toString(16).padStart(2, '0')

window.rgb2Hex = (r: number, g: number, b: number) =>
  window.channel2Hex(r) + window.channel2Hex(g) + window.channel2Hex(b)
;

window.rgbIsDark = (r: number, g: number, b: number) => {
  const hsp = Math.sqrt(0.299 * (r ** 2) + 0.587 * (g ** 2) + 0.114 * (b ** 2))
  return hsp < 150
}

window.image2Color = (url: string, dark?: boolean) => new Promise((s, _) => {
  const thief = new window.ColorThief()
  const image = new Image()
  image.onload = () => {
    const palette = thief.getPalette(image) as [number, number, number][]
    const darkColors = palette.filter(rgb => (dark ?? true) == window.rgbIsDark(...rgb))
    if (darkColors.length == 0) return s(null)
    const rgb = darkColors[0]
    const color = window.rgb2Hex(...rgb)
    return s(color)
  }
  image.crossOrigin = 'Anonymous'
  image.src = url
})

window.ext2Icon = (ext: string) =>  {
  switch (ext) {
    case 'gz':
      return 'lucide:file-archive'
    case 'zip':
      return 'lucide:file-archive'
    case 'tar':
      return 'lucide:file-archive'
    case '7z':
      return 'lucide:file-archive'
    case 'rar':
      return 'lucide:file-archive'

    case 'mp3':
      return 'lucide:file-music'
    case 'aac':
      return 'lucide:file-music'
    case 'ogg':
      return 'lucide:file-music'
    case 'wav':
      return 'lucide:file-music'
    case 'raw':
      return 'lucide:file-digit'

    case 'js':
      return 'lucide:file-code'
    case 'css':
      return 'lucide:file-code'
    case 'cpp':
      return 'lucide:file-code'
    case 'java':
      return 'lucide:file-code'
    case 'class':
      return 'lucide:file-code'
    case 'py':
      return 'lucide:file-code'
    case 'cs':
      return 'lucide:file-code'
    case 'gml':
      return 'lucide:file-code'
    case 'bin':
      return 'lucide:file-code'
    case 'asm':
      return 'lucide:file-code'
    case 'pl':
      return 'lucide:file-code'
    case 'hs':
      return 'lucide:file-code'
    case 'jsx':
      return 'lucide:file-code'
    case 'ts':
      return 'lucide:file-code'
    case 'html':
      return 'lucide:file-code'
    case 'json':
      return 'lucide:file-json-2'
    case 'sh':
      return 'lucide:file-code'
    case 'env':
      return 'lucide:file-code'

    case 'xls':
      return 'lucide:file-spreadsheet'
    case 'xlsx':
      return 'lucide:file-spreadsheet'
    case 'csv':
      return 'lucide:file-spreadsheet'
    case 'numbers':
      return 'lucide:file-chart-column'

    case 'jpg':
      return 'lucide:file-image'
    case 'jpeg':
      return 'lucide:file-image'
    case 'png':
      return 'lucide:file-image'
    case 'gif':
      return 'lucide:file-image'
    case 'psd':
      return 'lucide:file-image'
    case 'ai':
      return 'lucide:file-image'
    case 'tiff':
      return 'lucide:file-image'
    case 'bmp':
      return 'lucide:file-image'
    case 'riff':
      return 'lucide:file-image'
    case 'xbmp':
      return 'lucide:file-image'
    case 'webp':
      return 'lucide:file-image'
    case 'svg':
      return 'lucide:file-image'
    case 'heic':
      return 'lucide:file-image'
    case 'ico':
      return 'lucide:file-image'
    case 'icns':
      return 'lucide:file-image'
    case 'heif':
      return 'lucide:file-image'

    case 'mp4':
      return 'lucide:file-video'
    case 'avi':
      return 'lucide:file-video'
    case 'wmv':
      return 'lucide:file-video'
    case 'flv':
      return 'lucide:file-video'
    case 'mov':
      return 'lucide:file-video'
    case 'webm':
      return 'lucide:file-video'
    case 'mpeg':
      return 'lucide:file-video'
    case 'mpg':
      return 'lucide:file-video'
    case 'mpv':
      return 'lucide:file-video'

    case 'doc':
      return 'lucide:file-type-2'
    case 'docx':
      return 'lucide:file-pen'
    case 'txt':
      return 'lucide:file-type'
    case 'pdf':
      return 'lucide:file-text'

    case 'ppt':
      return 'lucide:presentation'
    case 'pptx':
      return 'lucide:presentation'
    case 'odp':
      return 'lucide:presentation'

    default:
      return 'lucide:file'
  }
}

window.decodeJWT = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/gim, '+').replace(/_/gim, '/')
  return JSON.parse(decodeURIComponent(window.atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join('')))
}
