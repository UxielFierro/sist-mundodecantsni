--
-- PostgreSQL database dump
--

\restrict oq4T4PDdcJ02h6ndJuAbpEEfY7PwkW0pbhLPu6BhPoQiYDyvb6HsCB5nda9wBw5

-- Dumped from database version 17.2
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
7000f3ff-5dc8-4072-b2bc-f018ab36da6f	0d8411d873fcc995a5bac19daace3bcd7b2351190be8e06c0dd737f41d281808	2026-07-11 12:08:18.815351-06	20260711180818_init	\N	\N	2026-07-11 12:08:18.620825-06	1
e08a7622-91c8-4b3f-8075-14e15533e043	fdc95526bc27344ce677bb64f807a55aef8908be587cb70ce241faf3d679d567	2026-07-11 12:57:30.050561-06	20260711185730_add_fragrance_notes	\N	\N	2026-07-11 12:57:30.039149-06	1
6e9f725c-6254-4367-903b-7cce5d7486bf	059c9b6dfa2cdde60d7fc135680db342213af74b19afa6fd391110d14af48120	2026-07-11 13:32:28.442054-06	20260711193228_add_show_in_catalog	\N	\N	2026-07-11 13:32:28.433253-06	1
5c501c07-61ea-4023-a8e6-fa81d9a2f8b2	987c018417b773238f027e72e793c06efdde9e5ede609ca16aa78a696d14ad8d	2026-07-12 01:37:21.936269-06	20260712073713_add_olfactory_notes	\N	\N	2026-07-12 01:37:21.928488-06	1
ca6e3ae0-c16a-4904-89b6-f759d29204fa	403bbfbc5bb704c175fc51612281eb6c1ca5edc1b722b6439e90004c2d95400b	2026-07-12 01:39:15.797786-06	20260712073915_drop_old_note_fields	\N	\N	2026-07-12 01:39:15.786702-06	1
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brands (id, name, slug, created_at) FROM stdin;
1	Xerjoff	xerjoff	2026-07-11 18:08:54.783
2	Parfums de Marly	parfums-de-marly	2026-07-11 18:08:54.789
3	BDK Parfums	bdk-parfums	2026-07-11 18:08:54.792
4	Goldfield & Banks	goldfield-banks	2026-07-11 18:08:54.795
5	Mancera	mancera	2026-07-11 18:08:54.797
6	Maison Margiela	maison-margiela	2026-07-11 18:08:54.799
7	Emporio Armani	emporio-armani	2026-07-11 18:08:54.802
8	Jean Paul Gaultier	jean-paul-gaultier	2026-07-11 18:08:54.804
9	Valentino	valentino	2026-07-11 18:08:54.808
10	Giorgio Armani	giorgio-armani	2026-07-11 18:08:54.811
11	Dolce&Gabbana	dolce-gabbana	2026-07-11 18:08:54.813
12	Montblanc	montblanc	2026-07-11 18:08:54.815
13	Guerlain	guerlain	2026-07-11 18:08:54.817
14	Jesus Del Pozo	jesus-del-pozo	2026-07-11 18:08:54.819
15	Ralph Lauren	ralph-lauren	2026-07-11 18:08:54.821
16	Azzaro	azzaro	2026-07-11 18:08:54.825
17	Rasasi	rasasi	2026-07-11 18:08:54.827
18	Afnan	afnan	2026-07-11 18:08:54.83
19	Lattafa	lattafa	2026-07-11 18:08:54.832
20	French Avenue	french-avenue	2026-07-11 18:08:54.834
21	Armaf	armaf	2026-07-11 18:08:54.836
22	Al Haramain	al-haramain	2026-07-11 18:08:54.839
23	Rayhaan	rayhaan	2026-07-11 18:08:54.842
24	Burberry	burberry	2026-07-11 18:08:54.844
25	Prada	prada	2026-07-11 18:08:54.846
26	Yves Saint Laurent	yves-saint-laurent	2026-07-11 18:08:54.848
27	Ariana Grande	ariana-grande	2026-07-11 18:08:54.85
28	Moschino	moschino	2026-07-11 18:08:54.852
29	Paris Corner	paris-corner	2026-07-11 18:08:54.854
30	Jo Milano	jo-milano	2026-07-11 18:08:54.857
31	Zimaya	zimaya	2026-07-11 18:08:54.86
32	Versace	versace	2026-07-11 18:08:54.862
33	Creed	creed	2026-07-11 18:08:54.864
34	Rabanne	rabanne	2026-07-11 18:08:54.866
35	Bentley	bentley	2026-07-11 18:08:54.868
36	Givenchy	givenchy	2026-07-11 18:08:54.87
37	Club de Nuit	club-de-nuit	2026-07-11 18:08:54.872
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, name, slug, description, created_at) FROM stdin;
1	Nicho	nicho	\N	2026-07-11 18:08:54.733
2	Diseñador	disenador	\N	2026-07-11 18:08:54.739
3	Árabe	arabe	\N	2026-07-11 18:08:54.743
4	Damas	damas	\N	2026-07-11 18:08:54.745
5	Insumos	insumos	\N	2026-07-11 18:08:54.748
6	Miniatura	miniatura	\N	2026-07-11 18:08:54.75
7	Regalía	regalia	\N	2026-07-11 18:08:54.753
\.


