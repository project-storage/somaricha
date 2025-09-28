import React from 'react'
import TopImage from '../../components/shared/web/Topimag'
import Question from '../../components/shared/web/Question'

const FAQ = () => {
  return (
    <>
        <TopImage
          backgroundUrl="/assets/images/branch.png"
          circleImageUrl="/assets/SomariChawhite.png"
        />
<Question
  thaiTitle="คำถามที่พบบ่อย"
  engTitle="Most Questions"
  description="รวมคำถามยอดฮิตและคำตอบสำหรับคุณ"
  qas={[
    { question: "สมัครสมาชิกอย่างไร?", answer: "กดปุ่มสมัครที่เมนูด้านบน" },
    { question: "มีค่าบริการหรือไม่?", answer: "สามารถใช้งานฟรี" },
    { question: "ติดต่อเจ้าหน้าที่ได้อย่างไร?", answer: "โทร 1234 ได้ตลอดเวลา" },
  ]}
/>

      </>
  )
}

export default FAQ
