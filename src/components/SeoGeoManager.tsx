import React, { useEffect } from 'react';
import { ROBOT_PLATFORMS } from '../data/roboticsData';
import { FieldGalleryItem, Whitepaper } from '../types/robotics';

interface SeoGeoManagerProps {
  selectedRobotId: string;
  selectedWhitepaper: Whitepaper | null;
  lightboxPhoto: FieldGalleryItem | null;
}

const DEFAULT_TITLE = 'AlgorOhm Robotics — Neural Compute × Physical Actuation';
const DEFAULT_DESCRIPTION =
  'Embodied Physical AI systems fusing deterministic edge neural compute with sub-milliohm Silicon-Carbide QDD actuators for industrial humanoids, AMRs, and precision manipulators.';

/**
 * Non-visual SEO / AEO / GEO head manager.
 * Dynamically synchronizes document.title, meta description, and active entity JSON-LD
 * as users inspect specific robotic platforms or technical monographs, without altering UI.
 */
export const SeoGeoManager: React.FC<SeoGeoManagerProps> = ({
  selectedRobotId,
  selectedWhitepaper,
  lightboxPhoto,
}) => {
  useEffect(() => {
    const activeRobot =
      ROBOT_PLATFORMS.find((r) => r.id === selectedRobotId) || ROBOT_PLATFORMS[0];

    let nextTitle = DEFAULT_TITLE;
    let nextDescription = DEFAULT_DESCRIPTION;

    if (selectedWhitepaper) {
      nextTitle = `${selectedWhitepaper.title} | AlgorOhm Research`;
      nextDescription = selectedWhitepaper.abstract;
    } else if (lightboxPhoto) {
      nextTitle = `${lightboxPhoto.title} (${lightboxPhoto.location}) | AlgorOhm Robotics`;
      nextDescription = lightboxPhoto.caption;
    } else if (activeRobot) {
      nextTitle = `${activeRobot.name} (${activeRobot.specs.peakTorque}, ${activeRobot.specs.computePower}) | AlgorOhm Robotics`;
      nextDescription = `${activeRobot.name}: ${activeRobot.description} Peak Torque: ${activeRobot.specs.peakTorque}, Compute: ${activeRobot.specs.computePower}, Repeatability: ${activeRobot.specs.repeatability}.`;
    }

    document.title = nextTitle;

    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute('content', nextDescription);
    }

    const ogTitleMeta = document.querySelector('meta[property="og:title"]');
    if (ogTitleMeta) {
      ogTitleMeta.setAttribute('content', nextTitle);
    }

    const ogDescMeta = document.querySelector('meta[property="og:description"]');
    if (ogDescMeta) {
      ogDescMeta.setAttribute('content', nextDescription);
    }

    // Inject/update dynamic active-entity JSON-LD script for real-time AEO/GEO inspection
    const scriptId = 'algorohm-dynamic-entity-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const activeEntitySchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': `https://algorohm.robotics/#active-inspector-${activeRobot.id}`,
      name: activeRobot.name,
      category: activeRobot.category,
      description: activeRobot.description,
      image: activeRobot.image,
      brand: {
        '@type': 'Brand',
        name: 'AlgorOhm Robotics',
      },
      additionalProperty: [
        { '@type': 'PropertyValue', name: 'Degrees of Freedom', value: activeRobot.specs.dof },
        { '@type': 'PropertyValue', name: 'Peak Torque', value: activeRobot.specs.peakTorque },
        { '@type': 'PropertyValue', name: 'AI Compute', value: activeRobot.specs.computePower },
        { '@type': 'PropertyValue', name: 'Rated Payload', value: activeRobot.specs.payload },
        {
          '@type': 'PropertyValue',
          name: 'Pose Repeatability',
          value: activeRobot.specs.repeatability,
        },
        {
          '@type': 'PropertyValue',
          name: 'Comms Protocol',
          value: activeRobot.specs.commsProtocol,
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(activeEntitySchema);
  }, [selectedRobotId, selectedWhitepaper, lightboxPhoto]);

  return null;
};
