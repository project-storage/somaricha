import React from 'react'
import TopImage from '../../components/shared/web/Topimag'
import ProductsComponent from '../../components/shared/web/Products'

const Menu = () => {
  return (
    <>
      <TopImage
        backgroundUrl="/assets/images/tea4.png"
        circleImageUrl="/assets/SomariChawhite.png"
      />
      <ProductsComponent />
    </>
  )
}

export default Menu

