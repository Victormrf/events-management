--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'CANCELED'
);


--
-- Name: Role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."Role" AS ENUM (
    'ADMIN',
    'USER'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Address; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Address" (
    id text NOT NULL,
    street text NOT NULL,
    neighborhood text,
    city text NOT NULL,
    state text NOT NULL,
    country text NOT NULL,
    "zipCode" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    number integer DEFAULT 123 NOT NULL,
    lat double precision,
    lng double precision
);


--
-- Name: Attendee; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Attendee" (
    id text NOT NULL,
    name text NOT NULL,
    email text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "orderId" text NOT NULL
);


--
-- Name: Event; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "creatorId" text NOT NULL,
    "maxAttendees" integer,
    price numeric(10,2) DEFAULT 0.00 NOT NULL,
    "addressId" text NOT NULL,
    image text
);


--
-- Name: Order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Order" (
    id text NOT NULL,
    "totalAmount" double precision NOT NULL,
    status public."OrderStatus" DEFAULT 'CONFIRMED'::public."OrderStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    "eventId" text NOT NULL,
    quantity integer NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password text NOT NULL,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Address" (id, street, neighborhood, city, state, country, "zipCode", "createdAt", "updatedAt", number, lat, lng) FROM stdin;
b19a9c8c-dbe5-4b02-bd3b-47be78276940	Rua teste	Bairro teste	Xique-Xique	BA	Brasil	01234-567	2025-08-26 02:44:14.425	2025-08-26 02:44:14.425	123	\N	\N
fc3e0f37-1df7-4eb3-b5a4-0e6d00509966	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:29:05.88	2026-02-18 19:29:05.88	123	-21.750712	-43.3524911
ee9bef51-709c-4209-876d-a1a4bf8fbae2	new street test	new neighborhood test	new city test	new state test	new country test	98765-432	2025-08-29 06:18:09.596	2025-08-29 06:28:44.235	123	\N	\N
402f0bea-fe36-44a4-987b-29f8fa93cf5a	street test 123	neighborhood test	city test	state test	country test	12345-678	2025-08-21 04:58:47.326	2025-09-04 02:13:18.766	123	\N	\N
065969ce-fd2c-470a-9976-ebc2ad4e1a68	street test	neighborhood test	city test	state test	country test	12345-678	2025-09-05 03:56:18.682	2025-09-05 03:56:18.682	123	\N	\N
05d8da13-e903-49ad-b6ac-4eff779a7d93	street test	neighborhood test	city test	state test	country test	12345-678	2025-09-17 00:06:16.142	2025-09-17 00:06:16.142	123	\N	\N
396f9d78-43db-439a-9adb-259ec8bc928e	street test	neighborhood test	city test	state test	country test	12345-678	2025-09-18 01:49:46.26	2025-09-18 01:49:46.26	123	\N	\N
4098f484-0599-4db3-8d21-83c081a722fa	street test	quarter test	city test	RJ	Brasil	01234-567	2025-10-14 00:07:00.058	2025-10-14 00:07:00.058	123	\N	\N
dcaa559b-ece7-4c66-bc69-2d6ddf98aa30	R. dos Maçons		Xique Xique	BA	Brasil	47400000	2026-01-31 20:32:53.206	2026-01-31 20:32:53.206	123	\N	\N
5f826f1a-3712-4c9f-bc08-f83c9934e697	Av. doutor Francisco Alvares de Assis, 460	BARÃO DO RETIRO	Juiz de Fora	MG	Brasil	36073130	2026-02-01 02:53:15.553	2026-02-01 02:53:15.553	123	-21.7819825	-43.2989466
95a1b327-82db-46f8-8dba-cb7e6d90d0bd	Praça Pres. Antônio Carlos, 145	Centro	Juiz de Fora	MG	Brasil	36010-140	2026-02-03 04:43:59.902	2026-02-03 04:43:59.902	123	\N	\N
99685d9f-ccda-47c2-aed7-fae2cea17de3	Praça Pres. Antônio Carlos, 145	Centro	Juiz de Fora	MG	Brasil	36010140	2026-02-03 05:07:07.8	2026-02-03 05:07:07.8	123	\N	\N
2b4dbe35-7243-4384-babc-f959556d2628	R. Halfeld	Centro	Juiz de Fora	MG	Brasil	36015510	2026-02-03 05:12:41.659	2026-02-03 05:12:41.659	123	-21.7625267	-43.3547933
5d7b2194-2ff7-4f20-ab4a-9bf8c139e669	Av. Brasil	Jardim América	São Paulo	SP	Brasil	01430000	2026-02-11 04:19:32.442	2026-02-11 04:19:32.442	123	-23.572546	-46.6687558
f9a26d20-bd21-426b-b66e-e7ca43b93ddf	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:15:27.433	2026-02-18 06:15:27.433	123	-21.760909	-43.3477992
47e6ed1e-78a1-483e-ad47-66a88171ae17	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:15:28.697	2026-02-18 06:15:28.697	123	-21.7779969	-43.3453982
bf8511eb-6fa4-4f11-9bfa-f9ce7498e302	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:15:29.398	2026-02-18 06:15:29.398	123	-21.7595821	-43.343896
6467d9bd-5021-4d65-9f4b-1ee57e597e31	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:27:29.088	2026-02-18 06:27:29.088	123	-21.760909	-43.3477992
f6e06b27-0458-4617-b9b1-f5be441a96a3	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:27:29.632	2026-02-18 06:27:29.632	123	-21.7779969	-43.3453982
9d2f97d3-9795-42fe-a53b-dc21e49a376e	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:27:29.904	2026-02-18 06:27:29.904	123	-21.7595821	-43.343896
0efff744-1560-4087-b302-d9b7f6f9acff	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:39:46.166	2026-02-18 06:39:46.166	123	-21.760909	-43.3477992
c3b97b14-0646-4568-a561-273fb30f0ded	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:39:46.699	2026-02-18 06:39:46.699	123	-21.7779969	-43.3453982
9bf8737f-a378-46e5-a488-0e8939c44281	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:39:46.998	2026-02-18 06:39:46.998	123	-21.7595821	-43.343896
8715e831-1961-482b-bf26-94169adb314f	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:46:40.679	2026-02-18 06:46:40.679	123	-21.760909	-43.3477992
d153bb93-1e4e-4900-a0b6-a3cae1074e1e	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:46:41.221	2026-02-18 06:46:41.221	123	-21.7779969	-43.3453982
db4b93d8-7dc5-4487-9b1c-faf11ea598b4	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:46:41.539	2026-02-18 06:46:41.539	123	-21.7595821	-43.343896
dd10ced6-fb7e-4281-b98a-303a2f3ab6a2	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:47:29.367	2026-02-18 06:47:29.367	123	-21.760909	-43.3477992
66371efc-38a2-4f6b-b179-cea89c08203a	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:47:29.978	2026-02-18 06:47:29.978	123	-21.7779969	-43.3453982
2bab4506-c55d-44d5-97b4-77d41176dcf0	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 06:47:30.276	2026-02-18 06:47:30.276	123	-21.7595821	-43.343896
2712fcde-51a3-493a-a356-62dffcd37eff	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:02:47.821	2026-02-18 07:02:47.821	123	-21.760909	-43.3477992
74d319a8-c63f-481c-a41d-55c41cf289f0	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:02:48.361	2026-02-18 07:02:48.361	123	-21.7779969	-43.3453982
28e488ab-8322-4107-a568-9b4f49f257f0	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:02:48.64	2026-02-18 07:02:48.64	123	-21.7595821	-43.343896
3766c7d6-8e2b-47cb-b436-c4fc6855a350	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:13:29.413	2026-02-18 07:13:29.413	123	-21.760909	-43.3477992
4214f593-0f89-4f23-86b1-c22993a91e45	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:13:29.436	2026-02-18 07:13:29.436	123	-21.7595821	-43.343896
cdcf2627-821a-41f2-a529-c6bcac8960b4	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:13:29.452	2026-02-18 07:13:29.452	123	-21.7779969	-43.3453982
7c79044f-6a19-4e58-90a3-8646e090d85c	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:25:46.888	2026-02-18 07:25:46.888	123	-21.762617	-43.3552371
152a5025-ec7e-486f-8f5d-f807daf47de0	Avenida Rio Branco		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:25:48.355	2026-02-18 07:25:48.355	123	-21.7710447	-43.3472196
de4e62d1-e411-4ce0-88a5-0ef8a757834f	Rua José Lourenço Kelmer		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 07:25:49.104	2026-02-18 07:25:49.104	123	-21.7670328	-43.3677627
3ef33666-7732-45e5-b976-6cc7804aaed1	Parque Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 18:37:48.292	2026-02-18 18:37:48.292	123	-21.7610891	-43.3505157
f2701245-462d-4d93-9d6a-7077a369e8ef	Rua Olegário Maciel		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 18:37:49.419	2026-02-18 18:37:49.419	123	-21.7703802	-43.3579541
ddd06dc6-b06d-40d4-b30f-89aa7f87a4c6	Praça da Estação		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 18:37:49.832	2026-02-18 18:37:49.832	123	-21.7595821	-43.343896
9e6d7138-6f7e-429f-82b6-ee005f8aa24e	Parque Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:09:37.884	2026-02-18 19:09:37.884	123	-21.7610891	-43.3505157
9629f350-967e-437e-913f-84597f7d4590	Rua Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:09:39.483	2026-02-18 19:09:39.483	123	-21.760909	-43.3477992
dc27e375-ac8f-4020-9140-07dc7255b91c	Praça Cívica		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:09:40.416	2026-02-18 19:09:40.416	123	-21.7748644	-43.3686175
0c94ab85-dbef-422c-830a-ca1b3dc16fdd	Rua Batista de Oliveira		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:29:06.415	2026-02-18 19:29:06.415	123	-21.7655873	-43.3456062
d4f4b7fc-22ef-4d37-bfbe-47f839b7fc20	Rua Santo Antônio		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:29:07.488	2026-02-18 19:29:07.488	123	-21.7575619	-43.3521496
faffe4e3-051f-4adf-b4b8-d9c4dda23a4c	Parque Halfeld		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:29:07.512	2026-02-18 19:29:07.512	123	-21.7610891	-43.3505157
090cfb18-3267-4f03-9d31-378be3708fae	Praça Tiradentes		Juiz de Fora	Minas Gerais	Brasil		2026-02-18 19:29:08.379	2026-02-18 19:29:08.379	123	-20.6615054	-43.7871601
7910e182-b4de-4d05-bb7a-a658f8fae62a	Avenida Brigadeiro Faria Lima		São Paulo	São Paulo	Brasil		2026-02-18 19:46:16.997	2026-02-18 19:46:16.997	123	-23.5680589	-46.6925813
fa848ece-871c-4f1c-9b3c-d0469a72dd83	Rua Aspicuelta		São Paulo	São Paulo	Brasil		2026-02-18 19:46:17.66	2026-02-18 19:46:17.66	123	-23.5563954	-46.6874672
affd58dd-ca5c-4aa6-b44c-e098945eaaa9	Avenida Paulista		São Paulo	São Paulo	Brasil		2026-02-18 19:46:18.92	2026-02-18 19:46:18.92	123	-23.5560945	-46.6622655
02c24b5e-2cb7-4d94-949e-79e5030ba841	Rua da Consolação		São Paulo	São Paulo	Brasil		2026-02-18 19:46:19.314	2026-02-18 19:46:19.314	123	-23.5471423	-46.6469089
a66acf42-d25a-444a-ab03-b09677d054b9	Rua Augusta		São Paulo	São Paulo	Brasil		2026-02-18 19:46:20.572	2026-02-18 19:46:20.572	123	-23.5661149	-46.6685644
2355491e-5e16-4a28-88a8-ef7b32dd3f4c	Rua Francisco Otaviano		Rio de Janeiro	Rio de Janeiro	Brasil		2026-02-21 08:32:19.248	2026-02-21 08:32:19.248	123	-22.799271	-43.3231705
bb9e9b4e-7f34-4303-a916-bd5d3f606faf	Rua do Lavradio		Rio de Janeiro	Rio de Janeiro	Brasil		2026-02-21 08:32:19.593	2026-02-21 08:32:19.593	123	-22.9095321	-43.1833088
f308d9d7-ab24-4a24-bd0a-19d5db9332e6	Rua Primeiro de Março		Rio de Janeiro	Rio de Janeiro	Brasil		2026-02-21 08:32:20.843	2026-02-21 08:32:20.843	123	-22.9015192	-43.1763927
10d8f3d4-3480-4ee7-9219-420e49ad8ebb	Rua Sacadura Cabral		Rio de Janeiro	Rio de Janeiro	Brasil		2026-02-21 08:32:21.7	2026-02-21 08:32:21.7	123	-22.8975304	-43.1832284
058bfab5-a787-4488-9aae-b5783733e599	Avenida Pasteur		Rio de Janeiro	Rio de Janeiro	Brasil		2026-02-21 08:32:22.647	2026-02-21 08:32:22.647	123	-22.9537906	-43.1699731
99f51d54-d15a-4d9e-8313-a44b25052911	Avenida Peixoto de Azevedo		Peixoto de Azevedo	Mato Grosso	Brasil		2026-02-21 23:25:30.226	2026-02-21 23:25:30.226	123	-10.2350288	-54.9955181
19b8a5d6-bd93-4624-a193-41b9a8dcd844	Rua dos Pioneiros		Peixoto de Azevedo	Mato Grosso	Brasil		2026-02-21 23:25:31.037	2026-02-21 23:25:31.037	123	\N	\N
b0ec583f-7f0b-4623-8870-44ad45463fba	Avenida Brasil		Peixoto de Azevedo	Mato Grosso	Brasil		2026-02-21 23:25:31.906	2026-02-21 23:25:31.906	123	-10.2373784	-55.0114404
75df32ee-63b9-4877-af35-4487d11d2e77	Rua Poxoréu		Peixoto de Azevedo	Mato Grosso	Brasil		2026-02-21 23:25:32.773	2026-02-21 23:25:32.773	123	\N	\N
bc4a315a-553a-4930-b7cc-8d8459cb84cc	Rua São Paulo		Peixoto de Azevedo	Mato Grosso	Brasil		2026-02-21 23:25:33.53	2026-02-21 23:25:33.53	123	-10.2520968	-54.9989478
65b235e1-1be1-4070-8334-2d4a51273d1c	Quadra 03, Conjunto A		Paranoá	Distrito Federal	Brasil		2026-02-22 00:11:56.313	2026-02-22 00:11:56.313	123	-15.7681898	-47.7785586
129c7b7b-55d7-497a-a1af-b8c49cf76da6	Quadra 25, Lotes 1-20		Paranoá	Distrito Federal	Brasil		2026-02-22 00:11:57.37	2026-02-22 00:11:57.37	123	\N	\N
89d8399a-5ef8-47b1-8082-6a19b9376858	Avenida Paranoá, Praça Central		Paranoá	Distrito Federal	Brasil		2026-02-22 00:11:59.249	2026-02-22 00:11:59.249	123	\N	\N
855a44b2-5f36-481f-8b6d-b14768cbded2	Quadra 01, Área Especial		Paranoá	Distrito Federal	Brasil		2026-02-22 00:12:00.142	2026-02-22 00:12:00.142	123	\N	\N
5436b106-8364-48ee-a5f1-ef56587cbb0d	Quadra 05, Conjunto D, Centro Comunitário		Paranoá	Distrito Federal	Brasil		2026-02-22 00:12:01.018	2026-02-22 00:12:01.018	123	\N	\N
52b391c1-224e-4a71-9d42-aa67935e2ae2	Cadman Plaza West		New York	New York	United States		2026-02-22 00:14:32.393	2026-02-22 00:14:32.393	123	40.7000348	-73.9908751
83bbb959-9053-42df-87fc-2b83a4afaab5	MacDougal Street		New York	New York	United States		2026-02-22 00:14:33.15	2026-02-22 00:14:33.15	123	40.7280285	-74.0021577
5d548775-cb80-47a3-a358-682327ac1bc1	Park Avenue South		New York	New York	United States		2026-02-22 00:14:33.81	2026-02-22 00:14:33.81	123	40.7449087	-73.9830178
a9453863-f121-4818-a3d8-4d1c55a69d15	Malcolm X Blvd		New York	New York	United States		2026-02-22 00:14:34.584	2026-02-22 00:14:34.584	123	40.8214342	-73.9355236
4dc8c525-0ab9-4406-8204-91171ead5dba	W 42nd Street		New York	New York	United States		2026-02-22 00:14:35.097	2026-02-22 00:14:35.097	123	40.7583104	-73.9923464
\.


