CREATE DATABASE IF NOT EXISTS portfolio_yves_yao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE portfolio_yves_yao;

CREATE TABLE IF NOT EXISTS media_videos (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  title_en VARCHAR(180) DEFAULT '',
  description TEXT,
  description_en TEXT,
  video_url VARCHAR(500) NOT NULL,
  poster_path VARCHAR(255) DEFAULT '',
  content_type ENUM('formation','publicite','seminaire') NOT NULL DEFAULT 'formation',
  published TINYINT(1) NOT NULL DEFAULT 1,
  view_count INT UNSIGNED NOT NULL DEFAULT 0,
  click_count INT UNSIGNED NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admins (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin',
  active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  id TINYINT UNSIGNED PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  role VARCHAR(180) NOT NULL,
  tagline VARCHAR(255) NOT NULL,
  about_text TEXT NOT NULL,
  role_en VARCHAR(180) DEFAULT '',
  tagline_en VARCHAR(255) DEFAULT '',
  about_text_en TEXT,
  email VARCHAR(190) DEFAULT '',
  phone VARCHAR(50) DEFAULT '',
  location VARCHAR(120) DEFAULT '',
  photo VARCHAR(255) DEFAULT 'assets/portrait.jpg',
  logo VARCHAR(255) DEFAULT 'assets/logo-yy.png',
  linkedin VARCHAR(255) DEFAULT '',
  github VARCHAR(255) DEFAULT '',
  whatsapp VARCHAR(255) DEFAULT '',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO settings (id,full_name,role,tagline,about_text,email,phone,location,photo,logo)
VALUES (1,'Yves Yao','Développeur Web & Mobile','Je transforme les idées en solutions digitales.','Je conçois des interfaces modernes, des applications web et mobiles et des systèmes de gestion pensés pour être utiles, rapides et élégants.','','','Côte d’Ivoire','assets/portrait.jpg','assets/logo-yy.png');

CREATE TABLE IF NOT EXISTS projects (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  title_en VARCHAR(160) DEFAULT '',
  category VARCHAR(120) NOT NULL,
  category_en VARCHAR(120) DEFAULT '',
  description TEXT NOT NULL,
  description_en TEXT,
  technologies VARCHAR(255) DEFAULT '',
  image VARCHAR(255) DEFAULT '',
  project_url VARCHAR(255) DEFAULT '',
  featured TINYINT(1) DEFAULT 0,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO projects (id,title,category,description,technologies,featured,sort_order) VALUES
(1,'PointageRH','Web App · RH','Dashboard RH avec pointage, congés, employés et rapports exportables.','PHP, MySQL, JavaScript, Chart.js, XLSX',1,1),
(2,'Gestion des expéditions','Système métier','Préparation, scan, flashage, récapitulatif et validation des expéditions.','PHP, MySQL, API, Offline',1,2),
(3,'Gestion de quincaillerie','Management · Commerce','Outil de gestion des stocks, ventes, achats et opérations.','PHP, MySQL, Dashboard',0,3);

CREATE TABLE IF NOT EXISTS skills (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) DEFAULT '',
  category VARCHAR(100) NOT NULL,
  category_en VARCHAR(100) DEFAULT '',
  level TINYINT UNSIGNED DEFAULT 80,
  sort_order INT DEFAULT 0
) ENGINE=InnoDB;

INSERT IGNORE INTO skills (name,category,level,sort_order) VALUES
('HTML / CSS / JavaScript','Front-end',95,1),('PHP / MySQL','Back-end',90,2),('Node.js','Back-end',85,3),('React','Front-end',85,4),('UI/UX Design','Design',80,5),('Git & GitHub','Workflow',85,6);

CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(160) NOT NULL,
  title_en VARCHAR(160) DEFAULT '',
  description TEXT NOT NULL,
  description_en TEXT,
  sort_order INT DEFAULT 0,
  active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB;

INSERT IGNORE INTO services (title,description,sort_order) VALUES
('Sites Web & e-commerce','Présence digitale moderne, responsive et orientée conversion.',1),
('Applications Web & Mobile','Interfaces métier et applications adaptées aux usages réels.',2),
('Systèmes de gestion','Dashboards, RH, stocks, ventes, rapports et automatisation.',3),
('UI/UX & identité visuelle','Design d’interfaces, prototypes et direction artistique digitale.',4);

CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('new','read','archived') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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

CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ip_hash CHAR(64) NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_login_attempts_ip_time (ip_hash, attempted_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_activity (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  admin_id INT UNSIGNED NULL,
  action VARCHAR(120) NOT NULL,
  details VARCHAR(255) DEFAULT '',
  ip_hash CHAR(64) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_admin_activity_created (created_at),
  CONSTRAINT fk_admin_activity_admin FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS interaction_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_name VARCHAR(40) NOT NULL,
  ip_hash CHAR(64) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_interaction_events_name_time (event_name, created_at)
) ENGINE=InnoDB;
