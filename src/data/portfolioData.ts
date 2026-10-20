import fashionImg from '../assets/images/case_fashion_retail_1791248805730.jpg';
import techImg from '../assets/images/case_tech_store_1791248816415.jpg';
import beautyImg from '../assets/images/case_beauty_salon_1791248827923.jpg';
import commercialImg from '../assets/images/case_commercial_erp_1791248841789.jpg';

export type SegmentKey = 'moda' | 'informatica' | 'celulares' | 'beleza' | 'comercio';

export interface ProjectCaseStudy {
  id: string;
  segment: SegmentKey;
  segmentLabel: string;
  clientName: string;
  location: string;
  deliveryYear: string;
  deploymentWeeks: number;
  title: string;
  summary: string;
  imageUrl: string;
  primaryMetric: string;
  secondaryMetric: string;
  challenge: string;
  solutionArchitecture: string;
  modulesDelivered: string[];
  integrations: string[];
  databaseStack: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export interface FashionSkuItem {
  id: string;
  sku: string;
  name: string;
  collection: string;
  color: string;
  sizes: { P: number; M: number; G: number; GG: number };
  costPrice: number;
  salePrice: number;
}

export interface TechServiceOrder {
  id: string;
  osNumber: string;
  clientName: string;
  deviceModel: string;
  serialNumber: string;
  reportedDefect: string;
  technician: string;
  status: 'Triagem' | 'Em Bancada' | 'Aguardando Peça' | 'Pronto para Retirada';
  partsValue: number;
  laborValue: number;
  warrantyDays: number;
}

export interface SalonAppointment {
  id: string;
  time: string;
  clientName: string;
  serviceName: string;
  professional: string;
  commissionRate: number; // e.g., 0.45 for 45%
  servicePrice: number;
  kitCost: number;
  status: 'Confirmado' | 'Em Atendimento' | 'Concluído';
}

export interface CommercialInventoryItem {
  id: string;
  code: string;
  productName: string;
  category: string;
  batchCode: string;
  stockUnits: number;
  retailPrice: number;
  wholesalePrice: number;
  minWholesaleQty: number;
  ncmCode: string;
}

export const CASE_STUDIES: ProjectCaseStudy[] = [
  {
    id: 'case-moda-viana',
    segment: 'moda',
    segmentLabel: 'Lojas de Roupas & Confecção',
    clientName: 'Rede Atelier Viana (6 Lojas)',
    location: 'São Paulo, SP',
    deliveryYear: '2026',
    deploymentWeeks: 6,
    title: 'ERP Omnichannel com Grade Matriz de Cor/Tamanho e PDV de Troca em 8 Segundos',
    summary:
      'Unificação de estoque físico e catálogo digital para rede de moda feminina e alfaiataria, reduzindo rupturas de tamanho M/G entre filiais.',
    imageUrl: fashionImg,
    primaryMetric: '-68% em rupturas de grade nas 6 lojas em 4 meses',
    secondaryMetric: '8,4s tempo médio de fechamento no PDV',
    challenge:
      'A rede operava com planilhas paralelas ao sistema fiscal antigo, gerando divergência de saldo por cor e tamanho, lentidão em trocas de presentes aos sábados e compras excessivas de peças que encalhavam.',
    solutionArchitecture:
      'Desenvolvemos um núcleo de estoque matricial em tempo real com transferência inteligente entre lojas, etiqueta térmica código de barras/QR por SKU, sacola condicional com baixa automática e módulo de fidelidade por cashback.',
    modulesDelivered: [
      'Matriz Dinâmica de Grade (Tamanho × Cor × Estampa)',
      'PDV Touch para gestão de vendas e grade de produtos',
      'Gestão de Sacola Condicional (Malinha Delivery) com Cobrança via Link',
      'Curva ABC de Giro de Coleção e Sugestão de Remarcação',
      'Troca Rápida por Código QR na Etiqueta Interna'
    ],
    integrations: ['TEF Stone & Cielo', 'Shopify / Nuvemshop Sync', 'WhatsApp API Oficial'],
    databaseStack: 'PostgreSQL + Redis Cache + Node.js / React',
    testimonial: {
      quote:
        'Antes perdíamos vendas porque o sistema dizia que tinha a peça M no estoque, mas era na cor errada. Com a grade visual customizada da House Software, reduzimos sobra de coleção em 41% já no primeiro inverno.',
      author: 'Helena Viana',
      role: 'Diretora de Operações',
      company: 'Rede Atelier Viana'
    }
  },
  {
    id: 'case-tech-nucleo',
    segment: 'informatica',
    segmentLabel: 'Informática & Assistência Técnica',
    clientName: 'Núcleo Tech Hardware & Lab',
    location: 'Curitiba, PR',
    deliveryYear: '2026',
    deploymentWeeks: 5,
    title: 'Sistema de Ordens de Serviço com Rastreio de Serial/IMEI, Laudo Fotográfico e Garantia',
    summary:
      'Plataforma integrada para comércio de hardware gamer, montagem de PCs customizados ("Monte seu PC") e laboratório de assistência técnica com acompanhamento em tempo real pelo cliente.',
    imageUrl: techImg,
    primaryMetric: '+54% em aprovação de orçamentos técnicos em 90 dias',
    secondaryMetric: 'Zero extravio de peças por rastreio de Número de Série',
    challenge:
      'O laboratório recebia mais de 45 equipamentos por dia sem controle rigoroso do número de série das placas e SSDs substituídos, além de gastar horas respondendo clientes no WhatsApp sobre o status do reparo.',
    solutionArchitecture:
      'Criamos uma bancada digital onde cada OS exige leitura de código serial de entrada e saída, checklist visual de avarias na recepção, disparo automático de orçamento com aprovação em 1 clique e controle de RMA com fornecedores.',
    modulesDelivered: [
      'Controle de Bancada e OS com Checklist de Entrada e Fotos',
      'Rastreabilidade Individual por Número de Série (S/N) e IMEI',
      'Aprovação de Orçamento Online pelo Cliente com Assinatura Digital',
      'Configurador "Monte seu PC" com Trava de Compatibilidade (Socket/TDP)',
      'Gestão de Garantia de Balcão e RMA de Fornecedores'
    ],
    integrations: ['API Correios & Jadlog', 'PIX Dinâmico Banco Inter', 'Bling / Contabilidade'],
    databaseStack: 'PostgreSQL + TypeScript + Impressão Térmica ZPL',
    testimonial: {
      quote:
        'O rastreio por número de série blindou nossa garantia. Sabemos exatamente qual lote de memória ou SSD foi instalado em cada máquina e o cliente aprova o orçamento pelo celular em minutos.',
      author: 'Ricardo M. Albuquerque',
      role: 'Sócio-Fundador e Engenheiro de Lab',
      company: 'Núcleo Tech Hardware & Lab'
    }
  },
  {
    id: 'case-beleza-lumiere',
    segment: 'beleza',
    segmentLabel: 'Salão de Beleza & Estética',
    clientName: 'Maison Lumière Studio & Spa',
    location: 'Belo Horizonte, MG',
    deliveryYear: '2025',
    deploymentWeeks: 4,
    title: 'Gestão de Agenda Multi-Profissional, Lei do Salão Parceiro e Consumo Fracionado de Insumos',
    summary:
      'Sistema sob medida para salão de alta movimentação com 28 profissionais, automatizando o split fiscal entre salão e parceiros, baixa de tinturas por grama e pacotes recorrentes.',
    imageUrl: beautyImg,
    primaryMetric: '-72% em faltas (No-Show) com confirmação ativa',
    secondaryMetric: 'Fechamento de comissões de 3 dias para 15 minutos',
    challenge:
      'O fechamento quinzenal de comissões levava três dias úteis devido às regras variáveis (desconto de taxa de cartão, custo de produtos químicos de backbar e assistentes), gerando atritos com os profissionais.',
    solutionArchitecture:
      'Implementamos um motor de comissionamento parametrizável com split automático no pagamento, ficha de anamnese digital em tablet, baixa automática de insumos de lavatório/coloração em mililitros e agendamento online 24h.',
    modulesDelivered: [
      'Agenda Visual Drag-and-Drop com Bloqueio de Cadeiras e Equipamentos',
      'Motor de Comissões Escalonadas e Split Fiscal (Lei do Salão Parceiro)',
      'Controle de Estoque Fracionado (Consumo de Uso Interno vs. Revenda)',
      'Gestão de Pacotes de Sessões, Clubes de Assinatura e Vale-Presente',
      'Prontuário de Anamnese e Histórico Químico da Cliente'
    ],
    integrations: ['Split de Pagamento Pagar.me / Stone', 'Confirmação Automática WhatsApp', 'Google Calendar Sync'],
    databaseStack: 'PostgreSQL + React PWA (Tablet/Mobile) + Node.js',
    testimonial: {
      quote:
        'O cálculo automático descontando o custo exato do descolorante e a taxa da maquininha mudou nossa paz interna. Cada profissional acompanha seu extrato no próprio celular em tempo real.',
      author: 'Camila Vasconcelos',
      role: 'Gestora Executiva',
      company: 'Maison Lumière Studio & Spa'
    }
  },
  {
    id: 'case-comercio-mercantil',
    segment: 'comercio',
    segmentLabel: 'Demais Segmentos Comerciais',
    clientName: 'Distribuidora & Varejo Mercantil Sul',
    location: 'Porto Alegre, RS',
    deliveryYear: '2026',
    deploymentWeeks: 8,
    title: 'ERP Comercial Multi-Tabela (Atacado e Varejo), Controle de Lote/Validade e DRE em Tempo Real',
    summary:
      'Arquitetura corporativa para operação híbrida de loja física, televendas B2B e distribuição regional, com precificação automática por volume, expedição por coletor e conciliação bancária.',
    imageUrl: commercialImg,
    primaryMetric: '+31% na margem líquida auditada por linha de produto',
    secondaryMetric: '100% de conformidade fiscal SPED / Bloco K',
    challenge:
      'A empresa atende tanto consumidor final no balcão quanto pequenos comerciantes por atacado. Faltava trava de margem mínima para vendedores, controle FEFO (primeiro que vence, primeiro que sai) e fluxo de caixa unificado.',
    solutionArchitecture:
      'Construímos um ERP modular com gatilhos de preço por quantidade ou CNPJ, limite de crédito automatizado com consulta Serasa, conferência cega de expedição via leitor óptico e DRE gerencial atualizado a cada venda.',
    modulesDelivered: [
      'Precificação Dinâmica Multi-Tabela (Varejo, Atacado, Fracionado e Promocional)',
      'Controle de Estoque por Lote, Data de Validade (FEFO) e Endereçamento de Rua/Prateleira',
      'Força de Vendas B2B e Orçamento Rápido com Trava de Margem de Contribuição',
      'Financeiro Completo: Contas a Pagar/Receber, Conciliação OFX, Boletos e PIX QR',
      'Motor Tributário Automatizado (ICMS-ST, DIFAL, PIS/COFINS e SPED Fiscal)'
    ],
    integrations: ['Bancos via CNAB 240/400 e API PIX', 'Coletores de Dados Android', 'Exportação Domínio / Alterdata'],
    databaseStack: 'PostgreSQL Cluster + Node.js Microservices + React Desktop/Web',
    testimonial: {
      quote:
        'Nenhum ERP de prateleira se adaptava à nossa regra de venda mista de balcão e distribuição fracionada. O sistema customizado pagou o investimento em menos de cinco meses só estancando erros de tributação e descontos indevidos.',
      author: 'Roberto T. Dornelles',
      role: 'Diretor Financeiro (CFO)',
      company: 'Distribuidora & Varejo Mercantil Sul'
    }
  }
];

export const INITIAL_FASHION_SKUS: FashionSkuItem[] = [
  {
    id: 'f-1',
    sku: 'VRT-LIN-014',
    name: 'Blazer Alfaiataria Linho Puro',
    collection: 'Outono/Inverno 26',
    color: 'Areia Natural',
    sizes: { P: 4, M: 9, G: 6, GG: 2 },
    costPrice: 145,
    salePrice: 389
  },
  {
    id: 'f-2',
    sku: 'VRT-DNM-082',
    name: 'Calça Wide Leg Denim Premium',
    collection: 'Cápsula Urbana',
    color: 'Índigo Escuro',
    sizes: { P: 7, M: 14, G: 11, GG: 5 },
    costPrice: 88,
    salePrice: 249
  },
  {
    id: 'f-3',
    sku: 'VRT-TRC-039',
    name: 'Tricot Gola Alta Fio Modal',
    collection: 'Outono/Inverno 26',
    color: 'Verde Oliva',
    sizes: { P: 2, M: 1, G: 5, GG: 3 },
    costPrice: 72,
    salePrice: 198
  },
  {
    id: 'f-4',
    sku: 'VRT-VES-105',
    name: 'Vestido Midi Viscose Acetinada',
    collection: 'Noite & Eventos',
    color: 'Preto Ônix',
    sizes: { P: 6, M: 8, G: 4, GG: 1 },
    costPrice: 118,
    salePrice: 329
  }
];

export const INITIAL_TECH_ORDERS: TechServiceOrder[] = [
  {
    id: 'os-1',
    osNumber: 'OS-2026-0841',
    clientName: 'Engenharia Civil Concreta Ltda',
    deviceModel: 'Workstation Dell Precision 5820',
    serialNumber: 'SN-DL984102BR',
    reportedDefect: 'Desligamento sob renderização 3D e falha no RAID NVMe',
    technician: 'Lucas F. (Lab Sênior)',
    status: 'Em Bancada',
    partsValue: 1240,
    laborValue: 380,
    warrantyDays: 180
  },
  {
    id: 'os-2',
    osNumber: 'OS-2026-0842',
    clientName: 'Mariana Costa Arquitetura',
    deviceModel: 'MacBook Pro 16" M3 Max',
    serialNumber: 'SN-C02YM489MD6R',
    reportedDefect: 'Substituição de topcase/teclado e limpeza térmica preventiva',
    technician: 'André S. (Especialista Apple)',
    status: 'Pronto para Retirada',
    partsValue: 1650,
    laborValue: 450,
    warrantyDays: 120
  },
  {
    id: 'os-3',
    osNumber: 'OS-2026-0845',
    clientName: 'Pedro Henrique Oliveira',
    deviceModel: 'PC Gamer Custom RTX 4070 Ti',
    serialNumber: 'SN-NV4070-8821X',
    reportedDefect: 'Upgrade de WaterCooler 360mm + Atualização de BIOS',
    technician: 'Lucas F. (Lab Sênior)',
    status: 'Triagem',
    partsValue: 890,
    laborValue: 220,
    warrantyDays: 90
  },
  {
    id: 'os-4',
    osNumber: 'OS-2026-0849',
    clientName: 'Clínica Odontológica Sorriso',
    deviceModel: 'Servidor NAS Synology 8-Bay',
    serialNumber: 'SN-SYN229044A',
    reportedDefect: 'Substituição de 2 HDs Enterprise 8TB e rebuild de volume',
    technician: 'Marcos V. (Redes & Storage)',
    status: 'Aguardando Peça',
    partsValue: 3180,
    laborValue: 640,
    warrantyDays: 365
  }
];

export const INITIAL_SALON_APPOINTMENTS: SalonAppointment[] = [
  {
    id: 'ag-1',
    time: '09:30',
    clientName: 'Beatriz Meirelles',
    serviceName: 'Mechas Contour + Tratamento Reconstrutor',
    professional: 'Juliana Prado (Master Colorist)',
    commissionRate: 0.5,
    servicePrice: 680,
    kitCost: 85,
    status: 'Concluído'
  },
  {
    id: 'ag-2',
    time: '11:00',
    clientName: 'Fernanda Albuquerque',
    serviceName: 'Protocolo Facial Bioestimulador + LED',
    professional: 'Dra. Carla Mendes (Estética)',
    commissionRate: 0.45,
    servicePrice: 540,
    kitCost: 110,
    status: 'Em Atendimento'
  },
  {
    id: 'ag-3',
    time: '14:00',
    clientName: 'Patrícia Siqueira',
    serviceName: 'Corte Visagismo + Escova Modelada',
    professional: 'Rafael Bernardes (Hair Stylist)',
    commissionRate: 0.5,
    servicePrice: 260,
    kitCost: 18,
    status: 'Confirmado'
  },
  {
    id: 'ag-4',
    time: '15:30',
    clientName: 'Gabriela Fontes',
    serviceName: 'Spa das Mãos & Alongamento em Fibra',
    professional: 'Aline Rocha (Nail Designer)',
    commissionRate: 0.4,
    servicePrice: 210,
    kitCost: 24,
    status: 'Confirmado'
  }
];

export const INITIAL_COMMERCIAL_ITEMS: CommercialInventoryItem[] = [
  {
    id: 'cm-1',
    code: 'PRD-8810',
    productName: 'Cafeteira Expresso Automática Inox Pro',
    category: 'Eletroportáteis & Utilidades',
    batchCode: 'LT-2026-04A',
    stockUnits: 42,
    retailPrice: 1490,
    wholesalePrice: 1180,
    minWholesaleQty: 5,
    ncmCode: '8516.71.00'
  },
  {
    id: 'cm-2',
    code: 'PRD-4402',
    productName: 'Kit Iluminação Trilho Magnético LED 3000K',
    category: 'Material Elétrico & Iluminação',
    batchCode: 'LT-2026-02C',
    stockUnits: 118,
    retailPrice: 420,
    wholesalePrice: 315,
    minWholesaleQty: 10,
    ncmCode: '9405.11.90'
  },
  {
    id: 'cm-3',
    code: 'PRD-5190',
    productName: 'Leitor Código de Barras 2D QR Sem Fio',
    category: 'Automação Comercial',
    batchCode: 'LT-2026-05B',
    stockUnits: 29,
    retailPrice: 360,
    wholesalePrice: 279,
    minWholesaleQty: 6,
    ncmCode: '8471.90.12'
  },
  {
    id: 'cm-4',
    code: 'PRD-9034',
    productName: 'Balança Comercial Prix c/ Etiquetadora Térmica',
    category: 'Automação Comercial',
    batchCode: 'LT-2026-01F',
    stockUnits: 14,
    retailPrice: 3290,
    wholesalePrice: 2790,
    minWholesaleQty: 3,
    ncmCode: '8423.81.90'
  }
];
