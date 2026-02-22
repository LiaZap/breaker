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
        <div className="shrink-0 flex items-center justify-center bg-[#FD8989]/15 rounded-md px-2.5 h-[24px]">
           <span className="text-[#FD8989] text-[10px] font-bold">
               {data.percentage}
           </span>
        </div>
      </div>

      {/* Progress Bar */}
      {/* Calculate how much of the potential profit (ideal) they actually recovered */}
      <div className="w-full h-[6px] bg-[#2A2A2C] rounded-full mb-5 overflow-hidden">
        <div 
            className="h-full bg-[#FF9406] rounded-full transition-all duration-1000" 
            style={{ width: `${Math.max(0, Math.min(100, (data.currentMargin / data.idealMargin) * 100))}%` }}
        />
      </div>

      {/* Details Row */}
      <div className="relative flex items-center justify-between mb-2 flex-1 min-h-0">
        <div>
           <div className="flex flex-col">
             <span className="font-medium text-[13px] text-[#C4C4C4] mb-0.5">R$ {data.lost}</span>
             <span className="font-normal text-[10px] text-[#595959]">Deixando na Mesa</span>
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
             <span className="font-normal text-[10px] text-[#595959]">Sendo Recuperado</span>
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
            {data.currentMargin < data.idealMargin ? (
                <>
                    <span className="font-bold text-[#FF9406]">Margem abaixo do ideal ({data.idealMargin}%): </span>
                    Sua margem atual é de {Math.round(data.currentMargin)}%. Foque em revisar o CMV nas Fichas Técnicas e renegociar taxas para estancar a perda.
                </>
            ) : (
                <>
                    <span className="font-bold text-[#E2FD89]">Margem Saudável: </span>
                    Sua operação está retendo bem o lucro. Foque em crescimento de vendas!
                </>
            )}
          </p>
        </div>
      </div>

    </div>
  );
};

export default MoneyOnTable;
