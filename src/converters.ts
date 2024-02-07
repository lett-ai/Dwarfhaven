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
    ext2FontAwesomeIcon: (ext: string) => string
    /** Converts a file extension to an SVG icon. */
    ext2SVGIcon: (ext: string) => string
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

window.ext2FontAwesomeIcon = (ext: string) =>  {
  switch (ext) {
    case 'gz':
      return 'fa-file-archive'
    case 'zip':
      return 'fa-file-archive'
    case 'tar':
      return 'fa-file-archive'
    case '7z':
      return 'fa-file-archive'
    case 'rar':
      return 'fa-file-archive'

    case 'mp3':
      return 'fa-file-audio'
    case 'aac':
      return 'fa-file-audio'
    case 'ogg':
      return 'fa-file-audio'
    case 'wav':
      return 'fa-file-audio'
    case 'raw':
      return 'fa-file-audio'

    case 'js':
      return 'fa-file-code'
    case 'css':
      return 'fa-file-code'
    case 'cpp':
      return 'fa-file-code'
    case 'java':
      return 'fa-file-code'
    case 'class':
      return 'fa-file-code'
    case 'py':
      return 'fa-file-code'
    case 'cs':
      return 'fa-file-code'
    case 'gml':
      return 'fa-file-code'
    case 'bin':
      return 'fa-file-code'
    case 'asm':
      return 'fa-file-code'
    case 'pl':
      return 'fa-file-code'
    case 'hs':
      return 'fa-file-code'
    case 'jsx':
      return 'fa-file-code'
    case 'ts':
      return 'fa-file-code'
    case 'html':
      return 'fa-file-code'
    case 'json':
      return 'fa-file-code'
    case 'sh':
      return 'fa-file-code'
    case 'env':
      return 'fa-file-code'

    case 'xls':
      return 'fa-file-excel'
    case 'xlsx':
      return 'fa-file-excel'
    case 'csv':
      return 'fa-file-excel'
    case 'numbers':
      return 'fa-file-excel'

    case 'jpg':
      return 'fa-file-image'
    case 'jpeg':
      return 'fa-file-image'
    case 'png':
      return 'fa-file-image'
    case 'gif':
      return 'fa-file-image'
    case 'psd':
      return 'fa-file-image'
    case 'ai':
      return 'fa-file-image'
    case 'tiff':
      return 'fa-file-image'
    case 'bmp':
      return 'fa-file-image'
    case 'riff':
      return 'fa-file-image'
    case 'xbmp':
      return 'fa-file-image'
    case 'webp':
      return 'fa-file-image'
    case 'svg':
      return 'fa-file-image'

    case 'mp4':
      return 'fa-file-movie'
    case 'avi':
      return 'fa-file-movie'
    case 'wmv':
      return 'fa-file-movie'
    case 'flv':
      return 'fa-file-movie'
    case 'mov':
      return 'fa-file-movie'
    case 'webm':
      return 'fa-file-movie'
    case 'mpeg':
      return 'fa-file-movie'
    case 'mpg':
      return 'fa-file-movie'
    case 'mpv':
      return 'fa-file-movie'

    case 'doc':
      return 'fa-file-word'
    case 'docx':
      return 'fa-file-word'
    case 'txt':
      return 'fa-file-text'
    case 'pdf':
      return 'fa-file-pdf'

    case 'ppt':
      return 'fa-file-powerpoint'
    case 'pptx':
      return 'fa-file-powerpoint'
    case 'odp':
      return 'fa-file-powerpoint'

    default:
      return 'fa-file'
  }
}

window.ext2SVGIcon = (ext: string) =>  {
  switch (ext) {
    case 'gz':
      return 'file-archive.svg'
    case 'zip':
      return 'file-archive.svg'
    case 'tar':
      return 'file-archive.svg'
    case '7z':
      return 'file-archive.svg'
    case 'rar':
      return 'file-archive.svg'

    case 'mp3':
      return 'file-audio.svg'
    case 'aac':
      return 'file-audio.svg'
    case 'ogg':
      return 'file-audio.svg'
    case 'wav':
      return 'file-audio.svg'
    case 'raw':
      return 'file-audio.svg'

    case 'js':
      return 'file-code.svg'
    case 'css':
      return 'file-code.svg'
    case 'cpp':
      return 'file-code.svg'
    case 'java':
      return 'file-code.svg'
    case 'class':
      return 'file-code.svg'
    case 'py':
      return 'file-code.svg'
    case 'cs':
      return 'file-code.svg'
    case 'gml':
      return 'file-code.svg'
    case 'bin':
      return 'file-code.svg'
    case 'asm':
      return 'file-code.svg'
    case 'pl':
      return 'file-code.svg'
    case 'hs':
      return 'file-code.svg'
    case 'jsx':
      return 'file-code.svg'
    case 'ts':
      return 'file-code.svg'
    case 'html':
      return 'file-code.svg'
    case 'json':
      return 'file-code.svg'
    case 'sh':
      return 'file-code.svg'
    case 'env':
      return 'file-code.svg'

    case 'xls':
      return 'file-sheet.svg'
    case 'xlsx':
      return 'file-sheet.svg'
    case 'csv':
      return 'file-sheet.svg'
    case 'numbers':
      return 'file-sheet.svg'

    case 'jpg':
      return 'file-img.svg'
    case 'jpeg':
      return 'file-img.svg'
    case 'png':
      return 'file-img.svg'
    case 'gif':
      return 'file-img.svg'
    case 'psd':
      return 'file-img.svg'
    case 'ai':
      return 'file-img.svg'
    case 'tiff':
      return 'file-img.svg'
    case 'bmp':
      return 'file-img.svg'
    case 'riff':
      return 'file-img.svg'
    case 'xbmp':
      return 'file-img.svg'
    case 'webp':
      return 'file-img.svg'
    case 'svg':
      return 'file-img.svg'

    case 'mp4':
      return 'file-video.svg'
    case 'avi':
      return 'file-video.svg'
    case 'wmv':
      return 'file-video.svg'
    case 'flv':
      return 'file-video.svg'
    case 'mov':
      return 'file-video.svg'
    case 'webm':
      return 'file-video.svg'
    case 'mpeg':
      return 'file-video.svg'
    case 'mpg':
      return 'file-video.svg'
    case 'mpv':
      return 'file-video.svg'

    case 'doc':
      return 'file-doc.svg'
    case 'docx':
      return 'file-doc.svg'
    case 'txt':
      return 'file-doc.svg'
    case 'pdf':
      return 'file-pdf.svg'

    case 'ppt':
      return 'file-ppt.svg'
    case 'pptx':
      return 'file-ppt.svg'
    case 'odp':
      return 'file-ppt.svg'

    default:
      return 'file-file.svg'
  }
}

window.decodeJWT = (token: string) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/gim, '+').replace(/_/gim, '/')
  return JSON.parse(decodeURIComponent(window.atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join('')))
}
