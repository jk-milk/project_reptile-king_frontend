import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

function QuillEditor({ setContent }: QuillEditorProps) {

  const handleChange = (content: string) => {
    setContent(content);
  };

  return (
    <div>
      <ReactQuill
        onChange={handleChange}
        modules={{
          toolbar: [
            ['image'],
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ]
        }}
        theme="snow"
        className="mx-2 min-h-[20rem]"
      >
      </ReactQuill>
    </div>
  );
}

export default QuillEditor;
