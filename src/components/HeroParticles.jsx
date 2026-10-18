import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import './HeroParticles.css';

// The registry component is kept verbatim. Website-specific event routing lives here.
const Antigravity = lazy(() => import('./Antigravity/Antigravity'));

class ParticleBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function HeroParticles({ heroRef, enabled }) {
  const layer = useRef(null);
  const [supportsWebGL, setSupportsWebGL] = useState(false);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    setSupportsWebGL(Boolean(context));
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !enabled || !supportsWebGL) return;
    function forwardPointer(event) {
      if (layer.current?.contains(event.target)) return;
      const canvas = layer.current?.querySelector('canvas');
      if (!canvas) return;
      // The full-hero canvas and hero share an origin. Synthetic canvas events give
      // Fiber the correct offsetX/Y even when the real pointer is over a link.
      canvas.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        clientX: event.clientX,
        clientY: event.clientY,
        pointerId: event.pointerId,
        pointerType: event.pointerType,
        isPrimary: event.isPrimary,
      }));
    }
    hero.addEventListener('pointermove', forwardPointer, { passive: true });
    return () => hero.removeEventListener('pointermove', forwardPointer);
  }, [heroRef, enabled, supportsWebGL]);

  return <div ref={layer} className="hero-particles" aria-hidden="true">
    {enabled && supportsWebGL && <ParticleBoundary><Suspense fallback={null}>
      <Antigravity
        count={300}
        magnetRadius={14}
        ringRadius={7}
        waveSpeed={1.2}
        waveAmplitude={1}
        particleSize={1.5}
        lerpSpeed={0.05}
        color="#B4E359"
        autoAnimate={true}
        particleVariance={1}
        pulseSpeed={3.6}
        particleShape="tetrahedron"
      />
    </Suspense></ParticleBoundary>}
  </div>;
}

