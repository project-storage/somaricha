import React from 'react'
import TopImage from '../../components/shared/web/Topimag'
import BranchMe from '../../components/shared/web/Branch';

const Branch = () => {
  return (
    <>
        <TopImage
          backgroundUrl="/assets/images/branch.png"
          circleImageUrl="/assets/SomariChawhite.png"
        />
        <BranchMe
  thaiTitle="สาขาของเรา"
  engTitle="Our Branches"
  description="คุณสามารถค้นหาสาขาใกล้คุณได้ที่นี่"
  branches={[
    {
      image: "/assets/images/branch.png",
      name: "สาขา ราชบุรี",
      address: "Big C ราชบุรี",
      time: "8:00 - 18:00",
    },
    {
      image: "/assets/images/branch.png",
      name: "สาขา กรุงเทพฯ",
      address: "Central World",
      time: "9:00 - 21:00",
    },
    {
      image: "/assets/images/branch.png",
      name: "สาขา เชียงใหม่",
      address: "Maya Mall",
      time: "10:00 - 20:00",
    },
  ]}
/>

      </>
  )
}

export default Branch
