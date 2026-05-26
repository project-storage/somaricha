// pages/ProductSlider.tsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingCart } from "react-icons/fa";
import productService, { type Product } from "../../../services/productService";
import { useCart, type CartItem } from "../../../contexts/CartContext";

const ProductSlider: React.FC = () => {
  // state สำหรับเก็บรายการสินค้า
  const [products, setProducts] = useState<Product[]>([]);
  // เข้าถึง context ตะกร้าเพื่อเพิ่มสินค้าลงในตะกร้า
  const { addToCart: addToCartContext } = useCart();

  // ฟังก์ชันเพิ่มจำนวนสินค้าใน slider
  const increaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity ?? 1) + 1 } : p
      )
    );
  };

  // ฟังก์ชันลดจำนวนสินค้าใน slider (น้อยสุดคือ 1)
  const decreaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, (p.quantity ?? 1) - 1) } : p
      )
    );
  };

  // ฟังก์ชันเพิ่มสินค้าลงใน context ของตะกร้า
  const addToCart = (product: Product) => {
    // แปลง Product เป็นรูปแบบ CartItem สำหรับ context
    const cartItem: CartItem = {
      id: product.id!,
      nameTH: product.nameTH!,
      nameEN: product.nameEN!,
      price: product.price!,
      image: product.image || "",
      quantity: product.quantity ?? 1
    };
    
    addToCartContext(cartItem);
  };

  // effect สำหรับดึงข้อมูลสินค้าจาก backend เมื่อ component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        if (res.data && res.data.data) {
          const fetchedProducts = res.data.data.map((p: { id: number; product_name: string; product_detail: string; product_image?: string; product_price: number; }) => ({
            id: p.id,
            nameTH: p.product_name,
            nameEN: p.product_detail,
            image: p.product_image || "",
            price: p.product_price,
          }) as Product);
          setProducts(fetchedProducts.map((p: Product) => ({ ...p, quantity: 1 as number })));
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

  // การตั้งค่าสำหรับ component react-slick slider
  const settings = {
    dots: true, // แสดงจุดนำทาง
    infinite: true, // วนลูปไม่สิ้นสุด
    speed: 500, // ความเร็วในการแสดงภาพ
    slidesToShow: 5, // จำนวน slide ที่แสดงพร้อมกัน
    slidesToScroll: 1, // จำนวน slide ที่เลื่อนต่อครั้ง
    centerMode: true, // จัด slide ที่ใช้งานอยู่ตรงกลาง
    centerPadding: "50px", // พื้นที่ว่างด้านข้างเมื่อเปิดโหมด center ปรับเพื่อให้มีระยะห่างระหว่างสินค้า
    // การตั้งค่า responsive สำหรับขนาดหน้าจอต่างๆ
    responsive: [
      { 
        breakpoint: 1024, 
        settings: { 
          slidesToShow: 2, 
          centerPadding: "30px" 
        } 
      },
      { 
        breakpoint: 768, 
        settings: { 
          slidesToShow: 1, 
          centerPadding: "20px" 
        } 
      },
    ],
  };

  return (
    <div className="py-12 bg-white">
      {/* ส่วนหัวข้อที่แสดงชื่อเมนู */}
      <div className="flex justify-center items-center mb-6 gap-4 sm:gap-6 text-center px-4">
        <h1 className="text-3xl sm:text-[40px] font-bold text-[#3E2522]">เมนู</h1>
        <h1 className="text-3xl sm:text-[40px] font-bold text-gray-400">Menu</h1>
      </div>
      
      {/* คอนเทนเนอร์ของ slider สินค้าที่มีพื้นหลังสีขาว */}
      <div className="px-4 sm:px-8 py-5">
        <Slider
          {...settings}
          className="text-center"
        >
          {/* วนลูปผ่านรายการสินค้าเพื่อแสดงแต่ละ card ของสินค้า */}
          {products.map((product) => (
            <div
              key={product.id}
              className="py-4 px-2"
            >
              {/* ตัวคอนเทนเนอร์สินค้าที่มี hover effect */}
              <div className="w-full max-w-[280px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-xl hover:scale-[1.02] transition-all duration-300 p-5 flex flex-col justify-between min-h-[380px] mx-auto border border-gray-100">
                {/* รูปภาพสินค้า */}
                <div className="flex justify-center mb-3 bg-gray-50 rounded-xl p-3">
                  <img
                    src={product.image}
                    alt={product.nameTH}
                    className="w-40 h-40 object-cover rounded-lg mx-auto"
                  />
                </div>
                
                {/* ชื่อสินค้าภาษาไทย */}
                <div className="text-base sm:text-lg font-bold mt-2 w-full max-w-[200px] mx-auto truncate text-center text-[#3E2522]">
                  {product.nameTH}
                </div>
                
                {/* ชื่อสินค้าภาษาอังกฤษ */}
                <div className="text-xs sm:text-sm text-gray-500 mb-3 w-full max-w-[200px] mx-auto truncate text-center">
                  {product.nameEN}
                </div>

                {/* การควบคุมสินค้า: ปุ่มจำนวน, ราคา, และเพิ่มลงตะกร้า */}
                <div
                  className="flex items-center justify-between w-full max-w-[220px] mx-auto mt-auto pt-3 border-t border-gray-100"
                >
                  {/* ปุ่มควบคุมจำนวน */}
                  <div
                    className="flex items-center gap-1"
                  >
                    {/* ปุ่มลดจำนวน */}
                    <button
                      className="w-7 h-7 bg-[#333333] hover:bg-gray-600 text-white rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-sm"
                      onClick={() => product.id && decreaseQty(product.id)}
                    >
                      -
                    </button>
                    {/* แสดงจำนวนปัจจุบัน */}
                    <span className="w-7 text-center text-xs sm:text-sm font-bold text-[#3e2522]">{product.quantity}</span>
                    {/* ปุ่มเพิ่มจำนวน */}
                    <button
                      className="w-7 h-7 bg-[#333333] hover:bg-gray-600 text-white rounded-full flex items-center justify-center font-bold transition-all duration-300 shadow-sm"
                      onClick={() => product.id && increaseQty(product.id)}
                    >
                      +
                    </button>
                  </div>

                  {/* แสดงราคาสินค้า */}
                  <p
                    className="font-bold text-center text-sm sm:text-base text-[#8C6E63] min-w-[45px] m-0"
                  >
                    {product.price}฿
                  </p>

                  {/* ปุ่มเพิ่มลงตะกร้า */}
                  <button
                    className="w-10 h-7 bg-[#8C6E63] hover:bg-[#73584F] text-white rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-md hover:scale-105"
                    onClick={() => addToCart(product)}
                  >
                    <FaShoppingCart size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ProductSlider;
