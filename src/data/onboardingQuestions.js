export const onboardingQuestions = [
  // --- SECTION 0: SOBRE VOCÊ ---
  {
    id: 'user_info',
    section: 'Sobre Você',
    title: 'Boas-vindas!',
    description: 'Para começarmos, como você e seu negócio se chamam?',
    type: 'composite',
    fields: [
      { id: 'user_name', label: 'Seu Nome', type: 'text', placeholder: 'Ex: Marcelo Silveratto' },
      { id: 'restaurant_name', label: 'Nome do Restaurante', type: 'text', placeholder: 'Ex: Terra e Mar 360' }
    ]
  },

  // --- SECTION 1: FATURAMENTO (12 Months) ---
  {
    id: 'revenue',
    section: 'Faturamento',
    title: 'Histórico de Faturamento',
    description: 'Informe o faturamento mensal dos últimos 12 meses.',
    type: 'composite',
    gridLayout: true,
    fields: [
      { id: 'revenue_jan', label: 'Janeiro', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_feb', label: 'Fevereiro', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_mar', label: 'Março', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_apr', label: 'Abril', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_may', label: 'Maio', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_jun', label: 'Junho', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_jul', label: 'Julho', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_aug', label: 'Agosto', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_sep', label: 'Setembro', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_oct', label: 'Outubro', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_nov', label: 'Novembro', type: 'currency', placeholder: 'R$ 0,00' },
      { id: 'revenue_dec', label: 'Dezembro', type: 'currency', placeholder: 'R$ 0,00' }
    ]
  },

  // --- SECTION 2: INFO GERAIS ---
  {
    id: 'tax_regime',
    section: 'Informações Gerais',
    title: 'Qual o Regime Tributário?',
    description: 'Ex: Simples Nacional, Lucro Presumido, MEI...',
    type: 'text',
    placeholder: 'Simples Nacional'
  },
  {
    id: 'card_fees',
    section: 'Taxas',
    title: 'Taxas da Maquininha',
    description: 'Informe as taxas médias para Débito e Crédito.',
    type: 'composite',
    fields: [
      { id: 'debit', label: 'Débito (%)', type: 'percentage', placeholder: '1.2%' },
      { id: 'credit', label: 'Crédito (%)', type: 'percentage', placeholder: '3.5%' }
    ]
  },

  // --- SECTION 3: CUSTOS FIXOS (INFRAESTRUTURA) ---
  {
    id: 'rent',
    section: 'Custos Fixos',
    title: 'Aluguel',
    description: 'Valor mensal do aluguel do imóvel.',
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'iptu',
    section: 'Custos Fixos',
    title: 'IPTU',
    description: 'Valor do IPTU (Mensal ou Total Anual).',
    type: 'currency_period', // Special type for Value + Select
    placeholder: 'R$ 0,00'
  },
  {
    id: 'insurance',
    section: 'Custos Fixos',
    title: 'Seguro do Imóvel',
    description: 'Valor do seguro (Mensal ou Total Anual).',
    type: 'currency_period',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'security',
    section: 'Custos Fixos',
    title: 'Segurança / Vigia',
    description: 'Custo mensal com segurança.',
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'permits',
    section: 'Custos Fixos',
    title: 'Alvarás e Licenças',
    description: 'Custo com alvarás.',
    type: 'currency_period',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'utilities',
    section: 'Custos Fixos',
    title: 'Utilidades Básicas',
    description: 'Coloque uma média mensal para estes item.',
    type: 'composite',
    fields: [
        { id: 'energy', label: 'Energia Elétrica', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'water', label: 'Água / Esgoto', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'gas', label: 'Gás', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'internet', label: 'Internet', type: 'currency', placeholder: 'R$ 0,00' },
    ]
  },
  {
    id: 'supplies',
    section: 'Custos Fixos',
    title: 'Insumos Operacionais',
    description: 'Média mensal de gastos com limpeza e manutenção.',
    type: 'composite',
    fields: [
        { id: 'cleaning', label: 'Material de Limpeza', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'kitchen_oil', label: 'Óleo de Cozinha', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'maintenance', label: 'Manutenção Geral', type: 'currency', placeholder: 'R$ 0,00' },
    ]
  },

  // --- SECTION 4: PESSOAL ---
  {
    id: 'partners',
    section: 'Sócios',
    title: 'Sócios e Pró-Labore',
    description: 'Informe os dados dos sócios (até 3).',
    type: 'group_list',
    maxItems: 3,
    itemLabel: 'Sócio',
    fields: [
        { id: 'name', label: 'Nome', type: 'text', placeholder: 'Nome do Sócio' },
        { id: 'role', label: 'Cargo', type: 'text', placeholder: 'Diretor...' },
        { id: 'salary', label: 'Pró-Labore', type: 'currency', placeholder: 'R$ 0,00' }
    ]
  },
  {
    id: 'employees',
    section: 'Equipe',
    title: 'Funcionários',
    description: 'Informe os dados dos principais funcionários (Cozinha, Salão, etc).',
    type: 'group_list',
    maxItems: 5, 
    itemLabel: 'Funcionário',
    fields: [
        { id: 'name', label: 'Nome', type: 'text', placeholder: 'Nome' },
        { id: 'role', label: 'Cargo', type: 'text', placeholder: 'Cozinheiro...' },
        { id: 'salary', label: 'Salário', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'regime', label: 'Regime', type: 'select', options: ['CLT', 'Freelancer', 'PJ'] }
    ]
  },

  // --- SECTION 5: ADMIN & MARKETING ---
  {
    id: 'admin_costs',
    section: 'Administrativo',
    title: 'Custos Administrativos',
    description: 'Serviços e taxas mensais.',
    type: 'composite',
    fields: [
        { id: 'accounting', label: 'Contabilidade', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'software', label: 'Sistemas (PDV)', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'mei_das', label: 'Impostos (DAS/MEI)', type: 'currency', placeholder: 'R$ 0,00' }
    ]
  },
  {
    id: 'marketing',
    section: 'Marketing',
    title: 'Marketing e Vendas',
    description: 'Investimento em aquisição de clientes.',
    type: 'composite',
    fields: [
        { id: 'ifood', label: 'iFood (Mensalidade)', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'ads', label: 'Tráfego Pago', type: 'currency', placeholder: 'R$ 0,00' },
        { id: 'agency', label: 'Agência', type: 'currency', placeholder: 'R$ 0,00' }
    ]
  },

  // --- SECTION 6: VARIÁVEIS ---
  {
    id: 'variable_costs',
    section: 'Custos Variáveis',
    title: 'Média de Compras (CMV)',
    description: 'Média mensal gasta com alimentos, bebidas e embalagens (soma dos ultimos 3 meses / 3).',
    type: 'currency',
    placeholder: 'R$ 0,00'
  }
];
