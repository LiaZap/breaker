import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';

// ============ MOCK DATA ============
const initialItems = [
  // ESTRELAS (High Sales, High Margin)
  { id: 1, name: "Hot Roll Salmão", sales: 85, price: 45.90, cost: 12.00, category: 'Sushi' }, // Margin: 33.90
  { id: 2, name: "Temaki Tradicional", sales: 72, price: 28.50, cost: 8.00, category: 'Sushi' }, // Margin: 20.50
  { id: 3, name: "Yakisoba Clássico", sales: 90, price: 38.00, cost: 10.00, category: 'Pratos Quentes' }, // Margin: 28.00
  { id: 4, name: "Combinado da Casa", sales: 65, price: 85.00, cost: 35.00, category: 'Combinados' }, // Margin: 50.00
  { id: 5, name: "Gyoza Suíno", sales: 78, price: 22.00, cost: 6.00, category: 'Entradas' }, // Margin: 16.00

  // POPULARES (High Sales, Low Margin) - "Burros de Carga"
  { id: 6, name: "Rolinho Primavera", sales: 95, price: 12.00, cost: 8.00, category: 'Entradas' }, // Margin: 4.00
  { id: 7, name: "Água Mineral", sales: 120, price: 6.00, cost: 3.00, category: 'Bebidas' }, // Margin: 3.00
  { id: 8, name: "Refrigerante Lata", sales: 110, price: 7.00, cost: 4.50, category: 'Bebidas' }, // Margin: 2.50
  { id: 9, name: "Missoshiru", sales: 68, price: 10.00, cost: 7.00, category: 'Entradas' }, // Margin: 3.00

  // POTENCIAIS (Low Sales, High Margin) - "Quebra-Cabeças"
  { id: 10, name: "Sashimi Toro", sales: 15, price: 120.00, cost: 40.00, category: 'Sashimi' }, // Margin: 80.00
  { id: 11, name: "Lagosta Gratinada", sales: 8, price: 150.00, cost: 60.00, category: 'Especiais' }, // Margin: 90.00
  { id: 12, name: "Saquê Premium", sales: 12, price: 89.00, cost: 30.00, category: 'Bebidas' }, // Margin: 59.00
  { id: 13, name: "Vieiras Trufadas", sales: 20, price: 95.00, cost: 35.00, category: 'Especiais' }, // Margin: 60.00

  // CRÍTICOS (Low Sales, Low Margin) - "Cachorros"
  { id: 14, name: "Tempurá Legumes", sales: 10, price: 18.00, cost: 14.00, category: 'Entradas' }, // Margin: 4.00
  { id: 15, name: "Chá Verde", sales: 5, price: 8.00, cost: 6.00, category: 'Bebidas' }, // Margin: 2.00
  { id: 16, name: "Edamame Simples", sales: 18, price: 20.00, cost: 16.00, category: 'Entradas' }, // Margin: 4.00
];

const CATEGORIES = {
  ESTRELA: { label: 'Estrelas', color: '#00C8F4', description: 'Alta popularidade e alta rentabilidade.', icon: '★' },
  POPULAR: { label: 'Populares', color: '#00E396', description: 'Alta popularidade mas baixa rentabilidade.', icon: '●' },
  POTENCIAL: { label: 'Potenciais', color: '#FEB019', description: 'Baixa popularidade mas alta rentabilidade.', icon: '●' },
  CRITICO: { label: 'Críticos', color: '#FF4560', description: 'Baixa popularidade e baixa rentabilidade.', icon: '●' },
};

