import React from "react";
import { IconType } from "react-icons";

interface InfoItem {
    icon: IconType; // ใช้ react-icons
    title: string;
    detail: string;
}

interface InformationBoxProps {
    thaiTitle: string;
    engTitle: string;
    description: string;
    items: InfoItem[];
}

const InformationBox: React.FC<InformationBoxProps> = ({
    thaiTitle,
    engTitle,
    description,
    items,
}) => {
    return (
        <>
            <div className="w-full bg-[#8C6E63]">
                <div className="p-[15px] bg-[#D6C0B3] shadow-[10px_27px_39.1px_rgba(0,0,0,0.25)]"></div>
                <div className="flex flex-col items-center p-[40px]">
                    {/* ส่วนหัวข้อ */}
                    <div className="text-center mb-8">
                        <h1 className="text-[40px] font-bold">
                            <span className="text-white mr-4">{thaiTitle}</span>
                            <span className="text-[#FFF2DF]">{engTitle}</span>
                        </h1>
                        <p className="text-white font-semi-bold text-[20px] mt-4">{description}</p>
                    </div>

                    {/* ส่วน card icon */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center w-full max-w-6xl">
                        {items.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div 
                                    key={index} 
                                    className="flex flex-col items-center text-center w-48 min-h-[220px]" // Added min-height for consistency
                                >
                                    {/* วงกลม icon */}
                                    <div className="w-[90px] h-[90px] rounded-full bg-[#3E2522] flex items-center justify-center shadow-lg mb-4">
                                        <Icon className="w-[50px] h-[50px] text-white flex items-center justify-center" />
                                    </div>

                                    {/* หัวข้อ */}
                                    <h2 className="text-[32px] text-[#FFF2DF] font-semibold mb-2 break-words max-w-full text-center">
                                        {item.title}
                                    </h2>

                                    {/* ข้อมูล */}
                                    <p className="text-[20px] text-white break-words max-w-full text-center">
                                        {item.detail}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="p-[15px] bg-[#D6C0B3] shadow-[10px_-27px_39.1px_rgba(0,0,0,0.25)]"></div>
        </>
    );
};

export default InformationBox;
