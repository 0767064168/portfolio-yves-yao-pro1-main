SET NAMES utf8mb4;

UPDATE settings
SET role = 'Développeur Web & Mobile',
    tagline = 'Je transforme les idées en solutions digitales.',
    about_text = 'Je conçois des interfaces modernes, des applications web et mobiles et des systèmes de gestion pensés pour être utiles, rapides et élégants.',
    location = 'Côte d’Ivoire'
WHERE id = 1;

UPDATE projects SET description = 'Dashboard RH avec pointage, congés, employés et rapports exportables.' WHERE id = 1;
UPDATE projects SET description = 'Préparation, scan, flashage, récapitulatif et validation des expéditions.' WHERE id = 2;
UPDATE projects SET description = 'Outil de gestion des stocks, ventes, achats et opérations.' WHERE id = 3;

UPDATE services SET description = 'Présence digitale moderne, responsive et orientée conversion.' WHERE id = 1;
UPDATE services SET description = 'Interfaces métier et applications adaptées aux usages réels.' WHERE id = 2;
UPDATE services SET description = 'Dashboards, RH, stocks, ventes, rapports et automatisation.' WHERE id = 3;
UPDATE services SET description = 'Design d’interfaces, prototypes et direction artistique digitale.' WHERE id = 4;
UPDATE services SET title = 'Systèmes de gestion' WHERE id = 3;
UPDATE services SET title = 'UI/UX & identité visuelle', description = 'Design d’interfaces, prototypes et direction artistique digitale.' WHERE id = 4;