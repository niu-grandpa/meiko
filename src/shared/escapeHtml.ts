const escapeRE = /["'&<>]/

export function escapeHtml(string: unknown) {
  const str = '' + string
  const match = escapeRE.exec(str)

  if (!match) {
    return str
  }

  let escaped = ''
  switch (str.charCodeAt(0)) {
    case 34: // "
      escaped = '&quot;'
      break
    case 38: // &
      escaped = '&amp;'
      break
    case 39: // '
      escaped = '&#39;'
      break
    case 60: // <
      escaped = '&lt;'
      break
    case 62: // >
      escaped = '&gt;'
      break
  }

  return escaped
}
