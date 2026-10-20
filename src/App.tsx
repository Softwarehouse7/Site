/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import {
  db,
  handleFirestoreError,
  OperationType
} from './firebase';
import { SegmentKey } from './data/portfolioData';
import bannerHappyImg from './assets/images/banner_happy_team_1791250404967.jpg';
import aboutSmilingImg from './assets/images/sol_commerce_hs_1792105104413.jpg';
import clothingSmilingImg from './assets/images/sol_clothing_smiling_1791250424368.jpg';
import itSmilingImg from './assets/images/sol_it_smiling_1791250433393.jpg';
import salonSmilingImg from './assets/images/sol_salon_smiling_1791250442303.jpg';
import commerceSmilingImg from './assets/images/sol_commerce_hs_1792105104413.jpg';
import celularesSmilingImg from './assets/images/sol_celulares_smiling_1791426442897.jpg';
import logoHsImg from './assets/images/logo_hs_modern_1791253549527.jpg';
import {
  SupportChatAndWhatsApp,
  ChatFaqDocData
} from './components/SupportChatAndWhatsApp';
import type {
  SiteConfigData,
  SolutionDocData,
  CustomPageDocData
} from './components/AdminPanel';
import { VideoEmbed } from './components/VideoEmbed';
import { CommerceLogosShowcase } from './components/CommerceLogosShowcase';
import {
  ArrowRight,
  Check,
  Menu,
  X,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  RotateCcw,
  ZoomIn,
  Calendar,
  Sliders
} from 'lucide-react';

type BuiltInPage = 'home' | 'quem-somos' | 'solucoes' | 'contato';
type ActivePage = BuiltInPage | string; // string can be custom page ID

interface SolutionCardData extends SolutionDocData {
  key?: SegmentKey;
  demoMetricLabel?: string;
  demoMetricValue?: string;
  demoItems?: { col1: string; col2: string; col3: string; status: string }[];
}

const DEFAULT_SITE_CONFIG: SiteConfigData = {
  brandName: 'House Software',
  bannerSubtitle: 'soluções inteligente',
  bannerDescription:
    'Sistemas personalizados, fáceis de usar e feitos sob medida para dar tranquilidade e resultado ao seu comércio.',
  bannerImageUrl: '',
  bannerVideoUrl: '',
  homeSectionKicker: 'INOVAÇÃO PARA O SEU NEGÓCIO',
  homeSectionTitle: 'Benefícios do House software no seu comercio',
  homeSectionIntro:
    'Atualmente, com o aumento da competitividade, as empresas buscam soluções tecnológicas que auxiliem na melhoria da produtividade e do nível de qualidade de seus serviços. E a gestão inovadora em uma loja é importantíssima para o sucesso do seu negócio! Confira algumas vantagens:',
  aboutKicker: 'QUEM SOMOS · CONFIANÇA E PARCERIA',
  aboutTitle: 'Tecnologia feita por pessoas que entendem o seu dia a dia.',
  aboutDescription:
    'Na House Software, criamos sistemas sob medida que descomplicam suas vendas, organizam seu estoque e deixam mais tempo livre para você cuidar dos seus clientes.',
  aboutImageUrl: '',
  aboutVideoUrl: '',
  aboutBullet1: 'Telas simples: sua equipe aprende a usar no mesmo dia.',
  aboutBullet2: '100% simplificado ideal para lojas de roupas, informática, salões e comércios',
  aboutBullet3: 'Suporte humano, rápido e sempre próximo de você.',
  contactPhone: '(88) 99435-7360',
  contactEmail: 'house7software@gmail.com',
  whatsappNumber: '5588994357360'
};

