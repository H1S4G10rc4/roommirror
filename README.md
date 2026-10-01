# Room mirror

Room mirrorは、PCに接続したWebカメラの映像を、車のルームミラーに近い4:1の比率で表示するLinux向けアプリです。映像は常に左右反転し、ウィンドウからはみ出す上側の画角を切り取ります。録画や外部送信は行いません。

ウィンドウにはタイトルバーがなく、映像部分をドラッグして移動できます。操作パネルではカメラの切り替えと最前面表示の設定が可能です。パネルは操作しない間、自動で非表示になります。

## 起動方法

Node.jsとnpmをインストールしてから、次のコマンドを実行してください。

```bash
git clone https://github.com/H1S4G10rc4/roommirror.git
cd roommirror
npm install
npm start
```

`npm start`はXWaylandを使って起動します。GNOME環境でも最前面表示を利用できます。

## ビルド

```bash
npm run dist
```

AppImageとtar.gzの出力先は、`outputs`ディレクトリです。

## ライセンス

MIT Licenseで公開しています。詳しくは[LICENSE](LICENSE)を参照してください。
