import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

interface SettingsState {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  openTime: string;
  closeTime: string;
  notificationEmail: boolean;
  notificationSms: boolean;
  enableReviews: boolean;
  enableCoupons: boolean;
  enable2fa: boolean;
}

const DEFAULT_SETTINGS: SettingsState = {
  siteName: 'Somari Cha',
  siteDescription: 'ร้านชาหมึกไข่มุกอร่อยที่สุดในโลก',
  contactEmail: 'info@somaricha.com',
  contactPhone: '+66 81 234 5678',
  address: '123 ถ. ชาไข่มุก ต. ใจกลางเมือง อ. เมือง จ. กรุงเทพมหานคร 10110',
  openTime: '08:00',
  closeTime: '22:00',
  notificationEmail: true,
  notificationSms: false,
  enableReviews: true,
  enableCoupons: false,
  enable2fa: false,
};

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  
  // Security form states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('somaricha_admin_settings');
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse admin settings, using defaults');
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, type } = e.target;
    const value = e.target.value;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('somaricha_admin_settings', JSON.stringify(settings));
      toast.success('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!');
    } catch (err) {
      console.error(err);
      toast.error('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.warning('กรุณากรอกรหัสผ่านใหม่ให้ครบถ้วน');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }
    if (newPassword.length < 6) {
      toast.warning('รหัสผ่านควรมีความยาวไม่ต่ำกว่า 6 ตัวอักษร');
      return;
    }

    toast.success('เปลี่ยนรหัสผ่านผู้ดูแลระบบเรียบร้อยแล้ว (จำลอง)');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="border-b border-gray-200">
        <nav className="flex">
          {['general', 'store', 'notifications', 'security'].map((tab) => (
            <button
              key={tab}
              type="button"
              className={`px-6 py-4 font-semibold text-sm transition-colors ${
                activeTab === tab 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'general' && 'ทั่วไป'}
              {tab === 'store' && 'ร้านค้า'}
              {tab === 'notifications' && 'การแจ้งเตือน'}
              {tab === 'security' && 'ความปลอดภัย'}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab !== 'security' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ชื่อเว็บไซต์</label>
                  <input
                    type="text"
                    name="siteName"
                    value={settings.siteName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">คำอธิบายเว็บไซต์</label>
                  <textarea
                    name="siteDescription"
                    value={settings.siteDescription}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">อีเมลติดต่อ</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    name="contactPhone"
                    value={settings.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ที่อยู่ร้าน</label>
                  <textarea
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">เวลาเปิด</label>
                    <input
                      type="time"
                      name="openTime"
                      value={settings.openTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">เวลาปิด</label>
                    <input
                      type="time"
                      name="closeTime"
                      value={settings.closeTime}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="enableReviews"
                    name="enableReviews"
                    checked={settings.enableReviews}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="enableReviews" className="text-sm font-medium text-gray-700 cursor-pointer">
                    เปิดใช้งานรีวิวและการให้คะแนนสินค้า
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="enableCoupons"
                    name="enableCoupons"
                    checked={settings.enableCoupons}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="enableCoupons" className="text-sm font-medium text-gray-700 cursor-pointer">
                    เปิดใช้งานคูปองส่วนลดโปรโมชัน
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notificationEmail"
                    name="notificationEmail"
                    checked={settings.notificationEmail}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="notificationEmail" className="text-sm font-medium text-gray-700 cursor-pointer">
                    ส่งอีเมลแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่เข้ามา
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notificationSms"
                    name="notificationSms"
                    checked={settings.notificationSms}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="notificationSms" className="text-sm font-medium text-gray-700 cursor-pointer">
                    ส่ง SMS แจ้งเตือนสถานะไปยังเบอร์โทรศัพท์ร้าน
                  </label>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="bg-[#8C6E63] hover:bg-[#6b584b] text-white font-semibold px-6 py-2.5 rounded-lg shadow transition-colors"
              >
                บันทึกการตั้งค่า
              </button>
            </div>
          </form>
        ) : (
          /* Security Tab is separate to support dynamic actions */
          <div className="space-y-6">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">เปลี่ยนรหัสผ่านผู้ดูแลระบบ</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">รหัสผ่านใหม่</label>
                  <input
                    type="password"
                    placeholder="รหัสผ่านใหม่"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ยืนยันรหัสผ่านใหม่</label>
                  <input
                    type="password"
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-sm transition-colors text-sm"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </form>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-2">การยืนยันตัวตนสองชั้น (2-Factor Authentication)</h3>
              <p className="text-sm text-gray-500 mb-4">เพิ่มระดับความปลอดภัยในการเข้าถึงแดชบอร์ดจัดการระบบร้านค้าด้วยรหัส OTP</p>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enable2fa"
                  name="enable2fa"
                  checked={settings.enable2fa}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSettings(prev => ({ ...prev, enable2fa: checked }));
                    localStorage.setItem('somaricha_admin_settings', JSON.stringify({ ...settings, enable2fa: checked }));
                    toast.success(checked ? 'เปิดใช้งานระบบ 2FA เรียบร้อยแล้ว (จำลอง)' : 'ปิดใช้งานระบบ 2FA เรียบร้อยแล้ว');
                  }}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="enable2fa" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  เปิดใช้งานการยืนยันตัวตน 2FA
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;