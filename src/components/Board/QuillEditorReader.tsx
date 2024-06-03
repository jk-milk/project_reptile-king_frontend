import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  content: string;
}

function QuillEditorReader({ content }: QuillEditorProps) {

  return (
    <div>
      <ReactQuill
        readOnly
        theme="bubble"
        className="min-h-[20rem]"
        defaultValue={content}
      />
        {/* <p className="whitespace-pre-line text-gray-800 mb-5">{post.content}</p> */}
    </div>
  );
}

export default QuillEditorReader;
