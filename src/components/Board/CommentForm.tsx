import { useRef, useState } from 'react';
import { API } from '../../config';
import { apiWithAuth } from '../common/axios';

interface CommentFormProps {
  postId: number;
  parentCommentId?: number;
  onCommentPosted: () => void;
  onCancel: () => void;
}

// interface CommentFormProps {
//   postId: number;
//   parentCommentId?: number | null;
//   onCommentPosted: () => void;
// }

// function CommentForm({ postId, parentCommentId = null, onCommentPosted }: CommentFormProps) {
//   const [content, setContent] = useState('');

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await apiWithAuth.post(`${API}comments`, {
//         user_id: 1, // 임시 하드코딩 jwt토큰넘길것
//         post_id: postId,
//         content: content,
//         group_comment_id: 1, // 임시 하드코딩
//         parent_comment_id: parentCommentId,
//       });
//       console.log(response)

//       if (response.status === 201) {
//         onCommentPosted(); // 부모 컴포넌트에서 댓글 목록을 다시 불러오는 함수 호출
//         setContent('');
//       }
//     } catch (error) {
//       console.error('댓글 작성 중 오류', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="my-4">
//       <textarea
//         className="w-full border p-2"
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="댓글"
//       />
//       <button type="submit" className="p-2 mt-2">
//         댓글 작성
//       </button>
//     </form>
//   );
// }

function CommentForm({ postId, parentCommentId, onCommentPosted, onCancel}: CommentFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [comment, setComment] = useState('');
  console.log(parentCommentId);
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    // textarea 높이 조절
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  };

  const handleCancel = () => {
    setComment(''); // 입력 필드 초기화
    onCancel(); // 글 상세 페이지에 정의되어 있는 대댓글 창 닫기 함수
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log('댓글 내용:', comment);
    if (parentCommentId) console.log('대댓글 대상 ID:', parentCommentId);

    try {
      const response = await apiWithAuth.post(`${API}posts/${postId}/comments`, {
        post_id: postId,
        content: comment,
        parent_comment_id: parentCommentId || null, // 대댓글이 아니고 일반 댓글일 경우 null
      });
      console.log('댓글 작성 성공:', response.data);
      setComment(''); // 입력 필드 초기화
      onCommentPosted(); // 댓글 목록 다시 불러오기
    } catch (error) {
      if (error instanceof Error) {
        console.error('댓글 작성 중 오류 발생:', error.message);
      } else {
        console.error('알 수 없는 오류 발생:', error);
      }
    }
  };

  return (
    <div className="border border-gray-300 bg-white shadow rounded p-4">
      <span>JK</span>
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={comment}
          onChange={handleChange}
          placeholder="コメントをどうぞ"
          className="appearance-none w-full pt-2 pb-6 text-gray-700 leading-tight focus:outline-none resize-none overflow-hidden"
        />
        {/* 대댓글일 때만 취소 버튼 보여주기 */}
        {parentCommentId && (
          <button
            type="button" // submit이 아닌 일반 버튼으로 설정
            onClick={handleCancel}
            className="text-gray-400 font-bold px-1 absolute bottom-0 right-14"
          >
            キャンセル
          </button>
        )}

        <button
          type="submit" 
          className="text-gray-400 font-bold px-1 absolute bottom-0 right-2"
        >
          登録
        </button>
      </form>
    </div>
  );
}

export default CommentForm;
