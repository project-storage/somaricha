import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import { toast } from "react-toastify";

interface UserProfile {
  id: number;
  username: string;
  user_name: string;
  user_lastname: string;
  email: string;
  phone?: string;
  created_at: string;
}

const Profile: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    }
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      setProfile(response.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8C6E63]"></div>
      </div>
    );
  }

  if (!isLoggedIn || !profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Please log in to view your profile</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#D6C0B3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-[#8C6E63] mb-8 text-center">Profile Information</h1>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                    {profile.username}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                    {profile.email}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="user_name"
                    value={formData.user_name || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                    {profile.user_name}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="user_lastname"
                    value={formData.user_lastname || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                    required
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                    {profile.user_lastname}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6E63] focus:border-transparent"
                  />
                ) : (
                  <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                    {profile.phone || "Not provided"}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2">Member Since</label>
                <div className="w-full px-4 py-2 bg-gray-100 rounded-lg">
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-center">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(profile);
                    }}
                    className="mr-4 px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg hover:bg-[#6b584b] transition-colors"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-[#8C6E63] text-white rounded-lg hover:bg-[#6b584b] transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;