--
-- Data for Name: presentations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.presentations (id, name, slug, unit_type, unit_value, quantity, sort_order, created_at) FROM stdin;
1	2ml	2ml	ml	2.000000000000000000000000000000	1	1	2026-07-11 18:08:54.757
2	5ml	5ml	ml	5.000000000000000000000000000000	1	2	2026-07-11 18:08:54.763
3	10ml	10ml	ml	10.000000000000000000000000000000	1	3	2026-07-11 18:08:54.766
4	25ml	25ml	ml	25.000000000000000000000000000000	1	4	2026-07-11 18:08:54.768
5	100ml	100ml	ml	100.000000000000000000000000000000	1	5	2026-07-11 18:08:54.771
6	Individual	individual	unit	1.000000000000000000000000000000	1	6	2026-07-11 18:08:54.775
7	Docena	docena	unit	1.000000000000000000000000000000	12	7	2026-07-11 18:08:54.778
8	Paquete de 10	paquete-10	unit	1.000000000000000000000000000000	10	8	2026-07-11 18:08:54.781
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products (id, codigo, name, slug, description, category_id, brand_id, is_gift, is_full_bottle, is_supply, notes, active, created_at, updated_at, show_in_catalog, olfactory_notes) FROM stdin;
8	MDN0011	BDK Parfums Citrus Riviera	bdk-parfums-citrus-riviera	La costa francesa en un frasco. Cítricos chispeantes con un fondo amaderado y almizclado.	1	3	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.343	2026-07-15 05:54:36.85	t	Limón, Bergamota, Pomelo, Lavanda, Almizcle, Cedro
9	MDN0013	BDK Parfums Sel d´Argent	bdk-parfums-sel-d-argent	Un acorde marino y mineral con un toque de ládano y ámbar que evoca la brisa del océano al atardecer.	1	3	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.365	2026-07-15 05:54:36.855	t	Limón, Sal, Ládano, Almizcle, Ámbar, Madera
11	MDN0017	Mancera Red Tobbaco	mancera-red-tobbaco	Intenso y audaz. El tabaco se encuentra con especias cálidas y cuero en una fragancia que deja huella.	1	5	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.406	2026-07-15 05:54:36.863	t	Manzana, Canela, Azafrán, Tabaco, Ámbar, Cuero
13	MDN0021	Mancera Amore Caffé	mancera-amore-caffe	Un placer gourmand que huele a café recién hecho con caramelo y vainilla. Dulce, acogedor e irresistible.	1	5	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.449	2026-07-15 05:54:36.871	t	Café, Caramelo, Leche, Vainilla, Ámbar, Almizcle
16	MDN0029	Jean Paul Gaultier Le Beau Le Parfum	jean-paul-gaultier-le-beau-le-parfum	Un paraíso tropical en fragancia. La piña y el coco se combinan con maderas exóticas para un efecto hipnótico.	2	8	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.506	2026-07-15 05:54:36.89	t	Bergamota, Piña, Coco, Madera de Cedro, Almizcle
17	MDN0031	Jean Paul Gaultier Le Male Le Parfum	jean-paul-gaultier-le-male-le-parfum	El clásico reinterpretado. Lavanda y cardamomo se encuentran con un corazón de cuero y vainilla.	2	8	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.525	2026-07-15 05:54:36.895	t	Cardamomo, Lavanda, Cuero, Vainilla, Ámbar
24	MDN0045	Dolce&Gabbana Light Blue Italian Love	dolce-gabbana-light-blue-italian-love	El amor italiano capturado en fragancia. Cítricos vibrantes con un toque herbal y salino.	2	11	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.657	2026-07-15 06:24:11.135	f	Limón, Pomelo, Sal, Romero, Madera de Cedro
21	MDN0039	Valentino Uomo Intense	valentino-uomo-intense	Un iris empolvado se funde con cuero y vainilla para crear una fragancia sofisticada y adictiva.	2	9	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.601	2026-07-15 05:54:36.913	t	Iris, Cuero, Vainilla, Ámbar, Madera de Cedro
46	MDN0091	Yves Saint Laurent Black Opium OverRed	yves-saint-laurent-black-opium-overred	Black Opium reinventado con cereza jugosa y café intenso. Dulce, oscura y provocadora.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.069	2026-07-15 06:29:19.83	f	Cereza, Café, Vainilla, Almizcle, Ámbar
26	MDN0049	Montblanc Legend Spirit	montblanc-legend-spirit	Fresca, moderna y versátil. Ideal para el día a día con un toque de lavanda y cardamomo.	2	12	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.72	2026-07-15 05:54:36.949	t	Pomelo, Cardamomo, Lavanda, Almizcle, Ámbar
27	MDN0051	Montblanc Explorer	montblanc-explorer	Para el explorador moderno. Cítricos chispeantes que dan paso a cuero y maderas ahumadas.	2	12	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.739	2026-07-15 05:54:36.953	t	Bergamota, Pimienta, Cuero, Cedro, Ámbar
30	MDN0057	Jesus Del Pozo Halloween Man X	jesus-del-pozo-halloween-man-x	Misterioso y seductor. La canela y el tabaco crean un aura cálida y envolvente.	2	14	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.796	2026-07-15 06:28:05.835	t	Manzana, Canela, Tabaco, Ámbar, Cuero
52	MDN0103	Armaf Club De Nuit Untold	armaf-club-de-nuit-untold	El misterio de la noche. Azafrán y rosa con un corazón ambarino y cuero.	3	21	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.178	2026-07-15 06:31:29.9	f	Bergamota, Rosa, Azafrán, Ámbar, Almizcle, Cuero
36	MDN0069	Afnan 9pm Rebel	afnan-9pm-rebel	Rebelde y dulce. Manzana roja y canela con un fondo cálido de vainilla y ámbar.	3	18	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.893	2026-07-15 05:54:37.062	t	Manzana Roja, Canela, Vainilla, Ámbar, Almizcle
43	MDN0085	Burberry Her Elixir	burberry-her-elixir	Una explosión de frutos rojos bañados en vainilla y ámbar. Dulce, moderna y adictiva.	3	24	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.011	2026-07-15 05:54:37.013	t	Fresa, Frambuesa, Vainilla, Almizcle, Sándalo, Ámbar
41	MDN0082	Rayhaan Tiger Cal Cologne Edition	rayhaan-tiger-cal-cologne-edition	La fuerza de un tigre en fragancia. Lavanda y cuero con un fondo amaderado.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.985	2026-07-15 07:03:59.051	f	Bergamota, Lavanda, Cuero, Ámbar, Almizcle, Cedro
42	MDN0083	Lattafa Honor & Glory	lattafa-honor-glory	Un honor real con piña y coco cremosos. Dulce, frutal y sorprendentemente elegante.	3	19	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.993	2026-07-15 05:54:37.076	t	Piña, Coco, Vainilla, Ámbar, Almizcle, Cedro
49	MDN0097	Lattafa Yara Candy	lattafa-yara-candy	Un caramelo de fresa cremoso. Dulce, juvenil y adorablemente coqueto.	3	19	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.123	2026-07-15 05:54:37.08	t	Fresa, Vainilla, Caramelo, Almizcle, Leche
54	MDN0108	Paris Corner Fire Your Desire	paris-corner-fire-your-desire	Enciende tu deseo. Cereza y almendra con un toque de cuero y ámbar.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.208	2026-07-15 06:33:58.296	f	Cereza, Almendra, Vainilla, Ámbar, Cuero
51	MDN0101	Paris Corner Khair Pistachio	paris-corner-khair-pistachio	Un pistacho cremoso y adictivo. Dulce, gourmand y perfectamente equilibrado.	3	29	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.161	2026-07-15 06:34:18.728	t	Pistacho, Crema, Vainilla, Almizcle, Ámbar, Leche
58	MDN0112	Frascos Vacios Negros 8ml	frascos-vacios-negros-8ml	Frascos vacíos negros de 8ml con atomizador. Elegantes y prácticos para llevar tu perfume a todas partes.	5	\N	t	f	t	Migrado desde Excel	t	2026-07-11 18:46:52.251	2026-07-15 05:54:37.169	t	\N
44	MDN0087	Jean Paul Gaultier Scandal Le Parfum	jean-paul-gaultier-scandal-le-parfum	Escandalosamente dulce y floral. La miel y el jazmín crean un dúo provocador e inolvidable.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.03	2026-07-15 06:21:48.666	f	Miel, Jazmín, Vainilla, Ámbar, Cuero
34	MDN0065	Rasasi Hawas Ice	rasasi-hawas-ice	Una versión más fresca y mentolada del clásico Hawas. Ideal para el calor tropical.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.854	2026-07-15 06:30:10.541	f	Menta, Pomelo, Lavanda, Ámbar, Almizcle, Cedro
5	MDN0005	Xerjoff Erba Pura	xerjoff-erba-pura	Una explosión de frutas bañadas en almíbar con un fondo almizclado y ambarino. Dulce, vibrante e inconfundible.	1	1	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.28	2026-07-19 16:01:06.968	t	Limón, Bergamota, Naranja, Frutas Rojas, Almizcle, Ámbar
56	MDN0110	Jeringas con Boquilla	jeringas-con-boquilla	Jeringas con boquilla para decantar perfumes. Ideales para transferir fragancias de forma precisa.	5	\N	t	f	t	Migrado desde Excel	t	2026-07-11 18:46:52.228	2026-07-15 05:54:37.16	t	\N
75	MDN0156	Parfums de Marly Sedley	parfums-de-marly-sedley	Una fragancia fresca y deportiva con acordes cítricos y mentolados que energizan los sentidos.	1	2	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.427	2026-07-15 07:02:09.959	t	Limón, Menta, Bergamota, Lavanda, Almizcle, Cedro
71	MDN0139	Creed Virgin Island Water	creed-virgin-island-water	Un cóctel tropical en el paraíso. Lima, coco y ron con un fondo floral y almizclado.	1	33	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.378	2026-07-15 05:54:36.997	t	Lima, Coco, Ron, Jazmín, Almizcle, Ámbar
90	MDN0173	Givenchy Reserve Privée	givenchy-reserve-privee	Una reserva privada de Givenchy. Lavanda y cuero con un toque de incienso ahumado.	2	36	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.598	2026-07-15 06:29:08.57	t	Lavanda, Cuero, Incienso, Cedro, Ámbar, Almizcle
78	MDN0160	Rasasi Hawas Kobra	rasasi-hawas-kobra	Una mordida de serpiente. Pimienta y cuero con un corazón ambarino y tabaco.	3	17	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.469	2026-07-15 05:54:37.057	t	Pomelo, Pimienta, Cuero, Ámbar, Almizcle, Tabaco
59	MDN0113	Valentino Born in Roma Intense	valentino-born-in-roma-intense	Una interpretación más profunda con cupuazú cremoso y cuero que envuelve las notas aromáticas.	2	9	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.26	2026-07-15 07:02:52.22	t	Salvia, Lavanda, Cupuazú, Vainilla, Cuero
86	MDN0169	Azzaro The Most Wanted Parfum EDP	azzaro-the-most-wanted-parfum-edp	La versión más oscura y concentrada del deseado. Tabaco y cuero para las noches especiales.	2	16	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.558	2026-07-19 16:30:24.374	t	Jengibre, Cardamomo, Cuero, Tabaco, Ámbar
70	MDN0136	Club de Nuit Urban Man Elixir	club-de-nuit-urban-man-elixir	El urbanita moderno. Manzana y cedro con cuero y pimienta para la noche.	3	37	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.371	2026-07-15 05:54:37.124	t	Manzana, Cedro, Cuero, Ámbar, Almizcle, Pimienta
39	MDN0077	Armaf Odyssey Mandarin Sky	armaf-odyssey-mandarin-sky	Un cielo de mandarina caramelizada. Dulce, cítrica y astronómicamente buena.	3	21	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.956	2026-07-15 05:54:37.089	t	Mandarina, Caramelo, Vainilla, Ámbar, Almizcle
61	MDN0116	Prada Prada L'Homme	prada-prada-l-homme	La elegancia minimalista de Prada. Iris y lavanda se combinan en una fragancia limpia y sofisticada.	2	25	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.283	2026-07-15 06:41:19.699	t	Iris, Jengibre, Lavanda, Almizcle, Cedro
81	MDN0163	By the Fireplace Replica	by-the-fireplace-replica	El calor de una chimenea en invierno. Castañas asadas y maderas ahumadas con vainilla.	1	6	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.499	2026-07-19 16:29:01.13	t	Clavo de Olor, Castaña, Vainilla, Madera, Bálsamo
82	MDN0164	Dispensadores	dispensadores	Dispensadores para perfumes. Prácticos para el uso diario.	5	\N	t	f	t	Migrado desde Excel	t	2026-07-11 18:46:52.508	2026-07-19 16:26:19.551	t	\N
84	MDN0167	Dolce&Gabbana The One EDP	dolce-gabbana-the-one-edp	La elegancia hecha fragancia. Especias cálidas y tabaco envueltos en ámbar y cuero.	2	11	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.539	2026-07-15 05:54:36.946	t	Bergamota, Cardamomo, Tabaco, Ámbar, Cuero
83	MDN0166	Yves Saint Laurent Myself EDP	yves-saint-laurent-myself-edp	Un viaje de autodescubrimiento. Bergamota y pimienta dan paso a un corazón de cuero y sándalo.	2	26	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.527	2026-07-15 05:54:37.036	t	Bergamota, Pimienta, Cuero, Sándalo, Ámbar
60	MDN0114	Jo Milano Game of Spades Wildcard	jo-milano-game-of-spades-wildcard	La carta salvaje. Cardamomo y cuero se combinan con un fondo amaderado y dulce.	2	30	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.273	2026-07-15 05:54:37.131	t	Bergamota, Cardamomo, Cuero, Ámbar, Cedro, Vainilla
89	MDN0172	Hawas Eclat	hawas-eclat	Una versión más brillante de Hawas. Cítricos y canela con un fondo ambarino.	3	17	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.588	2026-07-15 06:32:40.078	t	Bergamota, Pomelo, Canela, Ámbar, Almizcle, Cedro
22	MDN0041	Giorgio Armani Acqua di Gió Profondo	giorgio-armani-acqua-di-gio-profondo	La profundidad del mar en una fragancia. Aromática, acuática y refrescante con un toque herbal.	2	10	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.62	2026-07-15 06:20:01.255	f	Bergamota, Romero, Lavanda, Almizcle, Cedro
77	MDN0158	Frascos de 10ml	frascos-de-10ml	Frascos vacíos de 10ml para decants. Prácticos y reutilizables.	5	\N	t	f	t	Migrado desde Excel	t	2026-07-11 18:46:52.448	2026-07-19 16:24:50.488	t	\N
3	MDN0001	Xerjoff Torino 21	xerjoff-torino-21	Una fragancia vibrante y refrescante que captura la esencia de la Costa Azul. Perfecta para los amantes de los aromas herbáceos con un toque sofisticado.	1	1	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.216	2026-07-15 05:54:36.802	t	Menta, Bergamota, Romero, Lavanda, Madera de Cedro, Almizcle
4	MDN0003	Xerjoff Naxos 1861	xerjoff-naxos-1861	Un viaje olfativo a Sicilia donde la dulzura de la miel y el tabaco se entrelazan con notas cítricas y especiadas.	1	1	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.26	2026-07-15 05:54:36.819	t	Bergamota, Limón, Lavanda, Canela, Miel, Tabaco, Vainilla
6	MDN0007	Parfums de Marly Layton	parfums-de-marly-layton	Elegancia moderna con un corazón de manzana y lavanda que descansa en una base cremosa de vainilla y sándalo.	1	2	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.305	2026-07-15 05:54:36.834	t	Bergamota, Manzana, Lavanda, Vainilla, Sándalo, Almizcle
10	MDN0015	Goldfield & Banks Bohemian Lime	goldfield-banks-bohemian-lime	Una fragancia australiana vibrante que combina lima ácida con jengibre picante y maderas exóticas.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.386	2026-07-15 05:54:36.86	f	Lima, Bergamota, Jengibre, Cedro, Sándalo, Almizcle
12	MDN0019	Mancera Cedrat Boise EDP	mancera-cedrat-boise-edp	Un fougère afrutado con cítricos vibrantes, frambuesa jugosa y un fondo amaderado-cuero.	1	5	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.425	2026-07-15 05:54:36.867	f	Limón, Cedro, Frambuesa, Cuero, Almizcle, Ámbar
20	MDN0037	Valentino Born in Roma EDT	valentino-born-in-roma-edt	La esencia de Roma en una fragancia: aromática, fresca y elegantemente masculina.	2	9	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.58	2026-07-15 05:54:36.91	t	Salvia, Lavanda, Vetiver, Almizcle, Cedro
85	MDN0168	Xerjoff Erba Gold	xerjoff-erba-gold	Una interpretación más cálida y dorada de Erba Pura, con miel y vainilla que envuelven los cítricos en un abrazo dulce.	1	1	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.55	2026-07-15 07:06:09.367	t	Limón, Bergamota, Miel, Vainilla, Ámbar, Almizcle
87	MDN0170	Bentley Intense EDP	bentley-intense-edp	La elegancia británica en fragancia. Ron y cuero con tabaco e incienso ahumado.	2	35	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.569	2026-07-15 06:35:49.53	t	Bergamota, Ron, Cuero, Tabaco, Ámbar, Incienso
14	MDN0024	Maison Margiela Jazz Club	maison-margiela-jazz-club	La atmósfera de un club de jazz neoyorquino: ron, tabaco y cuero envueltos en una dulzura vainillada.	1	6	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.466	2026-07-15 05:54:36.876	t	Toronja, Limón, Ron, Tabaco, Vainilla, Cuero
15	MDN0025	Emporio Armani Stronger With You Intensly	emporio-armani-stronger-with-you-intensly	Una fragancia intensamente cálida y dulce. La castaña y la vainilla crean un aura acogedora y envolvente.	2	7	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.475	2026-07-15 05:54:36.881	t	Cardamomo, Lavanda, Castaña, Vainilla, Ámbar, Almizcle
19	MDN0035	Valentino Coral Fantasy	valentino-coral-fantasy	Una fantasía vibrante donde la manzana roja y el tabaco se entrelazan en un baile dulce y amaderado.	2	9	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.561	2026-07-15 05:54:36.905	t	Bergamota, Manzana Roja, Tabaco, Madera de Cedro, Vainilla
65	MDN0126	Valentino Donna Coral Fantasy	valentino-donna-coral-fantasy	Una fantasía femenina y radiante donde la frambuesa y el jazmín brillan con luz propia.	2	9	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.322	2026-07-15 05:54:36.917	t	Bergamota, Frambuesa, Jazmín, Almizcle, Vainilla
69	MDN0134	Versace Eros Flame	versace-eros-flame	La pasión hecha fuego. Cítricos y hierbas que se intensifican con cuero y vainilla.	2	32	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.359	2026-07-15 05:54:36.994	t	Limón, Manzana, Romero, Cuero, Vainilla, Ámbar
48	MDN0095	Moschino Toy 2 Bubble Gum	moschino-toy-2-bubble-gum	Un estallido de chicle dulce con mandarina y frambuesa. Juguetona e inolvidable.	3	28	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.105	2026-07-15 05:54:37.009	t	Mandarina, Frambuesa, Vainilla, Almizcle, Sándalo
76	MDN0157	Yves Saint Laurent Y EDP	yves-saint-laurent-y-edp	La firma masculina moderna. Fresca, aromática y amaderada con un toque de jengibre vibrante.	2	26	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.439	2026-07-15 05:54:37.032	t	Bergamota, Jengibre, Salvia, Cedro, Ámbar
33	MDN0063	Rasasi Hawas For Him	rasasi-hawas-for-him	La bestia árabe por excelencia. Pomelo y canela con un fondo ahumado de incienso y ámbar.	3	17	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.836	2026-07-15 05:54:37.042	t	Pomelo, Canela, Incienso, Ámbar, Almizcle, Madera de Cedro
35	MDN0067	Rasasi Hawas Fire	rasasi-hawas-fire	La versión más cálida y especiada. Canela y cuero se encuentran con tabaco y vainilla.	3	17	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.873	2026-07-15 05:54:37.049	t	Bergamota, Canela, Cuero, Vainilla, Ámbar, Tabaco
62	MDN0118	Rasasi Hawas Black	rasasi-hawas-black	Oscura, misteriosa y ahumada. Cuero e incienso con un toque de ládano resinoso.	3	17	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.292	2026-07-15 05:54:37.052	t	Bergamota, Cuero, Ládano, Almizcle, Incienso, Madera
37	MDN0073	Lattafa Khamrah Qahwa	lattafa-khamrah-qahwa	Un café árabe especiado con canela y dátiles. Dulce, cálido y reconfortante como un abrazo.	3	19	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.924	2026-07-15 05:54:37.066	t	Canela, Café, Caramelo, Vainilla, Ámbar, Dátiles
64	MDN0122	Lattafa Khamrah Dukhan	lattafa-khamrah-dukhan	La versión ahumada de Khamrah. Dátiles dulces que se encuentran con cuero e incienso.	3	19	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.311	2026-07-15 05:54:37.071	t	Canela, Dátiles, Cuero, Ámbar, Incienso, Madera
63	MDN0120	Armaf Odyssey Limoni	armaf-odyssey-limoni	Un viaje cítrico por la costa italiana. Limón y jazmín con un fondo amaderado.	3	21	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.303	2026-07-15 05:54:37.094	t	Limón, Bergamota, Jazmín, Cedro, Almizcle, Ámbar
18	MDN0033	Jean Paul Gaultier Le Male Elixir	jean-paul-gaultier-le-male-elixir	Una versión más oscura y concentrada con menta fresca que contrasta con la miel y el tabaco.	2	8	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.542	2026-07-15 06:21:26.803	f	Menta, Lavanda, Cuero, Miel, Tabaco, Vainilla
23	MDN0043	Dolce&Gabbana Light Blue Forever	dolce-gabbana-light-blue-forever	Un homenaje al verano eterno con cítricos bañados en sal y un fondo amaderado.	2	11	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.638	2026-07-15 06:24:43.02	f	Limón, Pomelo, Sal, Almizcle, Madera de Cedro
91	MDN0174	Valentino Donna Born in Roma Intense	valentino-donna-born-in-roma-intense	Poderosamente femenina. El jazmín y la vainilla se intensifican con un fondo amaderado y almizclado.	2	9	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.607	2026-07-15 06:23:39.302	t	Jazmín, Vainilla, Almizcle, Ámbar, Madera de Cedro
25	MDN0047	Dolce&Gabbana Light Blue Intense	dolce-gabbana-light-blue-intense	Más intensa y duradera. La manzana añade dulzura a los cítricos clásicos de Light Blue.	2	11	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.699	2026-07-15 06:26:24.851	t	Limón, Manzana, Cedro, Almizcle, Ámbar
38	MDN0076	French Avenue Liquid Brun	french-avenue-liquid-brun	Elegante y sofisticado. Salvia y cuero con un fondo cálido de cedro y ámbar.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.944	2026-07-15 06:28:26.464	f	Bergamota, Salvia, Cuero, Cedro, Ámbar, Vainilla
79	MDN0161	Burberry Her EDP	burberry-her-edp	La versión original con violeta que aporta un toque empolvado y elegante a los frutos rojos.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.477	2026-07-15 06:32:04.372	f	Fresa, Frambuesa, Violeta, Almizcle, Ámbar
50	MDN0099	Paris Corner Khair Confection	paris-corner-khair-confection	Una confitería de lujo. Frambuesa y algodón de azúcar con un fondo vainillado.	3	29	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.142	2026-07-15 06:33:39.575	t	Frambuesa, Algodón de Azúcar, Vainilla, Almizcle, Ámbar
28	MDN0053	Montblanc Explorer Platinum	montblanc-explorer-platinum	Una versión más metálica y limpia del Explorer, con salvia y sándalo que aportan frescura.	2	12	f	f	f	Migrado desde Excel	f	2026-07-11 18:46:51.757	2026-07-15 06:35:01.157	f	Bergamota, Salvia, Cuero, Sándalo, Almizcle
29	MDN0055	Guerlain Paris L´Homme Ideal EDP	guerlain-paris-l-homme-ideal-edp	Un ideal masculino con almendra y cuero que evoca la sofisticación francesa más clásica.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.776	2026-07-15 07:03:25.366	f	Bergamota, Almendra, Cuero, Vainilla, Cedro, Incienso
31	MDN0060	Ralph Lauren Ralph´s Club EDP	ralph-lauren-ralph-s-club-edp	El club nocturno en fragancia. Aromática, sofisticada y con un toque de cuero elegante.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.817	2026-07-15 07:03:37.581	f	Salvia, Lavanda, Cuero, Cedro, Ámbar
40	MDN0080	Al Haramain Detour Noir	al-haramain-detour-noir	Un desvío oscuro y seductor. Manzana y lavanda con una base cremosa de sándalo.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.974	2026-07-15 07:03:48.796	f	Bergamota, Manzana, Lavanda, Vainilla, Sándalo, Almizcle
45	MDN0089	Prada Paradoxe EDP	prada-paradoxe-edp	Una paradoja floral y cálida. Cítricos brillantes que se transforman en un corazón de jazmín.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.05	2026-07-15 07:04:52.679	f	Bergamota, Naranja, Jazmín, Vainilla, Almizcle
53	MDN0106	Lattafa Shaheen Gold	lattafa-shaheen-gold	Oro líquido. Azafrán y rosa se funden en una base ambarina digna de reyes.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.198	2026-07-15 07:05:05.591	f	Bergamota, Azafrán, Rosa, Ámbar, Almizcle, Madera
57	MDN0111	Frascos Vacios 5ml	frascos-vacios-5ml	Frascos vacíos de 5ml para decants. Perfectos para almacenar y compartir tus fragancias favoritas.	5	\N	t	f	t	Migrado desde Excel	t	2026-07-11 18:46:52.24	2026-07-15 05:54:37.165	t	\N
73	MDN0150	Bolsas resellables	bolsas-resellables	Bolsas resellables para empaque de productos. Ideales para proteger y presentar tus decants.	5	\N	t	f	t	Migrado desde Excel	t	2026-07-11 18:46:52.401	2026-07-15 05:54:37.185	t	\N
47	MDN0093	Ari Ariana Grande	ari-ariana-grande	Dulce, divertida y juvenil. La frambuesa y la vainilla crean una estela jugosa y coqueta.	2	27	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.086	2026-07-15 05:54:54.675	t	Frambuesa, Vainilla, Almizcle, Ambar, Sandalo
88	MDN0171	Vulcan Feu French Avenue	vulcan-feu-french-avenue	Fuego volcanico. Pimienta y cuero con tabaco ahumado y vainilla dulce.	3	20	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.577	2026-07-15 05:54:54.681	t	Pimienta, Cuero, Tabaco, Vainilla, Ambar, Incienso
7	MDN0009	BDK Parfums Gris Charnel EDP	bdk-parfums-gris-charnel-edp	Un abrazo sensual y cremoso donde el higo y el té negro se funden con la suavidad de la leche de coco.	1	3	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:51.324	2026-07-15 06:19:13.113	f	Bergamota, Higo, Té Negro, Leche de Coco, Sándalo, Almizcle
92	MDN0027	Emporio Armani Stronger With You Absolutely	emporio-armani-stronger-with-you-absolutely	Una evolución más oscura y misteriosa con ron especiado y cuero ahumado que seduce a cada paso.	2	7	f	f	f	\N	t	2026-07-14 06:29:36.244	2026-07-15 06:20:59.964	t	Ron, Canela, Tabaco, Cuero, Vainilla, Ámbar
55	MDN0109	Valentino Coral Fantasy 100ml	valentino-coral-fantasy-100ml	La misma fantasía coral en presentación de 100ml. Vibrante y adictiva.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.22	2026-07-15 06:22:06.846	f	Bergamota, Manzana Roja, Tabaco, Madera de Cedro, Vainilla
68	MDN0132	Zimaya Tiramisu Caramel	zimaya-tiramisu-caramel	Un tiramisú en fragancia. Café, caramelo y crema con un toque de cacao.	3	31	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.351	2026-07-15 06:36:55.643	t	Caramelo, Café, Crema, Vainilla, Almizcle, Cacao
66	MDN0128	Rabanne Fame Intense	rabanne-fame-intense	La fama intensificada. Jazmín floral con incienso y palo de rosa para un aura magnética.	2	34	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.33	2026-07-15 07:04:36.328	t	Jazmín, Incienso, Palo de Rosa, Ámbar, Almizcle
67	MDN0130	Jo Milano Game of Spades Blind Bid	jo-milano-game-of-spades-blind-bid	Una apuesta a ciegas. Pimienta y cuero con tabaco y cedro para los valientes.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.341	2026-07-19 16:02:16.765	f	Limón, Pimienta, Cuero, Cedro, Ámbar, Tabaco
74	MDN0155	Hawas for Him	hawas-for-him	El clásico Hawas. Pomelo y canela con un fondo ahumado de incienso y ámbar.	\N	\N	f	f	f	Migrado desde Excel	t	2026-07-11 18:46:52.419	2026-07-19 16:02:56.883	f	Pomelo, Canela, Incienso, Ámbar, Almizcle, Madera de Cedro
\.


