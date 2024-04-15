import { useCallback, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface QuillEditorProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

interface ImageInfo {
  blob: Blob;
  url: string;
  base64: string;
  index: number; // 이미지 삽입 위치
}

function QuillEditor({ setContent }: QuillEditorProps) {

  const [images, setImages] = useState<ImageInfo[]>([]);
  const quillRef = useRef<ReactQuill | null>(null);

  const handleChange = (content: string) => {
    setContent(content);
  };

  // 이미지 처리 핸들러
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    // 사용자가 이미지를 선택하면 Blob 객체를 메모리에 저장
    // 이미지 파일의 위치도 같이 저장

    // 미리보기를 위해서 Base64로 보여주기

    // 서버에 보낼 때에는 Base64 문자열을 삭제하고 그 위치에 Blob 객체의 내용을 보내기

    input.onchange = async () => {
      if (input.files != null && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64 = reader.result as string;
          const blob = new Blob([file], { type: file.type });
          const url = URL.createObjectURL(blob);
          if (quillRef.current) {
            const range = quillRef.current.getEditor().getSelection(true);
            const index = range.index;
            
            quillRef.current.getEditor().insertEmbed(index, 'image', base64);
            
            setImages(prevImages => [...prevImages, { blob, url, base64, index }]);
          }
        };
        
        
        reader.readAsDataURL(file);
      }
    };
  }, []);  

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image', 'video'],
          ['clean']
        ],
        // [
        //   ['image'],
        //   [{ 'header': [1, 2, false] }],
        //   ['bold', 'italic', 'underline', 'strike'],
        //   ['blockquote', 'code-block'],
        //   [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        //   [{ 'script': 'sub'}, { 'script': 'super' }],
        //   [{ 'indent': '-1'}, { 'indent': '+1' }],
        //   [{ 'color': [] }, { 'background': [] }],
        //   [{ 'align': [] }],
        //   ['clean']
        // ],
        handlers: {
          'image': imageHandler
        }
      }
    };
  }, [imageHandler]);


  return (
    <div>
      <ReactQuill
        ref={quillRef}
        onChange={handleChange}
        modules={modules}
        theme="snow"
        className="mx-2 min-h-[20rem]"
      >
      </ReactQuill>
    </div>
  );
}

export default QuillEditor;
