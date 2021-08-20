# ReactBootcamp 第一回勉強会後の開発ドキュメント

<details>
<summary>前回までのBootcamp</summary>

> 次回までの目標
>
> - [x] React のデザインシステムを理解し、アプリの見た目を整えよう！

> 今週のやることリスト
>
> - [x] React のコンポーネントの概念を理解する
> - [x] React の State とライフサイクルについて理解する
> - [x] React のデザインスシテムについて理解する
> - [x] Youtube アプリの構築に必要なコンポーネントの設計
> - [x] 必要ライブラリーのインストール
> - [x] デザインの前に、ルーティングを作成
> - [x] Header のデザインを作成
> - [x] Sidebar のデザイン作成
> - [x] ビデオカードのデザイン作成
> - [x] 動画再生画面のデザイン作成
> - [x] 動画アップロード画面のデザイン作成

</details>

## 次回までの目標

- [ ] インフラを構築して、ユーザーの認証とデータの保存ができるようにしよう

## 今週のやることリスト

- [ ] Bootcamp のインフラアーキテクチャ
- [ ] Firebase Authentication について
- [ ] Firebase Storage について
- [ ] Hasura について
- [ ] GraphQL について
- [ ] Firebase の設定
- [ ] React で Firebase を呼び出す
- [ ] React で認証を実装
- [ ] React でアップローダーを実装
- [ ] Hasura と GraphQL の設定
- [ ] React で GraphQL(Apollo Client の構築)
- [ ] GraphQL Code Generator で爆速開発
- [ ] JWT トークンで GraphQL をセキュアに

### 目次

