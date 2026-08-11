# 模板审计报告 Template Audit

> 基线：upstream/fork 同提交 `a234dc612dd63f7ff6818dd46d790d9783b3ea07`（fork 与上游 main 当前一致）。
> 目的：在品牌化前完整理解 CodeStitch Intermediate Astro kit（v4.0.0 / Astro v7）的架构，为百草源重建确定"复用哪些、替换什么、为何"。

---

## 0. 模板概况

- Astro v7.0.9，LESS 预处理，View Transitions（`ClientRouter`），Content Collections，Decap CMS（DecapBridge 认证），Astro Fonts API，`@astrojs/sitemap`，astro-icon。
- 组件采用 component-per-folder 模式；页面 = BaseLayout + 组件序列；scoped `<style lang="less">`；交互脚本统一包 `astro:page-load`。
- 五个演示页面：index / about / projects / reviews / contact / blog。

## 1. 原模板首页由哪些组件组合

`src/pages/index.astro` 顺序：

| 顺序 | 组件 | 作用 |
|---|---|---|
| — | `BaseLayout`（DynamicHeader + Meta + Footer 环绕） | 全站骨架、SEO、字体、preload、导航脚本 |
| 1 | `Hero` | 满屏背景大图 + 深色遮罩 + 居中 topper/H1/正文/双按钮 |
| 2 | `Services` | 负边距上提的白底三卡片区（图标、标题、简介） |
| 3 | `SideBySide` | 错位叠图（主图 + 白边衬底小图）+ 右侧文案 + 引用块 + CTA |
| 4 | `SideBySideReverse` | 同上，构图镜像翻转 |
| 5 | `Gallery` | 三行错落图片墙（9 图），下方按钮 |
| 6 | `Testimonials` | 评价区（虚构客户头像、星级、引用） |
| 7 | `FAQ` | 手风琴问答（ARIA、键盘、astro:page-load 初始化） |
| 8 | `CTASimple` | 全宽背景图 + 遮罩 + 标题 + 按钮 |

首页还通过 `getImage()` 将 `@assets/images/hero/hero.jpg` 优化为 webp，传给 `BaseLayout.heroImage`（预加载 + OG 社交图）与 `<Hero image={optimizedHeroImage}>`。

## 2. 每个组件的 DOM、样式和业务职责

| 组件 | DOM 结构 | 样式要点（scoped LESS） | 业务职责 |
|---|---|---|---|
| Hero | `section#hero > .cs-container > .cs-flex-group（.cs-topper/.cs-title/.cs-text + 2 按钮）+ Picture.cs-picture` | 满屏绝对定位背景、`:before` 黑色遮罩 0.7、居中内容、`clamp` 大留白、渐变细线装饰、断点 0/48em/81.25em | 首屏品牌主张 + 双路径 CTA |
| Services | `section#services > .card×3（picture>Icon + h2 + p）` | 负 margin 上浮覆盖 Hero 底部、白底圆角 5px、`border-top: 6px solid var(--primary)`、圆形图标底 88px、移动单列/768px 三列 flex/1300px 增宽 | 三项业务能力速览 |
| SideBySide | `section#sbs > .cs-container > .cs-left（Picture1/Picture2 绝对定位错位叠图）+ .cs-right（.cs-topper/.cs-title/.cs-text×2/.cs-flex-group 引用块/.cs-button-solid）` | 左图区以 `font-size: min(1.2vw,1em)` 整体缩放、图 522×581 + 414×400 白边阴影叠图、圆角 24px、桌面 64em 转 row | 企业叙事 + 信任引证 + CTA |
| SideBySideReverse | 同上，`.cs-left` 桌面 `order: 2` | 与 SideBySide 对称 | 第二组叙事（反向构图） |
| Gallery | `section#gallery > .cs-container > .cs-topper/.cs-title + .cs-image-group（.cs-row×3，每行 3 张 Picture 高度各异）+ 按钮` | 三列错落（行内 420px 宽、高度 452–629px 不等）、`gap 30px`、hover 无特殊动效、居中 | 视觉作品/产品图片墙 |
| Testimonials | 评价卡片 + 头像 + 星级 + 引用 | 模板内 scoped | 展示客户评价（本项目移除） |
| FAQ | `section#faq-1741 > .cs-container > .cs-content + .cs-flex-group > ul.cs-faq-group > li.cs-faq-item（button.cs-button + p.cs-item-text）` | 手风琴：active 项按钮变色、加号旋转、文本 0→auto 高度展开；桌面 cs-content 40% 左置 | 常见问题解答 |
| CTASimple | `section#cta > .container（.title/p/.cs-button-solid）+ Picture.cs-picture（layout=full-width）` | 全宽图 + 黑色遮罩 0.7、标题 900 字重、1300px 起容器收窄居中、`cta-squares.svg` 装饰底纹 | 页面收尾转化 CTA |

