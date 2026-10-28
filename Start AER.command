#!/bin/zsh
cd "$(dirname "$0")" || exit 1
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v node >/dev/null; then
  echo "AER wymaga Node.js 22.12 lub nowszego. Zainstaluj Node.js z nodejs.org."
  read -k 1
  exit 1
fi
aer_page=$(curl -fsS --max-time 2 http://127.0.0.1:5173/ 2>/dev/null)
case "$aer_page" in
  *'AER · Theremin optyczny'*) open http://127.0.0.1:5173/; exit 0 ;;
esac
if [ ! -d node_modules ]; then
  npm ci --no-audit --no-fund || exit 1
fi
npm run build || exit 1
(sleep 1; open http://127.0.0.1:5173/) &
npm run preview
