const xlsx = require('xlsx');

const parseMenuExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { defval: "" }); // defval ensures empty cells are string

  console.log("Parsed Excel Data (First Row):", data[0]);

  // Transform data to our Menu Engineering format
  // Expected Excel columns: Nome, Vendas, Preço, Custo, Categoria
  
  const parseNumber = (val) => {
      if (typeof val === 'number') return val;
      if (!val) return 0;
      const str = String(val).trim();
      
      // Try simple parsing first
      if (!isNaN(Number(str))) return Number(str);

      // Handle PT-BR (1.234,56) vs US (1,234.56)
      // Assumption: If comma exists, it might be decimal separator
      // If "R$" is present, strip it
      const cleanStr = str.replace(/[R$\s]/g, '');
      
      if (cleanStr.includes(',') && !cleanStr.includes('.')) {
          // "50,00" -> 50.00
          return parseFloat(cleanStr.replace(',', '.'));
      }
      if (cleanStr.includes('.') && cleanStr.includes(',')) {
          // "1.200,00" -> 1200.00
          return parseFloat(cleanStr.replace(/\./g, '').replace(',', '.'));
      }
      
      return parseFloat(cleanStr) || 0;
  };

  const menuItems = data.map((row, index) => {
    // Helper to find case-insensitive key
    const findVal = (keys) => {
        const lowerKeys = keys.map(k => k.toLowerCase());
        const foundKey = Object.keys(row).find(k => lowerKeys.includes(k.toLowerCase()));
        return foundKey ? row[foundKey] : null;
    };

    return {
        id: Date.now() + index, // Generate temporary unique ID
        name: findVal(['Nome', 'Prato', 'Item', 'Name']) || 'Sem Nome',
        category: findVal(['Categoria', 'Grupo', 'Category']) || 'Geral',
        sales: parseNumber(findVal(['Vendas', 'Volume', 'Qtd', 'Quantidade', 'Sales'])),
        price: parseNumber(findVal(['Preço', 'Preco', 'Venda', 'Valor de Venda', 'R$', 'Price', 'Valor'])),
        cost: parseNumber(findVal(['Custo', 'CMV', 'Cost']))
    };
  });
  
  console.log("Processed Menu Items (First 2):", menuItems.slice(0, 2));

  return menuItems;
};

module.exports = { parseMenuExcel };