- [Bootcamp のインフラアーキテクチャ](#bootcamp-のインフラアーキテクチャ)
  - [構成理由 1:開発工数の削減](#開発工数の削減)
  - [構成理由 2:なるべく本番環境に近い構成](#なるべく本番環境に近い構成)
  - [構成理由 3:枯れた技術を踏襲しつつ、トレンドにもノッていく](#枯れた技術を踏襲しつつトレンドにもノッていく)
- [Firebase Authentication について](#firebase-authentication-について)
- [Firebase Storage について](#firebase-storage-について)
- [Hasura について](#hasura-について)
- [GraphQL について](#graphql-について)
- [Firebase の設定](#firebase-の設定)
- [React で Firebase を呼び出す](#react-で-firebase-を呼び出す)
- [React で認証を実装](#react-で認証を実装)
- [React でアップローダーを実装](#react-でアップローダーを実装)
- [Hasura と GraphQL の設定](#hasura-と-graphql-の設定)
- [React で GraphQL](#react-で-graphql)
- [GraphQL Code Generator で爆速開発](#graphql-code-generator-で爆速開発)
- [JWT トークンで GraphQL をセキュアに](#jwt-トークンで-graphql-をセキュアに)

# ReactBootcamp 第三回目勉強会ドキュメント

第三回目は、React から少し離れて、インフラ周りを重点的に構築して、アプリケーションのバックエンド側の構築をしていきます。

とはいえ、サーバーレスなアプリケーション構築を目指していくので、基本的にバックエンド側のコードを書くことはありません。

様々なサービスをうまく使って、工数の少ないアプリケーション開発を目指していきます。

わからないこと、疑問点、ドキュメントやソースコードの間違いなどは下記 Discord にてメッセージお願いします。

[React Bootcamp Discord](https://discord.gg/rCAVXFvEPJ)

## Bootcamp のインフラアーキテクチャ

[第一回目勉強会](https://youtu.be/BzPGDSeJfdM)でもご説明した通り、Bootcamp アプリケーションのインフラは下記のようなサービスを用いて構築していきます。

- Firebase : BaaS
  - Authentication : ユーザー認証
  - Storage : 動画の保存場所
- Hasura : サーバーレスな GraphQL サーバー
  - GraphQL : API のスキーマ
- Heroku : PaaS
  - PostgreSQL : データベースの実態

![bootcamp infra list]()

それぞれのクラウドは以下のようなアーキテクチャで関連しています。

![bootcamp infra architecture]()

データの保存場所としての Hasura と Heroku、ユーザーの認証のための Firebase Authentication、動画を保存する外レージとしての Firebase Storage と言う形で、それぞれを必要に応じて呼び出し分ける形にしています。

今回、このような構成にした理由が 3 つあります。

1.  開発工数の削減
2.  なるべく本番環境に近い構成
3.  枯れた技術を踏襲しつつ、トレンドにもノッていく

- ### 開発工数の削減

今回は、React での開発に集中したいので、バックエンド側の構築は全てサーバーレスな設計で組みました。

特に個人開発の場合は、リソース（時間とお金）が限られているので、最低限の時間で構築できるかつ、Free プランが充実している構成で構築しました。

今回取り上げたサービスは全て Web コンソールが用意されております。

そのため、ターミナルを開いてコマンドを打ったり、ソースコードを書いて環境構築をしたりと言った煩わしい作業から全て開放されます。

それぞれのサービスを使うときは、ブラウザ上でポチポチ設定を選択するだけで、本番環境の構築まで完了します。

これらのサービスを使うことで、もちろん開発のコードを書くスピードも上がりますが、それ以上にインフラ周りの基盤が安定させることができます。

特にセキュリティやスケーリングなどの問題は、それだけで専門のエンジニアが必要なほど深く重い領域です。

それらのことを考えなくても、ある程度のセキュリティを担保されることはエンジニアとしては非常にありがたいですね。

- ### なるべく本番環境に近い構成

今回は、エッジケースでの環境構築をなるべく避けました。

どう言うことかというと、React での開発でよく見かけるインフラのアーキテクチャでは全て Firebase で構築する構成が見受けられます。

今回で言うと、Hasura を用いている箇所が Firebase に置き換えらている構成です。

しかし、Firebase でのデータベース管理では、`NoSQL`と言う`RDB`ではないデータベースの選択肢しかありません。

これの何がいけないかというと、ほとんどの企業では`RDB`を用いたデータベース管理をしているのにも関わらず、「`NoSQL`でアプリを構築できます！」では通用しないということです。

もちろん`NoSQL`を用いてプロダクトを開発している企業はたくさんありますが、それでもその企業の一体どれほどが Firebase を用いているのでしょうか？

このように、Firebase を用いたデータベース管理では、Firebase でのみのデータベースの管理の仕方しか学ぶことができません。

そのため、今回は特定のサービスになるべく依存せずに、広く使われている技術を用いてインフラを整備していきます。

> それでも、サーバーレスな構成を選ぶ以上、何かしらのサービスに依存した環境になってしまいます。  
> それぞれのサービスを選ぶ上で、変更容易性がどれほどあるかを考えながら構築することが必要です。

- ### 枯れた技術を踏襲しつつトレンドにもノッていく

今回の構成で一番のポイント`GraphQL`を用いた構成になっていることではないでしょうか。

`GraphQL`はここ数年でたくさんの運用事例が生まれ、`Github`や`Airbnb`、`Netflix`などの巨大企業が`GraphQL`での開発を進めています。

もう既に`GraphQL`は、革新的な技術からスタンダードな技術へと変貌を遂げつつあります。

とは言え、まだまだ「枯れた技術」の域まではいっていなく、今後も「トレンディングな技術」としてたくさんの導入事例が生まれてくる技術であると思っています。

GraphQL の裏では、昔ながらの RDB である`PostgreSQL`を採用し、完全に「枯れた技術」も採用しています。

全てを新しいトレンディングな技術にするのではなく、枯れた技術も使いながら今の時代に生きるエンジニアとしての力をつけれればと思います。

## Firebase について

## Hasura について

## GraphQL について

## Firebase の設定

## React で Firebase を呼び出す

## React で認証を実装

## React でアップローダーを実装

## Hasura と GraphQL の設定

## React で GraphQL

## GraphQL Code Generator で爆速開発

## JWT トークンで GraphQL をセキュアに
