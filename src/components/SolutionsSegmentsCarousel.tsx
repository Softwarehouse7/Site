import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Store,
  Monitor,
  Sparkles
} from 'lucide-react';
import clothingSmilingImg from '../assets/images/carousel_retail_pos_1792031515825.jpg';
import celularesSmilingImg from '../assets/images/carousel_cell_pos_1792031539018.jpg';
import itSmilingImg from '../assets/images/carousel_it_system_1792031516800.jpg';
import salonSmilingImg from '../assets/images/carousel_salon_pos_1792031539054.jpg';
import commerceSmilingImg from '../assets/images/sol_commerce_hs_1792105104413.jpg';
import opticsSmilingImg from '../assets/images/carousel_optics_pos_1792031560236.jpg';

export interface SegmentSlide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  benefits: string[];
  tags: string[];
  ctaText: string;
  whatsappMessage: string;
}

const SEGMENT_SLIDES: SegmentSlide[] = [
  {
    id: 'moda',
    badge: 'Lojas de Roupas & Calçados',
    title: 'Gestão Inteligente para Moda, Vestuário e Calçados',
    subtitle: 'Venda rápida no balcão e controle absoluto de grade e estoque',
    description:
      'Elimine furos de estoque com controle automático por tamanho (P ao GG) e cor. Trocas em 1 clique, emissão de NFC-e em segundos e controle de condicional (malinha para clientes).',
    imageUrl: clothingSmilingImg,
    benefits: [
      'Grade completa por tamanho (P ao GG) e cores',
      'Etiquetas com código de barras e preço',
      'Cupom fiscal (NFC-e / NF-e) e caixa diário',
      'Condicional / malinha de roupas em 1 clique'
    ],
    tags: ['Grade de Cores/Tamanhos', 'NFC-e / Cupom', 'Condicional (Malinha)', 'Controle de Trocas'],
    ctaText: 'Quero para Loja de Roupas',
    whatsappMessage: 'Olá House Software! Gostaria de conhecer o sistema para Lojas de Roupas e Calçados.'
  },
  {
    id: 'celulares',
    badge: 'Assistência Técnica & Celulares',
    title: 'Controle Total de Aparelhos por IMEI e Ordens de Serviço',
    subtitle: 'Da entrada do smartphone no balcão até a notificação no WhatsApp',
    description:
      'Checklist completo de entrada (tela, bateria, câmera), termo de garantia automático por IMEI, venda rápida de capinhas, películas e acessórios com baixa instantânea no estoque.',
    imageUrl: celularesSmilingImg,
    benefits: [
      'OS com checklist de entrada e saída do celular',
      'Rastreio de aparelhos e garantia por IMEI',
      'Aviso automático de conserto no WhatsApp',
      'PDV rápido para capinhas e películas'
    ],
    tags: ['OS por IMEI', 'Termo de Garantia', 'Checklist de Entrada', 'Venda de Acessórios'],
    ctaText: 'Quero para Loja de Celulares',
    whatsappMessage: 'Olá House Software! Quero ver o sistema para Loja de Celulares e Assistência Técnica.'
  },
  {
    id: 'informatica',
    badge: 'Informática, Hardware & Serviços',
    title: 'Bancada Técnica, Números de Série e Rastreio de Peças',
    subtitle: 'Organize sua assistência e venda de peças com precisão cirúrgica',
    description:
      'Controle números de série (S/N) de placas de vídeo, memórias e computadores. Emita orçamentos claros com peças e mão de obra separadas e acompanhe o faturamento da sua assistência técnica.',
    imageUrl: itSmilingImg,
    benefits: [
      'Garantia por Número de Série (S/N) de cada peça',
      'Orçamentos com peças e mão de obra separadas',
      'Rastreio de ordens de serviço em bancada',
      'Controle de contratos e serviços recorrentes'
    ],
    tags: ['Controle S/N', 'Bancada Técnica', 'Garantia de Peças', 'Orçamento com Mão de Obra'],
    ctaText: 'Quero para Loja de Informática',
    whatsappMessage: 'Olá House Software! Gostaria de detalhes do sistema para Loja de Informática e Assistência.'
  },
  {
    id: 'salao',
    badge: 'Salões de Beleza & Barbearias',
    title: 'Agendamento, Comissões de Profissionais e Venda de Cosméticos',
    subtitle: 'Acabe com as contas manuais e mantenha sua equipe motivada',
    description:
      'Cálculo automático de comissão diferenciada por profissional e por serviço. Controle de pacotes, estoque de produtos utilizados no lavatório e venda de cosméticos no caixa.',
    imageUrl: salonSmilingImg,
    benefits: [
      'Fechamento de comissões por profissional em 1 clique',
      'Controle de consumo de produtos do lavatório',
      'Venda rápida de cosméticos e kits no balcão',
      'Histórico de preferências e clientes fiéis'
    ],
    tags: ['Comissão Automática', 'Consumo de Lavatório', 'Venda de Produtos', 'Histórico de Clientes'],
    ctaText: 'Quero para Salão / Barbearia',
    whatsappMessage: 'Olá House Software! Quero conhecer o sistema para Salão de Beleza e Barbearia.'
  },
  {
    id: 'mercados',
    badge: 'Mercados, Bebidas & Varejo em Geral',
    title: 'Frente de Caixa (PDV) Ultrarrápido e Gestão de Estoque',
    subtitle: 'Suporte a leitor de código de barras, balança e emissão fiscal instantânea',
    description:
      'PDV ágil para atender filas sem lentidão. Compatível com leitor de código de barras, controle de lote e validade, preços diferenciados para atacado e varejo e integração com PIX e maquininhas.',
    imageUrl: commerceSmilingImg,
    benefits: [
      'PDV ágil que opera mesmo se a internet oscilar',
      'Compatível com balança de peso e leitor de barras',
      'Tabelas de preço diferenciadas Atacado / Varejo',
      'Controle de estoque por lote e data de validade'
    ],
    tags: ['PDV Rápido', 'Leitor de Barras', 'Atacado e Varejo', 'Controle por Lote/Validade'],
    ctaText: 'Quero para Varejo e Mercados',
    whatsappMessage: 'Olá House Software! Gostaria de ver o sistema para Varejo, Mercado e Comércio em Geral.'
  },
  {
    id: 'oticas',
    badge: 'Óticas, Relojoarias & Acessórios',
    title: 'Armações, Lentes e Histórico Oftálmico do Cliente',
    subtitle: 'Controle de receitas, carnês de pagamento e etiquetas próprias',
    description:
      'Cadastro de dados de receita médica oftálmica (esférico, cilíndrico, eixo e DNP), controle de envio para laboratório de lentes e emissão de carnês de crediário próprio para seus clientes.',
    imageUrl: opticsSmilingImg,
    benefits: [
      'Registro completo de receitas oftálmicas e dioptrias',
      'Acompanhamento de montagem em laboratório',
      'Emissão de carnês e crediário próprio da loja',
      'Etiquetas especiais para hastes de armações'
    ],
    tags: ['Receitas Oftálmicas', 'Laboratório', 'Crediário / Carnê', 'Etiquetas de Armação'],
    ctaText: 'Quero para Óticas e Joias',
    whatsappMessage: 'Olá House Software! Gostaria de informações do sistema para Óticas e Relojoarias.'
  }
];

