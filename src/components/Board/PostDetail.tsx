import { Post } from "../../types/Board"

const PostList = ({ post }: { post: Post | null }) => {
  return (
    <div className="bg-gray-200 px-5 mb-5 rounded">
      {post ? (
        <div>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
export default PostList