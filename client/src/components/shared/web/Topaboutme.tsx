import React from 'react'

const Videopresent = "/assets/VideoCha.mp4"
const Chapeach = "/assets/Chapeach.png"
const Imagepage = "/assets/Imagepage.png"

const Topaboutme = () => {
  return (
    <>
      {/* วิดีโอด้านบน */}
      <div className="relative w-full">
        {/* วิดีโอ */}
        <video
          src={Videopresent}
          autoPlay
          loop
          muted
          style={{ width: "100%", height: "auto" }}
        />

        {/* รูป Chapeach ซ้อนบนวิดีโอ */}
        <img
          src={Chapeach}
          alt="Chapeach"
          className="absolute left-1/2 transform -translate-x-1/2 transition-transform duration-300 hover:scale-110"
          style={{
            width: 584,
            height: "auto",
            top: "400px" // 👈 ปรับค่าตรงนี้เพื่อขยับขึ้นลงได้ง่าย
          }}
        />
      </div>


      {/* Section เกี่ยวกับเรา */}
      <div
        className='flex flex-col justify-center items-center text-white mt-4 mb-4 text-center'
        style={{ backgroundColor: "#8C6E63", height: 400, margin: 0 ,boxShadow: "0px 13px 19px 0px rgba(0,0,0,0.25)",}}
      >
        {/* รูป Chapeach ตรงกลาง */}


        {/* หัวข้อ */}
        <div className="flex justify-center items-center mb-4 gap-6">
          <h1 className="text-[40px] font-bold">เกี่ยวกับเรา</h1>
          <h1 className="text-[40px] font-bold">About us</h1>
        </div>


        {/* คำอธิบาย */}
        <p className='text-[22px] max-w-3xl mx-auto'>
          Somari cha เป็นแบรนด์เครื่องดื่มชาผลไม้ที่ได้รับความนิยมและเสียงตอบรับที่ดีมาก
          เนื่องจากเป็นเครื่องดื่มที่มีรสชาติอร่อยและไม่ทำให้เสียสุขภาพ
          เพราะเครื่องดื่มของเราทำมาจากชาแท้ ผลไม้สดที่มีคุณภาพ
          และเพิ่มความหวานด้วยหญ้าหวานญี่ปุ่น
          เพื่อตอบโจทย์คนที่รักสุขภาพในปัจจุบัน เราจึงทำเครื่องดื่มนี้ออกมาให้ดื่ม
        </p>

        {/* ปุ่ม */}
        <div className='mt-8'>
          <button className="round-btn" style={{ width: 190 }}>About us</button>
        </div>
      </div>

      <div>
        <img
          src={Imagepage}
          alt="Imagepage"
          className="items-center m-0 p-0"
          style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        height: "auto",
        top: "400px", // 👈 ปรับค่าตรงนี้เพื่อขยับขึ้นลงได้ง่าย
        boxShadow: "0px 13px 19px 0px rgba(0,0,0,0.25)", // shadow y=13, blur=19
          }}
        />
        <div style={{ padding: "20px", backgroundColor: "#D6C0B3" }}></div>
      </div>
    </>
  )
}

export default Topaboutme
