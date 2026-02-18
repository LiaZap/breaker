import React from 'react';

const DashboardTips = ({ data }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4">
      {data.map((tip, idx) => (
        <div key={idx} className="flex items-center gap-3 flex-1 p-3 bg-[#1E1E1E] rounded-[10px]">
          <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center ${tip.bg}`}>
            <span className="text-[14px]">{tip.icon}</span>
          </div>
          <div>
            <span className="font-semibold text-[10px] text-[#CACACA]">{tip.title}</span>
            <span className="font-normal text-[10px] text-[#7E7E7E]"> {tip.text}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardTips;
