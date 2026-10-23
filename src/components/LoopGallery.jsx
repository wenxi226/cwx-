import { useEffect, useRef, useState } from 'react';
import './LoopGallery.css';

const SPEED = 24; // CSS pixels per second, independent of series size and refresh rate.
const wrap = (value, period) => ((value % period) + period) % period;

export default function LoopGallery({ items, onOpen, detail = false, suspended = false, label = '作品系列' }) {
  const viewport = useRef(null);
  const motion = useRef({ offset: 0, velocity: 0, drag: null, blockClick: false, until: 0 });
  const [paused, setPaused] = useState(false);
  // Repeated slots make small collections loop without exposing an empty seam.
  const slotCount = items.length ? Math.ceil(8 / items.length) * items.length : 0;
  const slots = Array.from({ length: Math.max(items.length, slotCount) }, (_, index) => items[index % items.length]);
  useEffect(() => { motion.current.offset = 0; motion.current.velocity = 0; }, [items]);

  useEffect(() => {
    const element = viewport.current;
    if (!element || !items.length) return;
    const state = motion.current;
    let width = element.clientWidth;
    let cardWidth = Math.min(detail ? 420 : 350, width * (detail ? .72 : .67));
    let step = cardWidth + 22;
    let visible = true;
    let frame = 0;
    let last = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const resize = new ResizeObserver(() => {
      width = element.clientWidth;
      cardWidth = Math.min(detail ? 420 : 350, width * (detail ? .72 : .67));
      step = cardWidth + 22;
    });
    resize.observe(element);
    const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    visibility.observe(element);
    const paint = now => {
      const dt = last ? Math.min((now - last) / 1000, .05) : 0;
      last = now;
      if (visible && !document.hidden) {
        if (!state.drag && !suspended && !document.querySelector('.original-lightbox')) {
          if (!paused && !reduced.matches && now > state.until) state.offset += SPEED * dt;
          state.offset += state.velocity * dt;
          state.velocity *= Math.exp(-6 * dt);
        }
        const period = step * slots.length;
        state.offset = wrap(state.offset, period);
        for (const [index, card] of [...element.children].entries()) {
          const x = wrap(index * step - state.offset + period / 2, period) - period / 2;
          const ratio = Math.min(Math.abs(x) / Math.max(width / 2, 1), 1);
          const shown = Math.abs(x) < width / 2 + cardWidth;
          card.style.visibility = shown ? 'visible' : 'hidden';
          card.style.width = `${cardWidth}px`;
          card.style.transform = `translate3d(${x}px,${ratio * ratio * 35}px,0) rotateY(${Math.max(-24, Math.min(24, -x / width * 36))}deg) scale(${1 - ratio * .12})`;
          card.style.zIndex = `${100 - Math.round(ratio * 50)}`;
        }
      }
      frame = requestAnimationFrame(paint);
    };
    frame = requestAnimationFrame(paint);
    const wheel = event => {
      if (suspended || event.ctrlKey || Math.abs(event.deltaX) + Math.abs(event.deltaY) < 1) return;
      event.preventDefault();
      const delta = (Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? width : 1);
      state.offset += Math.max(-width, Math.min(width, delta));
      state.until = performance.now() + 800;
      state.velocity = 0;
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => { cancelAnimationFrame(frame); resize.disconnect(); visibility.disconnect(); element.removeEventListener('wheel', wheel); state.drag = null; };
  }, [items, detail, paused, suspended, slots.length]);

  const stepBy = direction => {
    const state = motion.current;
    state.offset += direction * (Math.min(detail ? 420 : 350, viewport.current.clientWidth * (detail ? .72 : .67)) + 22);
    state.until = performance.now() + 1000;
  };
  function down(event) {
    if (!event.isPrimary || event.button !== 0) return;
    const state = motion.current;
    state.velocity = 0;
    state.blockClick = false;
    state.drag = { id: event.pointerId, x: event.clientX, y: event.clientY, last: event.clientX, time: performance.now(), horizontal: false };
  }
  function move(event) {
    const state = motion.current;
    const drag = state.drag;
    if (!drag || drag.id !== event.pointerId) return;
    const dx = event.clientX - drag.x;
    if (!drag.horizontal && Math.abs(event.clientY - drag.y) > Math.abs(dx) && Math.abs(event.clientY - drag.y) > 8) { state.drag = null; return; }
    if (Math.abs(dx) > 8) {
      drag.horizontal = true;
      state.blockClick = true;
      viewport.current.setPointerCapture(event.pointerId);
    }
    if (!drag.horizontal) return;
    const now = performance.now();
    const delta = event.clientX - drag.last;
    state.offset -= delta;
    state.velocity = Math.max(-1800, Math.min(1800, -delta / Math.max((now - drag.time) / 1000, .008)));
    drag.last = event.clientX;
    drag.time = now;
  }
  function end(event) {
    const state = motion.current;
    if (state.drag?.id !== event.pointerId) return;
    if (event.type === 'pointercancel') { state.velocity = 0; state.blockClick = true; }
    state.drag = null;
    state.until = performance.now() + 1000;
    if (viewport.current.hasPointerCapture(event.pointerId)) viewport.current.releasePointerCapture(event.pointerId);
  }
  if (!items.length) return <p>暂无作品</p>;
  return <div className={`loop-gallery ${detail ? 'loop-gallery--detail' : ''}`}>
    <div className="loop-gallery-viewport" ref={viewport} role="region" aria-label={label}
      onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end}
      onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); stepBy(event.key === 'ArrowRight' ? 1 : -1); } }}>
      {slots.map((item, index) => <button className="loop-gallery-card" type="button" key={`${item.id}-${index}`} tabIndex={index >= items.length ? -1 : 0}
        aria-label={item.label} onFocus={event => { if (!event.currentTarget.matches(':focus-visible')) return; motion.current.offset = index * (Math.min(detail ? 420 : 350, viewport.current.clientWidth * (detail ? .72 : .67)) + 22); motion.current.until = performance.now() + 2000; }}
        onClick={event => { if (motion.current.blockClick && event.detail !== 0) { event.preventDefault(); return; } onOpen(item.index); }}>
        <img src={item.src} alt={item.label} draggable="false" decoding="async" loading={index < 3 ? 'eager' : 'lazy'} />
        {!detail && <span className="loop-gallery-caption"><strong>{item.title}</strong><small>{item.count} IMAGES ↗</small></span>}
      </button>)}
    </div>
    <div className="loop-gallery-controls"><button onClick={() => stepBy(-1)} aria-label="向左浏览">←</button><span>拖动 / 滑动 / 滚轮浏览 · 点击{detail ? '图片放大' : '系列进入'}</span><button onClick={() => setPaused(value => !value)} aria-label={paused ? '播放轮播' : '暂停轮播'}>{paused ? '▶' : 'Ⅱ'}</button><button onClick={() => stepBy(1)} aria-label="向右浏览">→</button></div>
  </div>;
}
