import { useEffect, useRef, useState } from 'react';
import { categories, profile, projects, skills } from './data';
import HeroParticles from './components/HeroParticles';
import AnimatedCharacter from './components/AnimatedCharacter';

const nav = [
  ['home', 'Home', '首页'], ['about', 'About', '关于我'], ['skills', 'Skills', '技能系统'],
  ['work', 'Works', '精选作品'], ['contact', 'Contact', '联系我'],
];

function Arrow({ diagonal = false, className = '' }) {
  return <svg className={`arrow ${className}`} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h16M13 5l7 7-7 7'} stroke="currentColor" strokeWidth="1.6" /></svg>;
}

function Mark() {
  return <svg className="brand-mark" width="36" height="36" viewBox="0 0 40 40" fill="currentColor" aria-hidden="true"><path d="M4 3h8l8 11L28 3h8L24 20l12 17h-8L20 26l-8 11H4l12-17z"/><path d="m3 17 4 3-4 3zm34 0-4 3 4 3z"/></svg>;
}

function CharacterClip() {
  return <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true"><defs><clipPath id="explorer-silhouette" clipPathUnits="objectBoundingBox"><path d="M .38 .056 C .28 .056 .17 .086 .115 .144 C .078 .189 .067 .260 .07 .327 C .072 .389 .099 .44 .139 .477 C .103 .503 .044 .531 .042 .583 L .025 .636 L 0 .7 L 0 1 L 1 1 L 1 .929 C .989 .878 .936 .794 .911 .73 L .891 .645 C .893 .576 .846 .535 .801 .506 C .773 .476 .713 .449 .649 .438 C .684 .409 .704 .381 .699 .351 L .69 .327 L .72 .311 C .731 .263 .711 .209 .705 .191 L .682 .186 C .683 .145 .643 .1 .59 .082 C .517 .059 .45 .053 .38 .056 Z" /></clipPath></defs></svg>;
}

function Sidebar({ active }) {
  return <aside className="sidebar">
    <a className="brand" href="#home" aria-label="陈文希，返回首页"><Mark /><div><strong>陈文希</strong><span>WEN XI CHEN</span></div></a>
    <div className="identity"><i /> 潮玩摄影师 / 视觉创作者</div>
    <div className="sidebar-nav-label mono">NAVIGATION <span>↙</span></div>
    <nav aria-label="主导航">{nav.map(([id, en, cn], i) => <a key={id} className={`nav-item ${active === id ? 'is-active' : ''}`} href={`#${id}`} aria-current={active === id ? 'location' : undefined}><span className="mono">0{i + 1}</span><div>{en}<small>{cn}</small></div><span className="nav-plus">+</span></a>)}</nav>
    <div className="sidebar-note"><div className="mini-orbit">✳</div><p>给小小的玩具，<br />一个大大的世界。</p><span className="mono">SMALL TOYS. BIG STORIES.</span></div>
    <a className="sidebar-projects mono" href="#work">VIEW ALL PROJECTS <Arrow /></a>
    <div className="sidebar-bottom"><span className="availability"><i /> 开放项目合作</span><a href="mailto:3158991946@qq.com">3158991946@qq.com <Arrow diagonal /></a><div className="sidebar-copyright mono">© 2026 WXC. <span>PORTFOLIO V.01</span></div></div>
  </aside>;
}

function Hero() {
  const hero = useRef(null);
  const video = useRef(null);
  const [paused, setPaused] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [visible, setVisible] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(() => !document.hidden);
  const motionEnabled = !paused && !reducedMotion && visible && documentVisible;
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => { setReducedMotion(reduced.matches); if (reduced.matches) { video.current?.pause(); setPaused(true); } };
    apply(); reduced.addEventListener('change', apply);
    return () => reduced.removeEventListener('change', apply);
  }, []);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .05 });
    if (hero.current) observer.observe(hero.current);
    const visibility = () => setDocumentVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  useEffect(() => {
    if (!video.current || !videoReady) return;
    if (motionEnabled) video.current.play().catch(() => setPaused(true));
    else video.current.pause();
  }, [motionEnabled, videoReady]);
  async function toggleVideo() {
    if (!video.current || !videoReady || reducedMotion) return;
    setPaused(value => !value);
  }
  return <section ref={hero} className="hero" id="home" aria-labelledby="hero-title">
    <div className="hero-band" />
    <video ref={video} className={`hero-video ${videoReady ? 'ready' : ''}`} src="/media/hero-motion.webm" autoPlay muted loop playsInline aria-hidden="true" onLoadedData={() => { setVideoReady(true); if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.current?.pause(); }} onError={() => setVideoReady(false)} />
    <HeroParticles heroRef={hero} enabled={motionEnabled} />
    <div className="hero-top"><span className="mono"><i className="slash-mark" /> INDEPENDENT VISUAL CREATOR</span><a href="#contact" className="top-contact">聊聊你的想法 <Arrow diagonal /></a></div>
    <div className="hero-content"><div className="hero-kicker mono">Hi, I’M</div><h1 id="hero-title">陈文希<span className="name-cross">✳</span></h1><div className="hero-role"><span>潮玩摄影师</span><b>/</b><span className="mono">DESIGNER TOY PHOTOGRAPHER</span></div><h2 className="hero-statement">LIMITLESS<br /><span>VISUAL STORIES.</span></h2><p className="hero-description">用镜头捕捉玩具的灵魂，<br />让每一个小世界，都有无限可能。</p><a href="#work" className="primary-button mono">EXPLORE MY WORK <span><Arrow /></span></a></div>
    <AnimatedCharacter heroRef={hero} enabled={motionEnabled} />
    <div className="hero-coordinate mono">CREATIVE SYSTEM / WXC—026 <span>+ 23° VISUAL FIELD</span></div>
    <div className="hero-bottom"><a href="#about" className="scroll-cue mono"><span>↓</span> SCROLL TO DISCOVER</a><div className="hero-video-controls mono"><span><i /> {videoReady ? 'MOTION BACKGROUND' : 'VISUAL SYSTEM'}</span><button type="button" onClick={toggleVideo} disabled={!videoReady || reducedMotion} title={reducedMotion ? '系统已开启减少动态效果' : '暂停或恢复首页全部动效'} aria-label={paused ? '播放首页背景视频' : '暂停首页背景视频'}>{paused ? '▶' : 'Ⅱ'}</button><span>2026 <b>///</b></span></div></div>
  </section>;
}

function SectionHeading({ number, label, title, subtitle, children }) {
  return <header className="section-heading"><div><div className="section-index mono"><span>{number}</span><i />{label}</div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{children}</header>;
}

function Ticker() {
  return <div className="ticker" aria-hidden="true"><div>{[0, 1].map(index => <span key={index}>TOY PHOTOGRAPHY <b>✳</b> VISUAL EXPLORATION <b>✳</b> SMALL TOYS, BIG STORIES <b>✳</b> </span>)}</div></div>;
}

function About() {
  return <section id="about" className="about section-pad" aria-labelledby="about-title">
    <SectionHeading number="01" label="BEHIND THE LENS" title={<span id="about-title">不止记录，<br />更是创造。</span>}><span className="section-corner mono">CURIOUS BY NATURE.<br />CREATIVE BY CHOICE. <span>↙</span></span></SectionHeading>
    <div className="about-grid"><div className="portrait-panel portrait-panel--photographer"><div className="portrait-top mono">WXC. / PERSONAL PROFILE <span>+</span></div><img src="/media/photographer-portrait.webp" alt="陈文希戴眼镜、身穿灰色连帽衫的半身肖像" loading="lazy" width="2700" height="4283" /><div className="portrait-stamp mono">CREATOR<br /><b>01</b></div><div className="portrait-caption"><span>陈文希 · 潮玩摄影师</span><span className="mono">FIG. 01 ↗</span></div></div>
      <div className="about-copy"><div className="about-name"><h3>{profile.name}</h3><span className="mono">{profile.englishName}</span><span className="about-role">潮玩摄影师 / 视觉创作者</span></div><p>{profile.intro}</p><p>{profile.description}</p><div className="experience"><div className="small-section-label mono">EXPERIENCE <span>工作 / 项目经历</span></div>{profile.experiences.map(item => <div className="experience-row" key={item.stage}><span className="mono">/{item.stage}</span><div><h4>{item.title}</h4><p>{item.detail}</p></div><Arrow diagonal /></div>)}</div><div className="about-contact"><a href={`mailto:${profile.email}`}><span className="mono">EMAIL</span>{profile.email}<Arrow diagonal /></a><a href="#contact"><span className="mono">WECHAT</span>{profile.wechat}<Arrow diagonal /></a></div></div>
    </div>
  </section>;
}

function SkillSymbol({ symbol }) {
  if (symbol === 'camera') return <svg viewBox="0 0 80 70" fill="none" aria-hidden="true"><path d="M10 21h15l7-10h18l7 10h13v40H10z" stroke="currentColor" strokeWidth="3"/><circle cx="40" cy="40" r="15" stroke="currentColor" strokeWidth="3"/><circle cx="40" cy="40" r="8" stroke="currentColor"/><path d="M16 17h10m34 14h4" stroke="currentColor" strokeWidth="3"/></svg>;
  if (symbol === 'gpt') return <svg viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M40 5 66 20v30L40 65 14 50V20L40 5z" stroke="currentColor" strokeWidth="2"/><path d="M40 15 62 28v25L40 66 18 53V28z" stroke="currentColor" strokeWidth="2" transform="rotate(60 40 40)"/><path d="M40 22 55 31v18l-15 9-15-9V31z" stroke="currentColor" strokeWidth="2"/></svg>;
  return <span className={symbol === '✳' ? 'asterisk-symbol' : ''}>{symbol}</span>;
}

