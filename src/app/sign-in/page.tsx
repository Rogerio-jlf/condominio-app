"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { z } from "zod";

import {
  FaLock,
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeLowVision } from "react-icons/fa6";
import { ButtonLoader } from "@/components/Loading";

// Schema de validação Zod
const signInSchema = z.object({
  email: z
    .string()
    .min(1, "E-mail é obrigatório.")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
      'E-mail deve conter, "@" seguido de domínio e extensão válida.'
    ),
  password: z.string().min(1, "Senha é obrigatória."),
});

// ================================================================================
// COMPONENTE PRINCIPAL
// ================================================================================
export default function SignInPage() {
  const router = useRouter();

  // ========================================
  // ESTADOS
  // ========================================
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [fieldValid, setFieldValid] = useState<{
    email?: boolean;
    password?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  // ========================================

  // Valida campo individual ao sair (onBlur)
  const handleFieldBlur = (fieldName: "email" | "password", value: string) => {
    if (!value) return;

    const fieldSchema = z.object({
      [fieldName]: signInSchema.shape[fieldName],
    });

    const validation = fieldSchema.safeParse({ [fieldName]: value });

    if (validation.success) {
      setFieldValid((prev) => ({ ...prev, [fieldName]: true }));
      setFieldErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    } else {
      setFieldValid((prev) => ({ ...prev, [fieldName]: false }));
      const errorMessage = validation.error.issues[0]?.message;
      setFieldErrors((prev) => ({ ...prev, [fieldName]: errorMessage }));
    }
  };

  const handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailValue(e.target.value);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(e.target.value);
  };

  // ========================================
  // FUNÇÃO SUBMIT
  // ========================================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = signInSchema.safeParse(rawData);

    if (!validation.success) {
      const errors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as "email" | "password";
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    const res = await signIn.email({
      email: validation.data.email,
      password: validation.data.password,
    });

    if (res.error) {
      setError(res.error.message || "Algo deu errado.");
      setIsLoading(false);
    } else {
      router.push("/painel");
    }
  }

  // ========================================
  // RENDERIZAÇÃO
  // ========================================
  return (
    <div
      className="min-h-screen flex bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/img-fundo-sign-in8.jpg')" }}
    >
      {/* Overlay global */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* LADO ESQUERDO - SEÇÃO INFORMATIVA */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Overlay adicional para melhorar legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/60 to-transparent"></div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white w-full">
          <div className="max-w-xl space-y-8 flex flex-col items-center">
            {/* Logo e Nome do Sistema */}
            <div className="text-center space-y-4">
              {/* <div className="inline-flex items-center justify-center p-6 bg-blue-500/20 rounded-full shadow-2xl">
                <FaBuilding className="text-blue-400" size={60} />
              </div> */}
              <h2 className="text-5xl font-extrabold tracking-wider">
                CondoManager
              </h2>
              <p className="text-xl text-slate-300 font-semibold italic tracking-wide">
                Gestão Inteligente para seu Condomínio
              </p>
            </div>

            {/* Descrição */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <p className="text-lg text-slate-200 leading-relaxed text-justify">
                Simplifique a administração do seu condomínio com nossa
                plataforma completa. Controle financeiro, gestão de moradores e
                relatórios detalhados em um só lugar.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <FaChartLine className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Controle Financeiro
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Acompanhe receitas, despesas e gere relatórios completos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <FaUsers className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Gestão de Moradores
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Cadastre e gerencie informações de todos os condôminos
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg">
                  <FaFileInvoiceDollar className="text-blue-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    Boletos e Cobranças
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Emita boletos e controle pagamentos automaticamente
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO - FORMULÁRIO */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Overlay adicional para o lado do formulário */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 to-transparent"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Card do formulário */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center justify-center p-4 bg-blue-500/20 rounded-full shadow-xl shadow-black">
                <FaBuilding className="text-blue-400" size={40} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-3xl font-extrabold tracking-widest select-none text-white">
                  Entrar
                </h1>
                <p className="text-slate-300 tracking-widest font-semibold select-none text-base italic text-center">
                  Acesse sua conta
                </p>
              </div>
            </header>

            {/* Mensagem de erro geral */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm tracking-widest">{error}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Campo Email */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <MdEmail
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
                      emailFocused ? "text-white" : "text-slate-300"
                    }`}
                    size={24}
                  />
                  <input
                    name="email"
                    type="email"
                    value={emailValue}
                    onChange={handleEmailInput}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={(e) => {
                      setEmailFocused(false);
                      handleFieldBlur("email", e.target.value);
                    }}
                    className={`w-full pl-14 p-4 bg-white/10 tracking-widest font-semibold text-white text-base shadow-md shadow-black ${
                      fieldErrors.email
                        ? "border border-red-500 shadow-none"
                        : fieldValid.email
                        ? "border border-green-500 shadow-none"
                        : "border-none"
                    } rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 ${
                      fieldErrors.email
                        ? "focus:ring-red-400"
                        : fieldValid.email
                        ? "focus:ring-green-400"
                        : "focus:ring-blue-400"
                    } focus:border-transparent transition-all peer`}
                  />

                  <label
                    htmlFor="email"
                    className={`absolute left-0 transition-all pointer-events-none ${
                      emailFocused || emailValue
                        ? "-top-6 text-sm text-white tracking-widest"
                        : "top-1/2 -translate-y-1/2 pl-14 text-base text-slate-300 italic font-semibold tracking-widest"
                    }`}
                  >
                    Email
                  </label>
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-300 tracking-widest select-none font-medium italic">
                    {fieldErrors.email}
                  </p>
                )}
                {fieldValid.email && !fieldErrors.email && (
                  <p className="text-xs text-green-300 tracking-widest select-none font-medium italic">
                    ✓ E-mail válido
                  </p>
                )}
              </div>

              {/* Campo Senha */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <FaLock
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
                      passwordFocused ? "text-white" : "text-slate-300"
                    }`}
                    size={24}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={passwordValue}
                    onFocus={() => setPasswordFocused(true)}
                    onChange={handlePasswordInput}
                    onBlur={(e) => {
                      setPasswordFocused(false);
                      handleFieldBlur("password", e.target.value);
                    }}
                    className={`w-full pl-14 p-4 bg-white/10 tracking-widest font-semibold text-white text-base shadow-md shadow-black ${
                      fieldErrors.password
                        ? "border border-red-500 shadow-none"
                        : fieldValid.password
                        ? "border border-green-500 shadow-none"
                        : "border-none"
                    } rounded-lg text-white placeholder-transparent focus:outline-none focus:ring-2 ${
                      fieldErrors.password
                        ? "focus:ring-red-400"
                        : fieldValid.password
                        ? "focus:ring-green-400"
                        : "focus:ring-blue-400"
                    } focus:border-transparent transition-all peer`}
                  />

                  <label
                    htmlFor="password"
                    className={`absolute left-0 transition-all pointer-events-none ${
                      passwordFocused || passwordValue
                        ? "-top-6 text-sm text-white tracking-widest"
                        : "top-1/2 -translate-y-1/2 pl-14 text-base text-slate-300 italic font-semibold tracking-widest"
                    }`}
                  >
                    Senha
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors z-10"
                  >
                    {showPassword ? (
                      <FaEyeLowVision
                        className={`cursor-pointer hover:text-white hover:scale-125 transition-all active:scale-95 ${
                          passwordFocused ? "text-white" : "text-slate-300"
                        }`}
                        size={20}
                      />
                    ) : (
                      <FaEye
                        className={`cursor-pointer hover:text-white hover:scale-125 transition-all active:scale-95 ${
                          passwordFocused ? "text-white" : "text-slate-300"
                        }`}
                        size={20}
                      />
                    )}
                  </button>
                </div>

                {fieldErrors.password && (
                  <p className="text-xs text-red-300 tracking-widest select-none font-medium italic">
                    {fieldErrors.password}
                  </p>
                )}
                {fieldValid.password && !fieldErrors.password && (
                  <p className="text-xs text-green-300 tracking-widest select-none font-medium italic">
                    ✓ Senha válida
                  </p>
                )}
              </div>

              {/* Link Esqueci minha senha */}
              <div className="text-right -mt-4">
                <a
                  href="/forgot-password"
                  className="text-blue-400 hover:text-white text-sm font-semibold italic select-none underline transition-all"
                >
                  Esqueci minha senha
                </a>
              </div>

              {/* Botão Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-lg text-white font-extrabold p-3 rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-105 active:scale-95"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <ButtonLoader size={20} />
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            {/* Link para cadastro */}
            <div className="text-center">
              <p className="text-slate-300 text-sm tracking-widest font-semibold select-none italic">
                Não possui uma conta?{" "}
                <a
                  href="/sign-up"
                  className="text-blue-500 hover:text-white font-extrabold italic select-none underline transition-all"
                >
                  Criar conta
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-slate-300 text-xs tracking-widest select-none font-medium italic mt-6">
            Ao entrar, você concorda com nossos{" "}
            <a
              href="#"
              className="underline hover:text-white font-extrabold italic"
            >
              Termos de Uso
            </a>{" "}
            e{" "}
            <a
              href="#"
              className="underline hover:text-white font-extrabold italic"
            >
              Política de Privacidade
            </a>
          </footer>
        </div>
      </div>
    </div>
  );
}
