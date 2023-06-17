import { GetServerSideProps } from "next";
import { getPost, getPosts } from "@/utils/blogPostApi";
import { sendTrackEvent, TrackEventType } from "@/utils";
import { Post } from "@/types";

type PostProps = Post;

const Post = ({ title, body }: PostProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<Post> = async ({ req, res, query }) => {
  const sessionId = res.getHeader("sessionid") as string | undefined;

  const post = await getPost(query.postId as string);
  sendTrackEvent(TrackEventType.FinishBuildPage, { sessionId: sessionId });

  return {
    props: { ...post },
  };
};

export default Post;
