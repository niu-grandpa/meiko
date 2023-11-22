import { meikoCompiler } from '../src'

describe('插值表达式转换', () => {
  const template = `<p>姓名: {{name}}</p>
<p>年龄: {{age}}</p>
<p>邮箱: {{email}}</p>
<div>
  嵌套 {{name}}
  <p>{{age}}</p>
</div>`

  const res = `<p>姓名: <mio-interp></mio-interp></p>
<p>年龄: <mio-interp></mio-interp></p>
<p>邮箱: <mio-interp></mio-interp></p>
<div>
  嵌套 <mio-interp></mio-interp>
  <p><mio-interp></mio-interp></p>
</div>`

  test('编译结果', () => {
    const { result } = meikoCompiler(template)
    expect(result.join('')).toEqual(res)
  })
})
