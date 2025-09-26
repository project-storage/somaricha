import React from 'react'
import TopImage from '../../components/shared/web/Topimag'
import ProductSlider from '../../components/shared/web/ProductSlider'

const Products = () => {
  return (
    <>
      <TopImage
        backgroundUrl="/assets/images/tea4.png"
        circleImageUrl="/assets/SomariChawhite.png"
      />
      <ProductSlider />
    </>
  )
}

export default Products