Header（DynamicHeader）：`header#cs-navigation`，桌面固定顶栏（logo svg + `navData` 驱动列表 + `cs-button-solid` CTA + DarkModeToggle），移动端抽屉菜单 + 遮罩，`nav.js` 处理交互。
Footer：`footer#footer`，深底三段式（logo+简介 / 导航 / 服务 / 联系）+ credit 行。

## 3. 哪些组件适合百草源，计划承载什么内容

| 组件 | 百草源用途 |
|---|---|
| Hero | 满屏工厂外景 + 品牌主张 + "查看 OEM/ODM 能力" / "查看产品中心" 双按钮 |
| Services | 产品供货 / OEM/ODM / 三级品控 三项业务 |
| SideBySide | "源头工厂与标准化生产"（工厂外景主图 + 车间叠图） |
| SideBySideReverse | "道地产区直采与三级品控"（亳菊基地主图 + 质检室叠图），CTA → /traceability/ |
| Gallery | 五张产品实拍图（保持错落网格），下方"查看全部 9 款产品" |
| FAQ | 基本信息.md 的四个 FAQ（DOM/ARIA/脚本原样保留） |
| CTASimple | OEM 生产场景背景 + "需要产品目录或 OEM 方案？" + 提交合作需求 → /contact/ |

## 4. 哪些组件不适合，理由

| 组件 | 不适合理由 |
|---|---|
| Testimonials | 包含虚构客户头像、星级评价，不符合"评论、星级和虚构客户头像必须替换"的边界；首页改为唯一新增组件 TraceabilityArchive（流程档案区） |
| Banner | 用于内页顶部横幅，首页不直接使用；保留不动（暂未使用分类） |
| CTAArtDirection | 双图 art-direction 变体，首页用 CTASimple 即可；保留不动 |
| Reviews / TableOfContents / FeaturedPost 等 | 分别属于评价页/博客侧栏，首页无引用；保留不动 |
| DarkModeToggle / dark.less | 用户确认本项目不需要 dark mode，但未授权运行 `remove-dark-mode`，故保留组件与样式、不引用渲染（DarkModeToggle 仍被 DynamicHeader 引用；不再启用不属本轮范围） |

## 5. 全局颜色、字体和按钮变量在哪里修改

`src/styles/root.less` 的 `@media (min-width: 0em) { :root { ... } }` 块：

- 颜色：`--primary`、`--primaryLight`、`--secondary`、`--secondaryLight`、`--headerColor`、`--bodyTextColor`、`--bodyTextColorWhite`
- 尺度：`--topperFontSize`、`--headerFontSize`、`--bodyFontSize`、`--sectionPadding`
- 按钮：`.cs-button-solid`（颜色取 `var(--primary)`，hover 黑色扫入）
- 字体：`astro.config.mjs` 的 `fonts` 数组（`fontProviders.google()` → Roboto，cssVariable `--font-primary`）；BaseLayout 中 `<Font cssVariable="--font-primary" />`；`root.less` body 用 `var(--font-primary)`

