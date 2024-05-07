import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactSelect from 'react-select';
import StarRating from "../components/Market/StarRating";
import axios from "axios";
import { GoodsCategory } from '../types/Market';
import { ProductItem } from "../types/Market";
import { MdArrowForwardIos } from "react-icons/md";
import { MdArrowBackIosNew } from "react-icons/md";

const itemsPerPage = 10;

export const products = [
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

const Product: React.FC = () => {
  const [totalProducts, setTotalProducts] = useState<ProductItem[]>([]);
  const [sortOption, setSortOption] = useState<string>("latest");
  const [sortedProducts, setSortedProducts] = useState<ProductItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<GoodsCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://54.180.158.4:8000/api/categories");
        const goods = response.data.filter((data: GoodsCategory) => data.division === 'goods');
        setCategories(goods);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const category = categories.find(category => String(category.id) === String(categoryId));
    if (category) {
      setCategoryName(category.name);
    }
  }, [categoryId, categories]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://54.180.158.4:8000/api/goods");
        const productsWithThumbnail = response.data.map((product: ProductItem) => {
          const imageUrl = typeof product.img_urls === 'string' ? JSON.parse(product.img_urls).thumbnail : product.img_urls.thumbnail;
          return {
            ...product,
            imageUrl: imageUrl,
          };
        });
        const categoryIdNumber = categoryId ? parseInt(categoryId) : undefined;
        const categoryProduct = productsWithThumbnail.filter((product: ProductItem) => {
          return product.category_id === categoryIdNumber;
        });
        setTotalProducts(categoryProduct);
      } catch (error) {
        console.error("제품을 가져오는 중 오류가 발생했습니다:", error);
      }
    };


    fetchProducts();
  }, [categoryId]);

  useEffect(() => {
    const sortProducts = (option: string) => {
      const sorted = [...totalProducts];
      switch (option) {
        case "latest":
          sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
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

    sortProducts(sortOption);
  }, [sortOption, totalProducts]);

  const handleSortOptionChange = (option: string) => {
    setSortOption(option);
  };

  // 페이지별 상품 목록 가져오기
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="pt-12 pb-10 mx-auto max-w-screen-lg">
      <div className="mb-20">
        <p className="text-xl text-white font-bold mb-4">카테고리</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/market/${category.id}`}
              className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-500 transition-colors duration-300 flex items-center justify-center"
            >
              <span className="mr-2">
                <img src={category.img_url} className="h-6 w-6" />
              </span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <p className="text-3xl text-white font-bold flex justify-center pb-10">{categoryName}</p>
      <div className="flex justify-between items-center mb-10">
        <div>
          <p className="text-xl text-white">총 <span className="font-bold">{totalProducts.length}</span>개의 상품이 있습니다.</p>
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
        {getPaginatedProducts().map((product) => (
          <Link key={product.id} to={`/market/${categoryId}/${product.id}`}>
            <div className="p-1 mx-auto max-w-xs mb-20">
              <img src={product.imageUrl} alt={product.name} className="w-56 h-72 object-cover mb-2" />
              <div className="text-center">
                <h3 className="text-white mb-1 font-bold">{product.name}</h3>
                <p className="text-white">{product.price.toLocaleString()}원</p>
                <div className="flex items-center justify-center">
                  <StarRating rating={product.rating} />
                  <span className="text-white ml-1">({product.reviewCount})</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center mt-20">
        <button
          className="mx-1 px-3 py-1 rounded-md focus:outline-none bg-green-700 hover:bg-green-500 transition-colors duration-200 text-white w-10 h-10"
          onClick={() => currentPage !== 1 && handlePageChange(currentPage - 1)}
        >
          {<MdArrowBackIosNew />}
        </button>
        {[...Array(Math.ceil(sortedProducts.length / itemsPerPage))].map((_, index) => (
          <button
            key={index}
            className={`mx-1 px-3 py-1 rounded-md focus:outline-none ${currentPage === index + 1 ? "bg-green-500 text-white" : "bg-green-700 text-white"
              } w-10 h-10`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="mx-1 px-3 py-1 rounded-md focus:outline-none bg-green-700 hover:bg-green-500 transition-colors duration-200 text-white w-10 h-10"
          onClick={() => currentPage !== Math.ceil(sortedProducts.length / itemsPerPage) && handlePageChange(currentPage + 1)}
        >
          {<MdArrowForwardIos />}
        </button>
      </div>

    </div>
  );
};

export default Product;
