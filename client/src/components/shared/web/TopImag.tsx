import React from "react";

interface TopImageProps {
  backgroundUrl: string;
  circleImageUrl?: string;
}

const TopImage: React.FC<TopImageProps> = ({ backgroundUrl, circleImageUrl }) => {
  return (
    <div
      className="relative w-full h-[250px] sm:h-[490px] flex items-center justify-center transition-all duration-300"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-[200px] h-[200px] sm:w-[330px] sm:h-[330px] rounded-full bg-black shadow-2xl flex items-center justify-center overflow-hidden 
                   transition-all duration-500 ease-in-out hover:scale-105"
      >
        {circleImageUrl && (
          <img
            src={circleImageUrl}
            alt="circle"
            className="w-full h-full object-contain p-4 sm:p-6"
          />
        )}
      </div>
    </div>
  );
};

export default TopImage;
