import React, { useState, useEffect } from 'react';
import { SegmentKey } from '../data/portfolioData';
import { Check, ArrowRight } from 'lucide-react';

interface ScopeConfiguratorProps {
  preselectedSegment: SegmentKey;
  preselectedNotes?: string;
}

const MODULES_BY_SEGMENT: Record<SegmentKey, { id: string; label: string; weeksImpact: number }[]> = {
  moda: [
    { id: 'grade-matriz', label: 'Grade Matriz (Tamanho × Cor × Coleção) + Etiquetas Térmicas', weeksImpact: 1 },
    { id: 'pdv-nfce', label: 'PDV Rápido Touch + levantamento de requisitos fiscais', weeksImpact: 1 },
    { id: 'sacola-condicional', label: 'Gestão de Sacola Condicional (Malinha) e Clube de Cashback', weeksImpact: 1 },
    { id: 'sync-ecommerce', label: 'Sincronização de Estoque com E-commerce (Shopify / Nuvemshop)', weeksImpact: 1 }
  ],
  informatica: [
    { id: 'os-bancada', label: 'Gestão de Ordens de Serviço (OS) com Laudo Fotográfico', weeksImpact: 1 },
    { id: 'serial-imei', label: 'Rastreabilidade de Garantia e RMA por Número de Série / IMEI', weeksImpact: 1 },
    { id: 'orcamento-whatsapp', label: 'Link de Aprovação de Orçamento Online via WhatsApp', weeksImpact: 1 },
    { id: 'monte-seu-pc', label: 'PDV de Peças + Configurador "Monte seu PC" com Compatibilidade', weeksImpact: 1 }
  ],
  celulares: [
    { id: 'imei-garantia', label: 'Cadastro e Termo de Garantia de Aparelhos por IMEI', weeksImpact: 1 },
    { id: 'os-checklist', label: 'Ordem de Serviço com Checklist de Entrada e Aviso WhatsApp', weeksImpact: 1 },
    { id: 'pdv-acessorios', label: 'PDV Rápido para Capinhas, Películas e Troca de Aparelhos', weeksImpact: 1 }
  ],
  beleza: [
    { id: 'agenda-multi', label: 'Agenda Multi-Profissional Inteligente com Confirmação WhatsApp', weeksImpact: 1 },
    { id: 'salao-parceiro', label: 'Cálculo de Comissões Escalonadas e Split (Lei do Salão Parceiro)', weeksImpact: 1 },
    { id: 'insumos-ml', label: 'Baixa Fracionada de Insumos Químicos (Grama / Mililitro)', weeksImpact: 1 },
    { id: 'pacotes-anamnese', label: 'Controle de Pacotes de Sessões + Prontuário de Anamnese Digital', weeksImpact: 1 }
  ],
  comercio: [
    { id: 'atacado-varejo', label: 'Tabelas Dinâmicas Atacado/Varejo com Trava de Margem Mínima', weeksImpact: 1 },
    { id: 'lote-validade', label: 'Controle de Estoque por Lote, Validade (FEFO) e Coletor Óptico', weeksImpact: 1 },
    { id: 'fiscal-sped', label: 'Levantamento de requisitos fiscais e tributários', weeksImpact: 2 },
    { id: 'financeiro-dre', label: 'Financeiro Completo, Conciliação Bancária, PIX e DRE em Tempo Real', weeksImpact: 1 }
  ]
};

