import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Grapetea from "../../assets/products/Grapetea.png";
import Peachtea from "../../assets/products/Peachtea.png";
import Lemontea from "../../assets/products/Lemontea.png";
import Berrytea from "../../assets/products/Berrytea.png";
import Lycheetea from "../../assets/products/Lycheetea.png";
import Strawberrytea from "../../assets/products/Strawberrytea.png";
import Kiwitea from "../../assets/products/Kiwitea.png";
import { CarTaxiFront } from "lucide-react";

interface Product {
  id: number;
  nameEN: string;
  nameTH: string;
  image: string;
  price: number;
  quantity?: number;
}

const initialProducts: Product[] = [
  { id: 1, nameTH: "ชาองุ่น", nameEN: "Grape Tea", image: Grapetea, price: 45, quantity: 1 },
  { id: 2, nameTH: "ชาเบอรี่", nameEN: "Berry Tea", image: Berrytea, price: 45, quantity: 1 },
  { id: 3, nameTH: "ชาพีช", nameEN: "Peach Tea", image: Peachtea, price: 45, quantity: 1 },
  { id: 4, nameTH: "ชาเลมอน", nameEN: "Lemon Tea", image: Lemontea, price: 45, quantity: 1 },
  { id: 5, nameTH: "ชาลิ้นจี่", nameEN: "Lychee Tea", image: Lycheetea, price: 45, quantity: 1 },
  { id: 6, nameTH: "ชาสตอเบอรี่", nameEN: "Strawberry Tea", image: Strawberrytea, price: 45, quantity: 1 },
  { id: 7, nameTH: "ชากีวี่", nameEN: "Kiwi Tea", image: Kiwitea, price: 45, quantity: 1 },
];

const ProductSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "100px", // เว้นระยะซ้ายขวาของสไลด์
    responsive: [
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const increaseQty = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p));
  };

  const decreaseQty = (id: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) } : p));
  };

  const addToCart = (product: Product) => {
    alert(`เพิ่ม ${product.nameTH} จำนวน ${product.quantity} ลงตระกร้า 🛒`);
  };

  return (
    <>
      <div style={{ boxShadow: "0px 13px 19px 0px rgba(0,0,0,0.25)",}}>
        <div style={{ padding: "20px", marginTop: "0px", backgroundColor: "#D6C0B3" }}></div>
        <div className="flex justify-center items-center mb-4 gap-6">
          <h1 className="text-[55px] font-bold">เมนู</h1>
          <h1 className="text-[55px] font-bold">Menu</h1>
        </div>
        <div style={{ padding: "20px", marginTop: "30px", backgroundColor: "white" }}>
          <Slider {...settings} style={{ padding: "30px", textAlign: "center", margin: "0 auto" }}>
            {products.map((product) => (
              <div key={product.id} style={{ padding: "0", textAlign: "center", width: "308px", margin: "0 auto" }}>
                <img className="image-hover " src={product.image} alt={product.nameTH} style={{ width: "auto", height: "308px", marginBottom: "10px" }} />
                <div style={{ width: "308px",fontSize:"46px" }}>{product.nameTH}</div>
                <div style={{ width: "308px",fontSize:"22px" }}>{product.nameEN}</div>
              
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0px", marginTop: "10px", width: "308px" }}>
                  {/* ปุ่มเพิ่ม/ลดจำนวน */}
                  <div style={{ display: "flex", alignItems: "center", padding: "0px", gap: "10px" }}>
                    <b className="btn-many-product" onClick={() => decreaseQty(product.id)} style={{}}>-</b>
                    <span>{product.quantity}</span>
                    <button className="btn-many-product" onClick={() => increaseQty(product.id)} style={{}}>+</button>
                  </div>

                  {/* ราคาสินค้า */}
                  <p style={{ margin: 0, fontWeight: "bold", minWidth: "40px", textAlign: "center" }}>{product.price}฿</p>

                  {/* ปุ่มเพิ่มเข้าตระกร้า */}
                  <button
                    className="btn-add-cart"
                    onClick={() => addToCart(product)}>
                    <CarTaxiFront />
                  </button>
                </div>

              </div>
            ))}
          </Slider>
        </div>
        <div style={{ padding: "20px", marginBottom: "0px", backgroundColor: "#D6C0B3" }}></div>

      </div>
    </>
  );
};

export default ProductSlider;
