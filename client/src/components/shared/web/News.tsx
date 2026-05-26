import React from "react";
const new1 = "/assets/News/news1.png";
const new2 = "/assets/News/news2.png";
const new3 = "/assets/News/news3.png";

const News: React.FC = () => {
  const newsImages = [new1, new2, new3];

  return (
    <>
    <div style={{ padding: "20px", backgroundColor: "#D6C0B3" }}></div>
      <div className="py-10 bg-[#8C6E63] mb-10 h-auto pb-16 px-6">
        {/* หัวข้อ */}
        <div className="flex justify-center items-center mb-10 gap-6 text-white text-center">
          <h1 className="text-3xl sm:text-[40px] font-bold">ข่าวสาร</h1>
          <h1 className="text-3xl sm:text-[40px] font-bold text-gray-200">News</h1>
        </div>

        {/* รูปข่าว */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mb-6 max-w-6xl mx-auto w-full">
          {newsImages.map((img, index) => (
            <div
              key={index}
              className="overflow-hidden shadow-lg rounded-2xl transform transition duration-300 hover:scale-105 hover:shadow-2xl w-full max-w-[419px]"
            >
              <img
                src={img}
                alt={`news-${index}`}
                className="w-full aspect-[419/313] object-cover rounded-2xl"
              />
            </div>
          ))}
        </div>

        {/* ปุ่มอ่านเพิ่มเติมตรงกลาง */}
        <div className="flex justify-center mt-10">
          <button className="round-btn w-[190px] text-lg">
            Read More
          </button>
        </div>
      </div>

 {/* สี่เหลี่ยมเอียง 4.35° */}
<div
  className="-mt-[75px]"
  style={{
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    background: "#D6C0B3",
    height: "200px",
    width: "120vw",
    position: "relative",
    left: "-10vw",
    transform: "rotate(4.35deg) translateY(-20px)",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", // ✅ เงา
  }}
/>

{/* สี่เหลี่ยมเอียง -4.35° */}
<div
  className="-mt-20"
  style={{
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    background: "#FFF2DF",
    height: "200px",
    width: "120vw",
    position: "relative",
    left: "-10vw",
    transform: "rotate(-4.35deg) translateY(-20px)",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)", // ✅ เงา
  }}
/>


    </>
  );
};

export default News;
