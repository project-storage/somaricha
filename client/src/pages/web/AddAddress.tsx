import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import userService from "../../services/userService";
import addressOptionService from "../../services/addressOptionService";
import addressService from "../../services/addressService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface CreateAddressDto {
  number: string;
  road: string;
  subdistrict: string;
  district: string;
  province: string;
  code_zip: number;
  address_detail?: string;
  recipient_name?: string;
  phone?: string;
}

const AddAddress: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateAddressDto>({
    number: "",
    road: "",
    subdistrict: "",
    district: "",
    province: "",
    code_zip: 0,
    address_detail: "",
    recipient_name: "",
    phone: "",
  });
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'code_zip' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.recipient_name || !formData.phone || !formData.number || !formData.road || !formData.subdistrict || 
        !formData.district || !formData.province || formData.code_zip <= 0) {
      toast.error("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    
    try {
      // First, check if user already has 3 addresses
      let existingAddresses = [];
      try {
        const addressesResponse = await addressService.getAllAddresses();
        // Handle different response formats - server returns { data: [...] }, but handle direct array too
        if (Array.isArray(addressesResponse.data)) {
          // Direct array format
          existingAddresses = addressesResponse.data;
        } else if (addressesResponse.data && typeof addressesResponse.data === 'object' && Array.isArray(addressesResponse.data.data)) {
          // Wrapped in { data: [...] } format
          existingAddresses = addressesResponse.data.data;
        } else {
          console.error("Unexpected response format when checking existing addresses:", addressesResponse);
          existingAddresses = [];
        }
        console.log(`User currently has ${existingAddresses.length} addresses`); // Debug log
      } catch (error) {
        console.error("Error fetching existing addresses:", error);
        // Continue anyway, as this might be the first fetch
      }

      if (existingAddresses.length >= 3) {
        toast.error("คุณสามารถบันทึกที่อยู่ได้สูงสุด 3 ที่อยู่เท่านั้น");
        return;
      }

      // ดึง AddressOption ของผู้ใช้ก่อน
      let userAddressOptions = [];
      try {
        const addressOptionsResponse = await userService.getAddressOptions();
        const dataField = addressOptionsResponse.data?.data || addressOptionsResponse.data;
        userAddressOptions = Array.isArray(dataField) ? dataField : [];
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงตัวเลือกที่อยู่:", error);
        toast.error("ไม่สามารถดึงข้อมูลตัวเลือกที่อยู่ได้ โปรดลองอีกครั้ง");
        return;
      }
      
      let ao_id;
      if (userAddressOptions.length === 0) {
        // ถ้าไม่มี AddressOption ให้สร้าง AddressOption ใหม่
        try {
          // Get current user to get user_id
          const userResponse = await userService.getMe();
          const userId = userResponse.data?.data?.id || userResponse.data?.id;
          
          const defaultAddressOption = {
            user_id: Number(userId),
            ao_name: formData.recipient_name || "ที่อยู่เริ่มต้น" // Use the recipient name as the address option name
          };
          const newAddressOptionResponse = await addressOptionService.createAddressOption(defaultAddressOption);
          ao_id = newAddressOptionResponse.data?.data?.id || newAddressOptionResponse.data?.id; // Use the newly created address option ID
        } catch (error) {
          console.error("เกิดข้อผิดพลาดในการสร้างตัวเลือกที่อยู่:", error);
          toast.error("ไม่สามารถสร้างตัวเลือกที่อยู่ได้ โปรดลองอีกครั้ง");
          return;
        }
      } else {
        // ใช้ AddressOption แรกของผู้ใช้
        ao_id = userAddressOptions[0].id;
      }
      
      // Create the address data including the recipient name and phone
      await addressService.createAddress({ 
        ...formData, 
        ao_id: ao_id 
      });
      toast.success("เพิ่มที่อยู่เรียบร้อยแล้ว!");
      // Navigate back to the main address page with state to trigger refresh
      navigate('/address', { replace: true });
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาดในการบันทึกที่อยู่:", error);
      toast.error(error.response?.data?.message || "บันทึกที่อยู่ไม่สำเร็จ");
    }
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate('/address');
  };

  const cancelCancel = () => {
    setShowCancelDialog(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">กรุณาเข้าสู่ระบบเพื่อจัดการที่อยู่ของคุณ</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-black mb-12">add Address</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-[600px]">
        <div className="space-y-6">
          <div>
            <label className="text-20px font-bold block mb-2">ชื่อผู้รับ</label>
            <input
              type="text"
              name="recipient_name"
              value={formData.recipient_name || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">เบอร์ติดต่อ</label>
            <input
              type="text"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">บ้านเลขที่</label>
            <input
              type="text"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">ถนน</label>
            <input
              type="text"
              name="road"
              value={formData.road}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">ตำบล/แขวง</label>
            <input
              type="text"
              name="subdistrict"
              value={formData.subdistrict}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">อำเภอ/เขต</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">จังหวัด</label>
            <input
              type="text"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">รหัสไปรษณีย์</label>
            <input
              type="number"
              name="code_zip"
              value={formData.code_zip}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
              inputMode="numeric"
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">รายละเอียดเพิ่มเติม เช่น ตึกสี ชั้น ห้อง</label>
            <input
              type="text"
              name="address_detail"
              value={formData.address_detail}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center mt-12 space-y-4">
          <button
            type="submit"
            className="w-[250px] h-[64px] bg-[#8C6E63] text-white text-18px font-bold rounded-[25px] shadow-lg"
            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          >
            ยืนยัน
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            className="text-18px font-bold text-black bg-transparent border-none"
          >
            ยกเลิก
          </button>
        </div>
      </form>
      
      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[400px] h-auto min-h-[250px] rounded-[25px] shadow-2xl flex flex-col items-center justify-center p-6 relative border border-gray-100">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </div>
            
            <div className="text-[22px] font-bold mb-6 text-black text-center">ยืนยันการยกเลิก</div>
            
            <div className="flex justify-between w-full px-6 gap-4">
              <button
                onClick={cancelCancel}
                className="text-[18px] font-bold text-gray-500 hover:text-black bg-transparent border-none py-2"
              >
                ยกเลิก
              </button>
              
              <button
                onClick={confirmCancel}
                className="w-[120px] h-[45px] bg-[#8C6E63] hover:bg-[#73584F] text-white text-[18px] font-bold rounded-[25px] shadow-md transition-colors"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddAddress;