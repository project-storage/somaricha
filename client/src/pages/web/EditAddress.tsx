import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import addressOptionService from "../../services/addressOptionService";
import addressService from "../../services/addressService";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

interface UserAddress {
  id: number;
  ao_id: number;
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

const EditAddress: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<UserAddress | null>(null);
  const [recipientName, setRecipientName] = useState<string>(""); // Track recipient name separately
  const [phone, setPhone] = useState<string>(""); // Track phone separately
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchAddress();
    }
  }, [isLoggedIn, id]);

  const fetchAddress = async () => {
    try {
      setLoading(true);
      // Get the specific address by ID using the addressService
      const response = await addressService.getAddressById(parseInt(id || ''));
      // The server returns data wrapped in a { data: ... } object
      const address = response.data.data;
      
      if (address) {
        setFormData(address);
        // Set recipient name and phone from address entity
        setRecipientName(address.recipient_name || "");
        setPhone(address.phone || "");
      } else {
        toast.error("ไม่พบที่อยู่ที่ต้องการแก้ไข");
        navigate('/address');
      }
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาดในการโหลดที่อยู่:", error);
      toast.error("โหลดข้อมูลที่อยู่ไม่สำเร็จ");
      navigate('/address');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'recipient_name') {
      setRecipientName(value);
    } else if (name === 'phone') {
      setPhone(value);
    } else if (formData) {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'code_zip' ? Number(value) : value
      }) as UserAddress);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;
    
    // Validation
    if (!formData.number || !formData.road || !formData.subdistrict || 
        !formData.district || !formData.province || formData.code_zip <= 0) {
      toast.error("กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน");
      return;
    }
    
    try {
      // Update the address with all fields including recipient_name and phone
      await addressService.updateAddress(formData.id, {
        ao_id: formData.ao_id, // Include ao_id that is required by the backend
        recipient_name: recipientName, // Use the separate state for recipient name
        phone: phone, // Use the separate state for phone
        number: formData.number,
        road: formData.road,
        subdistrict: formData.subdistrict,
        district: formData.district,
        province: formData.province,
        code_zip: formData.code_zip,
        address_detail: formData.address_detail,
      });
      
      toast.success("อัปเดตที่อยู่เรียบร้อยแล้ว!");
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

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!formData) return;
    
    try {
      await addressService.deleteAddress(formData.id);
      toast.success("ลบรายการเรียอรีย์แล้ว!");
      setShowDeleteDialog(false);
      navigate('/address', { replace: true });
    } catch (error: any) {
      console.error("เกิดข้อผิดพลาดในการลบรายการ:", error);
      toast.error(error.response?.data?.message || "ลบรายการไม่สำเร็จ");
      setShowDeleteDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">กรุณาเข้าสู่ระบบเพื่อจัดการที่อยู่ของคุณ</h1>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">ไม่พบที่อยู่ที่ต้องการแก้ไข</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
      <h1 className="text-4xl font-bold text-black mb-12">Edit Address</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-[600px]">
        <div className="space-y-6">
          <div>
            <label className="text-20px font-bold block mb-2">ชื่อผู้รับ</label>
            <input
              type="text"
              name="recipient_name"
              value={recipientName}
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
              value={phone}
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
            />
          </div>
          
          <div>
            <label className="text-20px font-bold block mb-2">รายละเอียดเพิ่มเติม เช่น ตึกสี ชั้น ห้อง</label>
            <input
              type="text"
              name="address_detail"
              value={formData.address_detail || ""}
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
          
          <button
            type="button"
            onClick={handleDelete}
            className="text-18px font-bold text-red-600 bg-transparent border-none"
          >
            ลบที่อยู่นี้
          </button>
        </div>
      </form>
      
      {/* Inline Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[600px] h-[250px] rounded-[25px] shadow-lg flex flex-col items-center justify-center p-6 relative">
            <div className="w-15 h-15 bg-black rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </div>
            
            <div className="text-26px font-bold mb-6">ยืนยันการยกเลิก</div>
            
            <div className="flex justify-between w-full">
              <button
                onClick={cancelCancel}
                className="text-18px font-bold text-black bg-transparent border-none"
              >
                ยกเลิก
              </button>
              
              <button
                onClick={confirmCancel}
                className="w-[120px] h-[40px] bg-[#8C6E63] text-white text-18px font-bold rounded-[25px]"
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Inline Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white w-[600px] h-[250px] rounded-[25px] shadow-lg flex flex-col items-center justify-center p-6 relative">
            <div className="w-15 h-15 bg-black rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </div>
            
            <div className="text-26px font-bold mb-6">ยืนยันการลบ</div>
            
            <div className="flex justify-between w-full">
              <button
                onClick={cancelDelete}
                className="text-18px font-bold text-black bg-transparent border-none"
              >
                ยกเลิก
              </button>
              
              <button
                onClick={confirmDelete}
                className="w-[120px] h-[40px] bg-[#8C6E63] text-white text-18px font-bold rounded-[25px]"
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

export default EditAddress;