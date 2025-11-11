

import React, { useState, useRef, useEffect } from 'react';
import { LightbulbIcon, ChevronDownIcon } from './icons/Icons';
import { Screen } from '../types';

interface MainScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MainScreen: React.FC<MainScreenProps> = ({ onNavigate }) => {
    // Language state for TextToLibras
    const [inputLanguage, setInputLanguage] = useState<string>('Português');
    const [outputSignLanguage, setOutputSignLanguage] = useState<string>('Libras (Brasil)');

    const textLanguages = ["Português", "Inglês", "Espanhol"];
    const signLanguages = ["Libras (Brasil)", "ASL (Americana)", "LSE (Espanhola)"];


    return (
        <div className="flex flex-col h-screen bg-slate-900">
            <header className="p-4 bg-slate-800 shadow-md flex items-center justify-between">
                 <div className="w-10 h-10"></div> {/* Spacer for balance */}
                 <div className="flex-grow text-center">
                    <h1 className="text-xl font-bold text-white inline-block">Texto para Libras</h1>
                 </div>
                 <button 
                    onClick={() => onNavigate(Screen.CURIOSITIES)} 
                    className="text-slate-300 hover:text-cyan-400 p-2 rounded-full hover:bg-slate-700 transition-colors"
                    aria-label="Ver curiosidades sobre Libras"
                 >
                    <LightbulbIcon />
                </button>
            </header>

            <div className="flex-grow flex flex-col p-4 sm:p-8 overflow-auto items-center justify-center">
                <TextToLibras 
                    selectedInputLanguage={inputLanguage}
                    onInputLanguageChange={setInputLanguage}
                    inputLanguageOptions={textLanguages}
                    selectedOutputSignLanguage={outputSignLanguage}
                    onOutputSignLanguageChange={setOutputSignLanguage}
                    outputSignLanguageOptions={signLanguages}
                />
            </div>
        </div>
    );
};

interface LanguageSelectorProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}
const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, options, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none px-3 py-2 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                <ChevronDownIcon />
            </div>
        </div>
    </div>
);

interface TextToLibrasProps {
    selectedInputLanguage: string;
    onInputLanguageChange: (lang: string) => void;
    inputLanguageOptions: string[];
    selectedOutputSignLanguage: string;
    onOutputSignLanguageChange: (lang: string) => void;
    outputSignLanguageOptions: string[];
}
const TextToLibras: React.FC<TextToLibrasProps> = ({ selectedInputLanguage, onInputLanguageChange, inputLanguageOptions, selectedOutputSignLanguage, onOutputSignLanguageChange, outputSignLanguageOptions }) => {
    const [textToTranslate, setTextToTranslate] = useState('Boa noite, seja bem-vindo à UNI-IA!');
    const [isEditing, setIsEditing] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if (isEditing) {
            textAreaRef.current?.focus();
        }
    }, [isEditing]);

    return (
        <div className="w-full max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <LanguageSelector 
                    label="Idioma do Texto"
                    options={inputLanguageOptions}
                    value={selectedInputLanguage}
                    onChange={onInputLanguageChange}
                />
                <LanguageSelector 
                    label="Língua de Sinais"
                    options={outputSignLanguageOptions}
                    value={selectedOutputSignLanguage}
                    onChange={onOutputSignLanguageChange}
                />
            </div>
            
            <div className="relative">
                {isEditing ? (
                    <textarea 
                        ref={textAreaRef}
                        className="w-full p-3 bg-slate-700 border border-cyan-500 rounded-lg mb-4 text-white resize-none" 
                        placeholder="Digite ou cole texto aqui..."
                        rows={10}
                        value={textToTranslate}
                        onChange={(e) => setTextToTranslate(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                    />
                ) : (
                    <div 
                        className="w-full p-3 bg-slate-700 border border-slate-500 rounded-lg mb-4 text-white resize-none min-h-[260px] cursor-text whitespace-pre-wrap flex items-start"
                        onClick={() => setIsEditing(true)}
                        tabIndex={0}
                        role="textbox"
                        aria-label="Caixa de texto. Clique para editar."
                    >
                        {textToTranslate || <span className="text-slate-400">Digite ou cole texto aqui...</span>}
                    </div>
                )}
            </div>

            <div className="mt-4 p-4 bg-slate-800 border border-slate-700 rounded-lg text-center">
                <p className="text-slate-300 text-lg font-semibold">
                    Como traduzir?
                </p>
                <p className="text-sm text-slate-400 mt-2">
                    1. Clique no <span className="font-bold text-cyan-400">botão azul</span> flutuante para ativar o tradutor.
                </p>
                <p className="text-sm text-slate-400 mt-1">
                    2. <span className="font-bold text-cyan-400">Selecione qualquer texto</span> na tela para ver a tradução em Libras.
                </p>
            </div>
        </div>
    );
}

export default MainScreen;