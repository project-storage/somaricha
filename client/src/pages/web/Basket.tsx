import React, { useState, useEffect } from "react";
import { FaTrash, FaMinus, FaPlus, FaCheck } from "react-icons/fa";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { checkAuthAndAlert } from "../../services/authUtils";
import { BsBasket2Fill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";


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
  const navigate = useNavigate();
  
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
    <div className="min-h-screen flex flex-col pb-[160px] sm:pb-[110px] bg-gray-50">
      {/* Header */}
      <div className="text-center mt-8 px-4">
        <h1 className="text-3xl sm:text-[40px] font-bold text-black mb-2">
          ตะกร้าสินค้า Basket
        </h1>
        <p className="text-base sm:text-[20px] font-normal text-gray-600">
          กดสั่งซื้อเพื่อชำระเงิน
        </p>
      </div>

      {/* Trash Icon */}
      <div className="flex mt-4 px-6 max-w-5xl w-full mx-auto justify-end">
        <button
          onClick={() => setDeleteMode(!deleteMode)}
          className="h-[40px] w-[40px] flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors"
          aria-label="Toggle delete mode"
        >
          <FaTrash className={`${deleteMode ? 'text-red-600' : 'text-black'} text-[20px]`} />
        </button>
      </div>

      {/* Product List */}
      <div className="flex flex-col gap-6 px-4 sm:px-6 mt-6 w-full max-w-5xl mx-auto">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row items-center bg-white h-auto sm:h-[111px] w-full shadow-[0_13px_19px_rgba(0,0,0,0.15)] rounded-[20px] p-4 sm:px-[30px] gap-4 sm:gap-6 hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <img
                src={product.image}
                alt={product.nameTh}
                className="h-[100px] w-[100px] sm:h-[90px] sm:w-[90px] object-cover rounded-xl shrink-0"
              />

              {/* Name */}
              <div className="flex flex-col text-center sm:text-left flex-1 min-w-0 w-full">
                <span className="text-[20px] sm:text-[24px] font-semibold text-black leading-tight truncate">
                  {product.nameTh}
                </span>
                <span className="text-[14px] sm:text-[16px] font-medium text-gray-500 truncate mt-1">
                  {product.nameEn}
                </span>
              </div>

              {/* Controls and Price */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuantity(product.id, "dec")}
                    className="h-[32px] w-[32px] flex items-center justify-center rounded-full bg-[#333333] hover:bg-gray-600 text-white text-base transition-colors shadow-sm"
                  >
                    <FaMinus size={10} />
                  </button>
                  <input
                    type="text"
                    value={product.quantity}
                    onChange={(e) => handleInputChange(product.id, e.target.value)}
                    onFocus={(e) => e.target.select()}
                    className="w-[40px] h-[30px] text-center text-[16px] sm:text-[18px] font-bold text-black border-none focus:outline-none bg-transparent"
                  />
                  <button
                    onClick={() => handleQuantity(product.id, "inc")}
                    className="h-[32px] w-[32px] flex items-center justify-center rounded-full bg-[#333333] hover:bg-gray-600 text-white text-base transition-colors shadow-sm"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                {/* Price */}
                <div className="text-[18px] sm:text-[20px] font-bold text-black min-w-[90px] text-right">
                  {product.price * product.quantity} ฿
                </div>

                {/* Check block (when delete mode) */}
                {deleteMode && (
                  <button
                    onClick={() => handleSelect(product.id)}
                    className={`h-[30px] w-[30px] flex items-center justify-center border-2 rounded-[10px] shrink-0 transition-colors ${
                      selected.includes(product.id)
                      ? "bg-black border-black text-white"
                      : "border-gray-400"
                    }`}
                  >
                    {selected.includes(product.id) && <FaCheck size={12} />}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-[250px] bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <p className="text-gray-500 text-[18px] font-semibold text-center">ไม่มีสินค้าอยู่ในตะกร้า</p>
            {!isLoggedIn && (
              <p className="text-gray-400 text-[14px] mt-2 text-center">กรุณาเข้าสู่ระบบเพื่อจัดการสินค้าในตะกร้า</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 w-full min-h-[90px] py-4 bg-white shadow-[-3px_-13px_43.5px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row items-center justify-between px-6 sm:px-10 gap-4 z-40 border-t border-gray-100">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-center sm:justify-start">
          {/* Left icon */}
          <div className="h-[50px] w-[50px] rounded-full flex items-center justify-center bg-gray-50 text-2xl shrink-0 text-[#8C6E63]">
            <BsBasket2Fill />
          </div>

          {/* Center text */}
          <div className="text-[16px] sm:text-[18px] font-bold text-black text-center sm:text-left">
            {!isLoggedIn ? "กรุณาเข้าสู่ระบบเพื่อจัดการตะกร้าสินค้า" : `จำนวน ${getTotalItems()} รายการ รวมราคาสินค้า ${getTotalPrice()} บาท`}
          </div>
        </div>

        {/* Right button */}
        <button
          className={`h-[50px] w-full sm:w-[190px] rounded-[50px] text-[18px] sm:text-[20px] font-bold text-white transition-all duration-300 shadow-md ${
            deleteMode ? "bg-red-600 hover:bg-red-700" : (products.length > 0 ? "bg-[#8C6E63] hover:bg-[#73584F]" : "bg-gray-400")
          }`}
          onClick={!isLoggedIn ? () => window.location.href = "/login" : (deleteMode ? handleDelete : () => navigate('/pay'))}
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
