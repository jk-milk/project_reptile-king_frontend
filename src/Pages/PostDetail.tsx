import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CommentsData, PostCategory, SelectedCategory } from '../types/Board';
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
import { Category } from '../types/Category';
import SearchBar from '../components/Board/SearchBar';
import { RiFileList2Line } from 'react-icons/ri';
import { FaEllipsisV } from 'react-icons/fa';

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
  console.log(comments);

  const [categories, setCategories] = useState<PostCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({ name: "전체 게시글", id: null }); // 선택된 세부 카테고리
  const [showDropdown, setShowDropdown] = useState(false);


  // 카테고리 가져오기  
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiWithoutAuth.get(API + 'categories');
      // console.log(response, "fetchCategories");

      // posts만 뽑기
      const posts = response.data.filter((data: Category) => data.division === 'posts');

      // 각 post에 속하는 subPosts를 찾아서 연결
      const postsWithSubPosts = posts.map((post: Category) => {
        const subPosts = response.data.filter((data: Category) => Number(data.parent_id) === post.id);
        return { ...post, subPosts };
      });
      console.log(postsWithSubPosts, "postsWithSubPosts");

      setCategories(postsWithSubPosts);
    };

    fetchCategories();
  }, []);


  // 카테고리를 선택하면 이동
  const navigateCategory = (id: number) => {
    console.log(id);
    console.log(categories);

    const category = categories.find((category) => category.subPosts.find(category => category.id === id));
    console.log(category);

    if (category) {
      setSelectedCategory({ name: category.name, id: category.id });
      navigate(`/board/lists?category=${id}`); // 다른 쿼리스트링을 모두 삭제하고 category만 추가
    }
  };



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

  // 댓글 목록만 가져오는 함수
  // 새 댓글을 댓글 목록에 추가하는 함수
  const fetchComments = async () => {
    const postsResponse = await apiWithoutAuth.get(`${API}posts/${postId}`);
    setComments(postsResponse.data.comments);
    setSelectedCommentId(null);
  };

  const updateComments = (newComment) => {
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



  if (!post) return <div>Loading...</div>;

  return (
    // <div className="laptop:w-[75rem] w-body m-auto flex min-h-dvh">
    // <div className="max-w-4xl mx-auto p-5 min-h-dvh">
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body m-auto">
      <div className="flex">
        <div className="flex flex-col space-y-4 bg-white mt-20 mb-5 rounded-l px-5 py-4">
          <SearchBar />
          <Link to={`/board/write`}>
            <button className="text-gray-900 border border-gray-100 focus:outline-none bg-white hover:bg-gray-100 focus:ring-1 focus:ring-gray-300 font-medium text-sm px-2 py-1.5 flex items-center">
              <RiFileList2Line className="mr-2" />
              書き込み
            </button>
          </Link>
          <BoardCategory categories={categories} selectedCategory={selectedCategory} onSelectCategory={navigateCategory} />
        </div>
        <div className="bg-white px-5 mt-20 mb-5 rounded-r w-full">
          <div className="rounded-sm my-10 px-5 border border-gray-200">


            {/* <button
            onClick={() => navigate(-1)}
            className="mt-7 mb-4 text-blue-500 hover:text-blue-700"
          >
            ← 뒤로가기
          </button> */}
            <div className="mb-5">
              <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
              <div className="flex items-center justify-between mb-2">
                <div className="flex">
                  <img src="/src/assets/profile.png" alt="프로필 사진" className="w-10 h-10 rounded-full mr-3" />
                  {/* <img src={post.profilePic} alt="profile" className="w-10 h-10 rounded-full mr-3" /> */}
                  <div>
                    <span className="text-gray-700">{post.user.nickname}</span>
                    <div className="text-gray-600 text-sm">
                      <span>{new Date(post.created_at).toLocaleDateString()}</span> |
                      <span> 閲覧 {post.views}</span>
                    </div>
                  </div>
                </div>
                <div className="relative right-4">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FaEllipsisV />
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
                      <div className="py-2">
                        {/* 글 작성자일 경우에만 렌더링 */}
                        <button
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => navigate(`/board/edit/${post.id}`)}
                        >
                          修正
                        </button>
                        {/* 글 작성자나 관리자일 경우에만 렌더링 */}
                        <button
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                          onClick={handleDeletePost}
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="text-gray-600">
              <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span> | <span>조회수: {post.views}</span> | <span>댓글 수: {post.comments.length}</span> | <span>좋아요: {post.likes}</span>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              by {post.user.nickname} •
              <span className="ps-1">{formatCreatedAt(post.created_at)}</span> •
              <MdRemoveRedEye className="inline-block text-black ms-1 mb-0.5" /> {post.views} •
              <FaCommentDots className="inline-block text-black ms-1 mb-0.5" /> {post.comments.length} •
              <BiSolidLike className="inline-block text-black ms-1 mb-0.5" /> {post.likes}
            </div> */}
            </div>
            <hr className="border-t border-gray-400 mb-10" />


            <QuillEditorReader content={post.content} />

          </div>

          <hr className="border-t border-gray-400 mb-10" />

          <div>
            コメント
            {comments.filter(comment => comment.group_comment_id === null).map(comment => (
              <Comment key={comment.id} comment={comment} allComments={comments} postId={postId} updateComments={updateComments} />
            ))}
          </div>

          {/* {comments.map((comment) => (
            <div key={comment.id} className="mb-4" onClick={() => handleShowReplyForm(comment.id)}>
              <div className="text-sm text-gray-600">{comment.user_id} | {new Date(comment.created_at).toLocaleDateString()}</div>
              <div className="text-gray-800">{comment.content}</div>
              {selectedCommentId === comment.id && (
                <CommentForm postId={post.id} parentCommentId={comment.id} onCommentPosted={fetchComments} onCancel={handleHideReplyForm} />
              )}
            </div>
          ))} */}
          <div className="pb-5">
            
            <CommentForm postId={post.id} onCommentPosted={fetchComments} onCancel={handleHideReplyForm} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
