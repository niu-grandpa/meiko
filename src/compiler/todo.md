##  开发日志
- [x] 分离 index.html 里的所有 script 标签代码到 `__index__.js`，并通过外部 script 追加到 body 底部
- [x] 支持直接在 script 标签引入或编写 ts 代码
- [ ] 对 `type="module"` 的 script 标签，通过其 name 属性值作为文件名独立打包出来
- [ ] 分离 style 标签内的代码，独立打包出来
- [ ] 支持 style 标签直接引入less 和 scss 文件，需手动配置对应加载器
- [ ] 支持组件化开发