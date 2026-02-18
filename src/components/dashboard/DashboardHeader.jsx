import React from 'react';

const DashboardHeader = ({ data }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4 md:mb-8 py-2 md:py-[14px] gap-y-3">
      {/* Left - Restaurant Info */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-[6px]">
            <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-[#344036] flex items-center justify-center">
               <div className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-full border border-white/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <span className="font-semibold text-[13px] md:text-[14px] text-[#959387]">{data.restaurant.name}</span>
                 <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="#595959" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </div>
              <div className="font-medium text-[10px] text-white/35">{data.restaurant.category}</div>
            </div>
          </div>
        </div>

      </div>

      {/* Right - User Profile */}
      <div className="flex items-center gap-4 md:gap-8">

        <div className="flex items-center gap-3 md:gap-4 border-l border-[#333] pl-3 md:pl-6">
          <div className="flex items-center gap-[8px]">
            <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-[#FDD688] flex items-center justify-center overflow-hidden">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}&background=FDD688&color=000`} alt={data.user.initials} className="w-full h-full object-cover" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-medium text-[12px] text-[#CACACA]">{data.user.name}</span>
              <span className="font-medium text-[9px] text-[#A0A0A0]">{data.user.role}</span>
            </div>
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#959387" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardHeader;
