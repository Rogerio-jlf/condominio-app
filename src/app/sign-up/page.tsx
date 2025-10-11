"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { z } from "zod";

import {
  FaUser,
  FaLock,
  FaBuilding,
  FaChartLine,
  FaUsers,
  FaFileInvoiceDollar,
  FaShieldAlt,
  FaClock,
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaEye, FaEyeLowVision } from "react-icons/fa6";
import { ButtonLoader } from "@/components/Loading";

// Schema de validação Zod
const signUpSchema = z.object({
  name: z
    .string()
    .min(9, "Nome deve conter, no mínimo 9 caracteres.")
    .regex(/^[A-Za-zÀ-ÿ\s]+$/, "Nome deve conter, apenas letras e espaços.")
    .transform((name) => {
      return name
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }),
  email: z
    .string()
    .min(1, "E-mail é obrigatório.")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/,
      'E-mail deve conter, "@" seguido de domínio e extensão válida.'
    ),
  password: z
    .string()
    .min(8, "Senha deve conter, no mínimo 8 caracteres.")
    .regex(/[A-Z]/, "Senha deve conter, pelo menos uma letra maiúscula.")
    .regex(/[a-z]/, "Senha deve conter, pelo menos uma letra minúscula.")
    .regex(/[0-9]/, "Senha deve conter, pelo menos um número.")
    .regex(
      /[@$!%*?&#^()_+=\-[\]{}|\\:;"'<>,.\/]/,
      "Senha deve conter, no mínimo um caractere especial"
    ),
});

