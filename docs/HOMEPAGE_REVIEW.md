# 首页审查报告 Homepage Review

> 阶段：Phase F（首页视觉原型）。基线：上游模板（fork 与 upstream 同提交 `a234dc6`）。分支：`feat/baicaoyuan-demo`。

## 实际复用的模板组件（全部直接复用，未重写"相似版本"）

| 组件 | 文件 | 复用程度 |
|---|---|---|
| BaseLayout | `src/layouts/BaseLayout.astro` | 结构原样；`<Font preload={[{weight:400}]}>`（仅首屏字重预载）；skip 链接中文化 |
| Hero | `src/components/Hero/Hero.astro` | DOM 层级、Picture 预加载流程、满屏背景、遮罩、断点原样；内容替换；scoped LESS 新增 3 处（见下） |
| Services | `src/components/Services/Services.astro` | DOM（`section#services > .card×3`）与全部 LESS/断点原样；文案替换为三项业务；三张图标 SVG 内容替换（见下） |
| SideBySide | `src/components/SideBySide/SideBySide.astro` | 错位叠图 DOM/scoped LESS/CTA 位置原样；图片与内容替换 |
| SideBySideReverse | `src/components/SideBySideReverse/SideBySideReverse.astro` | 同上（反向构图）；CTA → /traceability/ |
| Gallery | `src/components/Gallery/Gallery.astro` | 三列错落网格 DOM/LESS/hover/响应式原样；9 图→5 产品图（row1 三张 + row2 两张）；按钮文案改"查看全部 9 款产品" |
| FAQ | `src/components/FAQ/FAQ.astro` | DOM、scoped LESS、ARIA/键盘行为、`astro:page-load` 脚本**完全原样**；仅替换为基本信息.md 的四个问答 |
| CTASimple | `src/components/CTA/CTASimple.astro` | 结构与 LESS 原样；背景换 OEM 生产图、文案与按钮换中文 |
| Header/Footer/Meta | 见 Phase E | Phase E 已品牌化，本阶段未再改动 |

## 每个组件替换了什么

- **Hero**：topper/H1/正文/双按钮（/oem/、/products/）+ 小型"虚构企业 Demo"标识；背景图 → 用户指定的 `baicaoyuan-factory-exterior.png`（经 `getImage()` 优化后走模板原有 preload 流程：index.astro → `heroImage` prop → BaseLayout preload link + Meta OG 图）。
- **Services**：三项业务文案（产品供货 / OEM/ODM / 三级品控）；图标从模板装修行业图标替换为同语言（48×48 细线白描边）的花茶业务图标：茶盒（供货）、厂房（OEM/ODM）、放大镜勾选（品控）。图标文件名 service1-3 不变，保证 import 与 DOM 零改动。
- **SideBySide**：主题"源头工厂与标准化生产"，主图 `baicaoyuan-factory-exterior.png`、叠图 `baicaoyuan-production-workshop.png`；引用块换为虚构创始人语录（含"虚构企业人物"标注）；CTA → /about/。
- **SideBySideReverse**：主题"道地产区直采与三级品控"，主图 `baicaoyuan-hero-chrysanthemum-base.png`、辅助图 `baicaoyuan-quality-lab.png`；CTA → /traceability/。
- **Gallery**：五张产品实拍图（菊花决明子、红枣枸杞姜丝、玫瑰洛神、头采亳菊、四季礼盒）；无图的四款产品未进入首页；网格保持错落不等高。
- **FAQ**：四个中文问答（亳州产地 / OEM 起订量 / 检测报告 / 一件代发）。
- **CTASimple**：OEM 生产场景背景、"需要产品目录或 OEM 方案？"、按钮"提交合作需求"→ /contact/。

## 保持原样的 DOM、LESS 与断点

- 全部七个复用组件的 `<style lang="less">` 结构、媒体查询断点（0em / 48em / 64em、Services 的 768px/1300px）**原样保留**。
- Hero：原 DOM 层级、`.cs-container`/`.cs-flex-group` 排版、遮罩 `:before`、渐变细线、按钮样式与 hover、Picture priority 与 avif/webp formats 均未动。
- Gallery 的 cs-row/cs-picture1-3 尺寸体系未动；FAQ 手风琴交互与样式未动；CTASimple 的 full-width Picture 与 1300px 收窄规则未动。

## 新增 CSS 清单及必要性

| 位置 | 新增规则 | 必要性 |
|---|---|---|
| Hero scoped | `#hero { min-height: calc(100svh - 65px) }` | 提示词 §7.1 明确要求"Hero 高度为 min-height: calc(100svh - 头部高度)"（模板原为 padding 驱动高度） |
| Hero scoped | `.cs-picture img { object-position: 28% 48% }`（移动）/ `35% 50%`（≥48em） | 提示词 §7.1 要求移动端单独焦点、保留"百草源"招牌识别度（vision 实测招牌位于图面 ~28%/52%）；桌面兼顾招牌与厂房 |
| Hero scoped | `.cs-demo-tag` | 提示词要求 Hero 中放小型"虚构企业 Demo"标识 |
| TraceabilityArchive（新组件，全部 scoped） | `.cs-container/.cs-content/.cs-topper/.cs-title/.cs-text` + `.cs-archive-group/.cs-card/.cs-step` 及 0/48/64rem 断点 | 唯一新增展示组件；样式全部 scoped，未向 root.less 添加任何通用规则 |
| root.less | `.cs-button-solid` 默认文字色 #000→#fff | 品牌必要：工艺绿 #2E6B57 底上黑色 3.4:1 不达 AA，白色 6.3:1 达标 |
| Footer scoped | 链接 hover/下划线 `var(--primary)`→`var(--primaryLight)`（铜金） | 深色页脚上工艺绿 2.7:1 不达 AA，铜金 6.4:1 达标；`.disclaimer` 段落样式（虚构声明） |