--
-- Data for Name: product_variants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_variants (id, codigo, product_id, presentation_id, sku, barcode, active, created_at) FROM stdin;
5	MDN0003	4	2	\N	\N	t	2026-07-11 18:46:51.263
6	MDN0004	4	3	\N	\N	t	2026-07-11 18:46:51.274
7	MDN0005	5	2	\N	\N	t	2026-07-11 18:46:51.287
8	MDN0006	5	3	\N	\N	t	2026-07-11 18:46:51.295
9	MDN0007	6	2	\N	\N	t	2026-07-11 18:46:51.308
11	MDN0009	7	2	\N	\N	t	2026-07-11 18:46:51.327
12	MDN0010	7	3	\N	\N	t	2026-07-11 18:46:51.338
13	MDN0011	8	2	\N	\N	t	2026-07-11 18:46:51.348
14	MDN0012	8	3	\N	\N	t	2026-07-11 18:46:51.357
15	MDN0013	9	2	\N	\N	t	2026-07-11 18:46:51.37
17	MDN0015	10	2	\N	\N	t	2026-07-11 18:46:51.389
18	MDN0016	10	3	\N	\N	t	2026-07-11 18:46:51.397
19	MDN0017	11	2	\N	\N	t	2026-07-11 18:46:51.409
20	MDN0018	11	3	\N	\N	t	2026-07-11 18:46:51.419
22	MDN0020	12	3	\N	\N	t	2026-07-11 18:46:51.438
23	MDN0021	13	2	\N	\N	t	2026-07-11 18:46:51.453
24	MDN0022	13	3	\N	\N	t	2026-07-11 18:46:51.459
25	MDN0024	14	3	\N	\N	t	2026-07-11 18:46:51.47
26	MDN0025	15	2	\N	\N	t	2026-07-11 18:46:51.478
28	MDN0029	16	2	\N	\N	t	2026-07-11 18:46:51.509
29	MDN0030	16	3	\N	\N	t	2026-07-11 18:46:51.519
30	MDN0031	17	2	\N	\N	t	2026-07-11 18:46:51.528
31	MDN0032	17	3	\N	\N	t	2026-07-11 18:46:51.537
32	MDN0033	18	2	\N	\N	t	2026-07-11 18:46:51.545
34	MDN0035	19	2	\N	\N	t	2026-07-11 18:46:51.567
35	MDN0036	19	3	\N	\N	t	2026-07-11 18:46:51.574
36	MDN0037	20	2	\N	\N	t	2026-07-11 18:46:51.586
37	MDN0038	20	3	\N	\N	t	2026-07-11 18:46:51.593
39	MDN0040	21	3	\N	\N	t	2026-07-11 18:46:51.612
40	MDN0041	22	2	\N	\N	t	2026-07-11 18:46:51.623
41	MDN0042	22	3	\N	\N	t	2026-07-11 18:46:51.629
42	MDN0043	23	2	\N	\N	t	2026-07-11 18:46:51.641
43	MDN0044	23	3	\N	\N	t	2026-07-11 18:46:51.651
45	MDN0046	24	3	\N	\N	t	2026-07-11 18:46:51.669
46	MDN0047	25	2	\N	\N	t	2026-07-11 18:46:51.704
47	MDN0048	25	3	\N	\N	t	2026-07-11 18:46:51.712
48	MDN0049	26	2	\N	\N	t	2026-07-11 18:46:51.723
49	MDN0050	26	3	\N	\N	t	2026-07-11 18:46:51.73
51	MDN0052	27	3	\N	\N	t	2026-07-11 18:46:51.752
52	MDN0053	28	2	\N	\N	t	2026-07-11 18:46:51.76
53	MDN0054	28	3	\N	\N	t	2026-07-11 18:46:51.771
54	MDN0055	29	2	\N	\N	t	2026-07-11 18:46:51.779
56	MDN0057	30	2	\N	\N	t	2026-07-11 18:46:51.803
57	MDN0058	30	3	\N	\N	t	2026-07-11 18:46:51.809
58	MDN0060	31	3	\N	\N	t	2026-07-11 18:46:51.821
60	MDN0063	33	2	\N	\N	t	2026-07-11 18:46:51.839
62	MDN0065	34	2	\N	\N	t	2026-07-11 18:46:51.857
63	MDN0066	34	3	\N	\N	t	2026-07-11 18:46:51.867
64	MDN0067	35	2	\N	\N	t	2026-07-11 18:46:51.876
65	MDN0068	35	3	\N	\N	t	2026-07-11 18:46:51.888
66	MDN0069	36	2	\N	\N	t	2026-07-11 18:46:51.896
68	MDN0073	37	2	\N	\N	t	2026-07-11 18:46:51.928
69	MDN0074	37	3	\N	\N	t	2026-07-11 18:46:51.938
70	MDN0076	38	3	\N	\N	t	2026-07-11 18:46:51.949
71	MDN0077	39	2	\N	\N	t	2026-07-11 18:46:51.959
73	MDN0080	40	3	\N	\N	t	2026-07-11 18:46:51.977
74	MDN0082	41	3	\N	\N	t	2026-07-11 18:46:51.988
75	MDN0083	42	2	\N	\N	t	2026-07-11 18:46:51.996
76	MDN0084	42	3	\N	\N	t	2026-07-11 18:46:52.006
77	MDN0085	43	2	\N	\N	t	2026-07-11 18:46:52.017
79	MDN0087	44	2	\N	\N	t	2026-07-11 18:46:52.036
80	MDN0088	44	3	\N	\N	t	2026-07-11 18:46:52.043
81	MDN0089	45	2	\N	\N	t	2026-07-11 18:46:52.054
82	MDN0090	45	3	\N	\N	t	2026-07-11 18:46:52.06
83	MDN0091	46	2	\N	\N	t	2026-07-11 18:46:52.072
85	MDN0093	47	2	\N	\N	t	2026-07-11 18:46:52.09
86	MDN0094	47	3	\N	\N	t	2026-07-11 18:46:52.099
87	MDN0095	48	2	\N	\N	t	2026-07-11 18:46:52.109
88	MDN0096	48	3	\N	\N	t	2026-07-11 18:46:52.118
90	MDN0098	49	3	\N	\N	t	2026-07-11 18:46:52.137
91	MDN0099	50	2	\N	\N	t	2026-07-11 18:46:52.146
92	MDN0100	50	3	\N	\N	t	2026-07-11 18:46:52.155
93	MDN0101	51	2	\N	\N	t	2026-07-11 18:46:52.166
94	MDN0102	51	3	\N	\N	t	2026-07-11 18:46:52.173
96	MDN0104	52	3	\N	\N	t	2026-07-11 18:46:52.192
97	MDN0106	53	3	\N	\N	t	2026-07-11 18:46:52.203
98	MDN0108	54	3	\N	\N	t	2026-07-11 18:46:52.211
99	MDN0109	55	6	\N	\N	t	2026-07-11 18:46:52.223
101	MDN0111	57	6	\N	\N	t	2026-07-11 18:46:52.244
102	MDN0112	58	6	\N	\N	t	2026-07-11 18:46:52.254
104	MDN0114	60	2	\N	\N	t	2026-07-11 18:46:52.276
105	MDN0116	61	2	\N	\N	t	2026-07-11 18:46:52.287
106	MDN0118	62	2	\N	\N	t	2026-07-11 18:46:52.295
107	MDN0120	63	2	\N	\N	t	2026-07-11 18:46:52.306
109	MDN0126	65	2	\N	\N	t	2026-07-11 18:46:52.325
110	MDN0128	66	2	\N	\N	t	2026-07-11 18:46:52.336
111	MDN0130	67	2	\N	\N	t	2026-07-11 18:46:52.344
112	MDN0132	68	2	\N	\N	t	2026-07-11 18:46:52.354
113	MDN0134	69	2	\N	\N	t	2026-07-11 18:46:52.362
115	MDN0139	71	2	\N	\N	t	2026-07-11 18:46:52.385
117	MDN0150	73	7	\N	\N	t	2026-07-11 18:46:52.404
119	MDN0155	74	5	\N	\N	t	2026-07-11 18:46:52.422
120	MDN0156	75	2	\N	\N	t	2026-07-11 18:46:52.432
122	MDN0158	77	6	\N	\N	t	2026-07-11 18:46:52.452
123	MDN0159	77	7	\N	\N	t	2026-07-11 18:46:52.46
124	MDN0160	78	2	\N	\N	t	2026-07-11 18:46:52.472
125	MDN0161	79	2	\N	\N	t	2026-07-11 18:46:52.48
130	MDN0166	83	2	\N	\N	t	2026-07-11 18:46:52.533
131	MDN0167	84	2	\N	\N	t	2026-07-11 18:46:52.542
133	MDN0169	86	2	\N	\N	t	2026-07-11 18:46:52.561
134	MDN0170	87	2	\N	\N	t	2026-07-11 18:46:52.572
135	MDN0171	88	2	\N	\N	t	2026-07-11 18:46:52.581
136	MDN0172	89	2	\N	\N	t	2026-07-11 18:46:52.591
138	MDN0174	91	2	\N	\N	t	2026-07-11 18:46:52.611
118	MDN0152	56	8	\N	\N	t	2026-07-11 18:46:52.41
129	MDN0165	82	6	\N	\N	t	2026-07-11 18:46:52.522
128	MDN0164	82	7	\N	\N	t	2026-07-11 18:46:52.511
141	SC-0001	76	3		\N	t	2026-07-19 15:12:44.729
59	MDN0062	86	3	\N	\N	t	2026-07-11 18:46:51.829
126	MDN0162	14	2	\N	\N	t	2026-07-11 18:46:52.492
116	MDN0148	57	7	\N	\N	t	2026-07-11 18:46:52.394
144	SC0003	75	3		\N	t	2026-07-19 16:29:35.807
145	SC0004	59	3		\N	t	2026-07-19 16:31:22.057
148	SC0007	66	3		\N	t	2026-07-20 17:20:41.378
150	SC0009	83	3		\N	t	2026-07-20 17:21:28.412
151	SC0010	84	3		\N	t	2026-07-20 17:21:43.718
152	SC0011	87	3		\N	t	2026-07-20 17:21:58.817
156	SC0015	64	3		\N	t	2026-07-20 17:23:32.233
157	SC0016	68	3		\N	t	2026-07-20 17:23:44.452
158	SC0017	70	3		\N	t	2026-07-20 17:23:56.982
159	SC0018	78	3		\N	t	2026-07-20 17:24:12.017
160	SC0019	88	3		\N	t	2026-07-20 17:24:27.351
161	SC0020	89	3		\N	t	2026-07-20 17:24:38.814
3	MDN0001	3	2	\N	\N	t	2026-07-11 18:46:51.226
4	MDN0002	3	3	\N	\N	t	2026-07-11 18:46:51.253
121	MDN0157	76	2	\N	\N	t	2026-07-11 18:46:52.442
142	SC0001	71	3		\N	t	2026-07-19 16:27:38
143	SC0002	81	3		\N	t	2026-07-19 16:28:39.139
146	SC0005	60	3		\N	t	2026-07-19 16:31:43.142
147	SC0006	61	3		\N	t	2026-07-19 16:32:04.408
149	SC0008	69	3		\N	t	2026-07-20 17:21:09.715
153	SC0012	90	3		\N	t	2026-07-20 17:22:11.82
154	SC0013	62	3		\N	t	2026-07-20 17:23:00.057
155	SC0014	63	3		\N	t	2026-07-20 17:23:14.689
10	MDN0008	6	3	\N	\N	t	2026-07-11 18:46:51.318
16	MDN0014	9	3	\N	\N	t	2026-07-11 18:46:51.377
21	MDN0019	12	2	\N	\N	t	2026-07-11 18:46:51.428
27	MDN0026	15	3	\N	\N	t	2026-07-11 18:46:51.488
139	MDN0027	92	2		\N	t	2026-07-14 06:30:23.268
140	MDN0028	92	3		\N	t	2026-07-14 06:30:31.48
33	MDN0034	18	3	\N	\N	t	2026-07-11 18:46:51.556
38	MDN0039	21	2	\N	\N	t	2026-07-11 18:46:51.605
44	MDN0045	24	2	\N	\N	t	2026-07-11 18:46:51.66
50	MDN0051	27	2	\N	\N	t	2026-07-11 18:46:51.742
55	MDN0056	29	3	\N	\N	t	2026-07-11 18:46:51.79
61	MDN0064	33	3	\N	\N	t	2026-07-11 18:46:51.846
67	MDN0070	36	3	\N	\N	t	2026-07-11 18:46:51.907
72	MDN0078	39	3	\N	\N	t	2026-07-11 18:46:51.969
78	MDN0086	43	3	\N	\N	t	2026-07-11 18:46:52.024
84	MDN0092	46	3	\N	\N	t	2026-07-11 18:46:52.078
89	MDN0097	49	2	\N	\N	t	2026-07-11 18:46:52.126
95	MDN0103	52	2	\N	\N	t	2026-07-11 18:46:52.185
100	MDN0110	56	6	\N	\N	t	2026-07-11 18:46:52.233
103	MDN0113	59	2	\N	\N	t	2026-07-11 18:46:52.268
108	MDN0122	64	2	\N	\N	t	2026-07-11 18:46:52.316
114	MDN0136	70	2	\N	\N	t	2026-07-11 18:46:52.373
127	MDN0163	81	2	\N	\N	t	2026-07-11 18:46:52.503
132	MDN0168	85	2	\N	\N	t	2026-07-11 18:46:52.553
137	MDN0173	90	2	\N	\N	t	2026-07-11 18:46:52.602
\.


