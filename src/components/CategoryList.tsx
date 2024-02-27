import React from "react";
import CategoryItem from "./CategoryItem";

const categories = [
  { title: "사육장", count: 20, image: "../../public/images/category/사육장.png" },
  { title: "온/습도계", count: 20, image: "../../public/images/category/온습도계.png" },
  { title: "바닥재", count: 20, image: "../../public/images/category/바닥재.png" },
  { title: "조화", count: 20, image: "../../public/images/category/조화.png" },
  { title: "채집통", count: 20, image: "../../public/images/category/채집통.png" },
  { title: "소켓/바닥히팅", count: 20, image: "../../public/images/category/소켓바닥히팅.png" },
  { title: "칼슘/영양제", count: 20, image: "../../public/images/category/칼슘영양제.png" },
  { title: "장식", count: 20, image: "../../public/images/category/장식.png" },
  { title: "UVB", count: 20, image: "../../public/images/category/UVB.png" },
  { title: "물/먹이그릇", count: 20, image: "../../public/images/category/물먹이그릇.png" },
  { title: "사료/슈퍼푸드", count: 20, image: "../../public/images/category/사료슈퍼푸드.png" },
  { title: "유목", count: 20, image: "../../public/images/category/유목.png" },
  { title: "스팟/히팅", count: 20, image: "../../public/images/category/스팟히팅.png" },
  { title: "은신처", count: 20, image: "../../public/images/category/은신처.png" },
  { title: "생먹이", count: 20, image: "../../public/images/category/생먹이.png" },
  { title: "보조용품", count: 20, image: "../../public/images/category/보조용품.png" },
];

const CategoryList: React.FC = () => {
  return (
    <div className="flex justify-center pb-10">
      <div className="grid grid-cols-4 gap-4 mx-auto">
        {categories.map((category) => (
          <CategoryItem key={category.title} {...category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryList

