import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onboardingQuestions } from '../data/onboardingQuestions';
import { useDashboard } from '../context/DashboardContext';

const OnboardingForm = ({ onClose = () => {}, onComplete = () => {} }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [direction, setDirection] = useState(0);

  const currentQuestion = onboardingQuestions[currentStepIndex];
  const totalSteps = onboardingQuestions.length;
  // Calculate progress based on index
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  // Format currency helper
  const formatCurrency = (value) => {
    if (!value) return '';
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const number = parseInt(numbers) / 100;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleInputChange = (id, value, type = 'text') => {
    let formattedValue = value;
    if (type === 'currency' || type === 'currency_period') {
        // Remove currency symbol for standard input handling if needed, 
        // strictly speaking we usually store raw numbers or keep formatted string.
        // Let's keep formatted string for UI consistency as per previous implementation logic
        formattedValue = formatCurrency(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: formattedValue
    }));
  };

  const handleCompositeChange = (parentId, fieldId, value, type) => {
     let formattedValue = value;
     if (type === 'currency') formattedValue = formatCurrency(value);

     setFormData(prev => ({
       ...prev,
       [parentId]: {
         ...(prev[parentId] || {}),
         [fieldId]: formattedValue
       }
     }));
  };

  // Handler for group list (e.g. Partners, Employees) using an array in formData
  const handleGroupChange = (questionId, index, fieldId, value, type) => {
      let formattedValue = value;
      if (type === 'currency') formattedValue = formatCurrency(value);

      setFormData(prev => {
          const currentArray = prev[questionId] || [];
          // Ensure array has objects up to index
          const newArray = [...currentArray];
          if (!newArray[index]) newArray[index] = {};
          
          newArray[index] = {
              ...newArray[index],
              [fieldId]: formattedValue
          };
          
          return { ...prev, [questionId]: newArray };
      });
  };

  const { dashboardData, updateDashboardData } = useDashboard();

  useEffect(() => {
    if (dashboardData?.formData) {
      setFormData(dashboardData.formData);
    }
  }, [dashboardData]);

  const handleContinue = () => {
    if (currentStepIndex < totalSteps - 1) {
      setDirection(1);
      setCurrentStepIndex(prev => prev + 1);
    } else {
      updateDashboardData(formData);
      if (onComplete) onComplete(formData);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onClose();
    }
  };

  // --- RENDER HELPERS ---

  const renderSingleInput = (question) => {
      if (question.type === 'currency' || question.type === 'text') {
          return (
            <input
              type="text"
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value, question.type)}
              placeholder={question.placeholder}
              className="font-['Plus_Jakarta_Sans'] font-medium bg-transparent border-b-2 border-[#333333] focus:border-white outline-none pb-3 transition-colors w-full"
              style={{
                fontSize: '24px',
                lineHeight: '32px',
                color: 'rgba(255, 255, 255, 0.9)'
              }}
              autoFocus
            />
          );
      }
      if (question.type === 'currency_period') {
          return (
              <div className="flex gap-4">
                  <input
                    type="text"
                    value={formData[question.id]?.amount || ''}
                    onChange={(e) => {
                        const val = formatCurrency(e.target.value);
                        setFormData(prev => ({
                            ...prev, 
                            [question.id]: { ...(prev[question.id] || {}), amount: val }
                        }))
                    }}
                    placeholder={question.placeholder}
                    className="flex-1 font-['Plus_Jakarta_Sans'] font-medium bg-transparent border-b-2 border-[#333333] focus:border-white outline-none pb-3 transition-colors"
                    style={{ fontSize: '24px', color: 'rgba(255, 255, 255, 0.9)' }}
                  />
                  <select 
                     className="bg-[#333] text-white rounded px-3 py-2 outline-none border-none"
                     onChange={(e) => {
                        setFormData(prev => ({
                            ...prev, 
                            [question.id]: { ...(prev[question.id] || {}), period: e.target.value }
                        }))
                     }}
                     value={formData[question.id]?.period || 'Mensal'}
                  >
                      <option value="Mensal">Mensal</option>
                      <option value="Anual">Anual</option>
                  </select>
              </div>
          )
      }
      return null;
  };

  const renderComposite = (question) => {
      return (
          <div className={`${question.gridLayout ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-6'}`}>
              {question.fields.map(field => (
                  <div key={field.id}>
                      <label className="block text-xs text-secondary mb-1 opacity-70">{field.label}</label>
                      <input
                        type="text"
                        value={formData[question.id]?.[field.id] || ''}
                        onChange={(e) => handleCompositeChange(question.id, field.id, e.target.value, field.type)}
                        placeholder={field.placeholder}
                        className="font-['Plus_Jakarta_Sans'] font-medium bg-transparent border-b border-[#333333] focus:border-white outline-none pb-2 transition-colors w-full"
                        style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.9)' }}
                      />
                  </div>
              ))}
          </div>
      );
  };

  const renderGroupList = (question) => {
      // Need a way to render N items. 
      // For simplicity, let's render a fixed set or allow adding. 
      // Given the design constraints, let's render `maxItems` blocks but compact.
      return (
          <div className="flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2">
              {[...Array(question.maxItems)].map((_, idx) => (
                  <div key={idx} className="p-4 bg-[#2A2A2A] rounded-lg border border-[#333]">
                      <div className="text-xs text-[#FFC100] mb-2 font-bold uppercase">{question.itemLabel} {idx + 1}</div>
                      <div className="grid grid-cols-2 gap-4">
                          {question.fields.map(field => (
                              <div key={field.id} className={field.id === 'name' ? 'col-span-2' : ''}>
                                  <label className="block text-[10px] text-gray-400 mb-1">{field.label}</label>
                                  {field.type === 'select' ? (
                                      <select
                                        className="w-full bg-[#1A1A1A] text-white text-sm p-2 rounded border border-[#444] outline-none"
                                        onChange={(e) => handleGroupChange(question.id, idx, field.id, e.target.value, field.type)}
                                        value={formData[question.id]?.[idx]?.[field.id] || ''}
                                      >
                                          <option value="">Selecione</option>
                                          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                      </select>
                                  ) : (
                                      <input
                                        type="text"
                                        value={formData[question.id]?.[idx]?.[field.id] || ''}
                                        onChange={(e) => handleGroupChange(question.id, idx, field.id, e.target.value, field.type)}
                                        placeholder={field.placeholder}
                                        className="w-full bg-transparent border-b border-[#444] text-white text-sm pb-1 outline-none focus:border-[#FFC100]"
                                      />
                                  )}
                              </div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="fixed right-0 top-0 bottom-0 w-[70%] bg-[#1D1D1D] flex flex-col z-50"
        style={{ borderRadius: '15px' }}
      >
        {/* Progress Bar - Segmented */}
        <div className="absolute top-[100px] left-0 right-0 flex gap-1 px-[10%]">
          {[...Array(totalSteps)].map((_, i) => (
            <div 
              key={i}
              className="h-[4px] flex-1 transition-all duration-300"
              style={{
                background: i <= currentStepIndex ? '#FFC100' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                opacity: i <= currentStepIndex ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {/* User Profile - Top Right (Only shows when typed) */}
        {formData?.user_info?.user_name && (
          <div className="absolute right-[55px] top-[28px] flex items-center gap-[11px]">
            <div className="w-[46px] h-[46px] rounded-full bg-[#FDD688] flex items-center justify-center">
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-black">
                {(formData?.user_info?.user_name || "U").substring(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col gap-[3px]">
              <div className="font-['Plus_Jakarta_Sans'] font-medium text-[14px] leading-[18px] text-white">
                {formData?.user_info?.user_name}
              </div>
              <div className="font-['Plus_Jakarta_Sans'] font-medium text-[10px] leading-[13px] text-[#A0A0A0]">
                Proprietário da Conta
              </div>
            </div>
          </div>
        )}

        {/* Header - Top Left */}
        <div className="absolute left-[66px] top-[79px]">
          <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] leading-[18px] text-white mb-2">
            Passo {currentStepIndex + 1} de {totalSteps}
          </div>
          <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-white/20">
            {currentQuestion.section}
          </div>
        </div>

        <div className="flex flex-1 mt-[160px] px-[66px] gap-20">
            {/* Left Column - Context */}
            <div className="w-1/3 pt-10">
                <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-white/80 uppercase tracking-wider mb-4">
                    Contexto
                </div>
                <h2 className="font-['Plus_Jakarta_Sans'] font-semibold text-[24px] leading-[1.2] text-white/50 mb-6">
                    {currentQuestion.title}
                </h2>
                <p className="font-['Plus_Jakarta_Sans'] font-medium text-[14px] leading-[1.5] text-white/30">
                    {currentQuestion.description}
                </p>
            </div>

            {/* Right Column - Question Input */}
            <div className="flex-1 pt-12 max-w-[500px]">
                <div className="font-['Plus_Jakarta_Sans'] font-semibold text-[12px] text-white mb-6">
                    Sua Resposta
                </div>

                <AnimatePresence mode='wait' custom={direction}>
                    <motion.div
                        key={currentStepIndex}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Dynamic Input Rendering */}
                        {currentQuestion.type === 'composite' 
                            ? renderComposite(currentQuestion) 
                            : currentQuestion.type === 'group_list'
                                ? renderGroupList(currentQuestion)
                                : renderSingleInput(currentQuestion)
                        }
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-12">
                    <button
                        onClick={handleContinue}
                        className="flex items-center justify-center gap-[10px] bg-[#FFC100] rounded-full h-[50px] px-8 hover:bg-[#ffdb65] transition-colors"
                    >
                        <span className="font-['Plus_Jakarta_Sans'] font-bold text-[14px] text-black">
                            {currentStepIndex === totalSteps - 1 ? 'Finalizar' : 'Continuar'}
                        </span>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M6.75 3.75L12 9L6.75 14.25" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                    {currentStepIndex > 0 && (
                         <button
                            onClick={handleBack}
                            className="font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-white/50 hover:text-white transition-colors px-4"
                        >
                            Voltar
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Close/Back - Bottom Left */}
        <button
          onClick={onClose}
          className="absolute left-[75px] bottom-[50px] font-['Plus_Jakarta_Sans'] font-semibold text-[14px] text-white hover:opacity-80 transition-opacity"
        >
          Cancelar Onboarding
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingForm;