--
-- Data for Name: costs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.costs (id, variant_id, unit_cost, supplies_cost, shipping_cost, net_cost, price_per_ml, base_price_5ml, base_price_10ml, final_price, effective_date, created_at) FROM stdin;
291	141	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-19 15:41:43.533	2026-07-19 15:41:43.541
294	146	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-19 16:40:14.407	2026-07-19 16:40:14.409
300	148	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-20 17:26:11.371	2026-07-20 17:26:11.378
303	151	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-20 17:27:44.929	2026-07-20 17:27:44.932
311	159	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:31:50.756	2026-07-20 17:31:50.757
312	160	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:32:26.671	2026-07-20 17:32:26.672
292	59	2460.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	3614.460000000000000000000000000000	361.446000000000000000000000000000	1807.230000000000000000000000000000	3614.460000000000000000000000000000	800.000000000000000000000000000000	2026-07-19 16:14:32.446	2026-07-19 16:14:32.45
295	25	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	800.000000000000000000000000000000	2026-07-19 16:40:46.919	2026-07-19 16:40:46.92
297	144	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1100.000000000000000000000000000000	2026-07-19 16:41:40.44	2026-07-19 16:41:40.442
298	145	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	900.000000000000000000000000000000	2026-07-19 16:42:17.959	2026-07-19 16:42:17.959
299	147	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-19 16:42:33.747	2026-07-19 16:42:33.749
301	149	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-20 17:26:38.798	2026-07-20 17:26:38.8
305	153	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-20 17:28:35.666	2026-07-20 17:28:35.668
307	155	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-20 17:29:35.154	2026-07-20 17:29:35.157
310	158	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-20 17:31:24.874	2026-07-20 17:31:24.876
313	161	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:32:51.245	2026-07-20 17:32:51.247
154	3	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	670.000000000000000000000000000000	2026-07-15 05:39:00.964	2026-07-15 05:39:00.964
155	4	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1260.000000000000000000000000000000	2026-07-15 05:39:00.977	2026-07-15 05:39:00.977
156	5	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	630.000000000000000000000000000000	2026-07-15 05:39:00.98	2026-07-15 05:39:00.98
157	6	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1180.000000000000000000000000000000	2026-07-15 05:39:00.983	2026-07-15 05:39:00.983
158	7	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	630.000000000000000000000000000000	2026-07-15 05:39:00.985	2026-07-15 05:39:00.985
159	8	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1180.000000000000000000000000000000	2026-07-15 05:39:00.987	2026-07-15 05:39:00.987
160	9	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	590.000000000000000000000000000000	2026-07-15 05:39:00.991	2026-07-15 05:39:00.991
161	10	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1100.000000000000000000000000000000	2026-07-15 05:39:00.993	2026-07-15 05:39:00.993
162	11	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	550.000000000000000000000000000000	2026-07-15 05:39:00.996	2026-07-15 05:39:00.996
163	12	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1020.000000000000000000000000000000	2026-07-15 05:39:00.999	2026-07-15 05:39:00.999
164	13	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.001	2026-07-15 05:39:01.001
165	14	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	980.000000000000000000000000000000	2026-07-15 05:39:01.003	2026-07-15 05:39:01.003
166	15	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.005	2026-07-15 05:39:01.005
167	16	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	980.000000000000000000000000000000	2026-07-15 05:39:01.008	2026-07-15 05:39:01.008
168	17	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.015	2026-07-15 05:39:01.015
169	18	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	980.000000000000000000000000000000	2026-07-15 05:39:01.018	2026-07-15 05:39:01.018
170	19	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	375.000000000000000000000000000000	2026-07-15 05:39:01.02	2026-07-15 05:39:01.02
171	20	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	710.000000000000000000000000000000	2026-07-15 05:39:01.024	2026-07-15 05:39:01.024
172	22	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-15 05:39:01.028	2026-07-15 05:39:01.028
173	21	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	360.000000000000000000000000000000	2026-07-15 05:39:01.032	2026-07-15 05:39:01.032
174	23	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	360.000000000000000000000000000000	2026-07-15 05:39:01.035	2026-07-15 05:39:01.035
175	24	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-15 05:39:01.038	2026-07-15 05:39:01.038
176	25	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	710.000000000000000000000000000000	2026-07-15 05:39:01.041	2026-07-15 05:39:01.041
177	26	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.045	2026-07-15 05:39:01.045
178	27	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-15 05:39:01.049	2026-07-15 05:39:01.049
179	139	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.052	2026-07-15 05:39:01.052
180	140	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-15 05:39:01.056	2026-07-15 05:39:01.056
181	28	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.058	2026-07-15 05:39:01.058
182	29	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-15 05:39:01.068	2026-07-15 05:39:01.068
183	30	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.071	2026-07-15 05:39:01.071
184	31	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-15 05:39:01.073	2026-07-15 05:39:01.073
185	32	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.076	2026-07-15 05:39:01.076
186	33	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-15 05:39:01.083	2026-07-15 05:39:01.083
187	34	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.086	2026-07-15 05:39:01.086
188	35	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-15 05:39:01.089	2026-07-15 05:39:01.089
189	36	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.092	2026-07-15 05:39:01.092
190	37	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-15 05:39:01.098	2026-07-15 05:39:01.098
191	39	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	745.000000000000000000000000000000	2026-07-15 05:39:01.101	2026-07-15 05:39:01.101
192	38	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.104	2026-07-15 05:39:01.104
193	40	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.106	2026-07-15 05:39:01.106
194	41	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-15 05:39:01.109	2026-07-15 05:39:01.109
195	42	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.114	2026-07-15 05:39:01.114
196	43	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-15 05:39:01.117	2026-07-15 05:39:01.117
197	45	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-15 05:39:01.119	2026-07-15 05:39:01.119
198	44	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.122	2026-07-15 05:39:01.122
199	46	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.124	2026-07-15 05:39:01.124
200	47	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.127	2026-07-15 05:39:01.127
201	48	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.131	2026-07-15 05:39:01.131
202	49	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.134	2026-07-15 05:39:01.134
203	51	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	590.000000000000000000000000000000	2026-07-15 05:39:01.136	2026-07-15 05:39:01.136
204	50	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	315.000000000000000000000000000000	2026-07-15 05:39:01.139	2026-07-15 05:39:01.139
205	52	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.141	2026-07-15 05:39:01.141
206	53	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.146	2026-07-15 05:39:01.146
207	54	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.15	2026-07-15 05:39:01.15
208	55	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	670.000000000000000000000000000000	2026-07-15 05:39:01.154	2026-07-15 05:39:01.154
209	56	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	220.000000000000000000000000000000	2026-07-15 05:39:01.156	2026-07-15 05:39:01.156
210	57	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.159	2026-07-15 05:39:01.159
211	58	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.163	2026-07-15 05:39:01.163
212	60	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.167	2026-07-15 05:39:01.167
213	61	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.17	2026-07-15 05:39:01.17
214	62	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.172	2026-07-15 05:39:01.172
215	63	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.175	2026-07-15 05:39:01.175
216	64	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.179	2026-07-15 05:39:01.179
217	65	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.182	2026-07-15 05:39:01.182
218	66	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	255.000000000000000000000000000000	2026-07-15 05:39:01.184	2026-07-15 05:39:01.184
219	67	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	475.000000000000000000000000000000	2026-07-15 05:39:01.187	2026-07-15 05:39:01.187
220	68	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.189	2026-07-15 05:39:01.189
221	69	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.191	2026-07-15 05:39:01.191
222	70	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	475.000000000000000000000000000000	2026-07-15 05:39:01.196	2026-07-15 05:39:01.196
223	71	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	220.000000000000000000000000000000	2026-07-15 05:39:01.199	2026-07-15 05:39:01.199
224	72	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.201	2026-07-15 05:39:01.201
225	73	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.203	2026-07-15 05:39:01.203
226	74	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.205	2026-07-15 05:39:01.205
227	75	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.207	2026-07-15 05:39:01.207
228	76	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.209	2026-07-15 05:39:01.209
229	77	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.212	2026-07-15 05:39:01.212
230	78	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-15 05:39:01.215	2026-07-15 05:39:01.215
231	79	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	475.000000000000000000000000000000	2026-07-15 05:39:01.218	2026-07-15 05:39:01.218
232	80	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	865.000000000000000000000000000000	2026-07-15 05:39:01.219	2026-07-15 05:39:01.219
233	81	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	475.000000000000000000000000000000	2026-07-15 05:39:01.221	2026-07-15 05:39:01.221
234	82	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	865.000000000000000000000000000000	2026-07-15 05:39:01.223	2026-07-15 05:39:01.223
235	83	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.224	2026-07-15 05:39:01.224
236	84	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	785.000000000000000000000000000000	2026-07-15 05:39:01.226	2026-07-15 05:39:01.226
237	85	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.23	2026-07-15 05:39:01.23
238	86	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.233	2026-07-15 05:39:01.233
239	87	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.235	2026-07-15 05:39:01.235
240	88	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.236	2026-07-15 05:39:01.236
241	90	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-15 05:39:01.238	2026-07-15 05:39:01.238
242	89	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.24	2026-07-15 05:39:01.24
243	91	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.242	2026-07-15 05:39:01.242
244	92	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.247	2026-07-15 05:39:01.247
245	93	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.25	2026-07-15 05:39:01.25
246	94	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.252	2026-07-15 05:39:01.252
247	96	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.254	2026-07-15 05:39:01.254
248	95	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.256	2026-07-15 05:39:01.256
249	97	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.26	2026-07-15 05:39:01.26
250	98	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.263	2026-07-15 05:39:01.263
251	99	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	5000.000000000000000000000000000000	2026-07-15 05:39:01.266	2026-07-15 05:39:01.266
252	118	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	300.000000000000000000000000000000	2026-07-15 05:39:01.268	2026-07-15 05:39:01.268
253	100	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	50.000000000000000000000000000000	2026-07-15 05:39:01.27	2026-07-15 05:39:01.27
254	101	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	70.000000000000000000000000000000	2026-07-15 05:39:01.272	2026-07-15 05:39:01.272
255	102	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	250.000000000000000000000000000000	2026-07-15 05:39:01.274	2026-07-15 05:39:01.274
256	103	5310.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	6663.960000000000000000000000000000	1332.792000000000000000000000000000	6663.959999999999000000000000000000	13327.920000000000000000000000000000	470.000000000000000000000000000000	2026-07-15 05:39:01.277	2026-07-15 05:39:01.277
257	104	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.28	2026-07-15 05:39:01.28
258	105	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.282	2026-07-15 05:39:01.282
259	106	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.284	2026-07-15 05:39:01.284
260	107	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.286	2026-07-15 05:39:01.286
261	108	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.287	2026-07-15 05:39:01.287
262	109	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	475.000000000000000000000000000000	2026-07-15 05:39:01.289	2026-07-15 05:39:01.289
263	110	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.291	2026-07-15 05:39:01.291
264	111	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.294	2026-07-15 05:39:01.294
265	112	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.297	2026-07-15 05:39:01.297
266	113	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.3	2026-07-15 05:39:01.3
267	114	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	240.000000000000000000000000000000	2026-07-15 05:39:01.303	2026-07-15 05:39:01.303
268	115	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	700.000000000000000000000000000000	2026-07-15 05:39:01.305	2026-07-15 05:39:01.305
269	116	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	450.000000000000000000000000000000	2026-07-15 05:39:01.308	2026-07-15 05:39:01.308
270	117	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	120.000000000000000000000000000000	2026-07-15 05:39:01.313	2026-07-15 05:39:01.313
271	119	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	9.822600000000001000000000000000	49.113000000000010000000000000000	98.226000000000010000000000000000	2200.000000000000000000000000000000	2026-07-15 05:39:01.316	2026-07-15 05:39:01.316
272	120	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	590.000000000000000000000000000000	2026-07-15 05:39:01.318	2026-07-15 05:39:01.318
273	121	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	400.000000000000000000000000000000	2026-07-15 05:39:01.32	2026-07-15 05:39:01.32
274	122	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	80.000000000000000000000000000000	2026-07-15 05:39:01.323	2026-07-15 05:39:01.323
275	123	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	550.000000000000000000000000000000	2026-07-15 05:39:01.326	2026-07-15 05:39:01.326
276	124	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.329	2026-07-15 05:39:01.329
277	125	3186.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	4391.280000000001000000000000000000	878.256000000000100000000000000000	4391.280000000001000000000000000000	8782.560000000001000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.332	2026-07-15 05:39:01.332
278	126	2820.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	3999.660000000000000000000000000000	799.932000000000000000000000000000	3999.660000000000000000000000000000	7999.320000000000000000000000000000	450.000000000000000000000000000000	2026-07-15 05:39:01.335	2026-07-15 05:39:01.335
279	127	2856.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	4038.180000000000000000000000000000	807.636000000000100000000000000000	4038.180000000000000000000000000000	8076.360000000001000000000000000000	450.000000000000000000000000000000	2026-07-15 05:39:01.338	2026-07-15 05:39:01.338
280	129	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	30.000000000000000000000000000000	2026-07-15 05:39:01.341	2026-07-15 05:39:01.341
281	128	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	982.260000000000100000000000000000	4911.300000000000000000000000000000	9822.600000000000000000000000000000	250.000000000000000000000000000000	2026-07-15 05:39:01.345	2026-07-15 05:39:01.345
282	130	5274.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	6625.440000000001000000000000000000	1325.088000000000000000000000000000	6625.440000000001000000000000000000	13250.880000000000000000000000000000	450.000000000000000000000000000000	2026-07-15 05:39:01.365	2026-07-15 05:39:01.365
283	131	2051.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	3176.830000000000000000000000000000	635.366000000000100000000000000000	3176.830000000000000000000000000000	6353.660000000001000000000000000000	355.000000000000000000000000000000	2026-07-15 05:39:01.367	2026-07-15 05:39:01.367
284	132	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	196.452000000000000000000000000000	982.260000000000100000000000000000	1964.520000000000000000000000000000	650.000000000000000000000000000000	2026-07-15 05:39:01.37	2026-07-15 05:39:01.37
285	133	2460.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	3614.460000000000000000000000000000	722.892000000000100000000000000000	3614.460000000000000000000000000000	7228.920000000000000000000000000000	450.000000000000000000000000000000	2026-07-15 05:39:01.373	2026-07-15 05:39:01.373
286	134	960.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	2009.460000000000000000000000000000	401.892000000000000000000000000000	2009.460000000000000000000000000000	4018.920000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.375	2026-07-15 05:39:01.375
287	135	2015.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	3138.310000000000000000000000000000	627.662000000000000000000000000000	3138.310000000000000000000000000000	6276.620000000001000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.383	2026-07-15 05:39:01.383
288	136	1690.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	2790.560000000000000000000000000000	558.112000000000000000000000000000	2790.560000000000000000000000000000	5581.120000000000000000000000000000	275.000000000000000000000000000000	2026-07-15 05:39:01.388	2026-07-15 05:39:01.388
289	137	3480.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	4705.860000000001000000000000000000	941.172000000000100000000000000000	4705.860000000001000000000000000000	9411.720000000001000000000000000000	435.000000000000000000000000000000	2026-07-15 05:39:01.393	2026-07-15 05:39:01.393
290	138	3000.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	4192.260000000000000000000000000000	838.452000000000000000000000000000	4192.260000000000000000000000000000	8384.520000000000000000000000000000	450.000000000000000000000000000000	2026-07-15 05:39:01.398	2026-07-15 05:39:01.398
293	142	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	1300.000000000000000000000000000000	2026-07-19 16:39:32.958	2026-07-19 16:39:32.969
296	143	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	800.000000000000000000000000000000	2026-07-19 16:41:18.831	2026-07-19 16:41:18.834
302	150	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	800.000000000000000000000000000000	2026-07-20 17:27:09.051	2026-07-20 17:27:09.053
304	152	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:28:09.489	2026-07-20 17:28:09.491
306	154	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:29:14.16	2026-07-20 17:29:14.162
308	156	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:30:15	2026-07-20 17:30:15.001
309	157	0.000000000000000000000000000000	733.000000000000000000000000000000	185.000000000000000000000000000000	982.260000000000100000000000000000	98.226000000000010000000000000000	491.130000000000100000000000000000	982.260000000000100000000000000000	510.000000000000000000000000000000	2026-07-20 17:30:46.304	2026-07-20 17:30:46.307
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.locations (id, name, slug, type, address, contact, phone, active, created_at) FROM stdin;
1	Emprendi2 Colectivo	emprendi2-colectivo	collectivo	\N	Sara	\N	t	2026-07-11 18:46:52.691
\.