function Skills() {
  const track = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  useEffect(() => {
    const element = track.current;
    const update = () => { setAtStart(element.scrollLeft < 4); setAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 4); };
    update(); element.addEventListener('scroll', update, { passive: true });
    const resize = new ResizeObserver(update); resize.observe(element);
    return () => { element.removeEventListener('scroll', update); resize.disconnect(); };
  }, []);
  function scroll(direction) { track.current.scrollBy({ left: direction * (track.current.querySelector('article').clientWidth + 18), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }
  return <section id="skills" className="skills-section" aria-labelledby="skills-title"><div className="section-pad skills-header"><SectionHeading number="02" label="MY CREATIVE TOOLKIT" title={<span id="skills-title">灵感之外，<br />还有硬实力。</span>}><div className="skill-controls"><p>镜头 × 设计 × AI<br /><span>把想法，变成完整的视觉体验。</span></p><div><button onClick={() => scroll(-1)} disabled={atStart} aria-label="查看上一张技能卡片"><Arrow className="reverse" /></button><button onClick={() => scroll(1)} disabled={atEnd} aria-label="查看下一张技能卡片"><Arrow /></button></div></div></SectionHeading></div><div className="skills-track" ref={track} tabIndex="0" aria-label="技能卡片，使用方向键或横向滚动查看">{skills.map(skill => <article className={`skill-card skill-${skill.id}`} key={skill.id}><div className="skill-card-top mono"><span>MODULE / {skill.code}</span><span>↗</span></div><div className="skill-symbol"><SkillSymbol symbol={skill.symbol} /><div className="skill-decoration" aria-hidden="true">+</div></div><div className="skill-card-body"><span className="skill-english mono">{skill.english}</span><h3>{skill.title}</h3><p>{skill.description}</p><div className="skill-tags">{skill.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="skill-card-bottom mono"><span>CREATIVE CAPABILITY</span><i /></div></article>)}</div><div className="skill-scroll-hint mono">SCROLL TO EXPLORE <span>⟷</span> <i /> 05 CREATIVE MODULES</div></section>;
}

function MaterialGallery({ project, dialog = false, onOpenOriginal }) {
  if (project.category === 'video') {
    if (dialog) return <video className="dialog-video" src={project.video} controls playsInline preload="metadata" aria-label={`${project.title}视频作品`} />;
    return <div className="artwork artwork-material-video"><div className="material-video-grid" aria-hidden="true" /><div className="artwork-type">MOTION<br />ARCHIVE.</div><div className="material-video-mark"><span>▶</span><small className="mono">VIDEO / {project.id.replace('material-video-', '')}</small></div><div className="art-caption mono">{project.subtitle} <span>2026</span></div></div>;
  }
  if (!dialog) return <div className="material-gallery">{project.images.map((image, index) => <img key={image} src={image} alt={`${project.title}，第 ${index + 1} 张`} loading={index > 3 ? 'lazy' : 'eager'} />)}<div className="material-gallery-count mono">{project.images.length} IMAGES <span>↗</span></div></div>;
  return <MaterialGalleryViewer project={project} onOpenOriginal={onOpenOriginal} />;
}

function LegacyMaterialGalleryViewer({ project, onOpenOriginal }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = project.images.length;
  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex(index => (index + 1) % count), 5200);
    return () => window.clearInterval(timer);
  }, [paused, count, project.id]);
  function move(step) { setActiveIndex(index => (index + step + count) % count); }
  return <div className="material-gallery-viewer">
    <div className="material-gallery-slider" style={{ transform: `translateX(-${activeIndex * 100}%)` }} aria-live="polite">
      {project.images.map((image, index) => <button type="button" className="material-gallery-slide" key={image} onClick={() => onOpenOriginal(index)} aria-label={`查看${project.title}第 ${index + 1} 张原图`}><img src={image} alt={`${project.title}，第 ${index + 1} 张`} /></button>)}
    </div>
    <div className="material-gallery-toolbar"><button type="button" onClick={() => move(-1)} aria-label="上一张图片"><Arrow className="reverse" /></button><span className="mono">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · 点击图片查看原图</span><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? '播放图片缓慢滚动' : '暂停图片缓慢滚动'}>{paused ? '▶' : 'Ⅱ'}</button><button type="button" onClick={() => move(1)} aria-label="下一张图片"><Arrow /></button></div>
  </div>;
}

function MaterialGalleryViewer({ project, onOpenOriginal }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const count = project.images.length;
  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex(index => (index + 1) % count), 3800);
    return () => window.clearInterval(timer);
  }, [paused, count, project.id]);
  function move(step) { setActiveIndex(index => (index + step + count) % count); }
  return <div className="material-gallery-viewer material-gallery-viewer--stack">
    <div className="material-gallery-stack" aria-live="polite">
      {project.images.map((image, index) => {
        const relative = (index - activeIndex + count) % count;
        const isExit = relative === count - 1;
        const visible = relative <= 3 || isExit;
        const style = isExit ? { transform: 'translateX(-120%) rotate(-8deg) scale(.88)', opacity: 0, zIndex: 0 } : { transform: `translateX(${relative * 18}px) translateY(${relative * 8}px) rotate(${relative * 1.8}deg) scale(${1 - relative * .055})`, opacity: visible ? 1 - relative * .13 : 0, zIndex: count - relative };
        return <button type="button" className={`material-stack-card ${hoverIndex === index ? 'is-hovered' : ''}`} style={style} key={image} onMouseEnter={() => setHoverIndex(index)} onMouseLeave={() => setHoverIndex(null)} onFocus={() => setHoverIndex(index)} onBlur={() => setHoverIndex(null)} onClick={() => onOpenOriginal(index)} aria-label={`查看${project.title}第 ${index + 1} 张原图`}><img src={hoverIndex === index ? (project.originalImages?.[index] || image) : image} alt={`${project.title}，第 ${index + 1} 张`} /></button>;
      })}
    </div>
    <div className="material-gallery-toolbar"><button type="button" onClick={() => move(-1)} aria-label="上一张图片"><Arrow className="reverse" /></button><span className="mono">{String(activeIndex + 1).padStart(2, '0')} / {String(count).padStart(2, '0')} · 点击图片查看原图</span><button type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? '播放图片卡片轮播' : '暂停图片卡片轮播'}>{paused ? '▶' : 'Ⅱ'}</button><button type="button" onClick={() => move(1)} aria-label="下一张图片"><Arrow /></button></div>
  </div>;
}

