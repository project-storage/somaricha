import React from 'react'
// import Navbar from "../components/shared/Navbar";
// import Footer from "../components/shared/Footer";
import Topaboutme from "../../components/shared/web/Topaboutme";
import ProductSlider from "../../components/shared/web/ProductSlider";
import News from "../../components/shared/web/News";
import ContactLocation from "../../components/shared/web/ContactLocation"; 

const HomePage = () => {
  return (
    <>
      <Topaboutme/>
      <ProductSlider />
      <News/>
      <ContactLocation/>
    </>
  )
}

export default HomePage
