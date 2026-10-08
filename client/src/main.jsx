import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const apiBase = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const assetBase = (import.meta.env.VITE_ASSETS_BASE_URL || apiBase || '').replace(/\/$/, '');
const apiUrl = (path) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!apiBase) return normalized;
  return `${apiBase}${normalized.startsWith('/api') ? normalized : `/api${normalized}`}`;
};
const api = async (url, options = {}) => {
  const response = await fetch(apiUrl(url), {
    credentials: apiBase ? 'include' : 'same-origin',
    ...options,
    headers: { ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...options.headers }
  });
  const contentType = response.headers.get('content-type') || '';
  const data = response.status === 204 ? {} : contentType.includes('application/json')
    ? await response.json()
    : { error: await response.text() || response.statusText };
  if (!response.ok) throw new Error(data.error || 'La requête a échoué.');
  return data;
};
const asset = (url) => {
  if (!url) return '';
  if (/^(https?:|data:|\/)/i.test(url)) return url;
  const normalized = url.replace(/^\/+/u, '');
  return assetBase ? `${assetBase}/${normalized}` : `/${normalized}`;
};
const english = {
  about: 'About', skills: 'Skills', projects: 'Projects', services: 'Services', contact: 'Contact me',
  available: 'Available for new projects', viewProjects: 'View my projects', talk: "Let's talk about your project",
  aboutTitle: 'Technology with a real', aboutEnd: 'product vision.', aboutText: 'My approach combines development, interface design and business understanding to build concrete, lasting tools.',
  skillsTitle: 'My tools to', skillsEnd: 'build.', projectsTitle: 'Projects focused on', projectsEnd: 'solutions.',
  servicesTitle: 'What I can', servicesEnd: 'build.', contactTitle: 'Have a project in mind?', contactEnd: "Let's build it.",
  contactText: 'Describe your need and outline the key points of your next digital product.',
  reviews: 'Collaborations that make a difference.', name: 'Name', message: 'Tell me about your project…',
  send: 'Send message', sent: 'Thank you, your message has been sent.', back: 'Back to projects', read: 'Read more'
};
const french = {
  about: 'À propos', skills: 'Compétences', projects: 'Projets', services: 'Services', contact: 'Me contacter',
  available: 'Disponible pour de nouveaux projets', viewProjects: 'Voir mes projets', talk: 'Parlons de votre projet',
  aboutTitle: 'La technologie avec une vraie', aboutEnd: 'vision produit.', aboutText: 'Mon approche combine développement, design d’interface et compréhension des besoins métier pour construire des outils concrets et durables.',
  skillsTitle: 'Mes outils pour', skillsEnd: 'construire.', projectsTitle: 'Des projets orientés', projectsEnd: 'solutions.',
  servicesTitle: 'Ce que je peux', servicesEnd: 'construire.', contactTitle: 'Un projet en tête ?', contactEnd: 'Construisons-le.',
  contactText: 'Décris ton besoin et prépare les grandes lignes de ton prochain produit digital.',
  reviews: 'Des collaborations qui font la différence.', name: 'Nom', message: 'Parlez-moi de votre projet…',
  send: 'Envoyer le message', sent: 'Merci, votre message a bien été envoyé.', back: 'Retour aux projets', read: 'En savoir plus'
};
const messages = { home: 'Accueil', overview: 'Tableau de bord', projects: 'Projets', skills: 'Compétences', services: 'Services', media_videos: 'Vidéos', messages: 'Messages', settings: 'Profil', testimonials: 'Témoignages', project_images: 'Galerie médias', translations: 'Traductions', admins: 'Utilisateurs', login_attempts: 'Tentatives', activity: 'Activité', admin_activity: 'Activité', backup: 'Sauvegarde' };

function useLocale() {
  const [locale, setLocale] = useState(() => {
    const requested = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('portfolio-locale');
    return ['fr', 'en'].includes(requested) ? requested : ['fr', 'en'].includes(saved) ? saved : 'fr';
  });
  useEffect(() => {
    localStorage.setItem('portfolio-locale', locale);
    document.documentElement.lang = locale;
  }, [locale]);
  return [locale, setLocale];
}

