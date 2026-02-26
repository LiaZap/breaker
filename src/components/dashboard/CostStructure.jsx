import React from 'react';

const CostStructure = ({ data }) => {
  return (
    <div className="bg-[#1B1B1D] border border-[#2F2F31] rounded-[16px] p-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-[14px] text-[#E1E1E1] mb-1">
            Estrutura de custos
          </h3>
          <p className="font-normal text-[11px] text-[#868686]">
            Custos totais da operação
          </p>
        </div>
        <div className="shrink-0">
          <svg width="53" height="24" viewBox="0 0 53 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="52.5094" height="24" rx="8" fill="#E2FD89" fillOpacity="0.15"/>
            <text x="8" y="16" fill="#E2FD89" fontSize="10" fontWeight="bold" fontFamily="sans-serif">{data.percentage}</text>
            <rect x="37" y="10.2968" width="7.50943" height="3.40634" rx="1.70317" fill="#E2FD89"/>
            <rect x="35.2968" y="8.59364" width="10.9158" height="6.81269" rx="3.40634" stroke="#E2FD89" strokeOpacity="0.19" strokeWidth="3.40634"/>
          </svg>
        </div>
      </div>

      {/* Value + Action */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-[16px] text-[#FF9406]">R$</span>
          <span className="font-semibold text-[24px] text-white tracking-tight">{data.total}</span>
        </div>
        <span className="font-medium text-[11px] text-[#959387] flex items-center gap-1">
          Plano de Ação
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.99998 4.5C5.86737 4.5 5.74019 4.44732 5.64643 4.35355C5.55266 4.25979 5.49998 4.13261 5.49998 4C5.49998 3.86739 5.55266 3.74021 5.64643 3.64645C5.74019 3.55268 5.86737 3.5 5.99998 3.5H12C12.1326 3.5 12.2598 3.55268 12.3535 3.64645C12.4473 3.74021 12.5 3.86739 12.5 4V10C12.5 10.1326 12.4473 10.2598 12.3535 10.3536C12.2598 10.4473 12.1326 10.5 12 10.5C11.8674 10.5 11.7402 10.4473 11.6464 10.3536C11.5527 10.2598 11.5 10.1326 11.5 10V5.20667L4.35331 12.3533C4.25853 12.4417 4.13316 12.4897 4.00363 12.4874C3.8741 12.4852 3.75051 12.4327 3.6589 12.3411C3.56729 12.2495 3.51481 12.1259 3.51253 11.9963C3.51024 11.8668 3.55833 11.7414 3.64665 11.6467L10.7933 4.5H5.99998Z" fill="#959387"/>
          </svg>
        </span>
      </div>

      {/* Progress Bar */}
        <div className="w-full h-[6px] bg-[#2A2A2C] rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-[#FD8989] rounded-full" style={{ width: data.percentage }} />
      </div>

      {/* Cost breakdown table */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[10px]">
        {data.breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between">
            <span className="text-[#7E7E7E]">{item.label}</span>
            <span className="text-[#CACACA] font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CostStructure;