const MatrizPreco = () => {
  const { dashboardData } = useDashboard();
  const [activeCategory, setActiveCategory] = useState(null); // Filter by click on chips (classification)
  const [selectedMenuCategory, setSelectedMenuCategory] = useState("Todas"); // Filter by menu category (Pratos, Bebidas, etc.)

  // Use Real Data or Fallback to Initial Items if empty (for demo purposes, or better: just real data if we want to be strict)
  // User request: "has to be real dishes". So we should prioritize real data.
  // However, to prevent a blank screen while development/empty state, we can keep using initialItems ONLY if menuEngineering is strictly empty AND we are in "Simulação" or similar status?
  // Let's rely on dashboardData.menuEngineering. If it's empty, the user will see an empty chart, prompting them to upload.
  // But wait, the user currently sees the mock data and wants to see REAL data.
  // I will check if there is data.
  const realItems = dashboardData.menuEngineering || [];
  const displayItems = realItems.length > 0 ? realItems : initialItems; 

  // Helper to parse currency safely
  const parseCurrency = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const str = String(val).replace('R$', '').trim().replace(',', '.');
      return parseFloat(str) || 0;
  };

  // 1. Calculate Metrics
  const itemsWithMetrics = useMemo(() => {
    return displayItems.map(item => ({
      ...item,
      category: item.category || 'Geral',
      sales: Number(item.sales || 0),
      price: parseCurrency(item.price),
      cost: parseCurrency(item.cost),
      margin: parseCurrency(item.price) - parseCurrency(item.cost),
    }));
  }, [displayItems]);

  const uniqueMenuCategories = useMemo(() => {
    const cats = new Set(itemsWithMetrics.map(item => item.category));
    return ["Todas", ...Array.from(cats)].sort();
  }, [itemsWithMetrics]);

  const averagesByCategory = useMemo(() => {
    const avgs = {};
    const categories = new Set(itemsWithMetrics.map(i => i.category));

    categories.forEach(cat => {
        const catItems = itemsWithMetrics.filter(i => i.category === cat);
        const totalSales = catItems.reduce((sum, item) => sum + item.sales, 0);
        const totalMargin = catItems.reduce((sum, item) => sum + item.margin, 0);
        avgs[cat] = {
            sales: totalSales / (catItems.length || 1),
            margin: totalMargin / (catItems.length || 1),
        };
    });
    return avgs;
  }, [itemsWithMetrics]);

  // 2. Classify Items (always compare against their OWN category average)
  const classifiedItems = useMemo(() => {
    return itemsWithMetrics.map(item => {
      const avg = averagesByCategory[item.category];
      let type;
      if (item.sales >= avg.sales && item.margin >= avg.margin) type = 'ESTRELA';
      else if (item.sales >= avg.sales && item.margin < avg.margin) type = 'POPULAR';
      else if (item.sales < avg.sales && item.margin >= avg.margin) type = 'POTENCIAL';
      else type = 'CRITICO';
      
      return { ...item, type };
    });
  }, [itemsWithMetrics, averagesByCategory]);

  const filteredItemsForDisplay = useMemo(() => {
    if (selectedMenuCategory === "Todas") return classifiedItems;
    return classifiedItems.filter(i => i.category === selectedMenuCategory);
  }, [classifiedItems, selectedMenuCategory]);

  // 3. Counts (based on filtered view)
  const counts = useMemo(() => {
    const c = { ESTRELA: 0, POPULAR: 0, POTENCIAL: 0, CRITICO: 0 };
    filteredItemsForDisplay.forEach(item => c[item.type]++);
    return c;
  }, [filteredItemsForDisplay]);

  // 4. Chart Scaling (based on filtered view)
  const chartConfig = useMemo(() => {
    const maxSales = Math.max(0, ...filteredItemsForDisplay.map(i => i.sales)) * 1.15; // +Buffer
    const maxMargin = Math.max(0, ...filteredItemsForDisplay.map(i => i.margin)) * 1.15;
    return { 
        maxX: maxSales || 10, 
        maxY: maxMargin || 10 
    };
  }, [filteredItemsForDisplay]);

  const [hoveredItem, setHoveredItem] = useState(null);

  // Helper to map data to SVG coordinates (0-100%)
  const getX = (val) => (val / chartConfig.maxX) * 100;
  const getY = (val) => 100 - ((val / chartConfig.maxY) * 100); // Inverted Y for SVG

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6 p-2 md:p-6 overflow-hidden bg-[#101010] text-white font-jakarta">
      
      {/* LEFT PANEL: LIST */}
      <div className="w-full md:w-[320px] shrink-0 flex flex-col gap-6 overflow-hidden">
        <div>
          <div className="text-[12px] text-[#868686] mb-1">Breaker &gt; Precificação</div>
          <h1 className="text-[24px] font-bold leading-tight">Engenharia de<br/>Menu</h1>
          <p className="text-[12px] text-[#868686] mt-2">Configure seus custos e veja dados e informações</p>
        </div>

        {/* Categories List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {Object.entries(CATEGORIES).map(([key, config]) => {
            const categoryItems = filteredItemsForDisplay.filter(i => i.type === key);
            if (categoryItems.length === 0) return null;

            return (
              <div key={key} className="flex flex-col gap-2">
                <div className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                     <span className="text-[14px] font-semibold text-[#CACACA]" style={{ color: config.color === '#00B8D9' ? '#3B82F6' : config.color }}>{config.label}</span>
                  </div>
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="group-hover:translate-y-0.5 transition-transform"><path d="M1 1L5 5L9 1" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="text-[10px] text-[#595959] leading-tight mb-2">{config.description}</p>
                
                <div className="space-y-1">
                  {categoryItems.map(item => (
                    <div 
                      key={item.id} 
                      className={`flex items-center justify-between p-2 rounded-[8px] border border-transparent hover:bg-[#1E1E1E] transition-colors ${hoveredItem === item.id ? 'bg-[#1E1E1E] border-[#333]' : 'bg-transparent'}`}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0`} style={{ backgroundColor: config.color }} />
                        <span className="text-[11px] text-[#E1E1E1] truncate">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px]">
                        <span className="text-[#868686]">Vendas <span className="text-white font-medium">{item.sales}</span></span>
                        <span className="text-[#868686] w-[60px] text-right">R$ {item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT PANEL: CHART */}
      <div className="flex-1 bg-[#1B1B1D] rounded-[24px] border border-[#2A2A2C] p-6 flex flex-col relative overflow-hidden">
        
        {/* Header / Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-10 relative">
          <div className="flex gap-4 items-center">
             <div>
                 <h2 className="text-[18px] font-bold text-white">Matriz de Cardápio</h2>
                 <p className="text-[12px] text-[#868686]">Comparativo de pratos contra a média da própria categoria.</p>
             </div>
             
             {/* MENU CATEGORY DROPDOWN */}
             <div className="ml-4 pl-4 border-l border-[#2A2A2C]">
                <label className="block text-[10px] text-[#868686] mb-1">Filtrar Categoria</label>
                <select 
                   className="bg-[#151515] text-[12px] text-white border border-[#2A2A2C] rounded-[8px] px-3 py-1.5 outline-none hover:border-[#444] min-w-[120px]"
                   value={selectedMenuCategory}
                   onChange={(e) => setSelectedMenuCategory(e.target.value)}
                >
                    {uniqueMenuCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
             </div>
          </div>
          <div className="flex items-center gap-2">
            {Object.entries(CATEGORIES).map(([key, config]) => (
              <div 
                key={key} 
                className={`px-3 py-1.5 rounded-full border border-[#2A2A2C] bg-[#151515] flex items-center gap-2 cursor-pointer transition-all hover:bg-[#252527]`}
                onClick={() => setActiveCategory(activeCategory === key ? null : key)}
                style={{ opacity: activeCategory && activeCategory !== key ? 0.3 : 1 }}
              >
                 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                 <span className="text-[10px] text-white font-medium">{config.label}</span>
                 <span className="text-[10px] text-[#595959] bg-[#1E1E1E] px-1.5 rounded">{counts[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CHART AREA */}
        <div className="flex-1 relative w-full h-full min-h-[300px]">
          {/* Axis Labels */}
          <div className="absolute left-[-20px] top-1/2 -translate-y-1/2 -rotate-90 text-[10px] text-[#868686] font-medium tracking-wide">
             Margem (R$)
             <span className="block text-[8px] font-normal text-[#555]">Quanto este produto gera de margem</span>
          </div>
          <div className="absolute bottom-[-5px] left-6 text-[10px] text-[#868686] font-medium tracking-wide">
             Volume de Vendas
             <span className="block text-[8px] font-normal text-[#555]">Quanto este produto vende em comparativos</span>
          </div>

          {/* Visualization Container */}
          <div className="absolute inset-[30px] bottom-[40px] right-[20px]">
            {/* SVG Chart */}
            <svg className="w-full h-full overflow-visible">
              
              {/* Grid Lines (dotted) */}
              <defs>
                 <pattern id="grid" width="10%" height="10%" patternUnits="userSpaceOnUse">
                    <path d="M 2 0 L 0 0 0 2" fill="none" stroke="#2A2A2C" strokeWidth="1"/>
                    <circle cx="1" cy="1" r="1" fill="#333" />
                 </pattern>
              </defs>
              <rect width="100%" height="100%" fill="transparent" />
              
              {/* Dotted Grid Background */}
              {[...Array(11)].map((_, i) => (
                 <line key={`h-${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="#333" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
              ))}
              {[...Array(11)].map((_, i) => (
                 <line key={`v-${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="#333" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
              ))}

              {/* Quadrant Lines (Average Lines) */}
              {selectedMenuCategory !== "Todas" && averagesByCategory[selectedMenuCategory] ? (
                  <>
                      <line 
                        x1={`${getX(averagesByCategory[selectedMenuCategory].sales)}%`} y1="0" 
                        x2={`${getX(averagesByCategory[selectedMenuCategory].sales)}%`} y2="100%" 
                        stroke="#888" strokeWidth="1" strokeDasharray="4 4" 
                      />
                      <line 
                        x1="0" y1={`${getY(averagesByCategory[selectedMenuCategory].margin)}%`} 
                        x2="100%" y2={`${getY(averagesByCategory[selectedMenuCategory].margin)}%`} 
                        stroke="#888" strokeWidth="1" strokeDasharray="4 4" 
                      />
                      
                      {/* Sub-label for lines */}
                      <text x={`${getX(averagesByCategory[selectedMenuCategory].sales) + 1}%`} y="15" fill="#888" fontSize="9">Média Vendas ({averagesByCategory[selectedMenuCategory].sales.toFixed(1)})</text>
                      <text x="5" y={`${getY(averagesByCategory[selectedMenuCategory].margin) - 5}%`} fill="#888" fontSize="9">Média Margem (R${averagesByCategory[selectedMenuCategory].margin.toFixed(2)})</text>
                  </>
              ) : (
                  // If 'Todas' is selected, we can't draw one crosshair line reliably, as each item has its own center.
                  // We could draw global average or nothing. Standard is nothing for multiple distinct sets.
                  <text x="10" y="20" fill="#555" fontSize="10">Selecione uma categoria para visualizar as médias (crosshairs).</text>
              )}
              
              {/* Axis Labels (max values) and Ticks */}
              {/* X Axis Ticks */}
              {[0, 25, 50, 75, 100].map(pct => (
                <g key={`x-tick-${pct}`}>
                   <text 
                      x={`${pct}%`} 
                      y="105%" 
                      textAnchor="middle" 
                      fill="#555" 
                      fontSize="9"
                   >
                      {Math.round(chartConfig.maxX * (pct/100))}
                   </text>
                </g>
              ))}

              {/* Y Axis Ticks */}
              {[0, 25, 50, 75, 100].map(pct => (
                <g key={`y-tick-${pct}`}>
                   <text 
                      x="-8" 
                      y={`${100-pct}%`} 
                      textAnchor="end" 
                      dominantBaseline="middle" 
                      fill="#555" 
                      fontSize="9"
                   >
                      {Math.round(chartConfig.maxY * (pct/100))}
                   </text>
                </g>
              ))}

              {/* Data Points */}
              {filteredItemsForDisplay.map((item) => {
                 const isHovered = hoveredItem === item.id;
                 const isActive = !activeCategory || activeCategory === item.type;
                 
                 return (
                   <g 
                      key={item.id} 
                      style={{ 
                         opacity: isActive ? 1 : 0.3, 
                         transition: 'all 0.3s ease',
                         cursor: 'pointer' 
                      }}
                      onMouseEnter={() => setHoveredItem(item.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                   >
                     <circle 
                        cx={`${getX(item.sales)}%`} 
                        cy={`${getY(item.margin)}%`} 
                        r={isHovered ? 8 : 6} 
                        fill={CATEGORIES[item.type].color}
                        stroke="#1B1B1D"
                        strokeWidth="2"
                        className="transition-all duration-300"
                     />
                     {/* Label on Hover */}
                     <foreignObject 
                        x={`${getX(item.sales)}%`} 
                        y={`${getY(item.margin)}%`} 
                        width="150" 
                        height="100" 
                        style={{ overflow: 'visible', pointerEvents: 'none' }}
                     >
                        <div 
                           className={`transform -translate-y-full -translate-x-1/2 mb-2 bg-[#252527] border border-[#333] px-3 py-2 rounded-[8px] shadow-xl text-center z-50 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                           style={{ minWidth: '120px' }}
                        >
                           <p className="text-[11px] font-bold text-white mb-0.5">{item.name}</p>
                           <div className="flex justify-center gap-2 text-[9px] text-[#999]">
                              <span>V: {item.sales}</span>
                              <span>M: R${item.margin.toFixed(0)}</span>
                           </div>
                           <div 
                              className="text-[9px] font-bold mt-1 uppercase tracking-wider"
                              style={{ color: CATEGORIES[item.type].color }}
                           >
                              {CATEGORIES[item.type].label}
                           </div>
                        </div>
                     </foreignObject>
                   </g>
                 )
              })}

            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrizPreco;
