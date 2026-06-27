# Name Agent 工作区 Triage

- 日期: 2026-06-27
- 仓库: `ava-agent/name-agent`
- 分支: `main`
- 线上地址: `https://name.rxcloud.group`
- 用途: 在继续优化起名应用前，先把本地截图、浏览器验证输出和基础项目材料分组。

## 当前结论

- `.playwright-mcp/` 是本地浏览器自动化日志，已加入 `.gitignore`，不提交。
- 根目录未跟踪 PNG 均为页面验证/修复截图，应先判断是否仍有文档价值。
- 本地 `main` 已 fast-forward 到远端 Ark runtime 迁移提交。
- `AGENTS.md` 已补充项目级工作规则、命令和 Ark 部署变量。
- `README.md` 已补充验证命令、Vercel 部署说明和 Ark 环境变量表。
- `DEPLOYMENT.md` 已补充 Vercel 设置、Ark 环境变量、部署前后检查。
- `package.json` 已新增 `type-check` 和 `test` 脚本，其中 `test` 当前执行 lint + type-check。
- 旧语音识别服务已移除，当前语音入口默认关闭，`/api/transcribe` 返回 501，等待接入火山引擎语音识别。

## 未跟踪截图分组

| 分组 | 文件 | 建议处理 |
|---|---|---|
| 桌面端修复截图 | `fixed-home.png`, `fixed-flow.png`, `fixed-datepicker.png`, `fixed-gender.png`, `fixed-multiselect.png`, `fixed-loading.png`, `fixed-result.png` | 如果需要保留为 QA 证据，迁入 `docs/maintenance/screenshots/` 并在对应说明中引用。 |
| 旧版流程截图 | `homepage.png`, `flow-surname.png` | 与 `public/screenshots/` 中现有产品截图对比，决定替换、归档或删除本地副本。 |
| 移动端截图 | `mobile-home.png`, `mobile-flow-surname.png` | 作为移动端回归证据保留或迁入截图目录。 |

## 推荐提交顺序

1. `maintenance-baseline`: 提交 `.gitignore`、`AGENTS.md`、`README.md`、`DEPLOYMENT.md`、`package.json`、`.env.local.example` 和本 triage 文档。
2. `screenshot-curation`: 审阅根目录 PNG，迁入文档目录或移除本地副本。
3. `ui-regression`: 如果截图对应具体 UI 修复，再单独提交 UI 代码和截图证据。

## 验证记录

- `npm run lint`: 通过。
- `npm run type-check`: 通过。
- `npm run test`: 通过。
- `npm run build`: 通过。

## 后续检查

- 确认 Vercel 环境变量包含 `ARK_API_KEY`、`ARK_BASE_URL` 和 `ARK_CHAT_MODEL`。
- 保持 `.env.local` 本地私有，只提交 `.env.local.example`。
- 如果新增 Playwright 或截图回归测试，再把测试输出目录保持在 ignore 中。
