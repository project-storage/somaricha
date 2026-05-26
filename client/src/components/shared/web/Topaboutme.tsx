
const Videopresent = "/assets/VideoCha.mp4"
const Chapeach = "/assets/Chapeach.png"
const Imagepage = "/assets/Imagepage.png"

const Topaboutme = () => {
  return (
    <>
      {/* วิดีโอด้านบน */}
      {/* วิดีโอด้านบน */}
      <div className="relative w-full overflow-hidden">
        {/* วิดีโอ */}
        <video
          src={Videopresent}
          autoPlay
          loop
          muted
          style={{ width: "100%", height: "auto" }}
        />

        {/* รูป Chapeach ซ้อนบนวิดีโอ - Responsive width and top offsets */}
        <img
          src={Chapeach}
          alt="Chapeach"
          className="absolute left-1/2 transform -translate-x-1/2 w-[55%] max-w-[584px] top-[15%] sm:top-[25%] md:top-[30%] lg:top-[35%] transition-transform duration-300 hover:scale-110"
          style={{
            height: "auto",
          }}
        />
      </div>


      {/* Section เกี่ยวกับเรา - Responsive height with paddings */}
      <div
        className='flex flex-col justify-center items-center text-white text-center py-12 sm:py-20 px-6 sm:px-12'
        style={{ backgroundColor: "#8C6E63", margin: 0 ,boxShadow: "0px 13px 19px 0px rgba(0,0,0,0.25)",}}
      >
        {/* หัวข้อ - Responsive text sizes */}
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 gap-2 sm:gap-6">
          <h1 className="text-[28px] sm:text-[40px] font-bold">เกี่ยวกับเรา</h1>
          <h1 className="text-[24px] sm:text-[40px] font-bold text-gray-200 sm:text-white">About us</h1>
        </div>


        {/* คำอธิบาย - Responsive text size and padding */}
        <p className='text-[16px] sm:text-[22px] max-w-3xl mx-auto leading-relaxed'>
          Somari cha เป็นแบรนด์เครื่องดื่มชาผลไม้ที่ได้รับความนิยมและเสียงตอบรับที่ดีมาก
          เนื่องจากเป็นเครื่องดื่มที่มีรสชาติอร่อยและไม่ทำให้เสียสุขภาพ
          เพราะเครื่องดื่มของเราทำมาจากชาแท้ ผลไม้สดที่มีคุณภาพ
          และเพิ่มความหวานด้วยหญ้าหวานญี่ปุ่น
          เพื่อตอบโจทย์คนที่รักสุขภาพในปัจจุบัน เราจึงทำเครื่องดื่มนี้ออกมาให้ดื่ม
        </p>

        {/* ปุ่ม */}
        <div className='mt-8'>
          <button className="round-btn w-[160px] sm:w-[190px] text-base sm:text-lg">About us</button>
        </div>
      </div>

      <div className="relative w-full">
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
