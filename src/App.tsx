/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useCallback, useState } from 'react';
import { ArchitectureSection } from './components/ArchitectureSection';
import { FieldGallerySection } from './components/FieldGallerySection';
import { Footer } from './components/Footer';
import { HeroKinematicBench } from './components/HeroKinematicBench';
import { Modals } from './components/Modals';
import { Navbar } from './components/Navbar';
import { PlatformsSection } from './components/PlatformsSection';
import { ResearchSection } from './components/ResearchSection';
import { RoiConfiguratorSection } from './components/RoiConfiguratorSection';
import { SeoGeoManager } from './components/SeoGeoManager';
import {
  FieldGalleryItem,
  PilotFormState,
  RobotPlatform,
  Whitepaper,
} from './types/robotics';

export default function App() {
  const [selectedRobotId, setSelectedRobotId] = useState<string>('ohm-x1');

  // Modals & Interactive Drawers
  const [demoModalOpen, setDemoModalOpen] = useState<boolean>(false);
  const [selectedWhitepaper, setSelectedWhitepaper] = useState<Whitepaper | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<FieldGalleryItem | null>(null);

  // Pilot Inquiry Form State
  const [pilotForm, setPilotForm] = useState<PilotFormState>({
    name: '',
    email: '',
    company: '',
    platform: 'Ohm-X1 Humanoid',
    environment: 'High-Mix Manufacturing / Cleanroom',
    notes: '',
  });
  const [pilotSubmitted, setPilotSubmitted] = useState<boolean>(false);

  const handleOpenDemoModal = useCallback(() => {
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handleOpenPilotForRobot = useCallback((robot: RobotPlatform) => {
    setPilotForm((prev) => ({
      ...prev,
      platform: robot.name,
      notes: `Requesting technical datasheet, URDF/MuJoCo models, and on-site pilot evaluation for ${robot.name} (${robot.codename}).`,
    }));
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handleExportRoiProposal = useCallback(
    (summary: { recommendedRobot: string; environmentLabel: string; notes: string }) => {
      setPilotForm((prev) => ({
        ...prev,
        platform: summary.recommendedRobot,
        environment: summary.environmentLabel,
        notes: summary.notes,
      }));
      setPilotSubmitted(false);
      setDemoModalOpen(true);
    },
    []
  );

  const handleRequestWhitepaperPdf = useCallback((paper: Whitepaper) => {
    setSelectedWhitepaper(null);
    setPilotForm((prev) => ({
      ...prev,
      notes: `Requesting full PDF & benchmark dataset for monograph: "${paper.title}"`,
    }));
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handleInquireLightboxDeployment = useCallback((photo: FieldGalleryItem) => {
    setLightboxPhoto(null);
    setPilotForm((prev) => ({
      ...prev,
      platform: photo.robotUnit,
      notes: `Inquiry regarding deployment: ${photo.title} (${photo.location})`,
    }));
    setPilotSubmitted(false);
    setDemoModalOpen(true);
  }, []);

  const handlePilotSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPilotSubmitted(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* Non-Visual Dynamic SEO / AEO / GEO Head & JSON-LD Synchronizer */}
      <SeoGeoManager
        selectedRobotId={selectedRobotId}
        selectedWhitepaper={selectedWhitepaper}
        lightboxPhoto={lightboxPhoto}
      />

      {/* Accessibility: Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-400 focus:text-slate-950 focus:font-semibold focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Top Sticky Navigation Bar */}
      <Navbar onOpenDemoModal={handleOpenDemoModal} />

      {/* Semantic Main Content Landmark */}
      <main id="main-content">
        {/* Hero Section & Interactive 2D Inverse Kinematics Workbench */}
        <HeroKinematicBench />

        {/* 01. Flagship Robotic Platforms Grid & 02. Deep Spec Inspector */}
        <PlatformsSection
          selectedRobotId={selectedRobotId}
          onSelectRobot={setSelectedRobotId}
          onOpenPilotForRobot={handleOpenPilotForRobot}
        />

        {/* 03. Dual-Core Engineering Stack (Algor Neural OS vs Ohm Hardware Core) */}
        <ArchitectureSection />

        {/* 04. Field Deployment & R&D Lab Optics Gallery */}
        <FieldGallerySection onOpenLightbox={setLightboxPhoto} />

        {/* 05. Live Fleet ROI & Payback Configurator */}
        <RoiConfiguratorSection onExportProposal={handleExportRoiProposal} />

        {/* 06. AlgorOhm Lab Technical Monographs */}
        <ResearchSection onSelectWhitepaper={setSelectedWhitepaper} />
      </main>

      {/* Semantic Footer */}
      <Footer onSelectRobot={setSelectedRobotId} />

      {/* Accessible Modals (Pilot Evaluation, Whitepaper Reader, High-Res Optics Lightbox) */}
      <Modals
        demoModalOpen={demoModalOpen}
        onCloseDemoModal={() => setDemoModalOpen(false)}
        pilotForm={pilotForm}
        setPilotForm={setPilotForm}
        pilotSubmitted={pilotSubmitted}
        onPilotSubmit={handlePilotSubmit}
        selectedWhitepaper={selectedWhitepaper}
        onCloseWhitepaper={() => setSelectedWhitepaper(null)}
        onRequestWhitepaperPdf={handleRequestWhitepaperPdf}
        lightboxPhoto={lightboxPhoto}
        onCloseLightbox={() => setLightboxPhoto(null)}
        onInquireLightboxDeployment={handleInquireLightboxDeployment}
      />
    </div>
  );
}
