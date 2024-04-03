import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Post, Comment } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import PopularPosts from '../components/Board/PopularPosts';
import { BiSolidLike } from 'react-icons/bi';
import { FaCommentDots } from 'react-icons/fa6';
import { MdRemoveRedEye } from 'react-icons/md';
import QuillEditorReader from '../components/Board/QuillEditorReader';
import { API } from '../config';
import CommentForm from '../components/Board/CommentForm';

function BoardDetail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get("id");
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = await axios.get(API + `posts/${postId}`); // json server
        console.log(postsResponse.data)
        setPost(postsResponse.data);

        const commentsResponse = await axios.get(`${API}comments?post_id=${postId}`);
        setComments(commentsResponse.data);
      } catch (err) {
        alert("잘못된 경로입니다!");
        navigate("/board");
      }
    };

    fetchPosts();
  }, [postId, navigate]);

  // 대댓글을 포함하여 댓글을 정렬하는 함수
  const sortCommentsWithReplies = (comments: Comment[]) => {
    const sortedComments: Comment[] = [];
    comments.forEach(comment => {
      if (comment.parent_comment_id === null) { // 최상위 댓글
        sortedComments.push(comment);

        // 대댓글 찾기
        comments.forEach(reply => {
          if (reply.parent_comment_id === comment.id) {
            sortedComments.push(reply);
          }
        });
      }
    });

    return sortedComments;
  };

  // 댓글 목록을 다시 가져오는 함수
  const onCommentPosted = async () => {
    const commentsResponse = await axios.get(`${API}comments?post_id=${postId}`);
    setComments(commentsResponse.data);
  };

  return (
    <div className="laptop:w-[75rem] w-body m-auto flex min-h-dvh">
      {post ? (
        <>
          <div className="mt-20">
            <BoardCategory />
          </div>
          <div className="laptop:w-[47.6875rem] w-mainContent">
            <div className="bg-gray-200 px-5 mt-20 mb-5 rounded">
              <div className="pb-4">
                <button className="mt-2 mb-4" onClick={() => navigate(-1)}>← Go back</button>
                <div className="mb-4 flex justify-between">
                  <div>
                    <p className="font-bold">{post.title}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      by {post.user_id} • {post.created_at} • <MdRemoveRedEye className="inline-block text-black" /> {post.views} • <FaCommentDots className="inline-block text-black" /> 댓글 수 • <BiSolidLike className="inline-block text-black" /> {post.likes}
                    </div>
                  </div>
                  {/* 사용자 프로필 사진 서버에서 가져오기 */}
                  <img src="/src/assets/profile.png" alt="프로필 사진" className="w-12 h-12" />
                </div>
                <QuillEditorReader post={post} />
              </div>
              <div>
                <h3>댓글</h3>
                {sortCommentsWithReplies(comments).map((comment, index) => (
                  <div key={index} className={`border-b border-gray-300 py-2 ${comment.parent_comment_id ? 'ml-4' : ''}`}>
                    <p className="text-sm font-semibold">{comment.user_id}</p>
                    <p>{comment.content}</p>
                    <p className="text-xs text-gray-500">{comment.created_at}</p>
                  </div>
                ))}
              </div>
              <CommentForm postId={Number(postId)} onCommentPosted={onCommentPosted} />
            </div>
          </div>
          <PopularPosts />
        </>
      ) : null}
    </div>
  )
}

export default BoardDetail;
