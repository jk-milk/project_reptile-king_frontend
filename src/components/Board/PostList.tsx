// import axios from 'axios';
// import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Post } from "../../types/Board";
// import { Comment } from "../../types/Board";
// import { FaCommentDots } from "react-icons/fa";
import { BiSolidLike } from "react-icons/bi";

const PostList = ({ posts }: { posts: Post[] }) => {
  // 실제 api와 연결해서 댓글 수 출력하는 코드 임시
  // const [comments, setComments] = useState<{ [key: number]: Comment[] }>({});

  // useEffect(() => {
  //   const fetchComments = async (postId: number) => {
  //     const res = await axios.get(`http://localhost:8080/api/posts/${postId}/comments`);
  //     setComments(prev => ({ ...prev, [postId]: res.data }));
  //   }

  //   posts.forEach(post => fetchComments(post.id));
  // }, [posts]);

  // 현재 시간과 post의 create_at과의 차이를 출력
  function timeFromNow(date: string) {
    const now = new Date();
    const postDate = new Date(date);

    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return `${diffInWeeks} weeks ago`;
    }
  }

  // html 태그를 제외하고 순수 텍스트만 추출하는 함수
  function htmlToText(content: string) {
    const reg = /<[^>]*>?/g; // html 태그 정규식
    return content.replace(reg, '');
  }

  // 글 내용이 82자 이상이면 잘라서 반환하는 함수
  function cutText(content: string) {
    const maxLength = 82;
    if (content.length >= maxLength) {
      return content.substring(0, maxLength) + "...";
    } else {
      return content;
    }
  }

  return (
    <div className="bg-[#f9f9f9] px-5 min-h-[50rem]">
      {posts.length === 0 ?
        <div className="min-h-96">
          글이 없습니다.
        </div> :
        <>
          {posts.map((post) => (
            <div key={post.id} className="py-4 flex justify-between">
              <div className="w-full">
                <div className="text-lg font-bold">
                  <Link to={`/board/view/?id=${post.id}`}>{post.title}</Link>
                </div>
                <div className="text-gray-600 pt-2">
                  <Link to={`/board/view/?id=${post.id}`}>{cutText(htmlToText(post.content))}</Link>
                </div>
                <div className="pt-4">
                  <span className="text-gray-400">by </span>
                  <span className="text-gray-600 pe-2">{post.user_id}</span>
                  <span className="text-gray-600 pe-2">•</span>
                  <span className="text-gray-600 pe-2">{timeFromNow(post.created_at)}</span>
                  {/* 실제 api와 연결해서 댓글 수 출력하는 코드 임시 */}
                  {/* {comments[post.id] && comments[post.id].length > 0 && ( // 댓글이 있는지 검사 -> 댓글이 1개 이상 있는지 검사
              <>
              <span className="text-gray-400">•</span>
              <FaCommentDots className="inline-block pe-1 pb-1"/>
              <span className="text-gray-600 pe-2">{comments[post.id].length} comments</span>
              </>
              )} */}
                  <span className="text-gray-600 pe-2">•</span>
                  <BiSolidLike className="inline-block pe-1 pb-1" />
                  <span className="text-gray-600 pe-2">{post.likes}</span>
                </div>
              </div>
              <div className="w-20">
                {/* 사용자 프로필 이미지 차후 구현 */}
                <img src="/src/assets/profile.png" alt="" />
              </div>
            </div>
          ))}
        </>
      }
    </div>
  );
};

export default PostList;