--
-- Data for Name: Attendee; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Attendee" (id, name, email, "createdAt", "updatedAt", "orderId") FROM stdin;
75c9c105-c518-4abf-b376-38c7d9a31e56	Fulano	vmrf2000@hotmail.com	2026-02-27 04:05:18.617	2026-02-27 04:05:18.617	bde18841-f9e0-4d4e-abd4-0fbd2a59e3d7
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Event" (id, title, description, date, "createdAt", "updatedAt", "creatorId", "maxAttendees", price, "addressId", image) FROM stdin;
8b7dee81-7ea8-49e7-b637-53489471219a	Carnaval Xique Xique 	Carnaval 2026 em Xique Xique	2026-02-13 22:00:00	2026-01-31 20:32:53.206	2026-01-31 20:32:53.206	84bd8963-9fea-4e41-a101-86725cd52a99	5000	0.00	dcaa559b-ece7-4c66-bc69-2d6ddf98aa30	https://res.cloudinary.com/ddyxmpdi0/image/upload/v1769891573/event_manager/events/1769891571368-Capa-Site-Carnavall.jpg
8987742f-0451-42d1-8daf-b3ff2ec72f18	evento de teste 2026	apenas um teste	2026-02-06 17:00:00	2026-02-01 02:53:15.553	2026-02-01 02:53:15.553	84bd8963-9fea-4e41-a101-86725cd52a99	25	10.00	5f826f1a-3712-4c9f-bc08-f83c9934e697	\N
623c4272-00aa-4b7f-a8c0-23d22d0db37a	Carnaval JF 2026	Carnaval em JF	2026-02-14 15:00:00	2026-02-03 05:12:41.659	2026-02-03 05:12:41.659	84bd8963-9fea-4e41-a101-86725cd52a99	10000	0.00	2b4dbe35-7243-4384-babc-f959556d2628	https://res.cloudinary.com/ddyxmpdi0/image/upload/v1770095559/event_manager/events/1770095558514-Programa--o-carnaval-2025-em-juiz-de-fora.png
8e1a073f-2495-49f8-8e77-c19d6c62289c	Carnaval São Paulo 2026	Carnaval em São Paulo 	2026-02-13 23:00:00	2026-02-11 04:19:32.442	2026-02-11 04:19:32.442	84bd8963-9fea-4e41-a101-86725cd52a99	50000	0.00	5d7b2194-2ff7-4f20-ab4a-9bf8c139e669	https://res.cloudinary.com/ddyxmpdi0/image/upload/v1770783569/event_manager/events/1770783568995-carnaval_sitepref_1248x832.png
cba8aa18-1a8a-4911-9267-636cc4826180	Noite de Choro e Samba na Rua Halfeld	Músicos locais se reúnem para uma roda de choro e samba ao ar livre, celebrando a cultura brasileira no coração da cidade. Comidas de boteco e cervejas artesanais completam a festa.	2026-03-04 08:20:02.142	2026-02-18 07:25:46.888	2026-02-18 07:25:46.888	c7309829-6500-445b-a3b5-bc48db4cd8e3	68	39.03	7c79044f-6a19-4e58-90a3-8646e090d85c	https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&sig=505&keywords=Noite%20de%20Choro%20e%20Samba%20na%20Rua%20Halfeld%2Cparty%2Cevent
07ac66a5-3bcf-4cbf-98f2-888370875198	Rota de Sabores Food Truck Festival	Um festival de food trucks com o melhor da culinária regional e internacional, harmonizada com cervejas artesanais e shows ao vivo. Ideal para toda a família no trecho mais movimentado da avenida.	2026-02-28 06:47:17.938	2026-02-18 07:25:48.355	2026-02-18 07:25:48.355	c7309829-6500-445b-a3b5-bc48db4cd8e3	80	14.40	152a5025-ec7e-486f-8f5d-f807daf47de0	https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&sig=728&keywords=Rota%20de%20Sabores%20Food%20Truck%20Festival%2Cparty%2Cevent
96436a73-24a3-4812-90d7-b53a0a5625c3	Festival Sabores da Montanha - Edição Inverno	Chefs locais se reúnem para apresentar pratos inspirados na culinária mineira de inverno, com harmonização de vinhos e cervejas artesanais. Música ao vivo e barracas de produtores regionais.	2026-02-26 20:59:00.355	2026-02-18 19:09:37.884	2026-02-18 19:09:37.884	c7309829-6500-445b-a3b5-bc48db4cd8e3	61	25.03	9e6d7138-6f7e-429f-82b6-ee005f8aa24e	https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&sig=0.01737541033857215&keywords=Festival%20Sabores%20da%20Montanha%20-%20Edi%C3%A7%C3%A3o%20Inverno%2Cparty%2Cevent
f9e26f97-1eb5-41b5-bfc9-4ab8fa50dd5e	Noite de Jazz na Halfeld	Concertos gratuitos de jazz e blues com artistas regionais e convidados especiais em palcos montados ao longo da rua. Apresentações itinerantes e food trucks gourmet.	2026-03-07 14:04:35.152	2026-02-18 19:09:39.483	2026-02-18 19:09:39.483	c7309829-6500-445b-a3b5-bc48db4cd8e3	78	46.50	9629f350-967e-437e-913f-84597f7d4590	https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&sig=0.0008910254831389075&keywords=Noite%20de%20Jazz%20na%20Halfeld%2Cparty%2Cevent
deddc49f-8490-447c-9a7e-135a21236a1f	Feira de Artesanato e Antiguidades da Praça Cívica	Exposição e venda de produtos artesanais, colecionáveis e antiguidades raras. Oficinas gratuitas para crianças e adultos, além de food trucks com lanches e bebidas típicas.	2026-03-05 01:55:52.882	2026-02-18 19:09:40.416	2026-02-18 19:09:40.416	c7309829-6500-445b-a3b5-bc48db4cd8e3	103	26.84	dc27e375-ac8f-4020-9140-07dc7255b91c	https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop&sig=0.2445150243529537&keywords=Feira%20de%20Artesanato%20e%20Antiguidades%20da%20Pra%C3%A7a%20C%C3%ADvica%2Cparty%2Cevent
580a9000-0b0b-46f3-b9a1-9218aced3bc0	Inovatech SP Summit	Uma conferência de um dia com palestras e workshops sobre as últimas tendências em inteligência artificial e blockchain, reunindo startups, investidores e entusiastas de tecnologia.	2026-03-03 14:32:43.789	2026-02-18 19:46:16.997	2026-02-18 19:46:16.997	c7309829-6500-445b-a3b5-bc48db4cd8e3	63	29.14	7910e182-b4de-4d05-bb7a-a658f8fae62a	https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80
92e1ccb7-b9a1-4f86-b4ac-0e0bc2a4dd21	Noite de Samba e Choro na Vila	Uma roda de samba e choro animada com músicos locais celebrando a tradição brasileira em um ambiente descontraído. Venha dançar e provar petiscos típicos.	2026-03-04 13:30:36.488	2026-02-18 19:46:17.66	2026-02-18 19:46:17.66	c7309829-6500-445b-a3b5-bc48db4cd8e3	146	20.02	fa848ece-871c-4f1c-9b3c-d0469a72dd83	https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80
a09b1dfe-5066-4592-b3f5-387829f6fdac	Festival Gastronômico Sabor da Rua	Experimente o melhor da culinária de rua paulistana, com food trucks e barracas oferecendo desde acarajé e pasteis a hambúrgueres gourmet e doces artesanais.	2026-02-22 06:45:57.122	2026-02-18 19:46:18.92	2026-02-18 19:46:18.92	c7309829-6500-445b-a3b5-bc48db4cd8e3	71	23.61	affd58dd-ca5c-4aa6-b44c-e098945eaaa9	https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80
f56bf959-3415-427a-9c46-d12af1af3b95	Sunset Rooftop Party - Vista Panorâmica	Celebre o pôr do sol em um rooftop exclusivo com DJs tocando deep house e coquetéis autorais, oferecendo uma vista deslumbrante do skyline de São Paulo.	2026-03-02 09:29:27.769	2026-02-18 19:46:19.314	2026-02-18 19:46:19.314	c7309829-6500-445b-a3b5-bc48db4cd8e3	146	24.30	02c24b5e-2cb7-4d94-949e-79e5030ba841	https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80
934794da-2c35-4856-8bd6-13355849be8a	Sabores da Terra: Feira Gastronômica Regional	Descubra o melhor da culinária mato-grossense com pratos típicos, food trucks e produtos artesanais de Peixoto de Azevedo e cidades vizinhas.	2026-03-07 08:56:07.112	2026-02-21 23:25:31.037	2026-02-21 23:25:31.037	c7309829-6500-445b-a3b5-bc48db4cd8e3	101	6.63	19b8a5d6-bd93-4624-a193-41b9a8dcd844	https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80
e4cbd249-d750-4899-b616-300dc123db64	Exposição 'SP em Cores e Formas'	Uma mostra de arte contemporânea que explora a identidade visual e as nuances culturais de São Paulo através de pinturas, esculturas e instalações de artistas emergentes.	2026-03-02 05:59:16.12	2026-02-18 19:46:20.572	2026-02-18 20:32:19.099	c7309829-6500-445b-a3b5-bc48db4cd8e3	79	5.50	a66acf42-d25a-444a-ab03-b09677d054b9	https://images.unsplash.com/photo-1533551268962-824e232f7ee1?auto=format&fit=crop&w=1200&q=80
ffc6008f-4c56-4c2f-a0f8-81f4436dff32	Bossa Nova ao Pôr do Sol	Uma noite encantadora de clássicos da Bossa Nova com vista para a Baía de Guanabara, celebrando a música carioca.	2026-03-08 03:03:47.865	2026-02-21 08:32:19.248	2026-02-21 08:32:19.248	c7309829-6500-445b-a3b5-bc48db4cd8e3	56	34.05	2355491e-5e16-4a28-88a8-ef7b32dd3f4c	https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80
283ad3d6-cd84-4c1e-bbe9-48b6f0626307	Festival de Sabores da Lapa	Exploração gastronômica com food trucks, barracas de comida típica e workshops de culinária na efervescente Lapa.	2026-03-02 08:58:32.751	2026-02-21 08:32:19.593	2026-02-21 08:32:19.593	c7309829-6500-445b-a3b5-bc48db4cd8e3	138	2.65	bb9e9b4e-7f34-4303-a916-bd5d3f606faf	https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80
f5f8b49b-5bdb-483b-964a-a83f9a1044b1	Exposição 'Rio Antigo em Aquarela'	Uma viagem visual pelas paisagens e arquitetura histórica do Rio, reinterpretadas por artistas locais no coração do Centro.	2026-02-26 11:44:34.701	2026-02-21 08:32:20.843	2026-02-21 08:32:20.843	c7309829-6500-445b-a3b5-bc48db4cd8e3	109	28.00	f308d9d7-ab24-4a24-bd0a-19d5db9332e6	https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80
03b08cc5-e072-46cb-8f60-e7e45bc74cdc	Samba e Groove na Sacadura Cabral	Festa vibrante com roda de samba autêntica e DJs tocando o melhor da música brasileira, em um casarão histórico do Porto.	2026-03-05 13:32:19.274	2026-02-21 08:32:21.7	2026-02-21 08:32:21.7	c7309829-6500-445b-a3b5-bc48db4cd8e3	53	33.01	10d8f3d4-3480-4ee7-9219-420e49ad8ebb	https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80
313dd5d8-7fd2-45f5-af50-2cdb53fd5f72	Rio Tech Connect Summit	Conferência anual sobre inovações tecnológicas, startups e futuro digital, com painéis e networking para profissionais da área.	2026-03-09 07:02:00.775	2026-02-21 08:32:22.647	2026-02-21 08:32:22.647	c7309829-6500-445b-a3b5-bc48db4cd8e3	131	36.99	058bfab5-a787-4488-9aae-b5783733e599	https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80
fef29541-ef1e-442b-8e1b-043bc2c0f59d	Festival de Música Raiz Peixotense	Uma noite para celebrar a autêntica música sertaneja e de raiz com artistas locais e regionais, valorizando as tradições culturais da região.	2026-02-27 19:27:08.754	2026-02-21 23:25:30.226	2026-02-21 23:25:30.226	c7309829-6500-445b-a3b5-bc48db4cd8e3	122	59.06	99f51d54-d15a-4d9e-8313-a44b25052911	https://images.unsplash.com/photo-1514525253361-bee87184919a?auto=format&fit=crop&w=1200&q=80
0cb1b76c-7ae7-4e95-9e6a-44fe2b0bce56	Festa do Colono e da Agricultura Familiar	Celebração anual em homenagem aos trabalhadores rurais, com exposições de máquinas agrícolas, desfile, shows e uma praça de alimentação com comidas típicas.	2026-02-24 14:09:02.521	2026-02-21 23:25:31.906	2026-02-21 23:25:31.906	c7309829-6500-445b-a3b5-bc48db4cd8e3	125	7.89	b0ec583f-7f0b-4623-8870-44ad45463fba	https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80
885e1e81-5ce1-46b5-b624-d668bfb62851	Inova Peixoto: Workshop de Tecnologias para o Agronegócio	Palestras e demonstrações sobre as últimas inovações tecnológicas aplicadas à agricultura e pecuária, visando otimizar a produção e a sustentabilidade local.	2026-02-25 05:49:39.021	2026-02-21 23:25:32.773	2026-02-21 23:25:32.773	c7309829-6500-445b-a3b5-bc48db4cd8e3	149	8.45	75df32ee-63b9-4877-af35-4487d11d2e77	https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80
d9548190-3fdb-4970-9ef3-c3173f742e24	Noite da Família Peixotense	Um evento para toda a família com brincadeiras para crianças, apresentações culturais, praça de alimentação e muita confraternização ao ar livre.	2026-03-04 13:14:17.759	2026-02-21 23:25:33.53	2026-02-21 23:25:33.53	c7309829-6500-445b-a3b5-bc48db4cd8e3	60	58.90	bc4a315a-553a-4930-b7cc-8d8459cb84cc	https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80
c8adfa3c-1589-4cd0-b144-85c67acb92ee	Festival Gastronômico Sabor do Paranoá	Uma celebração dos sabores locais com food trucks, barracas de comidas típicas e chefs da região apresentando suas especialidades.	2026-02-24 06:28:45.997	2026-02-22 00:11:56.313	2026-02-22 00:11:56.313	c7309829-6500-445b-a3b5-bc48db4cd8e3	58	44.09	65b235e1-1be1-4070-8334-2d4a51273d1c	https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80
333248b1-cb15-4ae7-bf3e-afda339c2f44	Noite de Talentos Musicais Paranoenses	Apresentações ao vivo de bandas e artistas locais, abrangendo diversos gêneros musicais para valorizar a cena cultural da cidade.	2026-03-10 16:30:02.473	2026-02-22 00:11:57.37	2026-02-22 00:11:57.37	c7309829-6500-445b-a3b5-bc48db4cd8e3	61	0.73	129c7b7b-55d7-497a-a1af-b8c49cf76da6	https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80
c2a6339e-eea9-4670-8c52-d42320b662ba	Feira de Artesanato e Cultura Viva do Paranoá	Exposição e venda de produtos artesanais, oficinas criativas e apresentações de dança e capoeira, celebrando a identidade cultural local.	2026-03-06 05:44:55.571	2026-02-22 00:11:59.249	2026-02-22 00:11:59.249	c7309829-6500-445b-a3b5-bc48db4cd8e3	105	5.23	89d8399a-5ef8-47b1-8082-6a19b9376858	https://images.unsplash.com/photo-1533551268962-824e232f7ee1?auto=format&fit=crop&w=1200&q=80
fb7e97e6-1ce1-4e76-a769-883bd66736de	Festa Junina Comunitária da Quadra 01	Tradicional festa junina com quadrilha, comidas típicas, fogueira e muita diversão para toda a família celebrar as tradições populares.	2026-03-05 10:28:50.91	2026-02-22 00:12:00.142	2026-02-22 00:12:00.142	c7309829-6500-445b-a3b5-bc48db4cd8e3	144	19.38	855a44b2-5f36-481f-8b6d-b14768cbded2	https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80
0c8b82cf-6a2f-4d93-804a-057cbea31bc8	Workshop Gratuito: Primeiros Passos em Desenvolvimento Web	Um curso intensivo para iniciantes explorarem os fundamentos do HTML, CSS e JavaScript, com foco em criação de websites simples.	2026-03-06 18:17:18.538	2026-02-22 00:12:01.018	2026-02-22 00:12:01.018	c7309829-6500-445b-a3b5-bc48db4cd8e3	105	6.85	5436b106-8364-48ee-a5f1-ef56587cbb0d	https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80
7ded2984-ffff-4885-8357-b235ea37a46f	Taste of Brooklyn Heights Food Festival	Explore the diverse culinary landscape of Brooklyn with gourmet food trucks, artisanal vendors, and live cooking demonstrations. Sample everything from classic New York fare to international delicacies.	2026-03-03 17:51:34.487	2026-02-22 00:14:32.393	2026-02-22 00:14:32.393	c7309829-6500-445b-a3b5-bc48db4cd8e3	71	2.67	52b391c1-224e-4a71-9d42-aa67935e2ae2	https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80
873222c9-8000-4684-9225-5c59586c3498	Greenwich Village Jazz Revival	An evening dedicated to the soulful sounds of jazz in its historic heart. Featuring acclaimed local musicians and a special tribute to legendary jazz icons in an intimate setting.	2026-02-27 17:33:43.4	2026-02-22 00:14:33.15	2026-02-22 00:14:33.15	c7309829-6500-445b-a3b5-bc48db4cd8e3	76	5.91	83bbb959-9053-42df-87fc-2b83a4afaab5	https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80
7f20e4c3-5c04-4518-a3f8-99ae44e63b3c	NYC FutureTech Forum: AI & Urban Innovation	Join tech leaders, startups, and investors to discuss the future of AI in urban development, smart cities, and sustainable technologies. Featuring keynotes, panel discussions, and a startup showcase.	2026-02-24 05:14:02.928	2026-02-22 00:14:33.81	2026-02-22 00:14:33.81	c7309829-6500-445b-a3b5-bc48db4cd8e3	125	8.03	5d548775-cb80-47a3-a358-682327ac1bc1	https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80
02bd6d13-7b27-4f68-8168-07e4d5f0ad28	Uptown Cultural Canvas: Harlem Art Walk	A guided journey through Harlem's vibrant art scene, from historic galleries showcasing African-American art to contemporary studios. Discover murals, sculptures, and meet local artists.	2026-03-03 20:24:52.376	2026-02-22 00:14:34.584	2026-02-22 00:14:34.584	c7309829-6500-445b-a3b5-bc48db4cd8e3	54	32.33	a9453863-f121-4818-a3d8-4d1c55a69d15	https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80
7853bb38-41e1-4fe9-a8d2-635b447225d1	Midtown Manhattan Rooftop Rhythms	Unwind with breathtaking city views, live DJ sets spinning eclectic beats, and handcrafted cocktails. The perfect sophisticated party to experience the energy of New York at night.	2026-03-07 15:26:59.249	2026-02-22 00:14:35.097	2026-02-22 00:14:35.097	c7309829-6500-445b-a3b5-bc48db4cd8e3	73	14.87	4dc8c525-0ab9-4406-8204-91171ead5dba	https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80
\.


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Order" (id, "totalAmount", status, "createdAt", "updatedAt", "userId", "eventId", quantity) FROM stdin;
bde18841-f9e0-4d4e-abd4-0fbd2a59e3d7	14.4	CONFIRMED	2026-02-27 04:05:18.56	2026-02-27 04:15:06.724	c7309829-6500-445b-a3b5-bc48db4cd8e3	07ac66a5-3bcf-4cbf-98f2-888370875198	1
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, name, password, role, "createdAt", "updatedAt") FROM stdin;
84bd8963-9fea-4e41-a101-86725cd52a99	vmrf2000@hotmail.com	Victor Admin	$2b$10$BDDYWQ9DwoecuusUeG1XBOfRhj6yT9XPsYJKiwEwaVZ3o1WoqKjg2	ADMIN	2025-08-08 06:41:11.494	2025-08-08 06:41:11.494
c7309829-6500-445b-a3b5-bc48db4cd8e3	admin@xplorehub.com	Admin	$2b$10$UtFWbb53BNwJVeAfcZuCeeGxLm04kGBON18MHIaKbByIOJZw7BG6S	ADMIN	2026-02-14 21:35:52.635	2026-02-14 21:35:52.635
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
d5ffab39-e865-45dc-916d-c9cdb6f4eca7	7fb55341b2a13f51d50190558ba68f15103a09073503e0b97a764eb318026800	2025-08-07 01:39:20.144708-03	20250807043920_init	\N	\N	2025-08-07 01:39:20.113592-03	1
fcd25c3e-ee6d-4104-9d8f-5df1fdacb618	8c1f966c195300d5ca2b6dc93b45d582d23d1089f592a95da9060d7aaaae44a4	2025-08-11 02:19:50.411547-03	20250811051950_add_max_attendees	\N	\N	2025-08-11 02:19:50.402984-03	1
099f5f71-0e0d-4a45-8beb-b11f8799b341	7f502d32be1b134d6896bf0e9799780662a93151963b24fb1c503919d40a2bd1	2025-08-12 23:46:57.864541-03	20250813024657_add_event_price	\N	\N	2025-08-12 23:46:57.833191-03	1
269080b1-0e4d-4b94-90c5-fa960e95dc33	f3273888c571d2a56e4596ae7c7f2dfef2eb50d9f792a88e225caf99d7434154	2025-08-18 03:08:22.318388-03	20250818060822_add_address	\N	\N	2025-08-18 03:08:22.294955-03	1
c6882163-759c-4fa4-a7fe-92f9d7631a9a	f8bed48777eb8b86241b04b9377800768ff11378074e1821599b6bdf1c027943	2025-08-21 00:46:24.461892-03	20250821034624_added_cascade_deletions	\N	\N	2025-08-21 00:46:24.391376-03	1
0e188ed9-5c50-4888-a803-016aba320766	47bac7784842d18ee6ae61eb64f46289440d747b4c2cea84400662ee30abacfa	2025-09-17 23:01:16.580696-03	20250918020116_update_order_status	\N	\N	2025-09-17 23:01:16.551487-03	1
3fec2549-498b-4d71-8ede-9fc04a9bb6d2	9ab7dfe0f3e41270e1c6b7276d5b210dc5be4ef8fde98921dee625eef8768e7d	2025-10-10 02:59:30.350516-03	20251010055930_add_image_column	\N	\N	2025-10-10 02:59:30.333446-03	1
f70b53ce-206b-49de-8576-3d7f8ddae39f	693a0e5bb646aab6724376db81e5fd510dbd46202cec9dee0aedb76304e49d4c	2026-01-31 18:43:25.985821-03	20260131214325_add_coordinates_to_address	\N	\N	2026-01-31 18:43:25.979963-03	1
\.


--
-- Name: Address Address_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Address"
    ADD CONSTRAINT "Address_pkey" PRIMARY KEY (id);


--
-- Name: Attendee Attendee_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendee"
    ADD CONSTRAINT "Attendee_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Order Order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Attendee_orderId_id_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Attendee_orderId_id_key" ON public."Attendee" USING btree ("orderId", id);


--
-- Name: Event_addressId_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Event_addressId_key" ON public."Event" USING btree ("addressId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Attendee Attendee_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Attendee"
    ADD CONSTRAINT "Attendee_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Order"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Event Event_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Address"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_creatorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_eventId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES public."Event"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Order Order_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Order"
    ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

