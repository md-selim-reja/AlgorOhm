import React, { useEffect, useId, useRef, useState } from 'react';
import {
  ChevronRight,
  Crosshair,
  Gauge,
  Pause,
  Play,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { SimMode, TelemetryState } from '../types/robotics';

export const HeroKinematicBench: React.FC = () => {
  const reachSliderId = useId();
  const elevationSliderId = useId();
  const payloadSliderId = useId();

  // Interactive Kinematic Telemetry Bench State
  const [simRunning, setSimRunning] = useState(true);
  const [autoPathMode, setAutoPathMode] = useState(false);
  const [simMode, setSimMode] = useState<SimMode>('kinematic');
  const [targetReach, setTargetReach] = useState(68); // %
  const [targetElevation, setTargetElevation] = useState(44); // %
  const [payloadMass, setPayloadMass] = useState(14); // kg

  const [telemetry, setTelemetry] = useState<TelemetryState>({
    j1Angle: 34.2,
    j2Angle: -61.8,
    j3Angle: 27.6,
    shoulderTorque: 118.4,
    elbowTorque: 64.2,
    busCurrent: 19.6,
    busImpedance: 0.082,
    loopLatency: 0.24,
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const physicsRef = useRef({
    currX: 68,
    currY: 44,
    velX: 0,
    velY: 0,
    trail: [] as { x: number; y: number }[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId = 0;
    let startTime = performance.now();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      const W = rect.width;
      const H = rect.height;

      // Clear background
      ctx.fillStyle = '#070A12';
      ctx.fillRect(0, 0, W, H);

      // Draw subtle polar & cartesian coordinate grid
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.06)';
      ctx.lineWidth = 1;
      const gridStep = 32;
      for (let x = 0; x < W; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Base pedestal origin
      const baseX = W * 0.23;
      const baseY = H * 0.78;

      // Draw workspace reach envelope arcs
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.14)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(baseX, baseY, Math.min(W, H) * 0.62, -Math.PI * 0.85, Math.PI * 0.05);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compute dynamic target with spring-damper physics
      const phys = physicsRef.current;
      const desiredX =
        autoPathMode && simRunning && !prefersReducedMotion
          ? 60 + Math.sin(elapsed * 1.5) * 18
          : targetReach;
      const desiredY =
        autoPathMode && simRunning && !prefersReducedMotion
          ? 44 + Math.sin(elapsed * 3.0) * 16
          : targetElevation;

      if (simRunning && !prefersReducedMotion) {
        const stiffness = 0.085;
        const damping = 0.78;
        const forceX = (desiredX - phys.currX) * stiffness;
        const forceY = (desiredY - phys.currY) * stiffness;
        phys.velX = (phys.velX + forceX) * damping;
        phys.velY = (phys.velY + forceY) * damping;
        phys.currX += phys.velX;
        phys.currY += phys.velY;
      } else if (prefersReducedMotion) {
        phys.currX = desiredX;
        phys.currY = desiredY;
      }

      const breathe =
        simRunning && !prefersReducedMotion ? Math.sin(elapsed * 2.2) * 3.2 : 0;
      const targetX = W * (0.28 + (phys.currX / 100) * 0.56);
      const targetY = H * (0.82 - (phys.currY / 100) * 0.64) + breathe;

      // Record end-effector trajectory ribbon
      if (simRunning && !prefersReducedMotion) {
        phys.trail.push({ x: targetX, y: targetY });
        if (phys.trail.length > 38) phys.trail.shift();
      }

      // 2-Link + Wrist Analytical Inverse Kinematics
      const L1 = Math.min(W, H) * 0.33;
      const L2 = Math.min(W, H) * 0.29;
      const dx = targetX - baseX;
      const dy = targetY - baseY;
      const dist = Math.min(Math.hypot(dx, dy), L1 + L2 - 4);
      const angleToTarget = Math.atan2(dy, dx);

      const cosAngle1 = Math.max(
        -1,
        Math.min(1, (dist * dist + L1 * L1 - L2 * L2) / (2 * dist * L1))
      );
      const theta1 = angleToTarget - Math.acos(cosAngle1);

      const elbowX = baseX + L1 * Math.cos(theta1);
      const elbowY = baseY + L1 * Math.sin(theta1);

      const theta2 = Math.atan2(targetY - elbowY, targetX - elbowX);
      const wristX = elbowX + L2 * Math.cos(theta2);
      const wristY = elbowY + L2 * Math.sin(theta2);

      // Mode-specific visual overlays
      if (simMode === 'lidar') {
        // LiDAR scan cone from wrist sensor
        const scanAngle =
          (simRunning && !prefersReducedMotion ? elapsed * 1.8 : 0.8) % (Math.PI * 2);
        const grad = ctx.createRadialGradient(wristX, wristY, 8, wristX, wristY, 170);
        grad.addColorStop(0, 'rgba(34, 211, 238, 0.28)');
        grad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(wristX, wristY);
        ctx.arc(wristX, wristY, 170, scanAngle - 0.45, scanAngle + 0.45);
        ctx.closePath();
        ctx.fill();

        // Synthetic voxel point cloud hits
        for (let i = 0; i < 28; i++) {
          const px = W * 0.68 + Math.cos(i * 1.7 + elapsed * 0.4) * 55;
          const py = H * 0.45 + Math.sin(i * 2.3) * 65;
          ctx.fillStyle = i % 3 === 0 ? '#F59E0B' : '#22D3EE';
          ctx.fillRect(px, py, 3, 3);
        }
      } else if (simMode === 'neural') {
        // Neural trajectory spline proposals
        for (let k = -2; k <= 2; k++) {
          ctx.strokeStyle =
            k === 0 ? 'rgba(34, 211, 238, 0.65)' : 'rgba(148, 163, 184, 0.18)';
          ctx.lineWidth = k === 0 ? 2 : 1;
          ctx.beginPath();
          ctx.moveTo(baseX, baseY);
          ctx.quadraticCurveTo(
            elbowX + k * 22,
            elbowY - Math.abs(k) * 18,
            wristX,
            wristY
          );
          ctx.stroke();
        }
      }

      // Draw End-Effector Motion Trail Ribbon
      if (phys.trail.length > 2) {
        ctx.beginPath();
        for (let i = 0; i < phys.trail.length; i++) {
          const pt = phys.trail[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.28)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Draw Pedestal Base
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(baseX - 34, baseY, 68, 22, 4);
      ctx.fill();
      ctx.stroke();

      // Draw Link 1 (Base to Elbow)
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(elbowX, elbowY);
      ctx.stroke();

      // Draw Link 2 (Elbow to Wrist)
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(elbowX, elbowY);
      ctx.lineTo(wristX, wristY);
      ctx.stroke();

      // Draw Ohm QDD Actuator Rings at Joints
      const joints = [
        { x: baseX, y: baseY, r: 14, color: '#F59E0B', label: 'J1: OHM-QDD-140' },
        { x: elbowX, y: elbowY, r: 12, color: '#22D3EE', label: 'J2: OHM-QDD-90' },
        { x: wristX, y: wristY, r: 9, color: '#10B981', label: 'TCP: FORCE-6D' },
      ];

      joints.forEach((j) => {
        ctx.fillStyle = '#090D16';
        ctx.strokeStyle = j.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(j.x, j.y, j.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Label callout
        ctx.fillStyle = 'rgba(226, 232, 240, 0.88)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(j.label, j.x + 16, j.y - 10);
      });

      // Draw Target Reticle & Payload Vector
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(targetX, targetY, 16, 0, Math.PI * 2);
      ctx.stroke();

      // Gravity load vector arrow proportional to payloadMass
      const arrowLen = 18 + payloadMass * 1.1;
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wristX, wristY);
      ctx.lineTo(wristX, wristY + arrowLen);
      ctx.lineTo(wristX - 4, wristY + arrowLen - 6);
      ctx.moveTo(wristX, wristY + arrowLen);
      ctx.lineTo(wristX + 4, wristY + arrowLen - 6);
      ctx.stroke();

      ctx.fillStyle = '#FDA4AF';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(
        `F_g: ${(payloadMass * 9.81).toFixed(1)} N`,
        wristX + 8,
        wristY + arrowLen
      );

      ctx.restore();

      // Update numeric telemetry every ~12 frames
      if (Math.floor(elapsed * 60) % 10 === 0) {
        const deg1 = Number(((theta1 * 180) / Math.PI).toFixed(1));
        const deg2 = Number((((theta2 - theta1) * 180) / Math.PI).toFixed(1));
        const shTorque = Number(
          (42 + payloadMass * 4.8 + (targetReach / 100) * 35).toFixed(1)
        );
        const elTorque = Number(
          (21 + payloadMass * 2.6 + (targetReach / 100) * 18).toFixed(1)
        );
        const current = Number((shTorque / 8.2).toFixed(1));

        setTelemetry({
          j1Angle: deg1,
          j2Angle: deg2,
          j3Angle: Number((-deg1 - deg2).toFixed(1)),
          shoulderTorque: shTorque,
          elbowTorque: elTorque,
          busCurrent: current,
          busImpedance: Number((0.078 + payloadMass * 0.0004).toFixed(3)),
          loopLatency: Number((0.22 + Math.sin(elapsed) * 0.02).toFixed(2)),
        });
      }

      if (simRunning && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(renderFrame);
      }
    };

    animationFrameId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [simRunning, autoPathMode, simMode, targetReach, targetElevation, payloadMass]);

  const handleCanvasPointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const reachPct = Math.round(
      Math.max(35, Math.min(85, ((clickX / rect.width - 0.28) / 0.56) * 100))
    );
    const elevPct = Math.round(
      Math.max(18, Math.min(72, ((0.82 - clickY / rect.height) / 0.64) * 100))
    );
    setAutoPathMode(false);
    setTargetReach(reachPct);
    setTargetElevation(elevPct);
  };

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-slate-800/80 bg-tech-grid pt-10 pb-20 lg:pt-16 lg:pb-24"
    >
      {/* Ambient Radial Backlights */}
      <div
        className="pointer-events-none absolute -top-40 left-1/4 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-20 right-10 w-[420px] h-[420px] rounded-full bg-amber-500/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-md border border-cyan-500/30 bg-cyan-950/30 text-cyan-300 text-xs font-mono">
              <span className="text-emerald-400" aria-hidden="true">
                ●
              </span>
              <span>ALGOROS 4.2 + OHM-QDD SILICON-CARBIDE ACTUATION</span>
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.06] font-display"
            >
              Where{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-sky-500">
                Algorithmic
              </span>{' '}
              Intelligence Meets{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-500">
                Physical Resistance.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
              AlgorOhm engineers vertically integrated embodied AI systems. By fusing{' '}
              <strong className="text-cyan-300 font-medium">
                deterministic 4 kHz visuomotor neural policies (Algor)
              </strong>{' '}
              with{' '}
              <strong className="text-amber-300 font-medium">
                sub-milliohm Quasi-Direct Drive actuators (Ohm)
              </strong>
              , our humanoids, AMRs, and manipulators master contact-rich industrial worlds.
            </p>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#platforms"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                <span>Explore Robotic Fleet</span>
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm border border-slate-700 bg-slate-900/80 text-slate-200 hover:border-cyan-500/50 hover:text-white transition-all focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <Sliders className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span>Inspect Algor × Ohm Stack</span>
              </a>
            </div>

            {/* Live Engineering KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
              {[
                {
                  label: 'PEAK JOINT TORQUE',
                  val: '380',
                  unit: 'Nm',
                  sub: 'Ohm-QDD-140 Stator',
                  tone: 'text-amber-400',
                },
                {
                  label: 'ONBOARD AI COMPUTE',
                  val: '550',
                  unit: 'TOPS',
                  sub: 'Dual Algor-NPU FP8',
                  tone: 'text-cyan-400',
                },
                {
                  label: 'PHASE RESISTANCE',
                  val: '0.078',
                  unit: 'mΩ',
                  sub: 'SiC 100kHz Inverter',
                  tone: 'text-emerald-400',
                },
                {
                  label: 'POSE REPEATABILITY',
                  val: '±0.015',
                  unit: 'mm',
                  sub: 'ISO 9283 Verified',
                  tone: 'text-sky-400',
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/90"
                >
                  <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                    {kpi.label}
                  </div>
                  <div className={`text-xl font-bold font-mono tabular-nums mt-0.5 ${kpi.tone}`}>
                    {kpi.val}
                    <span className="text-xs uppercase font-mono text-slate-400 ml-1">
                      {kpi.unit}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{kpi.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero: Interactive Inverse Kinematics & Ohm Impedance Workbench */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-slate-800 bg-[#0A0E1A]/95 overflow-hidden">
              {/* Top Console Bar */}
              <div className="px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-emerald-400" aria-hidden="true">
                    ●
                  </span>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    ALGOR-IK LIVE TELEMETRY BENCH // 4.0 KHZ
                  </span>
                </div>
                <div
                  role="group"
                  aria-label="Simulation Visualization Mode"
                  className="flex items-center gap-1.5"
                >
                  {(
                    [
                      { id: 'kinematic', label: 'Torque & Ohm' },
                      { id: 'lidar', label: 'LiDAR Cloud' },
                      { id: 'neural', label: 'Neural Spline' },
                    ] as const
                  ).map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSimMode(mode.id)}
                      aria-pressed={simMode === mode.id}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                        simMode === mode.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interactive HTML5 Canvas */}
              <div className="relative h-72 sm:h-80 w-full bg-[#070A12]">
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasPointerDown}
                  aria-label="Interactive 2D robotic arm inverse kinematics simulator. Click or tap anywhere in the workspace to command the end-effector target."
                  role="img"
                  className="w-full h-full block cursor-crosshair"
                />

                {/* Floating Live Telemetry Readout Overlay */}
                <div className="pointer-events-none absolute top-3 left-3 right-3 flex flex-wrap items-start justify-between gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-950/85 border border-slate-800/90 backdrop-blur-md text-[11px] font-mono tabular-nums space-y-1">
                    <div className="text-cyan-400 font-semibold">ALGOR KINEMATIC SOLVER</div>
                    <div className="text-slate-300">
                      J1: <span className="text-white">{telemetry.j1Angle.toFixed(1)}°</span> | J2:{' '}
                      <span className="text-white">{telemetry.j2Angle.toFixed(1)}°</span>
                    </div>
                    <div className="text-slate-400">
                      Loop Latency:{' '}
                      <span className="text-emerald-400">
                        {telemetry.loopLatency.toFixed(2)} ms
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/85 border border-slate-800/90 backdrop-blur-md text-[11px] font-mono tabular-nums space-y-1 text-right">
                    <div className="text-amber-400 font-semibold">OHM STATOR BUS (48V SiC)</div>
                    <div className="text-slate-300">
                      τ_shoulder:{' '}
                      <span className="text-amber-300">
                        {telemetry.shoulderTorque.toFixed(1)} Nm
                      </span>
                    </div>
                    <div className="text-slate-400">
                      I_phase: <span className="text-white">{telemetry.busCurrent.toFixed(1)} A</span>{' '}
                      | R_φ:{' '}
                      <span className="text-emerald-400">
                        {telemetry.busImpedance.toFixed(3)} mΩ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Canvas Hint & Action Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="px-2.5 py-1 rounded bg-slate-950/85 border border-slate-800 text-[10px] font-mono text-slate-400">
                    TIP: CLICK WORKSPACE TO COMMAND END-EFFECTOR TARGET
                  </span>
                  <div className="flex items-center gap-1.5 pointer-events-auto">
                    <button
                      type="button"
                      onClick={() => setAutoPathMode((prev) => !prev)}
                      aria-pressed={autoPathMode}
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-mono border transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 ${
                        autoPathMode
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                          : 'bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                    >
                      <Crosshair className="w-3 h-3" aria-hidden="true" />
                      {autoPathMode ? 'Auto Figure-8: ON' : 'Auto Path'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSimRunning((prev) => !prev)}
                      aria-pressed={!simRunning}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300 hover:text-white hover:border-cyan-500/50 cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400"
                    >
                      {simRunning ? (
                        <Pause className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                      )}
                      {simRunning ? 'Freeze Solver' : 'Resume Solver'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Sliders Control Panel */}
              <div className="p-4 bg-slate-950/90 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-mono tabular-nums mb-1.5">
                    <label htmlFor={reachSliderId} className="text-slate-400">
                      TARGET REACH (X)
                    </label>
                    <span className="text-cyan-400">{targetReach}%</span>
                  </div>
                  <input
                    id={reachSliderId}
                    type="range"
                    min={35}
                    max={85}
                    value={targetReach}
                    onChange={(e) => {
                      setAutoPathMode(false);
                      setTargetReach(Number(e.target.value));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono tabular-nums mb-1.5">
                    <label htmlFor={elevationSliderId} className="text-slate-400">
                      ELEVATION (Z)
                    </label>
                    <span className="text-cyan-400">{targetElevation}%</span>
                  </div>
                  <input
                    id={elevationSliderId}
                    type="range"
                    min={18}
                    max={72}
                    value={targetElevation}
                    onChange={(e) => {
                      setAutoPathMode(false);
                      setTargetElevation(Number(e.target.value));
                    }}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono tabular-nums mb-1.5">
                    <label htmlFor={payloadSliderId} className="text-slate-400">
                      PAYLOAD MASS (Ω)
                    </label>
                    <span className="text-amber-400">{payloadMass} kg</span>
                  </div>
                  <input
                    id={payloadSliderId}
                    type="range"
                    min={1}
                    max={35}
                    value={payloadMass}
                    onChange={(e) => setPayloadMass(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Reset & Quick Pose Preset Bar */}
              <div className="px-4 py-2.5 bg-[#060911] border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>SPRING-DAMPER IMPEDANCE: K_p = 450 Nm/rad | K_d = 28 Nm·s/rad</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAutoPathMode(false);
                    setTargetReach(68);
                    setTargetElevation(44);
                    setPayloadMass(14);
                  }}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-cyan-400 rounded px-1"
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  <span>Home Pose</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
