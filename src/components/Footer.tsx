import React from 'react';
import { Award, Download, Globe, MapPin, ShieldCheck } from 'lucide-react';
import { ROBOT_PLATFORMS } from '../data/roboticsData';
import { AlgorOhmLogo } from './ui/AlgorOhmLogo';

interface FooterProps {
  onSelectRobot: (robotId: string) => void;
  onDownloadStandaloneHtml: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectRobot,
  onDownloadStandaloneHtml,
}) => {
  return (
    <footer className="border-t border-slate-800 bg-[#05070B] py-16 text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <AlgorOhmLogo className="w-9 h-9" />
              <span className="text-xl font-bold tracking-tight text-white font-display">
                ALGOR<span className="text-cyan-400">OHM</span> ROBOTICS
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              AlgorOhm Robotics Inc. engineers vertically integrated embodied physical AI systems
              — combining deterministic edge neural compute with ultra-low impedance
              Silicon-Carbide QDD actuators.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                San Francisco • Zurich • Tokyo
              </span>
              <span>|</span>
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                ISO 10218-1 & ISO 3691-4 Certified
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Robotic Platforms
            </h3>
            <ul className="space-y-2 text-xs">
              {ROBOT_PLATFORMS.map((r) => (
                <li key={r.id}>
                  <a
                    href="#inspector"
                    onClick={() => onSelectRobot(r.id)}
                    className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded"
                  >
                    {r.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Algor × Ohm Stack
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="#architecture"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded"
                >
                  AlgorVLA™ Visuomotor Engine
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded"
                >
                  Ohm-QDD™ Halbach Actuators
                </a>
              </li>
              <li>
                <a
                  href="#architecture"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded"
                >
                  SwarmMesh™ VDA 5050 Fleet
                </a>
              </li>
              <li>
                <a
                  href="#roi-configurator"
                  className="hover:text-cyan-400 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-400 rounded"
                >
                  Enterprise RaaS Calculator
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-white font-semibold mb-3">
              Compliance & Safety
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                <span>SIL-3 / PLd Force Limiting</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span>Zero-Cloud Air-Gapped Option</span>
              </li>
              <li>ROS 2 Jazzy / EtherCAT 10G</li>
              <li>UL 2580 SiC Battery Pack</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div>
            © {new Date().getFullYear()} ALGOROHM ROBOTICS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onDownloadStandaloneHtml}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-400 rounded px-1"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Download Single-File .HTML</span>
            </button>
            <span aria-hidden="true">•</span>
            <span className="text-emerald-400">● TELEMETRY BUS NOMINAL (4.00 kHz)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
