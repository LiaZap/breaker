import React, { useState } from 'react';

const FinanceOverview = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const history = data.history || [];
  const currentMonthIndex = new Date().getMonth();
  
  // Helper to format currency
  const formatVal = (val) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Determine what to show
  // If hovering, show hovered data (optional, maybe just tooltip). 
  // User asked: "passar o mouse saber ... ou clicar saber".
  // Let's stick to: Click updates the main view. Hover shows tooltip.
  
  const activeIndex = selectedMonth !== null ? selectedMonth : history.findIndex(h => h > 0 && formatVal(h) === data.total);
  // Fallback: if data.total logic is complex, just use data.total/data.month as default unless selectedMonth is set.

  const displayValue = selectedMonth !== null ? formatVal(history[selectedMonth]) : data.total;
  
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const displayMonth = selectedMonth !== null ? monthNames[selectedMonth] : data.month;

  return (
    <div className="flex flex-col w-full bg-[#101010] rounded-[16px]">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-semibold text-[14px] text-[#CACACA]">Faturamento</span>
          <p className="font-normal text-[10px] text-[#595959]">Visão Geral dos Índices Financeiros</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="flex items-center gap-1.5 px-2 py-1 bg-[#1F1F1F] rounded-full border border-[#2F2F2F]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FD8989]" />
              <span className="text-[10px] font-medium text-[#CACACA]">{data.risk.label}</span>
           </div>
           <span className="text-[10px] font-semibold text-white">{data.risk.count}</span>
           <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="-rotate-45 text-[#959387]">
              <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
      </div>

      {/* Bar Chart - Daily History (30 Days) */}
      <div className="h-[60px] flex items-end justify-between gap-[3px] w-full mb-4 px-1 relative">
        {(() => {
            // Parse Total Revenue for simulation
            const numericTotal = parseFloat(data.total.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
            const daysInMonth = 30; // Visual fixo de 30 dias
            const today = new Date().getDate(); // Dia atual (1-31)
            
            // Average based on elapsed days to match total
            // If today is 1st, all revenue is on 1st.
            const dailyAvg = today > 0 ? numericTotal / today : 0;

            // Generate deterministic pseudo-random data based on index and total
            const dailyData = Array.from({ length: daysInMonth }, (_, i) => {
               const day = i + 1;
               if (day > today) return 0; // Future days are empty

               // Last day (today) might be slightly lower or higher? Randomize.
               // Pseudo-random factor
               const factor = 1 + Math.sin(i * 0.8) * 0.5 + Math.cos(i * 0.3) * 0.3;
               return Math.max(dailyAvg * factor, dailyAvg * 0.1); 
            });

            const maxVal = Math.max(...dailyData, 1); 
            
            return dailyData.map((val, i) => {
              const isToday = i === (today - 1);
              const isFuture = i > (today - 1);
              const isSelected = selectedMonth === i;

              // Determine Color
              // Priority: Selected -> Today -> Past (White) -> Future (Dark)
              let bgColor = 'bg-[#333]'; // Default/Future
              if (isSelected) bgColor = 'bg-[#FF9406]';
              else if (isToday) bgColor = 'bg-[#FF9406]'; // Today is Orange
              else if (val > 0) bgColor = 'bg-[#E1E1E1]'; // Past with data

              // Determine Opacity
              // Future: 0.2
              // Today: 1
              // Past: 0.7 normally, 1 if hovered/selected
              let opacity = 0.3;
              if (isFuture) opacity = 0.2;
              else if (isSelected || isToday || hoveredMonth === i) opacity = 1;
              else opacity = 0.6;

              return (
              <div 
                key={i}
                className="group relative flex flex-col items-center justify-end h-full flex-1"
                onMouseEnter={() => setHoveredMonth(i)}
                onMouseLeave={() => setHoveredMonth(null)}
                onClick={() => setSelectedMonth(i)}
              >
                 {/* Tooltip on Hover */}
                 <AnimateTooltip show={hoveredMonth === i} value={val} label={isToday ? 'Hoje' : `Dia ${i + 1}`} />

                <div 
                  className={`w-full max-w-[4px] rounded-[2px] transition-all duration-300 cursor-pointer ${bgColor} hover:bg-[#FF9406]`}
                  style={{ 
                      height: isFuture ? '4px' : `${Math.max((val / maxVal) * 100, 10)}%`, 
                      opacity: opacity
                  }}
                />
              </div>
            )});
        })()}
      </div>

      {/* Value & Badge Row */}
      <div className="flex items-end justify-between mb-1">
         {/* Value */}
         <div className="flex items-baseline gap-1">
           <span className="text-[24px] font-bold text-[#FF9406]">R$</span>
           <span className="text-[24px] font-bold text-[#E1E1E1]">{displayValue}</span>
         </div>

         {/* Badge & Status */}
         <div className="flex flex-col items-end">
            <div className="px-2 py-0.5 rounded-[6px] bg-[#E2FD89]/10 border border-[#E2FD89]/20 mb-1">
               <span className="text-[10px] font-semibold text-[#E2FD89]">Aumentou {data.change}</span>
            </div>
            <div className="flex items-center gap-1 opacity-60">
               <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#E1E1E1" strokeWidth="2"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
               <span className="text-[9px] text-[#E1E1E1]">{data.status}</span>
            </div>
         </div>
      </div>

      {/* Date Label */}
      <div className="text-[10px] text-[#595959] mb-4">
         Faturado em <strong className="text-[#959387]">{displayMonth}</strong>
      </div>

      {/* Bottom Sub-Cards (Custos & Margem) */}
      <div className="grid grid-cols-2 gap-3">
        {data.cards && data.cards.map((card, index) => (
           <div key={index} className="bg-[#151515] border border-[#262626] rounded-[14px] p-3 flex flex-col gap-3 group hover:border-[#333] transition-colors">
              <div className="flex items-start justify-between">
                 <div className="w-8 h-8 rounded-full bg-[#1F1F1F] flex items-center justify-center border border-[#2F2F2F]">
                    {card.icon === 'wallet' ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                    ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#868686" strokeWidth="1.5"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                    )}
                 </div>
                 <div className={`px-2 py-0.5 rounded-full border ${card.status === 'neutral' ? 'bg-[#E2FD89]/5 border-[#E2FD89]/20 text-[#E2FD89]' : 'bg-[#FD8989]/5 border-[#FD8989]/20 text-[#FD8989]'}`}>
                    <span className="text-[10px] font-bold">{card.percentage}</span>
                 </div>
              </div>
              <div>
                 <div className="text-[14px] font-bold text-[#E1E1E1] mb-0.5">{card.value}</div>
                 <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#595959] font-medium">{card.label}</span>
                    <div className="w-3 h-3 rounded-full bg-[#262626] flex items-center justify-center text-[8px] text-[#595959] font-bold">?</div>
                 </div>
              </div>
           </div>
        ))}
      </div>

    </div>
  );
};

export default FinanceOverview;

const AnimateTooltip = ({ show, value, label }) => {
  if (!show) return null;
  return (
    <div className="absolute bottom-full mb-2 bg-[#1F1F1F] border border-[#2F2F2F] px-2 py-1 rounded-[6px] flex flex-col items-center pointer-events-none z-10 whitespace-nowrap shadow-xl">
        <span className="text-[8px] text-[#888] mb-px">{label}</span>
        <span className="text-[10px] font-bold text-[#E1E1E1]">
            R$ {value ? value.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
        </span>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1F1F1F] border-r border-b border-[#2F2F2F] rotate-45 transform -mt-1" />
    </div>
  );
};
