import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/userService";
import addressOptionService from "../../services/addressOptionService";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

interface UserAddress {
  id: number;
  ao_id: number;
  recipient_name?: string;
  phone?: string;
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  address_detail?: string;
  isDefault: boolean;
  created_at?: Date;
  updated_at?: Date;
  addressOption?: {
    id: number;
    ao_name: string;
  };
}

const Address: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // Initialize location object

  useEffect(() => {
    console.log("isLoggedIn status:", isLoggedIn); // Debug log
    const token = localStorage.getItem("access_token");
    console.log("Access token exists:", !!token); // Debug log
    
    if (isLoggedIn && token) {
      fetchAddresses();
    } else {
      console.log("User is not logged in or no token exists, cannot fetch addresses"); // Debug log
      if (!token) {
        // Show toast notification instead of full page
        toast.error("กรุณาเข้าสู่ระบบเพื่อจัดการที่อยู่ของคุณ");
        // Redirect to login after showing the toast
        const timer = setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirect after 2 seconds to allow toast to be seen
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, location.pathname, navigate]); // Fetch when logged in status changes or when navigating to this page

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      console.log("Attempting to fetch addresses..."); // Debug log
      const response = await userService.getAddresses();
      console.log("Fetched addresses response:", response); // Debug log
      console.log("Response data:", response.data); // Debug log
      console.log("Response data type:", typeof response.data); // Debug log
      console.log("Is response.data an array:", Array.isArray(response.data)); // Debug log
      
      // Handle different response formats
      let addressesData = [];
      if (Array.isArray(response.data)) {
        // Direct array format
        addressesData = response.data;
      } else if (response.data && typeof response.data === 'object' && Array.isArray(response.data.data)) {
        // Wrapped in { data: [...] } format
        addressesData = response.data.data;
      } else {
        console.error("Unexpected response format:", response);
        toast.error("รูปแบบข้อมูลที่อยู่ไม่ถูกต้อง");
      }
      
      // Normalize the address data to ensure consistency
      const normalizedAddresses = addressesData.map((addr: any) => ({
        ...addr,
        // Ensure ao_id is available (from addressOption relation)
        ao_id: addr.ao_id || (addr.addressOption ? addr.addressOption.id : null),
        // Ensure isDefault field exists
        isDefault: addr.isDefault || false
      }));
      
      setAddresses(normalizedAddresses);
      console.log(`Loaded ${normalizedAddresses.length} addresses`); // Debug log
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาดในการโหลดที่อยู่:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response,
        request: error.request,
        status: error.response?.status
      }); // More detailed error info
      if (error.response?.status === 401) {
        toast.error("กรุณาเข้าสู่ระบบก่อนใช้งาน");
        // Optionally redirect to login page
        // navigate('/login');
      } else {
        toast.error(error.response?.data?.message || error.response?.data?.error || error.message || "โหลดข้อมูลที่อยู่ไม่สำเร็จ");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddressClick = (address: UserAddress) => {
    navigate(`/address/edit/${address.id}`);
  };

  const handleAddAddress = async () => {
    // Check if user has address options, create one if not
    try {
      const addressOptionsResponse = await userService.getAddressOptions();
      const dataField = addressOptionsResponse.data?.data || addressOptionsResponse.data;
      const userAddressOptions = Array.isArray(dataField) ? dataField : [];
      
      if (userAddressOptions.length === 0) {
        // Get current user to get user_id
        const userResponse = await userService.getMe();
        const userId = userResponse.data?.data?.id || userResponse.data?.id;
        
        // Create a default address option for the user
        await addressOptionService.createAddressOption({
          user_id: Number(userId),
          ao_name: "ที่อยู่เริ่มต้น"
        });
      }
      
      navigate('/address/add');
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการตรวจสอบตัวเลือกที่อยู่:", error);
      toast.error("เกิดข้อผิดพลาดในการเตรียมการเพิ่มที่อยู่");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
        <h1 className="text-4xl font-bold text-black mb-12">Address</h1>
        <div className="flex flex-col items-center w-full max-w-[1200px]">
          <div className="text-center text-gray-600 py-12">
            กำลังเปลี่ยนเส้นทางไปหน้าเข้าสู่ระบบ...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-black mb-2">ที่อยู่ของฉัน</h1>
      <p className="text-gray-500 mb-10 text-center">จัดการที่อยู่สำหรับการจัดส่งสินค้า</p>
      
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="text-center mb-6 text-gray-600 font-medium">
          แสดง {addresses.length} ที่อยู่จากทั้งหมด (สูงสุด 3 ที่อยู่)
        </div>
        {addresses.length > 0 ? (
          <div className="w-full space-y-6 flex flex-col items-center">
            {addresses.map((address) => (
              <div 
                key={address.id} 
                onClick={() => handleAddressClick(address)}
                className="w-full h-auto min-h-[100px] bg-white rounded-[25px] shadow-md p-6 cursor-pointer flex items-center hover:shadow-lg hover:scale-[1.01] transition-all duration-300 border border-gray-100"
              >
                <div className="text-[#8C6E63] text-xl mr-4 bg-orange-50 p-3 rounded-full shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-black text-lg sm:text-xl font-bold truncate">
                    {address.recipient_name || 'ชื่อผู้รับ'}
                  </div>
                  <div className="text-gray-500 text-[13px] sm:text-[14px] mt-1 leading-relaxed">
                    {address.number} ถ. {address.road}, {address.subdistrict}, {address.district}, {address.province} {address.code_zip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12 bg-white rounded-2xl w-full border border-gray-100 shadow-sm">
            คุณยังไม่มีที่อยู่ที่บันทึกไว้
          </div>
        )}
        
        <button 
          onClick={handleAddAddress}
          className={`mt-10 w-[60px] h-[60px] bg-[#8C6E63] hover:bg-[#73584F] rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
            addresses.length >= 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Add new address"
        >
          <FiPlus size={24} color="white" />
        </button>
      </div>
    </div>
  );
};

export default Address;