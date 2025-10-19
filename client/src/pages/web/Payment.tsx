import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GiCash } from "react-icons/gi";
import { FaQrcode } from "react-icons/fa";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const paymentOptions = [
    {
      id: "cash",
      title: "ชำระเงินสด",
      icon: <GiCash className="h-[28px] w-[28px]" color="black" />
    },
    {
      id: "scan",
      title: "แสกนจ่าย",
      icon: <FaQrcode className="h-[28px] w-[28px]" color="black" />
    }
  ];

  // Payment option component for better organization
  const PaymentOption = ({ option }: { option: typeof paymentOptions[0] }) => (
    <div 
      key={option.id}
      className={`w-full h-[100px] bg-white rounded-[25px] shadow-lg p-6 cursor-pointer flex items-center hover:opacity-90 transition-opacity ${
        selectedPayment === option.id ? 'ring-2 ring-[#8C6E63]' : ''
      }`}
      onClick={() => setSelectedPayment(option.id)}
    >
      <div className="text-black text-center mr-4 flex items-center justify-center">
        {option.icon}
      </div>
      <div className="text-black text-[20px] font-medium">
        {option.title}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-black mb-12">Payment</h1>
      
      <div className="w-full max-w-[600px] space-y-6">
        {paymentOptions.map((option) => (
          <PaymentOption key={option.id} option={option} />
        ))}
      </div>
      
      <button 
        onClick={() => {
          if (selectedPayment) {
            // Here you would typically save the selected payment method to state/context
            // For now, we'll just go back
            console.log(`Selected payment: ${selectedPayment}`);
          }
          navigate(-1);
        }}
        className="mt-12 w-[180px] h-[50px] bg-[#8C6E63] text-white text-18px font-bold rounded-[25px] shadow-lg hover:bg-opacity-90 transition-colors"
      >
        ย้อนกลับ
      </button>
    </div>
  );
};

export default Payment;