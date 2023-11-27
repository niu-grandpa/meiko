# MeikoJs

> Tip：项目尚处于开发阶段

## 介绍

Meiko.js  也是一个基于数据驱动视图理念而开发的编译库，它与目前流行的前端开发框架不同，没有自创一个文件格式用于编写代码，而是使用 HTML 文件基于原生开发基础，Meiko 在 HTML 基础上拓展了一些语法 ，例如常见的在标签内书写插值表达式  ‘`{{}}`’，以及其他一些常见的 DOM 属性的拓展语法等，Meiko 会将整个 HTML 文件视为组件并进行编译输出，并且在核心的编译流中，没有构建 AST 和 VDOM 这些操作，极大的节省了时间，而主要做的事情是转译等字符串解析工作，变为原生HTML，并且为每个使用了插值表达式的地方加入自定义元素并打上唯一id，此id用于与响应式变量绑定 ，一旦数据发生变化就能通过id获取到DOM，进行精准更新，绕开繁琐的对 VDOM 树层面的 diff 操作，......(待补充)

## 基本编译

模板输入:

```html
<!--demo.html-->
<p>姓名: {{ name }}</p>
<p>年龄: {{ age }}</p>
<p>邮箱: {{ email }}</p>
<div>嵌套 {{ name }}
  <p>{{ age }}</p>
</div>
<script>
  const name = state('name')
  const age = state(24)
  const emial = state('@email.com')
</script>
```

编译输出:

```html
<p>姓名: <meiko-value id="7d93903a1d">name</meiko-value></p>
<p>年龄: <meiko-value id="21c844ad7a">24</meiko-value></p>
<p>邮箱: <meiko-value id="2a4863e407">@email.com</meiko-value></p>
<div>嵌套 <meiko-value id="ad114c915a">name</meiko-value>
  <p><meiko-value id="b904d1f2ba">24</meiko-value></p>
</div>
<script defer src="./demo.js"></script>
```

```js
// demo.js
const name = state('name')
const age = state(24)
const emial = state('@email.com')
```



后续当响应式数据发生变化时，则利用与之关联的元素 `meiko-value` 的id进行更新