import React from 'react'
// import Navbar from "../components/shared/Navbar";
// import Footer from "../components/shared/Footer";
import Topaboutme from "../components/shared/Topaboutme";
import ProductSlider from "../components/shared/ProductSlider";
import News from "../components/shared/News";
import ContactLocation from "../components/shared/ContactLocation"; 
import '../components/styles/custom.scss';

const HomePage = () => {
  return (
    <>
      <Topaboutme/>
      <ProductSlider />
      <main>{/* Your main content goes here */}</main>
      <News/>
      <ContactLocation/>
    </>
  )
}

export default HomePage
