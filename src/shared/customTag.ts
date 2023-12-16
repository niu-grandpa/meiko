import { SID_DATASET_KEY } from './constant/datasetKey'
import {
  CLOSING_SLASH,
  END_TAG,
  START_TAG,
  WHITE_SPACE
} from './constant/htmlToken'
import { INTERP_HTML_TAGNAME } from './constant/tagName'

export default function getInterpTag(hash: string): string[] {
  const attr = `${SID_DATASET_KEY}="${hash}"`
  const start = [START_TAG, INTERP_HTML_TAGNAME, WHITE_SPACE, attr, END_TAG]
  const end = [START_TAG, CLOSING_SLASH, INTERP_HTML_TAGNAME, END_TAG]
  return start.concat(end)
}
