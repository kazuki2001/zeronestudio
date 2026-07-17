# ZERONE STUDIO

ZERONE STUDIO の公式ポートフォリオサイト。映像制作・ブランドフィルム・デジタル体験を手がけるクリエイティブスタジオのための、ミニマルでエディトリアルなウェブサイトです。

ビルドツール不要の静的サイト（HTML / CSS / Vanilla JS）です。GSAP でスクロール演出、ページ遷移カーテン、マグネティックカーソルなどのシネマティックなモーションを実装しています。

## 構成

```
zerone-studio/
├── index.html                 トップページ（Hero / Work / Services / Principles / Contact）
├── work/
│   ├── wave-hotel-pattaya.html
│   ├── starbucks-pattaya.html
│   └── terminal21-tokyo-zone.html
├── css/style.css              デザインシステム一式
├── js/main.js                 モーション・ページ遷移・カーソル制御
└── assets/
    ├── hero/                  トップページ用画像
    └── work/<project>/        各プロジェクトの hero.mp4 / hero.jpg / thumb.jpg / gallery-*.jpg
```

## ローカルで確認する

ビルド不要。フォルダ内で簡易サーバーを立てて開くだけです。

```bash
cd zerone-studio
python3 -m http.server 8000
# http://localhost:8000 をブラウザで開く
```

## GitHub Pages で公開する

このリポジトリをそのまま GitHub Pages にデプロイできます。

1. GitHub のリポジトリ設定 → **Pages**
2. Source を `Deploy from a branch` にし、Branch を `main` / フォルダを `/(root)` に設定
3. 数分後に `https://<ユーザー名>.github.io/<リポジトリ名>/` で公開されます
