#!/usr/bin/env bash
# 把 website-docs/ 同步到一个独立的 GitHub Pages 仓库并推送。
#
# 项目仓库（<user>/<repo>）部署在 https://<user>.github.io/<repo>/，构建时自动把
# SITE_BASE 设为 /<repo>，站内链接与资源前缀随之调整；用户站点仓库
# <user>/<user>.github.io 或自定义域名仓库部署在根路径，SITE_BASE 为空。
#
# 用法：
#   PAGES_REPO=9Ashwin/9ashwin.github.io ./scripts/publish-pages.sh
#   PAGES_REPO=owner/owner.github.io DRY_RUN=1 ./scripts/publish-pages.sh
#
# 环境变量：
#   PAGES_REPO   必填，目标仓库 owner/name
#   PAGES_DIR    本地检出目录，默认 /tmp/<repo 名>
#   BRANCH       目标分支，默认 main
#   DRY_RUN=1    只同步到本地目录，不提交、不推送
#   SKIP_BUILD=1 跳过本地构建检查（不建议）
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PAGES_REPO="${PAGES_REPO:?请设置 PAGES_REPO，例如 9Ashwin/9ashwin.github.io}"
BRANCH="${BRANCH:-main}"
PAGES_DIR="${PAGES_DIR:-/tmp/$(basename "$PAGES_REPO")}"
DRY_RUN="${DRY_RUN:-0}"
REPO_NAME="$(basename "$PAGES_REPO")"
if [[ -z "${SITE_BASE+x}" ]]; then
  if [[ "$REPO_NAME" == *.github.io ]]; then SITE_BASE=""; else SITE_BASE="/$REPO_NAME"; fi
fi
export SITE_BASE
echo "==> 部署前缀 SITE_BASE='${SITE_BASE}'"

cd "$ROOT"

if [[ "${SKIP_BUILD:-0}" != "1" ]]; then
  echo "==> 构建检查（npm run build）"
  npm run build
fi

echo "==> 同步源码到 $PAGES_DIR"
mkdir -p "$PAGES_DIR"
rsync -a --delete \
  --exclude 'node_modules/' \
  --exclude '.vitepress/cache/' \
  --exclude '.vitepress/dist/' \
  --exclude 'homepage/.next/' \
  --exclude 'homepage/out/' \
  --exclude 'static-site/' \
  --exclude 'releases/' \
  --exclude '.DS_Store' \
  --exclude '*.tsbuildinfo' \
  "$ROOT/" "$PAGES_DIR/"

cd "$PAGES_DIR"
if [[ ! -d .git ]]; then
  git init -q
  git remote add origin "https://github.com/$PAGES_REPO.git"
  git checkout -q -B "$BRANCH"
fi

git add -A
if git diff --cached --quiet; then
  echo "==> 无变化，跳过提交"
else
  git -c user.name="${GIT_AUTHOR_NAME:-Memoh Docs}" \
      -c user.email="${GIT_AUTHOR_EMAIL:-docs@memoh.local}" \
      commit -q -m "docs: publish $(date +%F) site snapshot"
fi

if [[ "$DRY_RUN" == "1" ]]; then
  echo "==> DRY_RUN=1，已停在本地 $PAGES_DIR（未推送）"
  exit 0
fi

echo "==> 推送到 $PAGES_REPO ($BRANCH)"
git push -u origin "$BRANCH" --force
echo "==> 完成。GitHub Actions 会构建并发布到 https://$(echo "$PAGES_REPO" | cut -d/ -f1).github.io/"
