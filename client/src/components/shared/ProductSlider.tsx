import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// กำหนด type สำหรับสินค้า
interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
}

// ตัวอย่างสินค้าจำลอง
const products: Product[] = [
  { id: 1, name: "สินค้า A", image: "Grapetea", price: 100 },
  { id: 2, name: "สินค้า B", image: "https://via.placeholder.com/150", price: 200 },
  { id: 3, name: "สินค้า C", image: "https://via.placeholder.com/150", price: 150 },
  { id: 4, name: "สินค้า D", image: "https://via.placeholder.com/150", price: 250 },
];

const ProductSlider: React.FC = () => {
  const settings = {
    dots: true,           // แสดงจุดเลื่อน
    infinite: true,       // เลื่อนไม่รู้จบ
    speed: 500,           // ความเร็วเลื่อน
    slidesToShow: 3,      // จำนวนสินค้าที่โชว์
    slidesToScroll: 1,    // เลื่อนทีละกี่ชิ้น
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,  // แสดงสินค้า 1 ชิ้นในมือถือ
        },
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>สินค้าของเรา</h2>
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id} style={{ padding: "10px" }}>
            <img src={product.image} alt={product.name} style={{ width: "100%" }} />
            <h3>{product.name}</h3>
            <p>ราคา: {product.price} บาท</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ProductSlider;
