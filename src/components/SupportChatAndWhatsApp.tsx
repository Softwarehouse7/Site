import React, { useState, useRef, useEffect, useMemo } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import {
  MessageCircle,
  Send,
  X,
  ArrowUpRight,
  Check,
  Zap,
  UserCheck,
  Clock,
  Calculator,
  ShieldCheck,
  ChevronRight,
  Moon,
  Sun,
  CheckCircle2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

export const WHATSAPP_NUMBER = '5588994357360';

export function buildWhatsAppUrl(customText: string, customNumber?: string): string {
  const cleanNum = (customNumber || WHATSAPP_NUMBER).replace(/\D/g, '') || WHATSAPP_NUMBER;
  return `https://wa.me/${cleanNum}?text=${encodeURIComponent(customText)}`;
}

export interface ChatFaqDocData {
  id: string;
  question: string;
  keywords: string;
  answer: string;
  category: string;
  isPublished: boolean;
  orderIndex: number;
  authorId?: string;
  createdAt?: unknown;
}

export const DEFAULT_CHAT_FAQS: ChatFaqDocData[] = [
  {
    id: 'faq-ausencia',
    category: 'Geral',
    question: 'E se ninguém puder me atender agora?',
    keywords: 'ninguém, ninguem, ausente, ausência, agora, horario, horário, domingo, noite, esperar, demora',
    answer:
      'Nosso Assistente 24/7 funciona sem parar! Você pode tirar dúvidas instantâneas aqui ou usar a aba "Simulador 24h" para montar sua proposta e deixar seu WhatsApp. Assim que nossa equipe abrir o expediente, seu contato tem prioridade 1 no retorno.',
    isPublished: true,
    orderIndex: 0
  },
  {
    id: 'faq-rede',
    category: 'Geral',
    question: 'Como funciona a instalação em rede?',
    keywords: 'rede, computadores, pcs, servidor, varios, vários, conectar, sincronizar, balcao, escritório',
    answer:
      'Instalamos o banco de dados central no seu computador principal (servidor) e conectamos os outros computadores (caixas e escritório) pela rede local. Todos operam o mesmo estoque, vendas e financeiro em tempo real, com backup protegido!',
    isPublished: true,
    orderIndex: 1
  },
  {
    id: 'faq-roupas',
    category: 'Loja de Roupas',
    question: 'Como funciona para Loja de Roupas?',
    keywords: 'roupa, moda, grade, tamanho, cor, etiqueta, condicional, malinha, troca',
    answer:
      'Para Lojas de Roupas, você controla a grade completa por cor e tamanho (P ao GG), imprime etiquetas de código de barras, gerencia condicional (malinha) e realiza vendas e trocas em 8 segundos.',
    isPublished: true,
    orderIndex: 2
  },
  {
    id: 'faq-informatica',
    category: 'Informática',
    question: 'Como funciona para Informática e OS?',
    keywords: 'informatica, informática, os, ordem de serviço, assistencia, assistência, serial, garantia, bancada, computador, notebook',
    answer:
      'Para Informática e Assistência Técnica, o sistema controla Ordens de Serviço (OS) na bancada, rastreia garantia por Número de Série e envia o orçamento direto no WhatsApp do cliente para aprovação rápida.',
    isPublished: true,
    orderIndex: 3
  },
  {
    id: 'faq-celulares',
    category: 'Loja de Celulares',
    question: 'Tem controle de IMEI e OS para Celulares?',
    keywords: 'celular, celulares, smartphone, iphone, xiaomi, samsung, imei, capinha, pelicula, película, tela, bateria, seminovo',
    answer:
      'Sim! Para Lojas e Assistência de Celulares, você controla compra/venda de aparelhos novos e seminovos por IMEI, emite Termo de Garantia, abre OS com checklist (tela, bateria, câmeras) e vende capinhas e películas em segundos.',
    isPublished: true,
    orderIndex: 4
  },
  {
    id: 'faq-salao',
    category: 'Salão de Beleza',
    question: 'Calcula comissão de Salão de Beleza?',
    keywords: 'salao, salão, beleza, estetica, estética, comissao, comissão, agenda, parceiro, manicure, cabelo',
    answer:
      'Sim! Para Salão de Beleza e Estética, possui agenda por profissional, lembretes no WhatsApp e cálculo automático de comissões (Lei do Salão Parceiro), descontando os produtos usados no procedimento.',
    isPublished: true,
    orderIndex: 5
  },
  {
    id: 'faq-comercio',
    category: 'Outro Comércio',
    question: 'Atende Mercados e Outros Comércios?',
    keywords: 'comercio, comércio, mercado, atacado, varejo, lote, validade, distribuidora, autopeças, material',
    answer:
      'Sim! Atendemos diversos segmentos comerciais com tabelas de preço Atacado e Varejo, controle de lote e validade, código de barras, contas a pagar/receber e DRE financeiro.',
    isPublished: true,
    orderIndex: 6
  },
  {
    id: 'faq-internet',
    category: 'Geral',
    question: 'E se a internet cair na loja?',
    keywords: 'internet, cair, offline, sem internet, conexão, travar, rede',
    answer:
      'Sua loja não para! Nosso PDV conta com contingência operacional para que você continue registrando vendas no balcão mesmo se a internet oscilar, sincronizando tudo automaticamente depois.',
    isPublished: true,
    orderIndex: 7
  },
  {
    id: 'faq-migracao',
    category: 'Geral',
    question: 'Vocês passam os dados do sistema antigo?',
    keywords: 'migração, migracao, antigo, cadastro, importar, passar dados, planilha, trocar sistema',
    answer:
      'Sim! Nossa equipe técnica faz a importação dos seus cadastros de produtos, clientes e estoque do seu sistema antigo ou planilhas para você não precisar cadastrar tudo do zero.',
    isPublished: true,
    orderIndex: 8
  },
  {
    id: 'faq-treinamento',
    category: 'Geral',
    question: 'Meus funcionários vão conseguir usar?',
    keywords: 'funcionário, funcionario, treinamento, dificil, difícil, aprender, suporte, ajuda, fácil',
    answer:
      'Com certeza! As telas da House Software são 100% simplificadas. Além disso, damos treinamento prático para você e sua equipe aprenderem a operar no mesmo dia, com suporte humano sempre próximo.',
    isPublished: true,
    orderIndex: 9
  },
  {
    id: 'faq-fiscal',
    category: 'Geral',
    question: 'Emite Nota Fiscal (NF-e e Cupom)?',
    keywords: 'nota, fiscal, cupom, nfe, nfce, nfse, sefaz, contador, imposto, pix',
    answer:
      'Sim! 100% homologado na SEFAZ para emitir Cupom Fiscal (NFC-e), Nota Grande (NF-e), Nota de Serviço (NFS-e), integração com PIX/Cartão e envio automático de arquivos para o seu contador.',
    isPublished: true,
    orderIndex: 10
  },
  {
    id: 'faq-preco',
    category: 'Geral',
    question: 'Qual o valor e prazo de entrega?',
    keywords: 'valor, preço, preco, quanto custa, mensalidade, orçamento, orcamento, prazo, demora',
    answer:
      'O valor é ajustado sob medida apenas para os módulos que a sua loja realmente precisa, sem taxas surpresa. Use a aba "Simulador 24h" acima para calcular o pacote exato para o seu comércio!',
    isPublished: true,
    orderIndex: 11
  }
];

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  time: string;
}

