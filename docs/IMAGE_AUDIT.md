# 图片产物审计报告 Image Audit

> 审计日期：2026-08-12。基线：`dist/` 构建产物（`npm run build`）。

## 结论摘要

| 指标 | 优化前 | 优化后 | 变化 |
|---|---|---|---|
| dist 总大小 | 101 MB | **27 MB** | **-73%** |
| 图片文件总数 | 295 | 295 | 不变 |
| 图片总大小 | 88.7 MB | **14.3 MB** | **-84%** |
| png 文件 | 87 个 / 80.1 MB | **1 个 / 0.2 MB** | -99.8% |
| webp | 125 个 / 6.6 MB | 125 个 / 6.6 MB | 不变 |
| avif | 83 个 / 2.1 MB | 83 个 / 2.1 MB | 不变 |
| jpeg（fallback） | 0 | 86 个 / 5.4 MB | 新增（旧浏览器回退） |
| 字体（woff2） | 9.4 MB | 9.4 MB | 不变（MiSans 全中文字体，必要） |

## 根因

全部源素材为 PNG（工厂/基地场景 1672×941、产品图 1254×1254、logo 1212×446）。Astro `<Picture>` 在源为 PNG 时，生成的 **fallback `<img>` 与响应式宽度变体保持 PNG 格式**：每个 `<Picture>` 调用点输出一张近原尺寸的 PNG（单张可达 2.5MB），87 张合计 80.1MB，占 dist 约 80%。

## 修复

全部 17 处 `<Picture>` 组件调用增加 `fallbackFormat="jpeg"`（涉及 Hero / Banner / SideBySide / SideBySideReverse / Gallery / CTASimple / ProductCatalog / InquiryForm）：

- 现代浏览器仍优先加载 avif → webp source（视觉与性能不变，已实测各页 `<picture>` 输出 image/avif + image/webp）；
- 仅在不支持 avif/webp 的旧浏览器中回退到 jpeg（体积约为 png 的 1/10）；
- 唯一保留的 png 是透明底 LOGO（透明通道必需）。

## 剩余构成与可选优化（不阻塞部署）

| 项 | 大小 | 说明 |
|---|---|---|
| 图片（avif/webp/jpeg） | 14.3 MB | 已优化 |
| MiSans 字体 | 9.4 MB | 全中文字库，必需；可选做字体子集化/按需 unicode-range（需验证不影响全部页面文案，建议后续单独评估） |
| 页面 HTML / public 资源 | ~3 MB | favicons、social.jpg、admin 资源等 |

## 部署体积结论

27MB 的静态产物对 Cloudflare Pages 完全可接受（免费额度 500 次构建/月，无带宽限制）。图片产物无需进一步处理即可部署。
