import { useEffect, useRef } from 'react';
import './AnimatedCharacter.css';

const image = `${import.meta.env.BASE_URL}media/hero-character.webp`;
const circuits = [
  'M178 180 214 160 243 162 267 139 302 139 319 125 374 125',
  'M221 193 248 177 287 177 305 157 345 157 365 139 420 139',
  'M346 101 346 114 379 114 396 131 427 131 447 152 468 152',
  'M454 103 484 118 495 136 522 147 542 170',
  'M593 181 613 207 613 231 633 249 644 281',
  'M653 305 672 330 676 382 669 419 674 451 668 476',
  'M644 495 647 522 625 547 617 574 594 591',
  'M136 724 163 744 205 754 246 764 288 769 330 767',
];

export default function AnimatedCharacter({ heroRef, enabled }) {
  const rig = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const element = rig.current;
    if (!hero || !element) return;
    if (!enabled) {
      element.style.setProperty('--look-x', '0px');
      element.style.setProperty('--look-y', '0px');
      return;
    }
    let frame = 0;
    let targetX = 0, targetY = 0, x = 0, y = 0;
    function tick() {
      x += (targetX - x) * .045;
      y += (targetY - y) * .045;
      element.style.setProperty('--look-x', `${x.toFixed(3)}px`);
      element.style.setProperty('--look-y', `${y.toFixed(3)}px`);
      if (Math.abs(targetX - x) + Math.abs(targetY - y) > .01) frame = requestAnimationFrame(tick);
      else frame = 0;
    }
    function start() { if (!frame) frame = requestAnimationFrame(tick); }
    function move(event) {
      if (!event.isTrusted || event.pointerType === 'touch') return;
      const rect = hero.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - .5) * 12;
      targetY = ((event.clientY - rect.top) / rect.height - .5) * 7;
      start();
    }
    function reset() { targetX = targetY = 0; start(); }
    hero.addEventListener('pointermove', move, { passive: true });
    hero.addEventListener('pointerleave', reset);
    return () => { cancelAnimationFrame(frame); hero.removeEventListener('pointermove', move); hero.removeEventListener('pointerleave', reset); };
  }, [heroRef, enabled]);

  return <div className="hero-figure">
    <div ref={rig} className={`character-rig ${enabled ? 'is-animated' : ''}`}>
      <div className="character-float">
        <img className="character-base" src={image} alt="佩戴绿色机动头盔、身穿白色服装的潮玩角色" fetchPriority="high" />
        <svg className="character-effects" viewBox="0 0 1000 1581" fill="none" aria-hidden="true">
          <defs>
            <clipPath id="hair-patch"><path d="M190 325C243 287 314 292 382 320L478 382 457 469 432 512 380 502 353 539 320 495 302 545 273 501 251 560 218 531 194 451Z" /></clipPath>
            <clipPath id="fabric-patch"><path d="M62 896 99 854 153 831 179 873 464 933 600 857 689 787 777 814 851 888 879 958 892 1110 956 1286 1000 1490 1000 1581 0 1581 0 1105 36 982Z" /></clipPath>
            <clipPath id="closed-eyes"><path d="M212 491Q226 490 242 498L240 517Q220 522 213 502Z" /><path d="M328 501Q337 487 358 485Q384 482 404 492Q398 516 369 518Q343 516 328 503Z" /></clipPath>
            <filter id="hair-displace" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".009 .026" numOctaves="2" seed="5" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">{enabled && <animate attributeName="scale" values="0;4;1;3;0" dur="5.6s" repeatCount="indefinite" />}</feDisplacementMap></filter>
            <filter id="fabric-displace" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".006 .015" numOctaves="2" seed="8" result="noise" /><feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">{enabled && <animate attributeName="scale" values="0;3;6;3;0" dur="6.8s" repeatCount="indefinite" />}</feDisplacementMap></filter>
            <filter id="circuit-bloom" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="2.8" result="bloom" /><feMerge><feMergeNode in="bloom" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g clipPath="url(#fabric-patch)"><image href={image} width="1000" height="1581" filter="url(#fabric-displace)" /></g>
          <g clipPath="url(#hair-patch)"><image href={image} width="1000" height="1581" filter="url(#hair-displace)" /></g>
          <g className="character-blink">
            <g clipPath="url(#closed-eyes)"><image href={image} y="-48" width="1000" height="1581" /></g>
            <path d="M215 504Q226 513 239 510M330 503Q361 517 401 498" stroke="#5b534a" strokeWidth="2.4" strokeLinecap="round" />
          </g>
          <g className="helmet-circuits" filter="url(#circuit-bloom)">{circuits.map((path, index) => <path key={path} d={path} pathLength="100" stroke="#c5ff76" strokeWidth="2.5" strokeLinecap="round" style={{ '--circuit-delay': `${-index * .55}s` }} />)}</g>
          <g className="helmet-led" filter="url(#circuit-bloom)"><path d="m527 151 15 10 8 17" stroke="#d9ff9d" strokeWidth="4" strokeLinecap="round"/><circle cx="662" cy="531" r="3" fill="#d9ff9d" /></g>
          <path className="visor-reflection" d="M120 302C92 394 96 470 112 523" stroke="white" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </div>
    </div>
    <div className="figure-label mono"><span>FIG. 001</span> THE EXPLORER <i /></div>
  </div>;
}

