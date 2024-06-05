import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CommentsData } from '../types/Board';
import BoardCategory from '../components/Board/BoardCategory';
import PopularPosts from '../components/Board/PopularPosts';
import { BiSolidLike } from 'react-icons/bi';
import { FaCommentDots } from 'react-icons/fa6';
import { MdRemoveRedEye } from 'react-icons/md';
import QuillEditorReader from '../components/Board/QuillEditorReader';
import { API } from '../config';
import Comment from '../components/Board/Comment';
import CommentForm from '../components/Board/CommentForm';
import { apiWithAuth, apiWithoutAuth } from '../components/common/axios';

interface Post {
  id: number;
  user_id: number;
  user: {
    id: number;
    nickname: string;
  };
  title: string;
  content: string;
  category_id: number;
  category: {
    id: number;
    division: string;
    img_url: null;
    name: string;
    parent_id: string;
  }
  img_urls: { [key: string]: string } | null;
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
  comments: [];
}

function PostDetail() {
  const navigate = useNavigate();
  const postId = useParams().postId;
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<CommentsData[]>([]);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  console.log(post?.created_at);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsResponse = await apiWithoutAuth.get(`${API}posts/${postId}`);
        console.log(postsResponse.data);

        setPost(postsResponse.data);
        setComments(postsResponse.data.comments);

        // const commentsResponse = await apiWithoutAuth.get(`${API}comments?post_id=${postId}`);
        // setComments(commentsResponse.data);
      } catch (err) {
        alert("잘못된 경로입니다!");
        navigate("/board");
      }
    };

    fetchPosts();
  }, [postId, navigate]);

  // // 대댓글을 포함하여 댓글을 정렬하는 함수
  // const sortCommentsWithReplies = (comments: CommentsData[]) => {
  //   const sortedComments: Comment[] = [];
  //   comments.forEach(comment => {
  //     if (comment.parent_comment_id === null) { // 최상위 댓글
  //       sortedComments.push(comment);

  //       // 대댓글 찾기
  //       comments.forEach(reply => {
  //         if (reply.parent_comment_id === comment.id) {
  //           sortedComments.push(reply);
  //         }
  //       });
  //     }
  //   });

  //   return sortedComments;
  // };

  // 댓글 목록만 가져오는 함수
  // 새 댓글을 댓글 목록에 추가하는 함수
  const fetchComments = async () => {
    const postsResponse = await apiWithoutAuth.get(`${API}posts/${postId}`);
    setComments(postsResponse.data.comments);
    setSelectedCommentId(null);
  };
  const handleNewComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const handleDeletePost = async () => {
    const response = await apiWithAuth.delete(`${API}posts/${postId}`)
    console.log(response);
    navigate('/board/lists');
  }

  // 댓글 클릭 시 대댓글 작성을 하기 위한 함수
  const handleShowReplyForm = (id: number) => {
    setSelectedCommentId(id);
  };

  // 대댓글에서 취소 버튼을 눌렀을 시 대댓글 폼을 숨기는 함수
  const handleHideReplyForm = () => {
    setSelectedCommentId(null);
  }

  // 날짜 형식 변경 함수 
  function formatCreatedAt(createdAt: string) {
    // Date 객체로 변환
    const date = new Date(createdAt);
  
    // Intl.DateTimeFormat을 사용해 원하는 형식으로 날짜 및 시간 포맷
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false
    };
    const formattedDate = new Intl.DateTimeFormat('ko-KR', options).format(date);
  
    // 포맷된 날짜에서 구분자 변경 ('-'를 '.'으로, ','를 공백으로)
    return formattedDate.replace(/-/g, '.').replace(/(\d{2}),/, '$1').trim();
  }

  if (!post) return <div>Loading...</div>;

  return (
    // <div className="laptop:w-[75rem] w-body m-auto flex min-h-dvh">
    <div className="max-w-4xl mx-auto p-5 min-h-dvh">
      <div className="bg-gray-200 px-5 mt-20 mb-5 rounded">
        <button
          onClick={() => navigate(-1)}
          className="mt-2 mb-4 text-blue-500 hover:text-blue-700"
        >
          ← 뒤로가기
        </button>
        <div className="mb-5">
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div className="flex items-center mb-2">
            <img src="/src/assets/profile.png" alt="프로필 사진" className="w-10 h-10 rounded-full mr-3" />
            {/* <img src={post.profilePic} alt="profile" className="w-10 h-10 rounded-full mr-3" /> */}
            <span className="text-gray-700">{post.user.nickname}</span>
          </div>
          <div className="text-gray-600">
            <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span> | <span>조회수: {post.views}</span> | <span>댓글 수: {post.comments.length}</span> | <span>좋아요: {post.likes}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            by {post.user.nickname} •
            <span className="ps-1">{formatCreatedAt(post.created_at)}</span> •
            <MdRemoveRedEye className="inline-block text-black ms-1 mb-0.5" /> {post.views} •
            <FaCommentDots className="inline-block text-black ms-1 mb-0.5" /> {post.comments.length} •
            <BiSolidLike className="inline-block text-black ms-1 mb-0.5" /> {post.likes}
          </div>
        </div>
        <div>
          {/* 글 작성자일 경우에만 렌더링 */}
          <button onClick={() => navigate(`/board/edit/${post.id}`)}>수정</button>
          {/* 글 작성자나 관리자일 경우에만 렌더링 */}
          <button onClick={handleDeletePost}>삭제</button>
        </div>

        <QuillEditorReader content={post.content} />
        {comments.map(comment => (
          <div key={comment.id} >
            {/* <Comment comment={comment} allComments={comments} postId={postId} updateComments={handleNewComment} /> */}
          </div>
        ))}
        {comments.map((comment) => (
          <div key={comment.id} className="mb-4" onClick={() => handleShowReplyForm(comment.id)}>
            <div className="text-sm text-gray-600">{comment.user_id} | {new Date(comment.created_at).toLocaleDateString()}</div>
            <div className="text-gray-800">{comment.content}</div>
            {selectedCommentId === comment.id && (
              <CommentForm postId={post.id} parentCommentId={comment.id} onCommentPosted={fetchComments} onCancel={handleHideReplyForm} />
            )}
          </div>
        ))}
        <div className="pb-5">
          댓글
          <CommentForm postId={post.id} onCommentPosted={fetchComments} onCancel={handleHideReplyForm} />
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
