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

const InformationBoxwhite: React.FC<InformationBoxProps> = ({
    thaiTitle,
    engTitle,
    description,
    items,
}) => {
    return (
        <>

            <div className="w-full py-12 px-6 bg-white flex flex-col items-center">
                {/* ส่วนหัวข้อ */}
                <div className="text-center mb-8">
                    <h1 className="text-[40px] font-bold">
                        <span className="text-black mr-4">{thaiTitle}</span>
                        <span className="text-black">{engTitle}</span>
                    </h1>
                    <p className="text-black font-semi-bold text-[18px] mt-4">{description}</p>
                </div>

                {/* ส่วนการ์ด icon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 place-items-center w-full max-w-6xl">
                    {items.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="flex flex-col items-center text-center">
                                {/* วงกลม icon */}
                                <div className="w-[90px] h-[90px] rounded-full bg-black flex items-center justify-center shadow-lg mb-4">
                                    <Icon className="w-[50px] h-[50px] text-white" />
                                </div>

                                {/* หัวข้อ */}
                                <h2 className="text-[32px] text-black font-semibold mb-2">
                                    {item.title}
                                </h2>

                                {/* ข้อมูล */}
                                <p className="text-[20px] text-black">{item.detail}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

        </>
    );
};

export default InformationBoxwhite;