--
-- Data for Name: location_deliveries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.location_deliveries (id, location_id, delivery_date, period, notes, created_by, created_at) FROM stdin;
1	1	2026-07-12 07:15:31.158	07 julio 2026		admin@mundodecants.com	2026-07-12 07:15:31.158
2	1	2026-07-18 16:48:00.47	18 de julio 2026		admin@mundodecants.com	2026-07-18 16:48:00.47
\.


--
-- Data for Name: delivery_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.delivery_items (id, delivery_id, variant_id, quantity, unit_cost) FROM stdin;
1	1	3	2	670.000000000000000000000000000000
2	1	4	1	1260.000000000000000000000000000000
3	1	5	1	630.000000000000000000000000000000
4	1	6	1	1180.000000000000000000000000000000
5	2	7	5	630.000000000000000000000000000000
6	2	121	6	400.000000000000000000000000000000
\.


--
-- Data for Name: gift_conversions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gift_conversions (id, product_id, variant_id, quantity_ml, is_full_bottle, gift_presentation_id, estimated_units, reason, converted_at, created_by) FROM stdin;
\.


--
-- Data for Name: global_inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.global_inventory (id, variant_id, quantity, min_stock, max_stock, updated_at) FROM stdin;
9	11	0	0	\N	2026-07-11 18:46:51.33
10	12	0	0	\N	2026-07-11 18:46:51.34
15	17	0	0	\N	2026-07-11 18:46:51.391
16	18	0	0	\N	2026-07-11 18:46:51.402
19	21	0	0	\N	2026-07-11 18:46:51.43
20	22	0	0	\N	2026-07-11 18:46:51.439
30	32	0	0	\N	2026-07-11 18:46:51.55
31	33	0	0	\N	2026-07-11 18:46:51.558
38	40	0	0	\N	2026-07-11 18:46:51.625
39	41	0	0	\N	2026-07-11 18:46:51.634
40	42	0	0	\N	2026-07-11 18:46:51.643
41	43	0	0	\N	2026-07-11 18:46:51.653
42	44	0	0	\N	2026-07-11 18:46:51.662
43	45	0	0	\N	2026-07-11 18:46:51.671
50	52	0	0	\N	2026-07-11 18:46:51.763
52	54	0	0	\N	2026-07-11 18:46:51.785
53	55	0	0	\N	2026-07-11 18:46:51.793
56	58	0	0	\N	2026-07-11 18:46:51.822
60	62	0	0	\N	2026-07-11 18:46:51.859
61	63	0	0	\N	2026-07-11 18:46:51.87
68	70	0	0	\N	2026-07-11 18:46:51.952
71	73	0	0	\N	2026-07-11 18:46:51.978
72	74	0	0	\N	2026-07-11 18:46:51.99
77	79	0	0	\N	2026-07-11 18:46:52.038
78	80	0	0	\N	2026-07-11 18:46:52.044
79	81	0	0	\N	2026-07-11 18:46:52.056
80	82	0	0	\N	2026-07-11 18:46:52.062
81	83	0	0	\N	2026-07-11 18:46:52.074
82	84	0	0	\N	2026-07-11 18:46:52.082
93	95	0	0	\N	2026-07-11 18:46:52.187
94	96	0	0	\N	2026-07-11 18:46:52.194
95	97	0	0	\N	2026-07-11 18:46:52.205
97	99	0	0	\N	2026-07-11 18:46:52.225
117	119	0	0	\N	2026-07-11 18:46:52.424
124	126	0	0	\N	2026-07-11 18:46:52.494
130	132	0	0	\N	2026-07-11 18:46:52.555
6	8	3	0	\N	2026-07-14 06:10:45.084
2	4	4	0	\N	2026-07-12 07:15:31.238
115	117	3	0	\N	2026-07-19 16:27:00.327
7	9	3	0	\N	2026-07-14 06:11:01.236
8	10	3	0	\N	2026-07-14 06:11:02.149
11	13	3	0	\N	2026-07-14 06:11:26.388
3	5	3	0	\N	2026-07-12 07:15:31.242
4	6	3	0	\N	2026-07-12 07:15:31.246
1	3	4	0	\N	2026-07-14 06:10:04.563
12	14	3	0	\N	2026-07-14 06:11:27.299
14	16	3	0	\N	2026-07-14 06:11:39.702
13	15	3	0	\N	2026-07-14 06:11:40.361
17	19	3	0	\N	2026-07-14 06:11:49.478
18	20	3	0	\N	2026-07-14 06:11:51.464
21	23	3	0	\N	2026-07-14 06:12:02.791
22	24	3	0	\N	2026-07-14 06:12:04.576
23	25	3	0	\N	2026-07-14 06:12:16.511
24	26	3	0	\N	2026-07-14 06:12:57.785
25	27	3	0	\N	2026-07-14 06:13:04.311
26	28	3	0	\N	2026-07-14 06:13:17.351
27	29	3	0	\N	2026-07-14 06:13:20.736
28	30	3	0	\N	2026-07-14 06:13:35.554
29	31	3	0	\N	2026-07-14 06:13:37.364
32	34	3	0	\N	2026-07-14 06:14:16.95
33	35	3	0	\N	2026-07-14 06:14:19.689
34	36	3	0	\N	2026-07-14 06:14:29.909
35	37	3	0	\N	2026-07-14 06:14:33.054
36	38	3	0	\N	2026-07-14 06:14:38.529
37	39	3	0	\N	2026-07-14 06:14:40.677
44	46	3	0	\N	2026-07-14 06:15:24.041
45	47	3	0	\N	2026-07-14 06:15:26.095
46	48	3	0	\N	2026-07-14 06:15:35.947
47	49	3	0	\N	2026-07-14 06:15:38.964
49	51	3	0	\N	2026-07-14 06:15:45.283
48	50	3	0	\N	2026-07-14 06:15:48.05
54	56	3	0	\N	2026-07-14 06:16:43.296
51	53	0	0	\N	2026-07-14 06:16:30.615
55	57	3	0	\N	2026-07-14 06:16:48.651
135	137	3	0	\N	2026-07-14 06:17:15.299
111	113	3	0	\N	2026-07-14 06:17:31.08
5	7	5	0	\N	2026-07-18 16:48:00.499
128	130	3	0	\N	2026-07-14 06:17:51.067
102	104	3	0	\N	2026-07-14 06:18:08.969
109	111	3	0	\N	2026-07-14 06:18:11.487
132	134	3	0	\N	2026-07-14 06:18:25.234
131	133	3	0	\N	2026-07-14 06:19:38.654
57	59	3	0	\N	2026-07-14 06:19:39.609
103	105	3	0	\N	2026-07-14 06:19:14.724
133	135	3	0	\N	2026-07-14 06:20:00.361
99	101	3	0	\N	2026-07-14 06:20:08.103
100	102	3	0	\N	2026-07-14 06:20:11.616
114	116	3	0	\N	2026-07-14 06:20:14.167
120	122	3	0	\N	2026-07-14 06:20:16.896
121	123	3	0	\N	2026-07-14 06:20:21.327
63	65	3	0	\N	2026-07-14 06:21:56.355
59	61	3	0	\N	2026-07-14 06:21:45.89
58	60	3	0	\N	2026-07-14 06:21:47.444
62	64	3	0	\N	2026-07-14 06:21:54.711
104	106	3	0	\N	2026-07-14 06:22:06.207
122	124	3	0	\N	2026-07-14 06:22:08.285
69	71	3	0	\N	2026-07-14 06:22:24.151
105	107	3	0	\N	2026-07-14 06:22:35.451
70	72	3	0	\N	2026-07-14 06:22:28.534
64	66	2	0	\N	2026-07-14 06:22:53.073
65	67	2	0	\N	2026-07-14 06:22:55.279
66	68	3	0	\N	2026-07-14 06:23:03.887
67	69	3	0	\N	2026-07-14 06:23:06.197
73	75	3	0	\N	2026-07-14 06:23:13.94
106	108	3	0	\N	2026-07-14 06:23:28.239
74	76	3	0	\N	2026-07-14 06:23:18.398
112	114	3	0	\N	2026-07-14 06:23:49.195
123	125	3	0	\N	2026-07-14 06:24:37.911
134	136	3	0	\N	2026-07-14 06:24:56.244
83	85	3	0	\N	2026-07-14 06:25:06.078
84	86	3	0	\N	2026-07-14 06:25:07.785
91	93	3	0	\N	2026-07-14 06:25:31.025
90	92	3	0	\N	2026-07-14 06:25:33.215
89	91	3	0	\N	2026-07-14 06:25:37.386
92	94	3	0	\N	2026-07-14 06:25:42.647
96	98	3	0	\N	2026-07-14 06:25:45.432
87	89	3	0	\N	2026-07-14 06:25:59.676
88	90	3	0	\N	2026-07-14 06:26:01.846
85	87	3	0	\N	2026-07-14 06:26:15.473
108	110	3	0	\N	2026-07-14 06:26:40.727
86	88	3	0	\N	2026-07-14 06:26:17.625
110	112	3	0	\N	2026-07-14 06:26:51.05
118	120	3	0	\N	2026-07-15 06:37:52.989
125	127	3	0	\N	2026-07-15 06:38:24.157
136	138	3	0	\N	2026-07-15 06:38:58.715
101	103	3	0	\N	2026-07-15 06:39:09.217
129	131	3	0	\N	2026-07-15 06:40:13.311
98	100	4	0	\N	2026-07-15 06:44:36.335
116	118	4	0	\N	2026-07-15 06:44:38.895
126	128	3	0	\N	2026-07-15 06:44:53.479
127	129	3	0	\N	2026-07-15 06:44:55.97
113	115	3	0	\N	2026-07-15 06:46:12.358
76	78	3	0	\N	2026-07-15 06:49:29.925
107	109	3	0	\N	2026-07-15 06:48:57.401
75	77	3	0	\N	2026-07-15 06:49:32.143
137	139	3	0	\N	2026-07-15 06:55:11.485
138	140	3	0	\N	2026-07-15 06:55:13.383
119	121	4	0	\N	2026-07-18 16:48:00.533
\.


