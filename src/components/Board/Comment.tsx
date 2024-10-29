import { useEffect, useState } from 'react';
import { API } from '../../config';
import { apiWithAuth } from '../common/axios';
import { FaEllipsisV } from 'react-icons/fa';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    depth_no: number;
    user_id: string;
  };
  allComments: Array<{
    id: string;
    content: string;
    parent_comment_id: string;
    created_at: string;
    depth_no: number;
    user_id: string;
  }>;
  postId: string;
  updateComments: (newComment: []) => void;
}

const Comment = ({ comment, allComments, postId, updateComments }: CommentProps) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const childComments = allComments.filter(c => c.parent_comment_id === comment.id);
  console.log(comment.id, childComments);

  useEffect(() => {
    console.log('childComments', childComments);
  }, [childComments]);

  // 대댓글 작성 시
  const handleReplySubmit = async () => {
    if (replyContent.trim() === '') return;
    const postData = {
      post_id: postId,
      content: replyContent,
      parent_comment_id: comment.id,
    };

    try {
      const response = await apiWithAuth.post(`${API}posts/${postId}/comments`, postData);
      console.log('대댓글 작성 성공:', response.data);
      setReplyContent('');
      setShowReplyInput(!showReplyInput);
      updateComments(response.data);
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
    }
  };

  const handleEdit = () => {
    // 수정 로직 추가
    console.log('수정 클릭');
  };

  const handleDelete = async () => {
    try {
      await apiWithAuth.delete(`${API}comments/${comment.id}`);
      updateComments(allComments.filter(c => c.id !== comment.id));
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const marginLeftClasses = [
    'ml-0', 'ml-5', 'ml-10', 'ml-15', 'ml-20',
    'ml-25', 'ml-30', 'ml-35', 'ml-40', 'ml-45', 'ml-50'
  ];

  const commentClssName = `${marginLeftClasses[comment.depth_no] || 'ml-0'} my-2 p-2 rounded border border-gray-300 shadow`
  // const commentClssName = `ml-0 my-2 p-2 rounded border-2 border-green-500`
  const replyInputClassName = `${marginLeftClasses[(comment.depth_no + 1)] || 'ml-0'} my-2 p-4 rounded border border-gray-300 shadow`;
  // const replyInputClassName = marginLeftClasses[(comment.depth_no + 1)] || 'ml-0';
  console.log(replyInputClassName);

  // const replyInputClassName = `ml-5`

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

  return (
    <>
      <div className={commentClssName}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <img src="https://mblogthumb-phinf.pstatic.net/MjAyMDEyMjBfMjU4/MDAxNjA4NDUxOTk3Mjk2.W88f9Phe4d6mo48vpWuZQ9e9R4CvARFvZEoBW9irbXYg.UWAbicHtrZc1hrgYt38Fp79LOnbMhQ6_hcttqmEu79gg.JPEG.goodmanddo/%EC%9B%83%EA%B8%B8_%EC%B9%B4%ED%86%A1%ED%94%84%EC%82%AC_%EA%B8%B0%EB%B3%B8.jpg?type=w800" alt="profile" className="w-10 h-10 rounded-full" />
            <span className="font-bold ml-3 me-2">{comment.user_id}</span>
          </div>
          <div className="relative">
            <button onClick={() => setShowDropdown(!showDropdown)} className="py-1 px-3 text-gray-500 hover:text-gray-700 focus:outline-none">
              <FaEllipsisV />
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg">
                <button onClick={handleEdit} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">修正</button>
                <button onClick={handleDelete} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">削除  </button>
              </div>
            )}
          </div>
        </div>
        <p>{comment.content}</p>
        <span className="text-sm">{formatCreatedAt(comment.created_at)}</span>
        <button onClick={() => setShowReplyInput(!showReplyInput)} className="py-1 px-3 text-gray-600">返信</button>
      </div>
      {showReplyInput && (
        <div className={replyInputClassName}>
          <span>JK</span>
          <textarea
            placeholder="コメントをどうぞ..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            className="appearance-none w-full pt-2 text-gray-700 leading-tight focus:outline-none resize-none overflow-hidden"
          />
          <button onClick={handleReplySubmit} className="mb-1 py-1 px-3 float-right rounded font-bold text-gray-400">登録</button>
          <p className="clear-both"></p>
        </div>
      )}
      {childComments.length > 0 && childComments.map(childComment => (
        <Comment key={childComment.id} comment={childComment} allComments={allComments} postId={postId} updateComments={updateComments} />
      ))}
    </>
  );
};

export default Comment;