品牌化替换点：仅改 `:root` 内变量值（深绿/工艺绿/铜金/主文本/浅背景），不新建 tokens 文件。

## 6. 企业信息在哪里集中维护

- `src/data/client.ts`：`SITE`（title/tagline/description/url/author/locale）、`BUSINESS`（name/email/phone/logo/address/socials）、`SEO`、`OG`。Meta、localBusinessSchema、Footer、BaseLayout 全部消费它。
- `src/data/navData.json`：导航结构（key/url/children）。
- 页面级标题/描述：各 `.astro` 页面的 `<BaseLayout title=... description=...>`。

## 7. 导航如何通过数据驱动

- `DynamicHeader.astro`：import `navData.json`，map 渲染 `.cs-li`；有 `children` 则渲染按钮 + 下拉 `.cs-drop-ul`；当前页通过 `Astro.url.pathname` 比对加 `.cs-active`；`isCurrentPage()` / `getDropdownId()` 来自 `src/js/utils.js`。
- `src/js/nav.js`：移动端菜单开关、下拉键盘交互（Enter/Escape）、焦点管理，全部包在 `astro:page-load`。
- 禁用"在 Header 里手写第二份导航数据"——改 `navData.json` 即改全站导航。

## 8. Hero 如何优化、预加载并传给 BaseLayout

1. `src/pages/index.astro`：`import heroImage from "@assets/images/hero/hero.jpg"`（src/assets → Astro 优化管线）
2. `const optimizedHeroImage = await getImage({ src: heroImage, format: "webp" })`
3. `<BaseLayout heroImage={optimizedHeroImage}>`：BaseLayout 输出 `<link rel="preload" href={optimizedHeroImage.src} as="image" />`，Meta 组件用它做 og:image（1200×600 webp）
4. `<Hero image={optimizedHeroImage} />`：Hero 内 `<Picture src={image.src} width/height={image.attributes.*} formats={["avif","webp"]} priority pictureAttributes={{class:"cs-picture"}} />`——复用已优化产物避免二次处理，`priority` 保证首屏立即加载

百草源改造：替换图片源为 `@assets/images/hero/baicaoyuan-factory-exterior.png`，保留上述全流程。

## 9. View Transitions 下脚本为什么要使用 `astro:page-load`

`ClientRouter`（View Transitions）接管页面跳转后，旧文档被替换为快照，普通 module 脚本只在首次整页加载时执行一次，导航后不会重跑，导致事件监听丢失（如 FAQ 手风琴、移动菜单）。`document.addEventListener("astro:page-load", ...)` 在首次加载和每次导航后都会触发，保证交互在每个页面状态上重新初始化。模板中 `nav.js` 与 FAQ.astro 脚本均遵循此模式；新增 TraceabilityArchive 的交互也应如此（本轮仅静态视觉，无脚本）。

## 10. Decap CMS 和 Content Collections 的既有边界

- **Decap CMS**：`public/admin/config.yml`（backend=git-gateway/DecapBridge、`src/assets/images/blog/` 媒体目录、blog collection 字段 schema）；`src/pages/admin.astro` 挂载 `/admin` 管理台与 preview 样式。CMS 负责编写 markdown 与上传媒体，写回 GitHub。
- **Content Collections**：`src/content.config.ts` 用 `glob` loader 加载 `src/content/blog/*.md`，schema 含 title/description/author/date/image（Astro 图片校验）/imageAlt/isFeatured；`blog/index.astro` 用 `getCollection`，`blog/[post].astro` 用 `getStaticPaths` + `render()`。
- **边界**：CMS 管内容与媒体落盘；Astro 构建时读取、校验、优化、渲染。百草源本轮不动 CMS 与博客，仅保证不破坏其引用。

## 11. `remove-demo` 会删除什么，为什么本项目禁止运行

`npm run remove-demo`（scripts/remove-demo.js）会：

