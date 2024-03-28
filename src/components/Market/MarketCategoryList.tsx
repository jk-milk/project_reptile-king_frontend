import React from "react";
import { Link } from "react-router-dom";
import MarketCategoryItem from "./MarketCategoryItem";

export const categories = [
  { title: "사육세트", count: 20, image: "/images/category/사육세트.png", path: "/market/사육세트" },
  { title: "사육장", count: 20, image: "/images/category/사육장.png", path: "/market/사육장" },
  { title: "온/습도계", count: 20, image: "/images/category/온습도계.png", path: "/market/온,습도계" },
  { title: "바닥재", count: 20, image: "/images/category/바닥재.png", path: "/market/바닥재" },
  { title: "조화", count: 20, image: "/images/category/조화.png", path: "/market/조화" },
  { title: "채집통", count: 20, image: "/images/category/채집통.png", path: "/market/채집통" },
  { title: "소켓/바닥히팅", count: 20, image: "/images/category/소켓바닥히팅.png", path: "/market/소켓,바닥히팅" },
  { title: "칼슘/영양제", count: 20, image: "/images/category/칼슘영양제.png", path: "/market/칼슘,영양제" },
  { title: "장식", count: 20, image: "/images/category/장식.png", path: "/market/장식" },
  { title: "UVB", count: 20, image: "/images/category/UVB.png", path: "/market/UVB" },
  { title: "물/먹이그릇", count: 20, image: "/images/category/물먹이그릇.png", path: "/market/물,먹이그릇" },
  { title: "사료/슈퍼푸드", count: 20, image: "/images/category/사료슈퍼푸드.png", path: "/market/사료,슈퍼푸드" },
  { title: "유목", count: 20, image: "/images/category/유목.png", path: "/market/유목" },
  { title: "스팟/히팅", count: 20, image: "/images/category/스팟히팅.png", path: "/market/스팟,히팅" },
  { title: "은신처", count: 20, image: "/images/category/은신처.png", path: "/market/은신처" },
  { title: "생먹이", count: 20, image: "/images/category/생먹이.png", path: "/market/생먹이" },
  { title: "보조용품", count: 20, image: "/images/category/보조용품.png", path: "/market/보조용품" },
];

const MarketCategoryList: React.FC = () => {
  return (
    <div className="flex justify-center pb-10">
      <div className="grid grid-cols-4 gap-4 mx-auto">
        {categories.map((category) => (
          <Link key={category.title} to={category.path}>
            <MarketCategoryItem {...category} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MarketCategoryList;
