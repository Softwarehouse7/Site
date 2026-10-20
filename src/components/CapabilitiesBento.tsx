import React from 'react';
import { SegmentKey } from '../data/portfolioData';
import { ArrowRight } from 'lucide-react';

interface CapabilitiesBentoProps {
  onSelectSegmentAndScroll: (segment: SegmentKey) => void;
}

export const CapabilitiesBento: React.FC<CapabilitiesBentoProps> = ({
  onSelectSegmentAndScroll
}) => {
  return (
    <section id="solucoes" className="py-20 border-b border-slate-200/80 bg-white scroll-mt-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-medium text-blue-700 mb-2">
            01. Nossas Soluções por Segmento Comercial
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Sistemas corporativos desenhados para a realidade de cada negócio
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Sistemas de prateleira obrigam sua loja ou clínica a adaptar a operação às limitações do software. Desenhamos regras de negócio, telas de balcão e integrações fiscais em torno do fluxo real da sua equipe.
          </p>
        </div>

        {/* Asymmetric Bento Grid (col-span-2 alongside col-span-1, single-level hairline borders) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Marquee Capability 01: Lojas de Roupas (col-span-2) */}
          <div className="lg:col-span-2 p-8 bg-[#F8F8F6] border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-900">01. Lojas de Roupas, Calçados & Confecções</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Varejo Físico, Franquias e Atacado de Moda</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Matriz tridimensional de grade, sacola condicional e troca em 1 leitura óptica
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-2xl">
                Elimine planilhas paralelas de tamanhos e cores. Nosso motor controla estoques por coleção, grade aberta ou fechada, gera etiquetas térmicas em padrão Zebra/Argox e sincroniza saldos instantaneamente com seu e-commerce e vendas por WhatsApp.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <strong className="font-semibold text-slate-900 block">
                    Grade Cor × Tamanho
                  </strong>
                  <span className="text-slate-600 mt-1 block">
                    Cadastro em lote do PP ao EXG com código de barras único por variação.
                  </span>
                </div>
                <div>
                  <strong className="font-semibold text-slate-900 block">
                    Malinha & Condicional
                  </strong>
                  <span className="text-slate-600 mt-1 block">
                    Controle de peças enviadas à casa do cliente com cobrança e baixa parcial.
                  </span>
                </div>
                <div>
                  <strong className="font-semibold text-slate-900 block">
                    Giro & Remarcação
                  </strong>
                  <span className="text-slate-600 mt-1 block">
                    Relatório de peças sem giro há 30/60 dias para liquidação cirúrgica.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-slate-500">
                Consulte a equipe sobre recursos fiscais e meios de pagamento
              </span>
              <button
                type="button"
                onClick={() => onSelectSegmentAndScroll('moda')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Ver simulador de Loja de Roupas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Capability 02: Informática & Assistência Técnica (col-span-1) */}
          <div className="p-8 bg-[#F8F8F6] border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-900">02. Informática & Assistência</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Hardware & Lab</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Ordens de serviço blindadas por Número de Série e IMEI
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Controle cada placa de vídeo, notebook ou servidor desde a entrada no balcão até a entrega. Termo de recepção com fotos, histórico de garantia por serial e orçamento aprovado pelo celular do cliente.
              </p>

              <ul className="mt-6 pt-5 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <li>· Rastreio de S/N na compra e na saída para impedir fraudes de garantia</li>
                <li>· Montador de PCs com trava de compatibilidade de placa-mãe, fonte e CPU</li>
                <li>· Consulte a equipe sobre requisitos fiscais da sua operação</li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-slate-500">
                RMA · Bancada · Serial
              </span>
              <button
                type="button"
                onClick={() => onSelectSegmentAndScroll('informatica')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Testar Bancada OS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Capability 03: Salão de Beleza & Estética (col-span-1) */}
          <div className="p-8 bg-[#F8F8F6] border border-slate-200 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-500 mb-3">
                <span className="font-semibold text-slate-900">03. Salão de Beleza & Estética</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Studios & Clínicas</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Comissões automáticas, split fiscal e controle por grama/ml
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                Parametrize regras de comissão com dedução automática de insumos químicos, taxa de maquininha e auxiliares. Adeque sua operação à Lei do Salão Parceiro sem bitributação.
              </p>

              <ul className="mt-6 pt-5 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-700">
                <li>· Agenda multi-profissional com lembrete ativo e redução de faltas</li>
                <li>· Controle de pacotes de sessões estéticas com saldo de retorno</li>
                <li>· Ficha de anamnese e histórico de coloração assinada em tablet</li>
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-slate-500">
                Lei 13.352/16 · Split
              </span>
              <button
                type="button"
                onClick={() => onSelectSegmentAndScroll('beleza')}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Testar Agenda & Split</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Marquee Capability 04: Demais Segmentos Comerciais (col-span-2) */}
          <div className="lg:col-span-2 p-8 bg-slate-900 text-white border border-slate-800 rounded-xl flex flex-col justify-between">
            <div>
              <div className="text-xs text-slate-400 mb-3">
                <span className="font-semibold text-white">04. Demais Segmentos Comerciais, Atacarejo & Distribuição</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span>Autopeças, Material de Construção, Empórios, Óticas e Pet Shops</span>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-wide">
                Arquitetura ERP corporativa com código-fonte dedicado, motor fiscal e integrações sob medida
              </h3>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-2xl">
                Para operações comerciais com regras específicas de formação de preço, múltiplas filiais, vendas externas B2B ou exigências de lote e validade. Entregamos o sistema implantado em nuvem ou servidor local com migração integral do seu banco de dados legado.
              </p>

              <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <strong className="font-semibold text-white block">
                    Tabelas Atacado & Varejo
                  </strong>
                  <span className="text-slate-400 mt-1 block">
                    Gatilhos automáticos por volume, cliente CNPJ, região ou condição de pagamento.
                  </span>
                </div>
                <div>
                  <strong className="font-semibold text-white block">
                    DRE & Fluxo de Caixa Real
                  </strong>
                  <span className="text-slate-400 mt-1 block">
                    Conciliação bancária OFX/API, emissão de boletos híbridos com PIX e centro de custos.
                  </span>
                </div>
                <div>
                  <strong className="font-semibold text-white block">
                    Migração Sem Parada
                  </strong>
                  <span className="text-slate-400 mt-1 block">
                    Importamos cadastros de clientes, produtos, saldos de estoque e histórico financeiro.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono-tabular text-slate-400">
                Consulte a equipe sobre integrações e requisitos fiscais
              </span>
              <button
                type="button"
                onClick={() => onSelectSegmentAndScroll('comercio')}
                className="text-xs font-semibold text-blue-300 hover:text-white flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              >
                <span>Simular Pedido Atacado/Varejo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
