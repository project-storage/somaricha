import React from "react";
import { FaFacebook, FaGlobe, FaMapMarkerAlt } from "react-icons/fa";

const ContactLocation = () => {
  return (
    <div className="py-10 mb-10">
      {/* หัวข้อ */}
      <div className="flex justify-center items-center mb-4 gap-6 text-black">
        <h1 className="text-[55px] font-bold">สถานที่ติดต่อ</h1>
        <h1 className="text-[55px] font-bold">Contact Location</h1>
      </div>

      <h3 className="text-[28px] font-bold text-center mb-8">
        สามารถติดต่อเราได้ที่
      </h3>

      <div className="flex justify-center gap-10 flex-wrap">
        {/* ฝั่งซ้าย - แผนที่ */}
        <div
          className="border-[10px] border-[#8C6E63] rounded-lg overflow-hidden"
          style={{ width: "548px", height: "530px" }}
        >
          <iframe
            title="Contact Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.4321603002663!2d100.0253923!3d13.8386439!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2e5267c8ff173%3A0xad38808cf8120641!2z4Lih4Lib4Liy4Lil4LiZ4LmJ4Liq4LilIOC4leC4suC4quC4o-C5jOC4reC5gOC4guC4uOC5jOC4geC4quC4oeC4mQ!5e0!3m2!1sth!2sth!4v1694500000000!5m2!1sth!2sth"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* ฝั่งขวา - ข้อมูลติดต่อ */}
        <div className="max-w-[500px] flex flex-col gap-6 text-[20px]">
          <div>
            <h4 className="font-bold mb-2">📍 ที่อยู่ (ภาษาไทย)</h4>
            <p>
              สาขาวิชาวิศวกรรมซอฟต์แวร์ คณะวิทยาศาสตร์และเทคโนโลยี
              <br />
              มหาวิทยาลัยราชภัฏนครปฐม
              <br />
              85 ถนนมาลัยแมน อำเภอเมือง จังหวัดนครปฐม 73000
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2">📍 Address (English)</h4>
            <p>
              Software Engineering Program, Faculty of Science and Technology,
              Nakhon Pathom Rajabhat University
              <br />
              85 Malaiman Rd., Mueang District, Nakhon Pathom 73000, Thailand
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-2 text-black">🌐 เว็บไซต์และโซเชียล</h4>
            <div className="flex items-center gap-4">
              <a
                href="https://pgm.npru.ac.th/se/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:underline"
              >
                <FaGlobe size={24} />
                https://pgm.npru.ac.th/se/
              </a>
            </div>
            <div className="flex items-center gap-4 text-black">
              <a
                href="https://web.facebook.com/softwarenpru"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-700 hover:underline"
              >
                <FaFacebook size={24} />
                https://web.facebook.com/softwarenpru
              </a>
            </div>
          </div>

          <div className="mt-4 text-black">
            <a
              href="https://www.google.com/maps/place/%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%8A%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%81%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8B%E0%B8%AD%E0%B8%9F%E0%B8%95%E0%B9%8C%E0%B9%81%E0%B8%A7%E0%B8%A3%E0%B9%8C+%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%A7%E0%B8%B4%E0%B8%97%E0%B8%A2%E0%B8%B2%E0%B8%A5%E0%B8%B1%E0%B8%A2%E0%B8%A3%E0%B8%B2%E0%B8%8A%E0%B8%A0%E0%B8%B1%E0%B8%8F%E0%B8%99%E0%B8%84%E0%B8%A3%E0%B8%9B%E0%B8%90%E0%B8%A1/@13.8386439,100.0253923,423m"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 flex items-center gap-2"
            >
              <FaMapMarkerAlt size={20} />
            Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactLocation;
