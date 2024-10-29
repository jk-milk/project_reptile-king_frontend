import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import QuillEditor from "../components/Board/QuillEditor";
import Dropdown from "../components/common/Dropdown";
import { API } from "../config";
import { apiWithAuth } from "../components/common/axios";
import { Category } from "../types/Category";
import { ImageInfo, SelectedCategory } from "../types/Board";

// 환경 변수
const region = import.meta.env.VITE_AWS_DEFAULT_REGION;
const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;
const bucketName = import.meta.env.VITE_AWS_BUCKET;

// AWS S3 클라이언트 설정
const s3Client = new S3Client({
  region, // AWS S3 버킷이 위치한 리전
  credentials: {
    accessKeyId: accessKeyId, // AWS IAM 사용자의 액세스 키 ID
    secretAccessKey: secretAccessKey // AWS IAM 사용자의 비밀 액세스 키
  }
});

function PostWrite() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({ name: "カテゴリー選択", id: null });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SelectedCategory>({ name: "詳細カテゴリー選択", id: null });
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageInfo[]>([]);
  
  // 카테고리를 서버에 요청하여 가져옴
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiWithAuth.get(API + "categories");
      const postsCategories = response.data.filter((data: Category) => data.division === "posts");

      setCategories(postsCategories);
    };

    fetchCategories();
  }, []);

  // 선택된 카테고리에 따라 세부 카테고리를 가져옴
  useEffect(() => {
    const fetchSubCategories = async () => {
      if (selectedCategory.name !== "카테고리 선택") {
        const response = await apiWithAuth.get(API + "categories");
        const subCategories = response.data.filter((data: Category) => data.parent_id == selectedCategory.id); // parent_id가 string이라 == 사용

        setSubCategories(subCategories);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  // 이미지 업로드 함수
  async function uploadImagesToS3(images: ImageInfo[]) {

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        const { blob, uniqueId } = image;
        const key = `images/posts/${Date.now()}-${uniqueId}`;
        const command = new PutObjectCommand({
          Bucket: bucketName,
          Key: key,
          Body: blob,
        });
        await s3Client.send(command);
        const imgUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        return { ...image, imgUrl }; // imgUrl을 업데이트하여 반환
      })
    );
    setImages(uploadedImages); // 업로드된 이미지들로 상태 업데이트
    return uploadedImages;
  }

  // 사용자가 등록 버튼을 눌렀을 경우
  const handleSubmit = async () => {
    if (selectedCategory.id === null) {
      alert("카테고리를 선택해 주세요!")
      return;
    }
    if (selectedSubCategory.id === null) {
      alert("세부 카테고리를 선택해 주세요!")
      return;
    }
    if (!title) {
      alert("제목을 입력해 주세요!")
      return;
    }
    if (!content) {
      alert("내용을 입력해 주세요!")
      return;
    }

    const imgUrls = await uploadImagesToS3(images);
    console.log(imgUrls);
    let uploadContent = content;
    // 이미지 URL 배열을 순회하며, 각 이미지의 원래 src 속성(base64 URL)을 S3 URL로 교체
    imgUrls.forEach((imgData) => {
      // 이미지 태그의 src 속성을 찾아내는 정규식
      const regex = new RegExp(`src="data:image\\/.*?;base64,.*?${imgData.uniqueId}.*?"`, 'g');
      // 정규식을 사용하여 base64 이미지 URL을 업로드된 S3 URL로 교체
      uploadContent = uploadContent.replace(regex, `src="${imgData.imgUrl}"`);
    });
    
    const postData = {
      title,
      content: uploadContent,
      category_id: selectedSubCategory.id,
      img_urls: imgUrls.map(img => img.imgUrl),
    };

    try {
      await apiWithAuth.post(API + "posts", postData);
      // alert("글 작성 완료!");
      navigate(`/board/lists?category=${selectedCategory.id}`);
    } catch (error) {
      console.error('서버 오류', error);
      alert("서버 오류! 다시 등록해 주세요.");
    }
  };

  // 취소 버튼을 눌렀을 때 동작
  const handleCancel = () => {
    // 글 목록 페이지로 이동
    navigate("/board/lists");
  };

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body mx-auto">
      <h1 className="text-white text-2xl mt-5">
        書き込み
      </h1>
      <div className="mb-4 p-2 min-h-[35rem] bg-gray-200 rounded">
        <div className="flex">
          <Dropdown
            items={categories}
            selectedItem={selectedCategory}
            setSelectedItem={setSelectedCategory}
          />
          <Dropdown
            items={subCategories}
            selectedItem={selectedSubCategory}
            setSelectedItem={setSelectedSubCategory}
            disabled={selectedCategory.name === "カテゴリー選択"}
          />
        </div>

        <div className="my-4 mx-2">
          <input
            className="p-2 w-full border border-gray-400 text-gray-900 bg-white focus:ring-2 focus:outline-none focus:ring-gray-300 rounded inline-flex items-center"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="제목을 입력해 주세요."
          />
        </div>
        <QuillEditor setContent={setContent} setImages={setImages} />
        <div className="flex">
          <button
            className="mt-8 mb-4 ml-auto mr-2 p-1 w-auto rounded border border-gray-500 text-white bg-gray-600 focus:ring-2 focus:outline-none"
            onClick={handleCancel}
          >
            キャンセル
          </button>
          <button
            className="mt-8 mb-4 mr-2 p-1 w-20 rounded border border-gray-500 text-white bg-blue-600 focus:ring-2 focus:outline-none"
            onClick={handleSubmit}
          >
            登録
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostWrite;