function Header({ settings, locale, setLocale, translations = {} }) {
  const fallback = locale === 'en' ? english : french;
  const t = {
    ...fallback,
    about: translations[`${locale}.nav.about`] || fallback.about,
    skills: translations[`${locale}.nav.skills`] || fallback.skills,
    projects: translations[`${locale}.nav.projects`] || fallback.projects,
    services: translations[`${locale}.nav.services`] || fallback.services,
    contact: translations[`${locale}.nav.contact`] || fallback.contact
  };
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'light' ? 'light' : '';
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);
  return <header className="header"><div className="wrap nav">
    <a className="brand" href="/"><img className="brand-logo" src={asset(settings.logo || 'assets/logo-yy.png')} alt={settings.full_name || 'Yves Yao'} /></a>
    <button className={`menu ${menuOpen ? 'is-open' : ''}`} aria-label={locale === 'en' ? 'Open menu' : 'Ouvrir le menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button>
    <nav className={menuOpen ? 'is-open' : ''}>
      {[['/#apropos', t.about], ['/#competences', t.skills], ['/#projets', t.projects], ['/#contenus', locale === 'en' ? 'Media' : 'Médias'], ['/#services', t.services], ['/#contact', t.contact]].map(([href, label]) => <a key={href} className={href === '/#contact' ? 'navbtn' : ''} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
      <button className="theme-toggle" type="button" aria-label="Changer le thème" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? '☾' : '☼'}</button>
      <button className="lang-switch" type="button" onClick={() => setLocale(locale === 'fr' ? 'en' : 'fr')}>{locale === 'fr' ? 'EN' : 'FR'}</button>
    </nav>
  </div></header>;
}

function ProjectCard({ project, locale }) {
  const category = locale === 'en' ? project.category_en || project.category : project.category;
  return <a className="project" href={`/projects/${project.id}`} data-project-filter={`${project.category} ${project.technologies || ''}`.toLowerCase()}>
    <div className="project-image"><img src={asset(project.cover_image || project.image)} alt={project.title} loading="lazy" /></div>
    <div className="project-content"><span className="project-category">{category}</span><h3>{locale === 'en' ? project.title_en || project.title : project.title}</h3><p>{(locale === 'en' ? project.description_en || project.description : project.description)?.slice(0, 150)}</p><div className="techs">{(project.technologies || '').split(',').map((tech) => <span key={tech}>{tech.trim()}</span>)}</div><span className="project-link">↗</span></div>
  </a>;
}

function Portfolio({ data, locale, setLocale, csrfToken }) {
  const fallback = locale === 'en' ? english : french;
  const translate = (key, fallbackText) => data.translations?.[`${locale}.${key}`] || fallbackText;
  const t = {
    ...fallback,
    about: translate('nav.about', fallback.about),
    skills: translate('nav.skills', fallback.skills),
    projects: translate('nav.projects', fallback.projects),
    services: translate('nav.services', fallback.services),
    contact: translate('nav.contact', fallback.contact),
    available: translate('hero.available', fallback.available),
    viewProjects: translate('cta.view_projects', fallback.viewProjects),
    talk: translate('cta.talk_project', fallback.talk),
    aboutTitle: translate('about.heading_prefix', fallback.aboutTitle),
    aboutEnd: translate('about.heading_suffix', fallback.aboutEnd),
    aboutText: translate('about.text', fallback.aboutText),
    skillsTitle: translate('skills.heading_prefix', fallback.skillsTitle),
    skillsEnd: translate('skills.heading_suffix', fallback.skillsEnd),
    projectsTitle: translate('projects.heading_prefix', fallback.projectsTitle),
    projectsEnd: translate('projects.heading_suffix', fallback.projectsEnd),
    servicesTitle: translate('services.heading_prefix', fallback.servicesTitle),
    servicesEnd: translate('services.heading_suffix', fallback.servicesEnd),
    contactTitle: translate('contact.heading_prefix', fallback.contactTitle),
    contactEnd: translate('contact.heading_suffix', fallback.contactEnd),
    contactText: translate('contact.description', fallback.contactText),
    sent: translate('contact.success', fallback.sent),
    name: translate('form.name', fallback.name),
    message: translate('placeholder.message', fallback.message),
    send: translate('form.send', fallback.send),
    reviews: `${translate('reviews.title_prefix', locale === 'en' ? 'Collaborations that make' : 'Des collaborations qui font')} ${translate('reviews.title_suffix', locale === 'en' ? 'a difference.' : 'la différence.')}`
  };
  const { settings = {}, projects = [], skills = [], services = [], videos = [], testimonials = [] } = data;
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [notice, setNotice] = useState(data.sent ? t.sent : '');
  const [sending, setSending] = useState(false);
  const techCount = new Set(projects.flatMap((project) => (project.technologies || '').split(',').map((value) => value.trim()).filter(Boolean))).size;
  const text = (fr, en) => locale === 'en' ? en : fr;
  const send = async (event) => {
    event.preventDefault();
    setSending(true);
    setNotice('');
    try {
      await api('/contact', { method: 'POST', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify({ ...form, website: event.currentTarget.elements.website.value }) });
      setNotice(t.sent);
      setForm({ name: '', email: '', message: '' });
    } catch (error) { setNotice(error.message); }
    finally { setSending(false); }
  };
  const videoUrl = (url) => {
    if ((url || '').startsWith('assets/videos/')) return { local: asset(url) };
    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'youtu.be') return { embed: `https://www.youtube.com/embed/${encodeURIComponent(parsed.pathname.slice(1))}` };
      if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(parsed.hostname)) return { embed: `https://www.youtube.com/embed/${encodeURIComponent(parsed.searchParams.get('v') || parsed.pathname.split('/').pop())}` };
      if (['vimeo.com', 'www.vimeo.com'].includes(parsed.hostname) && /^\d+$/.test(parsed.pathname.slice(1))) return { embed: `https://player.vimeo.com/video/${parsed.pathname.slice(1)}` };
    } catch { return null; }
    return null;
  };
  return <>
    <Header settings={settings} locale={locale} setLocale={setLocale} translations={data.translations} />
    <a className="skip-link" href="#main-content">{text('Aller au contenu', 'Skip to content')}</a>
    <main id="main-content">
      <section className="wrap hero"><div className="hero-copy"><div className="eyebrow">{t.available}</div><h1>{locale === 'en' ? settings.tagline_en || settings.tagline : settings.tagline}</h1><p>{locale === 'en' ? settings.about_text_en || settings.about_text : settings.about_text}</p><div className="actions"><a className="btn primary" href="#projets">{t.viewProjects} ↗</a><a className="btn ghost" href="#contact">{t.talk}</a>{<a className="btn cv-hero" href={apiUrl('/cv')}>{text('Télécharger le CV', 'Download CV')}</a>}</div><div className="meta"><span>CODE</span><i>•</i><span>DESIGN</span><i>•</i><span>{text('INNOVE', 'INNOVATE')}</span></div></div><div className="visual"><div className="code">$ <span className="orange">solution</span> = {'{'}<br />&nbsp;&nbsp;design: <span className="orange">"premium"</span>,<br />&nbsp;&nbsp;performance: <span className="orange">"fast"</span>,<br />&nbsp;&nbsp;experience: <span className="orange">"human"</span><br />{'}'};</div><div className="portrait-frame"><img className="portrait" src={asset(settings.photo || 'assets/portrait.jpg')} alt={text('Portrait professionnel', 'Professional portrait')} /></div><div className="badge"><b>&lt;/&gt;</b><br />Build Better</div></div></section>
      <div className="expertise-ticker"><div className="expertise-track"><span>PHP</span><i>✦</i><span>MYSQL</span><i>✦</i><span>JAVASCRIPT</span><i>✦</i><span>UI / UX</span><i>✦</i><span>PERFORMANCE</span><i>✦</i><span>REACT</span><i>✦</i><span>NODE.JS</span><i>✦</i></div></div>
      <section id="apropos" className="wrap section split"><div><span className="kicker">01 — {t.about.toUpperCase()}</span><h2>{t.aboutTitle} <span className="gradient">{t.aboutEnd}</span></h2></div><div className="about"><p>{locale === 'en' ? settings.about_text_en || settings.about_text : settings.about_text}</p><p>{t.aboutText}</p><div className="signature">YY —</div></div></section>
      <section className="wrap section method"><div className="method-intro"><span className="kicker">02 — {text('MÉTHODE', 'METHOD')}</span><h2>{text('De l’idée à', 'From idea to')} <span className="gradient">{text('l’impact.', 'impact.')}</span></h2><p>{text('Un processus clair pour transformer des besoins complexes en produits digitaux utiles.', 'A clear process to turn complex needs into useful digital products.')}</p></div><div className="method-steps">{[text('Comprendre', 'Understand'), text('Concevoir', 'Design'), text('Construire', 'Build'), text('Améliorer', 'Improve')].map((step, index) => <article key={step}><span>0{index + 1}</span><div><h3>{step}</h3><p>{text('Une démarche claire, utile et cohérente, orientée vers vos objectifs.', 'A thoughtful process focused on your goals and users.')}</p></div></article>)}</div></section>
      <section className="proof-strip"><div className="wrap proof-grid"><article><strong>{projects.length}</strong><span>{text('Projets présentés', 'Presented projects')}</span></article><article><strong>{skills.length}</strong><span>{text('Expertises clés', 'Core skills')}</span></article><article><strong>{techCount}</strong><span>{text('Technologies utilisées', 'Technologies used')}</span></article><article><strong>FR / EN</strong><span>{text('Langues disponibles', 'Available languages')}</span></article></div></section>
      <section id="competences" className="wrap section"><div className="section-heading"><span className="kicker">03 — {t.skills.toUpperCase()}</span><h2>{t.skillsTitle} <span className="gradient">{t.skillsEnd}</span></h2></div><div className="grid">{skills.map((skill, index) => <article className="card" key={skill.id}><span className="num">{String(index + 1).padStart(2, '0')}</span><h3>{locale === 'en' ? skill.name_en || skill.name : skill.name}</h3><p>{locale === 'en' ? skill.category_en || skill.category : skill.category}</p><div className="skill-bar"><span style={{ width: `${Math.min(100, Number(skill.level) || 0)}%` }} /></div></article>)}</div></section>
      <section id="projets" className="wrap section"><div className="section-heading"><span className="kicker">04 — {t.projects.toUpperCase()}</span><h2>{t.projectsTitle} <span className="gradient">{t.projectsEnd}</span></h2></div><div className="project-filters">{['all', ...new Set(projects.map((item) => item.category))].map((value) => <button key={value} className={`project-filter ${filter === value ? 'is-active' : ''}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === 'all' ? text('Tous', 'All') : value}</button>)}</div><div className="project-grid">{projects.filter((item) => filter === 'all' || item.category === filter).map((project) => <ProjectCard key={project.id} project={project} locale={locale} />)}</div></section>
      <section id="contenus" className="wrap section"><div className="section-heading"><span className="kicker">05 — {text('MÉDIAS', 'MEDIA')}</span><h2>{text('Vidéos &', 'Videos &')} <span className="gradient">{text('événements.', 'events.')}</span></h2></div><div className="video-grid">{videos.map((video) => { const source = videoUrl(video.video_url); return <article className="media-video" key={video.id}><div className="media-video-frame">{source?.local ? <video controls preload="metadata" poster={asset(video.poster_path)} src={source.local} onPlay={() => api(`/videos/${video.id}/view`, { method: 'POST' }).catch(() => {})} onPointerDown={() => api(`/videos/${video.id}/click`, { method: 'POST' }).catch(() => {})} /> : source?.embed ? <iframe title={video.title} src={source.embed} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="empty-state">{text('Format vidéo indisponible.', 'Video format unavailable.')}</div>}</div><h3>{locale === 'en' ? video.title_en || video.title : video.title}</h3><p>{locale === 'en' ? video.description_en || video.description : video.description}</p></article>; })}</div></section>
      <section id="services" className="wrap section"><div className="section-heading"><span className="kicker">06 — {t.services.toUpperCase()}</span><h2>{t.servicesTitle} <span className="gradient">{t.servicesEnd}</span></h2></div><div className="grid">{services.map((service, index) => <article className="card service-card" key={service.id}><span className="num">0{index + 1}</span><h3>{locale === 'en' ? service.title_en || service.title : service.title}</h3><p>{locale === 'en' ? service.description_en || service.description : service.description}</p></article>)}</div></section>
      <section className="wrap section testimonials"><div className="section-heading"><span className="kicker">07 — {text('RETOURS', 'REVIEWS')}</span><h2>{t.reviews}</h2></div><div className="grid">{testimonials.map((item) => <article className="card" key={item.id}><span className="principle-icon">“</span><p>{locale === 'en' ? item.quote_en || item.quote : item.quote}</p><h3>{locale === 'en' ? item.client_name_en || item.client_name : item.client_name}</h3><small>{locale === 'en' ? item.company_en || item.company : item.company}</small></article>)}</div></section>
      <section id="contact" className="wrap section contact-section"><div><span className="kicker">08 — {t.contact.toUpperCase()}</span><h2>{t.contactTitle} <span className="gradient">{t.contactEnd}</span></h2><p>{t.contactText}</p><div className="contact-links">{settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}{settings.phone && <a href={`tel:${settings.phone}`}>{settings.phone}</a>}</div></div><form className="form" onSubmit={send}><label>{t.name}<input required minLength="2" maxLength="120" value={form.name} autoComplete="name" onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>{translate('form.email', 'Email')}<input type="email" required maxLength="190" value={form.email} autoComplete="email" onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>{translate('form.project', text('Projet', 'Project'))}<textarea name="message" required minLength="5" maxLength="5000" placeholder={t.message} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label><input className="honeypot" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" /><div className="message-counter">{form.message.length} / 5000</div>{notice && <p role="status" className="form-notice">{notice}</p>}<button className="btn primary" type="submit" disabled={sending}>{sending ? text('Envoi en cours…', 'Sending…') : t.send} ↗</button></form></section>
    </main>
    {(settings.whatsapp || settings.phone) && <a className="whatsapp-float" href={`https://wa.me/${(settings.whatsapp || settings.phone).replace(/\D/g, '')}?text=${encodeURIComponent(text('Bonjour Yves, je souhaite vous parler d’un projet.', 'Hello Yves, I would like to discuss a project with you.'))}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><span className="whatsapp-icon">✆</span><span className="whatsapp-label">{text('Écrire sur WhatsApp', 'Chat on WhatsApp')}</span></a>}
    <div className="footer-ticker"><div className="footer-ticker-track"><span>CODE · DESIGN · {text('INNOVE', 'INNOVATE')}</span><i>✦</i><span>{locale === 'en' ? settings.role_en || settings.role : settings.role}</span></div></div>
    <footer><div className="wrap footer"><div><img className="footer-logo" src={asset(settings.logo || 'assets/logo-yy.png')} alt="Yves Yao" /><p>© {new Date().getFullYear()} {settings.full_name || 'Yves Yao'} — {locale === 'en' ? settings.role_en || settings.role : settings.role}.</p></div><a href="/admin">Administration</a></div></footer>
  </>;
}

const navItems = ['overview', 'projects', 'skills', 'services', 'media_videos', 'messages', 'settings', 'testimonials', 'project_images', 'translations', 'admins', 'activity', 'backup'];
const fieldLabels = { title: 'Titre', title_en: 'Titre anglais', category: 'Catégorie', category_en: 'Catégorie anglaise', description: 'Description', description_en: 'Description anglaise', technologies: 'Technologies', image: 'Image', project_url: 'Lien du projet', featured: 'Mis en avant', sort_order: 'Ordre', name: 'Nom', name_en: 'Nom anglais', level: 'Niveau', active: 'Actif', full_name: 'Nom complet', role: 'Rôle', role_en: 'Rôle anglais', tagline: 'Accroche', tagline_en: 'Accroche anglaise', about_text: 'À propos', about_text_en: 'À propos anglais', email: 'Email', phone: 'Téléphone', location: 'Lieu', photo: 'Photo', logo: 'Logo', linkedin: 'LinkedIn', github: 'GitHub', whatsapp: 'WhatsApp', video_url: 'Vidéo (URL ou fichier)', poster_path: 'Affiche', content_type: 'Type', published: 'Publiée', client_name: 'Nom', client_name_en: 'Nom anglais', company: 'Entreprise', company_en: 'Entreprise anglaise', quote: 'Témoignage', quote_en: 'Témoignage anglais', project_id: 'Projet', image_path: 'Chemin image', caption: 'Légende', translation_key: 'Clé', locale: 'Langue', translation_value: 'Traduction', status: 'Statut', admin_id: 'Administrateur', action: 'Action', details: 'Détails', ip_hash: 'IP (empreinte)', path: 'Page', visited_at: 'Date' };
const longFields = new Set(['description', 'description_en', 'about_text', 'about_text_en', 'quote', 'quote_en', 'message', 'translation_value']);

function AdminLogin({ csrfToken, onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    try { const result = await api('/admin/login', { method: 'POST', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify(form) }); onLogin(result); }
    catch (exception) { setError(exception.message); }
  };
  return <div className="auth"><div className="authbox"><span className="mark"><img src="/assets/logo-yy.png" alt="YY" /></span><h1>Administration</h1><p>Connectez-vous pour gérer votre portfolio.</p>{error && <div className="alert err">{error}</div>}<form onSubmit={submit}><input type="hidden" value={csrfToken} /><label>Email<input type="email" required autoComplete="username" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Mot de passe<input type="password" required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><button type="submit">Se connecter ↗</button></form><a className="action" href="/">← Retour au portfolio</a></div></div>;
}

function AdminSetup({ csrfToken }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    try {
      await api('/admin/setup', { method: 'POST', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify(form) });
      setCreated(true);
    } catch (exception) { setError(exception.message); }
  };
  return <div className="auth"><div className="authbox"><span className="mark"><img src="/assets/logo-yy.png" alt="YY" /></span><h1>Créer le compte administrateur</h1><p>Le compte initial n’est disponible qu’une seule fois.</p>{error && <div className="alert err">{error}</div>}{created ? <><div className="alert ok">Compte créé. Vous pouvez maintenant vous connecter.</div><a className="action" href="/admin">Se connecter ↗</a></> : <form onSubmit={submit}><label>Nom<input required maxLength="120" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label><label>Email<input type="email" required value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Mot de passe (12 caractères minimum)<input type="password" minLength="12" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label><button type="submit">Créer le compte ↗</button></form>}</div></div>;
}

function AdminFrame({ section, csrfToken, onLogout, children }) {
  const logout = async () => {
    try {
      await api('/admin/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } });
      onLogout();
    } catch (exception) { console.error('Admin logout failed:', exception); }
  };
  return <div className="admin-shell"><aside className="sidebar"><a className="adminbrand" href="/"><span className="mark"><img src="/assets/logo-yy.png" alt="YY" /></span><span>Portfolio<br /><small>Administration</small></span></a><nav>{navItems.map((item) => <a key={item} className={section === item || (section === 'admin_activity' && item === 'activity') ? 'is-active' : ''} href={item === 'overview' ? '/admin' : `/admin/${item}`}>{messages[item] || item}</a>)}</nav><button className="logout" onClick={logout}>Déconnexion ↗</button></aside><main className="adminmain">{children}</main></div>;
}

function AdminMessages({ admin, csrfToken, onLogout }) {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const load = async () => {
    try { setRows((await api('/admin/resources/messages')).rows); }
    catch (exception) { setError(exception.message); }
  };
  useEffect(() => { load(); }, []);
  const updateStatus = async (row, status) => {
    try {
      await api(`/admin/resources/messages/${row.id}`, { method: 'PUT', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify({ status }) });
      load();
    } catch (exception) { setError(exception.message); }
  };
  const remove = async (row) => {
    if (!confirm('Supprimer définitivement ce message ?')) return;
    try {
      await api(`/admin/resources/messages/${row.id}`, { method: 'DELETE', headers: { 'x-csrf-token': csrfToken } });
      load();
    } catch (exception) { setError(exception.message); }
  };
  return <AdminFrame csrfToken={csrfToken} section="messages" onLogout={onLogout}><div className="topbar"><h1>Messages reçus</h1><span>{rows.length} message(s) <a className="action" href={apiUrl('/admin/export/messages')}>Exporter CSV</a></span></div>{error && <div className="alert err">{error}</div>}<section className="panel">{rows.map((row) => <article className="message-item" key={row.id}><span className="message-avatar">{row.name[0]}</span><span className="message-content"><strong>{row.name} · {row.status}</strong><a href={`mailto:${encodeURIComponent(row.email)}`}>{row.email}</a><small>{row.message}</small><time>{new Date(row.created_at).toLocaleString()}</time></span><span className="row-actions"><button onClick={() => updateStatus(row, 'read')}>Lu</button><button onClick={() => updateStatus(row, 'archived')}>Archiver</button><button className="danger" onClick={() => remove(row)}>Supprimer</button></span></article>)}</section></AdminFrame>;
}

function AdminBackup({ admin, csrfToken, onLogout }) {
  return <AdminFrame csrfToken={csrfToken} section="backup" onLogout={onLogout}><section className="panel"><h1>Sauvegarde des données</h1><p>Téléchargez les données de contenu et de portfolio au format JSON. Les mots de passe administrateur et les données de session sont exclus.</p>{admin.role === 'admin' ? <><a className="btn primary" href={apiUrl('/admin/backup')}>Télécharger la sauvegarde ↗</a><p><a href={apiUrl('/admin/export/messages')}>Exporter les messages (CSV)</a></p><p><a href={apiUrl('/admin/export/media_videos')}>Exporter les vidéos (CSV)</a></p></> : <p>Accès réservé aux administrateurs.</p>}</section></AdminFrame>;
}

function AdminForm({ table, fields, row, csrfToken, onClose, onSaved }) {
  const [values, setValues] = useState(row || {});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const save = async (event) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      const method = row ? 'PUT' : 'POST';
      await api(`/admin/resources/${table}${row ? `/${row.id}` : ''}`, { method, headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify(values) });
      onSaved();
    } catch (exception) { setError(exception.message); }
    finally { setBusy(false); }
  };
  const uploadField = async (field, file) => {
    const kind = table === 'media_videos' ? 'video' : field === 'photo' ? 'photo' : field === 'poster_path' ? 'poster' : 'image';
    const data = new FormData(); data.append('file', file);
    try { const result = await api(`/admin/upload/${kind}`, { method: 'POST', headers: { 'x-csrf-token': csrfToken }, body: data }); setValues({ ...values, [field]: result.path }); }
    catch (exception) { setError(exception.message); }
  };
  const editable = fields.filter((field) => !['password_hash', 'id', 'created_at', 'updated_at'].includes(field));
  if (table === 'admins' && !row) editable.push('password');
  if (table === 'admins' && row) editable.push('password');
  return <div className="modal-backdrop" onClick={onClose}><form className="modal admin-form" onClick={(event) => event.stopPropagation()} onSubmit={save}><div className="panelhead"><h2>{row ? 'Modifier' : 'Ajouter'} — {messages[table] || table}</h2><button type="button" onClick={onClose}>×</button></div>{error && <div className="alert err">{error}</div>}{editable.map((field) => <label key={field}>{fieldLabels[field] || field}{['image', 'photo', 'logo', 'poster_path', 'video_url', 'image_path'].includes(field) && <input type="file" accept={field === 'video_url' ? 'video/mp4,video/webm,video/ogg' : 'image/*'} onChange={(event) => event.target.files[0] && uploadField(field, event.target.files[0])} />} {longFields.has(field) ? <textarea rows="4" value={values[field] ?? ''} onChange={(event) => setValues({ ...values, [field]: event.target.value })} /> : <input type={field === 'password' ? 'password' : 'text'} required={['name', 'title', 'full_name', 'email', 'category', 'description', 'client_name', 'quote', 'translation_key', 'locale', 'translation_value', 'password'].includes(field) && (!row || field !== 'password')} value={field === 'password' ? undefined : values[field] ?? ''} placeholder={field === 'password' ? '12 caractères minimum' : ''} onChange={(event) => setValues({ ...values, [field]: event.target.value })} />}</label>)}<div className="quick-actions"><button type="submit" disabled={busy}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button><button type="button" onClick={onClose}>Annuler</button></div></form></div>;
}

