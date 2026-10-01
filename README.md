# Room mirror

Room mirrorは，PCに接続したWebカメラの映像を車のルームミラーに近い比率で表示するLinux向けアプリです．カメラ映像は左右反転された状態で表示され，画角の下部が表示されます．

操作パネルではカメラの切り替えと最前面表示の設定が可能です．パネルは操作しない間，自動で非表示になります．

## 起動方法

Node.jsとnpmをインストールしてから，次のコマンドを実行してください．

```bash
git clone https://github.com/H1S4G10rc4/roommirror.git
cd roommirror
npm install
npm start
```

`npm start`でXWaylandを使って起動します．GNOME環境で最前面表示を利用できます．

## ビルド

```bash
npm run dist
```

AppImageとtar.gzの出力先は`outputs`ディレクトリです．

## ライセンス

MIT Licenseで公開しています．詳しくは[LICENSE](LICENSE)を参照してください．
