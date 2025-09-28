import React from "react";

interface TopImageProps {
  backgroundUrl: string;
  circleImageUrl?: string;
}

const TopImage: React.FC<TopImageProps> = ({ backgroundUrl, circleImageUrl }) => {
  return (
    <div
      className="relative w-full h-[490px] flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="w-[330px] h-[330px] rounded-full bg-black shadow-2xl flex items-center justify-center overflow-hidden 
                   transition-transform duration-500 ease-in-out hover:scale-105 "
      >
        {circleImageUrl && (
          <img
            src={circleImageUrl}
            alt="circle"
            className="w-full h-full object-contain "
          />
        )}
      </div>
    </div>
  );
};

export default TopImage;