const SEGMENTS = [
  'Todos',
  'Loja de Roupas',
  'Informática',
  'Loja de Celulares',
  'Salão de Beleza',
  'Outro Comércio'
];

interface SupportChatAndWhatsAppProps {
  isOpen: boolean;
  onToggleChat: (open: boolean) => void;
  whatsappNumber?: string;
  brandName?: string;
  customFaqs?: ChatFaqDocData[];
}

/**
 * Checks whether the current time in Brazil (Brasília, UTC-3)
 * is within human business hours (Mon-Fri 08h-18h, Sat 08h-12h).
 */
function isHumanTeamOnline(): { isOnline: boolean; label: string; detail: string } {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const weekdayStr = parts.find((p) => p.type === 'weekday')?.value.toLowerCase() || '';
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '12', 10);

    const isSunday = weekdayStr.startsWith('dom');
    const isSaturday = weekdayStr.startsWith('sáb') || weekdayStr.startsWith('sab');

    if (isSunday) {
      return {
        isOnline: false,
        label: 'Plantão Automático 24h Ativo',
        detail: 'Equipe retorna segunda às 08h. Assistente online!'
      };
    }

    if (isSaturday) {
      if (hour >= 8 && hour < 12) {
        return {
          isOnline: true,
          label: 'Equipe Humana Online',
          detail: 'Sábado até 12:00'
        };
      }
      return {
        isOnline: false,
        label: 'Plantão Automático 24h Ativo',
        detail: 'Equipe retorna segunda às 08h. Assistente online!'
      };
    }

    // Mon-Fri
    if (hour >= 8 && hour < 18) {
      return {
        isOnline: true,
        label: 'Equipe Humana Online',
        detail: 'Seg a Sex das 08h às 18h'
      };
    }

    return {
      isOnline: false,
      label: 'Plantão Automático 24h Ativo',
      detail: 'Equipe retorna amanhã às 08h. Assistente online!'
    };
  } catch {
    return {
      isOnline: true,
      label: 'Plantão 24/7 Ativo',
      detail: 'Respostas imediatas'
    };
  }
}

