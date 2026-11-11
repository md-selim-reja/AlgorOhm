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
import {
  FieldGalleryItem,
  PilotFormState,
  RobotPlatform,
  Whitepaper,
} from './types/robotics';

export default function App() {
  const [selectedRobotId, setSelectedRobotId] = useState<string>('ohm-x1');
  const [cvHudEnabled, setCvHudEnabled] = useState<boolean>(true);

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

  const handleToggleCvHud = useCallback(() => {
    setCvHudEnabled((prev) => !prev);
  }, []);

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

  // Download Single-File Standalone HTML Bundle
  const handleDownloadStandaloneHtml = useCallback(async () => {
    try {
      const response = await fetch(
        '/assets/aistudio/AlgorOhm-Robotics-Platform_fbd731f9.html'
      );
      if (response.ok) {
        const htmlContent = await response.text();
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'AlgorOhm-Robotics-Platform.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }
    } catch {
      // Fallback to serializing current document if static asset fetch fails
    }

    const serializedHtml = `<!DOCTYPE html>\n${document.documentElement.outerHTML}`;
    const blob = new Blob([serializedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'AlgorOhm-Robotics-Platform.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200 font-sans">
      {/* Accessibility: Skip to Main Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-400 focus:text-slate-950 focus:font-semibold focus:text-xs"
      >
        Skip to main content
      </a>

      {/* Top Sticky Navigation Bar */}
      <Navbar
        cvHudEnabled={cvHudEnabled}
        onToggleCvHud={handleToggleCvHud}
        onDownloadStandaloneHtml={handleDownloadStandaloneHtml}
        onOpenDemoModal={handleOpenDemoModal}
      />

      {/* Semantic Main Content Landmark */}
      <main id="main-content">
        {/* Hero Section & Interactive 2D Inverse Kinematics Workbench */}
        <HeroKinematicBench />

        {/* 01. Flagship Robotic Platforms Grid & 02. Deep Spec Inspector */}
        <PlatformsSection
          selectedRobotId={selectedRobotId}
          onSelectRobot={setSelectedRobotId}
          cvHudEnabled={cvHudEnabled}
          onToggleCvHud={handleToggleCvHud}
          onOpenPilotForRobot={handleOpenPilotForRobot}
        />

        {/* 03. Dual-Core Engineering Stack (Algor Neural OS vs Ohm Hardware Core) */}
        <ArchitectureSection />

        {/* 04. Field Deployment & R&D Lab Optics Gallery */}
        <FieldGallerySection
          cvHudEnabled={cvHudEnabled}
          onToggleCvHud={handleToggleCvHud}
          onOpenLightbox={setLightboxPhoto}
        />

        {/* 05. Live Fleet ROI & Payback Configurator */}
        <RoiConfiguratorSection onExportProposal={handleExportRoiProposal} />

        {/* 06. AlgorOhm Lab Technical Monographs */}
        <ResearchSection onSelectWhitepaper={setSelectedWhitepaper} />
      </main>

      {/* Semantic Footer */}
      <Footer
        onSelectRobot={setSelectedRobotId}
        onDownloadStandaloneHtml={handleDownloadStandaloneHtml}
      />

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
