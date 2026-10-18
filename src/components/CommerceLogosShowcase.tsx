import React, { useState, useEffect } from 'react';
import {
  Store,
  Building2,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Laptop,
  Shirt,
  Scissors,
  ShoppingBag,
  Glasses
} from 'lucide-react';

export interface CommerceLogoItem {
  id: string;
  name: string;
  segment: string;
  city?: string;
  logoUrl?: string;
  iconType?: 'moda' | 'celular' | 'informatica' | 'salao' | 'varejo' | 'otica' | 'outro';
  activeSince?: string;
  isCustom?: boolean;
}

export const DEFAULT_COMMERCE_LOGOS: CommerceLogoItem[] = [
  {
    id: 'store-1',
    name: 'Boutique Bella Flor',
    segment: 'Moda Feminina & Calçados',
    city: 'São Paulo - SP',
    iconType: 'moda',
    activeSince: 'Cliente Ativo · Caixa + Grade + NFC-e'
  },
  {
    id: 'store-2',
    name: 'SmartFix Celulares',
    segment: 'Assistência Técnica & Acessórios',
    city: 'Campinas - SP',
    iconType: 'celular',
    activeSince: 'Cliente Ativo · OS por IMEI + Balcão'
  },
  {
    id: 'store-3',
    name: 'Nexus Informática',
    segment: 'Loja de Hardware & Assistência',
    city: 'Santo André - SP',
    iconType: 'informatica',
    activeSince: 'Cliente Ativo · Controle N/S + Estoque'
  },
  {
    id: 'store-4',
    name: 'Studio Bella Donna',
    segment: 'Salão de Beleza & Estética',
    city: 'Guarulhos - SP',
    iconType: 'salao',
    activeSince: 'Cliente Ativo · Comissões + Agenda'
  },
  {
    id: 'store-5',
    name: 'Empório São José',
    segment: 'Mercado, Bebidas & Varejo',
    city: 'Osasco - SP',
    iconType: 'varejo',
    activeSince: 'Cliente Ativo · PDV Rápido + Código de Barras'
  },
  {
    id: 'store-6',
    name: 'Ótica & Relojoaria Visão',
    segment: 'Ótica & Acessórios',
    city: 'São Bernardo - SP',
    iconType: 'otica',
    activeSince: 'Cliente Ativo · Emissão Fiscal + Carnês'
  }
];

export const STORAGE_KEY = 'house_software_commerce_logos_v1';

export async function compressLogoImage(file: File, maxWidth = 600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erro ao ler arquivo da logo.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato inválido de imagem.'));
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
          reject(new Error('Erro ao processar imagem da logo.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/png', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface CommerceLogosShowcaseProps {
  onOpenWhatsApp?: (msg?: string) => void;
}

export const CommerceLogosShowcase: React.FC<CommerceLogosShowcaseProps> = ({
  onOpenWhatsApp
}) => {
  const [logos, setLogos] = useState<CommerceLogoItem[]>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to default
    }
    return DEFAULT_COMMERCE_LOGOS;
  });

  // Keep state synchronized with AdminPanel updates via custom event and storage
  useEffect(() => {
    const handleSync = () => {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLogos(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('hs_logos_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('hs_logos_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const renderFallbackIcon = (type?: CommerceLogoItem['iconType']) => {
    switch (type) {
      case 'moda':
        return <Shirt className="w-8 h-8 text-rose-500" />;
      case 'celular':
        return <Smartphone className="w-8 h-8 text-sky-500" />;
      case 'informatica':
        return <Laptop className="w-8 h-8 text-indigo-500" />;
      case 'salao':
        return <Scissors className="w-8 h-8 text-pink-500" />;
      case 'varejo':
        return <ShoppingBag className="w-8 h-8 text-emerald-500" />;
      case 'otica':
        return <Glasses className="w-8 h-8 text-amber-500" />;
      default:
        return <Store className="w-8 h-8 text-blue-600" />;
    }
  };

  return (
    <section
      id="comercios-parceiros"
      className="mt-16 sm:mt-20 border border-blue-100 bg-gradient-to-b from-blue-50/70 via-white to-slate-50/80 rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden"
    >
      {/* Decorative backdrop accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-blue-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl"
      />

      <div className="relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/90 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>QUEM USA E APROVA · COMÉRCIOS & LOJAS PARCEIRAS</span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              Comércios que usam o sistema House Software
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Lojas de roupas, assistências técnicas de celulares e informática, salões de beleza e
              varejos que descomplicaram suas vendas, controle de estoque e notas fiscais com nossa tecnologia.
            </p>
          </div>
        </div>

        {/* Logos & Businesses Grid - Espaço da Logo Ampliado e em Destaque */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {logos.map((store) => (
            <div
              key={store.id}
              className="group relative bg-white border border-slate-200 hover:border-blue-300 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-md min-h-[190px]"
            >
              <div>
                {/* 1. ESPAÇO DA LOGO AMPLIADO E EM DESTAQUE */}
                <div className="w-full h-32 sm:h-36 rounded-2xl bg-slate-50/90 border border-slate-200/90 flex items-center justify-center p-3.5 mb-3.5 overflow-hidden shadow-2xs group-hover:bg-blue-50/40 group-hover:border-blue-400/80 group-hover:shadow-sm transition-all relative">
                  {store.logoUrl ? (
                    <img
                      src={store.logoUrl}
                      alt={`Logo da ${store.name}`}
                      className="max-h-full max-w-full object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/70 flex items-center justify-center shadow-xs">
                      {renderFallbackIcon(store.iconType)}
                    </div>
                  )}
                </div>

                {/* 2. Informações do Comércio */}
                <div className="text-center">
                  <h4 className="font-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1 leading-snug">
                    {store.name}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-500 line-clamp-1 mt-0.5">
                    {store.segment}
                  </p>
                  {store.city && (
                    <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                      {store.city}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Selo de Ativação / Sistema Online */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[9.5px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="truncate">{store.activeSince || 'Sistema Online'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout Banner */}
        <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-slate-900 to-blue-950 text-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Gostaria de ver o sistema rodando na sua loja?
              </p>
              <p className="text-[11px] text-slate-300">
                Instalamos e treinamos sua equipe sem custo de adesão e com suporte diário.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onOpenWhatsApp?.(
                'Olá House Software! Vi a lista de lojas parceiras no site e gostaria de agendar uma demonstração no meu comércio.'
              )
            }
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Falar com Suporte & Vendas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
