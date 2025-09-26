import React from 'react'
import TopImage from '../../components/shared/web/Topimag'
import ProductSlider from '../../components/shared/web/ProductSlider'
import { MdBusinessCenter, } from "react-icons/md";
import { AiOutlineCalendar } from "react-icons/ai";
import { IoPerson } from "react-icons/io5";
import { GoGoal } from "react-icons/go";
import InformationBox from "../../components/shared/web/InformationBox";


const Aboutme = () => {
  return (
    <div>
      <>
        <TopImage
          backgroundUrl="/assets/images/tea3.png"
          circleImageUrl="/assets/SomariChawhite.png"
        />
        <InformationBox
      thaiTitle="เกี่ยวกับเรา"
      engTitle="About Us"
      description="แบรนด์เครื่องดื่มชาผลไม้ที่รักสุขภาพของผู้ดื่ม"
      items={[
        { icon: MdBusinessCenter, title: "ชื่อทางการค้า", detail: "Somari cha (โซมาริชา)" },
        { icon: AiOutlineCalendar, title: "ก่อตั้งเมื่อปี", detail: "ค.ศ. 2025" },
        { icon: IoPerson, title: "ก่อตั้งโดย", detail: "mr.Sommai Supawong" },
        { icon: GoGoal, title: "เป้าหมาย", detail: "มอบความสุขและสุขภาพที่ดีให้ผู้ดื่ม" },
      ]}
    />

        <ProductSlider />
      </>
    </div>
  )
}

export default Aboutme
