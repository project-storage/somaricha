import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import productService, { type Product as ProductType, ProductStatus } from "../../../services/productService";
import { useCart } from "../../../contexts/CartContext";

// Define menu categories
type MenuCategory = 'all' | 'fruit tea';

// Define category names in Thai and English
const categoryNames = {
  all: { th: 'ทั้งหมด', en: 'All' },
  'fruit tea': { th: 'ชาผลไม้', en: 'Fruit Tea' },
};

const Products: React.FC = () => {
  // State for products, filtered products, and selected category
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory>('all');
  const { addToCart: addToCartContext } = useCart();

  // Initialize categories with 'all' as default
  const categories: MenuCategory[] = ['all', 'fruit tea'];

  // Function to assign a category to a product based on its name or details
  const assignCategory = (product: ProductType): MenuCategory => {
    const name = product.product_name.toLowerCase();
    const detail = product.product_detail.toLowerCase();
    
    if (name.includes('fruit tea') || detail.includes('fruit tea')) return 'fruit tea';
    
    // Default to fruit tea if no category is determined
    return 'fruit tea';
  };

  // Function to filter products by selected category
  const filterProducts = (category: MenuCategory) => {
    if (category === 'all') {
      return products;
    }
    return products.filter(product => assignCategory(product) === category);
  };

  // Effect to fetch products from backend when component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        if (res.data && res.data.data) {
          const fetchedProducts = res.data.data.map((p: { id: number; product_name: string; product_detail: string; product_image?: string; product_price: number; product_status: ProductStatus }) => ({
            id: p.id,
            nameTH: p.product_name,
            nameEN: p.product_detail,
            image: p.product_image || "",
            price: p.product_price,
            product_status: p.product_status
          }));
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        } else {
          console.error("Invalid product data:", res.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        alert("ไม่สามารถโหลดสินค้าได้ กรุณาลองใหม่อีกครั้ง");
      }
    };
    fetchProducts();
  }, []);

  // Effect to update filtered products when selected category changes
  useEffect(() => {
    const filtered = filterProducts(selectedCategory);
    setFilteredProducts(filtered);
  }, [selectedCategory, products]);

  // Function to increase product quantity in the component state
  const increaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity ?? 1) + 1 } : p
      )
    );
  };

  // Function to decrease product quantity in the component state
  const decreaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, (p.quantity ?? 1) - 1) } : p
      )
    );
  };

  // Function to add product to cart context
  const addToCart = (product: ProductType) => {
    // Convert Product to CartItem format for context
    const cartItem = {
      id: product.id!,
      nameTH: product.nameTH!,
      nameEN: product.nameEN!,
      price: product.price!,
      image: product.image || "",
      quantity: product.quantity ?? 1
    };
    
    addToCartContext(cartItem);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar - Menu Categories */}
      <div className="w-full md:w-64 p-4 bg-[#D6C0B3] min-h-0 md:min-h-screen shadow-md">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-center text-[#3E2522]">ประเภทเมนู</h2>
        <ul className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-2 pb-2 md:pb-0 md:space-y-3">
          {categories.map((category) => (
            <li key={category} className="shrink-0 w-auto md:w-full">
              <button
                className={`text-left px-4 py-3 rounded-lg transition-colors duration-300 w-full flex items-center md:justify-between ${
                  selectedCategory === category
                    ? "bg-[#8C6E63] text-white shadow-md"
                    : "hover:bg-[#a88c7d] bg-[#ebd8cf] md:bg-transparent text-[#3E2522]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="font-semibold text-sm sm:text-base">
                  {categoryNames[category].th}
                </span>
                <span className="ml-2 text-xs opacity-80 md:block hidden">
                  ({categoryNames[category].en})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Products Grid */}
      <div className="flex-1 p-6">
        <div className="flex justify-center items-center mb-6 gap-6 text-center">
          <h1 className="text-3xl sm:text-[40px] font-bold">เมนู</h1>
          <h1 className="text-3xl sm:text-[40px] font-bold text-gray-400">Menu</h1>
        </div>

        {/* Category Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-semibold">
            <span className="text-[#8C6E63]">
              {categoryNames[selectedCategory].th}
            </span>
            <span className="text-gray-500 ml-3 text-lg sm:text-2xl">
              {categoryNames[selectedCategory].en}
            </span>
          </h2>
        </div>

        {/* Products Grid - 3 per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-6 flex flex-col justify-between h-full w-full max-w-[320px] border border-gray-100"
            >
              {/* Product Image */}
              <div className="flex justify-center mb-4 bg-gray-50 rounded-xl p-4">
                <img
                  src={product.image}
                  alt={product.nameTH}
                  className="w-40 h-40 object-cover rounded-lg mx-auto hover:rotate-2 transition-transform duration-300"
                />
              </div>

              {/* Product Name in Thai */}
              <div className="text-lg font-bold mt-2 w-full max-w-[240px] mx-auto truncate text-center text-[#3E2522]">
                {product.nameTH}
              </div>

              {/* Product Name in English */}
              <div className="text-sm text-gray-500 mb-4 w-full max-w-[240px] mx-auto truncate text-center">
                {product.nameEN}
              </div>

              {/* Product Controls: Quantity, Price, Add to Cart */}
              <div className="flex items-center justify-between w-full max-w-[260px] mx-auto mt-auto pt-4 border-t border-gray-100">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  {/* Decrease Quantity Button */}
                  <button
                    className="w-8 h-8 bg-[#333333] hover:bg-gray-600 text-white rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-md"
                    onClick={() => product.id && decreaseQty(product.id)}
                  >
                    -
                  </button>
                  {/* Display Current Quantity */}
                  <span className="w-7 text-center font-bold text-sm text-[#3e2522]">
                    {product.quantity || 1}
                  </span>
                  {/* Increase Quantity Button */}
                  <button
                    className="w-8 h-8 bg-[#333333] hover:bg-gray-600 text-white rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-md"
                    onClick={() => product.id && increaseQty(product.id)}
                  >
                    +
                  </button>
                </div>

                {/* Product Price */}
                <p className="font-bold text-center text-base text-[#8C6E63] min-w-[50px] m-0">
                  {product.price}฿
                </p>

                {/* Add to Cart Button */}
                <button
                  className="w-10 h-8 bg-[#8C6E63] text-white rounded-full flex items-center justify-center hover:bg-[#73584F] hover:scale-110 transition-all duration-300 shadow-md"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no products match the filter */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">ไม่พบสินค้าในหมวดนี้</p>
            <p className="text-gray-500">No products found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;