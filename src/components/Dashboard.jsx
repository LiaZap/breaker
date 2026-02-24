import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import Sidebar from './dashboard/Sidebar';
import DashboardHeader from './dashboard/DashboardHeader';
import FinanceOverview from './dashboard/FinanceOverview';
import MoneyOnTable from './dashboard/MoneyOnTable';
import TechnicalSheets from './dashboard/TechnicalSheets';
import CostStructure from './dashboard/CostStructure';
import DashboardTips from './dashboard/DashboardTips';
import BreakEvenGraphic from './dashboard/BreakEvenGraphic';
import FichaTecnica from './dashboard/FichaTecnica';
import FaturamentoAnualIcon from './dashboard/FaturamentoAnualIcon';
import RankingCategoriaIcon from './dashboard/RankingCategoriaIcon';
import ProximoNivelIcon from './dashboard/ProximoNivelIcon';
import RankingGeralIcon from './dashboard/RankingGeralIcon';
import MatrizPreco from './dashboard/MatrizPreco';
import EngenhariaMenu from './dashboard/EngenhariaMenu';

const Dashboard = () => {
  /* MOVED TO CONTEXT */
  const { dashboardData } = useDashboard();
  const [activePage, setActivePage] = useState('home');

  // Dynamic zoom: scale everything proportionally based on viewport width
  // Reference: 1920px = 100% zoom. 4K (3840px) = 200%, 1440px = 75%, etc.
  const [zoomLevel, setZoomLevel] = useState(1);
  
  React.useEffect(() => {
    const calcZoom = () => {
      const vw = window.innerWidth;
      // Clamp between 0.7 (very small screens) and 2.5 (ultra-large 4K+)
      const zoom = Math.min(Math.max(vw / 1920, 0.7), 2.5);
      setZoomLevel(zoom);
    };
    calcZoom();
    window.addEventListener('resize', calcZoom);
    return () => window.removeEventListener('resize', calcZoom);
  }, []);

  return (
    <div 
      className="relative w-full h-screen bg-[#101010] font-jakarta text-white select-none flex flex-col overflow-x-hidden overflow-y-auto"
      style={{ zoom: zoomLevel }}
    >
      
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {activePage === 'fichaTecnica' ? (
        <div className="ml-0 md:ml-[85px] flex-1 min-h-0">
          <FichaTecnica />
        </div>
      ) : activePage === 'matrizPreco' ? (
        <div className="ml-0 md:ml-[85px] flex-1 min-h-0">
          <MatrizPreco />
        </div>
      ) : activePage === 'engenhariaMenu' ? (
        <div className="ml-0 md:ml-[85px] flex-1 min-h-0">
          <EngenhariaMenu />
        </div>
      ) : (
      <div className="flex flex-col flex-1 min-h-0">
      {/* MAIN CONTENT */}
      <div className="ml-0 md:ml-[85px] py-2 pb-6">
        <div className="w-full px-3 md:px-6 2xl:px-10 flex flex-col min-h-0">
        
        <DashboardHeader data={dashboardData} />

        {/* MAIN GRID - 4 columns layout (responsive fluid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 xl:gap-6 mb-0 min-h-0">
          
          {/* COL 1 - Left Panel */}
          <div className="flex flex-col h-full py-2">
            
            {/* 1. Header Small */}
            <div className="mb-8">
              <span className="block font-bold text-[14px] text-white leading-tight">Dashboard</span>
              <span className="block font-normal text-[11px] text-[#595959] leading-tight">Painel de Controle</span>
            </div>

            {/* 2. Date & Status Row */}
            <div className="flex items-center gap-5 mb-8">
               <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#595959" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="text-[#595959] font-medium text-[11px]">{dashboardData.period.date}</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#FDD789]/10 flex items-center justify-center">
                     <div className="w-2 h-2 rounded-full bg-[#FDD789]" />
                  </div>
                  <span className="text-[#595959] font-medium text-[11px]">{dashboardData.period.status}</span>
               </div>
            </div>

            {/* 3. Main Title */}
            <div className="mb-4 pr-4">
              <h1 className="text-[28px] leading-[1.15] tracking-tight mb-3">
                <span className="font-bold text-[#FF9406]">{dashboardData.restaurant.name}</span>
                <span className="font-medium text-[#E1E1E1]">, como <br/>você nunca viu antes</span>
              </h1>
              <p className="font-normal text-[12px] text-[#888] leading-snug w-full max-w-[280px]">
                {dashboardData.overview.subtitle}
              </p>
            </div>

            {/* 4. Pills Grid (Fixed Layout 3-2) */}
            <div className="flex flex-col gap-3 mb-auto mt-4">
               {/* Row 1 */}
               <div className="flex gap-2">
                  {dashboardData.overview.tags.slice(0, 3).map((tag, idx) => (
                    <div key={idx} className="bg-[#151515] border border-[#222] rounded-full px-3 py-1.5 flex items-center gap-2">
                       <span className="text-[10px] text-[#999] whitespace-nowrap">{tag.label}</span>
                       <div className={`w-2.5 h-1 rounded-full ${tag.color ? 'bg-[#E2FD89]' : 'bg-[#FDD789]'}`} style={{ backgroundColor: tag.color || '#FDD789' }} />
                    </div>
                  ))}
               </div>
               {/* Row 2 */}
               <div className="flex gap-2">
                  {dashboardData.overview.tags.slice(3, 5).map((tag, idx) => (
                    <div key={idx + 3} className="bg-[#151515] border border-[#222] rounded-full px-3 py-1.5 flex items-center gap-2">
                       <span className="text-[10px] text-[#999] whitespace-nowrap">{tag.label}</span>
                       <div className={`w-2.5 h-1 rounded-full ${tag.color ? 'bg-[#E2FD89]' : 'bg-[#FDD789]'}`} style={{ backgroundColor: tag.color || '#FDD789' }} />
                    </div>
                  ))}
               </div>
            </div>

            {/* Bottom Link Removed */}
          </div>

          {/* COL 2 - Faturamento */}
          <div>
            <FinanceOverview data={dashboardData.revenue} />
          </div>

          {/* COL 3 - Ponto de Equilíbrio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-[2px]">
                <span className="font-semibold text-[11px] text-[#CACACA]">Ponto de Equilíbrio</span>
                <span className="font-normal text-[10px] text-[#595959]">Quando o lucro aparece</span>
              </div>
              <svg width="82" height="29" viewBox="0 0 82 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_2080_5850)">
                  <path d="M17.2083 15.5833C17.352 15.5833 17.4898 15.5263 17.5914 15.4247C17.6929 15.3231 17.75 15.1853 17.75 15.0417C17.75 14.898 17.6929 14.7602 17.5914 14.6587C17.4898 14.5571 17.352 14.5 17.2083 14.5C17.0647 14.5 16.9269 14.5571 16.8253 14.6587C16.7237 14.7602 16.6667 14.898 16.6667 15.0417C16.6667 15.1853 16.7237 15.3231 16.8253 15.4247C16.9269 15.5263 17.0647 15.5833 17.2083 15.5833ZM17.2083 17.75C17.352 17.75 17.4898 17.6929 17.5914 17.5914C17.6929 17.4898 17.75 17.352 17.75 17.2083C17.75 17.0647 17.6929 16.9269 17.5914 16.8253C17.4898 16.7237 17.352 16.6667 17.2083 16.6667C17.0647 16.6667 16.9269 16.7237 16.8253 16.8253C16.7237 16.9269 16.6667 17.0647 16.6667 17.2083C16.6667 17.352 16.7237 17.4898 16.8253 17.5914C16.9269 17.6929 17.0647 17.75 17.2083 17.75ZM15.0417 15.0417C15.0417 15.1853 14.9846 15.3231 14.883 15.4247C14.7814 15.5263 14.6437 15.5833 14.5 15.5833C14.3563 15.5833 14.2186 15.5263 14.117 15.4247C14.0154 15.3231 13.9583 15.1853 13.9583 15.0417C13.9583 14.898 14.0154 14.7602 14.117 14.6587C14.2186 14.5571 14.3563 14.5 14.5 14.5C14.6437 14.5 14.7814 14.5571 14.883 14.6587C14.9846 14.7602 15.0417 14.898 15.0417 15.0417ZM15.0417 17.2083C15.0417 17.352 14.9846 17.4898 14.883 17.5914C14.7814 17.6929 14.6437 17.75 14.5 17.75C14.3563 17.75 14.2186 17.6929 14.117 17.5914C14.0154 17.4898 13.9583 17.352 13.9583 17.2083C13.9583 17.0647 14.0154 16.9269 14.117 16.8253C14.2186 16.7237 14.3563 16.6667 14.5 16.6667C14.6437 16.6667 14.7814 16.7237 14.883 16.8253C14.9846 16.9269 15.0417 17.0647 15.0417 17.2083ZM11.7917 15.5833C11.9353 15.5833 12.0731 15.5263 12.1747 15.4247C12.2763 15.3231 12.3333 15.1853 12.3333 15.0417C12.3333 14.898 12.2763 14.7602 12.1747 14.6587C12.0731 14.5571 11.9353 14.5 11.7917 14.5C11.648 14.5 11.5102 14.5571 11.4087 14.6587C11.3071 14.7602 11.25 14.898 11.25 15.0417C11.25 15.1853 11.3071 15.3231 11.4087 15.4247C11.5102 15.5263 11.648 15.5833 11.7917 15.5833ZM11.7917 17.75C11.9353 17.75 12.0731 17.6929 12.1747 17.5914C12.2763 17.4898 12.3333 17.352 12.3333 17.2083C12.3333 17.0647 12.2763 16.9269 12.1747 16.8253C12.0731 16.7237 11.9353 16.6667 11.7917 16.6667C11.648 16.6667 11.5102 16.7237 11.4087 16.8253C11.3071 16.9269 11.25 17.0647 11.25 17.2083C11.25 17.352 11.3071 17.4898 11.4087 17.5914C11.5102 17.6929 11.648 17.75 11.7917 17.75Z" fill="#C4C4C4"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.7917 8.94791C11.8994 8.94791 12.0027 8.99072 12.0789 9.0669C12.1551 9.14309 12.1979 9.24642 12.1979 9.35416V9.76746C12.5565 9.76041 12.9514 9.76041 13.3858 9.76041H15.6137C16.0486 9.76041 16.4435 9.76041 16.8021 9.76746V9.35416C16.8021 9.24642 16.8449 9.14309 16.9211 9.0669C16.9972 8.99072 17.1006 8.94791 17.2083 8.94791C17.3161 8.94791 17.4194 8.99072 17.4956 9.0669C17.5718 9.14309 17.6146 9.24642 17.6146 9.35416V9.80212C17.7554 9.81296 17.8888 9.82668 18.0149 9.84329C18.6497 9.92887 19.1637 10.1087 19.5694 10.5139C19.9746 10.9196 20.1544 11.4336 20.24 12.0685C20.3229 12.686 20.3229 13.4741 20.3229 14.4697V15.6137C20.3229 16.6092 20.3229 17.3979 20.24 18.0149C20.1544 18.6497 19.9746 19.1637 19.5694 19.5695C19.1637 19.9746 18.6497 20.1545 18.0149 20.24C17.3974 20.3229 16.6092 20.3229 15.6137 20.3229H13.3869C12.3913 20.3229 11.6026 20.3229 10.9857 20.24C10.3508 20.1545 9.83678 19.9746 9.43107 19.5695C9.0259 19.1637 8.84607 18.6497 8.76049 18.0149C8.67761 17.3974 8.67761 16.6092 8.67761 15.6137V14.4697C8.67761 13.4741 8.67761 12.6854 8.76049 12.0685C8.84607 11.4336 9.0259 10.9196 9.43107 10.5139C9.83678 10.1087 10.3508 9.92887 10.9857 9.84329C11.112 9.82668 11.2455 9.81296 11.3859 9.80212V9.35416C11.3859 9.24651 11.4287 9.14326 11.5047 9.06709C11.5808 8.99092 11.684 8.94806 11.7917 8.94791ZM11.0929 10.6487C10.5485 10.7219 10.2344 10.8595 10.0052 11.0886C9.77611 11.3177 9.63853 11.6319 9.5654 12.1762C9.55313 12.2683 9.54265 12.3657 9.53399 12.4682H19.466C19.4573 12.3657 19.4468 12.2682 19.4346 12.1757C19.3614 11.6313 19.2239 11.3172 18.9947 11.088C18.7656 10.8589 18.4514 10.7213 17.9065 10.6482C17.3502 10.5735 16.6163 10.5724 15.5833 10.5724H13.4167C12.3837 10.5724 11.6503 10.574 11.0929 10.6487ZM9.48957 14.5C9.48957 14.0374 9.48957 13.635 9.49661 13.2812H19.5034C19.5104 13.635 19.5104 14.0374 19.5104 14.5V15.5833C19.5104 16.6163 19.5093 17.3502 19.4346 17.9071C19.3614 18.4515 19.2239 18.7656 18.9947 18.9947C18.7656 19.2239 18.4514 19.3615 17.9065 19.4346C17.3502 19.5093 16.6163 19.5104 15.5833 19.5104H13.4167C12.3837 19.5104 11.6503 19.5093 11.0929 19.4346C10.5485 19.3615 10.2344 19.2239 10.0052 18.9947C9.77611 18.7656 9.63853 18.4515 9.5654 17.9065C9.49065 17.3502 9.48957 16.6163 9.48957 15.5833V14.5Z" fill="#C4C4C4"/>
                </g>
                <path d="M25.54 19V18.32L27.6 16.09C28.0067 15.6567 28.33 15.3 28.57 15.02C28.8167 14.74 28.9967 14.49 29.11 14.27C29.2233 14.05 29.28 13.8167 29.28 13.57C29.28 13.1633 29.16 12.85 28.92 12.63C28.68 12.41 28.3633 12.3 27.97 12.3C27.57 12.3 27.23 12.4167 26.95 12.65C26.67 12.8767 26.4767 13.2 26.37 13.62L25.48 13.39C25.5667 12.99 25.7267 12.6433 25.96 12.35C26.1933 12.0567 26.4833 11.83 26.83 11.67C27.1767 11.51 27.5567 11.43 27.97 11.43C28.4233 11.43 28.82 11.52 29.16 11.7C29.5067 11.8733 29.7767 12.1167 29.97 12.43C30.17 12.7433 30.27 13.1067 30.27 13.52C30.27 13.7933 30.2133 14.06 30.1 14.32C29.9867 14.58 29.82 14.8567 29.6 15.15C29.38 15.4367 29.0933 15.77 28.74 16.15L26.9 18.15H30.43V19H25.54ZM34.1363 19.12C33.6363 19.12 33.193 19.02 32.8063 18.82C32.4263 18.62 32.1263 18.35 31.9063 18.01C31.693 17.6633 31.5863 17.2767 31.5863 16.85C31.5863 16.37 31.7197 15.95 31.9863 15.59C32.253 15.23 32.6197 14.9733 33.0863 14.82L33.0663 15.07C32.713 14.93 32.4363 14.7067 32.2363 14.4C32.043 14.0867 31.9463 13.75 31.9463 13.39C31.9463 13.01 32.0397 12.6733 32.2263 12.38C32.4197 12.0867 32.6797 11.8567 33.0063 11.69C33.3397 11.5167 33.7163 11.43 34.1363 11.43C34.5563 11.43 34.9297 11.5133 35.2563 11.68C35.583 11.8467 35.8397 12.08 36.0263 12.38C36.2197 12.6733 36.3163 13.01 36.3163 13.39C36.3163 13.77 36.213 14.11 36.0063 14.41C35.8063 14.71 35.5397 14.9333 35.2063 15.08L35.1763 14.82C35.6497 14.9733 36.0197 15.2333 36.2863 15.6C36.553 15.96 36.6863 16.3767 36.6863 16.85C36.6863 17.2767 36.5763 17.6633 36.3563 18.01C36.143 18.35 35.843 18.62 35.4563 18.82C35.0763 19.02 34.6363 19.12 34.1363 19.12ZM34.1363 18.27C34.4497 18.27 34.723 18.21 34.9563 18.09C35.1897 17.97 35.3697 17.8033 35.4963 17.59C35.6297 17.37 35.6963 17.12 35.6963 16.84C35.6963 16.5533 35.6297 16.3033 35.4963 16.09C35.3697 15.87 35.1897 15.7033 34.9563 15.59C34.723 15.47 34.4497 15.41 34.1363 15.41C33.823 15.41 33.5463 15.47 33.3063 15.59C33.073 15.7033 32.893 15.87 32.7663 16.09C32.6397 16.3033 32.5763 16.5533 32.5763 16.84C32.5763 17.12 32.6397 17.37 32.7663 17.59C32.893 17.8033 33.073 17.97 33.3063 18.09C33.5463 18.21 33.823 18.27 34.1363 18.27ZM34.1363 14.56C34.363 14.56 34.563 14.51 34.7363 14.41C34.9163 14.31 35.0597 14.1767 35.1663 14.01C35.273 13.8367 35.3263 13.6367 35.3263 13.41C35.3263 13.1833 35.273 12.9867 35.1663 12.82C35.0597 12.6533 34.9163 12.5233 34.7363 12.43C34.563 12.33 34.363 12.28 34.1363 12.28C33.903 12.28 33.6963 12.33 33.5163 12.43C33.3363 12.5233 33.193 12.6533 33.0863 12.82C32.9797 12.9867 32.9263 13.1833 32.9263 13.41C32.9263 13.6367 32.9797 13.8367 33.0863 14.01C33.193 14.1767 33.3363 14.31 33.5163 14.41C33.6963 14.51 33.903 14.56 34.1363 14.56ZM39.5039 19V18.05H39.9139C40.2672 18.05 40.5472 17.9467 40.7539 17.74C40.9606 17.5267 41.0639 17.24 41.0639 16.88V11.55H42.0539V16.86C42.0539 17.2933 41.9639 17.67 41.7839 17.99C41.6106 18.31 41.3639 18.56 41.0439 18.74C40.7239 18.9133 40.3472 19 39.9139 19H39.5039ZM45.1613 19.12C44.808 19.12 44.4947 19.0567 44.2213 18.93C43.9547 18.7967 43.7447 18.6167 43.5913 18.39C43.438 18.1567 43.3613 17.89 43.3613 17.59C43.3613 17.3033 43.4213 17.0467 43.5413 16.82C43.668 16.5867 43.8613 16.39 44.1213 16.23C44.388 16.07 44.7213 15.9567 45.1213 15.89L47.1213 15.56V16.34L45.3313 16.64C44.9847 16.7 44.7313 16.81 44.5713 16.97C44.418 17.13 44.3413 17.3267 44.3413 17.56C44.3413 17.78 44.428 17.9633 44.6013 18.11C44.7813 18.2567 45.0047 18.33 45.2713 18.33C45.6113 18.33 45.9047 18.26 46.1513 18.12C46.4047 17.9733 46.6013 17.7767 46.7413 17.53C46.888 17.2833 46.9613 17.01 46.9613 16.71V15.34C46.9613 15.0467 46.8513 14.81 46.6313 14.63C46.418 14.4433 46.1347 14.35 45.7813 14.35C45.4747 14.35 45.2013 14.43 44.9613 14.59C44.728 14.7433 44.5547 14.95 44.4413 15.21L43.6313 14.79C43.7313 14.5433 43.8913 14.3233 44.1113 14.13C44.3313 13.93 44.588 13.7733 44.8813 13.66C45.1747 13.5467 45.4813 13.49 45.8013 13.49C46.2147 13.49 46.578 13.57 46.8913 13.73C47.2047 13.8833 47.448 14.1 47.6213 14.38C47.8013 14.6533 47.8913 14.9733 47.8913 15.34V19H46.9813V17.98L47.1513 18.04C47.038 18.2533 46.8847 18.44 46.6913 18.6C46.498 18.76 46.2713 18.8867 46.0113 18.98C45.7513 19.0733 45.468 19.12 45.1613 19.12ZM49.3333 19V13.61H50.2433V14.66L50.0933 14.57C50.2266 14.23 50.4399 13.9667 50.7333 13.78C51.0333 13.5867 51.3833 13.49 51.7833 13.49C52.1699 13.49 52.5133 13.5767 52.8133 13.75C53.1199 13.9233 53.3599 14.1633 53.5333 14.47C53.7133 14.7767 53.8033 15.1233 53.8033 15.51V19H52.8633V15.81C52.8633 15.51 52.8099 15.2567 52.7033 15.05C52.5966 14.8433 52.4433 14.6833 52.2433 14.57C52.0499 14.45 51.8266 14.39 51.5733 14.39C51.3199 14.39 51.0933 14.45 50.8933 14.57C50.6999 14.6833 50.5466 14.8467 50.4333 15.06C50.3199 15.2667 50.2633 15.5167 50.2633 15.81V19H49.3333Z" fill="#595959"/>
                <rect x="62" y="12.7968" width="7.50943" height="3.40634" rx="1.70317" fill="#FD8989"/>
                <rect x="60.2968" y="11.0937" width="10.9158" height="6.81269" rx="3.40634" stroke="#FD8989" strokeOpacity="0.19" strokeWidth="3.40634"/>
                <defs>
                  <clipPath id="clip0_2080_5850">
                    <rect width="13" height="13" fill="white" transform="translate(8 8)"/>
                  </clipPath>
                </defs>
              </svg>
            </div>

            {/* Gauge Chart */}
            <div className="w-full mb-2">
              <BreakEvenGraphic 
                percentage={dashboardData.breakEven.percentage}
                value={`R$ ${dashboardData.breakEven.current}`}
              />
            </div>


            {/* Info tooltip */}
            <div className="p-2.5 bg-[#1B1B1D] border border-[#2F2F31] rounded-[8px] mb-3">
              <p className="font-normal text-[8px] text-[#7E7E7E] leading-[1.4]">
                A partir do ponto de equilíbrio, cada venda contribui diretamente para o lucro real do negócio. Mantenha os custos fixos controlados para atingir essa meta mais cedo.
              </p>
            </div>

            {/* Base Info Box */}
            <div className="p-3 bg-[#FF9406] rounded-[10px] flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[10px] text-black">Base %</span>
                <span className="px-2 py-0.5 bg-black/20 rounded text-[8px] text-black">{dashboardData.breakEven.base.status}</span>
              </div>
              <span className="font-semibold text-[18px] text-black">{dashboardData.breakEven.base.value}</span>
              <p className="font-normal text-[9px] text-black/70">Faixa saudável: {dashboardData.breakEven.base.range}</p>
            </div>
          </div>

          {/* COL 4 - Comparativo de mercado (REMOVED) */}
        </div>
        </div>
      </div>

      {/* BOTTOM ROW - Cards (full-width bg) */}
      <div className="bg-[#1B1B1D] pl-3 md:pl-[85px] pr-3 md:pr-6 py-6 w-full flex-1">
        <div className="w-full px-3 md:px-0 2xl:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <MoneyOnTable data={dashboardData.cards.moneyOnTable} />
            <TechnicalSheets data={dashboardData.cards.technicalSheets} />
            <CostStructure data={dashboardData.cards.costStructure} />
          </div>
        </div>
      </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;
