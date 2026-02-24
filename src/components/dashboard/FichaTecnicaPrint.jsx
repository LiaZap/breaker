import React from 'react';

const FichaTecnicaPrint = ({ data }) => {
  if (!data) return null;

  return (
    <div className="hidden print:block fixed inset-0 z-9999 bg-white text-black p-8 overflow-y-auto">
      {/* CSS to hide headers/footers in print and reset styles */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body * {
            visibility: hidden;
          }
          #printable-root, #printable-root * {
            visibility: visible;
          }
          #printable-root {
            position: absolute;
            left: 0;
            top: 0;
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            padding: 20px;
            background: white;
            z-index: 9999;
          }
        }
      `}</style>
      
      {/* Printable Root ID */}
      <div id="printable-root">
          {/* Container A4 style */}
          <div className="max-w-[210mm] mx-auto border border-black h-full flex flex-col min-h-[290mm]">
            
            {/* Header */}
            <div className="bg-[#D9D9D9] border-b border-black p-4 flex items-center justify-between">
              <h1 className="text-xl font-bold uppercase">FICHA TÉCNICA OPERACIONAL - {data.name}</h1>
            </div>

            {/* Info Gerais */}
            <div className="border-b border-black">
              <div className="bg-[#D9D9D9] p-1 text-center font-bold border-b border-black text-sm">INFORMAÇÕES GERAIS</div>
              <div className="p-2 text-sm grid grid-cols-1 gap-1">
                  <div className="border-b border-gray-300 pb-1"><strong>Categoria:</strong> {data.type}</div>
                  <div className="border-b border-gray-300 py-1"><strong>Tempo de preparo:</strong> {data.tempoPreparo || '-'}</div>
                  <div className="border-b border-gray-300 py-1"><strong>Rendimento:</strong> {data.rendimento}</div>
                  <div className="pt-1"><strong>Utensílios necessários:</strong> {data.utensilios || '-'}</div>
              </div>
            </div>

            {/* Middle Section: Photo & Ingredients */}
            <div className="flex border-b border-black h-[350px]">
              {/* Photo */}
              <div className="w-1/2 border-r border-black p-2 flex items-center justify-center relative overflow-hidden">
                  {data.fotoPrato ? (
                      <img src={data.fotoPrato} alt="Prato" className="w-full h-full object-cover" />
                  ) : (
                      <div className="text-gray-400 font-bold text-xl text-center">FOTO DO PRATO PRONTO</div>
                  )}
              </div>

              {/* Ingredients Table */}
              <div className="w-1/2 flex flex-col">
                  <div className="bg-[#D9D9D9] p-1 text-center font-bold border-b border-black text-sm">INGREDIENTES E PORCIONAMENTO</div>
                  <div className="flex bg-[#D9D9D9] border-b border-black text-xs font-bold">
                    <div className="w-[40%] p-1 border-r border-black">Ingrediente</div>
                    <div className="w-[20%] p-1 border-r border-black text-center">Qtd Líq (PL)</div>
                    <div className="w-[20%] p-1 border-r border-black text-center">FC</div>
                    <div className="w-[20%] p-1 text-center">Qtd Bruta (PB)</div>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    {data.ingredients && data.ingredients.map((ing, i) => (
                        <div key={i} className="flex border-b border-gray-300 text-xs">
                          <div className="w-[40%] p-1 border-r border-gray-300 truncate">{ing.name}</div>
                          <div className="w-[20%] p-1 border-r border-gray-300 text-center">{ing.netQty || ing.qty}{ing.unit}</div>
                          <div className="w-[20%] p-1 border-r border-gray-300 text-center">{ing.fc || '1.00'}</div>
                          <div className="w-[20%] p-1 text-center">{ing.grossQty || ing.qty}{ing.unit}</div>
                        </div>
                    ))}
                  </div>
              </div>
            </div>

            {/* Modo de Preparo */}
            <div className="border-b border-black flex-1">
              <div className="bg-[#D9D9D9] p-1 text-center font-bold border-b border-black text-sm">MODO DE PREPARO E MONTAGEM (PASSO A PASSO)</div>
              <div className="p-2 text-sm flex flex-col gap-2">
                  {data.modoPreparo && data.modoPreparo.length > 0 ? (
                      data.modoPreparo.map((step, i) => (
                          <div key={i} className="border-b border-gray-200 pb-1">
                              <strong>{i + 1}.</strong> {step}
                          </div>
                      ))
                  ) : (
                      <div className="text-gray-400 italic">Sem modo de preparo cadastrado.</div>
                  )}
              </div>
            </div>

            {/* Finalização */}
            <div className="h-[100px] border-t border-black">
              <div className="bg-[#D9D9D9] p-1 text-center font-bold border-b border-black text-sm">PADRÃO DE FINALIZAÇÃO E SAÍDA</div>
              <div className="p-2 text-sm">
                  {data.finalizacao || <span className="text-gray-400 italic">Sem instruções de finalização.</span>}
              </div>
            </div>

            {/* Onboarding Checklist - Footer */}
            <div className="mt-auto border-t border-black">
                <div className="bg-[#D9D9D9] p-1 text-center font-bold border-b border-black text-sm">ETAPAS DO ONBOARDING (TREINAMENTO)</div>
                <div className="p-2 grid grid-cols-5 gap-2 text-[10px] text-center">
                    <div className="border border-black p-2 flex flex-col items-center gap-1 rounded">
                        <div className="font-bold">1. TEÓRICA</div>
                        <div>Leitura e Entendimento</div>
                        <div className="w-4 h-4 border border-black mt-1"></div>
                    </div>
                    <div className="border border-black p-2 flex flex-col items-center gap-1 rounded">
                        <div className="font-bold">2. SHADOWING</div>
                        <div>Observação da Execução</div>
                        <div className="w-4 h-4 border border-black mt-1"></div>
                    </div>
                     <div className="border border-black p-2 flex flex-col items-center gap-1 rounded">
                        <div className="font-bold">3. PRÁTICA</div>
                        <div>Execução Assistida</div>
                        <div className="w-4 h-4 border border-black mt-1"></div>
                    </div>
                     <div className="border border-black p-2 flex flex-col items-center gap-1 rounded">
                        <div className="font-bold">4. VALIDAÇÃO</div>
                        <div>Aprovação Chef</div>
                        <div className="w-4 h-4 border border-black mt-1"></div>
                    </div>
                     <div className="border border-black p-2 flex flex-col items-center gap-1 rounded">
                        <div className="font-bold">5. AUTONOMIA</div>
                        <div>Liberado p/ Produção</div>
                        <div className="w-4 h-4 border border-black mt-1"></div>
                    </div>
                </div>
            </div>

          </div>
      </div>
    </div>
  );
};

export default FichaTecnicaPrint;
