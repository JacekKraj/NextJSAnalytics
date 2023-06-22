import { GetServerSideProps } from "next";
import { FeatureFlags, sendTrackEvent, TrackEventType } from "@/utils";
import { getPosts } from "@/utils/blogPostApi";
import { PostsListItem } from "@/components/PostsListItem";
import { Post } from "@/types";
import { useState } from "react";
import { useFeatureValue } from "@growthbook/growthbook-react";

interface PostsProps {
  posts: Post[];
}

const Posts = (props: PostsProps) => {
  const [isTitleShown, setIsTitleShown] = useState(true);
  const showTitleButtonText = useFeatureValue(FeatureFlags.HideTitle, "control");

  // const hideTitleButtonText = useExperiment(FeatureFlags.HideTitle);
  //
  // console.log(hideTitleButtonText);

  return (
    <>
      <div style={{ display: "flex", marginBottom: 10, alignItems: "center" }}>
        {isTitleShown && <h1 style={{ marginRight: 10 }}>LEARING NEXTJS</h1>}
        <button
          onClick={() => {
            setIsTitleShown(!isTitleShown);
          }}
        >
          {isTitleShown ? showTitleButtonText : "show"}
        </button>
      </div>
      {props.posts.map((post, index) => (
        <div key={post.id}>
          {/*{index % 20 === 0 && <Advertisement width={300} height={250} />}*/}
          <PostsListItem key={post.id} title={post.title} id={post.id} />
        </div>
      ))}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PostsProps> = async ({ res, req }) => {
  const sessionId = res.getHeader("sessionid") as string | undefined;

  const posts = await getPosts();
  sendTrackEvent(TrackEventType.FinishBuildPage, { sessionId: sessionId });

  return {
    props: { posts },
  };
};

export default Posts;
