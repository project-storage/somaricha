import React from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

interface BranchCardProps {
  image: string;
  name: string;
  address: string;
  time: string;
}

interface BranchProps {
  thaiTitle: string;
  engTitle: string;
  description: string;
  branches: BranchCardProps[];
}

const Branch: React.FC<BranchProps> = ({
  thaiTitle,
  engTitle,
  description,
  branches,
}) => {
  return (
    <div className="w-full flex flex-col items-center py-12 px-6 bg-[#F9F9F9]">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[55px] font-bold text-black">
          {thaiTitle} <span className="ml-2">{engTitle}</span>
        </h1>
        <p className="text-[28px] text-black mt-2">{description}</p>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white w-[288px] h-[55px] rounded-[25px] shadow-md px-4 mb-10">
        <FaSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-gray-700"
        />
      </div>

      {/* Branch cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        {branches.map((branch, idx) => (
          <div
            key={idx}
            className="w-[419px] h-[426px] bg-white rounded-[25px] shadow-[10px_28px_39.1px_rgba(0,0,0,0.25)] flex flex-col items-center p-6"
          >
            {/* Image */}
            <img
              src={branch.image}
              alt={branch.name}
              className="w-[364px] h-[225px] rounded-[15px] object-cover mb-4"
            />

            {/* Branch Name */}
            <h2 className="text-[28px] font-semibold text-black mb-3 text-center">
              {branch.name}
            </h2>

            {/* Address + Time */}
            <div className="flex items-center justify-between w-full px-10">
              <div className="flex items-center text-gray-700 text-[18px]">
                <FaMapMarkerAlt className="text-black mr-2" />
                <span>{branch.address}</span>
              </div>
              <p className="text-gray-600 text-[18px]">{branch.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button className="w-[319px] h-[64px] bg-[#8C6E63] text-white text-[22px] font-semibold rounded-[30px] shadow-md hover:opacity-90 transition">
        ค้นหาสาขาใกล้คุณ
      </button>
    </div>
  );
};

export default Branch;
