import React, { useId, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Eye,
  Sliders,
  Zap,
} from 'lucide-react';
import { PLATFORM_CATEGORIES, ROBOT_PLATFORMS } from '../data/roboticsData';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { PlatformCategory, RobotPlatform } from '../types/robotics';
import { ResilientImage } from './ui/ResilientImage';
import { SpotlightCard } from './ui/SpotlightCard';

interface PlatformsSectionProps {
  selectedRobotId: string;
  onSelectRobot: (robotId: string) => void;
  cvHudEnabled: boolean;
  onToggleCvHud: () => void;
  onOpenPilotForRobot: (robot: RobotPlatform) => void;
}

export const PlatformsSection: React.FC<PlatformsSectionProps> = ({
  selectedRobotId,
  onSelectRobot,
  cvHudEnabled,
  onToggleCvHud,
  onOpenPilotForRobot,
}) => {
  const payloadSliderId = useId();
  const dutyCycleSliderId = useId();

  const [activeCategory, setActiveCategory] = useState<PlatformCategory>('All');
  const [simPayloadPct, setSimPayloadPct] = useState<number>(60); // % of max payload
  const [simDutyCycle, setSimDutyCycle] = useState<number>(75); // % duty cycle

  const filteredRobots = useMemo(() => {
    if (activeCategory === 'All') return ROBOT_PLATFORMS;
    return ROBOT_PLATFORMS.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  const selectedRobot = useMemo(
    () => ROBOT_PLATFORMS.find((r) => r.id === selectedRobotId) || ROBOT_PLATFORMS[0],
    [selectedRobotId]
  );

  // Live Runtime & Thermal Estimator for Spec Inspector
  const inspectorSimulation = useMemo(() => {
    const actualPayloadKg = Number(
      ((selectedRobot.specs.maxPayloadKg * simPayloadPct) / 100).toFixed(1)
    );
    const loadFactor =
      0.55 + (simPayloadPct / 100) * 0.45 * (simDutyCycle / 100);
    const estimatedRuntime = Math.max(
      1.8,
      Number((selectedRobot.specs.baseRuntimeHours / loadFactor).toFixed(1))
    );
    const avgPowerDraw = Math.round(selectedRobot.specs.basePowerWatts * loadFactor);
    const statorTempC = Math.round(
      34 + (simPayloadPct / 100) * 26 + (simDutyCycle / 100) * 18
    );
    return { actualPayloadKg, estimatedRuntime, avgPowerDraw, statorTempC };
  }, [selectedRobot, simPayloadPct, simDutyCycle]);

  const animRuntime = useAnimatedNumber(inspectorSimulation.estimatedRuntime, 280, 1);
  const animPowerDraw = useAnimatedNumber(inspectorSimulation.avgPowerDraw, 280, 0);
  const animStatorTemp = useAnimatedNumber(inspectorSimulation.statorTempC, 280, 0);

  return (
    <>
      {/* Flagship Robotic Platforms Grid */}
      <section
        id="platforms"
        aria-labelledby="platforms-heading"
        className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              <Cpu className="w-4 h-4" aria-hidden="true" />
              <span>01. EMBODIED HARDWARE FLEET</span>
            </div>
            <h2
              id="platforms-heading"
              className="text-3xl sm:text-4xl font-bold text-white tracking-tight font-display"
            >
              Production-Grade Autonomous Platforms
            </h2>
            <p className="text-slate-400 mt-2 max-w-2xl">
              Every AlgorOhm unit shares a unified AlgorOS neural kernel and modular Ohm™
              Silicon-Carbide actuators. Select any unit below to load its full kinematic &
              electrical schematic in the Spec Inspector.
            </p>
          </div>

          {/* Category Filter Bar */}
          <div
            role="group"
            aria-label="Filter platforms by category"
            className="flex flex-wrap gap-2"
          >
            {PLATFORM_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
                className={`px-3.5 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                  activeCategory === category
                    ? 'bg-cyan-400 text-slate-950 font-semibold'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Robot Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRobots.map((robot) => {
            const isSelected = robot.id === selectedRobotId;
            return (
              <SpotlightCard
                key={robot.id}
                onClick={() => {
                  onSelectRobot(robot.id);
                  document
                    .getElementById('inspector')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                ariaLabel={`Inspect ${robot.name} specifications`}
                className={`rounded-2xl border cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400/80 bg-[#0B1222]'
                    : 'border-slate-800/90 bg-[#0A0E19]/90 hover:border-slate-700'
                }`}
              >
                {/* High-Resolution Robot Photography Header with Optional Synthetic CV HUD */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950">
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

                  {/* Top Badges */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider bg-slate-950/85 border border-slate-700/80 text-cyan-300 backdrop-blur-md">
                      {robot.codename}
                    </span>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider backdrop-blur-md border ${
                        robot.availability === 'Production Ready'
                          ? 'bg-emerald-950/85 border-emerald-500/40 text-emerald-300'
                          : 'bg-amber-950/85 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      ● {robot.availability}
                    </span>
                  </div>

                  {/* Computer Vision HUD Overlay */}
                  {cvHudEnabled && (
                    <div
                      className="pointer-events-none absolute inset-4 border border-dashed border-cyan-400/60 rounded-lg"
                      aria-hidden="true"
                    >
                      <div className="absolute -top-2.5 left-3 px-1.5 bg-slate-950 text-[10px] font-mono text-cyan-400">
                        {robot.cvBoundingBox} [{robot.cvConfidence}]
                      </div>
                      {robot.cvKeypoints.map((kp) => (
                        <div
                          key={kp.label}
                          style={{ left: `${kp.x}%`, top: `${kp.y}%` }}
                          className="absolute flex items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                        >
                          <span className="w-2.5 h-2.5 rounded-full border border-amber-400 bg-amber-400/30" />
                          <span className="px-1 py-0.5 rounded bg-slate-950/90 text-[9px] font-mono text-amber-300 border border-amber-500/30">
                            {kp.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Title Overlay */}
                  <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                        {robot.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white tracking-tight font-display">
                        {robot.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-2.5 py-1 rounded-md">
                      {isSelected ? 'ACTIVE IN INSPECTOR' : 'INSPECT SPECS'}
                      <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {robot.description}
                  </p>

                  {/* Algor vs Ohm Synergy Pill Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                        ALGOR™ NEURAL ROLE
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {robot.algorRole}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/25">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
                        OHM™ ACTUATION ROLE
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {robot.ohmRole}
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics Footer */}
                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-800/80 text-center">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">PEAK TORQUE</div>
                      <div className="text-xs font-mono font-semibold text-white mt-0.5 tabular-nums">
                        {robot.specs.peakTorque.split(' ')[0]} Nm
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">COMPUTE</div>
                      <div className="text-xs font-mono font-semibold text-cyan-300 mt-0.5 tabular-nums">
                        {robot.specs.computePower.split(' ')[0]} TOPS
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">MAX PAYLOAD</div>
                      <div className="text-xs font-mono font-semibold text-amber-300 mt-0.5 tabular-nums">
                        {robot.specs.maxPayloadKg} kg
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">RUNTIME</div>
                      <div className="text-xs font-mono font-semibold text-emerald-300 mt-0.5 tabular-nums">
                        {robot.specs.baseRuntimeHours} hrs
                      </div>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* Interactive Deep Spec Inspector & Actuator Breakdown */}
      <section
        id="inspector"
        aria-labelledby="inspector-heading"
        className="py-20 bg-[#0A0E18] border-y border-slate-800/90"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
                <Sliders className="w-4 h-4" aria-hidden="true" />
                <span>02. DEEP HARDWARE & IMPEDANCE INSPECTOR</span>
              </div>
              <h2
                id="inspector-heading"
                className="text-3xl font-bold text-white tracking-tight font-display"
              >
                Unit Telemetry & Actuator Datasheet:{' '}
                <span className="text-cyan-400">{selectedRobot.name}</span>
              </h2>
            </div>

            {/* Quick Unit Switcher Tabs */}
            <div
              role="tablist"
              aria-label="Select robot unit for inspection"
              className="flex flex-wrap gap-2"
            >
              {ROBOT_PLATFORMS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedRobotId === r.id}
                  onClick={() => onSelectRobot(r.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-mono transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                    selectedRobotId === r.id
                      ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 font-bold'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Dual Visuals + Highlights */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 relative">
                <ResilientImage
                  src={selectedRobot.image}
                  alt={selectedRobot.name}
                  fallbackLabel={selectedRobot.codename}
                  className="w-full h-72 object-cover"
                />
                <div className="p-4 bg-slate-950/95 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    PRIMARY OPTICAL FEED // {selectedRobot.codename}
                  </span>
                  <span className="text-emerald-400">{selectedRobot.specs.protectionRating}</span>
                </div>
              </div>

              {/* Secondary Detail Sub-Assembly Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  <ResilientImage
                    src={selectedRobot.secondaryImage}
                    alt={`${selectedRobot.name} sub-assembly`}
                    fallbackLabel="OHM_ACTUATOR_STAGE"
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-2.5 text-[11px] font-mono text-slate-400">
                    Internal Ohm™ Actuator & Harness Stage
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                      REPEATABILITY (ISO 9283)
                    </div>
                    <div className="text-2xl font-bold font-mono tabular-nums text-white mt-1">
                      {selectedRobot.specs.repeatability}
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Closed-loop 24-bit BiSS-C dual optical encoders on both motor input and
                      harmonic output ring.
                    </p>
                  </div>
                  <div className="text-[11px] font-mono text-cyan-400 pt-2 border-t border-slate-800">
                    BUS: {selectedRobot.specs.commsProtocol}
                  </div>
                </div>
              </div>

              {/* Key Engineering Highlights */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  ARCHITECTURAL HIGHLIGHTS
                </h3>
                <ul className="space-y-2.5">
                  {selectedRobot.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <CheckCircle2
                        className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Full Specification Grid + Interactive Payload/Runtime Simulator */}
            <div className="lg:col-span-7 space-y-6">
              {/* Specification Matrix */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">
                      Electro-Mechanical & Compute Datasheet
                    </h3>
                    <p className="text-xs text-slate-400">
                      Verified at 25°C ambient under VDA 5050 / ISO 10218-1 test protocols
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                    REV 2026.4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'Degrees of Freedom', value: selectedRobot.specs.dof },
                    { label: 'Peak Joint Torque', value: selectedRobot.specs.peakTorque },
                    { label: 'Onboard AI Compute', value: selectedRobot.specs.computePower },
                    { label: 'Rated Payload', value: selectedRobot.specs.payload },
                    { label: 'Energy & Runtime', value: selectedRobot.specs.batteryRuntime },
                    { label: 'Pose Repeatability', value: selectedRobot.specs.repeatability },
                    { label: 'Operating Envelope', value: selectedRobot.specs.operatingTemp },
                    { label: 'Curb Mass / Chassis', value: selectedRobot.specs.weight },
                    {
                      label: 'Ingress Protection',
                      value: selectedRobot.specs.protectionRating,
                    },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80"
                    >
                      <div className="text-[11px] font-mono text-slate-400">{spec.label}</div>
                      <div className="text-sm font-semibold text-white mt-1 font-mono tabular-nums">
                        {spec.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actuator Joint Breakdown Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                    OHM™ PROPRIOCEPTIVE ACTUATOR BREAKDOWN
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    100 kHz SiC FOC Current Loop
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400 bg-slate-950/60">
                        <th scope="col" className="py-3 px-6">
                          KINEMATIC JOINT GROUP
                        </th>
                        <th scope="col" className="py-3 px-6">
                          OHM™ ACTUATOR MODULE
                        </th>
                        <th scope="col" className="py-3 px-6">
                          PEAK TORQUE / FORCE
                        </th>
                        <th scope="col" className="py-3 px-6">
                          MAX VELOCITY
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70 text-sm">
                      {selectedRobot.actuatorBreakdown.map((row) => (
                        <tr
                          key={row.joint}
                          className="hover:bg-slate-800/30 transition-colors"
                        >
                          <td className="py-3.5 px-6 font-medium text-white">{row.joint}</td>
                          <td className="py-3.5 px-6 font-mono text-cyan-300 text-xs">
                            {row.actuator}
                          </td>
                          <td className="py-3.5 px-6 font-mono text-amber-300 text-xs tabular-nums">
                            {row.torque}
                          </td>
                          <td className="py-3.5 px-6 font-mono text-slate-300 text-xs tabular-nums">
                            {row.speed}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Interactive Mission Payload & Thermal Endurance Simulator */}
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900/95 via-[#0B1324] to-slate-950 p-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" aria-hidden="true" />
                    <h3 className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
                      LIVE PAYLOAD × RUNTIME SIMULATOR ({selectedRobot.name})
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-cyan-300">
                    Interactive Duty-Cycle Model
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono tabular-nums mb-2">
                      <label htmlFor={payloadSliderId} className="text-slate-300">
                        ACTIVE PAYLOAD MASS
                      </label>
                      <span className="text-amber-400 font-bold">
                        {inspectorSimulation.actualPayloadKg} kg ({simPayloadPct}%)
                      </span>
                    </div>
                    <input
                      id={payloadSliderId}
                      type="range"
                      min={10}
                      max={100}
                      step={5}
                      value={simPayloadPct}
                      onChange={(e) => setSimPayloadPct(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono tabular-nums mb-2">
                      <label htmlFor={dutyCycleSliderId} className="text-slate-300">
                        DYNAMIC DUTY CYCLE
                      </label>
                      <span className="text-cyan-400 font-bold">{simDutyCycle}%</span>
                    </div>
                    <input
                      id={dutyCycleSliderId}
                      type="range"
                      min={25}
                      max={100}
                      step={5}
                      value={simDutyCycle}
                      onChange={(e) => setSimDutyCycle(Number(e.target.value))}
                      className="w-full cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/90">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400">
                      EST. CONTINUOUS RUNTIME
                    </div>
                    <div className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-0.5">
                      {animRuntime.toFixed(1)}
                      <span className="text-xs uppercase font-mono text-slate-400 ml-1">
                        hrs
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400">AVG BUS POWER DRAW</div>
                    <div className="text-xl font-bold font-mono tabular-nums text-cyan-300 mt-0.5">
                      {animPowerDraw}
                      <span className="text-xs uppercase font-mono text-slate-400 ml-1">
                        W
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[10px] font-mono text-slate-400">STEADY STATOR TEMP</div>
                    <div
                      className={`text-xl font-bold font-mono tabular-nums mt-0.5 ${
                        inspectorSimulation.statorTempC > 68
                          ? 'text-amber-400'
                          : 'text-sky-300'
                      }`}
                    >
                      {animStatorTemp}
                      <span className="text-xs uppercase font-mono text-slate-400 ml-1">
                        °C
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Pilot CTA for Currently Inspected Robot */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-300">
                    Ready to benchmark{' '}
                    <strong className="text-white">{selectedRobot.name}</strong> on your
                    facility floor?
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenPilotForRobot(selectedRobot)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold uppercase bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-300"
                  >
                    <span>Reserve {selectedRobot.name} Pilot</span>
                    <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>

                {/* Vision HUD Quick Toggle Reminder */}
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>
                    Synthetic keypoint overlays are currently{' '}
                    <strong className="text-cyan-300">
                      {cvHudEnabled ? 'ENABLED' : 'DISABLED'}
                    </strong>
                    .
                  </span>
                  <button
                    type="button"
                    onClick={onToggleCvHud}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" aria-hidden="true" />
                    <span>{cvHudEnabled ? 'Hide Vision HUD' : 'Show Vision HUD'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
