// pages/ProductSlider.tsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingCart } from "react-icons/fa";
import productService, { type Product } from "../../../services/productService";
import { useCart } from "../../../context/CartContext";

// กำหนด interface สำหรับCartItem ที่สืบทอดจาก Product และเพิ่ม field quantity
interface CartItem extends Product {
  quantity: number;
}

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
          }));
          setProducts(fetchedProducts.map((p) => ({ ...p, quantity: 1 })));
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
    <div>
      {/* ส่วนหัวข้อที่แสดงชื่อเมนู */}
      <div className="flex justify-center items-center mb-4 gap-6">
        <h1 className="text-[40px] font-bold">เมนู</h1>
        <h1 className="text-[40px] font-bold">Menu</h1>
      </div>
      
      {/* คอนเทนเนอร์ของ slider สินค้าที่มีพื้นหลังสีขาว */}
      <div className="p-5 bg-white">
        <Slider
          {...settings}
          className="px-1 text-center mx-[1px]"
        >
          {/* วนลูปผ่านรายการสินค้าเพื่อแสดงแต่ละ card ของสินค้า */}
          {products.map((product) => (
            <div
              key={product.id}
              
            >
              {/* ตัวคอนเทนเนอร์สินค้าที่มี hover effect */}
              <div className="w-70 bg-white rounded-xl hover:shadow-xl transition-shadow duration-300 p-4 flex flex-col justify-between h-a">
                {/* รูปภาพสินค้า */}
                <div className="flex justify-center">
                  <img
                    src={product.image}
                    alt={product.nameTH}
                    className="w-48 h-48 object-cover rounded-lg mx-auto mb-3"
                  />
                </div>
                
                {/* ชื่อสินค้าภาษาไทย */}
                <div className="text-lg font-bold mt-2 w-48 mx-auto truncate">
                  {product.nameTH}
                </div>
                
                {/* ชื่อสินค้าภาษาอังกฤษ */}
                <div className="text-sm text-gray-600 mb-2 w-48 mx-auto truncate">
                  {product.nameEN}
                </div>

                {/* การควบคุมสินค้า: ปุ่มจำนวน, ราคา, และเพิ่มลงตะกร้า */}
                <div
                  className="flex items-center justify-between w-60 mx-auto mt-auto"
                >
                  {/* ปุ่มควบคุมจำนวน */}
                  <div
                    className="flex items-center gap-1"
                  >
                    {/* ปุ่มลดจำนวน - ปุ่มกลมสีเทาเข้ม ขนาดเล็กลง */}
                    <button
                      className="w-8 h-8 bg-[#333333] text-white rounded-full flex items-center justify-center font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-md"
                      onClick={() => decreaseQty(product.id)}
                    >
                      -
                    </button>
                    {/* แสดงจำนวนปัจจุบัน */}
                    <span className="w-7 text-center text-sm">{product.quantity}</span>
                    {/* ปุ่มเพิ่มจำนวน - ปุ่มกลมสีเทาเข้ม ขนาดเล็กลง */}
                    <button
                      className="w-8 h-8 bg-[#333333] text-white rounded-full flex items-center justify-center font-bold hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-md"
                      onClick={() => increaseQty(product.id)}
                    >
                      +
                    </button>
                  </div>

                  {/* แสดงราคาสินค้า ขนาดเล็กลงให้เหมาะสมกับ card */}
                  <p
                    className="font-bold text-center min-w-[50px] text-sm m-0"
                  >
                    {product.price}฿
                  </p>

                  {/* ปุ่มเพิ่มลงตะกร้า - ปุ่มสีน้ำตาลพร้อมไอคอนรถเข็น ขนาดเล็กลง */}
                  <button
                    className="w-15 h-8 bg-[#8C6E63] text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-[#D6C0B3] hover:scale-105 transition-all duration-300 shadow-md"
                    onClick={() => addToCart(product)}
                  >
                    <FaShoppingCart size={16} />
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
