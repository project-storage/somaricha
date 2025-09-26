import React from "react";

interface TopImageProps {
  backgroundUrl: string;
}

const CenterImage: React.FC<TopImageProps> = ({ backgroundUrl }) => {
  return (
    <div
      className="relative w-full h-[347px] flex items-center justify-center"
      style={{ backgroundImage: `url(${backgroundUrl})`, backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0px 13px 19px 0px rgba(0,0,0,0.25)" }}
    >
     
    

     
      </div>
  );
};

export default CenterImage;
