import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { API } from "../config";
import QuillEditor from "../components/Board/QuillEditor";
import { apiWithAuth, apiWithoutAuth } from "../components/common/axios";
import Dropdown from "../components/common/Dropdown";
import { Category } from "../types/Category";
import { ImageInfo, PostCategory, SelectedCategory } from "../types/Board";

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

function PostEdit() {
  const navigate = useNavigate();
  const [postCategories, setPostCategories] = useState<PostCategory[]>([]); // 카테고리와 세부 카테고리를 연결한 데이터
  const [selectedCategory, setSelectedCategory] = useState<SelectedCategory>({ name: "카테고리 선택", id: null });
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SelectedCategory>({ name: "세부 카테고리 선택", id: null });
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);


  // 카테고리를 서버에 요청하여 가져옴
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiWithAuth.get(API + "categories");
      const posts = response.data.filter((data: Category) => data.division === "posts");
      setCategories(posts);

      // 각 post에 속하는 subPosts를 찾아서 연결
      const postsWithSubPosts = posts.map((post: Category) => {
        const subPosts = response.data.filter((data: Category) => Number(data.parent_id) === post.id);
        console.log(subPosts);

        return { ...post, subPosts };
      });
      console.log(postsWithSubPosts, "postsWithSubPosts");
      setPostCategories(postsWithSubPosts);
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

  // url에서 postId를 얻어서 서버에서 해당 글 가져오기
  const postId = useParams().postId;
  useEffect(() => {
    if (postId === null) {
      alert("잘못된 접근입니다!");
      navigate(-1);
      return;
    }

    const fetchPosts = async () => {
      try {
        const postResponse = await apiWithoutAuth.get(`${API}posts/${postId}`);
        console.log(postResponse);
        console.log(postCategories);

        // 글 데이터에서 카테고리 초기화
        postCategories.forEach(category => {
          if (category.subPosts && category.subPosts.length > 0) {
            category.subPosts.forEach(subPost => {
              if (subPost.id === postResponse.data.category.id) {
                setSelectedCategory({name: category.name, id: category.id});
                setSelectedSubCategory({name: subPost.name, id: subPost.id});
              }
            });
          }
        });
        
        setTitle(postResponse.data.title);
        setContent(postResponse.data.content);
        setImages(postResponse.data.img_urls);
        setLoading(false);
      } catch (err) {
        alert("잘못된 경로입니다!");
        navigate(-1);
      }
    };

    fetchPosts();
  }, [navigate, postCategories, postId]);

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
        const imgUrl = `https://${bucketName}.s3.ap-northeast-2.amazonaws.com/${key}`;
        return { ...image, imgUrl }; // imgUrl을 업데이트하여 반환
      })
    );
    setImages(uploadedImages); // 업로드된 이미지들로 상태 업데이트
    return uploadedImages;
  }

  // 글 등록 시
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
      const response = await apiWithAuth.patch(API + "posts", postData);
      console.log(response.data);
      // response로 카테고리 링크를 받아와야 함
      alert("글 수정 완료!");
      navigate(`/board/lists?category=${selectedCategory.id}`);
    } catch (error) {
      console.error('서버 오류', error);
      alert("서버 오류! 다시 등록해 주세요.");
    }
  };  

  // 취소 버튼을 눌렀을 때 동작
  const handleCancel = () => {
    // 이전 페이지로 이동
    navigate(-1);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-10 pb-10 laptop:w-[67.5rem] w-body mx-auto">
      <h1 className="text-white text-2xl mt-5">
        글쓰기
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
            disabled={selectedCategory.name === "카테고리 선택"}
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
        <QuillEditor content={content} setContent={setContent} setImages={setImages} />
        <div className="flex">
          <button
            className="mt-8 mb-4 ml-auto mr-2 p-1 w-20 rounded border border-gray-500 text-white bg-gray-600 focus:ring-2 focus:outline-none"
            onClick={handleCancel}
          >
            취소
          </button>
          <button
            className="mt-8 mb-4 mr-2 p-1 w-20 rounded border border-gray-500 text-white bg-blue-600 focus:ring-2 focus:outline-none"
            onClick={handleSubmit}
          >
            등록
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostEdit;
