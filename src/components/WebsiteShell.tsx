import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  Cpu,
  Factory,
  FileText,
  Home,
  Layers,
  Sliders,
} from 'lucide-react';
import {
  ARCHITECTURE_STACK,
  FIELD_GALLERY,
  ROBOT_PLATFORMS,
  WHITEPAPERS,
} from '../data/roboticsData';
import { WebsitePageId } from '../types/robotics';
import { WEBSITE_NAV_ITEMS } from './Navbar';
import { ResilientImage } from './ui/ResilientImage';
import { SpotlightCard } from './ui/SpotlightCard';

interface PageSubheaderProps {
  activePage: WebsitePageId;
  onNavigate: (page: WebsitePageId) => void;
}

const PAGE_METADATA: Record<
  Exclude<WebsitePageId, 'home'>,
  {
    code: string;
    category: string;
    title: string;
    summary: string;
  }
> = {
  platforms: {
    code: '01',
    category: 'EMBODIED HARDWARE FLEET',
    title: 'Production-Grade Autonomous Platforms',
    summary:
      'Explore our 4 flagship autonomous systems sharing the AlgorOS 4.2 kernel and Ohm™ Silicon-Carbide QDD actuators.',
  },
  inspector: {
    code: '02',
    category: 'DEEP HARDWARE & IMPEDANCE INSPECTOR',
    title: 'Unit Telemetry, Actuator Breakdown & Thermal Simulator',
    summary:
      'Interactive electro-mechanical datasheets, 100 kHz SiC FOC joint tables, and live payload × duty-cycle runtime modeling.',
  },
  architecture: {
    code: '03',
    category: 'VERTICALLY INTEGRATED ARCHITECTURE',
    title: 'The Algor™ × Ohm™ Dual-Core Stack',
    summary:
      'Deterministic 4.0 kHz visuomotor neural compute paired with sub-milliohm Halbach QDD stators.',
  },
  'field-gallery': {
    code: '04',
    category: 'FIELD DEPLOYMENT & R&D LAB OPTICS',
    title: 'Cleanroom, Gigafactory & Thermal Validation Feeds',
    summary:
      'Verified production telemetry from ISO Class 3 semiconductor fabs, EV body-in-white cells, and stator torture benches.',
  },
  'roi-configurator': {
    code: '05',
    category: 'ENTERPRISE DEPLOYMENT & TELEMETRY ROI SIMULATOR',
    title: 'Interactive Fleet Payback & Throughput Configurator',
    summary:
      'Model capital payback months, 5-year net cumulative OPEX savings, and shift throughput across industrial sectors.',
  },
  research: {
    code: '06',
    category: 'ALGOROHM LAB TECHNICAL MONOGRAPHS',
    title: 'Peer-Reviewed Benchmarks & Whitepapers',
    summary:
      'Publications from our Zurich, Boston, and San Francisco R&D hubs on VLA impedance control, SiC stators, and VDA 5050 swarms.',
  },
};

export const PageBreadcrumbBar: React.FC<PageSubheaderProps> = ({
  activePage,
  onNavigate,
}) => {
  if (activePage === 'home') return null;

  const currentIdx = WEBSITE_NAV_ITEMS.findIndex((item) => item.id === activePage);
  const nextItem =
    WEBSITE_NAV_ITEMS[(currentIdx + 1) % WEBSITE_NAV_ITEMS.length] || WEBSITE_NAV_ITEMS[0];
  const meta = PAGE_METADATA[activePage];

  return (
    <div className="border-b border-slate-800/90 bg-[#0A0E18]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 rounded px-1"
          >
            <Home className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span>OVERVIEW</span>
          </button>
          <span className="text-slate-600" aria-hidden="true">
            /
          </span>
          <span className="text-amber-400 font-semibold">{meta.code}</span>
          <span className="text-slate-200 truncate max-w-[200px] sm:max-w-none">
            {meta.category}
          </span>
        </nav>

        {/* Quick Page Switcher */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" aria-hidden="true" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(nextItem.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors cursor-pointer"
          >
            <span>Next: {nextItem.label}</span>
            <ArrowRight className="w-3 h-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const PagePaginationFooter: React.FC<PageSubheaderProps> = ({
  activePage,
  onNavigate,
}) => {
  const currentIdx = WEBSITE_NAV_ITEMS.findIndex((item) => item.id === activePage);
  const prevItem =
    WEBSITE_NAV_ITEMS[
      (currentIdx - 1 + WEBSITE_NAV_ITEMS.length) % WEBSITE_NAV_ITEMS.length
    ];
  const nextItem = WEBSITE_NAV_ITEMS[(currentIdx + 1) % WEBSITE_NAV_ITEMS.length];

  return (
    <section
      aria-label="Website Page Navigation"
      className="border-t border-slate-800/90 bg-[#080C15] py-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onNavigate(prevItem.id)}
            className="group p-5 rounded-2xl border border-slate-800/90 bg-slate-900/50 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors shrink-0">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  PREVIOUS SECTION // {prevItem.code}
                </div>
                <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display truncate">
                  {prevItem.label}
                </div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(nextItem.id)}
            className="group p-5 rounded-2xl border border-slate-800/90 bg-slate-900/50 hover:border-cyan-500/40 hover:bg-slate-900/90 transition-all text-right flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                CONTINUE EXPLORING // {nextItem.code}
              </div>
              <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors font-display truncate">
                {nextItem.label}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shrink-0">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

interface HomeOverviewPortalProps {
  selectedRobotId: string;
  onSelectRobotAndInspect: (robotId: string) => void;
  onNavigate: (page: WebsitePageId) => void;
}

/**
 * Home Page Executive Teaser Portal:
 * Preserves the exact visual identity, typography, cards, and engineering content
 * as curated teasers that link into each dedicated page of the website.
 */
export const HomeOverviewPortal: React.FC<HomeOverviewPortalProps> = ({
  selectedRobotId,
  onSelectRobotAndInspect,
  onNavigate,
}) => {
  return (
    <div className="divide-y divide-slate-800/90">
      {/* Teaser 01 & 02: Flagship Fleet Preview + Direct Spec Inspector Launch */}
      <section
        aria-labelledby="home-fleet-teaser-heading"
        className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              <Cpu className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>01. EMBODIED HARDWARE FLEET // EXECUTIVE TEASER</span>
            </div>
            <h2
              id="home-fleet-teaser-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight font-display"
            >
              Production-Grade Autonomous Platforms
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-2xl">
              Every AlgorOhm unit shares a unified AlgorOS neural kernel and modular Ohm™
              Silicon-Carbide actuators. Select any platform to open its full datasheet in the Spec
              Inspector or browse the dedicated Platforms catalog.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('platforms')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono font-semibold uppercase bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer"
            >
              <span>Open Platforms Page</span>
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('inspector')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-mono border border-slate-700 bg-slate-900/90 text-slate-200 hover:border-cyan-500/50 hover:text-white transition-all cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>Open Spec Inspector</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ROBOT_PLATFORMS.map((robot) => {
            const isSelected = robot.id === selectedRobotId;
            return (
              <SpotlightCard
                key={robot.id}
                onClick={() => onSelectRobotAndInspect(robot.id)}
                ariaLabel={`Open ${robot.name} in Spec Inspector`}
                className={`rounded-2xl border cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400/80 bg-[#0B1222]'
                    : 'border-slate-800/90 bg-[#0A0E19]/90 hover:border-slate-700'
                }`}
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <ResilientImage
                    src={robot.image}
                    alt={`${robot.name} — ${robot.tagline}`}
                    fallbackLabel={robot.cvBoundingBox}
                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-[#0A0E19] via-[#0A0E19]/35 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono uppercase bg-slate-950/85 border border-slate-700 text-cyan-300 truncate">
                      {robot.codename}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-3.5 right-3.5">
                    <span className="block text-[10px] font-mono text-amber-400 uppercase truncate">
                      {robot.category}
                    </span>
                    <h3 className="text-lg font-bold text-white font-display truncate">
                      {robot.name}
                    </h3>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {robot.tagline}
                  </p>
                  <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono tabular-nums">
                      <div>
                        <span className="text-slate-400 block text-[9px]">PEAK TORQUE</span>
                        <span className="text-white font-semibold">
                          {robot.specs.peakTorque.split(' ')[0]} Nm
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">AI COMPUTE</span>
                        <span className="text-cyan-300 font-semibold">
                          {robot.specs.computePower.split(' ')[0]} TOPS
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 pt-1">
                      <span>Inspect Datasheet</span>
                      <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Teaser 03, 04, 05, 06: Website Section Directory Grid */}
      <section
        aria-labelledby="home-directory-heading"
        className="py-16 sm:py-20 bg-[#0A0E18]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
              <Layers className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>ENGINEERING PORTAL // DEDICATED WEBSITE SECTIONS</span>
            </div>
            <h2
              id="home-directory-heading"
              className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display"
            >
              Explore the AlgorOhm Technical Architecture & Benchmarks
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 03. Dual-Core Stack Teaser Card */}
            <SpotlightCard
              onClick={() => onNavigate('architecture')}
              ariaLabel="Navigate to Algor × Ohm Dual-Core Stack page"
              className="rounded-2xl border border-cyan-500/35 bg-gradient-to-b from-cyan-950/20 via-slate-900/80 to-slate-950 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 uppercase tracking-wider">
                      03. VERTICALLY INTEGRATED ARCHITECTURE
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      8 CORE MODULES
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    The Algor™ × Ohm™ Dual-Core Stack
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {ARCHITECTURE_STACK.algor.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {ARCHITECTURE_STACK.algor.metrics.slice(0, 2).map((m) => (
                      <div
                        key={m.label}
                        className="p-2.5 rounded-xl bg-slate-950/85 border border-slate-800"
                      >
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {m.label}
                        </div>
                        <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5 tabular-nums">
                          {m.value}
                        </div>
                      </div>
                    ))}
                    {ARCHITECTURE_STACK.ohm.metrics.slice(0, 2).map((m) => (
                      <div
                        key={m.label}
                        className="p-2.5 rounded-xl bg-slate-950/85 border border-slate-800"
                      >
                        <div className="text-[10px] font-mono text-slate-400 truncate">
                          {m.label}
                        </div>
                        <div className="text-sm font-bold font-mono text-amber-300 mt-0.5 tabular-nums">
                          {m.value}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Explore AlgorOS & Ohm™ Hardware Stack</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* 04. Field Deployment Optics Teaser Card */}
            <SpotlightCard
              onClick={() => onNavigate('field-gallery')}
              ariaLabel="Navigate to Field Deployment and R&D Lab Optics page"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Factory className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>04. FIELD DEPLOYMENT OPTICS</span>
                    </span>
                    <span className="text-emerald-400">4 LIVE SITES</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Cleanrooms, Gigafactories & Thermal Benches
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Inspect optical feeds from Dresden ISO Class 3 wafer fabs, Stuttgart EV
                    body-in-white spot welding lines, and Zurich 2,400W stator dynamometer labs.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {FIELD_GALLERY.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950"
                      >
                        <ResilientImage
                          src={item.image}
                          alt={item.title}
                          fallbackLabel={item.telemetryTag}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2 text-[10px] font-mono text-slate-300 truncate">
                          {item.location}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Open Full Field Optics Gallery</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* 05. Fleet ROI Configurator Teaser Card */}
            <SpotlightCard
              onClick={() => onNavigate('roi-configurator')}
              ariaLabel="Navigate to Enterprise Fleet ROI Simulator page"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>05. FLEET ROI SIMULATOR</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                      RaaS & CAPEX
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Interactive Fleet Payback & Throughput Calculator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Configure autonomous unit count, daily shift operations, and facility square
                    footage across Semiconductor, Aerospace, 3PL Logistics, and Offshore Energy.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">AVG PAYBACK</div>
                      <div className="text-base font-bold font-mono text-amber-400 mt-0.5 tabular-nums">
                        3.5–8.2 mos
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">THROUGHPUT</div>
                      <div className="text-base font-bold font-mono text-cyan-400 mt-0.5 tabular-nums">
                        +34% to +52%
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/85 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">UPTIME</div>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-0.5 tabular-nums">
                        99.998%
                      </div>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Launch Interactive ROI Simulator</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>

            {/* 06. Technical Monographs Teaser Card */}
            <SpotlightCard
              onClick={() => onNavigate('research')}
              ariaLabel="Navigate to AlgorOhm Lab Technical Monographs page"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 p-6 cursor-pointer"
            >
              <div className="flex flex-col justify-between h-full space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>06. ALGOROHM LAB MONOGRAPHS</span>
                    </span>
                    <span className="text-slate-400">3 PEER-REVIEWED PAPERS</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white font-display">
                    Peer-Reviewed Benchmarks & Whitepapers
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Read executive briefs from our Zurich, Boston, and San Francisco research teams
                    on VLA impedance control, sub-milliohm stators, and VDA 5050 swarm consensus.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {WHITEPAPERS.map((wp) => (
                      <div
                        key={wp.id}
                        className="p-2.5 rounded-xl bg-slate-950/85 border border-slate-800 flex items-center justify-between gap-3"
                      >
                        <span className="text-xs text-slate-200 font-medium truncate">
                          {wp.title}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 shrink-0">
                          {wp.benchmarkDelta}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-cyan-300">
                    <span>Read Technical Monographs</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>
    </div>
  );
};
