import React from 'react';

const MoneyOnTable = ({ data }) => {
  return (
    <div className="bg-[#1B1B1D] rounded-[16px] p-3 h-full flex flex-col justify-between relative overflow-hidden group min-h-0">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-2 shrink-0">
        <div>
          <h3 className="font-semibold text-[14px] text-[#E1E1E1] mb-1">
            Dinheiro na mesa
          </h3>
          <p className="font-normal text-[11px] text-[#868686]">
            O quanto está escapando hoje por decisões operacionais
          </p>
        </div>
        <div className="w-[32px] h-[32px] bg-white/5 rounded-[8px] flex items-center justify-center border border-white/5 shrink-0">
           <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.0833 1.75H2.91667C2.27233 1.75 1.75 2.27233 1.75 2.91667V11.0833C1.75 11.7277 2.27233 12.25 2.91667 12.25H11.0833C11.7277 12.25 12.25 11.7277 12.25 11.0833V2.91667C12.25 2.27233 11.7277 1.75 11.0833 1.75Z" stroke="#868686" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1.75 6.41666H12.25" stroke="#868686" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.83333 12.25V1.75" stroke="#868686" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Main Value */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-[16px] text-[#FF9406]">R$</span>
          <span className="font-semibold text-[24px] text-white tracking-tight">{data.total}</span>
        </div>
        <div className="shrink-0">
          <svg width="53" height="24" viewBox="0 0 53 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52.5094" height="24" rx="8" fill="#FD8989" fillOpacity="0.15"/>
            <path d="M10.368 15V14.176L11.984 12.488C12.304 12.152 12.5493 11.8853 12.72 11.688C12.896 11.4853 13.0187 11.312 13.088 11.168C13.1573 11.024 13.192 10.8773 13.192 10.728C13.192 10.4773 13.112 10.28 12.952 10.136C12.7973 9.992 12.5973 9.92 12.352 9.92C12.096 9.92 11.8747 9.99467 11.688 10.144C11.5013 10.288 11.3653 10.5013 11.28 10.784L10.328 10.488C10.392 10.1733 10.5227 9.90133 10.72 9.672C10.9173 9.43733 11.1573 9.25867 11.44 9.136C11.728 9.008 12.032 8.944 12.352 8.944C12.736 8.944 13.072 9.01333 13.36 9.152C13.6533 9.29067 13.88 9.48533 14.04 9.736C14.2053 9.98667 14.288 10.28 14.288 10.616C14.288 10.8293 14.248 11.04 14.168 11.248C14.088 11.456 13.968 11.6693 13.808 11.888C13.648 12.1013 13.44 12.3413 13.184 12.608L11.784 14.08H14.368V15H10.368ZM17.6054 15.096C17.1308 15.096 16.7148 14.968 16.3574 14.712C16.0001 14.456 15.7201 14.096 15.5174 13.632C15.3201 13.168 15.2214 12.6293 15.2214 12.016C15.2214 11.3973 15.3201 10.8587 15.5174 10.4C15.7148 9.94133 15.9921 9.584 16.3494 9.328C16.7068 9.072 17.1228 8.944 17.5974 8.944C18.0828 8.944 18.5014 9.072 18.8534 9.328C19.2108 9.584 19.4908 9.944 19.6934 10.408C19.8961 10.8667 19.9974 11.4027 19.9974 12.016C19.9974 12.6293 19.8961 13.168 19.6934 13.632C19.4961 14.0907 19.2188 14.4507 18.8614 14.712C18.5041 14.968 18.0854 15.096 17.6054 15.096ZM17.6134 14.104C17.8854 14.104 18.1174 14.0213 18.3094 13.856C18.5014 13.6853 18.6481 13.4453 18.7494 13.136C18.8561 12.8213 18.9094 12.448 18.9094 12.016C18.9094 11.584 18.8561 11.2133 18.7494 10.904C18.6481 10.5893 18.4988 10.3493 18.3014 10.184C18.1094 10.0187 17.8748 9.936 17.5974 9.936C17.3308 9.936 17.1014 10.0187 16.9094 10.184C16.7174 10.3493 16.5681 10.5893 16.4614 10.904C16.3601 11.2133 16.3094 11.584 16.3094 12.016C16.3094 12.4427 16.3601 12.8133 16.4614 13.128C16.5681 13.4373 16.7174 13.6773 16.9094 13.848C17.1068 14.0187 17.3414 14.104 17.6134 14.104ZM21.6615 15L26.4935 9.04H27.6135L22.7815 15H21.6615ZM22.5975 12.064C22.2988 12.064 22.0295 11.9947 21.7895 11.856C21.5548 11.712 21.3682 11.5227 21.2295 11.288C21.0908 11.0533 21.0215 10.792 21.0215 10.504C21.0215 10.216 21.0908 9.95467 21.2295 9.72C21.3682 9.48 21.5548 9.29067 21.7895 9.152C22.0295 9.01333 22.2988 8.944 22.5975 8.944C22.8908 8.944 23.1548 9.01333 23.3895 9.152C23.6242 9.29067 23.8108 9.48 23.9495 9.72C24.0882 9.95467 24.1575 10.216 24.1575 10.504C24.1575 10.792 24.0882 11.0533 23.9495 11.288C23.8108 11.5227 23.6242 11.712 23.3895 11.856C23.1548 11.9947 22.8908 12.064 22.5975 12.064ZM22.5895 11.256C22.7495 11.256 22.8828 11.2213 22.9895 11.152C23.0962 11.0773 23.1762 10.984 23.2295 10.872C23.2882 10.7547 23.3175 10.632 23.3175 10.504C23.3175 10.3707 23.2882 10.248 23.2295 10.136C23.1762 10.024 23.0962 9.93067 22.9895 9.856C22.8828 9.78133 22.7495 9.744 22.5895 9.744C22.4402 9.744 22.3095 9.78133 22.1975 9.856C22.0908 9.93067 22.0082 10.0267 21.9495 10.144C21.8908 10.256 21.8615 10.376 21.8615 10.504C21.8615 10.6267 21.8908 10.7467 21.9495 10.864C22.0082 10.9813 22.0908 11.0773 22.1975 11.152C22.3095 11.2213 22.4402 11.256 22.5895 11.256ZM26.6535 15.096C26.3602 15.096 26.0935 15.0267 25.8535 14.888C25.6188 14.744 25.4322 14.5547 25.2935 14.32C25.1548 14.0853 25.0855 13.824 25.0855 13.536C25.0855 13.248 25.1548 12.9867 25.2935 12.752C25.4322 12.512 25.6188 12.3227 25.8535 12.184C26.0935 12.0453 26.3602 11.976 26.6535 11.976C26.9522 11.976 27.2188 12.0453 27.4535 12.184C27.6882 12.3227 27.8748 12.512 28.0135 12.752C28.1522 12.9867 28.2215 13.248 28.2215 13.536C28.2215 13.824 28.1522 14.0853 28.0135 14.32C27.8748 14.5547 27.6882 14.744 27.4535 14.888C27.2188 15.0267 26.9522 15.096 26.6535 15.096ZM26.6535 14.288C26.8082 14.288 26.9388 14.2533 27.0455 14.184C27.1575 14.1093 27.2402 14.016 27.2935 13.904C27.3522 13.7867 27.3815 13.664 27.3815 13.536C27.3815 13.4027 27.3522 13.28 27.2935 13.168C27.2402 13.056 27.1575 12.9627 27.0455 12.888C26.9388 12.8133 26.8082 12.776 26.6535 12.776C26.5042 12.776 26.3735 12.8133 26.2615 12.888C26.1548 12.9627 26.0722 13.0587 26.0135 13.176C25.9548 13.288 25.9255 13.408 25.9255 13.536C25.9255 13.6587 25.9548 13.7787 26.0135 13.896C26.0722 14.0133 26.1548 14.1093 26.2615 14.184C26.3735 14.2533 26.5042 14.288 26.6535 14.288Z" fill="#FD8989"/>
            <rect x="37" y="10.2968" width="7.50943" height="3.40634" rx="1.70317" fill="#FD8989"/>
            <rect x="35.2968" y="8.59364" width="10.9158" height="6.81269" rx="3.40634" stroke="#FD8989" strokeOpacity="0.19" strokeWidth="3.40634"/>
          </svg>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-[6px] bg-[#2A2A2C] rounded-full mb-5 overflow-hidden">
        <div className="w-[65%] h-full bg-[#FF9406] rounded-full" />
      </div>

      {/* Details Row */}
      <div className="relative flex items-center justify-between mb-2 flex-1 min-h-0">
        <div>
           <div className="flex flex-col">
             <span className="font-medium text-[13px] text-[#C4C4C4] mb-0.5">R$ {data.lost}</span>
             <span className="font-normal text-[10px] text-[#595959]">Dinheiro na Mesa</span>
           </div>
        </div>

        {/* Arrow Circle */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[28px] h-[28px] rounded-full flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
             <path d="M2.08334 5H7.91668" stroke="#C4C4C4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M5.41666 2.5L7.91666 5L5.41666 7.5" stroke="#C4C4C4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="text-right">
           <div className="flex flex-col items-end">
             <span className="font-medium text-[13px] text-[#C4C4C4] mb-0.5">R$ {data.recovered}</span>
             <span className="font-normal text-[10px] text-[#595959]">Dinheiro Recuperado</span>
           </div>
        </div>
      </div>

      {/* Insight Section */}
      <div className="flex gap-3 mt-auto pt-6">
        <div className="w-[28px] h-[28px] shrink-0 bg-[#1E1E1E] rounded-full flex items-center justify-center border border-[#333]">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
             <path d="M8 21H16M12 17V21M6 4H18C19.1046 4 20 4.89543 20 6V9C20 9.88331 19.3877 10.6139 18.5284 10.8924C17.7533 13.9113 15.0217 16.0353 12 15.9994C8.97869 15.9635 6.25203 13.8404 5.47164 10.8236C4.61232 10.5451 4 9.81449 4 8.93103V6C4 4.89543 4.89543 4 6 4Z" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M10 8L12 10L14 8" stroke="#777" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-[#A3A3A3] leading-normal">

            <span className="font-bold text-[#E1E1E1]">Taxas iFood acima do saudável: </span>
            Taxa média estimada: 42% em parte do mix, pode ser necessário criar um cardápio diferente para delivery
          </p>
        </div>
      </div>

    </div>
  );
};

export default MoneyOnTable;
