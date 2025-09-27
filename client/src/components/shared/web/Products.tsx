import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import productService, { type Product as ProductType, ProductStatus } from "../../../services/productService";
import { useCart } from "../../../context/CartContext";

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
      id: product.id,
      nameTH: product.nameTH,
      nameEN: product.nameEN,
      price: product.price,
      image: product.image,
      quantity: product.quantity ?? 1
    };
    
    addToCartContext(cartItem);
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar - Menu Categories */}
      <div className="w-full md:w-64 p-4 bg-[#D6C0B3] min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#3E2522]">ประเภทเมนู</h2>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category}>
              <button
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-300 ${
                  selectedCategory === category
                    ? "bg-[#8C6E63] text-white shadow-md"
                    : "hover:bg-[#a88c7d] text-[#3E2522]"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="font-medium">
                  {categoryNames[category].th}
                </span>
                <span className="ml-2 text-sm">
                  ({categoryNames[category].en})
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content - Products Grid */}
      <div className="flex-1 p-6">
        <div className="flex justify-center items-center mb-4 gap-6">
          <h1 className="text-[40px] font-bold">เมนู</h1>
          <h1 className="text-[40px] font-bold">Menu</h1>
        </div>

        {/* Category Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold">
            <span className="text-[#8C6E63]">
              {categoryNames[selectedCategory].th}
            </span>
            <span className="text-gray-600 ml-3">
              {categoryNames[selectedCategory].en}
            </span>
          </h2>
        </div>

        {/* Products Grid - 3 per row on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between h-full"
            >
              {/* Product Image */}
              <div className="flex justify-center mb-4">
                <img
                  src={product.image}
                  alt={product.nameTH}
                  className="w-48 h-48 object-cover rounded-lg mx-auto"
                />
              </div>

              {/* Product Name in Thai */}
              <div className="text-lg font-bold mt-2 w-48 mx-auto truncate">
                {product.nameTH}
              </div>

              {/* Product Name in English */}
              <div className="text-sm text-gray-600 mb-2 w-48 mx-auto truncate">
                {product.nameEN}
              </div>

              {/* Product Controls: Quantity, Price, Add to Cart */}
              <div className="flex items-center justify-between w-60 mx-auto mt-auto pt-4">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  {/* Decrease Quantity Button */}
                  <button
                    className="w-8 h-8 bg-[#333333] text-white rounded-full flex items-center justify-center font-bold hover:bg-gray-600 transition-all duration-300 shadow-md"
                    onClick={() => decreaseQty(product.id)}
                  >
                    -
                  </button>
                  {/* Display Current Quantity */}
                  <span className="w-7 text-center text-sm">
                    {product.quantity || 1}
                  </span>
                  {/* Increase Quantity Button */}
                  <button
                    className="w-8 h-8 bg-[#333333] text-white rounded-full flex items-center justify-center font-bold hover:bg-gray-600 transition-all duration-300 shadow-md"
                    onClick={() => increaseQty(product.id)}
                  >
                    +
                  </button>
                </div>

                {/* Product Price */}
                <p className="font-bold text-center min-w-[50px] text-sm m-0">
                  {product.price}฿
                </p>

                {/* Add to Cart Button */}
                <button
                  className="w-15 h-8 bg-[#8C6E63] text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#D6C0B3] hover:scale-105 transition-all duration-300 shadow-md"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart size={16} />
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