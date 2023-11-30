import {
  CLOSING_SLASH,
  END_TAG,
  INTERP_HTML_TAGNAME,
  START_TAG,
  WHITE_SPACE
} from '@/shared/const'

export default function getInterpTag(hash: string): string[] {
  const attr = `id="${hash}"`
  const start = [START_TAG, INTERP_HTML_TAGNAME, WHITE_SPACE, attr, END_TAG]
  const end = [START_TAG, CLOSING_SLASH, INTERP_HTML_TAGNAME, END_TAG]
  return start.concat(end)
}
