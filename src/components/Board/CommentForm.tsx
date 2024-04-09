import { useState } from 'react';
import { API } from '../../config';
import { apiWithAuth } from '../../api/axios';

interface CommentFormProps {
  postId: number;
  parentCommentId?: number | null; // 선택적 프로퍼티이며, null이 될 수도 있음을 명시
  onCommentPosted: () => void; // 새 댓글 작성 후 호출될 함수, 반환 타입이 없음(void)
}

function CommentForm({ postId, parentCommentId = null, onCommentPosted }: CommentFormProps) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiWithAuth.post(`${API}comments`, {
        user_id: 1, // 임시 하드코딩 jwt토큰넘길것
        post_id: postId,
        content: content,
        group_comment_id: 1, // 임시 하드코딩
        parent_comment_id: parentCommentId,
      });
      console.log(response)

      if (response.status === 201) {
        onCommentPosted(); // 부모 컴포넌트에서 댓글 목록을 다시 불러오는 함수 호출
        setContent('');
      }
    } catch (error) {
      console.error('댓글 작성 중 오류', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <textarea
        className="w-full border p-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글"
      />
      <button type="submit" className="p-2 mt-2">
        댓글 작성
      </button>
    </form>
  );
}

export default CommentForm;