其余品牌色全部经 `root.less` `:root` 变量替换（深绿 #173F35→`--secondary`，工艺绿 #2E6B57→`--primary`，铜金 #B08A45→`--primaryLight`，主文本 #18201D→`--headerColor`/`--bodyTextColor`，浅背景 #FAFAF6→`--bodyTextColorWhite`），未另建 tokens 文件。

## 自研展示组件清单

`src/components/TraceabilityArchive/TraceabilityArchive.astro`（首页唯一新增组件）：

- **母版**：Services 卡片（视觉距离最近的内容卡片组件）。完整复用其变量体系、`cs-container` 最大宽度 1280px、`--sectionPadding`、卡片表面（白底、`border-top 6px solid var(--primary)`、圆角 5px、阴影 `0 20px 40px rgba(0,0,0,0.05)`）、按钮/字体尺度体系。
- **结构**：`cs-content`（cs-topper 铜金 + cs-title 白字 + cs-text）+ 四张 `cs-card` 卡片，无"卡片套卡片"。
- **流程轴**：桌面四列（`calc(25% - gap)`）、平板两列、移动单列；桌面在卡片间隙后方加 1px 半透明细线（辅助关系，不压内容）。
- **批号**：唯一一处"DEMO"出现在标题下方 `cs-text`（示例批号：DEMO-2026-0812-003），不再重复。
- **区块底色**：深绿 `var(--secondary)`，与前后白色区块形成节奏对比；未用渐变/玻璃拟态/dashboard 风格。
- **本轮为纯静态视觉**：无滚动动画、无脚本（后续动效待审批后讨论）。
- 未加 CTA：紧邻下方已有 CTASimple，避免按钮叠加（如后续需要可加 `cs-button-solid`）。

## 桌面与移动端视觉自评（vision 子代理验收）

- **桌面首屏**：标题白字清晰居中；双按钮完整；工厂图"百草源"招牌与厂房可辨；"虚构企业 Demo"小标识正常。✅
- **移动端首屏**：文字无溢出，招牌在竖屏裁切后仍可见（28%/48% 焦点生效）。✅
- **整页节奏**：Hero（深）→ 白卡服务区 → 错位叠图 ×2 → 图片墙 → 深绿流程区 → FAQ → 深色 CTA → 深色页脚，区块间构图差异明显，无"全白底卡片"问题。✅
- **验收评分**：8/10（扣分点：产品图墙因素材为方形、模板盒为竖比例，cover 裁切使个别图构图略紧；属素材与模板盒的既有匹配度问题，非布局退化）。

## 与原模板相比是否存在品质退化

无退化。结构与动效均保持模板原样，品牌化通过内容/图片/颜色/字体完成；新增 CSS 均为提示词要求的 Hero 高度/焦点/标识与对比度修正。唯一需留意的既有矛盾：Hero topper 使用 `--primary`（工艺绿）在深色遮罩上对比度约 3.3:1（提示词仅要求"白字"达 AA，已达标；topper 为小号标签，留待人工审批时裁决是否调整）。

## 未施工页面清单（保持模板状态，不在本轮范围）

- 产品中心（/products/）、OEM/ODM（/oem/）、原料溯源（/traceability/）、工厂实力（/factory/）、关于我们（/about/）、联系询盘（/contact/）——导航与首页 CTA 已指向这些路由，页面尚未建设。
- 博客与 Decap CMS、admin、既有模板页面（projects/reviews/contact/about）未品牌化（首页不引用它们；/about/ 等仍为模板英文内容，下一阶段处理）。

## 构建与检查结果

| 项 | 结果 |
|---|---|
| `npm run build` | ✅ exit 0，11 页，无错误 |
| 首页桌面冒烟（1440×1000） | ✅ 无 console/pageerror，全部图片 `naturalWidth>0` |
| 首页移动冒烟（390×844） | ✅ 同上 |
| 键盘导航 | ✅ 首个 Tab 焦点为 skip 链接"跳转到主要内容"；30 次 Tab 循环无卡死；FAQ 第二项 Enter 可展开 |
| reduced-motion | ✅ `prefers-reduced-motion: reduce` 正常生效 |
| 移动菜单 | ✅ 抽屉可开合，六个导航项 + 联系询盘均渲染 |
| 网络字体 | ✅ @font-face 全部指向本站 `/_astro/fonts/*.woff2`，仅预载 400 字重；断开公网不影响显示 |

## 修复记录

- **P0**：Meta.astro 中一行 JS 注释误放于模板区被 Astro 渲染为可见文字（vision 验收发现）→ 已移入 frontmatter 并重新构建验证（`grep -c "Demo protection" dist/index.html` = 0）。
