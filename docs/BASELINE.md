# 模板基线报告 Baseline

> 目标：在未经任何品牌化修改的模板上验证安装、开发服务器、生产构建，并固化"原模板最好看的样子"作为后续对比基准。

## 安装结果

| 项 | 值 |
|---|---|
| 命令 | `npm install` |
| lockfile | 使用上游已有 `package-lock.json`（未升级任何依赖） |
| 用时 | 约 19s |
| 结果 | 成功（exit 0） |
| 警告 | npm 11 allow-scripts：esbuild/sharp 的 install 脚本未批准执行；经验证两者均可正常工作（`npx esbuild --version` = 0.28.1；sharp 内存建图测试通过） |
| 版本 | Node v26.5.0 / npm 11.17.0 / Astro 7.0.9（package.json `^7.0.9`） |

## 开发服务器结果

| 项 | 值 |
|---|---|
| 命令 | `npm run dev -- --port 4321 --host 127.0.0.1` |
| 首启耗时 | 约 35s 后可访问（首次需预热） |
| 结果 | HTTP 200；首页 title = "Pixel Perfect Websites \| Code Stitch Web Designs \| Denver, CO"；about 页 title 正常 |

## 构建结果

| 项 | 值 |
|---|---|
| 命令 | `npm run build` |
| 总耗时 | 约 6 分 46 秒（`astro build` 完成 5m05s + 收尾） |
| 结果 | exit 0，11 个页面构建完成，`sitemap-index.xml` 生成，`dist/` 正常 |
| 观察 | 199 个图片变体优化中 avif 编码较慢（单张最慢 ~17s），是构建耗时主因，属模板既有行为 |

## 截图

| 文件 | 视口 | 状态 |
|---|---|---|
| `docs/screenshots/upstream/home-desktop.png` | 1440×1000 | ✅（720KB） |
| `docs/screenshots/upstream/home-mobile.png` | 390×844 | ✅（202KB） |
| `docs/screenshots/upstream/about-desktop.png` | 1440×1000 | ✅（586KB） |
| `docs/screenshots/upstream/about-mobile.png` | 390×844 | ✅（219KB） |

截图方式：Playwright Chromium，`networkidle` + 额外 500ms 稳定后首屏截图。

## 原首页最值得保留的五项设计能力

1. **满屏 Hero 大图 + 深色遮罩 + 居中内容**：首屏视觉压强和品牌主张承载能力强，天然适配工厂实景摄影。
2. **Services 负边距上浮卡区**：白底卡片叠在 Hero 底部、顶部 6px 品牌色条 + 圆形图标底，区块衔接有层次，不是"每段一个白卡"。
3. **SideBySide 错位叠图**：主图 + 白边阴影小图重叠，真实项目/场景摄影的叙事感强，构图变化明显。
4. **Gallery 三列错落图片墙**：行内不等高（452–629px）、间距 30px 的编排，产品图墙视觉丰富且不单调。
5. **FAQ 手风琴 + 桌面左右分栏**：ARIA/键盘友好，展开动画克制；桌面 40% 标题区 + 问题列表的构成在营销页中完整收尾。

## 原 About 页最值得保留的三项构图能力

1. **Banner 内页横幅**（`Banner.astro`）：大图 + 遮罩 + 居中标题的内页头图模式，适合后续各业务子页。
2. **SideBySide 复用**：同一错位叠图组件在 About 页再次出现，证明组件可跨页复用且不违和。
3. **FAQ + CTASimple 收尾序列**：信息（FAQ）→ 转化（CTA）的页面尾部节奏，可直接复用于百草源各页。

## 已发现但本阶段不修复的上游问题

1. `.tours/` 缺 `styling-dark-mode`（README 称 8 个 tour，实际 7 个）——用户确认忽略（本项目不需要 dark mode）。
2. README 中 CSPicture 路径（`src/Components/TemplateComponents`）与实际（`src/components/CSPicture/`）不符。
3. `src/icons/` 存在 URL 编码误命名文件（`Icons%2Flogo-black.svg`、`Icons%2Fsun.svg`），无引用。
4. Hero.astro dark-mode 块引用已不存在的 `.cs-background` 选择器（无害）。
5. 构建 avif 编码慢（~17s/图），模板既有性能特征，不在本轮优化。

## 结论

基线验证通过：模板可安装、可开发、可构建。品牌化工作（Phase E/F）可以开始。
