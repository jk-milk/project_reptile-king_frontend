import React from "react";
import StarRating from "./StarRating";

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
}

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <div className="p-1 mx-auto max-w-xs">
      <img src={product.imageUrl} alt={product.name} className="w-56 h-72 object-cover mb-2" />
      <div className="text-center text-sm">
        <h3 className="text-white mb-1">{product.name}</h3>
        <p className="text-white">{product.price.toLocaleString()}원</p>
        <div className="flex items-center justify-center">
          <StarRating rating={product.rating} />
          <span className="text-white ml-1">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
