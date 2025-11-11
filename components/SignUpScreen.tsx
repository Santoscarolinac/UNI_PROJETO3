import React, { useState, useMemo } from 'react';
import { Screen } from '../types';
import { CheckCircleIcon, EyeIcon, EyeOffIcon, UploadIcon } from './icons/Icons';


interface SignUpScreenProps {
  onNavigate: (screen: Screen) => void;
}

const PasswordRequirement: React.FC<{isValid: boolean; text: string}> = ({ isValid, text }) => (
    <div className={`flex items-center text-xs ${isValid ? 'text-green-400' : 'text-slate-400'}`}>
        <CheckCircleIcon className="mr-2" />
        <span>{text}</span>
    </div>
);


const SignUpScreen: React.FC<SignUpScreenProps> = ({ onNavigate }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const passwordValidations = useMemo(() => ({
        length: password.length >= 6,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        symbol: /[^A-Za-z0-9]/.test(password),
        match: password && password === confirmPassword,
    }), [password, confirmPassword]);

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        onNavigate(Screen.ONBOARDING);
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-slate-900">
            <div className="w-full max-w-lg p-8 space-y-6 bg-slate-800 rounded-2xl shadow-lg">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Criar Conta</h1>
                    <p className="mt-2 text-slate-400">Vamos começar sua jornada para o controle.</p>
                </div>
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div className="flex items-center space-x-4">
                        <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center">
                            <UploadIcon />
                        </div>
                        <label htmlFor="profile-pic" className="cursor-pointer px-4 py-2 text-sm font-medium text-cyan-400 border border-cyan-400 rounded-md hover:bg-cyan-400 hover:text-slate-900">
                            Escolher Foto
                            <input id="profile-pic" type="file" className="hidden" />
                        </label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-300">Usuário</label>
                            <input type="text" required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-300">E-mail</label>
                            <input type="email" required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <label className="text-sm font-medium text-slate-300">Senha</label>
                        <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-slate-400 hover:text-cyan-400">{showPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                        <PasswordRequirement isValid={passwordValidations.length} text="Mín. 6 caracteres" />
                        <PasswordRequirement isValid={passwordValidations.uppercase} text="Letra maiúscula" />
                        <PasswordRequirement isValid={passwordValidations.lowercase} text="Letra minúscula" />
                        <PasswordRequirement isValid={passwordValidations.number} text="Um número" />
                        <PasswordRequirement isValid={passwordValidations.symbol} text="Um símbolo" />
                    </div>

                    <div className="relative">
                        <label className="text-sm font-medium text-slate-300">Confirmar Senha</label>
                        <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                         <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 top-6 px-3 flex items-center text-slate-400 hover:text-cyan-400">{showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}</button>
                    </div>
                     {confirmPassword && <PasswordRequirement isValid={passwordValidations.match} text="Senhas coincidem" />}
                    
                    <div className="flex items-start mt-4">
                        <input id="terms" type="checkbox" required className="h-4 w-4 mt-1 rounded border-slate-500 text-cyan-600 focus:ring-cyan-500 bg-slate-700" />
                        <div className="ml-3 text-sm">
                            <label htmlFor="terms" className="text-slate-300">Eu aceito os <a href="#" className="text-cyan-400 hover:underline">Termos de Uso e Política de Privacidade</a>.</label>
                        </div>
                    </div>

                    <button type="submit" className="w-full mt-4 px-4 py-2 font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition-transform transform hover:scale-105">Cadastrar</button>
                </form>
                <div className="text-center">
                    <p className="text-sm text-slate-400">
                        Já tem uma conta?{' '}
                        <button onClick={() => onNavigate(Screen.LOGIN)} className="font-medium text-cyan-400 hover:underline">
                        Entrar
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUpScreen;