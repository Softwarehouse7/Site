import React, { useState } from 'react';
import { CASE_STUDIES, ProjectCaseStudy, SegmentKey } from '../data/portfolioData';
import { ArrowUpRight, X, Check } from 'lucide-react';

interface ProjectsShowcaseProps {
  onTestInSimulator: (segment: SegmentKey) => void;
  onRequestQuoteForProject: (project: ProjectCaseStudy) => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({
  onTestInSimulator,
  onRequestQuoteForProject
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'todos' | SegmentKey>('todos');
  const [activeProjectModal, setActiveProjectModal] = useState<ProjectCaseStudy | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const filteredProjects =
    selectedFilter === 'todos'
      ? CASE_STUDIES
      : CASE_STUDIES.filter((item) => item.segment === selectedFilter);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="projetos" className="py-20 border-b border-slate-200/80 bg-[#F8F8F6]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header & Interactive Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-medium text-blue-700 mb-2">
              02. Portfólio de Sistemas Corporativos Entregues
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Projetos desenvolvidos sob medida com impacto auditado
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Conheça sistemas em operação diária em redes de vestuário, laboratórios de informática, salões de estética e distribuidoras comerciais em todo o Brasil.
            </p>
          </div>

          {/* Interactive Filter Controls (Functional Buttons) */}
          <div
            role="group"
            aria-label="Filtrar projetos por segmento"
            className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-200/70 rounded-lg self-start"
          >
            {[
              { id: 'todos', label: 'Todos os Projetos (4)' },
              { id: 'moda', label: 'Lojas de Roupas' },
              { id: 'informatica', label: 'Informática & Lab' },
              { id: 'beleza', label: 'Salão de Beleza' },
              { id: 'comercio', label: 'Demais Comércios' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedFilter(tab.id as 'todos' | SegmentKey)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Case Study Grid (Single-Elevation Depth) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <article
              key={project.id}
              className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between transition-colors hover:border-slate-300"
            >
              <div>
                {/* 4:3 Image Slot with Resilient Fallback */}
                <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden border-b border-slate-200">
                  {!failedImages[project.id] ? (
                    <img
                      src={project.imageUrl}
                      alt={`${project.clientName} - ${project.segmentLabel}`}
                      referrerPolicy="no-referrer"
                      onError={() => handleImageError(project.id)}
                      className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-start justify-end p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
                      <span className="text-xs text-blue-300 font-mono-tabular">
                        {project.segmentLabel}
                      </span>
                      <p className="text-xl font-bold mt-1">{project.clientName}</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-4 left-5 right-5 text-white flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-200">
                        {project.clientName} · {project.location}
                      </p>
                      <p className="text-sm font-semibold font-mono-tabular text-emerald-300 mt-0.5">
                        {project.primaryMetric}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 sm:p-8">
                  {/* Zero-Pill Metadata: Clean unboxed text with typographic separators */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-blue-700">{project.segmentLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span>Implantação em {project.deploymentWeeks} semanas</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">Entregue em {project.deliveryYear}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {project.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {project.summary}
                  </p>

                  {/* Key Delivered Modules Preview */}
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-800 mb-2.5">
                      Principais Módulos Customizados:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {project.modulesDelivered.slice(0, 3).map((mod, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-mono-tabular text-blue-700 font-semibold">
                            0{idx + 1}.
                          </span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Claim-to-Proof Adjacency: Attributable Client Testimonial */}
                  <blockquote className="mt-6 pt-5 border-t border-slate-100">
                    <p className="text-xs text-slate-700 italic leading-relaxed">
                      "{project.testimonial.quote}"
                    </p>
                    <footer className="mt-2 text-xs text-slate-500">
                      <strong className="font-semibold text-slate-900">
                        {project.testimonial.author}
                      </strong>{' '}
                      · {project.testimonial.role} · {project.testimonial.company}
                    </footer>
                  </blockquote>
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProjectModal(project)}
                  className="text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap cursor-pointer"
                >
                  <span>Inspecionar Arquitetura & Ficha Técnica</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onTestInSimulator(project.segment)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Simular Tela
                  </button>
                  <button
                    type="button"
                    onClick={() => onRequestQuoteForProject(project)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors whitespace-nowrap cursor-pointer"
                  >
                    Solicitar Similar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Technical Architecture Inspection Modal */}
      {activeProjectModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs"
        >
          <div className="bg-white border border-slate-200 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between sticky top-0 z-10">
              <div className="text-xs text-slate-300">
                <span>Ficha Técnica de Engenharia</span>
                <span className="mx-2" aria-hidden="true">·</span>
                <span className="text-blue-300 font-semibold">
                  {activeProjectModal.clientName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveProjectModal(null)}
                aria-label="Fechar ficha técnica"
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <div className="text-xs text-slate-500 mb-2">
                  {activeProjectModal.segmentLabel} · {activeProjectModal.location} · Implantação em{' '}
                  {activeProjectModal.deploymentWeeks} semanas
                </div>
                <h3
                  id="modal-project-title"
                  className="text-2xl font-bold text-slate-900 leading-snug"
                >
                  {activeProjectModal.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-y border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 block">Impacto Primário Auditado</span>
                  <strong className="text-base font-bold text-emerald-700 font-mono-tabular mt-0.5 block">
                    {activeProjectModal.primaryMetric}
                  </strong>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Indicador Operacional</span>
                  <strong className="text-base font-bold text-slate-900 font-mono-tabular mt-0.5 block">
                    {activeProjectModal.secondaryMetric}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-2">
                    Cenário Anterior & Gargalo Operacional
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeProjectModal.challenge}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-2">
                    Solução de Engenharia Implementada
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {activeProjectModal.solutionArchitecture}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-900 mb-3">
                  Escopo Completo de Módulos Entregues
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeProjectModal.modulesDelivered.map((mod, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80"
                    >
                      <Check className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span>{mod}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-900">Integrações Homologadas: </span>
                  {activeProjectModal.integrations.join(' · ')}
                </div>
                <div className="font-mono-tabular text-slate-500">
                  Stack: {activeProjectModal.databaseStack}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const seg = activeProjectModal.segment;
                    setActiveProjectModal(null);
                    onTestInSimulator(seg);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Testar Módulo no Simulador
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const proj = activeProjectModal;
                    setActiveProjectModal(null);
                    onRequestQuoteForProject(proj);
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  Solicitar Orçamento Baseado Neste Projeto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
