import React, { useState, useEffect } from 'react';
import { AccessibilityIcon, PlusIcon, MinusIcon, RefreshIcon, XIcon } from './icons/Icons';

const FONT_STEP = 2; // change font size by 2px
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const DEFAULT_FONT_SIZE = 16;

const AccessibilityMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState(DEFAULT_FONT_SIZE);
    const [isHighContrast, setIsHighContrast] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        root.style.fontSize = `${fontSize}px`;
        
        if (isHighContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
    }, [fontSize, isHighContrast]);

    const changeFontSize = (amount: number) => {
        setFontSize(prev => {
            const newSize = prev + amount;
            if (newSize >= MIN_FONT_SIZE && newSize <= MAX_FONT_SIZE) {
                return newSize;
            }
            return prev;
        });
    };
    
    const resetSettings = () => {
        setFontSize(DEFAULT_FONT_SIZE);
        setIsHighContrast(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 bg-cyan-600 text-white p-3 rounded-full shadow-lg hover:bg-cyan-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 z-40"
                aria-label="Abrir menu de acessibilidade"
            >
                <AccessibilityIcon className="h-6 w-6"/>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 left-6 bg-slate-800 border border-slate-600 text-white p-4 rounded-lg shadow-lg z-50 w-64 animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Acessibilidade</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-slate-400 hover:bg-slate-700">
                    <XIcon />
                </button>
            </div>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm">Tamanho da Fonte</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => changeFontSize(-FONT_STEP)} aria-label="Diminuir fonte" className="p-2 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50" disabled={fontSize <= MIN_FONT_SIZE}><MinusIcon /></button>
                        <span className="w-10 text-center text-sm">{Math.round((fontSize / DEFAULT_FONT_SIZE) * 100)}%</span>
                        <button onClick={() => changeFontSize(FONT_STEP)} aria-label="Aumentar fonte" className="p-2 bg-slate-700 rounded-md hover:bg-slate-600 disabled:opacity-50" disabled={fontSize >= MAX_FONT_SIZE}><PlusIcon /></button>
                    </div>
                </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm">Alto Contraste</span>
                    <label htmlFor="contrast-toggle" className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="contrast-toggle" className="sr-only peer" checked={isHighContrast} onChange={() => setIsHighContrast(p => !p)} />
                      <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-cyan-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                </div>
                <button onClick={resetSettings} className="w-full flex items-center justify-center space-x-2 mt-2 px-4 py-2 text-sm font-semibold text-white bg-slate-700 rounded-md hover:bg-slate-600 transition">
                    <RefreshIcon />
                    <span>Restaurar Padrão</span>
                </button>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.2s ease-out; }
            `}</style>
        </div>
    );
};

export default AccessibilityMenu;
