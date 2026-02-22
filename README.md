# Neo World Weby Template (Next.js  Payload)
 
Tahle verze je připravená tak, aby šla na Ubuntu serveru (např. Hetzner) rozjet jen přes `git pull`  pár příkazů z README bez dalších úprav kódu.
 
## Tech stack
 - Next.js 15 App Router  TypeScript
- Payload CMS (ve stejné aplikaci)
- PostgreSQL 16
- Docker Compose pro produkční běh

Tahle verze je připravená tak, aby šla na Ubuntu serveru (např. Hetzner) rozjet jen přes `git pull` + pár příkazů z README bez dalších úprav kódu.

## Co běží
- Next.js 15 App Router + TypeScript
- Payload CMS (ve stejné aplikaci)
- PostgreSQL 16
- Docker Compose pro produkční běh

---

## Rychlé spuštění na Hetzner Ubuntu 

### 1) Požadavky na server
Nainstaluj Docker + Docker Compose plugin (jednorázově):

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
docker --version
docker compose version
```

### 2) Naklonuj repozitář
```bash
git clone <TVŮJ_REPO_URL>
cd web-demo-test-4
```

### 3) Připrav produkční env
```bash
cp .env.example .env
```

Pak v `.env` minimálně změň:
- `PAYLOAD_SECRET` na dlouhý náhodný řetězec.
- volitelně seed hesla (`SEED_ADMIN_PASSWORD`, `SEED_OWNER_PASSWORD`).

> Produkční DB URL se skládá automaticky v `docker-compose.prod.yml`, takže ji nemusíš ručně řešit.

### 4) Build + start
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Aplikace poběží na:
- web + Payload API: `http://SERVER_IP:3000`
- admin login: `http://SERVER_IP:3000/admin`
- Payload CMS: `http://SERVER_IP:3000/cms`

### 5) Seed obsahu a uživatelů (jen poprvé)
```bash
docker compose -f docker-compose.prod.yml exec -e NODE_ENV=development web npm run seed
```

Výchozí seed účty (pokud nezměníš env):
- Admin: `admin@example.com` / `ChangeMe123!`
- Owner: `owner@example.com` / `ChangeMe123!`

---

## Aktualizace po `git pull`

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

---

## Lokální vývoj (bez produkčního compose)

1. Start PostgreSQL:
   ```bash
   docker compose up -d postgres
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure env:
   ```bash
   cp .env.example .env
   ```
4. Run dev server:
   ```bash
   npm run dev
   ```
5. Seed starter content/users:
   ```bash
   npm run seed
   ```

---

## Routing
- `/` renderuje Payload page se slug `home`.
- `/home` permanentně redirectuje na `/`.
- `/{slug}` renderuje ostatní stránky z Payload (např. `/contact`).

## Poznámky
- Image preview v edit módu používá lokální object URLs až do Save.
- Save zůstává v edit módu a refreshuje `original` snapshot.