- 移动页面：about / contact / reviews / projects（整目录）到 `scripts/deleted/`
- 移动组件：Footer / Hero / Services / Gallery / SideBySide / SideBySideReverse / Testimonials / FAQ / Reviews / CTA / Banner 到 `scripts/deleted/`
- 移动图片：`src/assets/images/` 下除 `placeholder.jpg` 与 `blog/` 外全部
- 移动图标：check / content-circles / cta-squares / service1-3 / stars
- 重写 `index.astro` 为极简欢迎页、`navData.json` 只留 Home、清理全 src 的 demo 组件 import，并写入 `.demo-removed` 标记文件（防重跑）

本项目**禁止运行**：本项目的全部首页组件（Hero/Services/SideBySide/SideBySideReverse/Gallery/FAQ/CTA）正是要"复用 DOM/scoped LESS/断点，替换品牌内容"的对象；运行它等于销毁施工基线，且 `.demo-removed` 标记会使误操作难以回退。

## 12. README、CHANGELOG、LICENSE 和 CodeTour 的长期保留策略

分类归属"上游技术文档"：**原样保留**，不做品牌化改写。它们是本项目对上游的可追溯依据：

- `README.md`：架构、组件/页面/导航/样式/图片/CMS 全部定制说明的权威来源，长期保留。
- `CHANGELOG.md`：版本基线记录（当前 4.0.0），保留。
- `LICENSE`：CC0 1.0（模板作者放弃版权），保留以维持合规溯源。
- `.tours/`：CodeTour 引导（7 个 `.tour` 文件），保留。
- **已知差异**：README/CHANGELOG 声称 8 个 CodeTour（含 `styling-dark-mode`、扩展名 `.json`），实际仓库仅 7 个 `.tour` 文件，`styling-dark-mode` 从未存在于历史（git 证据：`4f7e475` kit v3 仅引入 7 个）。经用户确认：项目不需要 dark mode，忽略该缺失，不修改上游文件，此处备案。

## 13. 文件分类总表（Phase B 阶段，无"删除"类）

| 分类 | 覆盖范围 |
|---|---|
| 基础设施（原样保留） | astro.config.mjs、package.json、package-lock.json、tsconfig.json、postcss.config.cjs、netlify.toml、public/_redirects、src/content.config.ts、src/env.d.ts、src/js/utils.js、scripts/* |
| 成熟视觉组件（保留结构样式，替换品牌内容） | Hero、Services、SideBySide、SideBySideReverse、Gallery、FAQ、CTASimple、Footer、DynamicHeader、Banner |
| 上游技术文档（原样保留） | README.md、CHANGELOG.md、LICENSE、.tours/*、docs/UPSTREAM.md、docs/TEMPLATE_AUDIT.md |
| 用户可见模板品牌内容（品牌化替换） | src/data/client.ts、src/data/navData.json、src/styles/root.less（品牌变量）、public/assets/favicons/*、图标 logo-black/logo-white、Meta（noindex/虚构声明相关）、Footer（声明与品牌）、首页文案与图片 |
| 暂未使用的组件（停止引用，不删除） | Testimonials、Reviews、CTAArtDirection、TableOfContents、FeaturedPost、DarkModeToggle、blog 相关全部 |

## 14. 已知上游问题（本阶段不修复）

1. `.tours/` 缺 `styling-dark-mode`（README 称 8 个 tour）——用户确认忽略。
2. README 图片优化一节将 CSPicture 路径写作 `src/Components/TemplateComponents`，实际为 `src/components/CSPicture/`。
3. README 组件架构示例中的 `CTAComplex`/`Subscribe.astro` 为示意名，实际仓库无此组件。
4. `src/icons/` 存在两个重名怪名文件（`Icons%2Flogo-black.svg`、`Icons%2Fsun.svg`），疑似 URL 编码误提交，未被任何代码引用。
5. Hero.astro 的 dark-mode 块引用 `.cs-background`（已不存在于 DOM），无效但无害。
