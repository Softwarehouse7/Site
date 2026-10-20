import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  collection
} from 'firebase/firestore';
import {
  db,
  loginAdminWithGoogle,
  logoutAdmin,
  handleFirestoreError,
  OperationType,
  OWNER_EMAIL,
  isOwnerEmail,
  uploadImageToStorage
} from '../firebase';
import {
  X,
  Plus,
  Trash2,
  Save,
  Check,
  Edit3,
  LogIn,
  LogOut,
  Video,
  Image as ImageIcon,
  FileText,
  Layout,
  Upload,
  Inbox,
  MessageCircle,
  Download,
  HelpCircle,
  Store,
  Building2,
  Shirt,
  Smartphone,
  Laptop,
  Scissors,
  ShoppingBag,
  Glasses,
  CheckCircle2,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { ChatFaqDocData, DEFAULT_CHAT_FAQS } from './SupportChatAndWhatsApp';
import {
  CommerceLogoItem,
  DEFAULT_COMMERCE_LOGOS,
  STORAGE_KEY,
  compressLogoImage
} from './CommerceLogosShowcase';

/**
 * Resizes and compresses a local image file from the user's computer
 * into a compact JPEG Data URL (< 350KB) suitable for fast Firestore storage.
 */
async function compressImageFileToDataUrl(file: File, maxWidth = 1100, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido.'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Não foi possível processar a imagem.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export interface SiteConfigData {
  brandName: string;
  bannerSubtitle: string;
  bannerDescription: string;
  bannerImageUrl: string;
  bannerVideoUrl: string;
  homeSectionKicker: string;
  homeSectionTitle: string;
  homeSectionIntro: string;
  aboutKicker: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImageUrl: string;
  aboutVideoUrl: string;
  aboutBullet1: string;
  aboutBullet2: string;
  aboutBullet3: string;
  contactPhone: string;
  contactEmail: string;
  whatsappNumber: string;
  authorId?: string;
  createdAt?: unknown;
}

export interface SolutionDocData {
  id: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  imageUrl: string;
  videoUrl: string;
  highlight1: string;
  highlight2: string;
  highlight3: string;
  isPublished: boolean;
  orderIndex: number;
  authorId?: string;
  createdAt?: unknown;
}

export interface CustomPageDocData {
  id: string;
  menuLabel: string;
  title: string;
  subtitle: string;
  content: string;
  imageUrl: string;
  videoUrl: string;
  isPublished: boolean;
  orderIndex: number;
  authorId?: string;
  createdAt?: unknown;
}

export interface ContactLeadDocData {
  id: string;
  name: string;
  company: string;
  phone: string;
  segment: string;
  message: string;
  status: 'novo' | 'atendido';
  createdAt?: { seconds?: number } | unknown;
  updatedAt?: unknown;
}

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (newVal: string) => void;
  placeholder?: string;
  onErrorMsg: (msg: string) => void;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = 'Cole um link https://... ou envie do computador',
  onErrorMsg
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressedDataUrl = await compressImageFileToDataUrl(file);
      onChange(compressedDataUrl);
    } catch (err) {
      onErrorMsg(err instanceof Error ? err.message : 'Erro ao processar a foto selecionada.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const isDataUrl = value.startsWith('data:image/');

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Upload from Computer Button */}
        <label className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-colors">
          <Upload className="w-3.5 h-3.5 text-blue-300" />
          <span>{uploading ? 'Processando foto...' : 'Enviar Foto do Computador'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {/* Or external URL input */}
        <input
          type="text"
          value={isDataUrl ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isDataUrl ? 'Foto enviada do computador (clique em Remover para trocar)' : placeholder}
          disabled={isDataUrl}
          className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-emerald-700 disabled:font-semibold"
        />

        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="px-2.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg shrink-0 cursor-pointer"
          >
            Remover Foto
          </button>
        )}
      </div>

      {/* Live Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-white border border-slate-200 rounded-lg">
          <img
            src={value}
            alt="Pré-visualização da foto"
            referrerPolicy="no-referrer"
            className="w-16 h-12 object-cover rounded border border-slate-200 shrink-0"
          />
          <span className="text-[11px] text-emerald-700 font-medium">
            {isDataUrl
              ? 'Foto carregada do seu computador pronta para salvar.'
              : 'Foto por link externo pronta para salvar.'}
          </span>
        </div>
      )}
    </div>
  );
};

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  siteConfig: SiteConfigData;
  hasExistingSiteConfigDoc: boolean;
  solutions: SolutionDocData[];
  customPages: CustomPageDocData[];
  contactLeads: ContactLeadDocData[];
  chatFaqs: ChatFaqDocData[];
  onNavigateToCustomPage: (pageId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  currentUser,
  siteConfig,
  hasExistingSiteConfigDoc,
  solutions,
  customPages,
  contactLeads,
  chatFaqs,
  onNavigateToCustomPage
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'solucoes' | 'paginas' | 'leads' | 'chat' | 'logos'>('geral');
  const [configForm, setConfigForm] = useState<SiteConfigData>(siteConfig);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  // Solution Editor State
  const [editingSolutionId, setEditingSolutionId] = useState<string | null>(null);
  const [solTitle, setSolTitle] = useState('');
  const [solSubtitle, setSolSubtitle] = useState('');
  const [solDesc, setSolDesc] = useState('');
  const [solImage, setSolImage] = useState('');
  const [solVideo, setSolVideo] = useState('');
  const [solH1, setSolH1] = useState('');
  const [solH2, setSolH2] = useState('');
  const [solH3, setSolH3] = useState('');

  // Custom Page Editor State
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [pageMenuLabel, setPageMenuLabel] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [pageSubtitle, setPageSubtitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageImage, setPageImage] = useState('');
  const [pageVideo, setPageVideo] = useState('');

  // Chat FAQ Editor State
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqCategory, setFaqCategory] = useState('Geral');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqKeywords, setFaqKeywords] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Partner Commerces & Logos State
  const [commercesList, setCommercesList] = useState<CommerceLogoItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_COMMERCE_LOGOS;
  });
  const [editingStoreId, setEditingStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState('');
  const [storeSegment, setStoreSegment] = useState('Loja de Roupas & Calçados');
  const [storeCity, setStoreCity] = useState('');
  const [storeActiveSince, setStoreActiveSince] = useState('Cliente Ativo · Sistema House Software');
  const [storeLogoUrl, setStoreLogoUrl] = useState('');
  const [storeIconType, setStoreIconType] = useState<CommerceLogoItem['iconType']>('moda');
  const [isUploadingStoreLogo, setIsUploadingStoreLogo] = useState(false);

  useEffect(() => {
    setConfigForm(siteConfig);
  }, [siteConfig]);

  // 5. Manage Chat FAQs (Must be called before any early return to comply with Rules of Hooks)
  const mergedChatFaqs = React.useMemo(() => {
    const map = new Map<string, ChatFaqDocData>();
    DEFAULT_CHAT_FAQS.forEach((f) => map.set(f.id, f));
    chatFaqs.forEach((cf) => map.set(cf.id, cf));
    return Array.from(map.values()).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  }, [chatFaqs]);

  if (!isOpen) return null;

  const isAuthorizedAdmin =
    currentUser &&
    currentUser.emailVerified &&
    isOwnerEmail(currentUser.email);

  const showFeedback = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg(null);
    }, 5000);
  };

  const handleLogin = async () => {
    try {
      setStatusMsg(null);
      await loginAdminWithGoogle();
    } catch (err) {
      showFeedback(
        'error',
        err instanceof Error ? err.message : 'Não foi possível concluir o login com o Google.'
      );
    }
  };

  // 1. Save Site Config
  const handleSaveSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSaving(true);
    setStatusMsg(null);

    const sanitizedWhatsapp = configForm.whatsappNumber.replace(/\D/g, '') || '5588994357360';
    const path = 'site_config/main';

    try {
      const [bannerImageUrl, aboutImageUrl] = await Promise.all([
        uploadImageToStorage(configForm.bannerImageUrl.trim(), currentUser.uid),
        uploadImageToStorage(configForm.aboutImageUrl.trim(), currentUser.uid)
      ]);
      const payload = {
        brandName: configForm.brandName.trim().slice(0, 80) || 'House Software',
        bannerSubtitle: configForm.bannerSubtitle.trim().slice(0, 120) || 'soluções inteligente',
        bannerDescription:
          configForm.bannerDescription.trim().slice(0, 400) ||
          'Sistemas personalizados para o seu comércio.',
        bannerImageUrl,
        bannerVideoUrl: configForm.bannerVideoUrl.trim().slice(0, 2000),
        homeSectionKicker:
          configForm.homeSectionKicker.trim().slice(0, 120) || 'INOVAÇÃO PARA O SEU NEGÓCIO',
        homeSectionTitle:
          configForm.homeSectionTitle.trim().slice(0, 160) ||
          'Benefícios do House software no seu comercio',
        homeSectionIntro:
          configForm.homeSectionIntro.trim().slice(0, 800) ||
          'Confira as principais vantagens para sua loja:',
        aboutKicker:
          configForm.aboutKicker.trim().slice(0, 120) || 'QUEM SOMOS · CONFIANÇA E PARCERIA',
        aboutTitle:
          configForm.aboutTitle.trim().slice(0, 200) ||
          'Tecnologia feita por pessoas que entendem o seu dia a dia.',
        aboutDescription:
          configForm.aboutDescription.trim().slice(0, 1000) ||
          'Criamos sistemas sob medida que descomplicam suas vendas.',
        aboutImageUrl,
        aboutVideoUrl: configForm.aboutVideoUrl.trim().slice(0, 2000),
        aboutBullet1:
          configForm.aboutBullet1.trim().slice(0, 240) ||
          'Telas simples: sua equipe aprende a usar no mesmo dia.',
        aboutBullet2:
          configForm.aboutBullet2.trim().slice(0, 240) ||
          '100% simplificado ideal para lojas de roupas, informática, salões e comércios',
        aboutBullet3:
          configForm.aboutBullet3.trim().slice(0, 240) ||
          'Suporte humano, rápido e sempre próximo de você.',
        contactPhone: configForm.contactPhone.trim().slice(0, 60) || '(88) 99435-7360',
        contactEmail:
          configForm.contactEmail.trim().slice(0, 120) || 'house7software@gmail.com',
        whatsappNumber: sanitizedWhatsapp.slice(0, 30),
        updatedAt: serverTimestamp()
      };

      if (!hasExistingSiteConfigDoc) {
        await setDoc(doc(db, 'site_config', 'main'), {
          ...payload,
          authorId: currentUser.uid,
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'site_config', 'main'), payload);
      }
      showFeedback('success', 'Alterações principais do site salvas e publicadas com sucesso!');
    } catch (error) {
      showFeedback('error', 'Erro ao salvar configurações. Verifique suas permissões de administrador.');
      handleFirestoreError(
        error,
        hasExistingSiteConfigDoc ? OperationType.UPDATE : OperationType.CREATE,
        path
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleMigrateImages = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    setStatusMsg(null);
    let migratedDocuments = 0;

    const migrateFields = async (
      documentRef: ReturnType<typeof doc>,
      data: Record<string, unknown>,
      fields: string[]
    ) => {
      const updates: Record<string, unknown> = {};
      for (const field of fields) {
        const value = data[field];
        if (typeof value === 'string' && value.startsWith('data:image/')) {
          updates[field] = await uploadImageToStorage(value, currentUser.uid);
        }
      }
      if (Object.keys(updates).length > 0) {
        await updateDoc(documentRef, { ...updates, updatedAt: serverTimestamp() });
        migratedDocuments += 1;
      }
    };

    try {
      const configRef = doc(db, 'site_config', 'main');
      const configSnapshot = await getDoc(configRef);
      if (configSnapshot.exists()) {
        await migrateFields(configRef, configSnapshot.data(), ['bannerImageUrl', 'aboutImageUrl']);
      }

      for (const collectionName of ['solutions', 'custom_pages']) {
        const documents = await getDocs(collection(db, collectionName));
        for (const documentSnapshot of documents.docs) {
          await migrateFields(documentSnapshot.ref, documentSnapshot.data(), ['imageUrl']);
        }
      }
      showFeedback(
        'success',
        migratedDocuments
          ? `${migratedDocuments} documento(s) migrado(s) para o Firebase Storage.`
          : 'Não há imagens antigas para migrar.'
      );
    } catch (error) {
      showFeedback(
        'error',
        `Migração interrompida após ${migratedDocuments} documento(s): ${
          error instanceof Error ? error.message : 'falha desconhecida.'
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Save or Create Solution Item
  const resetSolutionForm = () => {
    setEditingSolutionId(null);
    setSolTitle('');
    setSolSubtitle('');
    setSolDesc('');
    setSolImage('');
    setSolVideo('');
    setSolH1('');
    setSolH2('');
    setSolH3('');
  };

  const handleEditSolutionClick = (sol: SolutionDocData) => {
    setEditingSolutionId(sol.id);
    setSolTitle(sol.title);
    setSolSubtitle(sol.subtitle);
    setSolDesc(sol.shortDescription);
    setSolImage(sol.imageUrl);
    setSolVideo(sol.videoUrl);
    setSolH1(sol.highlight1);
    setSolH2(sol.highlight2);
    setSolH3(sol.highlight3);
  };

  const handleSaveSolution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !solTitle.trim() || !solDesc.trim() || !solH1.trim()) {
      showFeedback('error', 'Preencha pelo menos o título, a descrição curta e o destaque 1.');
      return;
    }

    setIsSaving(true);
    const docId = editingSolutionId || `sol_${Date.now()}`;
    const path = `solutions/${docId}`;

    try {
      const baseData = {
        title: solTitle.trim().slice(0, 120),
        subtitle: (solSubtitle.trim() || 'Solução Customizada').slice(0, 120),
        shortDescription: solDesc.trim().slice(0, 500),
        imageUrl: await uploadImageToStorage(solImage.trim(), currentUser.uid),
        videoUrl: solVideo.trim().slice(0, 2000),
        highlight1: solH1.trim().slice(0, 200),
        highlight2: solH2.trim().slice(0, 200),
        highlight3: solH3.trim().slice(0, 200),
        isPublished: true,
        orderIndex: editingSolutionId
          ? solutions.find((s) => s.id === editingSolutionId)?.orderIndex ?? solutions.length
          : solutions.length + 1,
        updatedAt: serverTimestamp()
      };

      const isExistingInFirestore = solutions.some(
        (s) => s.id === editingSolutionId && s.authorId
      );

      if (editingSolutionId && isExistingInFirestore) {
        await updateDoc(doc(db, 'solutions', docId), baseData);
      } else {
        await setDoc(doc(db, 'solutions', docId), {
          ...baseData,
          authorId: currentUser.uid,
          createdAt: serverTimestamp()
        });
      }

      resetSolutionForm();
      showFeedback('success', 'Solução salva com sucesso na página SOLUÇÕES!');
    } catch (error) {
      showFeedback('error', 'Erro ao salvar a solução.');
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteSolution = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'solutions', id));
      showFeedback('success', 'Solução removida com sucesso.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `solutions/${id}`);
    }
  };

  // 3. Create or Edit Custom Page / Menu
  const resetPageForm = () => {
    setEditingPageId(null);
    setPageMenuLabel('');
    setPageTitle('');
    setPageSubtitle('');
    setPageContent('');
    setPageImage('');
    setPageVideo('');
  };

  const handleEditPageClick = (pg: CustomPageDocData) => {
    setEditingPageId(pg.id);
    setPageMenuLabel(pg.menuLabel);
    setPageTitle(pg.title);
    setPageSubtitle(pg.subtitle);
    setPageContent(pg.content);
    setPageImage(pg.imageUrl);
    setPageVideo(pg.videoUrl);
  };

  const handleSaveCustomPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !pageMenuLabel.trim() || !pageTitle.trim() || !pageContent.trim()) {
      showFeedback(
        'error',
        'Preencha o Nome do Menu, o Título da Página e o Texto para criar a página.'
      );
      return;
    }

    setIsSaving(true);
    const docId = editingPageId || `page_${Date.now()}`;
    const path = `custom_pages/${docId}`;

    try {
      const basePage = {
        menuLabel: pageMenuLabel.trim().toUpperCase().slice(0, 40),
        title: pageTitle.trim().slice(0, 160),
        subtitle: pageSubtitle.trim().slice(0, 240),
        content: pageContent.trim().slice(0, 5000),
        imageUrl: await uploadImageToStorage(pageImage.trim(), currentUser.uid),
        videoUrl: pageVideo.trim().slice(0, 2000),
        isPublished: true,
        orderIndex: editingPageId
          ? customPages.find((p) => p.id === editingPageId)?.orderIndex ?? customPages.length
          : customPages.length + 1,
        updatedAt: serverTimestamp()
      };

      if (editingPageId) {
        await updateDoc(doc(db, 'custom_pages', docId), basePage);
      } else {
        await setDoc(doc(db, 'custom_pages', docId), {
          ...basePage,
          authorId: currentUser.uid,
          createdAt: serverTimestamp()
        });
      }

      resetPageForm();
      showFeedback(
        'success',
        'Página e menu salvos! O novo menu já está visível na barra superior do site.'
      );
    } catch (error) {
      showFeedback('error', 'Erro ao salvar a página personalizada.');
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCustomPage = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'custom_pages', id));
      showFeedback('success', 'Página e menu removidos do site.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `custom_pages/${id}`);
    }
  };

  // 4. Manage Contact Leads
  const handleToggleLeadStatus = async (lead: ContactLeadDocData) => {
    if (!currentUser) return;
    const nextStatus: 'novo' | 'atendido' = lead.status === 'novo' ? 'atendido' : 'novo';
    try {
      await updateDoc(doc(db, 'contact_leads', lead.id), {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });
      showFeedback(
        'success',
        nextStatus === 'atendido'
          ? `Contato de ${lead.name} marcado como atendido!`
          : `Contato de ${lead.name} reaberto como novo.`
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `contact_leads/${lead.id}`);
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'contact_leads', id));
      showFeedback('success', 'Registro de contato excluído.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `contact_leads/${id}`);
    }
  };

  const buildClientWhatsAppLink = (lead: ContactLeadDocData) => {
    const cleanDigits = lead.phone.replace(/\D/g, '');
    const fullNum = cleanDigits.startsWith('55') ? cleanDigits : `55${cleanDigits}`;
    const text = `Olá ${lead.name}! Tudo bem? Aqui é da ${siteConfig.brandName}. Recebemos o seu pedido de orçamento pelo nosso site para a empresa ${lead.company} (${lead.segment}) e gostaríamos de conversar!`;
    return `https://wa.me/${fullNum}?text=${encodeURIComponent(text)}`;
  };

  const handleExportLeadsCsv = () => {
    if (contactLeads.length === 0) return;
    const headers = ['Status', 'Nome', 'Empresa', 'WhatsApp', 'Segmento', 'Mensagem'];
    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const rows = contactLeads.map((l) =>
      [
        escapeCsv(l.status === 'novo' ? 'Novo' : 'Atendido'),
        escapeCsv(l.name),
        escapeCsv(l.company),
        escapeCsv(l.phone),
        escapeCsv(l.segment),
        escapeCsv(l.message)
      ].join(';')
    );
    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `contatos_house_software_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showFeedback('success', 'Planilha de contatos (CSV/Excel) baixada com sucesso!');
  };

  const resetFaqForm = () => {
    setEditingFaqId(null);
    setFaqCategory('Geral');
    setFaqQuestion('');
    setFaqKeywords('');
    setFaqAnswer('');
  };

  const handleEditFaqClick = (faq: ChatFaqDocData) => {
    setEditingFaqId(faq.id);
    setFaqCategory(faq.category);
    setFaqQuestion(faq.question);
    setFaqKeywords(faq.keywords);
    setFaqAnswer(faq.answer);
  };

  const handleSaveChatFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !faqQuestion.trim() || !faqAnswer.trim()) {
      showFeedback('error', 'Preencha a Pergunta e a Resposta para salvar no Chat.');
      return;
    }

    setIsSaving(true);
    const docId = editingFaqId || `faq_${Date.now()}`;
    const path = `chat_faqs/${docId}`;

    try {
      const baseFaq = {
        question: faqQuestion.trim().slice(0, 160),
        keywords: faqKeywords.trim().slice(0, 240),
        answer: faqAnswer.trim().slice(0, 1500),
        category: faqCategory.trim().slice(0, 60) || 'Geral',
        isPublished: true,
        orderIndex: editingFaqId
          ? mergedChatFaqs.find((f) => f.id === editingFaqId)?.orderIndex ?? mergedChatFaqs.length
          : mergedChatFaqs.length + 1,
        updatedAt: serverTimestamp()
      };

      const isExistingInFirestore = chatFaqs.some((f) => f.id === editingFaqId && f.authorId);

      if (editingFaqId && isExistingInFirestore) {
        await updateDoc(doc(db, 'chat_faqs', docId), baseFaq);
      } else {
        await setDoc(doc(db, 'chat_faqs', docId), {
          ...baseFaq,
          authorId: currentUser.uid,
          createdAt: serverTimestamp()
        });
      }

      resetFaqForm();
      showFeedback('success', 'Pergunta e resposta salvas no Chat Tira-Dúvidas!');
    } catch (error) {
      showFeedback('error', 'Erro ao salvar pergunta do Chat.');
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteChatFaq = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteDoc(doc(db, 'chat_faqs', id));
      showFeedback('success', 'Pergunta personalizada removida do Chat.');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `chat_faqs/${id}`);
    }
  };

  // 6. Manage Partner Commerce Logos
  const resetStoreForm = () => {
    setEditingStoreId(null);
    setStoreName('');
    setStoreSegment('Loja de Roupas & Calçados');
    setStoreCity('');
    setStoreActiveSince('Cliente Ativo · Sistema House Software');
    setStoreLogoUrl('');
    setStoreIconType('moda');
  };

  const handleEditStoreClick = (store: CommerceLogoItem) => {
    setEditingStoreId(store.id);
    setStoreName(store.name);
    setStoreSegment(store.segment);
    setStoreCity(store.city || '');
    setStoreActiveSince(store.activeSince || 'Cliente Ativo · Sistema House Software');
    setStoreLogoUrl(store.logoUrl || '');
    setStoreIconType(store.iconType || 'outro');
  };

  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    if (!storeName.trim()) {
      showFeedback('error', 'Preencha o nome do comércio.');
      return;
    }

    let determinedIcon: CommerceLogoItem['iconType'] = storeIconType || 'outro';
    const sLower = storeSegment.toLowerCase();
    if (sLower.includes('roupa') || sLower.includes('moda') || sLower.includes('calçado')) {
      determinedIcon = 'moda';
    } else if (sLower.includes('celular') || sLower.includes('smartphone')) {
      determinedIcon = 'celular';
    } else if (sLower.includes('info') || sLower.includes('hardware') || sLower.includes('computador')) {
      determinedIcon = 'informatica';
    } else if (sLower.includes('salão') || sLower.includes('beleza') || sLower.includes('barbearia')) {
      determinedIcon = 'salao';
    } else if (sLower.includes('mercado') || sLower.includes('varejo') || sLower.includes('bebida')) {
      determinedIcon = 'varejo';
    } else if (sLower.includes('ótica') || sLower.includes('relojoaria')) {
      determinedIcon = 'otica';
    }

    let updated: CommerceLogoItem[];
    if (editingStoreId) {
      updated = commercesList.map((item) => {
        if (item.id === editingStoreId) {
          return {
            ...item,
            name: storeName.trim(),
            segment: storeSegment.trim(),
            city: storeCity.trim() || item.city,
            activeSince: storeActiveSince.trim() || item.activeSince,
            logoUrl: storeLogoUrl.trim(),
            iconType: determinedIcon,
            isCustom: true
          };
        }
        return item;
      });
      showFeedback('success', `Comércio "${storeName.trim()}" atualizado com sucesso!`);
    } else {
      const newItem: CommerceLogoItem = {
        id: `store-${Date.now()}`,
        name: storeName.trim(),
        segment: storeSegment.trim(),
        city: storeCity.trim() || 'São Paulo - SP',
        activeSince: storeActiveSince.trim() || 'Cliente Ativo · Sistema House Software',
        logoUrl: storeLogoUrl.trim(),
        iconType: determinedIcon,
        isCustom: true
      };
      updated = [newItem, ...commercesList];
      showFeedback('success', `Novo comércio "${newItem.name}" adicionado com sucesso!`);
    }

    setCommercesList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('hs_logos_updated', { detail: updated }));
    } catch (err) {
      console.error('Falha ao salvar comércio:', err);
    }
    resetStoreForm();
  };

  const handleDeleteStore = (id: string, name: string) => {
    const updated = commercesList.filter((s) => s.id !== id);
    setCommercesList(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('hs_logos_updated', { detail: updated }));
    } catch (err) {
      console.error('Falha ao excluir comércio:', err);
    }
    showFeedback('success', `Comércio "${name}" removido.`);
    if (editingStoreId === id) resetStoreForm();
  };

  const handleResetDefaultStores = () => {
    setCommercesList(DEFAULT_COMMERCE_LOGOS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_COMMERCE_LOGOS));
      window.dispatchEvent(new CustomEvent('hs_logos_updated', { detail: DEFAULT_COMMERCE_LOGOS }));
    } catch (err) {
      console.error('Falha ao restaurar:', err);
    }
    showFeedback('success', 'Lista restaurada com os comércios parceiros originais.');
    resetStoreForm();
  };

  const handleStoreLogoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingStoreLogo(true);
    try {
      const compressed = await compressLogoImage(file);
      setStoreLogoUrl(compressed);
      showFeedback('success', 'Logo processada com sucesso!');
    } catch (err) {
      showFeedback('error', err instanceof Error ? err.message : 'Falha ao processar logo.');
    } finally {
      setIsUploadingStoreLogo(false);
      e.target.value = '';
    }
  };

  const newLeadsCount = contactLeads.filter((l) => l.status === 'novo').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Painel do Administrador House Software"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs"
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-semibold text-blue-300 block">
              Gerenciador de Conteúdo (CMS) · House Software
            </span>
            <h2 className="font-display text-lg font-bold">
              Painel do Administrador / Dono do Site
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sair</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar painel"
              className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Authentication Check */}
          {!currentUser ? (
            <div className="py-12 text-center max-w-md mx-auto space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto border border-blue-200">
                <LogIn className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Acesso Restrito ao Administrador
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Entre com sua conta Google autorizada (<strong>house7software@gmail.com</strong>) para editar textos, enviar fotos do computador, gerenciar logos e criar novas páginas ou menus no site.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogin}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>Entrar com Google (Administrador)</span>
              </button>
            </div>
          ) : !isAuthorizedAdmin ? (
            <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-3">
              <h3 className="text-base font-bold text-amber-900">
                Conta conectada sem permissão de edição
              </h3>
              <p className="text-xs text-amber-800">
                Você entrou como <strong>{currentUser.email}</strong>. Apenas os proprietários autorizados (<strong>house7software@gmail.com</strong>) podem salvar alterações públicas no site.
              </p>
            </div>
          ) : (
            <>
              {/* Navigation Tabs inside Admin Panel */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('geral')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'geral'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Textos, Fotos e Vídeos (Home / Quem Somos / Contato)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('solucoes')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'solucoes'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>2. Gerenciar Soluções (Lojas / Informática / Salão)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('paginas')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'paginas'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Layout className="w-3.5 h-3.5" />
                  <span>3. Criar Novas Páginas & Menus ({customPages.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'leads'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>4. Contatos Recebidos ({contactLeads.length})</span>
                  {newLeadsCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-600 text-white rounded">
                      {newLeadsCount} novo{newLeadsCount > 1 ? 's' : ''}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'chat'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>5. Perguntas do Chat & FAQ ({mergedChatFaqs.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('logos')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 transition-colors cursor-pointer ${
                    activeTab === 'logos'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>6. Logos de Lojas Parceiras ({commercesList.length})</span>
                </button>
              </div>

              {statusMsg && (
                <div
                  role="alert"
                  className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    statusMsg.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{statusMsg.text}</span>
                </div>
              )}

              {/* TAB 1: GERAL (HOME, QUEM SOMOS, CONTATO) */}
              {activeTab === 'geral' && (
                <>
                <form onSubmit={handleSaveSiteConfig} className="space-y-6">
                  {/* Bloco Banner & Home */}
                  <div className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Página HOME (Banner Principal, Foto, Vídeo e Textos)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nome da Empresa (Centro do Banner e Topo)
                        </label>
                        <input
                          type="text"
                          value={configForm.brandName}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, brandName: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Frase Abaixo do Nome no Banner
                        </label>
                        <input
                          type="text"
                          value={configForm.bannerSubtitle}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, bannerSubtitle: e.target.value })
                          }
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Mensagem Curta do Banner
                      </label>
                      <input
                        type="text"
                        value={configForm.bannerDescription}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, bannerDescription: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <ImagePickerField
                      label="Foto de Fundo do Banner Principal (Envie do computador ou cole um link)"
                      value={configForm.bannerImageUrl}
                      onChange={(val) => setConfigForm({ ...configForm, bannerImageUrl: val })}
                      onErrorMsg={(msg) => showFeedback('error', msg)}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Link de Vídeo na Página HOME (YouTube ou MP4 - Opcional)
                      </label>
                      <input
                        type="url"
                        value={configForm.bannerVideoUrl}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, bannerVideoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subtítulo da Seção Abaixo do Banner
                        </label>
                        <input
                          type="text"
                          value={configForm.homeSectionKicker}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, homeSectionKicker: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Título Principal dos Benefícios em HOME
                        </label>
                        <input
                          type="text"
                          value={configForm.homeSectionTitle}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, homeSectionTitle: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Texto Introdutório dos Benefícios em HOME
                      </label>
                      <textarea
                        rows={3}
                        value={configForm.homeSectionIntro}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, homeSectionIntro: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Bloco Quem Somos */}
                  <div className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Página QUEM SOMOS (Texto, Foto do Computador, Vídeo e Tópicos)
                    </h3>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Título Principal em Quem Somos
                      </label>
                      <input
                        type="text"
                        value={configForm.aboutTitle}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, aboutTitle: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Texto de Apresentação em Quem Somos
                      </label>
                      <textarea
                        rows={3}
                        value={configForm.aboutDescription}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, aboutDescription: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <ImagePickerField
                      label="Foto da Página Quem Somos (Envie do computador ou cole um link)"
                      value={configForm.aboutImageUrl}
                      onChange={(val) => setConfigForm({ ...configForm, aboutImageUrl: val })}
                      onErrorMsg={(msg) => showFeedback('error', msg)}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Link de Vídeo para Quem Somos (YouTube ou MP4 - Opcional)
                      </label>
                      <input
                        type="url"
                        value={configForm.aboutVideoUrl}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, aboutVideoUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-semibold text-slate-700">
                        3 Frases de Destaque em Quem Somos
                      </label>
                      <input
                        type="text"
                        value={configForm.aboutBullet1}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, aboutBullet1: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={configForm.aboutBullet2}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, aboutBullet2: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={configForm.aboutBullet3}
                        onChange={(e) =>
                          setConfigForm({ ...configForm, aboutBullet3: e.target.value })
                        }
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Bloco Contato & WhatsApp */}
                  <div className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4">
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Dados de Contato & Botão do WhatsApp
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Telefone Exibido na Página
                        </label>
                        <input
                          type="text"
                          value={configForm.contactPhone}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, contactPhone: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Número do Botão WhatsApp (Apenas números com DDI 55)
                        </label>
                        <input
                          type="text"
                          value={configForm.whatsappNumber}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, whatsappNumber: e.target.value })
                          }
                          placeholder="5511994802100"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-mono-tabular"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          E-mail de Atendimento
                        </label>
                        <input
                          type="email"
                          value={configForm.contactEmail}
                          onChange={(e) =>
                            setConfigForm({ ...configForm, contactEmail: e.target.value })
                          }
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl flex items-center gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Salvando...' : 'Salvar Alterações Principais'}</span>
                    </button>
                  </div>
                </form>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-slate-200 pt-4">
                  <p className="text-xs text-slate-600">
                    Transfere para o Firebase Storage as imagens antigas que ainda estão salvas no Firestore.
                  </p>
                  <button
                    type="button"
                    onClick={handleMigrateImages}
                    disabled={isSaving}
                    className="px-4 py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg cursor-pointer"
                  >
                    {isSaving ? 'Processando...' : 'Migrar imagens antigas'}
                  </button>
                </div>
                </>
              )}

              {/* TAB 2: GERENCIAR SOLUÇÕES */}
              {activeTab === 'solucoes' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveSolution}
                    className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {editingSolutionId
                          ? 'Editando Cartão de Solução'
                          : 'Adicionar Nova Solução Comercial'}
                      </h3>
                      {editingSolutionId && (
                        <button
                          type="button"
                          onClick={resetSolutionForm}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Título da Solução / Segmento *
                        </label>
                        <input
                          type="text"
                          required
                          value={solTitle}
                          onChange={(e) => setSolTitle(e.target.value)}
                          placeholder="Ex: Padarias & Conveniências"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Subtítulo Curto
                        </label>
                        <input
                          type="text"
                          value={solSubtitle}
                          onChange={(e) => setSolSubtitle(e.target.value)}
                          placeholder="Ex: Balança Integrada · Comanda · PDV"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Descrição Curta e Objetiva *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={solDesc}
                        onChange={(e) => setSolDesc(e.target.value)}
                        placeholder="Ex: Atendimento rápido no caixa, integração com balanças e controle de produção."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <ImagePickerField
                      label="Foto da Solução (Envie do seu computador ou cole um link)"
                      value={solImage}
                      onChange={setSolImage}
                      onErrorMsg={(msg) => showFeedback('error', msg)}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Link de Vídeo Demonstrativo (YouTube ou MP4 - Opcional)
                      </label>
                      <input
                        type="url"
                        value={solVideo}
                        onChange={(e) => setSolVideo(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Benefício 1 *
                        </label>
                        <input
                          type="text"
                          required
                          value={solH1}
                          onChange={(e) => setSolH1(e.target.value)}
                          placeholder="Ex: Venda rápida com leitor"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Benefício 2
                        </label>
                        <input
                          type="text"
                          value={solH2}
                          onChange={(e) => setSolH2(e.target.value)}
                          placeholder="Ex: Controle de estoque automático"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Benefício 3
                        </label>
                        <input
                          type="text"
                          value={solH3}
                          onChange={(e) => setSolH3(e.target.value)}
                          placeholder="Ex: Emissão de cupom fiscal NFC-e"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {editingSolutionId ? 'Atualizar Solução' : 'Adicionar Solução ao Site'}
                      </span>
                    </button>
                  </form>

                  {/* Lista de Soluções Atuais */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-700">
                      Soluções Exibidas na Aba SOLUÇÕES ({solutions.length})
                    </h4>
                    {solutions.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">{item.title}</div>
                          <div className="text-xs text-slate-500">{item.shortDescription}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditSolutionClick(item)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          {item.authorId && (
                            <button
                              type="button"
                              onClick={() => handleDeleteSolution(item.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Excluir solução"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destaque Comércios Parceiros & Logos */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                        <Store className="w-4 h-4 text-blue-700" />
                        <span>Logos de Comércios Parceiros na Página Soluções</span>
                      </h4>
                      <p className="text-[11px] text-blue-800 mt-0.5">
                        Área destacada na parte inferior da aba Soluções. Você e seus clientes podem inserir logos de lojas parceiras com foto do computador ou link diretamente pelo botão <strong>"+ Inserir Logo"</strong>.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onNavigateToCustomPage('solucoes');
                        setTimeout(() => {
                          const el = document.getElementById('comercios-parceiros');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }, 150);
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-white hover:bg-blue-100 border border-blue-300 rounded-lg shrink-0 cursor-pointer shadow-2xs text-center"
                    >
                      Ver Seção de Logos no Site
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: CRIAR NOVAS PÁGINAS & MENUS */}
              {activeTab === 'paginas' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveCustomPage}
                    className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {editingPageId
                            ? 'Editando Página / Menu'
                            : 'Criar Nova Página e Menu na Barra Superior'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Ao criar uma página aqui, um novo botão de menu aparece automaticamente no topo do site para os visitantes.
                        </p>
                      </div>
                      {editingPageId && (
                        <button
                          type="button"
                          onClick={resetPageForm}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nome no Menu Superior *
                        </label>
                        <input
                          type="text"
                          required
                          value={pageMenuLabel}
                          onChange={(e) => setPageMenuLabel(e.target.value)}
                          placeholder="Ex: VÍDEOS ou PLANOS"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-bold uppercase"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Título Principal da Nova Página *
                        </label>
                        <input
                          type="text"
                          required
                          value={pageTitle}
                          onChange={(e) => setPageTitle(e.target.value)}
                          placeholder="Ex: Demonstrações em Vídeo dos Sistemas House Software"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subtítulo da Página (Opcional)
                      </label>
                      <input
                        type="text"
                        value={pageSubtitle}
                        onChange={(e) => setPageSubtitle(e.target.value)}
                        placeholder="Ex: Veja como é simples operar nossos módulos no dia a dia"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Texto / Conteúdo da Página *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={pageContent}
                        onChange={(e) => setPageContent(e.target.value)}
                        placeholder="Digite aqui o texto que os visitantes verão ao abrir este menu..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <ImagePickerField
                      label="Foto de Destaque da Nova Página (Envie do seu computador ou cole um link)"
                      value={pageImage}
                      onChange={setPageImage}
                      onErrorMsg={(msg) => showFeedback('error', msg)}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Video className="w-3.5 h-3.5 text-blue-700" />
                        <span>Link de Vídeo (YouTube, Vimeo ou MP4 - Opcional)</span>
                      </label>
                      <input
                        type="url"
                        value={pageVideo}
                        onChange={(e) => setPageVideo(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {editingPageId
                          ? 'Salvar Alterações da Página'
                          : 'Publicar Nova Página e Adicionar ao Menu'}
                      </span>
                    </button>
                  </form>

                  {/* Lista de Páginas e Menus Criados */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-700">
                      Menus e Páginas Extras Criados ({customPages.length})
                    </h4>
                    {customPages.length === 0 ? (
                      <p className="text-xs text-slate-500 p-4 bg-white border border-slate-200 rounded-xl">
                        Nenhuma página extra criada ainda. Use o formulário acima para criar novos menus no topo do site.
                      </p>
                    ) : (
                      customPages.map((pg) => (
                        <div
                          key={pg.id}
                          className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-700">
                                MENU: {pg.menuLabel}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="font-bold text-sm text-slate-900">{pg.title}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                              {pg.content}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onNavigateToCustomPage(pg.id);
                              }}
                              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg cursor-pointer"
                            >
                              Ver Página
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditPageClick(pg)}
                              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomPage(pg.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Excluir página e menu"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CONTATOS RECEBIDOS (LEADS DO FORMULÁRIO) */}
              {activeTab === 'leads' && (
                <div className="space-y-4">
                  <div className="p-4 bg-[#F8F8F6] border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        Pedidos de Orçamento & Contatos Recebidos pelo Site
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Todos os visitantes que preenchem o formulário na aba CONTATO ficam salvos aqui automaticamente.
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                      <div className="text-xs font-semibold text-slate-700">
                        Total: <strong>{contactLeads.length}</strong> · Pendentes:{' '}
                        <strong className="text-emerald-700">{newLeadsCount}</strong>
                      </div>
                      {contactLeads.length > 0 && (
                        <button
                          type="button"
                          onClick={handleExportLeadsCsv}
                          className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-blue-700" />
                          <span>Baixar Planilha (Excel/CSV)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {contactLeads.length === 0 ? (
                    <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-2">
                      <Inbox className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-sm font-bold text-slate-800">
                        Nenhum pedido de orçamento recebido ainda
                      </p>
                      <p className="text-xs text-slate-500 max-w-md mx-auto">
                        Assim que um visitante preencher o formulário na página CONTATO, os dados aparecerão aqui com botão direto para chamá-lo no WhatsApp.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {contactLeads.map((lead) => (
                        <div
                          key={lead.id}
                          className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                            lead.status === 'novo'
                              ? 'bg-white border-blue-300 shadow-xs'
                              : 'bg-slate-50 border-slate-200 opacity-85'
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span
                                className={`font-bold uppercase tracking-wider ${
                                  lead.status === 'novo' ? 'text-emerald-700' : 'text-slate-500'
                                }`}
                              >
                                {lead.status === 'novo' ? '● NOVO CONTATO' : '✓ ATENDIDO'}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="font-semibold text-blue-700">{lead.segment}</span>
                              <span className="text-slate-300">·</span>
                              <span className="font-mono-tabular font-semibold text-slate-800">
                                {lead.phone}
                              </span>
                            </div>

                            <div className="text-sm font-bold text-slate-900">
                              {lead.name}{' '}
                              <span className="font-normal text-slate-600">
                                — Empresa: <strong>{lead.company}</strong>
                              </span>
                            </div>

                            {lead.message && (
                              <p className="text-xs text-slate-600 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200/80">
                                &ldquo;{lead.message}&rdquo;
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <a
                              href={buildClientWhatsAppLink(lead)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg inline-flex items-center gap-1.5"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Chamar Cliente</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => handleToggleLeadStatus(lead)}
                              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg cursor-pointer"
                            >
                              {lead.status === 'novo' ? 'Marcar Atendido' : 'Reabrir'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Excluir contato"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: GERENCIADOR DO CHAT & PERGUNTAS FREQUENTES */}
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleSaveChatFaq}
                    className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {editingFaqId
                            ? 'Editando Pergunta do Chat Tira-Dúvidas'
                            : 'Adicionar Nova Pergunta e Resposta no Chat'}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Configure perguntas rápidas e palavras-chave para o Chat responder automaticamente aos visitantes.
                        </p>
                      </div>
                      {editingFaqId && (
                        <button
                          type="button"
                          onClick={resetFaqForm}
                          className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Categoria / Ramo *
                        </label>
                        <select
                          value={faqCategory}
                          onChange={(e) => setFaqCategory(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                        >
                          <option value="Geral">Geral (Todas as lojas)</option>
                          <option value="Loja de Roupas">Loja de Roupas</option>
                          <option value="Informática">Informática</option>
                          <option value="Loja de Celulares">Loja de Celulares</option>
                          <option value="Salão de Beleza">Salão de Beleza</option>
                          <option value="Outro Comércio">Outro Comércio</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Pergunta (Botão Rápido no Chat) *
                        </label>
                        <input
                          type="text"
                          required
                          value={faqQuestion}
                          onChange={(e) => setFaqQuestion(e.target.value)}
                          placeholder="Ex: Vocês atendem lojas de celulares e assistência?"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Palavras-chave separadas por vírgula (Para quando o cliente digitar no chat)
                      </label>
                      <input
                        type="text"
                        value={faqKeywords}
                        onChange={(e) => setFaqKeywords(e.target.value)}
                        placeholder="Ex: celular, imei, assistencia, capinha, tela, garantia"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Resposta Automática do Chat *
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={faqAnswer}
                        onChange={(e) => setFaqAnswer(e.target.value)}
                        placeholder="Digite a resposta clara e objetiva que o visitante receberá na hora..."
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {editingFaqId ? 'Atualizar Pergunta do Chat' : 'Adicionar Pergunta ao Chat'}
                      </span>
                    </button>
                  </form>

                  {/* Lista de Perguntas Ativas no Chat */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-700">
                      Perguntas Ativas no Chat ({mergedChatFaqs.length})
                    </h4>
                    {mergedChatFaqs.map((faq) => (
                      <div
                        key={faq.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold text-blue-700 uppercase">
                              {faq.category}
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="font-bold text-sm text-slate-900">{faq.question}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                          {faq.keywords && (
                            <p className="text-[11px] text-slate-400">
                              Palavras-chave: {faq.keywords}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleEditFaqClick(faq)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                          {faq.authorId && (
                            <button
                              type="button"
                              onClick={() => handleDeleteChatFaq(faq.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                              title="Excluir pergunta personalizada"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: LOGOS DE LOJAS PARCEIRAS (EXCLUSIVO DO ADMINISTRADOR) */}
              {activeTab === 'logos' && (
                <div className="space-y-6">
                  {/* Top Notice */}
                  <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Área Restrita ao Administrador · Gerenciamento de Logos
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Somente você pode cadastrar, editar fotos ou excluir os comércios parceiros exibidos na aba <strong>Soluções</strong>. Os visitantes comuns do site apenas visualizam os estabelecimentos com suas logos em destaque.
                      </p>
                    </div>
                  </div>

                  {/* Form to Insert / Edit Commerce & Logo */}
                  <form
                    onSubmit={handleSaveStore}
                    className="p-5 bg-[#F8F8F6] border border-slate-200 rounded-xl space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                          {editingStoreId ? 'Alteração de Dados' : 'Novo Cadastro'}
                        </span>
                        <h3 className="font-display text-base font-bold text-slate-900">
                          {editingStoreId
                            ? 'Editar Comércio & Trocar Logo'
                            : 'Cadastrar Novo Comércio & Enviar Logo'}
                        </h3>
                      </div>
                      {editingStoreId && (
                        <button
                          type="button"
                          onClick={resetStoreForm}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Store Name */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Nome da Loja / Comércio <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="Ex: Boutique Elegance, SmartFix Celulares, etc."
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Store Segment */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Segmento / Ramo de Atividade
                        </label>
                        <select
                          value={storeSegment}
                          onChange={(e) => setStoreSegment(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Loja de Roupas & Calçados">Loja de Roupas & Calçados</option>
                          <option value="Assistência Técnica & Celulares">Assistência Técnica & Celulares</option>
                          <option value="Informática & Computadores">Informática & Computadores</option>
                          <option value="Salão de Beleza & Barbearia">Salão de Beleza & Barbearia</option>
                          <option value="Mercado, Bebidas & Varejo">Mercado, Bebidas & Varejo</option>
                          <option value="Ótica & Relojoaria">Ótica & Relojoaria</option>
                          <option value="Comércio & Serviços em Geral">Comércio & Serviços em Geral</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* City and State */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Cidade / Estado
                        </label>
                        <input
                          type="text"
                          value={storeCity}
                          onChange={(e) => setStoreCity(e.target.value)}
                          placeholder="Ex: São Paulo - SP, Campinas - SP"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Active Status Badge */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Texto do Selo / Destaque do Sistema
                        </label>
                        <input
                          type="text"
                          value={storeActiveSince}
                          onChange={(e) => setStoreActiveSince(e.target.value)}
                          placeholder="Ex: Cliente Ativo · Caixa + Grade + NFC-e"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Logo Upload Box - Destaque Ampliado */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                      <label className="block text-xs font-bold text-slate-800">
                        Foto da Logo do Comércio (Destaque Ampliado)
                      </label>

                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        {/* Big Logo Preview */}
                        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center p-2 shrink-0 overflow-hidden relative">
                          {storeLogoUrl ? (
                            <img
                              src={storeLogoUrl}
                              alt="Prévia da logo"
                              className="max-h-full max-w-full object-contain filter drop-shadow-xs"
                            />
                          ) : (
                            <div className="text-center p-2">
                              <Store className="w-8 h-8 text-slate-400 mx-auto mb-1" />
                              <span className="text-[10px] text-slate-400 block font-medium">
                                Sem imagem
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Controls */}
                        <div className="flex-1 space-y-2.5 w-full">
                          <label className="px-4 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl inline-flex items-center justify-center gap-2 cursor-pointer transition-colors w-full sm:w-auto">
                            <Upload className="w-4 h-4 text-blue-300" />
                            <span>
                              {isUploadingStoreLogo
                                ? 'Processando imagem...'
                                : 'Enviar Foto da Logo do Computador'}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleStoreLogoFileUpload}
                              className="hidden"
                            />
                          </label>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500 whitespace-nowrap">
                              ou link da logo:
                            </span>
                            <input
                              type="text"
                              value={storeLogoUrl.startsWith('data:') ? '' : storeLogoUrl}
                              onChange={(e) => setStoreLogoUrl(e.target.value)}
                              disabled={storeLogoUrl.startsWith('data:')}
                              placeholder={
                                storeLogoUrl.startsWith('data:')
                                  ? 'Foto enviada do computador pronta'
                                  : 'https://exemplo.com/logo.png'
                              }
                              className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg disabled:bg-slate-100 disabled:text-emerald-700"
                            />
                          </div>

                          {storeLogoUrl && (
                            <button
                              type="button"
                              onClick={() => setStoreLogoUrl('')}
                              className="px-2.5 py-1 text-[11px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer"
                            >
                              Remover Foto Atual
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="text-[11px] text-slate-500">
                        * A logo salva será exibida imediatamente na aba <strong>Soluções</strong> do site.
                      </div>

                      <button
                        type="submit"
                        disabled={isUploadingStoreLogo}
                        className="px-6 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl inline-flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-700/20"
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {editingStoreId
                            ? 'Salvar Alterações da Loja'
                            : 'Cadastrar Loja e Publicar Logo'}
                        </span>
                      </button>
                    </div>
                  </form>

                  {/* Registered Stores Grid */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">
                        Comércios & Logos Cadastradas ({commercesList.length})
                      </h4>

                      {commercesList.length !== DEFAULT_COMMERCE_LOGOS.length && (
                        <button
                          type="button"
                          onClick={handleResetDefaultStores}
                          className="px-3 py-1 text-[11px] font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Restaurar Lista Padrão</span>
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {commercesList.map((store) => (
                        <div
                          key={store.id}
                          className="p-3.5 bg-white border border-slate-200 rounded-xl flex flex-col justify-between space-y-3 hover:border-blue-300 transition-all shadow-2xs"
                        >
                          <div className="flex items-start gap-3">
                            {/* Logo Box */}
                            <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                              {store.logoUrl ? (
                                <img
                                  src={store.logoUrl}
                                  alt={store.name}
                                  className="max-h-full max-w-full object-contain"
                                />
                              ) : (
                                <Store className="w-6 h-6 text-blue-600" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <h5 className="font-bold text-xs text-slate-900 truncate">
                                {store.name}
                              </h5>
                              <p className="text-[11px] text-slate-600 truncate mt-0.5">
                                {store.segment}
                              </p>
                              {store.city && (
                                <p className="text-[10px] text-slate-400 truncate">
                                  {store.city}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <span className="text-[9.5px] font-medium text-emerald-700 truncate max-w-[130px]">
                              {store.activeSince || 'Ativo'}
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => handleEditStoreClick(store)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                                <span>Editar</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteStore(store.id, store.name)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Excluir este comércio"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
