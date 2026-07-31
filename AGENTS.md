# AGENTS.md

lbb4511 的个人 Jekyll 站点 + 书籍文本存档，部署到 GitHub Pages，域名 `4511.top`（CNAME 文件）。所有内容为简体中文，请保持 UTF-8。

## 仓库结构（两个世界）

- **Jekyll 博客**（根目录）：Hux-pro 主题。真实页面：`home.md`（→ `/home/`，`layout: page`）、`archive.html`、`about.html`、`_posts/`。`_layouts/`、`_includes/`、`assets/` 为主题文件。
- **docs/ = 书籍文本**：`constitution/`（宪法修正案）、`ch/`（《苍黄》）、`yc/`（《野草》）、`legend/`（《中华远古帝王谱》）。均为**无 front matter** 的纯 Markdown，Jekyll 会原样复制为静态文件。只有 `docs/index.html` 带 `layout: page` front matter（书籍索引页）。不要给这些书稿增删 front matter。

> 书稿里的图片用相对路径引用（如 `docs/yc/README.md` 里的 `img/yc.jpg`），新增配图要连同放好。站点走 GitHub Actions 构建，不依赖 `.nojekyll`。
- **根目录 `index.html`** 是独立静态落地页（无 front matter）——不经过 Jekyll 处理，改动直接上线。

## 部署流程（勿破坏）

- `master` 是源分支。推送到它会触发 `.github/workflows/deploy-gh-pages.yml`，执行 `bundle exec jekyll build --destination _site`（Ruby 3.2），再通过 `peaceiris/actions-gh-pages` 将 `_site/` 强推到 **`gh-pages` 分支**。
- `gh-pages` 是生成的产物——永远不要手动编辑或合并它。
- 保留根目录 `CNAME`（内容 `4511.top`），让它进入 `_site/`；否则自定义域名失效。

## 自动更新的文件（不要手改）

- `main.go`（Go 1.23）抓取黑客派动态，重写 **`README.md` 里**的 `<!--events start -->` … `<!--events end -->` 区块。由 `.github/workflows/update-events.yml` 在 star 时 + 每 18 小时运行（提交信息：`:memo: 更新自述`）。
- 永远不要编辑 `README.md` 中的事件区块，它会被覆盖。
- `home.md` 里有一份**过期的同款事件区块**，机器人不会更新它——别动，或手动同步。

## 命令

```sh
bundle exec jekyll build --destination _site   # 与 CI 完全一致的构建；本地自检用
bundle exec jekyll serve                       # 本地预览（rake preview 等同）
rake post title="A Title"                      # 在 _posts/ 新建文章脚手架（带 front matter）
go run main.go                                 # 事件机器人；重写 README.md，需要联网
```

- 无测试、无 lint 配置。
- 文章必须有 front matter：`layout: post`、`title`、`date`、`author: "Lbb"`、`header-img`、`tags`。
- `rake post` 需要 Ruby/bundler（按 Gemfile `gem install`）；Ruby 和 Go 并非每个开发环境都安装。

## Jekyll 配置怪癖（`_config.yml`）

- `future: true` —— 未来日期的文章也会发布。
- `permalink: pretty` —— `home.md` 渲染为 `/home/`，`docs/index.html` 渲染为 `/docs/`；链接中使用这些相对 URL。
- 构建会排除 `README.md`、`main.go`、`go.mod`、`go.sum`、`Rakefile`、`LICENSE`——对这些文件的改动不影响构建出的站点。