function AdminPanel({ admin, csrfToken, onLogout }) {
  const route = location.pathname.split('/')[2] || 'overview';
  const section = route === 'activity' ? 'admin_activity' : route;
  const [rows, setRows] = useState([]);
  const [fields, setFields] = useState([]);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState('');
  const [formRow, setFormRow] = useState(undefined);
  const load = async () => {
    setError('');
    try {
      if (section === 'overview') setOverview(await api('/admin/overview'));
      else { const data = await api(`/admin/resources/${section}`); setRows(data.rows); setFields(data.fields); }
    } catch (exception) { setError(exception.message); }
  };
  useEffect(() => { load(); }, [section]);
  const remove = async (row) => {
    if (!confirm('Supprimer définitivement cet élément ?')) return;
    try { await api(`/admin/resources/${section}/${row.id}`, { method: 'DELETE', headers: { 'x-csrf-token': csrfToken } }); load(); }
    catch (exception) { setError(exception.message); }
  };
  const setMessageStatus = async (row, status) => {
    try {
      await api(`/admin/resources/messages/${row.id}`, { method: 'PUT', headers: { 'x-csrf-token': csrfToken }, body: JSON.stringify({ status }) });
      load();
    } catch (exception) { setError(exception.message); }
  };
  const logout = async () => { try { await api('/admin/logout', { method: 'POST', headers: { 'x-csrf-token': csrfToken } }); onLogout(); } catch (exception) { setError(exception.message); } };
  const cell = (value) => String(value ?? '').slice(0, 100) || '—';
  return <div className="admin-shell"><aside className="sidebar"><a className="adminbrand" href="/"><span className="mark"><img src={asset('assets/logo-yy.png')} alt="YY" /></span><span>Portfolio<br /><small>Administration</small></span></a><nav>{navItems.map((item) => <a key={item} className={section === item ? 'is-active' : ''} href={item === 'overview' ? '/admin' : `/admin/${item}`}>{messages[item] || item}</a>)}</nav><button className="logout" onClick={logout}>Déconnexion ↗</button></aside><main className="adminmain"><div className="topbar"><div><span className="kicker">ESPACE ADMINISTRATEUR</span><h1>{messages[section] || section}</h1></div><span>Bonjour, {admin.name}</span></div>{error && <div className="alert err">{error}</div>}{section === 'overview' ? <>{overview && <><div className="admin-stats">{Object.entries(overview.counts).map(([key, value]) => <article className="stat-modern" key={key}><div className="stat-top"><span>{messages[key] || ({ newMessages: 'Nouveaux messages', visits: 'Visites (30 j)' }[key] || key)}</span><span className="stat-dot" /></div><strong>{value}</strong></article>)}</div><div className="admin-columns"><section className="panel activity-panel"><div className="panelhead"><h2>Messages récents</h2><a href="/admin/messages">Voir tout ↗</a></div>{overview.messages.length ? overview.messages.map((message) => <article className="message-item" key={message.id}><span className="message-avatar">{message.name[0]}</span><span className="message-content"><strong>{message.name}</strong><small>{message.message}</small></span><time>{new Date(message.created_at).toLocaleDateString()}</time></article>) : <p className="empty-state">Aucun message pour le moment.</p>}</section><section className="panel next-panel"><h2>Accès rapides</h2>{['projects', 'media_videos', 'settings', 'messages'].map((item) => <a className="shortcut" href={`/admin/${item}`} key={item}><span>↗</span><strong>{messages[item]}</strong><b>→</b></a>)}</section></div></>}</> : <section className="panel resource-panel"><div className="panelhead"><h2>{messages[section] || section}</h2>{!['messages', 'activity', 'admin_activity', 'login_attempts', 'visits'].includes(section) && <button onClick={() => setFormRow(null)}>+ Ajouter</button>}{section === 'media_videos' && <a className="action" href={apiUrl('/admin/export/media_videos')}>Exporter CSV</a>}</div>{rows.length ? <div className="table-scroll"><table><thead><tr>{fields.filter((field) => field !== 'password_hash').slice(0, 6).map((field) => <th key={field}>{fieldLabels[field] || field}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><>{fields.filter((field) => field !== 'password_hash').slice(0, 6).map((field) => <td key={field}>{cell(row[field])}</td>)}</><td className="row-actions">{!['messages', 'activity', 'admin_activity', 'login_attempts', 'visits'].includes(section) && <button onClick={() => setFormRow(row)}>Modifier</button>}{!['settings', 'messages', 'activity', 'admin_activity', 'login_attempts', 'visits'].includes(section) && <button className="danger" onClick={() => remove(row)}>Supprimer</button>}</td></tr>)}</tbody></table></div> : <p className="empty-state">Aucune donnée à afficher.</p>}</section>}{formRow !== undefined && <AdminForm table={section} fields={fields} row={formRow} csrfToken={csrfToken} onClose={() => setFormRow(undefined)} onSaved={() => { setFormRow(undefined); load(); }} />}</main></div>;
}

