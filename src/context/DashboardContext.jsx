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
        moneyOnTable: { total: "0,00", items: [], hasData: false },
        technicalSheets: [
            { label: 'CMV Teórico', value: '0%' },
            { label: 'Fichas Desatualizadas', value: '0' },
            { label: 'Produtos Sem Ficha', value: '0' }
        ],
        costStructure: { total: "0", percentage: "0%", breakdown: [] }
    },
    tips: []
  };

  const [dashboardData, setDashboardData] = useState(initialData);
  const [clientDataLoaded, setClientDataLoaded] = useState(false);
  const [clientDataError, setClientDataError] = useState(false);

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
                { label: 'CMV Teórico', value: getVal('CMV Teórico') || getVal('CMV real') || getVal('CMV Global') },
                { label: 'Fichas Desatualizadas', value: getVal('Desatualizadas') },
                { label: 'Produtos Sem Ficha', value: getVal('Sem Ficha') }
              ];
            }

            // If onboarding was NOT completed (no formData), reset financial cards to zeros
            // to prevent stale calculated data from showing before the user fills out the onboarding
            if (!merged.formData) {
              merged.breakEven = initialData.breakEven;
              merged.revenue = { ...initialData.revenue };
              merged.cards = {
                ...merged.cards,
                moneyOnTable: initialData.cards.moneyOnTable,
                costStructure: initialData.cards.costStructure
              };
            }

            return merged;
          });
          setClientDataLoaded(true);
        })
        .catch(err => {
          console.error("Failed to load client data from API", err);
          setClientDataError(true);
          setClientDataLoaded(true);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    sumComposite('utilities', ['energy', 'water', 'internet', 'security']);
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

    // Other Fixed Costs
    if (formData.other_fixed_costs && Array.isArray(formData.other_fixed_costs)) {
        formData.other_fixed_costs.forEach(item => addCost(item.value));
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

    // CMV Teórico: only from fichas técnicas (menuEngineering data)
    // If no fichas exist, CMV = 0 (not 35% default)
    let cmvPercentage = 0;
    let hasCmvData = false;
    
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
            hasCmvData = true;
        }
    }

    // Card machine fees (Débito + Crédito) — variable cost
    let cardFeePercentage = 0;
    if (formData.fees_cards && Array.isArray(formData.fees_cards)) {
        let totalRates = 0;
        let count = 0;
        formData.fees_cards.forEach(card => {
            const debit = parseFloat(String(card.debit_rate || '0').replace(',', '.').replace('%', '')) || 0;
            const credit = parseFloat(String(card.credit_rate || '0').replace(',', '.').replace('%', '')) || 0;
            totalRates += (debit + credit) / 2; // average of debit+credit per operator
            count++;
        });
        if (count > 0) cardFeePercentage = totalRates / count / 100;
    }

    // Variable costs = Card fees + Taxes (Simples) + CMV (only if fichas filled)
    const cardFeeCost = currentRevenue * cardFeePercentage;
    const cmvCost = currentRevenue * cmvPercentage;
    const variableCosts = cardFeeCost + cmvCost;

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

    const totalVariableCosts = variableCosts + taxCostSimples;
    const totalCosts = totalFixedCosts + totalVariableCosts;
    const profit = currentRevenue - totalCosts;
    // Contribution Margin = Revenue - All Variable Costs (CMV + Card Fees + Taxes)
    const contributionMargin = currentRevenue - totalVariableCosts; 
    const marginPercentage = currentRevenue > 0 ? (profit / currentRevenue) * 100 : 0;
    
    // iFood % for "Dinheiro na Mesa"
    let ifoodPercentage = 0;
    if (formData.fees_marketplaces && Array.isArray(formData.fees_marketplaces)) {
        const ifoodEntry = formData.fees_marketplaces.find(m => m.provider === 'iFood');
        if (ifoodEntry && ifoodEntry.sales_percentage) {
            ifoodPercentage = parseFloat(String(ifoodEntry.sales_percentage || '0').replace(',', '.').replace('%', '')) || 0;
        }
    }
    // Also check for explicit ifood_sales_percentage field (fallback)
    if (formData.ifood_sales_percentage && ifoodPercentage === 0) {
        ifoodPercentage = parseFloat(String(formData.ifood_sales_percentage).replace(',', '.').replace('%', '')) || 0;
    }

    // Fixed Cost % over revenue
    const fixedCostPercentage = currentRevenue > 0 ? (totalFixedCosts / currentRevenue) * 100 : 0;
    const cmvPercentageDisplay = cmvPercentage * 100;

    // "Dinheiro na Mesa" calculation:
    // Sum excess % above thresholds: iFood>23%, CF>33%, CMV>30%
    let moneyOnTableTotal = 0;
    const moneyOnTableItems = [];

    if (ifoodPercentage > 23 && currentRevenue > 0) {
        const excess = ((ifoodPercentage - 23) / 100) * currentRevenue;
        moneyOnTableTotal += excess;
        moneyOnTableItems.push({ label: `iFood (${ifoodPercentage.toFixed(0)}%)`, value: formatMoney(excess), pct: `${(ifoodPercentage - 23).toFixed(1)}% acima` });
    }
    if (fixedCostPercentage > 33 && currentRevenue > 0) {
        const excess = ((fixedCostPercentage - 33) / 100) * currentRevenue;
        moneyOnTableTotal += excess;
        moneyOnTableItems.push({ label: `Custo Fixo (${fixedCostPercentage.toFixed(0)}%)`, value: formatMoney(excess), pct: `${(fixedCostPercentage - 33).toFixed(1)}% acima` });
    }
    if (cmvPercentageDisplay > 30 && currentRevenue > 0 && hasCmvData) {
        const excess = ((cmvPercentageDisplay - 30) / 100) * currentRevenue;
        moneyOnTableTotal += excess;
        moneyOnTableItems.push({ label: `CMV (${cmvPercentageDisplay.toFixed(0)}%)`, value: formatMoney(excess), pct: `${(cmvPercentageDisplay - 30).toFixed(1)}% acima` });
    }

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
            name: formData?.user_info?.user_name || "Usuário",
            initials: (formData?.user_info?.user_name || "US").substring(0, 2).toUpperCase(),
            photo: formData?.user_info?.user_photo || null
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
            annualTotal: formatMoney(totalAnnualRevenue),
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
                    value: `R$ ${formatMoney(totalVariableCosts)}`,
                    percentage: currentRevenue > 0 ? `${((totalVariableCosts / currentRevenue) * 100).toFixed(1)}%` : "0%",
                    status: "neutral",
                    icon: "pie"
                }
            ]
        },
        breakEven: {
            // Only show break-even if CMV is properly filled via fichas técnicas
            hasCmvData: hasCmvData,
            percentage: !hasCmvData ? 0 : (breakEvenValue === 0 && currentRevenue > 0 ? 100 : (breakEvenValue > 0 ? Math.min(Math.round((currentRevenue / breakEvenValue) * 100), 100) : 0)), 
            current: hasCmvData ? formatMoney(breakEvenValue) : "0,00",
            min: "0",
            max: formatMoney(Math.max(currentRevenue, breakEvenValue) * 1.5), 
            base: {
                value: marginPercentage.toFixed(0),
                status: marginPercentage > 50 ? "Alerta" : (marginPercentage >= 10 ? "Saudável" : "Baixo"),
                range: "Recomendado até 50%"
            }
        },
        cards: {
            moneyOnTable: {
                total: formatMoney(moneyOnTableTotal),
                items: moneyOnTableItems,
                hasData: currentRevenue > 0 && (ifoodPercentage > 0 || fixedCostPercentage > 0 || hasCmvData),
                percentage: currentRevenue > 0 && moneyOnTableTotal > 0 ? `${((moneyOnTableTotal / currentRevenue) * 100).toFixed(1)}%` : "0%"
            },
            technicalSheets: [
                { label: 'CMV Teórico', value: hasCmvData ? `${cmvPercentageDisplay.toFixed(0)}%` : '0%' },
                { label: 'Fichas Desatualizadas', value: '0' },
                { label: 'Produtos Sem Ficha', value: '0' },
            ],
            costStructure: (() => {
                // Admin e Mkt: ALL admin_systems costs + ALL marketing_structure costs
                const adminMktTotal = 
                    parseCurrency(formData?.admin_systems?.software_pdv || 0) +
                    parseCurrency(formData?.admin_systems?.accountant || 0) +
                    parseCurrency(formData?.admin_systems?.card_machine_rent || 0) +
                    (formData?.identity?.is_mei === 'Sim' ? parseCurrency(formData?.admin_systems?.taxes_das || 0) : 0) +
                    parseCurrency(formData?.marketing_structure?.agency || 0) +
                    parseCurrency(formData?.marketing_structure?.ads_budget || 0) +
                    (parseCurrency(formData?.marketing_structure?.gifts_cost || 0) * (parseFloat(formData?.marketing_structure?.gifts_qty) || 0));

                // Infraestrutura = fixedCosts minus admin/mkt items that were already counted in fixedCosts
                const infraCosts = fixedCosts - 
                    parseCurrency(formData?.admin_systems?.software_pdv || 0) -
                    parseCurrency(formData?.admin_systems?.accountant || 0) -
                    parseCurrency(formData?.admin_systems?.card_machine_rent || 0) -
                    (formData?.identity?.is_mei === 'Sim' ? parseCurrency(formData?.admin_systems?.taxes_das || 0) : 0) -
                    parseCurrency(formData?.marketing_structure?.agency || 0) -
                    parseCurrency(formData?.marketing_structure?.ads_budget || 0) -
                    (parseCurrency(formData?.marketing_structure?.gifts_cost || 0) * (parseFloat(formData?.marketing_structure?.gifts_qty) || 0));

                return {
                    total: formatMoney(totalCosts),
                    percentage: currentRevenue > 0 ? Math.round((totalCosts / currentRevenue) * 100) + "%" : "0%",
                    breakdown: [
                        { label: 'Pessoal + Sócios', value: `R$ ${formatMoney(personnelCosts)}` },
                        { label: 'Infraestrutura', value: `R$ ${formatMoney(Math.max(0, infraCosts))}` }, 
                        { label: 'CMV Estimado', value: `R$ ${formatMoney(cmvCost)}` },
                        { label: 'Admin e Mkt', value: `R$ ${formatMoney(adminMktTotal)}` }, 
                    ]
                };
            })(),
        },
        restaurant: {
            name: formData?.identity?.restaurant_name || "Seu Restaurante",
            logo: formData?.identity?.business_logo || null,
            category: formData?.identity?.cuisine_type || "Gastronomia"
        },
        user: {
            name: formData?.user_info?.user_name || "Usuário",
            photo: formData?.user_info?.user_photo || null,
            role: "Proprietário da Conta",
            initials: (formData?.user_info?.user_name || "U").substring(0, 2).toUpperCase(),
            isOwner: true
        },
        overview: {
            title: formData?.identity?.restaurant_name || "Seu Restaurante",
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
    <DashboardContext.Provider value={{ dashboardData, updateDashboardData, clientDataLoaded, clientDataError }}>
      {children}
    </DashboardContext.Provider>
  );
};
