import { useCallback, useMemo, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageInfo } from '../../types/Board';
import CustomImageBlot from './CustomImageBlot';

// 이미지에 src 이외 태그를 넣을 수 있게 커스텀한 Quill 적용
Quill.register(CustomImageBlot, true);
interface QuillEditorProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setImages: React.Dispatch<React.SetStateAction<ImageInfo[]>>;
}

function QuillEditor({ setContent,setImages }: QuillEditorProps) {

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

    // 사용자가 이미지를 업로드하면 blob 객체로 저장
    // base64로 미리보기를 보여주고, 고유ID를 생성하여 태그에 저장
    // 글을 업로드할 경우에 이미지를 s3에 저장
    input.onchange = async () => {
      if (input.files != null && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
          if (quillRef.current && reader.result) {
            // Blob 객체와 고유 ID 저장
            const blob = file; // 이미지 객체
            const imgUrl = ""; // 이미지 s3 url이 들어갈 변수 
            const uniqueId = `id-${new Date().getTime()}-${Math.random().toString(36).substring(2, 11)}`; // 이미지 고유 id
            setImages(prevImages => [...prevImages, { blob, imgUrl, uniqueId }]);

            // Quill 에디터에 이미지 미리보기 추가
            const range = quillRef.current.getEditor().getSelection(true);
            const imageTag = `<img src="${reader.result}" id="${uniqueId}" />`;
            console.log(imageTag);
            quillRef.current.getEditor().clipboard.dangerouslyPasteHTML(range.index, imageTag);
            quillRef.current.getEditor().setSelection(range.index + 1, 0);
          }
        };
        
        reader.readAsDataURL(file);
      }
    };
  }, [setImages]);  

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
