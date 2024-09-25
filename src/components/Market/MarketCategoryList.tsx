import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GoodsCategory } from '../../types/Market';
import { ProductItem } from "../../types/Market";

const MarketCategoryList: React.FC = () => {
  const [categories, setCategories] = useState<GoodsCategory[]>([]);
  const [totalProducts, setTotalProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://3.38.185.224:8000/api/categories");
        const goods = response.data.filter((data: GoodsCategory) => data.division === 'goods');
        setCategories(goods);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://3.38.185.224:8000/api/goods");
        setTotalProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const countCategoryProducts = (categoryId: string, products: ProductItem[]) => {
    const categoryIdNumber = categoryId ? parseInt(categoryId) : undefined;
    return products.filter((product) => product.category_id === categoryIdNumber).length;
  };

  return (
    <div className="flex justify-center pb-10">
      <div className="grid grid-cols-4 gap-4 mx-auto">
        {categories.map((category) => (
          <Link key={category.id} to={`/market/${category.id}`}>
            <div className="bg-white rounded hover:bg-gray-200 overflow-hidden shadow-md md:w-64 h-16 flex items-center">
              <div className="p-3 flex items-center w-full">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={category.img_url}
                    alt="category"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-2 py-1 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-700 font-bold">{category.name}</h3>
                    <div className="bg-gray-300 font-bold w-8 text-center">
                      {countCategoryProducts(String(category.id), totalProducts)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MarketCategoryList;
