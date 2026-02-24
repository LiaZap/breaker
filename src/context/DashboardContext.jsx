/* eslint-disable react-refresh/only-export-components */
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
        technicalSheets: [
            { label: 'CMV real', value: '0%' },
            { label: 'Fichas Desatualizadas', value: '0' },
            { label: 'Produtos Sem Ficha', value: '0' }
        ],
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
          setDashboardData(prev => {
            const merged = { ...prev, ...data };
            // Enforce that technicalSheets uses the new layout scheme even if DB has old 4 items.
            // Since Dashboard computes this dynamically based on operational data, we can reset it.
            if (merged.cards) {
              const dbTs = merged.cards.technicalSheets || [];
              const getVal = (labelMatch) => dbTs.find(t => t.label?.includes(labelMatch))?.value || '0';
              
              merged.cards.technicalSheets = [
                { label: 'CMV real', value: getVal('CMV real') || getVal('CMV Global') },
                { label: 'Fichas Desatualizadas', value: getVal('Desatualizadas') },
                { label: 'Produtos Sem Ficha', value: getVal('Sem Ficha') }
              ];
            }
            return merged;
          });
        })
        .catch(err => {
          console.error("Failed to load client data from API", err);
        });
    }
  }, []);

  // Helper to parse "R$ 1.234,56" -> 1234.56
  const parseCurrency = (value) => {
    if (!value && value !== 0) return 0;
    if (typeof value === 'number') return value;
    let str = String(value).replace(/R\$/g, '').trim();
    if (str.includes(',') && str.includes('.')) {
        str = str.replace(/\./g, '').replace(',', '.');
    } else if (str.includes(',')) {
        str = str.replace(',', '.');
    }
    return parseFloat(str) || 0;
  };

  // Helper to format 1234.56 -> "1.234,56"
  const formatMoney = (value) => {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const updateDashboardData = (newData) => {

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
    // Check if new array format exists from Onboarding
    let revenueHistory = Array(12).fill(0);
    
    if (formData.revenue_history && Array.isArray(formData.revenue_history)) {
        // Find the most recent valid entries, or just sum them up / map to months
        // The new format is { month: "MM/AAAA", amount: "R$ 0,00" }
        formData.revenue_history.forEach(entry => {
             if (!entry.month || !entry.amount) return;
             const val = parseCurrency(entry.amount);
             const parts = entry.month.split('/');
             if (parts.length === 2) {
                 const monthIdx = parseInt(parts[0], 10) - 1; // 0-based
                 if (monthIdx >= 0 && monthIdx <= 11) {
                     revenueHistory[monthIdx] = val; // overwrite or add
                 }
             }
        });
    } else {
        // Fallback to old format
        revenueHistory = months.map(m => {
            const key = `revenue_${m}`;
            const rawValue = formData.revenue ? formData.revenue[key] : formData[key];
            return parseCurrency(rawValue);
        });
    }
    
    const totalAnnualRevenue = revenueHistory.reduce((acc, val) => acc + val, 0);

    // 2. Find "Current" Revenue (Prioritize current month -> past months -> wrap around to end of year)
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
    
    // If still 0, default to first non-zero found, or 0
    if (currentRevenue === 0 && totalAnnualRevenue > 0) {
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
    const sumComposite = (parentId, fields) => {
        if (!formData[parentId]) return;
        fields.forEach(f => addCost(formData[parentId][f]));
    };

    // Location
    if (formData.location_costs) {
        addCost(formData.location_costs.rent);
        addCost(parseCurrency(formData.location_costs.iptu_annual) / 12);
    }
    
    // Utilities, Recurring, Operational Fixed
    sumComposite('utilities', ['energy', 'water', 'gas', 'internet', 'security']);
    sumComposite('recurring_services', ['pest_control', 'waste_removal', 'cleaning_supplies']);
    sumComposite('operational_fixed', ['kitchen_gas', 'kitchen_oil']);
    
    // Admin Systems
    sumComposite('admin_systems', ['software_pdv', 'accountant', 'card_machine_rent']);
    if (formData.identity?.is_mei === 'Sim') {
        sumComposite('admin_systems', ['taxes_das']);
    }
    
    // Marketing
    sumComposite('marketing_structure', ['agency', 'ads_budget']);
    if (formData.marketing_structure && formData.marketing_structure.gifts_cost && formData.marketing_structure.gifts_qty) {
        const giftCost = parseCurrency(formData.marketing_structure.gifts_cost);
        const giftQty = parseFloat(formData.marketing_structure.gifts_qty) || 0;
        fixedCosts += giftCost * giftQty;
    }

    // Marketplaces (Fixed Fee)
    if (formData.fees_marketplaces && Array.isArray(formData.fees_marketplaces)) {
        formData.fees_marketplaces.forEach(item => addCost(item.monthly_fee));
    }

    // Vehicles
    if (formData.vehicles && Array.isArray(formData.vehicles)) {
        formData.vehicles.forEach(v => {
            addCost(v.installment);
            addCost(v.maintenance_monthly);
            addCost(parseCurrency(v.insurance_annual) / 12);
            addCost(parseCurrency(v.ipva_annual) / 12);
        });
    }

    // Equipment (Depreciation)
    if (formData.equipment && Array.isArray(formData.equipment)) {
        formData.equipment.forEach(eq => {
            const val = parseCurrency(eq.value);
            const years = parseFloat(eq.lifespan) || 0;
            if (years > 0) fixedCosts += val / (years * 12);
        });
    }

    // Personnel Costs
    let personnelCosts = 0;
    
    if (formData.partners && Array.isArray(formData.partners)) {
        formData.partners.forEach(p => {
             const pl = parseCurrency(p.pro_labore);
             personnelCosts += pl + (pl * 0.11);
        });
    }

    if (formData.employees && Array.isArray(formData.employees)) {
        formData.employees.forEach(e => {
             const base = parseCurrency(e.base_salary);
             if (e.regime === 'CLT') {
                 const fgts = base * 0.08;
                 const prov13 = base / 12;
                 const provFerias = (base * 1.3333) / 12;
                 const fgtsProv = (prov13 + provFerias) * 0.08;
                 const multa = (fgts + fgtsProv) * 0.50;
                 const aviso = base / 12;
                 personnelCosts += base + fgts + prov13 + provFerias + fgtsProv + multa + aviso;
             } else {
                 personnelCosts += base;
             }
        });
    }
    
    if (formData.benefits) {
        const transValue = parseCurrency(formData.benefits.transport_value);
        const transQty = parseFloat(formData.benefits.transport_qty) || 0;
        const workDays = parseFloat(formData.benefits.work_days) || 0;
        const foodCost = parseCurrency(formData.benefits.food_cost);
        const empCount = formData.employees ? formData.employees.length : 1; // assume at least 1 person using
        
        personnelCosts += (transValue * transQty * workDays * empCount);
        personnelCosts += (foodCost * workDays * empCount);
    }

    const totalFixedCosts = fixedCosts + personnelCosts;

    // Default variable costs to 35% of Revenue for simulation if real data is missing
    let cmvPercentage = 0.35;
    
    // If we have actual menu engineering data, we can calculate the real overall CMV %
    // by summing (sales * cost) and dividing by (sales * price)
    if (dashboardData.menuEngineering && dashboardData.menuEngineering.length > 0) {
        let totalSalesRevenue = 0;
        let totalSalesCost = 0;
        dashboardData.menuEngineering.forEach(item => {
            const sales = parseFloat(String(item.sales).replace(',', '.')) || 0;
            const price = parseCurrency(item.price);
            const cost = parseCurrency(item.cost);
            totalSalesRevenue += sales * price;
            totalSalesCost += sales * cost;
        });
        if (totalSalesRevenue > 0) {
            cmvPercentage = totalSalesCost / totalSalesRevenue;
        }
    }

    const variableCosts = currentRevenue * cmvPercentage;

    // 2. METRICS CALCULATIONS
    
    // ======= TAX CALCULATIONS (Simples Nacional vs Outros) ========
    let percentTaxSimples = 0;
    let taxCostSimples = 0;
    
    if (formData.identity?.tax_regime === 'Simples Nacional' && formData.identity?.is_mei !== 'Sim') {
        const userProvidedRate = formData.admin_systems?.simples_rate;
        // If user typed '4,5', clean formatting
        const cleanRate = userProvidedRate ? parseFloat(userProvidedRate.toString().replace(',', '.')) : 0;
        
        if (cleanRate > 0) {
            percentTaxSimples = cleanRate / 100;
        } else {
            // Auto calculate based on Anexo I (Comércio) using annualized history (RBT12)
            const activeMonths = revenueHistory.filter(v => v > 0);
            const avgMonthlyRevenue = activeMonths.length > 0 ? (totalAnnualRevenue / activeMonths.length) : 0;
            const rbt12 = avgMonthlyRevenue * 12; // Annualize observed revenue for RBT12 table
            
            if (rbt12 <= 180000) {
                percentTaxSimples = 0.04;
            } else if (rbt12 <= 360000) {
                percentTaxSimples = ((rbt12 * 0.073) - 5940) / rbt12;
            } else if (rbt12 <= 720000) {
                percentTaxSimples = ((rbt12 * 0.095) - 13860) / rbt12;
            } else if (rbt12 <= 1800000) {
                percentTaxSimples = ((rbt12 * 0.107) - 22500) / rbt12;
            } else if (rbt12 <= 3600000) {
                percentTaxSimples = ((rbt12 * 0.143) - 87300) / rbt12;
            } else if (rbt12 > 0) {
                percentTaxSimples = ((rbt12 * 0.19) - 378000) / rbt12;
            }
        }
        taxCostSimples = currentRevenue * percentTaxSimples;
    }

    const totalCosts = totalFixedCosts + variableCosts + taxCostSimples;
    const profit = currentRevenue - totalCosts;
    // Contribution Margin = Revenue - All Variable Costs (CMV + Variables + Variable Taxes)
    const contributionMargin = currentRevenue - variableCosts - taxCostSimples; 
    const marginPercentage = currentRevenue > 0 ? (profit / currentRevenue) * 100 : 0;
    
    // Break Even Point (Ponto de Equilíbrio)
    // BEP = Fixed Costs / Marge Contribution Percentage
    const contributionMarginPercentage = currentRevenue > 0 ? (contributionMargin / currentRevenue) : 0;
    const breakEvenValue = contributionMarginPercentage > 0 ? totalFixedCosts / contributionMarginPercentage : 0;
    // 3. CONSTRUCT DASHBOARD OBJECT
    const newDashboardData = {
        ...initialData,
        formData: formData, // Persist raw form data for re-editing
        operational: dashboardData.operational || initialData.operational, 
        restaurant: { 
            name: formData?.identity?.restaurant_name || "Seu Restaurante", 
            category: formData?.identity?.cuisine_type || "Gastronomia" 
        },
        user: {
            ...initialData.user,
            name: "Usuário",
            initials: "US"
        },
        period: {
            date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' }),
            status: profit >= 0 ? "Lucrativo" : "Prejuízo",
            statusColor: profit >= 0 ? "#E2FD89" : "#FF4560"
        },
        revenue: {
            total: formatMoney(currentRevenue),
            month: currentMonthStr || "Mês Atual",
            history: revenueHistory, 
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
                    label: "Custos Variáveis Estimados",
                    value: `R$ ${formatMoney(variableCosts)}`,
                    percentage: `${(cmvPercentage * 100).toFixed(1)}%`,
                    status: "neutral",
                    icon: "pie"
                }
            ]
        },
        breakEven: {
            // How much of the break_even have we hit? (E.g. hit 100% when revenue == breakEven)
            percentage: breakEvenValue > 0 ? Math.min(Math.round((currentRevenue / breakEvenValue) * 100), 100) : 0, 
            current: formatMoney(breakEvenValue),
            min: "0",
            max: formatMoney(Math.max(currentRevenue, breakEvenValue) * 1.5), 
            base: {
                value: marginPercentage.toFixed(0),
                status: marginPercentage < 10 ? "Alerta" : (marginPercentage > 20 ? "Saudável" : "Médio"),
                range: "Acima de 15% ideal"
            }
        },
        cards: {
            moneyOnTable: {
                // Dinheiro na mesa is defined here as what they *could* be making if they hit ideal costs vs what they *are* making
                // Let's assume ideal margin is 20%. 
                idealMargin: 20,
                currentMargin: marginPercentage,
                total: formatMoney(currentRevenue),
                lost: marginPercentage < 20 && currentRevenue > 0 ? formatMoney((0.20 - (profit/currentRevenue)) * currentRevenue) : "0,00",
                recovered: profit > 0 ? formatMoney(profit) : "0,00",
                percentage: marginPercentage < 20 && currentRevenue > 0 ? Math.round(((0.20 - (profit/currentRevenue)) / 0.20) * 100) + "%" : "0%"
            },
            technicalSheets: [
                { label: 'CMV real', value: `${(cmvPercentage * 100).toFixed(0)}%` },
                { label: 'Fichas Desatualizadas', value: '0' },
                { label: 'Produtos Sem Ficha', value: '0' },
            ],
            costStructure: {
                total: formatMoney(totalCosts),
                percentage: currentRevenue > 0 ? Math.round((totalCosts / currentRevenue) * 100) + "%" : "0%",
                breakdown: [
                    { label: 'Pessoal + Sócios', value: `R$ ${formatMoney(personnelCosts)}` },
                    { label: 'Infraestrutura', value: `R$ ${formatMoney(fixedCosts - parseCurrency(formData?.admin_systems?.accountant || 0) - parseCurrency(formData?.marketing_structure?.agency || 0))}` }, 
                    { label: 'CMV Estimado', value: `R$ ${formatMoney(variableCosts)}` },
                    { label: 'Admin e Mkt', value: `R$ ${formatMoney(parseCurrency(formData?.admin_systems?.accountant || 0) + parseCurrency(formData?.marketing_structure?.agency || 0))}` }, 
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
