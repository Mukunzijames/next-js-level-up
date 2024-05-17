'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://fakestoreapi.com/products/categories');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async (category = null) => {
    try {
      const url = category ? `https://fakestoreapi.com/products/category/${category}` : 'https://fakestoreapi.com/products';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    fetchProducts(category);
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">alpha store</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Categories</h2>
        <div className="flex space-x-4">
          {categories.map(category => (
            <button 
              key={category}
              className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-green-500 text-white' : 'bg-black'}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          ))}
          <button 
            className={`px-4 py-2 rounded ${selectedCategory === null ? 'bg-green-500 text-white' : 'bg-black'}`}
            onClick={() => handleCategoryClick(null)}
          >
            All
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300 cursor-pointer"
            onClick={() => handleProductClick(product)}
          >
            <div className="relative h-48 overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
              <p className="text-gray-700 mb-2">{product.category}</p>
              <p className="text-gray-600 mb-4">${product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl max-w-3xl w-full">
            <div className="relative h-64 overflow-hidden">
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.title}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-4">{selectedProduct.title}</h2>
              <p className="text-gray-700 mb-4">{selectedProduct.category}</p>
              <p className="text-gray-600 mb-4">${selectedProduct.price}</p>
              <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
              <button 
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
