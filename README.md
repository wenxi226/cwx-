# 陈文希 · 潮玩摄影作品集

React 19 + Vite 7 的单页个人作品集。绿色 / 黑色 / 白色，最大版心 1700px，PC 为主要展示端，兼容平板和手机。

## 本地启动

```sh
npm install
npm run dev
```

也可使用 `pnpm install` 和 `pnpm dev`。预览地址：<http://127.0.0.1:5173/>。

当前电脑已安装依赖，可双击 **启动预览.cmd** 启动。已有预览服务运行时直接访问上面的地址即可。

## 生产构建

```sh
npm run build
npm run preview
```

构建产物位于 `dist/`，生产预览地址为 <http://127.0.0.1:4173/>。当前版本没有服务端或表单提交依赖。

## 已实现

- 全屏首页：本地 WebM 视频背景、潮玩主视觉、导航、作品入口、联系按钮、视频暂停 / 播放。
- 首页反重力粒子：React Bits 官方 JS-CSS 组件，300 个绿色四面体，响应鼠标移动并在鼠标静止时自动运动。
- 角色分层动效：轻浮动与鼠标视差、周期眨眼、发丝和布料局部扰动、头盔线路流光、指示灯和面罩反光。暂停按钮控制全部首页动效，离开首页或隐藏浏览器标签时暂停。
- 个人介绍：人物形象区、介绍文案、可替换的工作经历、邮箱和微信。
- 技能系统：摄影、Photoshop、Illustrator（AI）、Nano Banana、ChatGPT；横向滚动与前后切换。
- 作品浏览：图片、包装插画、IP 设计和视频；分类切换、原生弹窗、视频播放、Escape 关闭。
- 素材库更新：图片类按 45 个文件夹系列展示，完整收录 343 张图片；包装类按 1 个真实系列展示，IP 设计类按 5 个真实系列展示，完整收录 32 张图片；视频类收录 15 个原始视频文件，按 `ai动画`、`品牌结尾`、`实拍展示` 分类。
- 作品顶层只保留 `图片摄影 / 包装插画 / IP 设计 / 视频影像`；图片摄影进入页面默认显示 `IP 潮玩公仔`，可切换 `潮玩周边`，不再显示“全部作品”或“全部图片”。IP 潮玩公仔下继续提供 `AI 合成 / 实拍类` 三级筛选。
- 整屏联系页：邮件链接、微信复制、返回顶部。
- 滚动高亮导航、键盘操作、减少动态效果偏好和响应式布局。

## 后续替换内容

1. **`src/data.js`**：姓名、联系方式、个人介绍、工作经历、技能和作品数据。
2. **`public/media/`**：真实作品、人物照片和视频素材。替换路径后，同步调整 `src/data.js`。
3. **`src/App.jsx`**：首页结构和各类作品展示版式。
4. **`src/styles.css`**：色彩、1700px 版心、机动装饰和响应式布局。

联系方式暂沿用参考图：微信 `16620187134`，邮箱 `3158991946@qq.com`，请确认后再正式发布。

## 样例与素材说明

首页及角色展示使用工作区提供的 `首页形象.jpg`，经过裁切和 WebP 优化。个人介绍区使用原样复制的 `摄影师肖像.jpg`（网站内路径为 `public/media/photographer-portrait.jpg`），通过 CSS 调整半身显示范围，保留原始五官、眼镜、肤色和衣着。工作经历已标注待补充。

作品区使用素材库中的真实系列。15 条作品视频使用 H.264 / AAC MP4 网页版，保留原始比例和声音，最长边 1280px、30fps；AAC 原声直接复制，PCM 音轨转换为 AAC 128kbps。原始素材不被修改。总大小由约 3.19GB 减至约 176MB。

视频启用 MP4 faststart，配合托管服务的 HTTP Range 分段请求支持快速起播与进度跳转。列表只加载 WebP 封面，打开弹窗才加载视频元数据；点击播放后保留原声，支持手机内联播放。切到后台暂停，关闭弹窗停止下载并释放播放器，加载失败可重试或直接打开视频。

`scripts/optimize-videos.cjs` 可重新生成视频、封面与 `public/portfolio-assets/videos-optimized/verification.json` 检查报告。安装 FFmpeg 后运行 `pnpm optimize:videos`；工具不在 PATH 时设置 `FFMPEG_BIN` / `FFPROBE_BIN`，原素材目录可用 `MATERIAL_SOURCE` 指定。脚本逐条执行完整音视频解码检查，全部完成后更新作品目录。请在重新导入素材库后执行此步骤，避免发布原始大文件。

字体已保存到 `public/fonts/`，页面不依赖外部字体服务。生产页面只请求本站资源。

`scripts/` 中的资源制作脚本用于本次本地制作，依赖当前 Codex 运行环境。正常运行和构建网站无需执行这些脚本。

## 首页动效调整

- `src/components/Antigravity/Antigravity.jsx`：直接从 <https://reactbits.dev/r/Antigravity-JS-CSS.json> 提取的原始组件，未改写；安装了 registry 指定的 `@react-three/fiber` 与 `three` 依赖。Registry 原件保存在 `antigravity-registry.json`。
- `src/components/HeroParticles.jsx`：指定参数、WebGL 支持判断、延迟加载和鼠标事件转发，不拦截首页按钮。
- `src/components/AnimatedCharacter.jsx`：按现有角色图坐标制作的 SVG 局部遮罩、眨眼和线路光效。
- `src/components/AnimatedCharacter.css`：角色浮动、眨眼节奏、线路流光与反光的关键帧。
- `src/materialProjects.js`：作品目录，图片系列包含完整图库，视频条目指向优化后的 MP4，并记录封面与视频宽高。
- `scripts/update-material-library.cjs`：从 `素材库/图片类` 和 `素材库/视频类` 重新生成网页资产和目录；图片生成 1800px WebP 展示副本，同时保留原始图片到 `public/portfolio-assets/originals/`，视频原文件直接复制。

角色动效是现有静态图片上的网页分层合成效果。当前没有 After Effects 工程或真实逐帧角色视频；如果后续更换人物图，需要重新校准眼睛、头发和头盔线路的坐标。

素材库更新不会修改原始素材目录。图片、包装和 IP 系列弹窗均使用展示副本自动缓慢轮播，点击图片后加载 `originals/` 中的原始文件，以原始比例完整显示，不做裁切；重新整理素材后运行 `node scripts/update-material-library.cjs` 即可刷新作品目录。
