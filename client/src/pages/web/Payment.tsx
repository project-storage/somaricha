import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import { toast } from "react-toastify";

interface PaymentMethod {
  id: number;
  user_id: number;
  type: 'credit_card' | 'debit_card' | 'bank_account' | 'mobile_payment';
  provider: string;
  last_four: string;
  expiry_month?: string;
  expiry_year?: string;
  is_default: boolean;
}

const Payment: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id' | 'user_id' | 'is_default'>>({
    type: 'credit_card',
    provider: '',
    last_four: '',
    expiry_month: '',
    expiry_year: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPaymentMethods();
    }
  }, [isLoggedIn]);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await userService.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (error: any) {
      console.error("Error fetching payment methods:", error);
      toast.error("Failed to load payment methods");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate card number format
      if (!/^\d{4}$/.test(formData.last_four)) {
        toast.error("Last four digits must be 4 numbers");
        return;
      }
      
      if (editingPayment) {
        // Update existing payment method
        await userService.updatePaymentMethod(editingPayment.id, formData);
        toast.success("Payment method updated successfully!");
      } else {
        // Create new payment method
        await userService.addPaymentMethod(formData);
        toast.success("Payment method added successfully!");
      }
      
      setIsFormOpen(false);
      setEditingPayment(null);
      setFormData({
        type: 'credit_card',
        provider: '',
        last_four: '',
        expiry_month: '',
        expiry_year: '',
      });
      fetchPaymentMethods();
    } catch (error: any) {
      console.error("Error saving payment method:", error);
      toast.error("Failed to save payment method");
    }
  };

  const handleEdit = (payment: PaymentMethod) => {
    setEditingPayment(payment);
    setFormData({
      type: payment.type,
      provider: payment.provider,
      last_four: payment.last_four,
      expiry_month: payment.expiry_month || '',
      expiry_year: payment.expiry_year || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this payment method?")) {
      try {
        await userService.deletePaymentMethod(id);
        toast.success("Payment method deleted successfully!");
        fetchPaymentMethods();
      } catch (error: any) {
        console.error("Error deleting payment method:", error);
        toast.error("Failed to delete payment method");
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await userService.setDefaultPaymentMethod(id);
      toast.success("Default payment method updated!");
      fetchPaymentMethods();
    } catch (error: any) {
      console.error("Error setting default payment method:", error);
      toast.error("Failed to set default payment method");
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
          <h1 className="text-2xl font-bold text-red-600">Please log in to manage your payment methods</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6C0B3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#8C6E63]">Payment Methods</h1>
            <button
              onClick={() => {
                setEditingPayment(null);
                setFormData({
                  type: 'credit_card',
                  provider: '',
                  last_four: '',
                  expiry_month: '',
                  expiry_year: '',
                });
                setIsFormOpen(true);
              }}
              className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg hover:bg-[#6b584b] transition-colors"
            >
              Add Payment Method
            </button>
          </div>

          {isFormOpen && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[#8C6E63]">
                {editingPayment ? "Edit Payment Method" : "Add New Payment Method"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Payment Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      required
                    >
                      <option value="credit_card">Credit Card</option>
                      <option value="debit_card">Debit Card</option>
                      <option value="bank_account">Bank Account</option>
                      <option value="mobile_payment">Mobile Payment</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Provider</label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      placeholder="Visa, Mastercard, Krungthai, etc."
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Last Four Digits</label>
                    <input
                      type="text"
                      name="last_four"
                      value={formData.last_four}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                      placeholder="1234"
                      required
                    />
                  </div>
                  
                  {(formData.type === 'credit_card' || formData.type === 'debit_card') && (
                    <>
                      <div>
                        <label className="block text-gray-700 mb-2">Expiry Month</label>
                        <input
                          type="text"
                          name="expiry_month"
                          value={formData.expiry_month || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                          placeholder="MM"
                          maxLength={2}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-gray-700 mb-2">Expiry Year</label>
                        <input
                          type="text"
                          name="expiry_year"
                          value={formData.expiry_year || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                          placeholder="YY"
                          maxLength={2}
                        />
                      </div>
                    </>
                  )}
                </div>
                
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingPayment(null);
                    }}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg hover:bg-[#6b584b] transition-colors"
                  >
                    {editingPayment ? "Update Payment" : "Save Payment"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {paymentMethods.length > 0 ? (
            <div className="space-y-4">
              {paymentMethods.map((payment) => (
                <div 
                  key={payment.id} 
                  className={`border rounded-lg p-6 flex justify-between items-center ${payment.is_default ? "border-[#8C6E63] border-2 bg-[#f9f4ef]" : "border-gray-300"}`}
                >
                  <div className="flex items-center">
                    <div className="mr-4 w-12 h-8 bg-[#8C6E63] rounded flex items-center justify-center text-white font-bold">
                      {payment.type.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {payment.provider} ending in •••• {payment.last_four}
                      </div>
                      {payment.type === 'credit_card' || payment.type === 'debit_card' ? (
                        <div className="text-gray-600 text-sm">
                          Expires: {payment.expiry_month}/{payment.expiry_year}
                        </div>
                      ) : (
                        <div className="text-gray-600 text-sm">
                          {payment.type === 'mobile_payment' ? 'Mobile Payment' : 'Bank Account'}
                        </div>
                      )}
                      {payment.is_default && (
                        <div className="mt-1">
                          <span className="bg-[#8C6E63] text-white text-xs px-2 py-1 rounded">
                            Default Payment
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => !payment.is_default && handleSetDefault(payment.id)}
                      disabled={payment.is_default}
                      className={`px-3 py-1 rounded text-sm ${
                        payment.is_default 
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                          : "bg-[#8C6E63] text-white hover:bg-[#6b584b]"
                      }`}
                    >
                      {payment.is_default ? "Default" : "Set Default"}
                    </button>
                    <button
                      onClick={() => handleEdit(payment)}
                      className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(payment.id)}
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
              <p className="text-gray-500">You have no saved payment methods yet. Add your first payment method!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;