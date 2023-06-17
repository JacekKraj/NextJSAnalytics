import Link from "next/link";

interface PostsListItemProps {
  title: string;
  id: number;
}

export const PostsListItem = ({ title, id }: PostsListItemProps) => {
  return (
    <Link href={`/post/${id}`}>
      <div style={{ border: "1px solid black", padding: 5 }}>{title}</div>
    </Link>
  );
};
