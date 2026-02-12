
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressBar from './components/ProgressBar';
import QuizCard from './components/QuizCard';
import { QUIZ_PAGES } from './constants';
import { trackPageView, trackAnswer, trackEvent } from './analytics';
import { Option } from './types';
import { supabase } from './supabaseClient';

const App: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isFinished, setIsFinished] = useState(false);
  const [showOfferPage, setShowOfferPage] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [announcement, setAnnouncement] = useState('');
  const [sessionId] = useState(() => crypto.randomUUID());

  const headingRef = useRef<HTMLHeadingElement>(null);
  const currentPage = QUIZ_PAGES[currentPageIndex];
  const CHECKOUT_URL = "https://ggcheckout.com.br/checkout/v3/JeDtKOZnks8iNDFWtJKR";

  useEffect(() => {
    if (!isFinished && !showOfferPage) {
      if (headingRef.current) headingRef.current.focus();
      setAnnouncement(`Etapa ${currentPageIndex + 1} de ${QUIZ_PAGES.length}: ${currentPage.title}`);
      trackPageView(currentPageIndex + 1, currentPage.title);
    }
  }, [currentPageIndex, isFinished, showOfferPage, currentPage.title]);

  useEffect(() => {
    if (currentPageIndex === 5) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 2800);
      return () => clearTimeout(timer);
    }
  }, [currentPageIndex]);

  useEffect(() => {
    if (isFinished && !showOfferPage) {
      const timer = setTimeout(() => setShowCTA(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isFinished, showOfferPage]);

  const handleNext = useCallback(async (selectedOption: Option) => {
    setSelectedAnswers(prev => ({ ...prev, [currentPage.id]: selectedOption.id }));
    trackAnswer(currentPage.title, selectedOption.label);

    // Save response to database
    await supabase.from('quiz_responses').insert({
      session_id: sessionId,
      question_id: currentPage.id,
      answer_id: selectedOption.id,
      answer_label: selectedOption.label
    });

    if (currentPageIndex < QUIZ_PAGES.length - 1) {
      setDirection(1);
      setCurrentPageIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinished(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPageIndex, currentPage, sessionId]);

  const handleBack = useCallback(() => {
    if (currentPageIndex > 0) {
      setDirection(-1);
      setCurrentPageIndex(prev => prev - 1);
    }
  }, [currentPageIndex]);

  const getDiagnosis = () => {
    const p2 = selectedAnswers[2];
    const p5 = selectedAnswers[5];

    if (p2 === "2a" && p5 === "5a") {
      return {
        title: "Gestão por Intuição",
        status: "Risco de Invisibilidade",
        desc: "Sua operação hoje depende quase totalmente da sua memória e do 'feeling'. O dinheiro entra e sai, mas você não consegue enxergar o lucro real descontando a inflação e o risco. O risco aqui é invisível: você pode estar corroendo patrimônio enquanto acredita que está lucrando.",
        points: [
          "Inexistência de fluxo de caixa projetado para 90 dias.",
          "Confusão entre capital de giro e lucro disponível.",
          "Vulnerabilidade alta a atrasos inesperados."
        ]
      };
    }
    return {
      title: "Gestão em Transição",
      status: "Pronto para Modernização",
      desc: "Você já entendeu que emprestar dinheiro é um negócio sério. Tem clareza sobre seus números, mas ainda gasta energia demais em processos manuais.",
      points: ["Sistemas atuais tomam tempo", "Escala limitada", "Necessidade de padronizar"]
    };
  };

  const diagnosis = getDiagnosis();

  // Save session to database when quiz is finished
  useEffect(() => {
    if (isFinished && !showOfferPage) {
      supabase.from('quiz_sessions').insert({
        id: sessionId,
        diagnosis_title: diagnosis.title,
        diagnosis_status: diagnosis.status,
        converted: false
      });
    }
  }, [isFinished, showOfferPage, sessionId, diagnosis.title, diagnosis.status]);

  // --- PÁGINA DE OFERTA ---
  if (showOfferPage) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-white text-slate-900 pb-20 overflow-x-hidden">
        <header className="py-4 sm:py-6 px-6 border-b border-slate-50 flex justify-center sticky top-0 bg-white/80 backdrop-blur-md z-[60]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center p-1.5 shadow-sm">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="5" y="5" width="90" height="90" rx="20" fill="none" stroke="white" strokeWidth="8" />
                <path d="M30 50 L45 65 L70 35" stroke="#B5E48C" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-slate-900 tracking-tight">JurosCerto</span>
          </div>
        </header>

        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-10 sm:pt-20">
          <section className="text-center mb-10 sm:mb-20">
            <h1 className="text-3xl sm:text-6xl font-black mb-6 tracking-tight leading-[1.1] text-slate-900">
              Assuma o controle real da sua operação hoje.
            </h1>
            <p className="text-base sm:text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl mx-auto px-2">
              Transforme seu diagnóstico em lucro previsível com a ferramenta que organiza juros, prazos e fluxo de caixa.
            </p>
          </section>

          {/* BLOCO DE OFERTA HERO */}
          <section className="relative overflow-hidden bg-slate-900 text-white rounded-[32px] sm:rounded-[48px] shadow-[0_40px_80px_-15px_rgba(30,41,59,0.25)] mb-16 sm:mb-24 border border-slate-800">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[60%] bg-blue-600/20 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 p-6 sm:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                <div className="lg:col-span-7 order-2 lg:order-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] mb-6 sm:mb-8 border border-blue-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    Acesso Imediato Liberado
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 tracking-tight leading-tight">
                    O Juros Certo <br className="hidden sm:block" />
                    <span className="text-blue-400">é seu aliado estratégico.</span>
                  </h2>
                  <ul className="space-y-3 sm:space-y-5">
                    {[
                      "Análise completa desbloqueada",
                      "Simulador inteligente de contratos",
                      "Projeção automática de fluxo de caixa",
                      "Visão consolidada de rentabilidade",
                      "Gestão profissional de ativos"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 sm:gap-4 text-slate-300 font-bold text-base sm:text-lg leading-tight">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:col-span-5 order-1 lg:order-2">
                  <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 p-6 sm:p-10 rounded-[28px] sm:rounded-[40px] w-full text-center relative shadow-2xl">
                    <div className="absolute -top-3 right-4 sm:-right-4 sm:top-6 bg-emerald-500 text-white font-black px-4 py-1.5 rounded-xl shadow-xl rotate-[2deg] text-[11px] sm:text-sm tracking-tighter">
                      30% de desconto
                    </div>

                    <div className="mb-6 sm:mb-8">
                      <span className="text-slate-500 font-bold line-through text-lg sm:text-xl opacity-60">De R$ 97,00</span>
                      <div className="flex items-start justify-center mt-2">
                        <span className="text-2xl sm:text-3xl font-black text-blue-400 mt-2 mr-0.5 sm:mr-1">R$</span>
                        <span className="text-7xl sm:text-9xl font-black tracking-tighter text-white leading-none">67</span>
                        <div className="flex flex-col items-start mt-2 ml-0.5 sm:ml-1">
                          <span className="text-2xl sm:text-3xl font-bold text-slate-400">,00</span>
                          <span className="text-[9px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-1.5 py-0.5 rounded-md mt-1">Taxa Única</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-4 mb-6 sm:mb-8">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        pagamento seguro
                      </div>
                    </div>

                    <a
                      href={CHECKOUT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("CTA Clicked - Hero Discount")}
                      className="group relative w-full inline-flex items-center justify-center py-5 sm:py-7 bg-blue-600 hover:bg-blue-500 text-white rounded-[20px] sm:rounded-[24px] font-black text-xl sm:text-3xl transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:-translate-y-1 active:scale-[0.98] no-underline"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Garantir meu desconto
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center border-t border-white/5 pt-10 sm:pt-12">
                {[
                  { label: "Sem Fidelidade", sub: "Cancele quando quiser" },
                  { label: "Taxa Zero", sub: "Por contrato" },
                  { label: "Suporte Total", sub: "Time especializado" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className="text-base font-black text-slate-200 tracking-tight">{item.label}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-[0.15em]">{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 mb-16 sm:mb-24">
            <section className="bg-slate-50 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 border border-slate-100 flex flex-col h-full">
              <h2 className="text-2xl sm:text-3xl font-black mb-8 flex items-center gap-3 text-slate-900 leading-tight">
                <span className="w-1.5 h-10 bg-red-500 rounded-full"></span>
                O perigo de <br />continuar no escuro
              </h2>
              <ul className="space-y-4 flex-1">
                {[
                  "Não saber o lucro real líquido",
                  "Perder prazos de cobrança",
                  "Confundir caixa com lucro",
                  "Operar sem base matemática"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-bold text-base sm:text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 shrink-0">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-emerald-50/20 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 border border-emerald-100/50 flex flex-col h-full">
              <h2 className="text-2xl sm:text-3xl font-black mb-8 flex items-center gap-3 text-slate-900 leading-tight">
                <span className="w-1.5 h-10 bg-emerald-500 rounded-full"></span>
                A clareza de <br />quem usa Juros Certo
              </h2>
              <ul className="space-y-4 flex-1">
                {[
                  "Visão total de cada contrato",
                  "Alertas automáticos de vencimento",
                  "Diferenciação clara de capital",
                  "Decisões baseadas em números"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-base sm:text-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 shrink-0">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="text-center max-w-2xl mx-auto border-t border-slate-50 pt-16 mb-10">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">Pronto para subir de nível?</h2>
            <p className="text-slate-500 font-medium text-base sm:text-xl leading-relaxed mb-10 px-4">
              Não deixe sua operação crescer sem estrutura. O Juros Certo foi desenhado para quem entende que emprestar dinheiro é um negócio.
            </p>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("CTA Clicked - Footer Final")}
              className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg sm:text-xl hover:bg-slate-800 transition-all no-underline shadow-xl shadow-slate-200"
            >
              Começar agora
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
          </section>
        </main>
      </div>
    );
  }

  // --- PÁGINA DE DIAGNÓSTICO FINAL ---
  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col pb-12 min-h-screen">
        <header className="pt-8 pb-4 px-6 max-w-5xl mx-auto w-full flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center p-2 shadow-xl shadow-slate-200">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="5" y="5" width="90" height="90" rx="20" fill="none" stroke="white" strokeWidth="8" />
                <path d="M30 50 L45 65 L70 35" stroke="#B5E48C" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">JurosCerto</span>
          </div>
        </header>

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 mt-6 sm:mt-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Diagnóstico Concluído
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-tight">Análise de Maturidade</h1>
            <p className="text-slate-500 font-medium text-base sm:text-xl px-4">Com base nas suas respostas, este é o retrato atual da sua operação.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', damping: 20 }}
            className="bg-white border-2 border-slate-100 rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-slate-100 mb-8 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 opacity-50"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8 pb-8 border-b border-slate-50 relative z-10">
              <div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Perfil Estratégico</span>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">{diagnosis.title}</h2>
              </div>
              <div className="inline-flex px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-xl shadow-slate-200 self-start sm:self-center">
                {diagnosis.status}
              </div>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-5 h-[2px] bg-blue-500"></span>
                  Diagnóstico Detalhado
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg sm:text-xl font-medium">
                  {diagnosis.desc}
                </p>
              </div>

              <div className="grid gap-3 pt-4">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-5 h-[2px] bg-emerald-500"></span>
                  Pontos de atenção identificados
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {diagnosis.points.map((point, i) => (
                    <motion.div
                      key={point}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      className="flex items-start gap-4 p-4 sm:p-5 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:bg-slate-50 group shadow-sm"
                    >
                      <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm group-hover:bg-emerald-500 group-hover:border-emerald-500 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500 group-hover:text-white transition-colors">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <p className="text-slate-700 font-bold text-sm sm:text-base leading-tight">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showCTA && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-6 mt-12 mb-20 px-4"
              >
                <div className="text-center max-w-md mx-auto">
                  <p className="text-slate-600 font-semibold text-base sm:text-lg leading-relaxed">
                    Esse cenário não se resolve com mais feeling ou mais contratos. <br className="hidden sm:block" />
                    Ele se resolve com <span className="text-slate-900 font-black decoration-blue-500 decoration-2 underline underline-offset-4">clareza diária</span> de juros, prazo e risco.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    trackEvent("CTA Clicked - Diagnostic Redirect");
                    // Mark session as converted
                    await supabase.from('quiz_sessions')
                      .update({ converted: true })
                      .eq('id', sessionId);
                    setShowOfferPage(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full max-w-sm py-5 sm:py-6 px-10 bg-blue-600 text-white rounded-[24px] font-black text-xl sm:text-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 flex items-center justify-center gap-4 active:scale-[0.97] group"
                >
                  Acessar Juros Certo
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1.5 transition-transform">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <div className="flex items-center gap-2 bg-blue-50/60 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-blue-100 shadow-sm">
                  <div className="bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[9px] font-black shadow-sm shrink-0">OFF</div>
                  <span className="text-[10px] text-blue-800 font-extrabold uppercase tracking-widest whitespace-nowrap">
                    Desconto exclusivo liberado
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="text-center mt-8 pb-12 opacity-50">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© JurosCerto • Análise de Maturidade 2024</p>
          </footer>
        </main>
      </div>
    );
  }

  // --- FLUXO DO QUIZ ---
  return (
    <div className="flex-1 flex flex-col relative pb-12 overflow-x-hidden min-h-screen">
      <div className="sr-only" aria-live="polite">{announcement}</div>
      <ProgressBar currentStep={currentPageIndex + 1} totalSteps={QUIZ_PAGES.length} />

      <header className="pt-6 sm:pt-8 pb-2 px-6 max-w-5xl mx-auto w-full flex items-center justify-between z-10">
        {currentPageIndex > 0 ? (
          <button
            onClick={handleBack}
            className="flex items-center text-slate-400 hover:text-slate-900 transition-all text-xs sm:text-sm font-bold uppercase tracking-widest focus:outline-none py-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Voltar
          </button>
        ) : <div className="w-20" />}

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-slate-900 rounded-xl flex items-center justify-center p-2 shadow-sm">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <rect x="5" y="5" width="90" height="90" rx="20" fill="none" stroke="white" strokeWidth="8" />
              <path d="M30 50 L45 65 L70 35" stroke="#B5E48C" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
            Juros<span className="text-slate-900">Certo</span>
          </span>
        </div>
        <div className="w-20" />
      </header>

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 mt-6 sm:mt-10 relative">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={currentPageIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full flex flex-col items-center"
          >
            {currentPageIndex === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white border border-blue-100 rounded-[32px] p-6 sm:p-8 mb-10 shadow-xl shadow-blue-50 relative overflow-hidden"
              >
                {isAnalyzing && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.8, ease: "linear" }}
                    className="absolute top-0 left-0 h-1.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                  />
                )}

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Análise em Tempo Real</h3>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Processando Perfil Estratégico</p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    "Cruzando dados de maturidade operacional",
                    "Avaliando riscos de previsibilidade de caixa",
                    "Mapeando gargalos no crescimento do capital"
                  ].map((text) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-4 text-slate-700 font-bold text-sm sm:text-base p-1"
                    >
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      {text}
                    </motion.div>
                  ))}
                </div>

                <div className="pt-5 border-t border-slate-50 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <svg className="text-blue-600" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-800 font-extrabold text-sm sm:text-base leading-tight">Ótimo! Identificamos oportunidades claras para profissionalizar seu giro.</p>
                </div>
              </motion.div>
            )}

            {!isAnalyzing && (
              <>
                <div className="text-center mb-8 sm:mb-12 max-w-2xl px-4">
                  <h1
                    ref={headingRef}
                    tabIndex={-1}
                    className="text-3xl sm:text-5xl font-black text-slate-900 mb-5 leading-[1.1] focus:outline-none tracking-tighter"
                  >
                    {currentPage.title}
                  </h1>
                  <p className="text-base sm:text-xl text-slate-500 font-medium leading-relaxed">
                    {currentPage.subtitle}
                  </p>
                </div>

                <div className={`w-full grid gap-4 ${currentPageIndex === 5 ? 'grid-cols-1 max-w-lg' : 'grid-cols-1 sm:grid-cols-2 max-w-3xl'}`}>
                  {currentPage.options?.map((option, idx) => (
                    <motion.div
                      key={option.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, type: 'spring' }}
                      className="h-full"
                    >
                      <QuizCard
                        label={option.label}
                        index={idx}
                        onClick={() => handleNext(option)}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center gap-6 mt-10">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin shadow-inner" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping" />
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px] block mb-1">Processando</span>
                  <p className="text-slate-400 font-bold text-sm">Cruzando suas respostas com padrões de mercado...</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="mt-auto pt-16 text-center px-6">
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
            Ambiente Seguro & Privado
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
