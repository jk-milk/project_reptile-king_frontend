import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Post } from '../../types/Board';

interface QuillEditorProps {
  post: Post;
}

function QuillEditorReader({ post }: QuillEditorProps) {

  return (
    <div>
      <ReactQuill
        readOnly
        theme="bubble"
        className="min-h-[20rem]"
        defaultValue={post.content}
      />
    </div>
  );
}

export default QuillEditorReader;