// ================================================================================
// COMPONENTE PRINCIPAL
// ================================================================================
export default function SignUpPage() {
  const router = useRouter();

  // ========================================
  // ESTADOS
  // ========================================
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const [fieldValid, setFieldValid] = useState<{
    name?: boolean;
    email?: boolean;
    password?: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const [fullNameValue, setFullNameValue] = useState("");
  const [fullNameFocused, setFullNameFocused] = useState(false);

  const [emailValue, setEmailValue] = useState("");
  const [emailFocused, setEmailFocused] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordFocused, setPasswordFocused] = useState(false);
  // ========================================

  // Valida campo individual ao sair (onBlur)
  const handleFieldBlur = (
    fieldName: "name" | "email" | "password",
    value: string
  ) => {
    if (!value) return;

    const fieldSchema = z.object({
      [fieldName]: signUpSchema.shape[fieldName],
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

  // Formata o nome enquanto digita
  const handleFullNameInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^A-Za-zÀ-ÿ\s]/g, "");

    const words = value.split(" ");
    const lowerCaseWords = ["e", "da", "das", "de", "di", "do", "dos"];

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (lowerCaseWords.includes(word) && i !== 0) {
        words[i] = word;
      } else if (word.length > 0) {
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      }
    }

    const formattedValueFullName = words.join(" ");
    setFullNameValue(formattedValueFullName);
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
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validation = signUpSchema.safeParse(rawData);

    if (!validation.success) {
      const errors: { name?: string; email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as "name" | "email" | "password";
        if (!errors[field]) {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    const res = await signUp.email({
      name: validation.data.name,
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
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex"
      style={{ backgroundImage: "url('/img-fundo-sign-in7.jpeg')" }}
    >
      {/* Overlay global */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* LADO ESQUERDO - SEÇÃO INFORMATIVA */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative">
        {/* Overlay adicional para melhorar legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent"></div>

        {/* Conteúdo */}
        <div className="relative z-10 flex flex-col items-center justify-center text-white w-full">
          <div className="max-w-xl space-y-8 flex flex-col items-center">
            {/* Logo e Chamada */}
            <div className="text-center space-y-4">
              {/* <div className="inline-flex items-center justify-center p-6 bg-blue-500/20 rounded-full shadow-2xl">
                <FaBuilding className="text-blue-400" size={60} />
              </div> */}
              <h2 className="text-5xl font-extrabold tracking-wider">
                Junte-se a Nós!
              </h2>
              <p className="text-xl text-slate-300 font-semibold italic tracking-wide">
                Crie sua conta e simplifique a gestão do seu condomínio
              </p>
            </div>

            {/* Descrição */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <p className="text-lg text-slate-200 leading-relaxed text-center">
                Cadastre-se agora e tenha acesso completo à plataforma mais
                moderna para gestão de condomínios. É rápido, fácil e totalmente
                seguro!
              </p>
            </div>

            {/* Benefícios */}
            <div className="w-full space-y-3">
              <h3 className="text-2xl font-bold text-center mb-6">
                Benefícios ao se cadastrar:
              </h3>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg flex-shrink-0">
                  <FaChartLine className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    Controle Financeiro Total
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Gerencie todas as receitas e despesas com relatórios
                    detalhados
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg flex-shrink-0">
                  <FaUsers className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    Gestão Completa de Moradores
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Cadastre e acompanhe todos os condôminos em um só lugar
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg flex-shrink-0">
                  <FaFileInvoiceDollar className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Emissão de Boletos</h4>
                  <p className="text-slate-300 text-sm">
                    Gere e controle boletos automaticamente
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg flex-shrink-0">
                  <FaShieldAlt className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">
                    Segurança Garantida
                  </h4>
                  <p className="text-slate-300 text-sm">
                    Seus dados protegidos com criptografia de ponta
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-all">
                <div className="bg-blue-500/20 p-3 rounded-lg flex-shrink-0">
                  <FaClock className="text-blue-400" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-1">Acesso 24/7</h4>
                  <p className="text-slate-300 text-sm">
                    Gerencie seu condomínio de qualquer lugar, a qualquer hora
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
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/60 to-transparent"></div>

        <div className="w-full max-w-md relative z-10">
          {/* Card principal */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col gap-8">
            {/* Header */}
            <header className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center justify-center p-4 bg-blue-500/20 rounded-full shadow-xl shadow-black">
                <FaBuilding className="text-blue-400" size={40} />
              </div>
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-3xl font-extrabold tracking-widest select-none text-white">
                  Criar Conta
                </h1>
                <p className="text-slate-300 tracking-widest font-semibold select-none text-base italic text-center">
                  Preencha os dados abaixo
                </p>
              </div>
            </header>

            {/* Mensagem de erro geral */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Campo Nome */}
              <div className="flex flex-col gap-1">
                <div className="relative">
                  <FaUser
                    className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 ${
                      fullNameFocused ? "text-white" : "text-slate-300"
                    }`}
                    size={24}
                  />

                  <div className="relative">
                    <input
                      name="name"
                      type="text"
                      value={fullNameValue}
                      onChange={handleFullNameInput}
                      onFocus={() => setFullNameFocused(true)}
                      onBlur={(e) => {
                        setFullNameFocused(false);
                        handleFieldBlur("name", e.target.value);
                      }}
                      className={`w-full pl-14 p-4 bg-white/10 tracking-widest font-semibold text-white text-base shadow-md shadow-black ${
                        fieldErrors.name
                          ? "border border-red-500 shadow-none"
                          : fieldValid.name
                          ? "border border-green-500 shadow-none"
                          : "border-none"
                      } rounded-lg placeholder-transparent focus:outline-none focus:ring-2 ${
                        fieldErrors.name
                          ? "focus:ring-red-300"
                          : fieldValid.name
                          ? "focus:ring-green-300"
                          : "focus:ring-blue-300"
                      } focus:border-transparent transition-all peer`}
                    />

                    <label
                      htmlFor="fullname"
                      className={`absolute left-0 transition-all pointer-events-none ${
                        fullNameFocused || fullNameValue
                          ? "-top-6 text-sm text-white tracking-widest"
                          : "top-1/2 -translate-y-1/2 pl-14 text-base text-slate-300 italic font-semibold tracking-widest"
                      }`}
                    >
                      Nome Completo
                    </label>
                  </div>
                </div>
                {fieldErrors.name && (
                  <p className="text-xs text-red-300 tracking-widest select-none font-medium italic">
                    {fieldErrors.name}
                  </p>
                )}
                {fieldValid.name && !fieldErrors.name && (
                  <p className="text-xs text-green-300 tracking-widest select-none font-medium italic">
                    ✓ Nome válido
                  </p>
                )}
              </div>

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

                {fieldErrors.password ? (
                  <p className="text-xs text-red-300 tracking-widest select-none font-medium italic">
                    {fieldErrors.password}
                  </p>
                ) : fieldValid.password ? (
                  <p className="text-xs text-green-300 tracking-widest select-none font-medium italic">
                    ✓ Senha válida
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-200 text-justify tracking-widest select-none font-medium italic">
                    Senha deve conter, no mínimo 8 caracteres, sendo no mínimo
                    uma letra maiúscula, uma minúscula, um número e um caractere
                    especial.
                  </p>
                )}
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
                    Criando conta...
                  </span>
                ) : (
                  "Criar Conta"
                )}
              </button>
            </form>

            {/* Link para login */}
            <div className="text-center">
              <p className="text-slate-300 text-sm tracking-widest font-semibold select-none italic">
                Já possui uma conta?{" "}
                <a
                  href="/sign-in"
                  className="text-blue-500 hover:text-white font-extrabold italic select-none underline transition-all"
                >
                  Fazer login
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center text-slate-300 text-xs tracking-widest select-none font-medium italic mt-6">
            Ao criar uma conta, você concorda com nossos{" "}
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