export const ScopeConfigurator: React.FC<ScopeConfiguratorProps> = ({
  preselectedSegment,
  preselectedNotes
}) => {
  const [segment, setSegment] = useState<SegmentKey>(preselectedSegment);
  const [selectedModules, setSelectedModules] = useState<string[]>([
    MODULES_BY_SEGMENT[preselectedSegment][0].id,
    MODULES_BY_SEGMENT[preselectedSegment][1].id
  ]);
  const [storeCount, setStoreCount] = useState<'1' | '2-5' | '6+'>('1');

  // Form fields
  const [contactName, setContactName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [customNotes, setCustomNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [submittedProposal, setSubmittedProposal] = useState<{
    protocol: string;
    name: string;
    company: string;
    segmentLabel: string;
    modulesCount: number;
    estimatedWeeks: number;
  } | null>(null);

  useEffect(() => {
    setSegment(preselectedSegment);
    setSelectedModules([
      MODULES_BY_SEGMENT[preselectedSegment][0].id,
      MODULES_BY_SEGMENT[preselectedSegment][1].id
    ]);
  }, [preselectedSegment]);

  useEffect(() => {
    if (preselectedNotes) {
      setCustomNotes(preselectedNotes);
    }
  }, [preselectedNotes]);

  const handleSegmentChange = (newSeg: SegmentKey) => {
    setSegment(newSeg);
    setSelectedModules([
      MODULES_BY_SEGMENT[newSeg][0].id,
      MODULES_BY_SEGMENT[newSeg][1].id
    ]);
  };

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const currentModuleOptions = MODULES_BY_SEGMENT[segment];
  const baseWeeks = storeCount === '1' ? 2 : storeCount === '2-5' ? 3 : 4;
  const modulesWeeks = currentModuleOptions
    .filter((m) => selectedModules.includes(m.id))
    .reduce((acc, m) => acc + m.weeksImpact, 0);
  const totalEstimatedWeeks = baseWeeks + Math.max(1, modulesWeeks);

  const segmentNames: Record<SegmentKey, string> = {
    moda: 'Loja de Roupas & Moda',
    informatica: 'Informática & Assistência Técnica',
    celulares: 'Venda e Assistência Técnica de Celulares',
    beleza: 'Salão de Beleza & Estética',
    comercio: 'Comércio Varejista / Atacadista'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!contactName.trim() || !companyName.trim()) {
      setFormError('Por favor, informe seu nome e o nome da sua empresa ou loja.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError('Informe um endereço de e-mail corporativo ou comercial válido.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Informe um telefone ou WhatsApp válido com DDD (mínimo 10 dígitos).');
      return;
    }

    const protocolNumber = `HS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`;
    setSubmittedProposal({
      protocol: protocolNumber,
      name: contactName.trim(),
      company: companyName.trim(),
      segmentLabel: segmentNames[segment],
      modulesCount: selectedModules.length,
      estimatedWeeks: totalEstimatedWeeks
    });
  };

  return (
    <section id="contato" className="py-20 bg-[#F8F8F6] border-b border-slate-200 scroll-mt-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-blue-700 mb-2">
              04. Contato & Orçamento Sob Medida
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Fale com a House Software e configure seu sistema
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Selecione o seu ramo de atuação e os módulos essenciais para sua operação. Nossa equipe técnica prepara o levantamento e uma demonstração personalizada sem compromisso.
            </p>
          </div>

          <div className="text-xs text-slate-600 space-y-1 border-l-2 border-blue-700 pl-4">
            <div className="font-semibold text-slate-900">Canais Diretos de Atendimento</div>
            <div>Comercial & Suporte: house7software@gmail.com</div>
            <div className="font-mono-tabular">WhatsApp Corporativo: (88) 99435-7360 · Seg a Sex, 08h às 18h</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Scope Selector (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-8">
            {/* Step 1: Segment */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-3">
                1. Qual é o segmento principal do seu negócio?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(['moda', 'informatica', 'beleza', 'comercio'] as SegmentKey[]).map((seg) => (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => handleSegmentChange(seg)}
                    className={`px-4 py-3 text-left text-xs font-semibold rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
                      segment === seg
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-[#F8F8F6] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{segmentNames[seg]}</span>
                    {segment === seg && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Modules */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-semibold text-slate-900">
                  2. Selecione os módulos customizados desejados:
                </label>
                <span className="text-xs text-slate-500 font-mono-tabular">
                  {selectedModules.length} selecionados
                </span>
              </div>
              <div className="space-y-2.5">
                {currentModuleOptions.map((mod) => {
                  const isSelected = selectedModules.includes(mod.id);
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className={`w-full p-3.5 text-left text-xs rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-600 text-slate-900 font-semibold'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{mod.label}</span>
                      <span
                        className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 ${
                          isSelected
                            ? 'bg-blue-700 border-blue-700 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Scale / Units */}
            <div>
              <label className="block text-xs font-semibold text-slate-900 mb-3">
                3. Porte da operação (Unidades / Pontos de Atendimento):
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '1', label: '1 Loja / Unidade' },
                  { id: '2-5', label: '2 a 5 Filiais' },
                  { id: '6+', label: '6+ Unidades / Rede' }
                ].map((scale) => (
                  <button
                    key={scale.id}
                    type="button"
                    onClick={() => setStoreCount(scale.id as '1' | '2-5' | '6+')}
                    className={`py-2.5 px-3 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                      storeCount === scale.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-[#F8F8F6] text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {scale.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Estimated Engineering Summary */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">
                  Prazo Estimado de Implantação Assistida
                </span>
                <strong className="text-xl font-bold text-slate-900 font-mono-tabular">
                  {totalEstimatedWeeks} a {totalEstimatedWeeks + 2} semanas
                </strong>
              </div>
              <div className="text-xs text-slate-600 sm:text-right">
                <div>Inclui migração de dados legados + treinamento da equipe</div>
                <div className="text-slate-500">Consulte a equipe sobre integrações fiscais e suporte</div>
              </div>
            </div>
          </div>

          {/* Right Column: Validated Lead Capture Form (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            {submittedProposal ? (
              <div className="py-6 space-y-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono-tabular text-emerald-700 font-semibold">
                    Protocolo Técnico {submittedProposal.protocol}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">
                    Solicitação recebida pela House Software
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Olá, <strong>{submittedProposal.name}</strong>. Registramos o escopo preliminar para a{' '}
                    <strong>{submittedProposal.company}</strong> ({submittedProposal.segmentLabel}) com{' '}
                    {submittedProposal.modulesCount} módulos selecionados.
                  </p>
                </div>

                <div className="p-4 bg-[#F8F8F6] border border-slate-200 rounded-lg text-xs text-slate-700 space-y-1.5">
                  <div>
                    <span className="text-slate-500">Prazo estimado do projeto:</span>{' '}
                    <strong className="font-mono-tabular">
                      {submittedProposal.estimatedWeeks} semanas
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Próximo passo:</span> Conecte-se agora mesmo com nosso consultor via WhatsApp para agendar a demonstração guiada.
                  </div>
                </div>

                <a
                  href={`https://wa.me/5588994357360?text=${encodeURIComponent(
                    `Olá House Software! Acabei de gerar o protocolo ${submittedProposal.protocol} no site para a empresa ${submittedProposal.company} (${submittedProposal.segmentLabel}). Gostaria de atendimento no WhatsApp!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm text-center"
                >
                  <span>Abrir Conversa no WhatsApp (88) 99435-7360</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setSubmittedProposal(null)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Configurar Novo Escopo
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Receber Proposta Técnica & Demonstração
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Segmento ativo: <strong className="text-slate-800">{segmentNames[segment]}</strong>
                  </p>
                </div>

                {formError && (
                  <div
                    role="alert"
                    className="p-3 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg"
                  >
                    {formError}
                  </div>
                )}

                <div>
                  <label htmlFor="hs-name" className="block text-xs font-medium text-slate-700 mb-1">
                    Seu Nome Completo *
                  </label>
                  <input
                    id="hs-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ex: Marcos Oliveira"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F8F6] border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-blue-700"
                  />
                </div>

                <div>
                  <label htmlFor="hs-company" className="block text-xs font-medium text-slate-700 mb-1">
                    Nome da Loja / Empresa *
                  </label>
                  <input
                    id="hs-company"
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Boutique & Malhas Central"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F8F6] border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-blue-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="hs-email" className="block text-xs font-medium text-slate-700 mb-1">
                      E-mail Corporativo *
                    </label>
                    <input
                      id="hs-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contato@empresa.com.br"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8F8F6] border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label htmlFor="hs-phone" className="block text-xs font-medium text-slate-700 mb-1">
                      WhatsApp Comercial *
                    </label>
                    <input
                      id="hs-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(88) 99435-7360"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8F8F6] border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-blue-700 font-mono-tabular"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hs-notes" className="block text-xs font-medium text-slate-700 mb-1">
                    Necessidade Específica (Opcional)
                  </label>
                  <textarea
                    id="hs-notes"
                    rows={3}
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    placeholder="Conte-nos brevemente o que falta no seu sistema atual (ex: grade de roupas, controle de OS, comissões de salão...)"
                    className="w-full px-3.5 py-2 text-sm bg-[#F8F8F6] border border-slate-300 rounded-lg focus:outline-none focus:bg-white focus:border-blue-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Solicitar Proposta Técnica da House Software</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-xs text-slate-500 text-center">
                  Atendimento direto por engenheiros de software · Sem fidelidade forçada
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
