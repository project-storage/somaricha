// pages/ProductSlider.tsx
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaShoppingCart } from "react-icons/fa";
import productService, { type Product } from "../../../services/productService";
import { useCart } from "../../../context/CartContext";

// Cart item interface
interface CartItem extends Product {
  quantity: number;
}

const ProductSlider: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart: addToCartContext } = useCart();

  // เพิ่ม/ลดจำนวน
  const increaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity ?? 1) + 1 } : p
      )
    );
  };

  const decreaseQty = (id: number) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, (p.quantity ?? 1) - 1) } : p
      )
    );
  };

  // เพิ่มสินค้าเข้า cartno
  const addToCart = (product: Product) => {
    // Convert Product to CartItem format for the context
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

  // fetch products จาก backend
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "50px",
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerPadding: "30px" } },
      { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: "10px" } },
    ],
  };

  return (
    <div >
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
                  <button
                    className="btn-many-product"
                    onClick={() => decreaseQty(product.id)}
                  >
                    -
                  </button>
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

    </div>
  );
};

export default ProductSlider;
