import React, { createContext, useState, useContext } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  // Initial Mock Data (Fallback)
  const initialData = {
    restaurant: { name: "Seu Restaurante", category: "Gastronomia" },
    user: { name: "Usuário", role: "Proprietário da Conta", initials: "U" },
    period: { date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }), status: "Simulação", statusColor: "#FDD789" },
    overview: { subtitle: "Complete o onboarding para ver seus dados reais.", tags: [] },
    revenue: { total: "0,00", month: "-", status: "Neutral", change: "0%", risk: { label: "-", count: "-" }, cards: [] },
    breakEven: { percentage: 0, current: "0", min: "0", max: "0", base: { value: "0", status: "-", range: "-" } },
    marketComparison: [],
    // FIXED: Moved static data from FichaTecnica to here for global state management
    operational: {
      fichas: [],
      insumos: [],
      categories: {
          insumos: ['Proteínas', 'Grãos', 'Vinhos', 'Molhos', 'Legumes', 'Temperos', 'Óleos', 'Laticínios', 'Outros'],
          fichas: ['Prato Principal', 'Entrada', 'Sobremesa', 'Bebida', 'Acompanhamento', 'Insumo Preparado']
      }
    },
    menuEngineering: [],
    cards: {
        moneyOnTable: { total: "0", lost: "0", recovered: "0", percentage: "0%" },
        technicalSheets: [],
        costStructure: { total: "0", percentage: "0%", breakdown: [] }
    },
    tips: []
  };

  const [dashboardData, setDashboardData] = useState(initialData);

  // Load Client Data if Hash exists
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');

    if (hash) {
      // Fetch from Backend API
      fetch(`/api/client/${hash}`)
        .then(res => {
          if (!res.ok) throw new Error('Client not found');
          return res.json();
        })
        .then(data => {
          setDashboardData(prev => ({ ...prev, ...data }));
        })
        .catch(err => {
          console.error("Failed to load client data from API", err);
          // Fallback to LocalStorage could be kept here if offline support is needed, 
          // but for now we strictly switch to Backend.
        });
    }
  }, []);

  // Helper to parse "R$ 1.234,56" -> 1234.56
  const parseCurrency = (value) => {
    if (!value) return 0;
    if (typeof value === 'number') return value;
    return parseFloat(value.replace(/[R$\s.]/g, '').replace(',', '.')) || 0;
  };

  // Helper to format 1234.56 -> "1.234,56"
  const formatMoney = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const updateDashboardData = (newData) => {
    console.log("Updating Dashboard with:", newData);

    // Determines if it is Form Data (flat object) or Partial Update (nested object)
    // If it has 'operational', assume it's a direct state update
    // Determines if it is Form Data (flat object) or Partial Update (nested object)
    // If it has 'operational' OR 'menuEngineering', assume it's a direct state update
    if (newData.operational || newData.menuEngineering || newData.tips) {
         setDashboardData(prev => {
             const updated = { ...prev, ...newData };
             // Persist to Backend
             const params = new URLSearchParams(window.location.search);
             const hash = params.get('hash');
             if (hash) {
                 fetch(`/api/client/${hash}/sync`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify(updated)
                 }).catch(e => console.error("Sync failed", e));
             }
             return updated;
         });
         return;
    }

    // Default: It is FORM DATA from Onboarding
    const formData = newData;

    // ... (Calculations remain exactly the same) ...
    // 1. DATA EXTRACTION & CALCULATIONS
    
    // Revenue (Smart Search: Closest to Current Month, then Annual History)
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const currentMonthIndex = new Date().getMonth(); // 0 = Jan, 11 = Dec
    
    let currentRevenue = 0;
    let currentMonthStr = "";
    
    // 1. Build Revenue History & Total
    const revenueHistory = months.map(m => {
        const key = `revenue_${m}`;
        const rawValue = formData.revenue ? formData.revenue[key] : formData[key];
        return parseCurrency(rawValue);
    });
    
    const totalAnnualRevenue = revenueHistory.reduce((acc, val) => acc + val, 0);

    // 2. Find "Current" Revenue (Prioritize current month -> past months -> wrap around to end of year)
    // Search Order: [Current, Current-1, ..., Jan, Dec, Dec-1, ..., Current+1]
    // Actually, usually we just want the latest filled month up to today.
    // If we are in Feb, we check Feb, then Jan. We shouldn't check Dec unless we want to show last year's data. 
    // But since the form is "Last 12 Months", Dec is likely relevant.
    // Let's search from Current Index downwards to 0, then 11 downwards to Current Index + 1.
    
    const currentYear = new Date().getFullYear();
    const searchOrder = [
        ...Array.from({ length: currentMonthIndex + 1 }, (_, i) => currentMonthIndex - i), // Current down to 0
        ...Array.from({ length: 11 - currentMonthIndex }, (_, i) => 11 - i) // 11 down to Current+1
    ];

    for (let idx of searchOrder) {
        if (revenueHistory[idx] > 0) {
            currentRevenue = revenueHistory[idx];
            currentMonthStr = new Date(currentYear, idx, 1).toLocaleString('pt-BR', { month: 'long' });
            currentMonthStr = currentMonthStr.charAt(0).toUpperCase() + currentMonthStr.slice(1);
            break;
        }
    }
    
    // If still 0, default to first found or 0
    if (currentRevenue === 0 && totalAnnualRevenue > 0) {
        // Fallback: just find the first non-zero
        const firstNonZeroIdx = revenueHistory.findIndex(v => v > 0);
        if (firstNonZeroIdx !== -1) {
             currentRevenue = revenueHistory[firstNonZeroIdx];
             currentMonthStr = new Date(currentYear, firstNonZeroIdx, 1).toLocaleString('pt-BR', { month: 'long' });
             currentMonthStr = currentMonthStr.charAt(0).toUpperCase() + currentMonthStr.slice(1);
        }
    }

    // Fixed Costs
    let fixedCosts = 0;
    const addCost = (val) => fixedCosts += parseCurrency(val);
    const addPeriodCost = (field) => {
        if (!formData[field]) return;
        let amount = parseCurrency(formData[field].amount);
        if (formData[field].period === 'Anual') amount /= 12;
        fixedCosts += amount;
    };

    addCost(formData.rent);
    addCost(formData.security);
    addPeriodCost('iptu');
    addPeriodCost('insurance');
    addPeriodCost('permits');
    
    // Composite Fixed Costs
    const sumComposite = (parentId, fields) => {
        if (!formData[parentId]) return;
        fields.forEach(f => addCost(formData[parentId][f]));
    };
    sumComposite('utilities', ['energy', 'water', 'gas', 'internet']);
    sumComposite('supplies', ['cleaning', 'kitchen_oil', 'maintenance']);
    sumComposite('admin_costs', ['accounting', 'software', 'mei_das']);
    sumComposite('marketing', ['ifood', 'agency', 'ads']); 

    // Personnel Costs (Fixed)
    let personnelCosts = 0;
    // Partners
    if (formData.partners && Array.isArray(formData.partners)) {
        formData.partners.forEach(p => personnelCosts += parseCurrency(p.salary));
    }
    // Employees
    if (formData.employees && Array.isArray(formData.employees)) {
        formData.employees.forEach(e => personnelCosts += parseCurrency(e.salary));
    }
    
    const totalFixedCosts = fixedCosts + personnelCosts;

    // Variable Costs (CMV)
    const variableCosts = parseCurrency(formData.variable_costs);

    // 2. METRICS CALCULATIONS
    
    const totalCosts = totalFixedCosts + variableCosts;
    const profit = currentRevenue - totalCosts;
    const contributionMargin = currentRevenue - variableCosts; // Revenue - Variable
    const marginPercentage = currentRevenue > 0 ? (contributionMargin / currentRevenue) * 100 : 0;
    
    // Break Even Point (Ponto de Equilíbrio)
    const marginDecimal = marginPercentage / 100;
    const breakEvenValue = marginDecimal > 0 ? totalFixedCosts / marginDecimal : 0;
    const breakEvenPercentage = currentRevenue > 0 ? (breakEvenValue / currentRevenue) * 100 : 0;

    // 3. CONSTRUCT DASHBOARD OBJECT
    const newDashboardData = {
        ...initialData,
        formData: formData, // Persist raw form data for re-editing
        operational: dashboardData.operational || initialData.operational, 
        restaurant: { 
            name: formData?.user_info?.restaurant_name || "Seu Restaurante", 
            category: formData.tax_regime || "Gastronomia" 
        },
        user: {
            ...initialData.user,
            name: formData?.user_info?.user_name || "Usuário",
            initials: (formData?.user_info?.user_name || "U").substring(0, 2).toUpperCase() 
        },
        period: {
            date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: profit >= 0 ? "Lucrativo" : "Prejuízo",
            statusColor: profit >= 0 ? "#E2FD89" : "#FF4560"
        },
        revenue: {
            total: formatMoney(currentRevenue),
            month: currentMonthStr || "Mês Atual",
            history: revenueHistory, // Array of 12 numbers
            annualTotal: formatMoney(totalAnnualRevenue),
            status: profit >= 0 ? "Positivo" : "Alerta",
            change: "0%", 
            risk: { label: "Estável", count: "-" },
            cards: [
                {
                    label: "Custos Fixos Totais",
                    value: `R$ ${formatMoney(totalFixedCosts)}`,
                    percentage: currentRevenue > 0 ? Math.round((totalFixedCosts / currentRevenue) * 100) + "%" : "0%",
                    status: "neutral",
                    icon: "wallet"
                },
                {
                    label: "Custos Variáveis (CMV)",
                    value: `R$ ${formatMoney(variableCosts)}`,
                    percentage: currentRevenue > 0 ? Math.round((variableCosts / currentRevenue) * 100) + "%" : "0%",
                    status: "neutral",
                    icon: "pie"
                }
            ]
        },
        breakEven: {
            percentage: Math.min(Math.round(breakEvenPercentage), 100),
            current: formatMoney(breakEvenValue),
            min: "0",
            max: formatMoney(currentRevenue * 1.5), 
            base: {
                value: String(Math.round(breakEvenPercentage)),
                status: breakEvenPercentage > 100 ? "Crítico" : (breakEvenPercentage > 80 ? "Atenção" : "Saudável"),
                range: "0 a 70"
            }
        },
        cards: {
            moneyOnTable: {
                total: formatMoney(currentRevenue),
                lost: formatMoney(Math.abs(Math.min(profit, 0))), 
                recovered: formatMoney(Math.max(profit, 0)),      
                percentage: marginPercentage.toFixed(0) + "%"
            },
            technicalSheets: [
                { label: 'CMV Teórico', value: Math.round((variableCosts/currentRevenue)*100) + '%' }, 
                { label: 'Fichas Desatualizadas', value: '0' },
                { label: 'Produtos Sem Ficha', value: '0' },
                { label: 'CMV real', value: Math.round((variableCosts/currentRevenue)*100) + '%' }
            ],
            costStructure: {
                total: formatMoney(totalCosts),
                percentage: currentRevenue > 0 ? Math.round((totalCosts / currentRevenue) * 100) + "%" : "0%",
                breakdown: [
                    { label: 'Pessoal + Sócios', value: `R$ ${formatMoney(personnelCosts)}` },
                    { label: 'Infraestrutura', value: `R$ ${formatMoney(fixedCosts - parseCurrency(formData?.admin_costs?.accounting || 0))}` }, 
                    { label: 'CMV (Insumos)', value: `R$ ${formatMoney(variableCosts)}` },
                    { label: 'Admin e Mkt', value: `R$ ${formatMoney(parseCurrency(formData?.admin_costs?.accounting || 0) + parseCurrency(formData?.marketing?.agency || 0))}` }, 
                ]
            }
        },
        overview: {
            title: "Terra e Mar 360",
            subtitle: "Dados baseados no seu preenchimento de onboarding.",
            tags: [
                { label: 'Faturamento', active: false },
                { label: `Lucro: R$ ${formatMoney(profit)}`, active: true, color: profit >= 0 ? '#E2FD89' : '#FF4560' },
                { label: `Margem: ${marginPercentage.toFixed(0)}%`, active: false }
            ]
        },
        // Keep static Tips & Comparison for now
        marketComparison: initialData.marketComparison,
        tips: initialData.tips
    };

    setDashboardData(newDashboardData);
    
    // Persist full Update to Backend
    const params = new URLSearchParams(window.location.search);
    const hash = params.get('hash');
    if (hash) {
        fetch(`/api/client/${hash}/sync`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDashboardData)
        }).catch(e => console.error("Sync failed", e));
    }
  };

  return (
    <DashboardContext.Provider value={{ dashboardData, updateDashboardData }}>
      {children}
    </DashboardContext.Provider>
  );
};
