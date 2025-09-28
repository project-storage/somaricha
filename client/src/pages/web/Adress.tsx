import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import { toast } from "react-toastify";

interface UserAddress {
  id: number;
  user_id: number;
  recipient_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  district: string;
  city: string;
  postal_code: string;
  is_default: boolean;
}

const Address: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [formData, setFormData] = useState<Omit<UserAddress, 'id' | 'user_id' | 'is_default'>>({
    recipient_name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    district: "",
    city: "",
    postal_code: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAddresses();
    }
  }, [isLoggedIn]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await userService.getAddresses();
      setAddresses(response.data);
    } catch (error: any) {
      console.error("Error fetching addresses:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        // Update existing address
        await userService.updateAddress(editingAddress.id, formData);
        toast.success("Address updated successfully!");
      } else {
        // Create new address
        await userService.createAddress(formData);
        toast.success("Address added successfully!");
      }
      
      setIsFormOpen(false);
      setEditingAddress(null);
      setFormData({
        recipient_name: "",
        phone: "",
        address_line1: "",
        address_line2: "",
        district: "",
        city: "",
        postal_code: "",
      });
      fetchAddresses();
    } catch (error: any) {
      console.error("Error saving address:", error);
      toast.error("Failed to save address");
    }
  };

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setFormData({
      recipient_name: address.recipient_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || "",
      district: address.district,
      city: address.city,
      postal_code: address.postal_code,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await userService.deleteAddress(id);
        toast.success("Address deleted successfully!");
        fetchAddresses();
      } catch (error: any) {
        console.error("Error deleting address:", error);
        toast.error("Failed to delete address");
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await userService.setDefaultAddress(id);
      toast.success("Default address updated!");
      fetchAddresses();
    } catch (error: any) {
      console.error("Error setting default address:", error);
      toast.error("Failed to set default address");
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Please log in to manage your addresses</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6C0B3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#8C6E63]">Your Addresses</h1>
            <button
              onClick={() => {
                setEditingAddress(null);
                setFormData({
                  recipient_name: "",
                  phone: "",
                  address_line1: "",
                  address_line2: "",
                  district: "",
                  city: "",
                  postal_code: "",
                });
                setIsFormOpen(true);
              }}
              className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg hover:bg-[#6b584b] transition-colors"
            >
              Add New Address
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#8C6E63]">
                {editingAddress ? "Edit Address" : "Add New Address"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Recipient Name</label>
                    <input
                      type="text"
                      name="recipient_name"
                      value={formData.recipient_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Address Line 1</label>
                    <input
                      type="text"
                      name="address_line1"
                      value={formData.address_line1}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 mb-2">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      name="address_line2"
                      value={formData.address_line2}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingAddress(null);
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg hover:bg-[#6b584b] transition-colors"
                  >
                    {editingAddress ? "Update Address" : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {addresses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addresses.map((address) => (
                <div 
                  key={address.id} 
                  className={`border rounded-lg p-6 ${address.is_default ? "border-[#8C6E63] border-2 bg-[#f9f4ef]" : "border-gray-300"}`}
                >
                  {address.is_default && (
                    <div className="mb-2">
                      <span className="bg-[#8C6E63] text-white text-sm px-3 py-1 rounded-full">
                        Default Address
                      </span>
                    </div>
                  )}
                  <div className="font-semibold text-lg">{address.recipient_name}</div>
                  <div className="text-gray-600 mt-1">{address.phone}</div>
                  <div className="text-gray-600 mt-1">{address.address_line1}</div>
                  {address.address_line2 && (
                    <div className="text-gray-600 mt-1">{address.address_line2}</div>
                  )}
                  <div className="text-gray-600 mt-1">{address.district}, {address.city} {address.postal_code}</div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => !address.is_default && handleSetDefault(address.id)}
                      disabled={address.is_default}
                      className={`px-3 py-1 rounded text-sm ${
                        address.is_default 
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                          : "bg-[#8C6E63] text-white hover:bg-[#6b584b]"
                      }`}
                    >
                      {address.is_default ? "Default" : "Set as Default"}
                    </button>
                    <button
                      onClick={() => handleEdit(address)}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">You have no saved addresses yet. Add your first address!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Address;