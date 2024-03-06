import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactSelect from 'react-select';
import ProductItem from "../components/ProductItem";
import { categories } from '../components/MarketCategoryList';

const products = [
  { id: 1, name: "소형 케이지", price: 10000, imageUrl: "https://via.placeholder.com/150", rating: 2, reviewCount: 22 },
  { id: 2, name: "소형 케이지", price: 35000, imageUrl: "https://via.placeholder.com/150", rating: 1, reviewCount: 1 },
  { id: 3, name: "소형 케이지", price: 30000, imageUrl: "https://via.placeholder.com/150", rating: 5, reviewCount: 3 },
  { id: 4, name: "소형 케이지", price: 20000, imageUrl: "https://via.placeholder.com/150", rating: 4, reviewCount: 16 },
  { id: 5, name: "소형 케이지", price: 50000, imageUrl: "https://via.placeholder.com/150", rating: 3, reviewCount: 3 },
  { id: 6, name: "소형 케이지", price: 70000, imageUrl: "https://via.placeholder.com/150", rating: 3, reviewCount: 6 },
  { id: 7, name: "소형 케이지", price: 23000, imageUrl: "https://via.placeholder.com/150", rating: 3, reviewCount: 7 },
  { id: 8, name: "소형 케이지", price: 40000, imageUrl: "https://via.placeholder.com/150", rating: 3, reviewCount: 8 },
  { id: 9, name: "소형 케이지", price: 57000, imageUrl: "https://via.placeholder.com/150", rating: 3, reviewCount: 4 },
  { id: 10, name: "소형 케이지", price: 98000, imageUrl: "https://via.placeholder.com/150", rating: 3, reviewCount: 15 },
];

function Product() {
  const [totalProducts, setTotalProducts] = useState(products.length);
  const [sortOption, setSortOption] = useState("latest");
  const [sortedProducts, setSortedProducts] = useState([...products]);
  const { categoryName } = useParams();

  useEffect(() => {
    const fetchTotalProducts = async () => {
      const total = await fetch("API_URL_HERE");
      const totalProducts = await total.json();
      setTotalProducts(totalProducts);
    };

    fetchTotalProducts();
  }, []);

  const sortProducts = (option: string) => {
    const sorted = [...products];
    switch (option) {
      case "latest":
        sorted.sort((a, b) => b.id - a.id);
        break;
      case "lowPrice":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "highPrice":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "highReview":
        sorted.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  };

  useEffect(() => {
    sortProducts(sortOption);
  }, [sortOption]);

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="pt-10 pb-10 mx-auto max-w-screen-xl">
      <div className="mb-20">
        <p className="text-xl text-white font-bold mb-4">카테고리</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.title}
              to={category.path}
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors duration-300 flex items-center justify-center"
            >
              <span className="mr-2">
                <img src={category.image} className="h-6 w-6" />
              </span>
              <span>{category.title}</span>
            </Link>
          ))}
        </div>
      </div>
      <p className="text-3xl text-white font-bold flex justify-center pb-10">{categoryName}</p>
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-xl text-white">총 <span className="font-bold">{totalProducts}</span>개의 상품이 있습니다.</p>
        </div>
        <ReactSelect
          className="w-40"
          value={sortOption ? { value: sortOption, label: sortOption === 'latest' ? '최신순' : sortOption === 'lowPrice' ? '낮은 가격순' : '높은 가격순' } : null}
          onChange={(selectedOption) => handleSortOptionChange(selectedOption ? selectedOption.value : 'latest')}
          options={[
            { value: 'latest', label: '최신순' },
            { value: 'lowPrice', label: '낮은 가격순' },
            { value: 'highPrice', label: '높은 가격순' },
            { value: 'highReview', label: '리뷰순' }
          ]}
        />
      </div>
      <hr className="border-t border-green-700 mb-10" />
      <div className="grid sm:grid-cols-5 gap-4">
        {sortedProducts.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );

}

export default Product;
