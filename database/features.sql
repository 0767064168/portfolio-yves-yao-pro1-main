USE portfolio_yves_yao;

CREATE TABLE IF NOT EXISTS project_images (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  project_id INT UNSIGNED NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  caption VARCHAR(180) DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_images_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS testimonials (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(120) NOT NULL,
  client_name_en VARCHAR(120) DEFAULT '',
  company VARCHAR(160) DEFAULT '',
  company_en VARCHAR(160) DEFAULT '',
  quote TEXT NOT NULL,
  quote_en TEXT,
  role VARCHAR(120) DEFAULT '',
  role_en VARCHAR(120) DEFAULT '',
  active TINYINT(1) DEFAULT 1,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO testimonials (id, client_name, company, quote, role, sort_order) VALUES
(1, 'Client projet RH', 'Projet PointageRH', 'Une solution claire, rapide et adaptée à nos besoins quotidiens.', 'Responsable projet', 1),
(2, 'Partenaire métier', 'Projet expéditions', 'Une compréhension rapide du besoin et un outil vraiment opérationnel.', 'Direction des opérations', 2);

CREATE TABLE IF NOT EXISTS translations (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  translation_key VARCHAR(120) NOT NULL,
  locale CHAR(2) NOT NULL,
  translation_value TEXT NOT NULL,
  UNIQUE KEY uq_translation_locale (translation_key, locale)
) ENGINE=InnoDB;

INSERT IGNORE INTO translations (translation_key, locale, translation_value) VALUES
('nav.about', 'fr', 'À propos'), ('nav.about', 'en', 'About'),
('nav.skills', 'fr', 'Compétences'), ('nav.skills', 'en', 'Skills'),
('nav.projects', 'fr', 'Projets'), ('nav.projects', 'en', 'Projects'),
('nav.services', 'fr', 'Services'), ('nav.services', 'en', 'Services'),
('nav.contact', 'fr', 'Me contacter'), ('nav.contact', 'en', 'Contact me'),
('skip.link', 'fr', 'Aller au contenu'), ('skip.link', 'en', 'Skip to content'),
('hero.available', 'fr', 'Disponible pour de nouveaux projets'), ('hero.available', 'en', 'Available for new projects'),
('cta.view_projects', 'fr', 'Voir mes projets'), ('cta.view_projects', 'en', 'View my projects'),
('cta.talk_project', 'fr', 'Parlons de votre projet'), ('cta.talk_project', 'en', "Let's talk about your project"),
('kicker.about', 'fr', 'À PROPOS'), ('kicker.about', 'en', 'ABOUT'),
('kicker.skills', 'fr', 'STACK'), ('kicker.skills', 'en', 'STACK'),
('kicker.projects', 'fr', 'PROJETS'), ('kicker.projects', 'en', 'PROJECTS'),
('kicker.services', 'fr', 'SERVICES'), ('kicker.services', 'en', 'SERVICES'),
('kicker.contact', 'fr', 'CONTACT'), ('kicker.contact', 'en', 'CONTACT'),
('kicker.reviews', 'fr', 'RETOURS'), ('kicker.reviews', 'en', 'REVIEWS'),
('about.heading_prefix', 'fr', 'La technologie avec une vraie'), ('about.heading_prefix', 'en', 'Technology with a real'),
('about.heading_suffix', 'fr', 'vision produit.'), ('about.heading_suffix', 'en', 'product vision.'),
('about.text', 'fr', 'Mon approche combine développement, design d’interface et compréhension des besoins métier pour construire des outils concrets et durables.'), ('about.text', 'en', 'My approach combines development, interface design and business understanding to build concrete, lasting tools.'),
('skills.heading_prefix', 'fr', 'Mes outils pour'), ('skills.heading_prefix', 'en', 'My tools to'),
('skills.heading_suffix', 'fr', 'construire.'), ('skills.heading_suffix', 'en', 'build.'),
('skills.expertise', 'fr', 'Expertise'), ('skills.expertise', 'en', 'Expertise'),
('projects.heading_prefix', 'fr', 'Des projets orientés'), ('projects.heading_prefix', 'en', 'Projects focused on'),
('projects.heading_suffix', 'fr', 'solutions.'), ('projects.heading_suffix', 'en', 'solutions.'),
('services.heading_prefix', 'fr', 'Ce que je peux'), ('services.heading_prefix', 'en', 'What I can'),
('services.heading_suffix', 'fr', 'construire.'), ('services.heading_suffix', 'en', 'build.'),
('contact.heading_prefix', 'fr', 'Un projet en tête ?'), ('contact.heading_prefix', 'en', 'Have a project in mind?'),
('contact.heading_suffix', 'fr', 'Construisons-le.'), ('contact.heading_suffix', 'en', "Let's build it."),
('contact.description', 'fr', 'Décris ton besoin et prépare les grandes lignes de ton prochain produit digital.'), ('contact.description', 'en', 'Describe your need and outline the key points of your next digital product.'),
('contact.success', 'fr', 'Merci, votre message a bien été envoyé.'), ('contact.success', 'en', 'Thank you, your message has been sent.'),
('form.name', 'fr', 'Nom'), ('form.name', 'en', 'Name'),
('form.email', 'fr', 'Email'), ('form.email', 'en', 'Email'),
('form.project', 'fr', 'Projet'), ('form.project', 'en', 'Project'),
('placeholder.name', 'fr', 'Votre nom'), ('placeholder.name', 'en', 'Your name'),
('placeholder.email', 'fr', 'vous@exemple.com'), ('placeholder.email', 'en', 'you@example.com'),
('placeholder.message', 'fr', 'Parlez-moi de votre projet…'), ('placeholder.message', 'en', 'Tell me about your project…'),
('form.send', 'fr', 'Envoyer le message'), ('form.send', 'en', 'Send message'),
('reviews.title_prefix', 'fr', 'Des collaborations qui font'), ('reviews.title_prefix', 'en', 'Collaborations that make'),
('reviews.title_suffix', 'fr', 'la différence.'), ('reviews.title_suffix', 'en', 'a difference.'),
('footer.role', 'fr', 'Développeur Web & Mobile'), ('footer.role', 'en', 'Web & Mobile Developer'),
('footer.tagline', 'fr', 'CODE · DESIGN · INNOVE'), ('footer.tagline', 'en', 'CODE · DESIGN · INNOVATE');

CREATE TABLE IF NOT EXISTS visits (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  path VARCHAR(255) NOT NULL,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_hash CHAR(64) DEFAULT ''
) ENGINE=InnoDB;
