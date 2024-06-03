import { useState } from 'react';
import { API } from '../../config';
import { apiWithAuth } from '../common/axios';

interface CommentProps {
  comment: {
    id: string;
    content: string;
    created_at: string;
    depth_no: number;
  };
  allComments: Array<{
    id: string;
    content: string;
    parent_comment_id: string;
    created_at: string;
    depth_no: number;
  }>;
  postId: string;
  updateComments: (newComment: []) => void;
}

const Comment = ({ comment, allComments, postId, updateComments }: CommentProps) => {
  const [replyContent, setReplyContent] = useState<string>('');
  const [showReplyInput, setShowReplyInput] = useState<boolean>(false);

  const childComments = allComments.filter(c => c.parent_comment_id === comment.id);

  const handleReplySubmit = async () => {
    if (replyContent.trim() === '') return;
    const postData = {
      post_id: postId,
      content: replyContent,
      parent_comment_id: comment.id,
    };

    try {
      const response = await apiWithAuth.post(`${API}posts/${postId}/comments`, postData);
      console.log(response.data);
      setReplyContent('');
      setShowReplyInput(!showReplyInput);
      updateComments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className={`ml-${comment.depth_no * 5} bg-transparent my-2 p-2 rounded border-2 border-green-500`}>
        <div className="flex items-center mb-2">
          <img src="https://mblogthumb-phinf.pstatic.net/MjAyMDEyMjBfMjU4/MDAxNjA4NDUxOTk3Mjk2.W88f9Phe4d6mo48vpWuZQ9e9R4CvARFvZEoBW9irbXYg.UWAbicHtrZc1hrgYt38Fp79LOnbMhQ6_hcttqmEu79gg.JPEG.goodmanddo/%EC%9B%83%EA%B8%B4_%EC%B9%B4%ED%86%A1%ED%94%84%EC%82%AC_%EA%B8%B0%EB%B3%B8.jpg?type=w800" alt="profile" className="w-10 h-10 rounded-full" />
          <div className="ml-3">
            <span className="font-bold text-white">갈아만든2%</span>
            <span className="text-sm text-white">{comment.created_at}</span>
          </div>
        </div>
        <button onClick={() => { setShowReplyInput(!showReplyInput) }} className="py-1 px-3 rounded bg-green-500 text-white">Reply</button>
        <p className="text-white">{comment.content}</p>
      </div>
      {showReplyInput && (
        <div>
          <textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={e => setReplyContent(e.target.value)}
            className="mt-2 p-2 rounded border-2 border-green-500 text-white w-full"
          />
          <button onClick={handleReplySubmit} className="mt-2 py-1 px-3 rounded bg-green-500 text-white">Submit</button>
        </div>
      )}
      {childComments.length > 0 && (
        <div>
          {childComments.map(childComment => (
            <Comment key={childComment.id} comment={childComment} allComments={allComments} postId={postId} updateComments={updateComments} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
