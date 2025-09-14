// pages/ProductSlider.tsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingCart } from "react-icons/fa";
import productService, { type Product } from "../../../services/productService";

// Cart item interface
interface CartItem extends Product {
  quantity: number;
}

const ProductSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // ดึง cart จาก localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // fetch products จาก backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        const fetchedProducts = res.data.data.map((p: any) => ({
          id: p.id,
          nameTH: p.product_name,
          nameEN: p.product_detail,
          image: p.product_image || "",
          price: p.product_price,
        }));
        // เริ่มต้น quantity = 1
        setProducts(fetchedProducts.map((p) => ({ ...p, quantity: 1 })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // เพิ่ม/ลดจำนวน
  const increaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      )
    );
  };

  const decreaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) - 1) } : p
      )
    );
  };

  // เพิ่มสินค้าเข้า cart
  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + (product.quantity || 1) }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: product.quantity || 1 }];
    }
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    alert(`เพิ่ม ${product.nameTH} จำนวน ${product.quantity} ลงตระกร้า 🛒`);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "100px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div style={{ boxShadow: "0px 13px 19px 0px rgba(0,0,0,0.25)" }}>
      <div style={{ padding: "20px", backgroundColor: "#D6C0B3" }}></div>
      <div className="flex justify-center items-center mb-4 gap-6">
        <h1 className="text-[55px] font-bold">เมนู</h1>
        <h1 className="text-[55px] font-bold">Menu</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "white" }}>
        <Slider
          {...settings}
          style={{ padding: "30px", textAlign: "center", margin: "0 auto" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                padding: "0",
                textAlign: "center",
                width: "308px",
                margin: "0 auto",
              }}
            >
              <img
                src={product.image}
                alt={product.nameTH}
                style={{ width: "auto", height: "308px", marginBottom: "10px" }}
              />
              <div style={{ width: "308px", fontSize: "46px" }}>
                {product.nameTH}
              </div>
              <div style={{ width: "308px", fontSize: "22px" }}>
                {product.nameEN}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "10px",
                  width: "308px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <b
                    className="btn-many-product"
                    onClick={() => decreaseQty(product.id)}
                  >
                    -
                  </b>
                  <span>{product.quantity}</span>
                  <button
                    className="btn-many-product"
                    onClick={() => increaseQty(product.id)}
                  >
                    +
                  </button>
                </div>

                <p
                  style={{
                    margin: 0,
                    fontWeight: "bold",
                    minWidth: "40px",
                    textAlign: "center",
                    fontSize: "22px",
                  }}
                >
                  {product.price}฿
                </p>

                <button
                  className="btn-add-cart"
                  onClick={() => addToCart(product)}
                >
                  <FaShoppingCart size={22} />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#D6C0B3" }}></div>
    </div>
  );
};

export default ProductSlider;
