import React, { useState } from 'react';
import {
  SegmentKey,
  INITIAL_FASHION_SKUS,
  INITIAL_TECH_ORDERS,
  INITIAL_SALON_APPOINTMENTS,
  INITIAL_COMMERCIAL_ITEMS,
  FashionSkuItem,
  TechServiceOrder,
  SalonAppointment,
  CommercialInventoryItem
} from '../data/portfolioData';
import { Search, Plus, ArrowRight, Check, RefreshCw } from 'lucide-react';

interface LiveSystemSimulatorProps {
  activeSegment: SegmentKey;
  onSelectSegment: (seg: SegmentKey) => void;
  onOpenProposalWithSegment: (seg: SegmentKey) => void;
}

export const LiveSystemSimulator: React.FC<LiveSystemSimulatorProps> = ({
  activeSegment,
  onSelectSegment,
  onOpenProposalWithSegment
}) => {
  // 1. Fashion Store State
  const [fashionSkus, setFashionSkus] = useState<FashionSkuItem[]>(INITIAL_FASHION_SKUS);
  const [fashionSearch, setFashionSearch] = useState('');
  const [lastPosMessage, setLastPosMessage] = useState<string>(
    'Pronto para simulação. Clique em qualquer tamanho (P, M, G, GG) para simular uma venda no PDV com baixa automática.'
  );
  const [newSkuName, setNewSkuName] = useState('');
  const [newSkuColor, setNewSkuColor] = useState('');
  const [newSkuPrice, setNewSkuPrice] = useState('');
  const [showAddFashion, setShowAddFashion] = useState(false);

  // 2. Tech Store / Service Lab State
  const [techOrders, setTechOrders] = useState<TechServiceOrder[]>(INITIAL_TECH_ORDERS);
  const [techFilter, setTechFilter] = useState<string>('Todos');
  const [techSearch, setTechSearch] = useState('');
  const [showAddOs, setShowAddOs] = useState(false);
  const [newOsClient, setNewOsClient] = useState('');
  const [newOsDevice, setNewOsDevice] = useState('');
  const [newOsSerial, setNewOsSerial] = useState('');
  const [newOsDefect, setNewOsDefect] = useState('');

  // 3. Beauty Salon State
  const [appointments, setAppointments] = useState<SalonAppointment[]>(INITIAL_SALON_APPOINTMENTS);
  const [salonFilter, setSalonFilter] = useState<string>('Todos');
  const [showAddAppt, setShowAddAppt] = useState(false);
  const [newApptClient, setNewApptClient] = useState('');
  const [newApptService, setNewApptService] = useState('');
  const [newApptPrice, setNewApptPrice] = useState('');

  // 4. General Commercial State
  const [commercialItems, setCommercialItems] = useState<CommercialInventoryItem[]>(INITIAL_COMMERCIAL_ITEMS);
  const [simulatedOrderQty, setSimulatedOrderQty] = useState<Record<string, number>>({
    'cm-1': 6,
    'cm-2': 4,
    'cm-3': 8,
    'cm-4': 1
  });
  const [commercialSearch, setCommercialSearch] = useState('');

  const formatBRL = (val: number) =>
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Fashion Handlers
  const handleSellSize = (id: string, sizeKey: 'P' | 'M' | 'G' | 'GG') => {
    setFashionSkus((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentQty = item.sizes[sizeKey];
        if (currentQty <= 0) {
          setLastPosMessage(`Estoque esgotado no tamanho ${sizeKey} para ${item.name}. Solicite transferência entre filiais.`);
          return item;
        }
        const updatedSizes = { ...item.sizes, [sizeKey]: currentQty - 1 };
        setLastPosMessage(
          `Venda simulada registrada: 1x ${item.name} (${item.color} · Tam ${sizeKey}) · Valor ${formatBRL(item.salePrice)}`
        );
        return { ...item, sizes: updatedSizes };
      })
    );
  };

  const handleRestockFashion = () => {
    setFashionSkus(INITIAL_FASHION_SKUS);
    setLastPosMessage('Grade de estoque restaurada para os saldos iniciais da coleção.');
  };

  const handleCreateFashionSku = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkuName.trim()) return;
    const priceNum = Number(newSkuPrice) || 229;
    const newItem: FashionSkuItem = {
      id: `f-${Date.now()}`,
      sku: `VRT-NEW-${Math.floor(100 + Math.random() * 899)}`,
      name: newSkuName.trim(),
      collection: 'Lançamento Exclusivo',
      color: newSkuColor.trim() || 'Off-White',
      sizes: { P: 4, M: 8, G: 6, GG: 2 },
      costPrice: Math.round(priceNum * 0.38),
      salePrice: priceNum
    };
    setFashionSkus((prev) => [newItem, ...prev]);
    setNewSkuName('');
    setNewSkuColor('');
    setNewSkuPrice('');
    setShowAddFashion(false);
    setLastPosMessage(`Novo SKU ${newItem.sku} (${newItem.name}) cadastrado na grade com 20 peças totais.`);
  };

  // Tech Handlers
  const statusSequence: TechServiceOrder['status'][] = [
    'Triagem',
    'Em Bancada',
    'Aguardando Peça',
    'Pronto para Retirada'
  ];

  const handleAdvanceOsStatus = (id: string) => {
    setTechOrders((prev) =>
      prev.map((os) => {
        if (os.id !== id) return os;
        const currentIndex = statusSequence.indexOf(os.status);
        const nextStatus = statusSequence[(currentIndex + 1) % statusSequence.length];
        return { ...os, status: nextStatus };
      })
    );
  };

  const handleCreateOs = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOsClient.trim() || !newOsDevice.trim()) return;
    const newOrder: TechServiceOrder = {
      id: `os-${Date.now()}`,
      osNumber: `OS-2026-0${Math.floor(850 + Math.random() * 140)}`,
      clientName: newOsClient.trim(),
      deviceModel: newOsDevice.trim(),
      serialNumber: newOsSerial.trim().toUpperCase() || `SN-BR${Math.floor(100000 + Math.random() * 899999)}`,
      reportedDefect: newOsDefect.trim() || 'Diagnóstico completo de hardware e testes de bancada',
      technician: 'Lucas F. (Lab Sênior)',
      status: 'Triagem',
      partsValue: 320,
      laborValue: 180,
      warrantyDays: 90
    };
    setTechOrders((prev) => [newOrder, ...prev]);
    setNewOsClient('');
    setNewOsDevice('');
    setNewOsSerial('');
    setNewOsDefect('');
    setShowAddOs(false);
  };

  // Salon Handlers
  const handleToggleApptStatus = (id: string) => {
    const seq: SalonAppointment['status'][] = ['Confirmado', 'Em Atendimento', 'Concluído'];
    setAppointments((prev) =>
      prev.map((app) => {
        if (app.id !== id) return app;
        const next = seq[(seq.indexOf(app.status) + 1) % seq.length];
        return { ...app, status: next };
      })
    );
  };

  const handleCreateAppt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApptClient.trim() || !newApptService.trim()) return;
    const price = Number(newApptPrice) || 320;
    const created: SalonAppointment = {
      id: `ag-${Date.now()}`,
      time: '17:00',
      clientName: newApptClient.trim(),
      serviceName: newApptService.trim(),
      professional: 'Juliana Prado (Master Colorist)',
      commissionRate: 0.5,
      servicePrice: price,
      kitCost: Math.round(price * 0.12),
      status: 'Confirmado'
    };
    setAppointments((prev) => [...prev, created]);
    setNewApptClient('');
    setNewApptService('');
    setNewApptPrice('');
    setShowAddAppt(false);
  };

  // Commercial Quantity Handler
  const handleQtyChange = (id: string, delta: number) => {
    setSimulatedOrderQty((prev) => {
      const current = prev[id] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Filtered views
  const filteredFashion = fashionSkus.filter(
    (item) =>
      item.name.toLowerCase().includes(fashionSearch.toLowerCase()) ||
      item.sku.toLowerCase().includes(fashionSearch.toLowerCase()) ||
      item.color.toLowerCase().includes(fashionSearch.toLowerCase())
  );

  const filteredTech = techOrders.filter((os) => {
    const matchesStatus = techFilter === 'Todos' || os.status === techFilter;
    const matchesQuery =
      os.clientName.toLowerCase().includes(techSearch.toLowerCase()) ||
      os.deviceModel.toLowerCase().includes(techSearch.toLowerCase()) ||
      os.serialNumber.toLowerCase().includes(techSearch.toLowerCase()) ||
      os.osNumber.toLowerCase().includes(techSearch.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const filteredSalon = appointments.filter(
    (a) => salonFilter === 'Todos' || a.status === salonFilter
  );

  const filteredCommercial = commercialItems.filter(
    (c) =>
      c.productName.toLowerCase().includes(commercialSearch.toLowerCase()) ||
      c.code.toLowerCase().includes(commercialSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(commercialSearch.toLowerCase())
  );

  // Totals for active simulator
  const totalFashionPieces = fashionSkus.reduce(
    (acc, item) => acc + item.sizes.P + item.sizes.M + item.sizes.G + item.sizes.GG,
    0
  );
  const totalFashionRevenuePotential = fashionSkus.reduce(
    (acc, item) =>
      acc + (item.sizes.P + item.sizes.M + item.sizes.G + item.sizes.GG) * item.salePrice,
    0
  );

  const totalTechApprovedValue = techOrders.reduce(
    (acc, os) => acc + os.partsValue + os.laborValue,
    0
  );

  const totalSalonGross = appointments.reduce((acc, a) => acc + a.servicePrice, 0);
  const totalSalonPartnerCommission = appointments.reduce(
    (acc, a) => acc + (a.servicePrice - a.kitCost) * a.commissionRate,
    0
  );
  const totalSalonNetRetained = totalSalonGross - totalSalonPartnerCommission;

  const totalCommercialOrder = filteredCommercial.reduce((acc, item) => {
    const qty = simulatedOrderQty[item.id] ?? 1;
    const isWholesale = qty >= item.minWholesaleQty;
    const unitPrice = isWholesale ? item.wholesalePrice : item.retailPrice;
    return acc + qty * unitPrice;
  }, 0);

  return (
    <section id="simulador" className="py-20 border-b border-slate-200/80 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-medium text-blue-700 mb-2">
              01. Demonstração Interativa de Telas Operacionais
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Teste na prática a lógica de cada segmento comercial
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Não entregamos telas genéricas. Interaja abaixo com os módulos reais que desenvolvemos sob medida para varejo de moda, assistência técnica de informática, salões de beleza e distribuidoras comerciais.
            </p>
          </div>

          {/* Interactive Segment Selector Tabs */}
          <div
            role="tablist"
            aria-label="Selecionar segmento do simulador"
            className="flex flex-wrap sm:flex-nowrap items-center gap-1 p-1.5 bg-slate-100 rounded-lg border border-slate-200/80 self-start"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeSegment === 'moda'}
              onClick={() => onSelectSegment('moda')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSegment === 'moda'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lojas de Roupas
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSegment === 'informatica'}
              onClick={() => onSelectSegment('informatica')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSegment === 'informatica'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Informática & OS
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSegment === 'beleza'}
              onClick={() => onSelectSegment('beleza')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSegment === 'beleza'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Salão de Beleza
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeSegment === 'comercio'}
              onClick={() => onSelectSegment('comercio')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSegment === 'comercio'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Demais Comércios
            </button>
          </div>
        </div>

        {/* Workspace Console Container (Single-Elevation Depth) */}
        <div className="border border-slate-200 rounded-xl bg-[#FCFCFA] overflow-hidden">
          {/* Console Top Bar */}
          <div className="px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="font-semibold text-white">
                {activeSegment === 'moda' && 'House Software Fashion ERP · Controle de Grade & PDV'}
                {activeSegment === 'informatica' && 'House Software TechLab · Bancada de Assistência & Rastreio Serial'}
                {activeSegment === 'beleza' && 'House Software Beauty · Agenda & Split Lei do Salão Parceiro'}
                {activeSegment === 'comercio' && 'House Software Comercial · Precificação Atacado/Varejo & Lotes'}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">Simulação Interativa em Tempo Real</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onOpenProposalWithSegment(activeSegment)}
                className="text-xs font-semibold text-blue-300 hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Orçar este módulo para minha empresa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 1. FASHION STORE VIEW */}
          {activeSegment === 'moda' && (
            <div className="p-6">
              {/* Top Metrics & Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 mb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Peças Ativas na Grade</span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    {totalFashionPieces} un.
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Sincronizado entre Loja Física · E-commerce · Condicional
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Valor de Venda em Estoque</span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    {formatBRL(totalFashionRevenuePotential)}
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Markup médio auditado: 2,68x sobre custo fabril
                  </span>
                </div>
                <div className="flex flex-col justify-between items-start md:items-end">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleRestockFashion}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Repor Grade</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddFashion(!showAddFashion)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Cadastrar Peça na Grade</span>
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 mt-2">
                    Clique nos tamanhos abaixo para testar a baixa de venda no PDV
                  </span>
                </div>
              </div>

              {/* Optional Add SKU Inline Form */}
              {showAddFashion && (
                <form
                  onSubmit={handleCreateFashionSku}
                  className="mb-6 p-4 bg-slate-100/80 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Descrição da Peça
                    </label>
                    <input
                      type="text"
                      required
                      value={newSkuName}
                      onChange={(e) => setNewSkuName(e.target.value)}
                      placeholder="Ex: Camisa Linho Manga Longa"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Cor / Variante
                    </label>
                    <input
                      type="text"
                      value={newSkuColor}
                      onChange={(e) => setNewSkuColor(e.target.value)}
                      placeholder="Ex: Azul Petróleo"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Preço de Venda (R$)
                    </label>
                    <input
                      type="number"
                      min="10"
                      value={newSkuPrice}
                      onChange={(e) => setNewSkuPrice(e.target.value)}
                      placeholder="279"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700 font-mono-tabular"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Inserir Grade Inicial
                    </button>
                  </div>
                </form>
              )}

              {/* Search & Feedback Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fashionSearch}
                    onChange={(e) => setFashionSearch(e.target.value)}
                    placeholder="Buscar por SKU, modelo ou cor..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
                <div className="text-xs text-slate-700 bg-blue-50/80 border border-blue-200/80 px-3.5 py-2 rounded-lg">
                  {lastPosMessage}
                </div>
              </div>

              {/* High-Density Data Grid */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Código SKU</th>
                      <th className="py-3 px-4">Modelo & Coleção</th>
                      <th className="py-3 px-4">Cor</th>
                      <th className="py-3 px-4">Grade Interativa (Clique p/ Baixar PDV)</th>
                      <th className="py-3 px-4 text-right">Custo</th>
                      <th className="py-3 px-4 text-right">Preço PDV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredFashion.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono-tabular text-xs font-medium text-slate-600 whitespace-nowrap">
                          {item.sku}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.collection}</div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-700 whitespace-nowrap">
                          {item.color}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {(['P', 'M', 'G', 'GG'] as const).map((sz) => {
                              const count = item.sizes[sz];
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => handleSellSize(item.id, sz)}
                                  title={`Simular venda tamanho ${sz}`}
                                  className={`px-2.5 py-1 text-xs font-mono-tabular rounded border transition-colors whitespace-nowrap cursor-pointer ${
                                    count === 0
                                      ? 'bg-red-50/60 border-red-200 text-red-700'
                                      : count <= 2
                                      ? 'bg-amber-50/70 border-amber-200 text-amber-800 hover:bg-amber-100'
                                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-blue-50 hover:border-blue-300'
                                  }`}
                                >
                                  <span className="font-semibold">{sz}:</span> {count}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-500 whitespace-nowrap">
                          {formatBRL(item.costPrice)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-slate-900 whitespace-nowrap">
                          {formatBRL(item.salePrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. IT STORE & TECHNICAL LAB VIEW */}
          {activeSegment === 'informatica' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 mb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Ordens de Serviço na Bancada</span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    {techOrders.length} equipamentos
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Número de Série (S/N) vinculado ao equipamento
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Total em Peças + Mão de Obra</span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    {formatBRL(totalTechApprovedValue)}
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Notificação automática de status via WhatsApp
                  </span>
                </div>
                <div className="flex flex-col justify-between items-start md:items-end">
                  <button
                    type="button"
                    onClick={() => setShowAddOs(!showAddOs)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Abrir Nova Ordem de Serviço</span>
                  </button>
                  <span className="text-xs text-slate-500 mt-2">
                    Clique em "Avançar Etapa" para mudar o estágio do reparo
                  </span>
                </div>
              </div>

              {showAddOs && (
                <form
                  onSubmit={handleCreateOs}
                  className="mb-6 p-4 bg-slate-100/80 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-5 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Cliente / Empresa
                    </label>
                    <input
                      type="text"
                      required
                      value={newOsClient}
                      onChange={(e) => setNewOsClient(e.target.value)}
                      placeholder="Ex: Studio Gráfico Alfa"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Equipamento
                    </label>
                    <input
                      type="text"
                      required
                      value={newOsDevice}
                      onChange={(e) => setNewOsDevice(e.target.value)}
                      placeholder="Ex: Notebook Lenovo Legion 5i"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Número de Série (S/N)
                    </label>
                    <input
                      type="text"
                      value={newOsSerial}
                      onChange={(e) => setNewOsSerial(e.target.value)}
                      placeholder="Ex: SN-LNV99201BR"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700 font-mono-tabular"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Sintoma / Serviço
                    </label>
                    <input
                      type="text"
                      value={newOsDefect}
                      onChange={(e) => setNewOsDefect(e.target.value)}
                      placeholder="Ex: Troca de pasta térmica + SSD 1TB"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Gerar Etiqueta OS
                    </button>
                  </div>
                </form>
              )}

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {['Todos', 'Triagem', 'Em Bancada', 'Aguardando Peça', 'Pronto para Retirada'].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setTechFilter(st)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                          techFilter === st
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st}
                      </button>
                    )
                  )}
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    placeholder="Buscar por Serial (S/N), OS ou cliente..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Nº OS · Serial</th>
                      <th className="py-3 px-4">Equipamento & Cliente</th>
                      <th className="py-3 px-4">Diagnóstico Técnico</th>
                      <th className="py-3 px-4">Estágio Atual</th>
                      <th className="py-3 px-4 text-right">Peças + Serviço</th>
                      <th className="py-3 px-4 text-right">Ação de Bancada</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredTech.map((os) => (
                      <tr key={os.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono-tabular text-xs font-semibold text-slate-900">
                            {os.osNumber}
                          </div>
                          <div className="font-mono-tabular text-xs text-slate-500">
                            {os.serialNumber}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900">{os.deviceModel}</div>
                          <div className="text-xs text-slate-500">
                            {os.clientName} · Garantia {os.warrantyDays} dias
                          </div>
                        </td>
                        <td className="py-3 px-4 text-xs text-slate-600 max-w-xs">
                          {os.reportedDefect}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-xs font-semibold ${
                              os.status === 'Pronto para Retirada'
                                ? 'text-emerald-700'
                                : os.status === 'Aguardando Peça'
                                ? 'text-amber-700'
                                : 'text-blue-700'
                            }`}
                          >
                            {os.status}
                          </span>
                          <div className="text-xs text-slate-500">{os.technician}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-mono-tabular whitespace-nowrap">
                          <div className="font-semibold text-slate-900">
                            {formatBRL(os.partsValue + os.laborValue)}
                          </div>
                          <div className="text-xs text-slate-500">
                            Peças: {formatBRL(os.partsValue)} · M.O: {formatBRL(os.laborValue)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleAdvanceOsStatus(os.id)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                          >
                            Avançar Etapa →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. BEAUTY SALON & AESTHETICS VIEW */}
          {activeSegment === 'beleza' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 mb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Receita Bruta da Agenda (Hoje)</span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    {formatBRL(totalSalonGross)}
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Baixa automática de insumos de lavatório e coloração
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">
                    Repasse Parceiros (Lei Salão Parceiro)
                  </span>
                  <strong className="text-2xl font-bold text-blue-700 font-mono-tabular mt-1 block">
                    {formatBRL(totalSalonPartnerCommission)}
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Cota-parte líquida retida pelo salão: {formatBRL(totalSalonNetRetained)}
                  </span>
                </div>
                <div className="flex flex-col justify-between items-start md:items-end">
                  <button
                    type="button"
                    onClick={() => setShowAddAppt(!showAddAppt)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Novo Agendamento na Agenda</span>
                  </button>
                  <span className="text-xs text-slate-500 mt-2">
                    Cálculo de comissão já desconta o custo químico do procedimento
                  </span>
                </div>
              </div>

              {showAddAppt && (
                <form
                  onSubmit={handleCreateAppt}
                  className="mb-6 p-4 bg-slate-100/80 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Nome da Cliente
                    </label>
                    <input
                      type="text"
                      required
                      value={newApptClient}
                      onChange={(e) => setNewApptClient(e.target.value)}
                      placeholder="Ex: Carolina Vasconcelos"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Procedimento / Serviço
                    </label>
                    <input
                      type="text"
                      required
                      value={newApptService}
                      onChange={(e) => setNewApptService(e.target.value)}
                      placeholder="Ex: Alisamento Orgânico + Hidratação"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Valor do Serviço (R$)
                    </label>
                    <input
                      type="number"
                      min="30"
                      value={newApptPrice}
                      onChange={(e) => setNewApptPrice(e.target.value)}
                      placeholder="390"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-blue-700 font-mono-tabular"
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                    >
                      Confirmar Horário
                    </button>
                  </div>
                </form>
              )}

              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {['Todos', 'Confirmado', 'Em Atendimento', 'Concluído'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSalonFilter(st)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                        salonFilter === st
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Horário</th>
                      <th className="py-3 px-4">Cliente & Procedimento</th>
                      <th className="py-3 px-4">Profissional Parceiro</th>
                      <th className="py-3 px-4 text-right">Valor Bruto</th>
                      <th className="py-3 px-4 text-right">Insumo / Backbar</th>
                      <th className="py-3 px-4 text-right">Comissão Líquida</th>
                      <th className="py-3 px-4 text-right">Status Atendimento</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredSalon.map((app) => {
                      const netCommission = (app.servicePrice - app.kitCost) * app.commissionRate;
                      return (
                        <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono-tabular text-xs font-semibold text-slate-900 whitespace-nowrap">
                            {app.time}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{app.clientName}</div>
                            <div className="text-xs text-slate-500">{app.serviceName}</div>
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-700">
                            <div>{app.professional}</div>
                            <div className="text-slate-500 font-mono-tabular">
                              Split: {Math.round(app.commissionRate * 100)}% após insumo
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-slate-900 whitespace-nowrap">
                            {formatBRL(app.servicePrice)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-500 whitespace-nowrap">
                            - {formatBRL(app.kitCost)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular font-semibold text-emerald-700 whitespace-nowrap">
                            {formatBRL(netCommission)}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleApptStatus(app.id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                                app.status === 'Concluído'
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                  : app.status === 'Em Atendimento'
                                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {app.status}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. GENERAL COMMERCIAL & WHOLESALE/RETAIL VIEW */}
          {activeSegment === 'comercio' && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 mb-6 border-b border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Total Simulado do Pedido Comercial
                  </span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    {formatBRL(totalCommercialOrder)}
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Gatilho automático de tabela Atacado ao atingir volume mínimo
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Rastreabilidade de Produtos & Lotes</span>
                  <strong className="text-2xl font-bold text-slate-900 font-mono-tabular mt-1 block">
                    NCM e lote
                  </strong>
                  <span className="text-xs text-slate-500 mt-1 block">
                    Consulte a equipe sobre os requisitos fiscais da sua operação
                  </span>
                </div>
                <div className="flex flex-col justify-between items-start md:items-end">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={commercialSearch}
                      onChange={(e) => setCommercialSearch(e.target.value)}
                      placeholder="Buscar produto, código ou categoria..."
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-700"
                    />
                  </div>
                  <span className="text-xs text-slate-500 mt-2">
                    Altere as quantidades (+ / -) para disparar o preço de atacado
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                      <th className="py-3 px-4">Código · Lote</th>
                      <th className="py-3 px-4">Produto & Classificação Fiscal</th>
                      <th className="py-3 px-4 text-right">Tab. Varejo</th>
                      <th className="py-3 px-4 text-right">Tab. Atacado</th>
                      <th className="py-3 px-4 text-center">Qtd. Simulada</th>
                      <th className="py-3 px-4 text-right">Subtotal Aplicado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-sm">
                    {filteredCommercial.map((item) => {
                      const qty = simulatedOrderQty[item.id] ?? 1;
                      const isWholesale = qty >= item.minWholesaleQty;
                      const activeUnitPrice = isWholesale ? item.wholesalePrice : item.retailPrice;
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="font-mono-tabular text-xs font-semibold text-slate-900">
                              {item.code}
                            </div>
                            <div className="font-mono-tabular text-xs text-slate-500">
                              Lote: {item.batchCode}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{item.productName}</div>
                            <div className="text-xs text-slate-500">
                              {item.category} · NCM {item.ncmCode} · Estoque: {item.stockUnits} un.
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular text-xs text-slate-600 whitespace-nowrap">
                            {formatBRL(item.retailPrice)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular whitespace-nowrap">
                            <div className="text-xs font-semibold text-blue-700">
                              {formatBRL(item.wholesalePrice)}
                            </div>
                            <div className="text-xs text-slate-500">
                              Mín. {item.minWholesaleQty} un.
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, -1)}
                                className="w-7 h-7 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-mono-tabular text-xs font-bold cursor-pointer"
                              >
                                -
                              </button>
                              <span className="w-8 text-center font-mono-tabular text-xs font-semibold text-slate-900">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(item.id, 1)}
                                className="w-7 h-7 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-mono-tabular text-xs font-bold cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-mono-tabular whitespace-nowrap">
                            <div className="font-semibold text-slate-900">
                              {formatBRL(qty * activeUnitPrice)}
                            </div>
                            <div
                              className={`text-xs ${
                                isWholesale ? 'text-emerald-700 font-medium' : 'text-slate-500'
                              }`}
                            >
                              {isWholesale ? (
                                <span className="inline-flex items-center gap-1">
                                  <Check className="w-3 h-3" /> Tarifa Atacado Ativa
                                </span>
                              ) : (
                                'Tarifa Varejo Balcão'
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