--
-- Data for Name: inventory_movements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_movements (id, variant_id, movement_type, quantity, reference_type, reference_id, location_id, notes, created_by, created_at) FROM stdin;
1	3	adjustment	0	\N	\N	\N	Ajuste manual a 0	admin	2026-07-11 19:16:54.103
2	3	adjustment	0	\N	\N	\N	Ajuste manual a 0	admin	2026-07-11 19:16:55.051
3	3	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-11 20:35:21.423
4	4	adjustment	5	\N	\N	\N	Ajuste manual a 5	admin	2026-07-11 20:35:26.196
5	5	adjustment	4	\N	\N	\N	Ajuste manual a 4	admin	2026-07-11 20:35:28.851
6	6	adjustment	4	\N	\N	\N	Ajuste manual a 4	admin	2026-07-11 20:35:33.51
7	3	delivery_to_location	-2	location_delivery	1	1	\N	admin@mundodecants.com	2026-07-12 07:15:31.228
8	4	delivery_to_location	-1	location_delivery	1	1	\N	admin@mundodecants.com	2026-07-12 07:15:31.24
9	5	delivery_to_location	-1	location_delivery	1	1	\N	admin@mundodecants.com	2026-07-12 07:15:31.244
10	6	delivery_to_location	-1	location_delivery	1	1	\N	admin@mundodecants.com	2026-07-12 07:15:31.248
11	3	adjustment	3	\N	\N	\N	Ajuste manual a 4	admin	2026-07-14 06:10:04.585
12	8	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:10:45.086
13	7	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:10:46.1
14	9	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:01.238
15	10	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:02.151
16	13	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:26.391
17	14	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:27.3
18	16	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:39.704
19	15	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:40.363
20	19	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:49.48
21	20	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:11:51.465
22	23	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:12:02.793
23	24	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:12:04.578
24	25	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:12:16.513
25	26	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:12:57.787
26	27	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:13:04.315
27	28	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:13:17.353
28	29	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:13:20.737
29	30	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:13:35.556
30	31	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:13:37.365
31	34	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:14:16.952
32	35	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:14:19.691
33	36	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:14:29.912
34	37	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:14:33.056
35	38	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:14:38.531
36	39	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:14:40.678
37	46	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:15:24.043
38	47	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:15:26.096
39	48	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:15:35.949
40	49	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:15:38.966
41	51	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:15:45.284
42	50	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:15:48.051
43	53	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:16:11.275
44	53	adjustment	-3	\N	\N	\N	Ajuste manual a 0	admin	2026-07-14 06:16:30.616
45	56	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:16:43.297
46	57	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:16:48.652
47	137	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:17:15.302
48	113	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:17:31.082
49	121	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:17:46.78
50	130	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:17:51.068
51	104	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:18:08.971
52	111	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:18:11.488
53	134	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:18:25.235
54	105	adjustment	2	\N	\N	\N	Ajuste manual a 2	admin	2026-07-14 06:19:10.7
55	105	adjustment	1	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:19:12.266
56	105	adjustment	0	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:19:13.332
57	105	adjustment	0	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:19:14.725
58	133	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:19:38.656
59	59	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:19:39.611
60	135	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:20:00.362
61	101	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:20:08.104
62	102	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:20:11.619
63	116	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:20:14.169
64	122	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:20:16.897
65	123	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:20:21.329
66	60	adjustment	2	\N	\N	\N	Ajuste manual a 2	admin	2026-07-14 06:21:43.027
67	61	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:21:45.892
68	60	adjustment	1	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:21:47.446
69	64	adjustment	2	\N	\N	\N	Ajuste manual a 2	admin	2026-07-14 06:21:53.434
70	64	adjustment	1	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:21:54.713
71	65	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:21:56.356
72	106	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:22:06.209
73	124	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:22:08.286
74	71	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:22:24.153
75	72	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:22:26.367
76	72	adjustment	0	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:22:28.535
77	107	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:22:35.453
78	66	adjustment	2	\N	\N	\N	Ajuste manual a 2	admin	2026-07-14 06:22:53.074
79	67	adjustment	2	\N	\N	\N	Ajuste manual a 2	admin	2026-07-14 06:22:55.28
80	68	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:23:03.888
81	69	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:23:06.199
82	75	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:23:13.942
83	76	adjustment	1	\N	\N	\N	Ajuste manual a 1	admin	2026-07-14 06:23:16.122
84	76	adjustment	2	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:23:18.399
85	108	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:23:28.24
86	114	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:23:49.196
87	125	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:24:37.912
88	136	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:24:56.246
89	85	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:06.079
90	86	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:07.787
91	93	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:31.026
92	92	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:33.216
93	91	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:37.387
94	94	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:42.648
95	98	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:45.434
96	89	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:25:59.678
99	88	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:26:17.25
97	90	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:26:01.848
98	87	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:26:15.474
100	88	adjustment	0	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:26:17.626
101	110	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:26:40.729
102	112	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-14 06:26:51.051
103	120	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:37:52.993
104	127	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:38:24.159
105	138	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:38:58.717
106	103	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:39:09.219
107	131	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:40:13.314
108	100	adjustment	4	\N	\N	\N	Ajuste manual a 4	admin	2026-07-15 06:44:36.34
109	118	adjustment	4	\N	\N	\N	Ajuste manual a 4	admin	2026-07-15 06:44:38.897
110	128	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:44:53.482
111	129	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:44:55.973
112	115	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:46:12.36
113	109	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:48:42.497
114	109	adjustment	0	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:48:57.405
115	78	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:49:29.931
116	77	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:49:32.145
117	139	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:55:11.505
118	140	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-15 06:55:13.387
119	7	adjustment	7	\N	\N	\N	Ajuste manual a 10	admin	2026-07-18 16:46:03.984
120	121	adjustment	7	\N	\N	\N	Ajuste manual a 10	admin	2026-07-18 16:46:20.397
121	7	delivery_to_location	-5	location_delivery	2	1	\N	admin@mundodecants.com	2026-07-18 16:48:00.523
122	121	delivery_to_location	-6	location_delivery	2	1	\N	admin@mundodecants.com	2026-07-18 16:48:00.54
123	117	adjustment	3	\N	\N	\N	Ajuste manual a 3	admin	2026-07-19 16:27:00.344
\.


