# 部署指南 Deployment（Cloudflare Pages）

> 目标：将百草源 Demo 以纯静态站点托管到 Cloudflare Pages，域名 `demo1.shaojiang61.site`。

## 站点性质

- 纯静态（Astro 静态输出，无 SSR/无服务端依赖）。
- 全站 `noindex,nofollow`（Meta 组件 + `public/robots.txt` Disallow: /）；虚构企业内容不参与搜索索引。
- 部署后如需验证，请使用直链访问；搜索引擎不会收录。

## 已就绪的配置

| 项 | 值 |
|---|---|
| 生产域名 | `https://demo1.shaojiang61.site`（astro.config.mjs `site`、client.ts `SITE.url`、admin config `site_url` 已统一） |
| 构建命令 | `npm run build`（产物 `dist/`，约 27MB） |
| 输出目录 | `dist` |
| Node 版本 | 20+（本机 v26.5.0；Cloudflare Pages 默认 22 可用） |
| 依赖安装 | `npm install`（上游 lockfile，勿升级依赖） |

## 步骤

1. **推送代码**：`feat/baicaoyuan-demo` 分支已推送到 fork（https://github.com/GustavMhaler/demo-baicaoyuan）。建议在 GitHub 上将 `feat/baicaoyuan-demo` 合并到 `main`（由仓库所有者执行），或直接在 Pages 构建设置中指定该分支。

2. **创建 Pages 项目**（dashboard.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git）：
   - 仓库：`GustavMhaler/demo-baicaoyuan`
   - 生产分支：`main`（或 `feat/baicaoyuan-demo`）

3. **构建设置**：
   - Framework preset：`Astro`
   - Build command：`npm run build`
   - Build output directory：`dist`
   - Node.js version：`22`

4. **自定义域名**：
   - Pages 项目 → Custom domains → Add `demo1.shaojiang61.site`
   - 在域名注册商处添加 DNS 记录（Cloudflare 建议 CNAME：`demo1.shaojiang61.site` → `<project>.pages.dev`；若域名已托管在 Cloudflare 则自动完成）

5. **首次构建注意**：
   - `npm install` 会下载 esbuild/sharp 二进制（构建环境网络需可达 npm registry）；
   - 构建耗时约 1-5 分钟（图片优化 432→295 个变体已收敛，冷构建仍需要一段时间）；
   - 若构建环境出现 `node_modules/.astro` 内容缓存问题（删除内容源后旧路由残留），构建前可执行 `rm -rf node_modules/.astro`（Astro v7 已知行为）。

## 部署后验收

- 访问 `https://demo1.shaojiang61.site/` 及各业务页（/products/ /oem/ /traceability/ /factory/ /about/ /contact/）；
- 页脚虚构声明正常显示；
- 页面 `<meta name="robots" content="noindex,nofollow">` 存在；
- 字体请求全部来自本站（DevTools → Network，无 googleapis 等外部请求）；
- `/admin/` 管理台需配置 DecapBridge 认证后才可用（当前未配置，属可选后续项）。

## 已知限制

- Decap CMS 认证（DecapBridge）未配置：博客管理台当前不可用，不影响静态站点访问。
- 表单为演示提交（不实际发送），上线后如需真实询盘需接入表单服务（如 Cloudflare 的 Forms/Worker 或第三方）。