function ProjectDetail({ data, locale, setLocale }) {
  const id = location.pathname.split('/').pop();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { api(`/projects/${id}`).then(setDetail).catch((exception) => setError(exception.message)); }, [id]);
  if (error) return <main className="wrap section"><h1>{error}</h1><a className="btn" href="/#projets">{locale === 'en' ? english.back : french.back}</a></main>;
  if (!detail) return <main className="wrap section">Chargement…</main>;
  const project = detail.project;
  return <>  <Header settings={data.settings || {}} locale={locale} setLocale={setLocale} translations={data.translations} /><main className="wrap section project-detail-grid"><div><a href="/#projets">← {locale === 'en' ? english.back : french.back}</a><span className="kicker"> {project.category}</span><h1>{locale === 'en' ? project.title_en || project.title : project.title}</h1><p>{locale === 'en' ? project.description_en || project.description : project.description}</p><div className="techs">{(project.technologies || '').split(',').map((tech) => <span key={tech}>{tech.trim()}</span>)}</div>{project.project_url && <a className="btn primary" href={project.project_url} target="_blank" rel="noreferrer">{locale === 'en' ? 'Visit project' : 'Voir le projet'} ↗</a>}</div><div className="media-gallery-admin">{detail.images.map((image) => <img key={image.id} src={asset(image.image_path)} alt={image.caption || project.title} />)}</div></main></>;
}