--
-- Data for Name: location_inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.location_inventory (id, location_id, variant_id, quantity, updated_at) FROM stdin;
1	1	3	2	2026-07-12 07:15:31.22
2	1	4	1	2026-07-12 07:15:31.239
3	1	5	1	2026-07-12 07:15:31.243
4	1	6	1	2026-07-12 07:15:31.247
5	1	7	5	2026-07-18 16:48:00.51
6	1	121	6	2026-07-18 16:48:00.536
\.


--
-- Data for Name: price_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_history (id, variant_id, old_price, new_price, reason, changed_by, created_at) FROM stdin;
1	139	435.000000000000000000000000000000	435.000000000000000000000000000000	\N	admin	2026-07-14 06:55:29.511
2	25	710.000000000000000000000000000000	800.000000000000000000000000000000	\N	admin	2026-07-19 16:40:46.908
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_images (id, product_id, url, alt_text, is_primary, sort_order, created_at) FROM stdin;
1	3	/images/products/mdn_3_1783795769366.jpg	\N	t	0	2026-07-11 18:49:29.379
2	4	/images/products/mdn_4_1783796560476.jpg	\N	t	0	2026-07-11 19:02:40.483
4	6	/images/products/mdn_6_1783796629826.jpg	\N	t	0	2026-07-11 19:03:49.834
5	8	/images/products/mdn_8_1783796679325.jpg	\N	t	0	2026-07-11 19:04:39.333
6	9	/images/products/mdn_9_1783798052690.jpg	\N	t	0	2026-07-11 19:27:32.696
7	11	/images/products/mdn_11_1783798073200.jpg	\N	t	0	2026-07-11 19:27:53.216
8	13	/images/products/mdn_13_1783798130763.jpg	\N	t	0	2026-07-11 19:28:50.774
9	14	/images/products/mdn_14_1783798154020.jpg	\N	t	0	2026-07-11 19:29:14.026
10	16	/images/products/mdn_16_1783798183548.jpg	\N	t	0	2026-07-11 19:29:43.559
11	71	/images/products/mdn_71_1783799152745.JPG	\N	t	0	2026-07-11 19:45:52.751
12	17	/images/products/mdn_17_1783799224032.jpg	\N	t	0	2026-07-11 19:47:04.038
13	19	/images/products/mdn_19_1783799432690.jpg	\N	t	0	2026-07-11 19:50:32.701
14	20	/images/products/mdn_20_1783799475393.jpg	\N	t	0	2026-07-11 19:51:15.402
15	21	/images/products/mdn_21_1783799497934.jpg	\N	t	0	2026-07-11 19:51:37.943
16	15	/images/products/mdn_15_1783799526228.jpg	\N	t	0	2026-07-11 19:52:06.234
17	27	/images/products/mdn_27_1783799587894.jpg	\N	t	0	2026-07-11 19:53:07.9
18	26	/images/products/mdn_26_1783799636712.jpg	\N	t	0	2026-07-11 19:53:56.718
19	33	/images/products/mdn_33_1783799670224.jpg	\N	t	0	2026-07-11 19:54:30.276
20	35	/images/products/mdn_35_1783799716445.jpg	\N	t	0	2026-07-11 19:55:16.453
21	69	/images/products/mdn_69_1783799757188.jpg	\N	t	0	2026-07-11 19:55:57.201
22	65	/images/products/mdn_65_1783799807040.jpg	\N	t	0	2026-07-11 19:56:47.051
23	62	/images/products/mdn_62_1783799869058.jpg	\N	t	0	2026-07-11 19:57:49.064
24	78	/images/products/mdn_78_1783799910980.jpg	\N	t	0	2026-07-11 19:58:30.988
25	88	/images/products/mdn_88_1783799985673.jpg	\N	t	0	2026-07-11 19:59:45.741
26	84	/images/products/mdn_84_1783800047882.jpg	\N	t	0	2026-07-11 20:00:47.89
28	63	/images/products/mdn_63_1783800610689.jpg	\N	t	0	2026-07-11 20:10:10.702
29	39	/images/products/mdn_39_1783800640760.jpg	\N	t	0	2026-07-11 20:10:40.767
30	37	/images/products/mdn_37_1783800717003.jpg	\N	t	0	2026-07-11 20:11:57.014
31	42	/images/products/mdn_42_1783800739666.jpg	\N	t	0	2026-07-11 20:12:19.673
32	49	/images/products/mdn_49_1783800785428.jpg	\N	t	0	2026-07-11 20:13:05.436
33	64	/images/products/mdn_64_1783800808690.jpg	\N	t	0	2026-07-11 20:13:28.699
34	36	/images/products/mdn_36_1783800854756.jpg	\N	t	0	2026-07-11 20:14:14.762
35	60	/images/products/mdn_60_1783801070947.jpg	\N	t	0	2026-07-11 20:17:50.961
36	56	/images/products/mdn_56_1783801111701.png	\N	t	0	2026-07-11 20:18:31.711
37	73	/images/products/mdn_73_1783801134509.jpg	\N	t	0	2026-07-11 20:18:54.523
38	57	/images/products/mdn_57_1783801163940.jpg	\N	t	0	2026-07-11 20:19:23.951
40	58	/images/products/mdn_58_1783801213226.jpg	\N	t	0	2026-07-11 20:20:13.235
41	43	/images/products/mdn_43_1783801377105.jpg	\N	t	0	2026-07-11 20:22:57.114
42	76	/images/products/mdn_76_1783801432317.jpg	\N	t	0	2026-07-11 20:23:52.388
43	83	/images/products/mdn_83_1783801449785.jpg	\N	t	0	2026-07-11 20:24:09.794
44	70	/images/products/mdn_70_1783801522685.jpg	\N	t	0	2026-07-11 20:25:22.691
45	47	/images/products/mdn_47_1783801543447.jpg	\N	t	0	2026-07-11 20:25:43.453
46	48	/images/products/mdn_48_1783801575845.jpg	\N	t	0	2026-07-11 20:26:15.853
47	75	/images/products/mdn_75_1784096295588.jpg	\N	t	0	2026-07-15 06:18:15.598
48	92	/images/products/mdn_92_1784096458047.jpg	\N	t	0	2026-07-15 06:20:58.135
49	59	/images/products/mdn_59_1784096589736.jpg	\N	t	0	2026-07-15 06:23:09.748
50	91	/images/products/mdn_91_1784096611244.jpg	\N	t	0	2026-07-15 06:23:31.271
51	25	/images/products/mdn_25_1784096783065.jpg	\N	t	0	2026-07-15 06:26:23.076
52	30	/images/products/mdn_30_1784096879407.jpg	\N	t	0	2026-07-15 06:27:59.418
53	90	/images/products/mdn_90_1784096946725.jpg	\N	t	0	2026-07-15 06:29:06.738
54	89	/images/products/mdn_89_1784097148690.jpg	\N	t	0	2026-07-15 06:32:28.701
55	50	/images/products/mdn_50_1784097205021.jpg	\N	t	0	2026-07-15 06:33:25.029
56	51	/images/products/mdn_51_1784097244383.jpg	\N	t	0	2026-07-15 06:34:04.393
57	87	/images/products/mdn_87_1784097348296.jpg	\N	t	0	2026-07-15 06:35:48.306
58	68	/images/products/mdn_68_1784097415112.jpg	\N	t	0	2026-07-15 06:36:55.125
59	61	/images/products/mdn_61_1784097672363.jpg	\N	t	0	2026-07-15 06:41:12.376
60	66	/images/products/mdn_66_1784099065871.jpg	\N	t	0	2026-07-15 07:04:25.884
61	85	/images/products/mdn_85_1784099167587.jpg	\N	t	0	2026-07-15 07:06:07.602
62	5	/images/products/mdn_5_1784476864360.jpg	\N	t	0	2026-07-19 16:01:04.374
63	77	/images/products/mdn_77_1784478287695.jpg	\N	t	0	2026-07-19 16:24:47.744
64	82	/images/products/mdn_82_1784478375481.jpg	\N	t	0	2026-07-19 16:26:15.499
65	81	/images/products/mdn_81_1784478539767.jpg	\N	t	0	2026-07-19 16:28:59.778
66	86	/images/products/mdn_86_1784478613773.jpg	\N	t	0	2026-07-19 16:30:13.792
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.suppliers (id, name, contact, phone, email, notes, created_at) FROM stdin;
\.


