import { useCallback, useMemo, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { API } from '../../config';
import { apiWithoutAuth } from '../common/axios';

interface QuillEditorProps {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

function QuillEditor({ setContent }: QuillEditorProps) {

  const quillRef = useRef<ReactQuill | null>(null);

  const handleChange = (content: string) => {
    setContent(content);
  };

  // 이미지 업로드
  const uploadImageToServer = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('division', 'posts');

    try {
      const response = await apiWithoutAuth.post(`${API}upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        console.log('이미지 업로드 성공:', response.data);
        return response.data; // 성공 시, 응답 데이터 반환
      } else {
        console.error('이미지 업로드 실패:', response);
        return null;
      }
    } catch (error) {
      console.error('이미지 업로드 중 에러 발생:', error);
      return null;
    }
  };
  
  // 이미지 처리 핸들러
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      if (input.files != null && input.files[0]) {
        const file = input.files[0];
        if (file) {
          const response = await uploadImageToServer(file);
          if (response && quillRef.current) {
            const range = quillRef.current.getEditor().getSelection(true);
            quillRef.current.getEditor().insertEmbed(range.index, 'image', response.url);
          }
        }
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