const DEFAULT_SOLUTIONS: SolutionCardData[] = [
  {
    id: 'default-moda',
    key: 'moda',
    title: 'Lojas de Roupas & Moda',
    subtitle: 'Vestuário · Calçados · Acessórios',
    shortDescription:
      'Venda rápida no balcão, controle exato por cor e tamanho e trocas em segundos.',
    imageUrl: clothingSmilingImg,
    videoUrl: '',
    highlight1: 'Grade completa por tamanho (P ao GG) e cor',
    highlight2: 'Emissão de cupom fiscal e etiquetas de código de barras',
    highlight3: 'Controle de condicional (malinha) e clientes fiéis',
    isPublished: true,
    orderIndex: 1,
    demoMetricLabel: 'Tempo médio de venda no caixa',
    demoMetricValue: '8 segundos',
    demoItems: [
      { col1: 'Blazer Linho Areia', col2: 'Tam: P(4) · M(9) · G(6)', col3: 'R$ 389,00', status: 'Em Estoque' },
      { col1: 'Calça Jeans Wide Leg', col2: 'Tam: P(7) · M(14) · G(11)', col3: 'R$ 249,00', status: 'Alta Saída' },
      { col1: 'Vestido Midi Viscose', col2: 'Tam: P(6) · M(8) · G(4)', col3: 'R$ 329,00', status: 'Lançamento' }
    ]
  },
  {
    id: 'default-informatica',
    key: 'informatica',
    title: 'Informática & Assistência',
    subtitle: 'Lojas de Hardware · Assistência Técnica',
    shortDescription:
      'Organize sua bancada técnica, controle garantias por número de série e aprove orçamentos pelo celular.',
    imageUrl: itSmilingImg,
    videoUrl: '',
    highlight1: 'Ordem de Serviço (OS) rápida com aviso no WhatsApp',
    highlight2: 'Rastreio de peças e garantia por Número de Série',
    highlight3: 'Venda de produtos + cobrança de mão de obra integrada',
    isPublished: true,
    orderIndex: 2,
    demoMetricLabel: 'Aprovação de orçamentos no WhatsApp',
    demoMetricValue: '+54% mais rápido',
    demoItems: [
      { col1: 'OS #0841 · Dell Workstation', col2: 'S/N: DL984102BR', col3: 'R$ 1.620,00', status: 'Em Bancada' },
      { col1: 'OS #0842 · MacBook Pro 16"', col2: 'S/N: C02YM489MD', col3: 'R$ 2.100,00', status: 'Pronto p/ Retirada' },
      { col1: 'OS #0845 · PC Gamer RTX', col2: 'S/N: NV4070-882', col3: 'R$ 1.110,00', status: 'Aprovado' }
    ]
  },
  {
    id: 'default-celulares',
    key: 'celulares',
    title: 'Venda e Assistência Técnica de Celulares',
    subtitle: 'Smartphones · Conserto Rápido · Capinhas e Acessórios',
    shortDescription:
      'Controle completo de aparelhos novos e seminovos por IMEI, ordem de serviço com checklist na entrada e venda rápida de acessórios.',
    imageUrl: celularesSmilingImg,
    videoUrl: '',
    highlight1: 'Cadastro e termo de garantia de aparelhos por IMEI',
    highlight2: 'Ordem de Serviço com checklist (tela, bateria, câmeras) e aviso no WhatsApp',
    highlight3: 'PDV ágil para capinhas, películas, carregadores e troca de aparelhos',
    isPublished: true,
    orderIndex: 3,
    demoMetricLabel: 'Checklist de OS + Garantia por IMEI',
    demoMetricValue: 'Em 15 segundos',
    demoItems: [
      { col1: 'OS #1420 · iPhone 14 Pro (Tela)', col2: 'IMEI: 358912049102', col3: 'R$ 1.490,00', status: 'Em Reparo' },
      { col1: 'Venda · iPhone 15 128GB Seminovo', col2: 'IMEI: 354409182311', col3: 'R$ 4.390,00', status: 'Garantia 90d' },
      { col1: 'OS #1423 · Galaxy S23 (Bateria)', col2: 'IMEI: 359018230194', col3: 'R$ 420,00', status: 'Pronto p/ Retirada' }
    ]
  },
  {
    id: 'default-beleza',
    key: 'beleza',
    title: 'Salão de Beleza & Estética',
    subtitle: 'Salões · Barbearias · Clínicas de Estética',
    shortDescription:
      'Agenda sempre cheia, cálculo automático de comissões e controle simples do estoque de produtos.',
    imageUrl: salonSmilingImg,
    videoUrl: '',
    highlight1: 'Agenda por profissional com lembrete automático',
    highlight2: 'Comissão calculada na hora (Lei do Salão Parceiro)',
    highlight3: 'Controle de pacotes de sessões e produtos usados',
    isPublished: true,
    orderIndex: 4,
    demoMetricLabel: 'Fechamento de comissões da equipe',
    demoMetricValue: 'Em 1 clique',
    demoItems: [
      { col1: '09:30 · Beatriz M. (Mechas)', col2: 'Prof: Juliana · Comissão 50%', col3: 'R$ 680,00', status: 'Concluído' },
      { col1: '11:00 · Fernanda A. (Estética)', col2: 'Prof: Dra. Carla · Comissão 45%', col3: 'R$ 540,00', status: 'Em Atendimento' },
      { col1: '14:00 · Patrícia S. (Corte)', col2: 'Prof: Rafael · Comissão 50%', col3: 'R$ 260,00', status: 'Confirmado' }
    ]
  },
  {
    id: 'default-comercio',
    key: 'comercio',
    title: 'Demais Segmentos Comerciais',
    subtitle: 'Varejo em Geral · Mercados · Distribuidoras',
    shortDescription:
      'Gestão completa de vendas, estoque, contas a pagar e emissão fiscal para qualquer ramo comercial.',
    imageUrl: commerceSmilingImg,
    videoUrl: '',
    highlight1: 'Preços diferenciados para Atacado e Varejo',
    highlight2: 'Controle de estoque por lote, validade e código de barras',
    highlight3: 'Fluxo de caixa, PIX integrado e Nota Fiscal (NF-e / NFC-e)',
    isPublished: true,
    orderIndex: 5,
    demoMetricLabel: 'Controle financeiro e estoque unificado',
    demoMetricValue: '100% Seguro',
    demoItems: [
      { col1: 'Cafeteira Expresso Inox', col2: 'Varejo R$ 1.490 · Atacado R$ 1.180', col3: '42 un.', status: 'Estoque OK' },
      { col1: 'Kit Iluminação LED 3000K', col2: 'Varejo R$ 420 · Atacado R$ 315', col3: '118 un.', status: 'Alta Margem' },
      { col1: 'Leitor Código de Barras 2D', col2: 'Varejo R$ 360 · Atacado R$ 279', col3: '29 un.', status: 'Estoque OK' }
    ]
  }
];

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activePreviewSolutionId, setActivePreviewSolutionId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Dynamic Site Config & Public Data State
  const [siteConfig, setSiteConfig] = useState<SiteConfigData>(DEFAULT_SITE_CONFIG);
  const [customSolutions, setCustomSolutions] = useState<SolutionDocData[]>([]);
  const [customPages, setCustomPages] = useState<CustomPageDocData[]>([]);
  const [chatFaqs, setChatFaqs] = useState<ChatFaqDocData[]>([]);

  // Interactive Simulator, Lightbox Zoom, Calculator & Quick FAQ State
  const [interactiveRows, setInteractiveRows] = useState<
    { col1: string; col2: string; col3: string; status: string }[]
  >([]);
  const [simActionFeedback, setSimActionFeedback] = useState<string>('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [zoomedSolution, setZoomedSolution] = useState<{ title: string; imageUrl: string; subtitle: string } | null>(null);

  // Interactive Plan / Scope Calculator State
  const [calcSegment, setCalcSegment] = useState<string>('Loja de Roupas');
  const [calcTerminals, setCalcTerminals] = useState<string>('1 Caixa / PC');
  const [calcModules, setCalcModules] = useState<string[]>([
    'Frente de Caixa (PDV)',
    'Emissão Fiscal (NFC-e / NF-e)',
    'Controle de Estoque'
  ]);

  // Contact Form & Demo Scheduling State
  const [selectedSegment, setSelectedSegment] = useState<string>('Loja de Roupas');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [demoPreference, setDemoPreference] = useState<string>('Demonstração Online (15 min)');
  const [demoPeriod, setDemoPeriod] = useState<string>('Manhã (09h às 12h)');
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

  // 2. Real-time Firestore Listeners for Public & Admin CMS Data
  useEffect(() => {
    const configPath = 'site_config/main';
    const unsubConfig = onSnapshot(
      doc(db, 'site_config', 'main'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<SiteConfigData>;
          setSiteConfig({
            ...DEFAULT_SITE_CONFIG,
            ...data
          });
        } else {
          setSiteConfig(DEFAULT_SITE_CONFIG);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, configPath);
      }
    );

    const solutionsQuery = query(
      collection(db, 'solutions'),
      where('isPublished', '==', true)
    );
    const unsubSolutions = onSnapshot(
      solutionsQuery,
      (snap) => {
        const loaded: SolutionDocData[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<SolutionDocData, 'id'>)
        }));
        loaded.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setCustomSolutions(loaded);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'solutions');
      }
    );

    const pagesQuery = query(
      collection(db, 'custom_pages'),
      where('isPublished', '==', true)
    );
    const unsubPages = onSnapshot(
      pagesQuery,
      (snap) => {
        const loadedPages: CustomPageDocData[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<CustomPageDocData, 'id'>)
        }));
        loadedPages.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setCustomPages(loadedPages);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'custom_pages');
      }
    );

    const faqsQuery = query(
      collection(db, 'chat_faqs'),
      where('isPublished', '==', true)
    );
    const unsubFaqs = onSnapshot(
      faqsQuery,
      (snap) => {
        const loadedFaqs: ChatFaqDocData[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ChatFaqDocData, 'id'>)
        }));
        loadedFaqs.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
        setChatFaqs(loadedFaqs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'chat_faqs');
      }
    );

    return () => {
      unsubConfig();
      unsubSolutions();
      unsubPages();
      unsubFaqs();
    };
  }, []);

  // 4. Dynamic SEO & OpenGraph Meta Tag Synchronization
  useEffect(() => {
    const pageTitleMap: Record<string, string> = {
      home: `${siteConfig.brandName} — ${siteConfig.bannerSubtitle}`,
      'quem-somos': `Quem Somos · ${siteConfig.brandName}`,
      solucoes: `Soluções Comerciais · ${siteConfig.brandName}`,
      contato: `Solicitar Orçamento · ${siteConfig.brandName}`
    };
    const customPg = customPages.find((p) => p.id === activePage);
    const computedTitle = customPg
      ? `${customPg.title} · ${siteConfig.brandName}`
      : pageTitleMap[activePage] || `${siteConfig.brandName} — Sistemas Corporativos Customizados`;

    document.title = computedTitle;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', computedTitle);
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && siteConfig.bannerDescription) {
      metaDesc.setAttribute('content', siteConfig.bannerDescription);
    }
  }, [activePage, siteConfig.brandName, siteConfig.bannerSubtitle, siteConfig.bannerDescription, customPages]);

  // Merge default solutions with any custom/edited solutions saved in Firestore
  const displayedSolutions: SolutionCardData[] = React.useMemo(() => {
    const mapById = new Map<string, SolutionCardData>();
    DEFAULT_SOLUTIONS.forEach((def) => mapById.set(def.id, def));
    customSolutions.forEach((custom) => {
      const existingDefault = mapById.get(custom.id);
      mapById.set(custom.id, {
        ...existingDefault,
        ...custom,
        imageUrl: custom.imageUrl || existingDefault?.imageUrl || commerceSmilingImg
      });
    });
    return Array.from(mapById.values()).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [customSolutions]);

  const buildDynamicWhatsAppUrl = (text: string) => {
    const num = siteConfig.whatsappNumber.replace(/\D/g, '') || '5588994357360';
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const handleImgError = (key: string) => {
    setFailedImages((prev) => ({ ...prev, [key]: true }));
  };

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChooseSolution = (solutionTitle: string) => {
    setSelectedSegment(solutionTitle);
    setFormSuccess(false);
    navigateTo('contato');
  };

  const toggleCalcModule = (modName: string) => {
    setCalcModules((prev) =>
      prev.includes(modName) ? prev.filter((m) => m !== modName) : [...prev, modName]
    );
  };

  const handleApplyCalculatorToContact = () => {
    setSelectedSegment(calcSegment);
    const modsSummary = calcModules.length > 0 ? calcModules.join(', ') : 'Padrão';
    setMessage(`Porte: ${calcTerminals} | Módulos: ${modsSummary}`);
    setFormSuccess(false);
    navigateTo('contato');
  };

  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !company.trim()) {
      setFormError('Por favor, preencha seu nome e o nome da sua empresa.');
      return;
    }

    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setFormError('Informe um WhatsApp ou telefone válido com DDD.');
      return;
    }

    setIsSubmittingLead(true);
    const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const path = `contact_leads/${leadId}`;

    const schedulePrefix = `[${demoPreference} · Turno: ${demoPeriod}]`;
    const combinedMessage = message.trim()
      ? `${schedulePrefix} ${message.trim()}`
      : schedulePrefix;

    const whatsappDirectMsg = `Olá House Software! Me chamo ${name.trim()} da empresa ${company.trim()}.\nSegmento: ${selectedSegment}.\nTelefone: ${phone.trim()}.\nMensagem: ${combinedMessage}`;
    const targetUrl = `https://wa.me/5588994357360?text=${encodeURIComponent(whatsappDirectMsg)}`;

    try {
      await setDoc(doc(db, 'contact_leads', leadId), {
        name: name.trim().slice(0, 120),
        company: company.trim().slice(0, 120),
        phone: phone.trim().slice(0, 40),
        segment: selectedSegment.trim().slice(0, 80) || 'Geral',
        message: combinedMessage.slice(0, 600),
        status: 'novo',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setFormSuccess(true);
      // Direcionamento direto para o WhatsApp solicitado pelo usuário
      window.open(targetUrl, '_blank');
    } catch (error) {
      // Mesmo com erro de gravação temporária, redireciona para o WhatsApp para não perder o lead
      window.open(targetUrl, '_blank');
      setFormError('Não foi possível registrar seu pedido agora no banco. Clique no botão de WhatsApp para falar agora mesmo.');
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const activeSolutionModalData = displayedSolutions.find(
    (s) => s.id === activePreviewSolutionId
  );

  // Initialize interactive simulator rows when modal opens
  useEffect(() => {
    if (activeSolutionModalData?.demoItems) {
      setInteractiveRows(activeSolutionModalData.demoItems.map((item) => ({ ...item })));
      setSimActionFeedback('');
    }
  }, [activePreviewSolutionId, activeSolutionModalData]);

  const handleSimulateRowAction = (rowIndex: number) => {
    if (!activeSolutionModalData) return;
    const key = activeSolutionModalData.key;

    setInteractiveRows((prev) =>
      prev.map((row, idx) => {
        if (idx !== rowIndex) return row;

        if (key === 'moda') {
          // Decrement M size in string like "Tam: P(4) · M(9) · G(6)"
          const updatedCol2 = row.col2.replace(/M\((\d+)\)/, (_, countStr) => {
            const nextCount = Math.max(0, parseInt(countStr, 10) - 1);
            return `M(${nextCount})`;
          });
          setSimActionFeedback(`✓ Venda de "${row.col1}" (Tam M) registrada e estoque atualizado na hora!`);
          return {
            ...row,
            col2: updatedCol2,
            status: 'Venda Registrada'
          };
        }

        if (key === 'informatica' || key === 'celulares') {
          const nextStatus =
            row.status === 'Em Bancada' || row.status === 'Em Reparo'
              ? 'Aprovado'
              : row.status === 'Aprovado'
              ? 'Pronto p/ Retirada'
              : 'Entregue + Garantia IMEI';
          setSimActionFeedback(`✓ Status de "${row.col1}" atualizado para "${nextStatus}" com aviso automático no WhatsApp!`);
          return {
            ...row,
            status: nextStatus
          };
        }

        if (key === 'beleza') {
          setSimActionFeedback(`✓ Atendimento "${row.col1}" finalizado e comissão creditada automaticamente!`);
          return {
            ...row,
            status: 'Comissão Paga ✓'
          };
        }

        // Default / Comercio
        const updatedCol3 = row.col3.replace(/(\d+)\s*un\./, (_, countStr) => {
          const nextCount = Math.max(0, parseInt(countStr, 10) - 1);
          return `${nextCount} un.`;
        });
        setSimActionFeedback(`✓ Saída de "${row.col1}" lançada no caixa com emissão de NFC-e!`);
        return {
          ...row,
          col3: updatedCol3,
          status: 'Cupom Emitido'
        };
      })
    );
  };

  const activeCustomPageData = customPages.find((p) => p.id === activePage);

  const resolvedBannerImage = siteConfig.bannerImageUrl.trim() || bannerHappyImg;
  const resolvedAboutImage = siteConfig.aboutImageUrl.trim() || aboutSmilingImg;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F8F6] text-slate-900">
      {/* Top Bar Contract: Brand | HOME, QUEM SOMOS, SOLUÇÕES, CONTATO (+ Custom Menus) | Actions */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Zone 1: Empty spacer on desktop after removing top bar brand name */}
          <div className="hidden md:block w-24" aria-hidden="true" />

          {/* Zone 2: Top Menu Items (Built-in + Admin Custom Pages) */}
          <nav
            aria-label="Menu Principal"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700 overflow-x-auto"
          >
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer ${
                activePage === 'home' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => navigateTo('quem-somos')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer ${
                activePage === 'quem-somos' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              QUEM SOMOS
            </button>
            <button
              type="button"
              onClick={() => navigateTo('solucoes')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer ${
                activePage === 'solucoes' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              SOLUÇÕES
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contato')}
              className={`hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer ${
                activePage === 'contato' ? 'text-blue-700 underline underline-offset-4' : ''
              }`}
            >
              CONTATO
            </button>

            {/* Dynamic Custom Menus Created by the Admin */}
            {customPages.map((pg) => (
              <button
                key={pg.id}
                type="button"
                onClick={() => navigateTo(pg.id)}
                className={`hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer ${
                  activePage === pg.id ? 'text-blue-700 underline underline-offset-4' : ''
                }`}
              >
                {pg.menuLabel}
              </button>
            ))}
          </nav>

          {/* Zone 3: Ações de Contato & Menu Mobile */}
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={buildDynamicWhatsAppUrl('Olá House Software! Vim pelo site e gostaria de falar com um consultor.')}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg border border-slate-200 bg-white cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav
            aria-label="Menu Mobile"
            className="md:hidden bg-white border-b border-slate-200 px-6 py-4 flex flex-col gap-3 text-sm font-semibold text-slate-800"
          >
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className={`text-left py-1.5 hover:text-blue-700 ${
                activePage === 'home' ? 'text-blue-700 font-bold' : ''
              }`}
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => navigateTo('quem-somos')}
              className={`text-left py-1.5 hover:text-blue-700 ${
                activePage === 'quem-somos' ? 'text-blue-700 font-bold' : ''
              }`}
            >
              QUEM SOMOS
            </button>
            <button
              type="button"
              onClick={() => navigateTo('solucoes')}
              className={`text-left py-1.5 hover:text-blue-700 ${
                activePage === 'solucoes' ? 'text-blue-700 font-bold' : ''
              }`}
            >
              SOLUÇÕES
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contato')}
              className={`text-left py-1.5 hover:text-blue-700 ${
                activePage === 'contato' ? 'text-blue-700 font-bold' : ''
              }`}
            >
              CONTATO
            </button>

            {customPages.map((pg) => (
              <button
                key={pg.id}
                type="button"
                onClick={() => navigateTo(pg.id)}
                className={`text-left py-1.5 hover:text-blue-700 ${
                  activePage === pg.id ? 'text-blue-700 font-bold' : ''
                }`}
              >
                {pg.menuLabel}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {/* 1. HOME — BANNER + SEÇÃO INOVAÇÃO PARA O SEU NEGÓCIO */}
        {activePage === 'home' && (
          <>
            <section className="relative w-full min-h-[520px] lg:min-h-[580px] flex items-center justify-center overflow-hidden bg-slate-900">
              {!failedImages[resolvedBannerImage] ? (
                <img
                  src={resolvedBannerImage}
                  alt={`Banner ${siteConfig.brandName}`}
                  referrerPolicy="no-referrer"
                  onError={() => handleImgError(resolvedBannerImage)}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900" />
              )}

              {/* Contrast Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/65 to-slate-950/55" />

              {/* Logo HS ampliada com destaque na parte superior esquerda do banner com efeito de luzes girando */}
              <div className="rainbow-border-wrapper banner-top-left shadow-2xl rounded-2xl">
                <div className="rainbow-border-inner flex items-center justify-center p-1 rounded-2xl">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl bg-slate-950 flex flex-col items-center justify-center overflow-hidden border border-cyan-400/60 shadow-inner group relative">
                    <img 
                      src={logoHsImg} 
                      alt="House Software" 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback elegante se a imagem falhar
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('.logo-fallback') as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="logo-fallback hidden font-black text-xs sm:text-sm text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 flex-col items-center justify-center">
                      <span>HOUSE</span>
                      <span className="text-[10px] text-white">SOFTWARE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Centered Banner Content */}
              <div className="relative z-10 max-w-[960px] mx-auto px-6 py-20 text-center flex flex-col items-center">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight">
                  {siteConfig.brandName}
                </h1>

                <p className="mt-3 text-2xl sm:text-3xl font-semibold text-blue-300 tracking-wide">
                  {siteConfig.bannerSubtitle}
                </p>

                <p className="mt-5 text-base sm:text-lg text-slate-100 max-w-xl leading-relaxed">
                  {siteConfig.bannerDescription}
                </p>

              </div>
            </section>

            {/* Vídeo opcional na HOME se o Administrador adicionou */}
            {siteConfig.bannerVideoUrl.trim() && (
              <section className="py-12 bg-[#F8F8F6] border-t border-slate-200">
                <div className="max-w-4xl mx-auto px-6">
                  <VideoEmbed
                    url={siteConfig.bannerVideoUrl}
                    title={`Vídeo de Apresentação ${siteConfig.brandName}`}
                  />
                </div>
              </section>
            )}

            {/* Seção: INOVAÇÃO PARA O SEU NEGÓCIO (Abaixo do Banner em HOME) */}
            <section className="py-16 sm:py-20 bg-white border-t border-slate-200">
              <div className="max-w-[1200px] mx-auto px-6">
                <div className="max-w-3xl mx-auto text-center mb-12">
                  <p className="text-xs font-bold tracking-wider text-blue-700 mb-2">
                    {siteConfig.homeSectionKicker}
                  </p>
                  <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    {siteConfig.homeSectionTitle}
                  </h2>
                  <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">
                    {siteConfig.homeSectionIntro}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 pt-4">
                  {[
                    {
                      title: 'Controle eficaz',
                      desc: 'Controle operacional mais eficaz, automatizado e livres de erros.'
                    },
                    {
                      title: 'Acuracidade',
                      desc: 'Padronização e exatidão em todos os processos.'
                    },
                    {
                      title: 'Gestão de estoque',
                      desc: 'Melhoria organização do estoque.'
                    },
                    {
                      title: 'Otimização',
                      desc: 'Assertividade e eficiência nos processos.'
                    },
                    {
                      title: 'Tempo de espera',
                      desc: 'Redução no tempo de atendimento.'
                    },
                    {
                      title: 'Redução de custos',
                      desc: 'Menos prejuízos, maior produtividade.'
                    }
                  ].map((item) => (
                    <div key={item.title} className="text-center sm:text-left">
                      <h3 className="font-display text-lg font-bold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* 2. QUEM SOMOS */}
        {activePage === 'quem-somos' && (
          <section className="flex-1 py-16 sm:py-20 bg-white">
            <div className="max-w-[1200px] mx-auto px-6 space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-6">
                  <div className="aspect-4/3 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    {!failedImages[resolvedAboutImage] ? (
                      <img
                        src={resolvedAboutImage}
                        alt={`Equipe ${siteConfig.brandName}`}
                        referrerPolicy="no-referrer"
                        onError={() => handleImgError(resolvedAboutImage)}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white p-8">
                        <span className="font-display text-2xl font-bold">
                          {siteConfig.brandName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-5">
                  <div className="flex items-center gap-3">
                    {!failedImages['logo-hs'] ? (
                      <img
                        src={logoHsImg}
                        alt="Logo HS House Software"
                        referrerPolicy="no-referrer"
                        onError={() => handleImgError('logo-hs')}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-700 text-white font-display font-extrabold text-sm flex items-center justify-center">
                        HS
                      </div>
                    )}
                    <div className="text-xs font-semibold text-blue-700">
                      {siteConfig.aboutKicker}
                    </div>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                    {siteConfig.aboutTitle}
                  </h2>

                  <p className="text-base text-slate-600 leading-relaxed">
                    {siteConfig.aboutDescription}
                  </p>

                  <ul className="space-y-3 pt-2">
                    <li className="flex items-center gap-3 text-sm font-medium text-slate-800">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{siteConfig.aboutBullet1}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-slate-800">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{siteConfig.aboutBullet2}</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-slate-800">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{siteConfig.aboutBullet3}</span>
                    </li>
                  </ul>

                  <div className="pt-6 border-t border-slate-200 grid grid-cols-3 gap-4">
                    <div>
                      <strong className="text-2xl font-bold text-slate-900 font-mono-tabular block">
                        +140
                      </strong>
                      <span className="text-xs text-slate-500">Empresas Atendidas</span>
                    </div>
                    <div>
                      <strong className="text-2xl font-bold text-blue-700 font-mono-tabular block">
                        100%
                      </strong>
                      <span className="text-xs text-slate-500">Homologado Fiscal</span>
                    </div>
                    <div>
                      <strong className="text-2xl font-bold text-emerald-700 font-mono-tabular block">
                        99,9%
                      </strong>
                      <span className="text-xs text-slate-500">Clientes Satisfeitos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vídeo opcional em QUEM SOMOS */}
              {siteConfig.aboutVideoUrl.trim() && (
                <div className="max-w-4xl mx-auto pt-4">
                  <VideoEmbed
                    url={siteConfig.aboutVideoUrl}
                    title={`Vídeo Institucional ${siteConfig.brandName}`}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* 3. SOLUÇÕES */}
        {activePage === 'solucoes' && (
          <section className="flex-1 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.10),_transparent_28%),_#F4F7FB] py-12 sm:py-16">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
              <div className="mx-auto mb-8 max-w-3xl text-center">
                <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-700">
                  Nossas soluções sob medida
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  O sistema ideal para o seu segmento comercial
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  Projetos desenvolvidos para agilizar o atendimento e aumentar o lucro do seu negócio.
                </p>
              </div>

              <div className="mb-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Atendimento', value: 'mais rápido' },
                  { label: 'Controle', value: '100% digital' },
                  { label: 'Suporte', value: 'humano e próximo' }
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-slate-200 bg-white/85 px-5 py-4 text-center shadow-[0_10px_22px_rgba(15,23,42,0.04)] backdrop-blur-sm"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-lg font-bold text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                {displayedSolutions.map((item) => {
                  const highlights = [item.highlight1, item.highlight2, item.highlight3].filter(
                    (h) => h && h.trim().length > 0
                  );
                  return (
                    <article
                      key={item.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(15,23,42,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_22px_50px_rgba(37,99,235,0.12)]"
                    >
                      <div>
                        <div
                          onClick={() =>
                            item.imageUrl &&
                            setZoomedSolution({
                              title: item.title,
                              subtitle: item.subtitle,
                              imageUrl: item.imageUrl
                            })
                          }
                          className="group relative aspect-[4/3] w-full overflow-hidden bg-slate-900 cursor-zoom-in"
                        >
                          {!failedImages[item.id] && item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              onError={() => handleImgError(item.id)}
                              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-800 p-6 text-white">
                              <span className="text-lg font-bold">{item.title}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (item.imageUrl) {
                                setZoomedSolution({
                                  title: item.title,
                                  subtitle: item.subtitle,
                                  imageUrl: item.imageUrl
                                });
                              }
                            }}
                            className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-slate-950/65 px-2.5 py-1.5 text-[10px] font-semibold text-white backdrop-blur-sm transition-colors hover:bg-slate-950"
                          >
                            <ZoomIn className="h-3.5 w-3.5 text-blue-300" />
                            <span>Ampliar</span>
                          </button>
                          <div className="absolute bottom-4 left-5 right-5 text-white pointer-events-none">
                            <span className="block text-[10px] font-semibold uppercase tracking-[0.20em] text-blue-200">
                              {item.subtitle}
                            </span>
                            <h3 className="mt-2 text-xl font-bold leading-snug sm:text-2xl">
                              {item.title}
                            </h3>
                          </div>
                        </div>

                        <div className="space-y-4 p-5 sm:p-6">
                          <p className="text-sm font-medium leading-relaxed text-slate-700">
                            {item.shortDescription}
                          </p>

                          <ul className="space-y-2.5 text-xs text-slate-600">
                            {highlights.map((hl, idx) => (
                              <li key={idx} className="flex items-center gap-2.5">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50">
                                  <Check className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                                </span>
                                <span>{hl}</span>
                              </li>
                            ))}
                          </ul>

                          {item.videoUrl && item.videoUrl.trim() && (
                            <div className="pt-2">
                              <VideoEmbed url={item.videoUrl} title={item.title} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        {item.demoItems ? (
                          <button
                            type="button"
                            onClick={() => setActivePreviewSolutionId(item.id)}
                            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                          >
                            Ver Exemplo da Tela
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              item.imageUrl &&
                              setZoomedSolution({
                                title: item.title,
                                subtitle: item.subtitle,
                                imageUrl: item.imageUrl
                              })
                            }
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-100"
                          >
                            <ZoomIn className="h-3.5 w-3.5 text-blue-700" />
                            <span>Ampliar Imagem</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleChooseSolution(item.title)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-800"
                        >
                          <span>Quero no Meu Negócio</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Calculadora Rápida de Orçamento / Recomendação de Plano */}
              <div className="mt-16 bg-white border border-slate-200 rounded-2xl p-6 sm:p-10 shadow-xs">
                <div className="max-w-2xl mb-8">
                  <p className="text-xs font-bold tracking-wider text-blue-700 uppercase flex items-center gap-1.5 mb-2">
                    <Sliders className="w-3.5 h-3.5" />
                    <span>CONFIGURADOR RÁPIDO · MONTE O SISTEMA DA SUA LOJA</span>
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
                    Descubra o plano ideal para o seu negócio em 3 cliques
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
                    Marque as opções abaixo para receber uma recomendação sob medida da {siteConfig.brandName}.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-6">
                    {/* Passo 1 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        1. Qual é o ramo da sua loja?
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          'Loja de Roupas',
                          'Informática',
                          'Loja de Celulares',
                          'Salão de Beleza',
                          'Outro Comércio'
                        ].map((seg) => (
                          <button
                            key={seg}
                            type="button"
                            onClick={() => setCalcSegment(seg)}
                            className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                              calcSegment === seg
                                ? 'bg-slate-900 text-white border-slate-900'
                                : 'bg-[#F8F8F6] text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {seg}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Passo 2 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        2. Quantos computadores ou caixas vão usar o sistema?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {['1 Caixa / PC', '2 a 4 Computadores', '+5 Computadores / Filiais'].map(
                          (term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => setCalcTerminals(term)}
                              className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-center leading-snug transition-colors cursor-pointer ${
                                calcTerminals === term
                                  ? 'bg-blue-700 text-white border-blue-700'
                                  : 'bg-[#F8F8F6] text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {term}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Passo 3 */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-2">
                        3. Quais módulos são mais importantes para você?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          'Frente de Caixa (PDV)',
                          'Emissão Fiscal (NFC-e / NF-e)',
                          'Controle de Estoque / Grade',
                          'Ordem de Serviço / IMEI',
                          'Agenda & Comissões',
                          'Contas a Pagar / PIX'
                        ].map((mod) => {
                          const active = calcModules.includes(mod);
                          return (
                            <button
                              key={mod}
                              type="button"
                              onClick={() => toggleCalcModule(mod)}
                              className={`px-3 py-2 text-xs font-semibold rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                                active
                                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                  : 'bg-[#F8F8F6] text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{mod}</span>
                              {active && <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Resumo da Recomendação */}
                  <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 sm:p-7 space-y-5">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                        RECOMENDAÇÃO {siteConfig.brandName}
                      </span>
                      <h4 className="font-display text-xl font-bold mt-1">
                        Sistema {siteConfig.brandName} · {calcSegment}
                      </h4>
                      <p className="text-xs text-slate-300 mt-1">
                        Licença configurada para <strong>{calcTerminals}</strong> com implantação rápida e treinamento incluso.
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-800 pt-4 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Prazo médio de implantação:</span>
                        <strong className="text-emerald-400 font-mono-tabular">
                          No mesmo dia
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Módulos selecionados:</span>
                        <strong className="text-white font-mono-tabular">
                          {calcModules.length} módulo{calcModules.length === 1 ? '' : 's'}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Suporte e Backup em Nuvem:</span>
                        <strong className="text-blue-300">100% Inclusos</strong>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2.5">
                      <button
                        type="button"
                        onClick={handleApplyCalculatorToContact}
                        className="w-full py-3 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <span>Solicitar Orçamento Deste Plano</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <a
                        href={buildDynamicWhatsAppUrl(
                          `Olá ${siteConfig.brandName}! Fiz a simulação no site para *${calcSegment}* (${calcTerminals}) com os módulos: ${calcModules.join(', ')}. Gostaria de saber os valores!`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 px-4 text-xs font-bold text-emerald-300 hover:text-white bg-slate-800 hover:bg-emerald-600 rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Receber Valores no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Destaque para Exibir Logos de Comércios Parceiros que usam o sistema */}
              <CommerceLogosShowcase
                onOpenWhatsApp={(customMsg) => {
                  window.open(buildDynamicWhatsAppUrl(customMsg || 'Olá House Software!'), '_blank');
                }}
              />
            </div>
          </section>
        )}

        {/* 4. CONTATO */}
        {activePage === 'contato' && (
          <section className="relative flex-1 py-16 sm:py-20 overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
            {/* Modern Ambient Glow & Subtle Architectural Grid Pattern */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-28 -left-28 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 -right-28 w-[420px] h-[420px] rounded-full bg-emerald-500/15 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:24px_24px]"
            />

            <div className="relative z-10 max-w-[1080px] mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-5 space-y-6 min-w-0">
                  <div>
                    <p className="text-xs font-bold tracking-wider text-blue-300 uppercase mb-2">
                      CONTATO DIRETO
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      Vamos conversar sobre o seu sistema?
                    </h2>
                    <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                      Preencha os dados ao lado ou chame diretamente no nosso WhatsApp para receber uma apresentação rápida.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3.5 text-sm min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-slate-400 block">WhatsApp Comercial</span>
                        <strong className="font-mono-tabular text-white break-words">
                          {siteConfig.contactPhone}
                        </strong>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs flex items-center gap-3.5 text-sm min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs text-slate-400 block">E-mail de Atendimento</span>
                        <strong className="text-white break-all">{siteConfig.contactEmail}</strong>
                      </div>
                    </div>

                    <div className="pt-3 flex flex-col sm:flex-row flex-wrap gap-2.5">
                      <a
                        href={buildDynamicWhatsAppUrl(
                          `Olá ${siteConfig.brandName}! Gostaria de solicitar um orçamento de sistema.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-2 text-center shadow-lg shadow-emerald-950/40"
                      >
                        <MessageCircle className="w-4 h-4 shrink-0" />
                        <span>Mandar Mensagem no WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setChatOpen(true)}
                        className="px-4 py-3 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors text-center cursor-pointer backdrop-blur-xs"
                      >
                        Abrir Chat Tira-Dúvidas
                      </button>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white/95 backdrop-blur-md text-slate-900 border border-white/20 rounded-2xl p-5 sm:p-8 min-w-0 shadow-2xl">
                  {formSuccess ? (
                    <div className="py-6 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Mensagem enviada com sucesso!
                      </h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto">
                        Obrigado, <strong>{name}</strong>. Nossa equipe da{' '}
                        <strong>{siteConfig.brandName}</strong> entrará em contato pelo WhatsApp informado para apresentar a solução para{' '}
                        <strong>{company}</strong>.
                      </p>
                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <a
                          href={`https://wa.me/5588994357360?text=${encodeURIComponent(
                            `Olá House Software! Me chamo ${name.trim()} (${company.trim()}). Acabei de enviar um formulário no site e gostaria de atendimento!`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 shrink-0" />
                          <span>Abrir WhatsApp Agora: (88) 99435-7360</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => {
                            setFormSuccess(false);
                            setName('');
                            setCompany('');
                            setPhone('');
                            setMessage('');
                          }}
                          className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Enviar Nova Mensagem
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitContact} noValidate className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-2">
                          Qual é o seu segmento?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            'Loja de Roupas',
                            'Informática',
                            'Loja de Celulares',
                            'Salão de Beleza',
                            'Outro Comércio'
                          ].map((label) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setSelectedSegment(label)}
                              className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors text-center leading-tight cursor-pointer ${
                                selectedSegment === label
                                  ? 'bg-slate-900 text-white border-slate-900'
                                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {formError && (
                        <div
                          role="alert"
                          className="p-3 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg"
                        >
                          {formError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="c-name" className="block text-xs font-medium text-slate-700 mb-1">
                            Seu Nome *
                          </label>
                          <input
                            id="c-name"
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Carlos Silva"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                          />
                        </div>
                        <div>
                          <label htmlFor="c-company" className="block text-xs font-medium text-slate-700 mb-1">
                            Nome da Loja ou Empresa *
                          </label>
                          <input
                            id="c-company"
                            type="text"
                            required
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Ex: Loja Estilo Moda"
                            className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="c-phone" className="block text-xs font-medium text-slate-700 mb-1">
                          WhatsApp com DDD *
                        </label>
                        <input
                          id="c-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="(11) 99876-5432"
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 font-mono-tabular"
                        />
                      </div>

                      {/* Agendamento de Demonstração Online / Presencial */}
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                          <Calendar className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span>Agendar Demonstração Rápida (Como prefere ver o sistema?)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            'Demonstração Online (15 min)',
                            'Demonstração Presencial / Visita',
                            'Apenas Orçamento no WhatsApp',
                            'Ligação Telefônica'
                          ].map((pref) => (
                            <button
                              key={pref}
                              type="button"
                              onClick={() => setDemoPreference(pref)}
                              className={`py-2.5 px-3 text-xs font-semibold rounded-lg border text-left leading-snug transition-colors cursor-pointer ${
                                demoPreference === pref
                                  ? 'bg-blue-700 text-white border-blue-700'
                                  : 'bg-[#F8F8F6] text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {pref}
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                            Melhor período para falarmos com você:
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {['Manhã (09h às 12h)', 'Tarde (13h às 18h)', 'Qualquer Horário'].map(
                              (per) => (
                                <button
                                  key={per}
                                  type="button"
                                  onClick={() => setDemoPeriod(per)}
                                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center leading-tight transition-colors cursor-pointer ${
                                    demoPeriod === per
                                      ? 'bg-slate-900 text-white border-slate-900'
                                      : 'bg-[#F8F8F6] text-slate-700 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {per}
                                </button>
                              )
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="c-msg" className="block text-xs font-medium text-slate-700 mb-1">
                          Mensagem ou Observação (Opcional)
                        </label>
                        <input
                          id="c-msg"
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Ex: Gostaria de ver uma demonstração do sistema"
                          className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingLead}
                        className="w-full py-3.5 px-5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>
                          {isSubmittingLead
                            ? 'Enviando seu pedido...'
                            : `Solicitar Atendimento da ${siteConfig.brandName}`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Perguntas Frequentes (FAQ Rápido) */}
              <div className="mt-16 pt-12 border-t border-white/15">
                <div className="max-w-2xl mx-auto text-center mb-8">
                  <p className="text-xs font-bold tracking-wider text-blue-300 uppercase mb-1.5">
                    TIRE SUAS DÚVIDAS NA HORA
                  </p>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                    Perguntas Frequentes antes de contratar
                  </h3>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                  {[
                    {
                      q: '1. O sistema precisa de internet o tempo todo para funcionar?',
                      a: 'Não! Nosso frente de caixa (PDV) possui contingência inteligente: você continua registrando vendas e imprimindo cupons normalmente mesmo se a internet da loja cair.'
                    },
                    {
                      q: '2. O sistema emite Nota Fiscal (NF-e, NFC-e e NFS-e)?',
                      a: 'Sim, 100% homologado na SEFAZ de todos os estados e prefeituras. O sistema calcula impostos automaticamente e já envia os arquivos XML direto para o seu contador.'
                    },
                    {
                      q: '3. Como funciona a implantação e o treinamento da minha equipe?',
                      a: 'Nossa equipe faz toda a configuração inicial para o seu segmento, importa seu cadastro de produtos atual e treina você e seus funcionários passo a passo no mesmo dia.'
                    },
                    {
                      q: '4. Os dados do meu estoque e financeiro ficam seguros?',
                      a: 'Sim! Além do controle de acesso por funcionário com senha, o sistema realiza backup automático diário em nuvem criptografada para você nunca perder nenhuma informação.'
                    }
                  ].map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="border border-white/15 rounded-xl bg-white/95 text-slate-900 overflow-hidden shadow-lg"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-display text-sm sm:text-base font-bold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown
                            className={`w-4 h-4 text-blue-700 shrink-0 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/70 pt-3 bg-white">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 5. PÁGINAS PERSONALIZADAS CRIADAS PELO ADMINISTRADOR */}
        {activeCustomPageData && (
          <section className="flex-1 py-16 sm:py-20 bg-white">
            <div className="max-w-4xl mx-auto px-6 space-y-8">
              <div>
                <p className="text-xs font-bold tracking-wider text-blue-700 uppercase mb-2">
                  {activeCustomPageData.menuLabel} · {siteConfig.brandName}
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                  {activeCustomPageData.title}
                </h2>
                {activeCustomPageData.subtitle && (
                  <p className="mt-2 text-base sm:text-lg text-slate-600">
                    {activeCustomPageData.subtitle}
                  </p>
                )}
              </div>

              {/* Foto de destaque da página personalizada */}
              {activeCustomPageData.imageUrl && activeCustomPageData.imageUrl.trim() && (
                <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 max-h-[460px]">
                  <img
                    src={activeCustomPageData.imageUrl}
                    alt={activeCustomPageData.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Vídeo incorporado da página personalizada */}
              {activeCustomPageData.videoUrl && activeCustomPageData.videoUrl.trim() && (
                <VideoEmbed
                  url={activeCustomPageData.videoUrl}
                  title={activeCustomPageData.title}
                />
              )}

              {/* Conteúdo em texto */}
              <div className="prose max-w-none text-slate-700 text-base leading-relaxed whitespace-pre-line bg-[#F8F8F6] p-6 sm:p-8 rounded-2xl border border-slate-200">
                {activeCustomPageData.content}
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200">
                <a
                  href={buildDynamicWhatsAppUrl(
                    `Olá ${siteConfig.brandName}! Estava vendo a página "${activeCustomPageData.title}" e gostaria de conversar.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Conversar no WhatsApp sobre {activeCustomPageData.menuLabel}</span>
                </a>

                <button
                  type="button"
                  onClick={() => navigateTo('contato')}
                  className="px-5 py-3 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Solicitar Orçamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Modal Simulador Interativo da Solução */}
      {activeSolutionModalData && activeSolutionModalData.demoItems && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full overflow-hidden shadow-xl">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-300 block">
                  {siteConfig.brandName} · Simulador Interativo (Clique nos botões abaixo para testar)
                </span>
                <h3 className="text-base font-bold">{activeSolutionModalData.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreviewSolutionId(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {activeSolutionModalData.demoMetricLabel && (
                <div className="flex items-center justify-between p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <span className="text-xs text-slate-700">
                    {activeSolutionModalData.demoMetricLabel}
                  </span>
                  <strong className="text-sm font-bold text-blue-800 font-mono-tabular">
                    {activeSolutionModalData.demoMetricValue}
                  </strong>
                </div>
              )}

              {simActionFeedback && (
                <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center justify-between gap-2">
                  <span>{simActionFeedback}</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (activeSolutionModalData.demoItems) {
                        setInteractiveRows(
                          activeSolutionModalData.demoItems.map((item) => ({ ...item }))
                        );
                        setSimActionFeedback('');
                      }
                    }}
                    className="text-[11px] text-emerald-700 hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reiniciar Teste</span>
                  </button>
                </div>
              )}

              <div className="border border-slate-200 rounded-lg overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3">Item / Registro</th>
                      <th className="py-2.5 px-3">Detalhe</th>
                      <th className="py-2.5 px-3 text-right">Valor / Qtd</th>
                      <th className="py-2.5 px-3 text-right">Status</th>
                      <th className="py-2.5 px-3 text-right">Testar Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {interactiveRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{row.col1}</td>
                        <td className="py-2.5 px-3 text-slate-600 font-mono-tabular">{row.col2}</td>
                        <td className="py-2.5 px-3 text-right font-mono-tabular font-semibold text-slate-900">
                          {row.col3}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-700 font-semibold">
                          {row.status}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleSimulateRowAction(idx)}
                            className="px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {activeSolutionModalData.key === 'moda' && 'Vender 1 Tam M'}
                            {(activeSolutionModalData.key === 'informatica' ||
                              activeSolutionModalData.key === 'celulares') &&
                              'Avançar OS / IMEI'}
                            {activeSolutionModalData.key === 'beleza' && 'Pagar Comissão'}
                            {(!activeSolutionModalData.key ||
                              activeSolutionModalData.key === 'comercio') &&
                              'Registrar Venda'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-500">
                  * Simulação demonstrativa da velocidade do sistema {siteConfig.brandName}.
                </span>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActivePreviewSolutionId(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeSolutionModalData.title;
                      setActivePreviewSolutionId(null);
                      handleChooseSolution(title);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                  >
                    Solicitar Orçamento Deste Sistema
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lightbox de Zoom para Galeria / Telas das Soluções */}
      {zoomedSolution && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setZoomedSolution(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white">
              <div>
                <span className="text-xs text-blue-300 block">{zoomedSolution.subtitle}</span>
                <h3 className="font-display text-lg font-bold">{zoomedSolution.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setZoomedSolution(null)}
                className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-hidden">
              <img
                src={zoomedSolution.imageUrl}
                alt={zoomedSolution.title}
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[75vh] object-contain"
              />
            </div>
            <div className="px-6 py-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Visualização ampliada · {siteConfig.brandName}
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setZoomedSolution(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = zoomedSolution.title;
                    setZoomedSolution(null);
                    handleChooseSolution(title);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg cursor-pointer"
                >
                  Quero Este Sistema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé Limpo */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="font-display text-lg font-bold text-white">
              {siteConfig.brandName}
            </span>
            <span className="mx-2 text-slate-600">·</span>
            <span className="text-sm text-blue-300">{siteConfig.bannerSubtitle}</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              HOME
            </button>
            <button
              type="button"
              onClick={() => navigateTo('quem-somos')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              QUEM SOMOS
            </button>
            <button
              type="button"
              onClick={() => navigateTo('solucoes')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              SOLUÇÕES
            </button>
            <button
              type="button"
              onClick={() => navigateTo('contato')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              CONTATO
            </button>
            {customPages.map((pg) => (
              <button
                key={pg.id}
                type="button"
                onClick={() => navigateTo(pg.id)}
                className="hover:text-white transition-colors cursor-pointer"
              >
                {pg.menuLabel}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>© {new Date().getFullYear()} {siteConfig.brandName}. Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante de WhatsApp + Chat Tira-Dúvidas */}
      <SupportChatAndWhatsApp
        isOpen={chatOpen}
        onToggleChat={setChatOpen}
        whatsappNumber={siteConfig.whatsappNumber}
        brandName={siteConfig.brandName}
        customFaqs={chatFaqs}
      />
    </div>
  );
}
