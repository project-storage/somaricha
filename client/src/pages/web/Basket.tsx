import React, { useState, useEffect } from "react";
import { FaTrash, FaMinus, FaPlus, FaCheck } from "react-icons/fa";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { checkAuthAndAlert } from "../../services/authUtils";
import { BsBasket2Fill } from "react-icons/bs";


interface Product {
  id: number;
  nameTh: string;
  nameEn: string;
  price: number;
  image: string;
  quantity: number;
}

const Basket: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, getTotalItems, getTotalPrice } = useCart();
  const { isLoggedIn } = useAuth();
  
  // Transform the cart items to match the Basket component structure
  const [products, setProducts] = useState<Product[]>([]);
  
  // Update products when cart changes
  useEffect(() => {
    const mappedProducts = cart.items.map((item: any) => ({
      id: item.id,
      nameTh: item.nameTH || item.nameTh,
      nameEn: item.nameEN || item.nameEn,
      price: item.price,
      image: item.image,
      quantity: item.quantity
    }));
    setProducts(mappedProducts);
  }, [cart]);

  const [deleteMode, setDeleteMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const handleQuantity = (id: number, type: "inc" | "dec") => {
    if (!checkAuthAndAlert()) {
      return;
    }
    const product = products.find(p => p.id === id);
    if (product) {
      let newQuantity = product.quantity;
      if (type === "inc" && product.quantity < 20) {
        newQuantity = product.quantity + 1;
      } else if (type === "dec") {
        newQuantity = Math.max(1, product.quantity - 1);
      }
      updateQuantity(id, newQuantity);
    }
  };

  const handleInputChange = (id: number, value: string) => {
    if (!checkAuthAndAlert()) {
      return;
    }
    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= 20) {
      updateQuantity(id, newQuantity);
    } else if (value === '') {
      // Allow empty input temporarily (user might be typing)
      return;
    } else if (newQuantity > 20) {
      // If user enters a value greater than 20, set it to 20
      updateQuantity(id, 20);
    }
  };

  const handleSelect = (id: number) => {
    if (!checkAuthAndAlert()) {
      return;
    }
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = () => {
    if (!checkAuthAndAlert()) {
      return;
    }
    if (selected.length > 0) {
      selected.forEach(id => removeFromCart(id));
      setSelected([]);
      setDeleteMode(false);
    }
  };

  return (
    <>
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="text-center mt-6">
        <h1 className="text-[40px] font-bold text-black">
          ตะกร้า  Basket
        </h1>
        <p className="text-[20px] font-normal text-black">
          กดสั่งซื้อเพื่อชำระเงิน
        </p>
      </div>

      {/* Trash Icon */}
      <div className="flex mt-4">
        <div className="flex justify-end w-full">
          <button
            onClick={() => setDeleteMode(!deleteMode)}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-white"
          >
            <FaTrash className={`${deleteMode ? 'text-red-600' : 'text-black'} text-[30px]`} />
          </button>
        </div>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-6 px-6 mt-8">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex items-center bg-white h-[111px] w-[1085px] mx-auto shadow-[0_13px_19px_rgba(0,0,0,0.25)] rounded-[20px] px-[30px] gap-6"
            >
              {/* Image */}
              <img
                src={product.image}
                alt={product.nameTh}
                className="h-[111px] w-[111px] object-cover rounded-lg"
              />

              {/* Name */}
              <div className="flex flex-col">
                <span className="text-[30px] font-semibold text-black leading-none">
                  {product.nameTh}
                </span>
                <span className="text-[20px] font-medium text-gray-700">
                  {product.nameEn}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4 ml-auto">
                <button
                  onClick={() => handleQuantity(product.id, "dec")}
                  className="h-[35px] w-[35px] flex items-center justify-center rounded-full bg-[#333333] text-white text-xl"
                >
                  <FaMinus />
                </button>
                <input
                  type="text"
                  value={product.quantity}
                  onChange={(e) => handleInputChange(product.id, e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-[40px] h-[30px] text-center text-[18px] font-bold text-black border-none focus:outline-none bg-transparent focus:bg-gray-100 rounded"
                />
                <button
                  onClick={() => handleQuantity(product.id, "inc")}
                  className="h-[35px] w-[35px] flex items-center justify-center rounded-full bg-[#333333] text-white text-xl"
                >
                  <FaPlus />
                </button>
              </div>

              {/* Price */}
              <div className="text-[20px] font-medium text-black ml-6">
                {product.price * product.quantity} บาท
              </div>

              {/* Check block (when delete mode) */}
              {deleteMode && (
                  <button
                  onClick={() => handleSelect(product.id)}
                  className={`ml-6 h-[30px] w-[30px] flex items-center justify-center border-2 rounded-[10px] ${
                    selected.includes(product.id)
                    ? "bg-black text-white"
                    : "border-black"
                  }`}
                  >
                  {selected.includes(product.id) && <FaCheck />}
                  </button>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px]">
            <p className="text-gray-500 text-[18px] font-medium">ไม่มีสินค้าอยู่ในตระกร้า</p>
            {!isLoggedIn && (
              <p className="text-gray-400 text-[16px] mt-2">กรุณาเข้าสู่ระบบเพื่อจัดการสินค้าในตระกร้า</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[90px] bg-white shadow-[-3px_-13px_43.5px_rgba(0,0,0,0.25)] flex items-center justify-between px-10">
        {/* Left icon */}
        <div className="h-[60px] w-[60px] rounded-full flex items-center justify-center">
          <BsBasket2Fill />
        </div>

        {/* Center text */}
        <div className="text-[20px] font-normal text-black">
          {!isLoggedIn ? "กรุณาเข้าสู่ระบบเพื่อจัดการตระกร้าสินค้า" : `จำนวน ${getTotalItems()} รายการ รวมราคาสินค้า ${getTotalPrice()} บาท`}
        </div>

        {/* Right button */}
        <button
          className={`h-[50px] w-[190px] rounded-[50px] text-[20px] font-bold text-white ${
            deleteMode ? "bg-red-600" : (products.length > 0 ? "bg-[#8C6E63]" : (!isLoggedIn ? "bg-gray-400" : "bg-gray-400"))
          }`}
          onClick={!isLoggedIn ? () => window.location.href = "/login" : (deleteMode ? handleDelete : undefined)}
          disabled={products.length === 0 && !deleteMode && isLoggedIn}
        >
          {!isLoggedIn ? "เข้าสู่ระบบ" : (deleteMode ? "ลบสินค้า" : "ชำระเงิน")}
        </button>
      </div>
    </div>
    </>
  );
};

export default Basket;
