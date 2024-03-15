import { meikoCompiler } from '../../../src'

test('compile html with script', () => {
  const config = require('./meiko.config')
  meikoCompiler(config)
})