function ProjectArtwork({ project, inDialog = false, onOpenOriginal }) {
  if (project.layout === 'material-gallery' || project.layout === 'material-video') return <MaterialGallery project={project} dialog={inDialog} onOpenOriginal={onOpenOriginal} />;
  if (project.layout === 'packaging') return <div className="artwork artwork-packaging"><div className="packaging-grid" aria-hidden="true" /><div className="package-back mono"><span>WXC. LAB</span><b>PLAY<br />IN<br />GREEN.</b><div className="barcode" /><small>EXPLORER COLLECTION / 001</small></div><div className="package-front"><span className="mono">EXPLORER — 01</span><img src={project.image} alt="潮玩角色绿色包装版式样例" loading="lazy" /><b className="mono">GO. EXPLORE.</b></div><span className="art-caption mono">PACKAGING CONCEPT / SAMPLE</span></div>;
  if (project.layout === 'ip') return <div className="artwork artwork-ip"><div className="ip-art-header mono"><b>EXPLORER<span> / 001</span></b><span>CHARACTER STUDY</span></div><img src={project.image} alt="绿色机动潮玩角色的正面、侧面、背面及特写设定图" loading="lazy" /><div className="ip-art-footer mono"><span>FRONT / SIDE / BACK</span><div><i /><i /><i /></div></div></div>;
  if (project.layout === 'editorial') return <div className="artwork artwork-editorial"><div className="editorial-number">06</div><div className="editorial-paper"><span className="mono">WXC. VISUAL ARCHIVE</span><h4>FIELD<br />NOTES<span>↗</span></h4><img src={project.image} alt="角色探索手册风格的插画应用样例" loading="lazy" /><div className="editorial-foot mono">23° / GREEN SECTOR <div className="barcode" /></div></div><span className="art-caption mono">VISUAL APPLICATION / SAMPLE</span></div>;
  if (project.layout === 'video' && inDialog) return <video className="dialog-video" src={project.video} poster={project.image} controls playsInline preload="metadata" aria-label="绿色机动线条动态视觉样片" />;
  return <div className={`artwork artwork-${project.layout}`}><div className="artwork-type" aria-hidden="true">{project.layout === 'side' ? 'OTHER\nSIDE.' : project.layout === 'video' ? 'IN\nMOTION.' : 'EXPLORE\nMORE.'}</div><img src={project.image} alt={project.layout === 'side' ? '绿色机动潮玩角色侧面视图' : '绿色机动潮玩角色特写'} loading="lazy" /><div className="art-caption mono">WXC. VISUAL LAB <span>2026 / 0{project.id}</span></div>{project.layout === 'video' && <span className="play-badge" aria-hidden="true">▶</span>}</div>;
}

function ImageHierarchy({ projects, branch, subtype, setBranch, setSubtype }) {
  const imageProjects = projects.filter(project => project.category === 'images');
  const ipProjects = imageProjects.filter(project => project.folder.includes('图片类 / IP玩偶'));
  const peripheralProjects = imageProjects.filter(project => project.folder.includes('图片类 / 潮玩周边'));
  const aiProjects = ipProjects.filter(project => project.folder.includes(' / ai合成 / '));
  const realProjects = ipProjects.filter(project => project.folder.includes(' / 实拍类 / '));
  const secondLevels = [
    { id: 'ip', label: 'IP 潮玩公仔', count: ipProjects.length },
    { id: 'peripheral', label: '潮玩周边', count: peripheralProjects.length },
  ];
  return <div className="image-hierarchy" aria-label="图片摄影作品层级筛选">
    <div className="hierarchy-row"><span className="hierarchy-level mono">01 / 图片摄影</span><span className="hierarchy-divider" />{secondLevels.map(item => <button type="button" key={item.id} className={branch === item.id ? 'is-selected' : ''} onClick={() => { setBranch(item.id); setSubtype('all'); }}><span>{item.label}</span><sup className="mono">{String(item.count).padStart(2, '0')}</sup></button>)}</div>
    {branch === 'ip' && <div className="hierarchy-row hierarchy-row--sub"><span className="hierarchy-level mono">02 / IP 潮玩公仔</span><span className="hierarchy-divider" />{[{ id: 'all', label: '全部 IP', count: ipProjects.length }, { id: 'ai', label: 'AI 合成', count: aiProjects.length }, { id: 'real', label: '实拍类', count: realProjects.length }].map(item => <button type="button" key={item.id} className={subtype === item.id ? 'is-selected' : ''} onClick={() => setSubtype(item.id)}><span>{item.label}</span><sup className="mono">{String(item.count).padStart(2, '0')}</sup></button>)}</div>}
  </div>;
}