export const SupportChatAndWhatsApp: React.FC<SupportChatAndWhatsAppProps> = ({
  isOpen,
  onToggleChat,
  whatsappNumber = WHATSAPP_NUMBER,
  brandName = 'House Software',
  customFaqs = []
}) => {
  // Top Level State Hooks (Rules of Hooks: all unconditional at top)
  const [activeTab, setActiveTab] = useState<'chat' | 'simulator'>('chat');
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>('Todos');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showProactiveBubble, setShowProactiveBubble] = useState<boolean>(false);
  const [hasDismissedBubble, setHasDismissedBubble] = useState<boolean>(false);

  // Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Olá! Sou o assistente 24/7 da ${brandName}. Mesmo quando nossa equipe humana está ausente, você pode tirar qualquer dúvida ou simular seu orçamento na hora!`,
      time: 'Agora'
    }
  ]);
  const [inputText, setInputText] = useState('');

  // Quick Lead Capture modal/drawer inside chat
  const [showLeadBox, setShowLeadBox] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadSegment, setLeadSegment] = useState('Loja de Roupas');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // 24h Interactive Quote Simulator State (Self-Service when unattended)
  const [simStep, setSimStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [simSegment, setSimSegment] = useState<string>('Loja de Roupas');
  const [simTerminals, setSimTerminals] = useState<string>('1 Computador / Caixa');
  const [simFiscal, setSimFiscal] = useState<string>('Com Emissão Fiscal (NFC-e / NF-e)');
  const [simContactName, setSimContactName] = useState<string>('');
  const [simContactPhone, setSimContactPhone] = useState<string>('');
  const [simSubmitting, setSimSubmitting] = useState<boolean>(false);
  const [simCompleted, setSimCompleted] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Business hours assessment
  const teamStatus = useMemo(() => isHumanTeamOnline(), []);

  // Merge default FAQs with Admin-created FAQs
  const allFaqs = useMemo(() => {
    const map = new Map<string, ChatFaqDocData>();
    DEFAULT_CHAT_FAQS.forEach((f) => map.set(f.id, f));
    customFaqs.forEach((cf) => map.set(cf.id, cf));
    return Array.from(map.values()).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [customFaqs]);

  const visibleFaqs = useMemo(() => {
    if (selectedSegmentFilter === 'Todos') return allFaqs;
    return allFaqs.filter(
      (f) => f.category === selectedSegmentFilter || f.category === 'Geral'
    );
  }, [allFaqs, selectedSegmentFilter]);

  // Proactive invite bubble timer
  useEffect(() => {
    if (isOpen || hasDismissedBubble) {
      setShowProactiveBubble(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowProactiveBubble(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, [isOpen, hasDismissedBubble]);

  // Scroll to bottom on new messages or typing
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, showLeadBox, isTyping, activeTab]);

  const findBestAnswer = (userText: string): string => {
    const normalized = userText.toLowerCase();

    // 1. Check exact question match
    const exactMatch = allFaqs.find(
      (f) => f.question.toLowerCase() === normalized.trim()
    );
    if (exactMatch) return exactMatch.answer;

    // 2. Check keyword match across all FAQs (prioritizing admin custom FAQs)
    for (const faq of [...customFaqs, ...DEFAULT_CHAT_FAQS]) {
      const kwList = faq.keywords
        .toLowerCase()
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      if (kwList.some((kw) => normalized.includes(kw))) {
        return faq.answer;
      }
    }

    return `A ${brandName} desenvolve sistemas 100% simplificados para Lojas de Roupas, Informática, Celulares, Salões de Beleza e Comércios em geral. Como nossa equipe pode estar atendendo outros clientes no momento, você pode clicar em "Simular Orçamento 24h" no topo ou deixar seu WhatsApp para retorno prioritário!`;
  };

  const handleSelectSegmentChip = (seg: string) => {
    setSelectedSegmentFilter(seg);
    if (seg !== 'Todos') {
      setLeadSegment(seg);
      setSimSegment(seg);
      const segFaq = allFaqs.find((f) => f.category === seg);
      if (segFaq) {
        handleSendQuestion(segFaq.question);
      }
    }
  };

  const handleSendQuestion = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    const now = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      time: now
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Realistic typing indicator delay (500ms) to feel human and responsive
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `a-${Date.now() + 1}`,
        sender: 'assistant',
        text: findBestAnswer(trimmed),
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, replyMsg]);
      setIsTyping(false);
    }, 550);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuestion(inputText);
  };

  // Quick Lead Submit (Direct lead box inside chat)
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName.trim() || leadPhone.replace(/\D/g, '').length < 10) return;

    const now = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const leadId = `lead_chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    try {
      await setDoc(doc(db, 'contact_leads', leadId), {
        name: leadName.trim().slice(0, 120),
        company: `${leadName.trim()} (Via Chat 24h)`.slice(0, 120),
        phone: leadPhone.trim().slice(0, 40),
        segment: leadSegment.trim().slice(0, 80) || 'Geral',
        message: teamStatus.isOnline
          ? 'Solicitou atendimento pelo Chat Tira-Dúvidas.'
          : '[ATENDIMENTO FORA DE HORÁRIO] Cliente solicitou retorno no primeiro horário útil.',
        status: 'novo',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch {
      // Non-blocking fallback
    }

    setLeadSubmitted(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `lead-${Date.now()}`,
        sender: 'assistant',
        text: `Excelente, ${leadName.trim()}! Registramos seu contato com prioridade para o ramo "${leadSegment}". ${
          teamStatus.isOnline
            ? 'Um consultor já recebeu seu alerta.'
            : 'Como nossa equipe humana está em intervalo/fora de horário, seu pedido foi colocado no topo da fila de amanhã!'
        } Você pode clicar no botão verde abaixo para enviar seu recado direto no nosso WhatsApp!`,
        time: now
      }
    ]);
  };

  // Self-Service 24h Simulator Submission (Solves unattended / offline moments)
  const handleSimulatorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simContactName.trim() || simContactPhone.replace(/\D/g, '').length < 10) return;

    setSimSubmitting(true);
    const leadId = `sim_24h_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const fullSummary = `Simulação 24h: Ramo: ${simSegment} | Terminais: ${simTerminals} | Fiscal: ${simFiscal} | Resp: ${simContactName} (${simContactPhone})`;

    try {
      await setDoc(doc(db, 'contact_leads', leadId), {
        name: simContactName.trim().slice(0, 120),
        company: `${simContactName.trim()} - Loja de ${simSegment}`.slice(0, 120),
        phone: simContactPhone.trim().slice(0, 40),
        segment: simSegment,
        message: `[SIMULAÇÃO 24H - CLIENTE QUER ATENDIMENTO] ${fullSummary}`,
        status: 'novo',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } catch {
      // Non-blocking fallback
    }

    setSimSubmitting(false);
    setSimCompleted(true);
    setSimStep(5);
  };

  const lastUserMessage =
    [...messages].reverse().find((m) => m.sender === 'user')?.text ||
    `Olá! Gostaria de conhecer os sistemas da ${brandName}.`;

  const whatsappDirectText = leadSubmitted
    ? `Olá ${brandName}! Meu nome é ${leadName} (${leadSegment} - Tel: ${leadPhone}). Estava no chat do site e quero receber o orçamento/demonstração assim que possível.`
    : simCompleted
    ? `Olá ${brandName}! Fiz uma simulação 24h no site:\n- Nome: ${simContactName}\n- Ramo: ${simSegment}\n- Terminais: ${simTerminals}\n- Fiscal: ${simFiscal}\n- WhatsApp: ${simContactPhone}\nPodem me chamar para apresentar a proposta?`
    : `Olá ${brandName}! Estava no atendimento automático do site. Minha dúvida: "${lastUserMessage}". Podem me retornar assim que disponível?`;

  return (
    <>
      {/* Proactive Floating Bubble (Mais compacto e discreto) */}
      {showProactiveBubble && !isOpen && (
        <div className="fixed bottom-20 right-4 z-40 max-w-[265px] bg-white border border-slate-200/90 shadow-lg rounded-xl p-2.5 text-xs text-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start justify-between gap-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{brandName} · Plantão 24h</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowProactiveBubble(false);
                setHasDismissedBubble(true);
              }}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
              title="Fechar aviso"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="mt-1 text-slate-600 text-[10.5px] leading-snug">
            {teamStatus.isOnline
              ? 'Dúvidas sobre o sistema para seu comércio? Simule uma proposta rápida sem compromisso!'
              : '🌙 Equipe humana retorna às 08h. Você pode simular seu orçamento ou tirar dúvidas na hora!'}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setShowProactiveBubble(false);
                setActiveTab('simulator');
                onToggleChat(true);
              }}
              className="flex-1 py-1 px-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-md text-[10.5px] text-center cursor-pointer transition-colors"
            >
              Simular Proposta
            </button>
            <button
              type="button"
              onClick={() => {
                setShowProactiveBubble(false);
                setActiveTab('chat');
                onToggleChat(true);
              }}
              className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-md text-[10.5px] cursor-pointer"
            >
              Dúvidas
            </button>
          </div>
        </div>
      )}

      {/* Floating Action Buttons (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2.5">
        <a
          href={buildWhatsAppUrl(
            `Olá! Vim pelo site da ${brandName} e gostaria de mais informações sobre o sistema.`,
            whatsappNumber
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg transition-transform hover:scale-[1.02] flex items-center gap-2 whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 fill-white/20" />
          <span>WhatsApp Direto</span>
        </a>

        <button
          type="button"
          onClick={() => {
            setShowProactiveBubble(false);
            onToggleChat(!isOpen);
          }}
          className="relative px-4 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xl transition-transform hover:scale-[1.02] flex items-center gap-2 whitespace-nowrap cursor-pointer border border-slate-700"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          {isOpen ? (
            <>
              <X className="w-4 h-4" />
              <span>Fechar</span>
            </>
          ) : (
            <>
              <MessageCircle className="w-3.5 h-3.5 text-blue-400" />
              <span>Chat & Proposta 24h</span>
            </>
          )}
        </button>
      </div>

      {/* Interactive Upgraded Chat Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={`Central de Atendimento 24h da ${brandName}`}
          className="fixed bottom-18 right-4 z-50 w-[calc(100vw-2rem)] sm:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[84vh]"
        >
          {/* Header with Absence / Business Hours Live Status */}
          <div className="px-4 py-3 bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>{brandName} · Assistente 24/7</span>
              </div>
              <p className="text-[10px] text-slate-300 mt-0.5 flex items-center gap-1">
                {teamStatus.isOnline ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Equipe online · Respostas imediatas</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-200 font-medium">
                      Plantão Automático Ativo · Respondendo 24h
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onToggleChat(false)}
                aria-label="Fechar janela do chat"
                className="px-2.5 py-1 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-red-600 rounded-lg border border-slate-700 hover:border-red-500 cursor-pointer transition-colors flex items-center gap-1 shadow-2xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Fechar</span>
              </button>
            </div>
          </div>

          {/* Absence Notice Banner (Reassures the client when nobody is in the office) */}
          <div className="px-3.5 py-1.5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white text-[11px] flex items-center justify-between shrink-0">
            <span className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <span className="truncate">
                {teamStatus.isOnline
                  ? 'Atendimento comercial ativo agora'
                  : 'Ausência temporária? Nosso assistente atende você na hora!'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'simulator' ? 'chat' : 'simulator')}
              className="text-[10px] font-bold bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded text-white shrink-0 cursor-pointer transition-colors"
            >
              {activeTab === 'simulator' ? 'Ver Chat' : 'Simular 24h'}
            </button>
          </div>

          {/* Tab Switcher: Chat Livre x Simulador de Proposta 24h */}
          <div className="grid grid-cols-2 bg-slate-100 p-1 border-b border-slate-200 shrink-0 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'chat'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
              <span>Dúvidas Imediatas</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`py-1.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === 'simulator'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Simulador de Proposta</span>
            </button>
          </div>

          {/* TAB 1: CHAT LIVRE & RESPOSTAS AUTOMÁTICAS */}
          {activeTab === 'chat' && (
            <>
              {/* Guided Segment Selector Strip & Fechar Button */}
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1.5 overflow-x-auto shrink-0">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[10px] font-bold text-slate-500 uppercase shrink-0">
                    Ramo:
                  </span>
                  {SEGMENTS.map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      onClick={() => handleSelectSegmentChip(seg)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                        selectedSegmentFilter === seg
                          ? 'bg-slate-900 text-white'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => onToggleChat(false)}
                  className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-md shrink-0 flex items-center gap-1 cursor-pointer transition-colors ml-auto shadow-2xs"
                  title="Fechar Chat"
                >
                  <X className="w-3 h-3" />
                  <span>Fechar</span>
                </button>
              </div>

              {/* Messages Area */}
              <div className="p-3.5 overflow-y-auto space-y-3 bg-[#F9F9F8] flex-1 min-h-[170px] max-h-60">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-1.5 text-xs leading-snug ${
                        msg.sender === 'user'
                          ? 'bg-blue-700 text-white'
                          : 'bg-white text-slate-800 border border-slate-200 shadow-2xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                  </div>
                ))}

                {/* Realistic Typing Indicator (Feels responsive & alive when unattended) */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg w-fit shadow-2xs">
                    <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.15s' }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"
                      style={{ animationDelay: '0.3s' }}
                    ></span>
                    <span className="text-[10px] text-slate-400 font-medium ml-1">
                      Atendente digitando...
                    </span>
                  </div>
                )}

                {/* Inline Quick Lead Card (For when customer wants human follow-up) */}
                {showLeadBox && (
                  <div className="p-3 bg-blue-50/90 border border-blue-200 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-700" />
                        <span>Receber Contato com Prioridade</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowLeadBox(false)}
                        className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                      >
                        Fechar
                      </button>
                    </div>

                    {leadSubmitted ? (
                      <div className="space-y-2 text-xs text-emerald-900 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                        <div className="font-bold flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-700" />
                          <span>Solicitação Gravada, {leadName}!</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Seu contato está no topo da nossa fila. Clique abaixo para enviar
                          diretamente ao nosso WhatsApp:
                        </p>
                        <a
                          href={buildWhatsAppUrl(whatsappDirectText, whatsappNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Abrir WhatsApp com Resumo</span>
                        </a>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-2">
                        <input
                          type="text"
                          required
                          value={leadName}
                          onChange={(e) => setLeadName(e.target.value)}
                          placeholder="Seu Nome ou Nome do Comércio *"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-md"
                        />
                        <input
                          type="tel"
                          required
                          value={leadPhone}
                          onChange={(e) => setLeadPhone(e.target.value)}
                          placeholder="Seu WhatsApp com DDD * Ex: (88) 99435-7360"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-blue-200 rounded-md font-mono-tabular"
                        />
                        <button
                          type="submit"
                          className="w-full py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-md cursor-pointer"
                        >
                          Confirmar e Gravar Pedido
                        </button>
                      </form>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Questions (Clickable 1-touch FAQ) */}
              <div className="px-3 py-2 bg-white border-t border-slate-200 shrink-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    Perguntas Frequentes:
                  </span>
                  {!showLeadBox && (
                    <button
                      type="button"
                      onClick={() => setShowLeadBox(true)}
                      className="text-[10px] font-bold text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Pedir Orçamento</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-22 overflow-y-auto">
                  {visibleFaqs.map((faq) => (
                    <button
                      key={faq.id}
                      type="button"
                      onClick={() => handleSendQuestion(faq.question)}
                      className="px-2.5 py-1 text-[11px] font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-md transition-colors cursor-pointer text-left"
                    >
                      {faq.question}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free-Text Question Form */}
              <form
                onSubmit={handleFormSubmit}
                className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Escreva sua dúvida (ex: nota fiscal, rede, preço)..."
                  className="flex-1 px-3 py-2 text-xs bg-[#F9F9F8] border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-blue-700"
                />
                <button
                  type="submit"
                  aria-label="Enviar pergunta"
                  className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: SIMULADOR DE PROPOSTA 24H (Para quando não há ninguém para atender) */}
          {activeTab === 'simulator' && (
            <div className="p-4 bg-[#F9F9F8] overflow-y-auto flex-1 text-xs space-y-3.5">
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-xs mb-1">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Simulador de Proposta Automático 24/7</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Mesmo sem atendente no momento, descubra a configuração ideal para o seu
                    comércio em 3 passos rápidos:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleChat(false)}
                  className="px-2 py-1 text-[11px] font-bold text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-md shrink-0 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  title="Fechar Chat"
                >
                  <X className="w-3 h-3" />
                  <span>Fechar</span>
                </button>
              </div>

              {/* Step 1: Segment */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>1. Qual é o seu tipo de comércio?</span>
                  <span className="text-[10px] text-blue-600 font-normal">Passo 1 de 3</span>
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    'Loja de Roupas',
                    'Informática & OS',
                    'Loja de Celulares',
                    'Salão de Beleza',
                    'Comércio Geral',
                    'Mercado / Mercearia'
                  ].map((seg) => (
                    <button
                      key={seg}
                      type="button"
                      onClick={() => setSimSegment(seg)}
                      className={`p-2 rounded-lg text-[11px] font-semibold text-left border cursor-pointer transition-all ${
                        simSegment === seg
                          ? 'bg-blue-700 text-white border-blue-700 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
                      }`}
                    >
                      {seg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Terminals / Network */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700">
                  2. Quantos computadores/caixas vão operar?
                </label>
                <div className="space-y-1">
                  {[
                    { title: '1 Computador / Caixa', desc: 'Ideal para balcão único' },
                    { title: '2 a 3 Computadores em Rede', desc: 'Caixas + Escritório sincronizados' },
                    { title: '4 ou mais com Servidor', desc: 'Estrutura completa para médias lojas' }
                  ].map((item) => (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setSimTerminals(item.title)}
                      className={`w-full p-2 rounded-lg text-left border cursor-pointer flex items-center justify-between transition-all ${
                        simTerminals === item.title
                          ? 'bg-blue-50 text-blue-900 border-blue-500 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-[11px]">{item.title}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{item.desc}</div>
                      </div>
                      {simTerminals === item.title && (
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Fiscal */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700">
                  3. Necessidade de Emissão Fiscal:
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    'Com Emissão Fiscal (Cupom NFC-e / NF-e SEFAZ)',
                    'Sem Fiscal no Momento (Apenas Controle Gerencial Interno)',
                    'Quero Orientação do Consultor'
                  ].map((fisc) => (
                    <button
                      key={fisc}
                      type="button"
                      onClick={() => setSimFiscal(fisc)}
                      className={`p-2 rounded-lg text-[11px] text-left border cursor-pointer transition-all ${
                        simFiscal === fisc
                          ? 'bg-blue-50 text-blue-900 border-blue-500 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {fisc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Contact info to deliver proposal */}
              {!simCompleted ? (
                <form
                  onSubmit={handleSimulatorSubmit}
                  className="bg-white p-3 rounded-xl border border-blue-200 space-y-2.5"
                >
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Onde você quer receber o orçamento detalhado?</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={simContactName}
                    onChange={(e) => setSimContactName(e.target.value)}
                    placeholder="Seu Nome ou Nome da Loja *"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-600"
                  />
                  <input
                    type="tel"
                    required
                    value={simContactPhone}
                    onChange={(e) => setSimContactPhone(e.target.value)}
                    placeholder="WhatsApp com DDD * Ex: (88) 99435-7360"
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md font-mono-tabular focus:bg-white focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={simSubmitting}
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
                  >
                    {simSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Calculando Proposta...</span>
                      </>
                    ) : (
                      <>
                        <Calculator className="w-3.5 h-3.5" />
                        <span>Gerar Orçamento & Salvar Contato</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Simulation Result & WhatsApp Direct Escalation */
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2.5 text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Simulação Concluída com Sucesso!</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-emerald-100 text-[11px] space-y-1">
                    <div>
                      <strong>Ramo:</strong> {simSegment}
                    </div>
                    <div>
                      <strong>Estrutura:</strong> {simTerminals}
                    </div>
                    <div>
                      <strong>Módulo Fiscal:</strong> {simFiscal}
                    </div>
                    <div className="pt-1 text-[10px] text-slate-500">
                      Incluso: Treinamento prático da equipe + Migração de dados do sistema antigo +
                      Backup protegido.
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                    {teamStatus.isOnline
                      ? 'Nossa equipe recebeu sua simulação. Envie agora para o WhatsApp para formalizar seu pedido:'
                      : '🌙 Sua simulação foi gravada com Prioridade 1 no nosso sistema! Clique abaixo para já deixar tudo pronto no WhatsApp:'}
                  </p>

                  <a
                    href={buildWhatsAppUrl(whatsappDirectText, whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-xs cursor-pointer shadow-md transition-transform hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enviar Simulação no WhatsApp da Loja</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setSimCompleted(false);
                      setSimContactName('');
                      setSimContactPhone('');
                    }}
                    className="w-full text-center text-[10px] text-slate-500 hover:text-slate-700 underline cursor-pointer"
                  >
                    Fazer outra simulação
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Direct WhatsApp Escalation & Close Footer */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={() => onToggleChat(false)}
              className="text-xs font-semibold text-slate-600 hover:text-red-600 flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Fechar Chat</span>
            </button>
            <a
              href={buildWhatsAppUrl(whatsappDirectText, whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 whitespace-nowrap bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Abrir WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
};
