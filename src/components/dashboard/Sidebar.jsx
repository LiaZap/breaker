import React from 'react';
import boltIcon from '../../assets/bolt.svg';

const Sidebar = ({ activePage = 'home', onNavigate }) => {
  return (
    <div 
      className="fixed left-[10px] top-[14px] hidden md:flex flex-col items-center py-5 z-50"
      style={{ width: '65px', height: 'calc(100vh - 28px)' }}
    >
      {/* Top Logo */}
      <div className="w-[65px] h-[64px] bg-[#1E1E1E] rounded-[20px] flex items-center justify-center">
        <div className="w-[44.72px] h-[44.72px] bg-black rounded-[10px] flex items-center justify-center">
          <img src={boltIcon} alt="Breakr" className="w-[20.72px] h-[20.72px]" />
        </div>
      </div>

      {/* Navigation Menu - centered vertically */}
      <div className="flex-1 flex items-center">
      <div className="w-[65px] bg-[#151515] rounded-[20px] flex flex-col items-center py-[10px] gap-[12px]">
        {/* Home */}
        <div 
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${activePage === 'home' ? 'bg-[#252527]' : 'hover:bg-[#1E1E1E]'}`}
          title="Dashboard"
          onClick={() => onNavigate && onNavigate('home')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5L12 3L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke={activePage === 'home' ? '#F5A623' : '#959387'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V14" stroke={activePage === 'home' ? '#F5A623' : '#959387'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        <div className="w-[34.61px] h-0 border-b border-white/10" />

        {/* Rolling Pin - Ficha Técnica */}
        <div 
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${activePage === 'fichaTecnica' ? 'bg-[#252527]' : 'hover:bg-[#1E1E1E]'}`}
          title="Ficha Técnica"
          onClick={() => onNavigate && onNavigate('fichaTecnica')}
        >
          <svg width="38" height="38" viewBox="0 0 44 44" fill="none">
            <path d="M18.8517 27.1792L17.2158 29.4692C17.1745 29.5298 17.1311 29.589 17.0858 29.6467C16.9314 29.8412 16.7388 30.0019 16.5198 30.1191C16.3008 30.2362 16.0602 30.3072 15.8127 30.3276C15.5652 30.3481 15.3162 30.3176 15.0809 30.238C14.8457 30.1585 14.6292 30.0315 14.445 29.865C14.3917 29.8151 14.3394 29.7639 14.2883 29.7117C14.2067 29.63 14.1658 29.5892 14.135 29.555C13.9684 29.3707 13.8413 29.1543 13.7617 28.9189C13.682 28.6836 13.6515 28.4345 13.6719 28.1869C13.6924 27.9393 13.7634 27.6985 13.8806 27.4795C13.9978 27.2604 14.1587 27.0678 14.3533 26.9133C14.39 26.885 14.4367 26.8508 14.5308 26.7842L16.8208 25.1483M18.8517 27.1792C18.5014 26.8528 18.1585 26.5186 17.8233 26.1767C17.4233 25.7767 17.0892 25.4433 16.8208 25.1483M18.8517 27.1792C19.4508 27.7225 19.8892 27.995 20.3933 27.995C21.1467 27.995 21.7517 27.3892 22.9642 26.1775L26.1767 22.9642C27.3892 21.7525 27.995 21.1467 27.995 20.3933C27.995 19.8892 27.7225 19.4508 27.1783 18.8517M16.8208 25.1483C16.2775 24.5492 16.0058 24.1108 16.0058 23.6067C16.0058 22.8533 16.6117 22.2483 17.8242 21.0358L21.0367 17.8233C22.2483 16.6108 22.8542 16.005 23.6075 16.005C24.1117 16.005 24.55 16.2775 25.1492 16.8217M25.1492 16.8217L26.785 14.5308C26.8268 14.4707 26.8698 14.4116 26.9142 14.3533C27.0686 14.1587 27.2613 13.9978 27.4803 13.8806C27.6994 13.7634 27.9401 13.6924 28.1877 13.6719C28.4353 13.6515 28.6845 13.682 28.9198 13.7617C29.1551 13.8413 29.3716 13.9684 29.5558 14.135C29.59 14.1658 29.6308 14.2067 29.7125 14.2883C29.7648 14.3394 29.8159 14.3917 29.8658 14.445C30.0323 14.6293 30.1593 14.8457 30.2389 15.0809C30.3184 15.3162 30.3489 15.5652 30.3285 15.8127C30.308 16.0602 30.237 16.3009 30.1199 16.5198C30.0028 16.7388 29.842 16.9314 29.6475 17.0858C29.6108 17.1158 29.5642 17.1492 29.47 17.2158L27.18 18.8517C26.8537 18.5014 26.5194 18.1585 26.1775 17.8233C25.7775 17.4233 25.4442 17.09 25.1492 16.8217Z" stroke={activePage === 'fichaTecnica' ? '#F5A623' : '#959387'}/>
          </svg>
        </div>

        {/* Medal/Badge - Matriz de Preço */}
        <div 
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${activePage === 'matrizPreco' ? 'bg-[#252527]' : 'hover:bg-[#1E1E1E]'}`}
          title="Matriz de Preço"
          onClick={() => onNavigate && onNavigate('matrizPreco')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="6" stroke={activePage === 'matrizPreco' ? '#F5A623' : '#959387'} strokeWidth="1.5"/>
            <path d="M8 14L6 22L12 19L18 22L16 14" stroke={activePage === 'matrizPreco' ? '#F5A623' : '#959387'} strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="w-[34.61px] h-0 border-b border-white/10" />

        {/* Engenharia de Menu */}
        <div 
          className={`w-[44px] h-[44px] rounded-[10px] flex items-center justify-center cursor-pointer transition-colors ${activePage === 'engenhariaMenu' ? 'bg-[#252527]' : 'hover:bg-[#1E1E1E]'}`}
          title="Engenharia de Menu"
          onClick={() => onNavigate && onNavigate('engenhariaMenu')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke={activePage === 'engenhariaMenu' ? '#F5A623' : '#959387'} strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="15" cy="6" r="2" fill={activePage === 'engenhariaMenu' ? '#F5A623' : '#959387'} fillOpacity="0.5"/>
            <circle cx="9" cy="12" r="2" fill={activePage === 'engenhariaMenu' ? '#F5A623' : '#959387'} fillOpacity="0.5"/>
            <circle cx="17" cy="18" r="2" fill={activePage === 'engenhariaMenu' ? '#F5A623' : '#959387'} fillOpacity="0.5"/>
          </svg>
        </div>
      </div>
      </div>


    </div>
  );
};

export default Sidebar;
