import React, { useState } from "react";

interface QAItem {
  question: string;
  answer: string;
}

interface QuestionProps {
  thaiTitle: string;
  engTitle: string;
  description: string;
  qas: QAItem[];
}

const Question: React.FC<QuestionProps> = ({
  thaiTitle,
  engTitle,
  description,
  qas,
}) => {
  const [newQuestion, setNewQuestion] = useState("");

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      alert(`คำถามใหม่ที่ส่งไปคือ: ${newQuestion}`);
      setNewQuestion("");
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-12 px-6 bg-[#F9F9F9]">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-[55px] font-bold text-black">
          {thaiTitle} <span className="ml-2">{engTitle}</span>
        </h1>
        <p className="text-[28px] text-black mt-2">{description}</p>
      </div>

      {/* Q&A Section */}
      <div className="w-full max-w-[1100px] space-y-6 mb-12">
        {qas.map((qa, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            {/* Question */}
            <div className="bg-[#73584F] text-[#FFF2DF] font-bold text-[28px] rounded-[25px] px-5 h-[45px] flex items-center w-fit">
              {qa.question}
            </div>

            {/* Answer */}
            <div className="text-[28px] font-bold text-[#3E2522]">
              {qa.answer}
            </div>
          </div>
        ))}
      </div>

      {/* Add Question */}
      <textarea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        placeholder="เพิ่มคำถาม"
        className="w-[940px] h-[65px] rounded-[25px] border border-gray-300 px-4 py-3 text-[24px] font-bold text-[#3E2522] placeholder-[#B9B9B9] resize-none mb-8"
      />

      {/* Confirm Button */}
      <button
        onClick={handleAddQuestion}
        className="w-[319px] h-[64px] bg-[#8C6E63] text-white text-[22px] font-bold rounded-[30px] shadow-md hover:opacity-90 transition"
      >
        ยืนยัน
      </button>
    </div>
  );
};

export default Question;
    