--
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchase_orders (id, supplier_id, order_number, order_date, total_cost, notes, created_at) FROM stdin;
\.


--
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.purchase_order_items (id, po_id, variant_id, quantity, unit_cost) FROM stdin;
\.


--
-- Data for Name: sales_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sales_reports (id, location_id, report_date, period, status, notes, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: sale_report_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sale_report_items (id, report_id, variant_id, quantity_sold, unit_price) FROM stdin;
\.


--
-- Data for Name: system_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_config (id, standard_supplies_cost, standard_shipping_cost, pos_fee_percentage, currency, updated_at) FROM stdin;
1	733.000000000000000000000000000000	185.000000000000000000000000000000	7.000000000000000000000000000000	Córdobas	2026-07-11 18:08:54.727
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, email, password_hash, full_name, role, active, last_login, created_at) FROM stdin;
1	admin	admin@mundodecants.com	$2b$10$UQzbJqlsanO/rIVwi37VWeiS65xR.cArtny8/mGYUfFC1xuRHLlxS	Administrador MDN	admin	t	2026-07-12 06:52:25.291	2026-07-11 18:08:54.715
\.


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.brands_id_seq', 37, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.categories_id_seq', 7, true);


--
-- Name: costs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.costs_id_seq', 313, true);


--
-- Name: delivery_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.delivery_items_id_seq', 6, true);


--
-- Name: gift_conversions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gift_conversions_id_seq', 1, false);


--
-- Name: global_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.global_inventory_id_seq', 138, true);


--
-- Name: inventory_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_movements_id_seq', 123, true);


--
-- Name: location_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.location_deliveries_id_seq', 2, true);


--
-- Name: location_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.location_inventory_id_seq', 6, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.locations_id_seq', 1, true);


--
-- Name: presentations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.presentations_id_seq', 8, true);


--
-- Name: price_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.price_history_id_seq', 2, true);


--
-- Name: product_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_images_id_seq', 66, true);


--
-- Name: product_variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_variants_id_seq', 161, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 92, true);


--
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 1, false);


--
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 1, false);


--
-- Name: sale_report_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sale_report_items_id_seq', 1, false);


--
-- Name: sales_reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.sales_reports_id_seq', 1, false);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 1, false);


--
-- Name: system_config_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.system_config_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

\unrestrict oq4T4PDdcJ02h6ndJuAbpEEfY7PwkW0pbhLPu6BhPoQiYDyvb6HsCB5nda9wBw5

