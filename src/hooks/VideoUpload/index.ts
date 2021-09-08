import { useEffect, useState } from "react";
import { storage } from "../../utils/Firebase/config";
import { v4 as uuidv4 } from "uuid";
import {
  useInsertVideoMutation,
  VideosDocument,
} from "../../utils/graphql/generated";

type UploadProps = {
  file: {
    thumbnail: File;
    video: File;
  };
  title: string;
  description?: string;
  ownerId: string;
};

export const useVideoUpload = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();

  // 動画のメタデータを保存するGraphQL Mutation
  const [mutation, { error: apolloError }] = useInsertVideoMutation({
    refetchQueries: [{ query: VideosDocument }],
  });

  // Firebase Storageにファイルをアップロードする処理
  const uploadStorage = (id: string, file: File, path: string) => {
    // ファイルから拡張子を抜き出す
    const exe = file.name.split(".").pop();

    // `ref`でファイルのパスを指定する。
    // → PCのディレクトリと同じ考え方。ref('videos/video.mp4')とすれば、videosという階層にvideo.mp4を作成する
    //
    // putでファイルのアップロードを実際に行う
    // `ref`で指定したパスに対して、ファイルの実態をアップロードする
    return storage.ref(`${path}/${id}.${exe}`).put(file);
  };

  const upload = async ({ file, title, description, ownerId }: UploadProps) => {
    // 処理が始まったら、ローディング中にする
    setLoading(true);

    const videoName = uuidv4();
    const thumbName = uuidv4();
    const videoId = uuidv4();

    // try-catch構文でPromise(アップロード処理)のエラーをキャッチする
    try {
      // 動画のアップロード処理
      // 動画は全て`videos`と言う階層に保存される
      const videoUploadTask = await uploadStorage(
        videoName,
        file.video,
        "videos"
      );

      // 画像サムネイルのアップロード処理
      // 画像サムネイルは全て`thumbnails`に保存される
      const thumbnailUploadTask = await uploadStorage(
        thumbName,
        file.thumbnail,
        "thumbnails"
      );


      const res = await mutation({
        variables: {
          id: videoId,
          title,
          description,
          video_url: videoUploadTask.ref.fullPath,
          thumbnail_url: thumbnailUploadTask.ref.fullPath,
          owner_id: ownerId,
        },
      });

      return res.data?.insert_videos_one;
    } catch (error) {
      // アップロードの途中でエラーが発生したら、処理を中断して、ここに記述される処理が行われる

      console.error(error);
      setError(new Error("エラーが発生しました。最初からやり直してください。"));
    } finally {
      // 全ての処理が完了したら、ローディングをfalseにする
      setLoading(false);
    }
  };

  useEffect(() => {
    if (apolloError) {
      console.error(apolloError);
      setError(new Error("エラーが発生しました。最初からやり直してください。"));
    }
  }, [apolloError]);

  return {
    upload,
    loading,
    error,
  };
};
