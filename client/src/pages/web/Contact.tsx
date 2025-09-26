import React from 'react'
import TopImage from '../../components/shared/web/Topimag'
import { FaPhone, FaEnvelope, FaMapMarkerAlt,FaFacebook,FaInstagram,FaTiktok } from "react-icons/fa";
import InformationBox from "../../components/shared/web/InformationBox";
import InformationBoxwhite from "../../components/shared/web/InformationBoxwhite";
import ContactLocation from './../../components/shared/web/ContactLocation';
import CenterImage from '../../components/shared/web/CenterImag';

const Contact = () => {
  return (
    <>
      <TopImage
        backgroundUrl="/assets/images/tea1.png"
        circleImageUrl="/assets/SomariChawhite.png"
      />
     <InformationBox
      thaiTitle="ติดต่อเรา"
      engTitle="Contact Us"
      description="สามารถติดต่อเราผ่านช่องทางต่างๆ ได้ที่นี่"
      items={[
        { icon: FaPhone, title: "โทรศัพท์", detail: "012-345-6789" },
        { icon: FaEnvelope, title: "อีเมล", detail: "info@mail.com" },
        { icon: FaMapMarkerAlt, title: "ที่อยู่", detail: "กรุงเทพฯ" },
      ]}
    />
     <InformationBoxwhite
      thaiTitle="ติดตามข่าวสาร"
      engTitle="Follow Us"
      description="สามารถติดตามข่าวสารของเราผ่านช่องทางต่างๆ ได้ที่นี่"
      items={[
        { icon: FaFacebook, title: "Facebook", detail: "Somarichaofficial" },
        { icon: FaInstagram, title: "Instagram", detail: "Somarichaofficial" },
        { icon: FaTiktok, title: "TikTok", detail: "@Somarichaofficial" },
      ]}
    />
    <CenterImage
      backgroundUrl="/assets/images/tea2.png"
    />
    <ContactLocation />


    </>
  )
}

export default Contact