function App() {
  const [locale, setLocale] = useLocale();
  const [data, setData] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [setupAvailable, setSetupAvailable] = useState(false);
  const [error, setError] = useState('');
  const isAdmin = location.pathname.startsWith('/admin');
  useEffect(() => {
    Promise.all([api('/public'), api('/admin/setup'), api('/admin/session')]).then(([publicData, setupData, sessionData]) => {
      setData(publicData); setCsrfToken(setupData.csrfToken); setSetupAvailable(setupData.available); setAdmin(sessionData.admin);
    }).catch((exception) => setError(exception.message));
  }, []);
  useEffect(() => {
    if (isAdmin) return;
    api('/visits', { method: 'POST', body: JSON.stringify({ path: location.pathname }) }).catch((exception) => console.error('Visit tracking failed:', exception));
  }, [isAdmin]);
  useEffect(() => {
    const href = isAdmin ? '/admin/assets/admin.css' : '/assets/site.css?v=25';
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; link.dataset.appStyle = 'true';
    document.head.append(link);
    return () => link.remove();
  }, [isAdmin]);
  useEffect(() => {
    if (isAdmin) {
      document.title = 'Administration — YY';
      return;
    }
    const settings = data?.settings || {};
    document.title = `${settings.full_name || 'Yves Yao'} — ${locale === 'en' ? settings.role_en || settings.role || 'Portfolio' : settings.role || 'Portfolio professionnel'}`;
    const description = locale === 'en' ? settings.about_text_en || settings.about_text : settings.about_text;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.append(meta);
    }
    meta.content = description || '';
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.append(canonical);
    }
    canonical.href = location.href.split('#')[0];
  }, [isAdmin, data, locale]);
  if (error && !data) return <main className="wrap section"><h1>Impossible de charger le portfolio</h1><p>{error}</p><p>Vérifiez que MySQL est démarré et que la configuration du serveur est valide.</p></main>;
  if (!data) return <main className="wrap section">Chargement…</main>;
  if (location.pathname.startsWith('/projects/')) return <ProjectDetail data={data} locale={locale} setLocale={setLocale} />;
  if (isAdmin) return admin ? location.pathname === '/admin/messages' ? <AdminMessages admin={admin} csrfToken={csrfToken} onLogout={() => setAdmin(null)} /> : location.pathname === '/admin/backup' ? <AdminBackup admin={admin} csrfToken={csrfToken} onLogout={() => setAdmin(null)} /> : <AdminPanel admin={admin} csrfToken={csrfToken} onLogout={() => setAdmin(null)} /> : location.pathname.endsWith('/setup') && setupAvailable ? <AdminSetup csrfToken={csrfToken} /> : <AdminLogin csrfToken={csrfToken} onLogin={(result) => { setAdmin(result.admin); setCsrfToken(result.csrfToken); location.href = '/admin'; }} />;
  return <Portfolio data={data} locale={locale} setLocale={setLocale} csrfToken={csrfToken} />;
}

const reactRoot = createRoot(document.getElementById('root'));
if (import.meta.hot) import.meta.hot.dispose(() => reactRoot.unmount());
reactRoot.render(<App />);
