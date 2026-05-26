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
        <h1 className="text-[40px] font-bold text-black">
          {thaiTitle} <span className="ml-2">{engTitle}</span>
        </h1>
        <p className="text-[20px] font-bold text-black mt-2">{description}</p>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white w-full max-w-[288px] h-[55px] rounded-[25px] shadow-md px-4 mb-10 border border-gray-100">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 bg-transparent outline-none text-gray-700"
        />
      </div>

      {/* Branch cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 w-full max-w-6xl justify-items-center px-4">
        {branches.map((branch, idx) => (
          <div
            key={idx}
            className="w-full max-w-[350px] h-auto min-h-[300px] pb-6 bg-white rounded-[25px] shadow-[10px_28px_39.1px_rgba(0,0,0,0.15)] flex flex-col items-center p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <img
              src={branch.image}
              alt={branch.name}
              className="w-full max-w-[300px] h-[175px] aspect-[300/175] rounded-[15px] object-cover mb-4"
            />

            {/* Branch Name */}
            <h2 className="text-[20px] font-bold text-black mb-3 text-center">
              {branch.name}
            </h2>

            {/* Address + Time */}
            <div className="flex items-center justify-between w-full px-4 sm:px-6 mt-auto">
              <div className="flex items-center font-semibold text-gray-600 text-[14px]">
                <FaMapMarkerAlt className="text-black mr-2 shrink-0" />
                <span className="truncate">{branch.address}</span>
              </div>
              <p className="text-gray-500 font-semibold text-[14px] shrink-0">{branch.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button className="w-[230px] h-[50px] bg-[#8C6E63] text-white text-[16px] font-semibold rounded-[30px] shadow-md hover:opacity-90 transition">
        ค้นหาสาขาใกล้คุณ
      </button>
    </div>
  );
};

export default Branch;