interface SolutionsSegmentsCarouselProps {
  onOpenWhatsApp?: (msg: string) => void;
  onSelectSegment?: (segmentKey: string) => void;
}

export const SolutionsSegmentsCarousel: React.FC<SolutionsSegmentsCarouselProps> = ({
  onOpenWhatsApp,
  onSelectSegment
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlide = SEGMENT_SLIDES[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SEGMENT_SLIDES.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SEGMENT_SLIDES.length) % SEGMENT_SLIDES.length);
  };

  // Auto-advance carousel every 6 seconds unless hovered/paused
  useEffect(() => {
    if (isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SEGMENT_SLIDES.length);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentIndex]);

  return (
    <div
      className="relative mb-12 sm:mb-16 overflow-hidden rounded-3xl border border-slate-200/90 bg-slate-950 shadow-2xl select-none scrollbar-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Carrossel Integrado de Soluções House Software"
    >
      {/* Unified Canvas: Image and Information Together in One Seamless Card */}
      <div className="relative min-h-[500px] sm:min-h-[520px] md:min-h-[550px] flex items-stretch justify-between overflow-hidden">
        {/* Background Real-World Image */}
        <div
          key={`img-${activeSlide.id}`}
          className="absolute inset-0 z-0 animate-in fade-in zoom-in-[0.99] duration-700 pointer-events-none"
        >
          <img
            src={activeSlide.imageUrl}
            alt={activeSlide.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          {/* Deep Cinematic Gradient: ensures high typography contrast and readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 sm:via-slate-950/85 to-slate-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Integrated Text and Information Overlaid on the Slide */}
        <div
          key={`content-${activeSlide.id}`}
          className="relative z-10 w-full max-w-2xl sm:max-w-3xl p-6 sm:p-10 md:p-12 pb-16 sm:pb-16 flex flex-col justify-between text-white animate-in fade-in slide-in-from-left-2 duration-500"
        >
          {/* Header Badges with House Software identity */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-600/95 text-white backdrop-blur-md border border-blue-400/40 shadow-sm flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              <span>{activeSlide.badge}</span>
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/25 text-emerald-300 border border-emerald-400/30 backdrop-blur-md inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">House Software em Operação</span>
            </span>
          </div>

          {/* Main Title, Subtitle & Description */}
          <div className="my-auto py-4 space-y-3">
            <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
              {activeSlide.title}
            </h3>

            <p className="text-sm sm:text-base font-semibold text-blue-300">
              {activeSlide.subtitle}
            </p>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-2xl">
              {activeSlide.description}
            </p>

            {/* Feature Checkmarks (2-column grid integrated with slide) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {activeSlide.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium bg-white/10 hover:bg-white/15 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenWhatsApp?.(activeSlide.whatsappMessage)}
              className="px-6 py-3.5 text-xs sm:text-sm font-bold text-slate-950 bg-white hover:bg-slate-100 rounded-xl transition-all shadow-lg shadow-black/40 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>{activeSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 text-blue-700 shrink-0" />
            </button>

            {onSelectSegment && (
              <button
                type="button"
                onClick={() => onSelectSegment(activeSlide.id)}
                className="px-4 py-3.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl backdrop-blur-md transition-colors text-center cursor-pointer"
              >
                Simular Telas Deste Ramo
              </button>
            )}
          </div>
        </div>

        {/* Integrated Computer Monitor Display showing House Software clearly on the Screen */}
        <div className="hidden lg:flex flex-col items-center justify-center p-8 pr-12 z-10 w-[380px] shrink-0 pointer-events-none">
          <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border-2 border-cyan-400/50 p-4 shadow-2xl shadow-cyan-950/60 text-white animate-in fade-in duration-500">
            {/* Monitor Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="font-black tracking-wider text-cyan-300 ml-1">
                  HOUSE SOFTWARE
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                SISTEMA PDV
              </span>
            </div>

            {/* Simulated POS Screen */}
            <div className="pt-3 space-y-2.5 text-xs font-mono-tabular">
              <div className="bg-slate-950/90 rounded-xl p-3 border border-cyan-500/30 space-y-1.5 shadow-inner">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Frente de Caixa:</span>
                  <span className="text-cyan-300 font-bold">House Software</span>
                </div>
                <div className="text-white font-extrabold text-sm truncate">
                  {activeSlide.badge}
                </div>
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Operação Ágil & Sem Falhas</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Terminal</span>
                  <span className="text-white font-bold">Caixa 01 Ativo</span>
                </div>
                <div className="bg-white/5 rounded-lg p-2 border border-white/10">
                  <span className="text-slate-400 block text-[9px] uppercase font-semibold">Emissão SEFAZ</span>
                  <span className="text-emerald-300 font-bold">100% Homologado</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Side Arrows for Next / Prev */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Segmento anterior"
        className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Próximo segmento"
        className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-xl hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Modern Minimal Indicator Dots (No separate text buttons, zero scrollbars) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/15">
        {SEGMENT_SLIDES.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={slide.id}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Slide ${index + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                isActive
                  ? 'w-7 h-2 bg-blue-500 shadow-sm'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};
