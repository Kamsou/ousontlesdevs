CREATE TABLE `podcasts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`podcast_name` text NOT NULL,
	`description` text,
	`guest_name` text,
	`url` text NOT NULL,
	`image_url` text,
	`highlight` integer DEFAULT false,
	`active` integer DEFAULT true,
	`created_at` integer
);

INSERT INTO `podcasts` (`title`, `podcast_name`, `description`, `guest_name`, `url`, `highlight`, `active`, `created_at`)
VALUES (
	'Vue.js, Nuxt.js et projets concrets : comment Camille Coutens transforme les idées en applis',
	'Dev Zone',
	'Camille Coutens, développeuse web et mobile spécialisée en Vue.js et Nuxt.js, partage son parcours et sa philosophie : écouter, itérer, améliorer. Discussion autour de ses projets, son stack technique et sa vision du développement.',
	'Camille Coutens',
	'https://open.spotify.com/episode/6mYbiXgH76KsLBubN0L9Ny',
	1,
	1,
	unixepoch()
);
