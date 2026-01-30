ALTER TABLE `podcasts` ADD `published_at` integer;

--> statement-breakpoint
UPDATE `podcasts` SET `published_at` = 1734480000 WHERE `url` = 'https://open.spotify.com/episode/6mYbiXgH76KsLBubN0L9Ny';

--> statement-breakpoint
INSERT INTO `podcasts` (`title`, `podcast_name`, `description`, `guest_name`, `url`, `highlight`, `active`, `published_at`, `created_at`)
VALUES
('Le plafond de verre explose ! De développeuse à directrice', 'Techlipstick', 'Sihame Allali a souvent été la seule femme dans ses équipes tech. De développeuse à directrice de la transformation, elle partage son parcours sans filtre.', 'Sihame Allali', 'https://open.spotify.com/episode/21gJ541qUKUsc5yNn5GZba', 0, 1, 1707436800, unixepoch()),
('De mère au foyer à conceptrice et développeuse UX/UI', 'Hello Reconversion', 'Marjorie Ngoupende, mère de cinq enfants, raconte sa reconversion vers le dev UX/UI. Formations, stages, mentorat et vie de famille.', 'Marjorie Ngoupende', 'https://creators.spotify.com/pod/profile/muriel08/episodes/15--Marjorie--de-mre-au-foyer--Conceptrice-et-dveloppeuse-UXUI-e2nkclp', 0, 1, 1724716800, unixepoch()),
('De peintre en bâtiment à développeuse WordPress', 'Hello Reconversion', 'Aline partage sa reconversion atypique du bâtiment vers le développement WordPress.', 'Aline', 'https://podcasts.apple.com/us/podcast/18-aline-de-peintre-en-b%C3%A2timent-%C3%A0-d%C3%A9veloppeuse-wordpress/id1742449972?i=1000669788396', 0, 1, 1726531200, unixepoch()),
('Ségolène, Développeuse Web Full Stack chez Doctolib', 'WomenInTech', 'Ségolène, développeuse full stack chez Doctolib, partage son quotidien et son parcours dans la tech.', 'Ségolène', 'https://www.pole-emploi.fr/actualites/plein-phare-sur-les-metiers-du-n/podcast-womenintech---segolene-d.html', 0, 1, 1615334400, unixepoch());