function LegacyWorks() {
  const [category, setCategory] = useState('all');
  const [imageBranch, setImageBranch] = useState('all');
  const [imageSubtype, setImageSubtype] = useState('all');
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const dialog = useRef(null);
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  useEffect(() => {
    if (!lightbox) return undefined;
    const onKeyDown = event => { if (event.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);
  function moveLightbox(step) {
    if (!lightbox) return;
    const count = lightbox.project.originalImages?.length || lightbox.project.images.length;
    setLightbox({ ...lightbox, index: (lightbox.index + step + count) % count });
  }
  useEffect(() => { if (category !== 'images') { setImageBranch('all'); setImageSubtype('all'); } }, [category]);
  const visible = projects.filter(project => {
    if (category !== 'all' && project.category !== category) return false;
    if (category !== 'images' || imageBranch === 'all') return true;
    if (imageBranch === 'peripheral') return project.folder.includes('图片类 / 潮玩周边');
    if (imageBranch === 'ip' && !project.folder.includes('图片类 / IP玩偶')) return false;
    if (imageBranch === 'ip' && imageSubtype === 'ai') return project.folder.includes('图片类 / IP玩偶 / ai合成 / ');
    if (imageBranch === 'ip' && imageSubtype === 'real') return project.folder.includes('图片类 / IP玩偶 / 实拍类 / ');
    return true;
  });
  return <section className="works section-pad" id="work" aria-labelledby="works-title"><SectionHeading number="03" label="SELECTED WORKS" title={<span id="works-title">把热爱，<br />拍成作品。</span>}><div className="work-intro"><p>来自素材库的完整作品系列。<br />图片、包装、IP 与动态影像，按文件夹分类整理。</p><span className="mono">MATERIAL ARCHIVE / UPDATED 2026</span></div></SectionHeading><div className="work-filter" role="tablist" aria-label="作品分类">{categories.map(item => <button type="button" role="tab" id={`tab-${item.id}`} aria-selected={category === item.id} aria-controls="work-grid" key={item.id} onClick={() => setCategory(item.id)} onKeyDown={event => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const index = categories.findIndex(value => value.id === item.id); const next = event.key === 'Home' ? 0 : event.key === 'End' ? categories.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + categories.length) % categories.length; setCategory(categories[next].id); document.getElementById(`tab-${categories[next].id}`)?.focus(); } }} tabIndex={category === item.id ? 0 : -1} className={category === item.id ? 'selected' : ''}><span>{item.label}</span><sup className="mono">{item.id === 'all' ? projects.length.toString().padStart(2,'0') : projects.filter(project => project.category === item.id).length.toString().padStart(2,'0')}</sup></button>)}</div><div className="sample-note"><span className="sample-dot" /> 图片按系列归档，点击卡片浏览完整图库；弹窗中的图片缓慢滚动，点击图片查看无裁切原图。</div><div className="work-grid" id="work-grid" role="tabpanel" aria-labelledby={`tab-${category}`}><div className="sr-only" aria-live="polite">当前显示 {visible.length} 个{categories.find(item => item.id === category).label}</div>{visible.map(project => <button type="button" className="project-card" key={project.id} onClick={() => setSelected(project)} aria-label={`查看${project.title}${project.category === 'video' ? '视频' : '图库'}`}><div className="project-image"><ProjectArtwork project={project} /><span className="project-sample mono">{project.category === 'video' ? 'VIDEO' : 'SERIES'} / {project.id}</span><span className="project-open"><Arrow diagonal /></span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.subtitle}</p></div><span className="mono">{project.year}<Arrow diagonal /></span></div></button>)}</div><div className="work-bottom mono"><span>GOOD THINGS COME FROM CURIOSITY.</span><span>MORE STORIES TO COME <b>✳</b></span></div><dialog ref={dialog} className="project-dialog" onClose={() => setSelected(null)} onClick={event => { if(event.target === dialog.current) dialog.current.close(); }} aria-labelledby="dialog-title">{selected && <div className="dialog-content"><div className="dialog-top"><span className="mono">PROJECT / {selected.id} — {categories.find(item => item.id === selected.category).label}</span><button type="button" className="dialog-close" onClick={() => dialog.current.close()} aria-label="关闭作品预览">×</button></div><ProjectArtwork project={selected} inDialog onOpenOriginal={index => setLightbox({ project: selected, index })} /><div className="dialog-details"><h3 id="dialog-title">{selected.title}</h3><p>{selected.description}</p><span className="mono">{selected.year} / 素材库作品</span></div>{lightbox && <div className="original-lightbox" role="dialog" aria-modal="true" aria-label={`${lightbox.project.title}原图查看`} onClick={event => { if (event.target === event.currentTarget) setLightbox(null); }}><div className="original-lightbox-content"><div className="original-lightbox-top"><span className="mono">ORIGINAL / {String(lightbox.index + 1).padStart(2, '0')} / {String((lightbox.project.originalImages || lightbox.project.images).length).padStart(2, '0')}</span><button type="button" className="dialog-close" onClick={() => setLightbox(null)} aria-label="关闭原图">×</button></div><button type="button" className="original-lightbox-nav original-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="上一张原图"><Arrow className="reverse" /></button><img src={(lightbox.project.originalImages || lightbox.project.images)[lightbox.index]} alt={`${lightbox.project.title}第 ${lightbox.index + 1} 张原图`} /><button type="button" className="original-lightbox-nav original-lightbox-next" onClick={() => moveLightbox(1)} aria-label="下一张原图"><Arrow /></button><div className="original-lightbox-caption"><h3>{lightbox.project.title}</h3><p>原始比例 · 无裁切 · 点击左右箭头浏览</p></div></div></div>}</div>}</dialog></section>;
}

function LegacyWorks2() {
  const [category, setCategory] = useState('images');
  const [imageBranch, setImageBranch] = useState('ip');
  const [imageSubtype, setImageSubtype] = useState('all');
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const dialog = useRef(null);

  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  useEffect(() => { if (category !== 'images') { setImageBranch('ip'); setImageSubtype('all'); } }, [category]);
  useEffect(() => {
    if (!lightbox) return undefined;
    const onKeyDown = event => { if (event.key === 'Escape') setLightbox(null); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [lightbox]);
  function moveLightbox(step) {
    if (!lightbox) return;
    const count = lightbox.project.originalImages?.length || lightbox.project.images.length;
    setLightbox({ ...lightbox, index: (lightbox.index + step + count) % count });
  }
  const visible = projects.filter(project => {
    if (category !== 'all' && project.category !== category) return false;
    if (category !== 'images') return true;
    if (imageBranch === 'peripheral') return project.folder.includes('图片类 / 潮玩周边');
    if (imageBranch === 'ip' && !project.folder.includes('图片类 / IP玩偶')) return false;
    if (imageBranch === 'ip' && imageSubtype === 'ai') return project.folder.includes('图片类 / IP玩偶 / ai合成 / ');
    if (imageBranch === 'ip' && imageSubtype === 'real') return project.folder.includes('图片类 / IP玩偶 / 实拍类 / ');
    return true;
  });
  return <section className="works section-pad" id="work" aria-labelledby="works-title">
    <SectionHeading number="03" label="SELECTED WORKS" title={<span id="works-title">把热爱，<br />拍成作品。</span>}><div className="work-intro"><p>来自素材库的完整作品系列。<br />图片、包装、IP 与动态影像，按文件夹分类整理。</p><span className="mono">MATERIAL ARCHIVE / UPDATED 2026</span></div></SectionHeading>
    <div className="work-filter" role="tablist" aria-label="作品分类">{categories.map(item => <button type="button" role="tab" id={`tab-${item.id}`} aria-selected={category === item.id} aria-controls="work-grid" key={item.id} onClick={() => setCategory(item.id)} tabIndex={category === item.id ? 0 : -1} className={category === item.id ? 'selected' : ''}><span>{item.label}</span><sup className="mono">{item.id === 'all' ? projects.length.toString().padStart(2, '0') : projects.filter(project => project.category === item.id).length.toString().padStart(2, '0')}</sup></button>)}</div>
    {category === 'images' && <ImageHierarchy projects={projects} branch={imageBranch} subtype={imageSubtype} setBranch={setImageBranch} setSubtype={setImageSubtype} />}
    <div className="sample-note"><span className="sample-dot" /> 图片按文件夹层级归档；点击系列浏览图库，弹窗中图片缓慢滚动，点击图片查看无裁切原图。</div>
    <div className="work-grid" id="work-grid" role="tabpanel" aria-labelledby={`tab-${category}`}><div className="sr-only" aria-live="polite">当前显示 {visible.length} 个{categories.find(item => item.id === category).label}</div>{visible.map(project => <button type="button" className="project-card" key={project.id} onClick={() => setSelected(project)} aria-label={`查看${project.title}${project.category === 'video' ? '视频' : '图库'}`}><div className="project-image"><ProjectArtwork project={project} /><span className="project-sample mono">{project.category === 'video' ? 'VIDEO' : 'SERIES'} / {project.id}</span><span className="project-open"><Arrow diagonal /></span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.subtitle}</p></div><span className="mono">{project.year}<Arrow diagonal /></span></div></button>)}</div>
    <div className="work-bottom mono"><span>GOOD THINGS COME FROM CURIOSITY.</span><span>MORE STORIES TO COME <b>✳</b></span></div>
    <dialog ref={dialog} className="project-dialog" onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }} aria-labelledby="dialog-title">{selected && <div className="dialog-content"><div className="dialog-top"><span className="mono">PROJECT / {selected.id} — {categories.find(item => item.id === selected.category).label}</span><button type="button" className="dialog-close" onClick={() => dialog.current.close()} aria-label="关闭作品预览">×</button></div><ProjectArtwork project={selected} inDialog onOpenOriginal={index => setLightbox({ project: selected, index })} /><div className="dialog-details"><h3 id="dialog-title">{selected.title}</h3><p>{selected.description}</p><span className="mono">{selected.year} / 素材库作品</span></div>{lightbox && <div className="original-lightbox" role="dialog" aria-modal="true" aria-label={`${lightbox.project.title}原图查看`} onClick={event => { if (event.target === event.currentTarget) setLightbox(null); }}><div className="original-lightbox-content"><div className="original-lightbox-top"><span className="mono">ORIGINAL / {String(lightbox.index + 1).padStart(2, '0')} / {String((lightbox.project.originalImages || lightbox.project.images).length).padStart(2, '0')}</span><button type="button" className="dialog-close" onClick={() => setLightbox(null)} aria-label="关闭原图">×</button></div><button type="button" className="original-lightbox-nav original-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="上一张原图"><Arrow className="reverse" /></button><img src={(lightbox.project.originalImages || lightbox.project.images)[lightbox.index]} alt={`${lightbox.project.title}第 ${lightbox.index + 1} 张原图`} /><button type="button" className="original-lightbox-nav original-lightbox-next" onClick={() => moveLightbox(1)} aria-label="下一张原图"><Arrow /></button><div className="original-lightbox-caption"><h3>{lightbox.project.title}</h3><p>原始比例 · 无裁切 · 点击左右箭头浏览</p></div></div></div>}</div>}</dialog>
  </section>;
}

function MaterialSeriesCover({ project }) {
  return <div className="material-series-cover"><img src={project.image} alt={`${project.title}系列封面`} loading="lazy" /><div className="material-series-cover-overlay"><span className="mono">{String(project.images?.length || 0).padStart(2, '0')} IMAGES</span><Arrow diagonal /></div><span className="material-series-cover-code mono">SERIES / {project.id}</span></div>;
}

function WorkCard({ project, onSelect, duplicate = false, ribbonIndex = 0 }) {
  const arc = Math.abs((ribbonIndex % 9) - 4);
  return <button type="button" className="project-card" style={{ '--ribbon-y': `${arc * 13}px`, '--ribbon-rotate': `${((ribbonIndex % 9) - 4) * 2.8}deg`, '--ribbon-scale': `${1 - arc * .025}` }} key={`${project.id}-${duplicate ? 'duplicate' : 'primary'}`} onClick={() => onSelect(project)} aria-hidden={duplicate || undefined} tabIndex={duplicate ? -1 : 0} aria-label={duplicate ? undefined : `查看${project.title}${project.category === 'video' ? '视频' : '图库'}`}><div className="project-image">{project.category === 'images' ? <MaterialSeriesCover project={project} /> : <ProjectArtwork project={project} />}<span className="project-sample mono">{project.category === 'video' ? 'VIDEO' : 'SERIES'} / {project.id}</span><span className="project-open"><Arrow diagonal /></span></div><div className="project-info"><div><h3>{project.title}</h3><p>{project.subtitle}</p></div><span className="mono">{project.year}<Arrow diagonal /></span></div></button>;
}

function Works() {
  const [category, setCategory] = useState('images');
  const [imageBranch, setImageBranch] = useState('ip');
  const [imageSubtype, setImageSubtype] = useState('all');
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const dialog = useRef(null);
  useEffect(() => { if (selected) dialog.current?.showModal(); }, [selected]);
  useEffect(() => { if (category !== 'images') { setImageBranch('ip'); setImageSubtype('all'); } }, [category]);
  useEffect(() => { if (!lightbox) return undefined; const onKeyDown = event => { if (event.key === 'Escape') setLightbox(null); }; document.addEventListener('keydown', onKeyDown); return () => document.removeEventListener('keydown', onKeyDown); }, [lightbox]);
  function moveLightbox(step) { if (!lightbox) return; const count = lightbox.project.originalImages?.length || lightbox.project.images.length; setLightbox({ ...lightbox, index: (lightbox.index + step + count) % count }); }
  const visible = projects.filter(project => {
    if (project.category !== category) return false;
    if (category !== 'images') return true;
    if (imageBranch === 'peripheral') return project.folder.includes('图片类 / 潮玩周边');
    if (imageSubtype === 'ai') return project.folder.includes('图片类 / IP玩偶 / ai合成 / ');
    if (imageSubtype === 'real') return project.folder.includes('图片类 / IP玩偶 / 实拍类 / ');
    return project.folder.includes('图片类 / IP玩偶');
  });
  return <section className="works section-pad" id="work" aria-labelledby="works-title">
    <SectionHeading number="03" label="SELECTED WORKS" title={<span id="works-title">把热爱，<br />拍成作品。</span>}><div className="work-intro"><p>来自素材库的完整作品系列。<br />图片、包装、IP 与动态影像，按文件夹分类整理。</p><span className="mono">MATERIAL ARCHIVE / UPDATED 2026</span></div></SectionHeading>
    <div className="work-filter" role="tablist" aria-label="作品分类">{categories.map(item => <button type="button" role="tab" id={`tab-${item.id}`} aria-selected={category === item.id} aria-controls="work-grid" key={item.id} onClick={() => setCategory(item.id)} tabIndex={category === item.id ? 0 : -1} className={category === item.id ? 'selected' : ''}><span>{item.label}</span><sup className="mono">{projects.filter(project => project.category === item.id).length.toString().padStart(2, '0')}</sup></button>)}</div>
    {category === 'images' && <ImageHierarchy projects={projects} branch={imageBranch} subtype={imageSubtype} setBranch={setImageBranch} setSubtype={setImageSubtype} />}
    <div className="sample-note"><span className="sample-dot" /> 图片系列沿横向卡带循环；点击系列查看堆叠轮播，点击图片查看无裁切原图。</div>
    <div className={`work-grid ${category === 'images' ? 'work-grid--image-ribbon' : ''}`} id="work-grid" role="tabpanel" aria-labelledby={`tab-${category}`}><div className="sr-only" aria-live="polite">当前显示 {visible.length} 个系列</div>{category === 'images' ? <div className="image-ribbon-track">{visible.concat(visible).map((project, index) => <WorkCard project={project} onSelect={setSelected} ribbonIndex={index} duplicate={index >= visible.length} key={`${project.id}-${index}`} />)}</div> : visible.map(project => <WorkCard project={project} onSelect={setSelected} key={project.id} />)}</div>
    <div className="work-bottom mono"><span>GOOD THINGS COME FROM CURIOSITY.</span><span>MORE STORIES TO COME <b>✳</b></span></div>
    <dialog ref={dialog} className="project-dialog" onClose={() => setSelected(null)} onClick={event => { if (event.target === dialog.current) dialog.current.close(); }} aria-labelledby="dialog-title">{selected && <div className="dialog-content"><div className="dialog-top"><span className="mono">PROJECT / {selected.id} — {categories.find(item => item.id === selected.category).label}</span><button type="button" className="dialog-close" onClick={() => dialog.current.close()} aria-label="关闭作品预览">×</button></div><ProjectArtwork project={selected} inDialog onOpenOriginal={index => setLightbox({ project: selected, index })} /><div className="dialog-details"><h3 id="dialog-title">{selected.title}</h3><p>{selected.description}</p><span className="mono">{selected.year} / 素材库作品</span></div>{lightbox && <div className="original-lightbox" role="dialog" aria-modal="true" aria-label={`${lightbox.project.title}原图查看`} onClick={event => { if (event.target === event.currentTarget) setLightbox(null); }}><div className="original-lightbox-content"><div className="original-lightbox-top"><span className="mono">ORIGINAL / {String(lightbox.index + 1).padStart(2, '0')} / {String((lightbox.project.originalImages || lightbox.project.images).length).padStart(2, '0')}</span><button type="button" className="dialog-close" onClick={() => setLightbox(null)} aria-label="关闭原图">×</button></div><button type="button" className="original-lightbox-nav original-lightbox-prev" onClick={() => moveLightbox(-1)} aria-label="上一张原图"><Arrow className="reverse" /></button><img src={(lightbox.project.originalImages || lightbox.project.images)[lightbox.index]} alt={`${lightbox.project.title}第 ${lightbox.index + 1} 张原图`} /><button type="button" className="original-lightbox-nav original-lightbox-next" onClick={() => moveLightbox(1)} aria-label="下一张原图"><Arrow /></button><div className="original-lightbox-caption"><h3>{lightbox.project.title}</h3><p>原始比例 · 无裁切 · 点击左右箭头浏览</p></div></div></div>}</div>}</dialog>
  </section>;
}

function Contact() {
  const [copyState, setCopyState] = useState('');
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  async function copyWechat() {
    window.clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(profile.wechat); setCopyState('微信号已复制'); }
    catch { setCopyState(`请手动复制：${profile.wechat}`); }
    timer.current = window.setTimeout(() => setCopyState(''), 4000);
  }
  return <section id="contact" className="contact section-pad" aria-labelledby="contact-title"><div className="contact-top"><span className="section-index mono"><span>04</span><i /> NEXT STORY STARTS HERE</span><span className="contact-availability"><i /> 开放项目合作</span></div><div className="contact-main"><div className="contact-title"><h2 id="contact-title">LET’S MAKE<br /><span>SOMETHING</span><br /><em>PLAYFUL.</em><span className="contact-star" aria-hidden="true">✳</span></h2><p>好玩的想法，值得一起实现。<br /><span>潮玩摄影 / 包装插画 / IP 设计 / 视频创作</span></p></div><a href={`mailto:${profile.email}`} className="contact-arrow" aria-label="发送邮件洽谈合作"><Arrow diagonal /></a></div><div className="contact-methods"><a href={`mailto:${profile.email}`}><span className="mono">01 / EMAIL</span><strong>{profile.email}</strong><Arrow diagonal /></a><button type="button" onClick={copyWechat}><span className="mono">02 / WECHAT</span><strong>{profile.wechat}</strong><span className="copy-label">复制微信号 <Arrow /></span></button><div className="contact-message" aria-live="polite" role="status">{copyState}</div></div><footer className="footer"><a href="#home" className="footer-brand"><Mark /><div><strong>{profile.name}</strong><span className="mono">{profile.englishName}</span></div></a><div className="footer-note mono">SMALL TOYS. BIG STORIES.<br /><span>© 2026 WEN XI CHEN. ALL RIGHTS RESERVED.</span></div><a href="#home" className="back-top mono">BACK TO TOP <span>↑</span></a></footer></section>;
}

export default function App() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); }); }, { rootMargin: '-15% 0px -55% 0px' });
    document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  return <><CharacterClip /><a href="#main" className="skip-link">跳到主要内容</a><div className="site-shell"><Sidebar active={active} /><div className="mechanical-rail" aria-hidden="true"><span /><b>VISUAL COMMUNICATION SYSTEM</b><span /></div><main id="main"><Hero /><Ticker /><About /><Skills /><Works /><Contact /></main></div></>;
}

