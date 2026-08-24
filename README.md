# 李鑫炎 · 个人在线简历

一份面向课程展示的个人主页，记录此刻的兴趣、AI 辅助作品和学习经历。页面不以求职包装为目标，所有作品都明确说明由 AI 辅助完成。

## 在线访问

- 个人简历：<https://lixinyan1025-commits.github.io/resume-2/>
- GitHub 仓库：<https://github.com/lixinyan1025-commits/resume-2>

## 页面内容

- 雨中荷塘视频首屏、正圆头像与逐字身份信息
- 完整展开的个人自述，以及独立的“兴趣与探索”卡片页
- “刚刚好”Android App、坦克防线和七夕主题网页
- 六项证书与个人学习记录
- 七夕网页动态嵌入展示
- “感谢在这里遇见你”收尾页、实时运行时间、累计访客与今日浏览统计
- 竹叶与金色小叶飘落、纵向流水文字、减少动态效果支持和响应式布局
- 页面自身不播放音乐；进入七夕展示后由嵌入网页管理其音乐

## 背景图片来源

- 兴趣页雾山湖景：[Wolfgang Hasselmann / Unsplash](https://unsplash.com/photos/1LoQjBROPD4)
- 作品页青金水纹：[Steve Johnson / Unsplash](https://unsplash.com/photos/R0H9xM7YkEw)
- 证书页暖色树影：[Alexander Kaufmann / Unsplash](https://unsplash.com/photos/ZIjQEDjoJtg)

三张图片均下载到项目本地，并依据 Unsplash License 使用。

## 本地运行

项目使用原生 HTML、CSS 和 JavaScript，无须安装依赖。可以直接打开 `index.html`，也可以在项目目录启动静态服务器：

```powershell
python -m http.server 4173
```

浏览器访问 <http://127.0.0.1:4173/>。

## 文件结构

```text
index.html     页面内容与语义结构
styles.css    响应式排版与视觉效果
script.js     打字、飘叶、证书弹窗、访问统计和懒加载交互
assets/       图片、证书原图与首屏视频
```

## 说明

- 页面中的个人照片、头像、证书和项目截图由本人提供并授权在此页面展示。
- 七夕动态网页通过公开地址延迟加载；加载失败时仍可使用页面中的链接单独访问。
- 访问数据使用 Counter API 提供的匿名公开计数；本地预览只读取数据，不会增加线上计数。
- 页面尊重系统的“减少动态效果”设置，会关闭视频运动、逐字动画和叶影飘落。
