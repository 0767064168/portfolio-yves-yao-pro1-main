USE portfolio_yves_yao;

ALTER TABLE settings
  ADD COLUMN role_en VARCHAR(180) DEFAULT '' AFTER role,
  ADD COLUMN tagline_en VARCHAR(255) DEFAULT '' AFTER tagline,
  ADD COLUMN about_text_en TEXT AFTER about_text;

ALTER TABLE projects
  ADD COLUMN title_en VARCHAR(160) DEFAULT '' AFTER title,
  ADD COLUMN category_en VARCHAR(120) DEFAULT '' AFTER category,
  ADD COLUMN description_en TEXT AFTER description;

ALTER TABLE skills
  ADD COLUMN name_en VARCHAR(100) DEFAULT '' AFTER name,
  ADD COLUMN category_en VARCHAR(100) DEFAULT '' AFTER category;

ALTER TABLE services
  ADD COLUMN title_en VARCHAR(160) DEFAULT '' AFTER title,
  ADD COLUMN description_en TEXT AFTER description;

ALTER TABLE testimonials
  ADD COLUMN client_name_en VARCHAR(120) DEFAULT '' AFTER client_name,
  ADD COLUMN company_en VARCHAR(160) DEFAULT '' AFTER company,
  ADD COLUMN quote_en TEXT AFTER quote,
  ADD COLUMN role_en VARCHAR(120) DEFAULT '' AFTER role;

UPDATE settings SET
  role_en = 'Web & Mobile Developer',
  tagline_en = 'I turn ideas into digital solutions.',
  about_text_en = 'I design modern interfaces, web and mobile applications, and management systems built to be useful, fast, and elegant.'
WHERE id = 1;

UPDATE projects SET title_en = 'Shipment management', category_en = 'Business system', description_en = 'Shipment preparation, scanning, tracking, summaries, and validation.' WHERE id = 2;
UPDATE projects SET title_en = 'Hardware store management', category_en = 'Management · Commerce', description_en = 'Management tool for inventory, sales, purchases, and operations.' WHERE id = 3;
UPDATE services SET title_en = 'Websites & e-commerce', description_en = 'Modern, responsive digital presence focused on conversion.' WHERE id = 1;
UPDATE services SET title_en = 'Web & Mobile Applications', description_en = 'Business interfaces and applications adapted to real-world use.' WHERE id = 2;
UPDATE services SET title_en = 'Management systems', description_en = 'Dashboards, HR, inventory, sales, reporting, and automation.' WHERE id = 3;
UPDATE services SET title_en = 'UI/UX & visual identity', description_en = 'Interface design, prototypes, and digital art direction.' WHERE id = 4;
UPDATE testimonials SET client_name_en = 'HR project client', company_en = 'PointageRH project', quote_en = 'A clear, fast solution adapted to our daily needs.', role_en = 'Project Manager' WHERE id = 1;
UPDATE testimonials SET client_name_en = 'Business partner', company_en = 'Shipment project', quote_en = 'A quick understanding of the need and a truly operational tool.', role_en = 'Operations Director' WHERE id = 2;
