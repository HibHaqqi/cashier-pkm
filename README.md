# Rekapitulasi Pelayanan - Puskesmas

Sistem informasi rekapitulasi pelayanan untuk Puskesmas yang dibangun dengan Next.js, Tailwind CSS, Shadcn UI, dan PostgreSQL.

## Fitur Utama

### 0. Autentikasi & Multi-Tenancy 🔐
- **Sistem Login/Register**
  - JWT-based authentication dengan httpOnly cookies
  - Password hashing menggunakan bcrypt
  - Form validation client-side
  - Login/Register toggle dalam satu page
- **Multi-Tenancy Support**
  - Setiap user terhubung dengan Puskesmas ID
  - Data isolation per Puskesmas
  - Role-based access (staff, admin)
  - User active/inactive status management

### 1. Dashboard dan Navigasi
- **Dashboard View dengan Analitik**
  - KPI Cards: Total Pendapatan, Total Kunjungan Pasien, Layanan Terlaris
  - Tren Pendapatan Harian (Area Chart dengan gradient)
  - Distribusi Jenis Pelayanan (Donut Chart)
  - Filter periode: Hari Ini, Minggu Ini, Bulan Ini, Kustom Tanggal
  - Tooltips interaktif pada chart
  - Indikator trend positif/negatif
- Sidebar navigasi dengan menu dropdown
- Desain responsif dan modern
- Indikator menu aktif

### 2. Daftar Rekapitulasi Pelayanan (List View)
- Tabel data dengan pencarian dan filter
- Filter berdasarkan rentang tanggal
- Pencarian teks real-time
- Pengaturan jumlah entries per halaman
- Menu aksi untuk setiap data (Edit, Print, Detail, Hapus)
- Tombol Show Total Pendapatan dan Export Excel

### 3. Form Tambah Rekapitulasi Pelayanan
- Form input lengkap untuk data pasien
- Sistem auto-generate nomor kwitansi
- Manajemen jenis pelayanan dengan modal popup
- Kalkulasi otomatis subtotal dan total tarif
- Validasi form required
- Tabel dinamis untuk daftar jenis pelayanan

## Teknologi yang Digunakan

### Frontend
- **Next.js 15.1.3** - React framework dengan App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling dan design system
- **Lucide React** - Icon library
- **Recharts 3.8.1** - Data visualization charts
- **Class Variance Authority** - Component variant management

### Backend & Database
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM** - Database ORM dan migrations
- **PostgreSQL** - Primary database
- **bcryptjs** - Password hashing
- **jose** - JWT token creation dan verification
- **httpOnly Cookies** - Secure token storage

## Struktur Project

```
cashier-pkm/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page dengan view switching
│   ├── login/              # Login/Register page
│   │   └── page.tsx
│   ├── globals.css         # Global styles dan CSS variables
│   └── api/                # API Routes
│       ├── auth/
│       │   ├── login/route.ts
│       │   ├── register/route.ts
│       │   └── me/route.ts
│       ├── dashboard/
│       │   └── metrics/route.ts
│       ├── master-pelayanan/route.ts
│       └── rekap-pelayanan/route.ts
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── badge.tsx
│   ├── sidebar.tsx         # Sidebar navigation component
│   ├── dashboard.tsx       # Dashboard with charts and KPI cards
│   ├── service-recap-list-view.tsx  # List view component
│   └── add-service-form.tsx         # Form tambah component
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   ├── auth.ts             # JWT & password utilities
│   └── utils.ts            # Utility functions (cn helper)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seeder
└── public/                 # Static assets

```

## Instalasi dan Menjalankan

### Prasyarat
- Node.js 18+ 
- npm atau yarn

### Instalasi

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

### Database Setup

**Option 1: Using Docker (Recommended)**

```bash
# Start PostgreSQL container
docker compose up -d

# The database will be available at:
# Host: localhost:5434
# Database: cashier_pkm
# User: koscek_user
# Password: koscek_password
```

**Option 2: Using Existing PostgreSQL**

```bash
# Update .env with your database credentials
# Then run migrations:
npx prisma migrate dev
```

**Run Database Setup**

```bash
# Setup environment variables
cp .env.example .env

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database with initial data
npm run db:seed
```

**Default Admin User**
- Email: `admin@puskesmas.id`
- Password: `admin123`
- Puskesmas ID: `PUSKESMAS-001`

### Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cashier_pkm"

# JWT Secret (generate a strong random string)
JWT_SECRET="your-secret-key-change-in-production"

# Node Environment
NODE_ENV="development"
```

## Deployment

### Production with Docker

**Prerequisites:**
- Docker and Docker Compose installed
- Existing `koscek-postgres` container running
- Network `koscek_koscek-network` exists

**Build and Deploy:**

```bash
# Build the Docker image
docker compose -f docker-compose.prod.yml build

# Start the container
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Stop the container
docker compose -f docker-compose.prod.yml down
```

**Access the Application:**
- URL: `http://localhost:3155`
- Health Check: `http://localhost:3155/api/health`

**Production Environment Variables:**

Create a `.env.production` file:

```env
# Database (internal Docker network)
DATABASE_URL="postgresql://koscek_user:koscek_password@koscek-postgres:5432/cashier_pkm?schema=public"

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET="your-production-secret-key-min-32-chars"

# Node Environment
NODE_ENV="production"
```

**Container Details:**
- Container Name: `cashier-pkm`
- Network: `koscek_koscek-network` (shared with koscek-postgres)
- Port: `3155` (host) → `3000` (container)
- Restart Policy: `unless-stopped`

## Komponen dan Fitur

### 1. Dashboard (Main View)
- **KPI Cards**
  - Total Pendapatan (Bulan Ini) dengan trend indicator
  - Total Kunjungan Pasien dengan trend indicator
  - Layanan Terlaris dengan transaction count
- **Charts & Analytics**
  - Tren Pendapatan Harian (Area Chart)
    - X-Axis: Days of month
    - Y-Axis: Revenue in IDR (500k, 1M, 1.5M format)
    - Gradient fill dengan primary blue theme
    - Interactive tooltips showing exact amounts
  - Distribusi Jenis Pelayanan (Donut Chart)
    - Service type proportions with color coding
    - Interactive legends
    - Tooltips showing count and percentage
- **Interactive Filter**
  - Dropdown: Hari Ini, Minggu Ini, Bulan Ini, Kustom Tanggal

### 2. Sidebar Navigation
- Logo dan profile icon
- Menu: Dashboard, Master Data, Keuangan (dengan dropdown)
- Active state highlighting
- State management untuk dropdown expand/collapse

### 2. Service Recap List View
- Data table dengan kolom: No, Alamat, Jenis Pelayanan, Total Tarif, Sumber Pendanaan, Metode Pembayaran, Aksi
- Action dropdown dengan options: Edit, Print Kwitansi, Detail, Hapus
- Filter controls: Date range, Show entries, Search
- Pagination controls

### 3. Add Service Form
- Input fields: No. Kwitansi (auto), Tanggal, Nama, Alamat, Jenis Kelamin, Usia, No. RM, Sumber Pendanaan, Metode Pembayaran
- Service items sub-form dengan modal popup
- Dynamic table dengan kalkulasi otomatis
- Total tarif keseluruhan auto-calculation

## API Endpoints

### Authentication

#### POST `/api/auth/login`
Login user dan set JWT cookie.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@example.com",
    "role": "staff",
    "puskesmasId": "PUSKESMAS-001"
  }
}
```

#### POST `/api/auth/register`
Registrasi user baru.

**Request:**
```json
{
  "puskesmasId": "PUSKESMAS-001",
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "staff"
}
```

#### GET `/api/auth/me`
Get current authenticated user info.

### Dashboard

#### GET `/api/dashboard/metrics?period=Bulan+Ini`
Get dashboard KPI dan chart data.

**Query Parameters:**
- `period`: "Hari Ini" | "Minggu Ini" | "Bulan Ini"
- `startDate`: ISO date (untuk custom range)
- `endDate`: ISO date (untuk custom range)

**Response:**
```json
{
  "kpi": {
    "totalPendapatan": { "value": 15000000, "trend": 12.5, "positive": true },
    "totalKunjungan": { "value": 250, "trend": 8.3, "positive": true },
    "layananTerlaris": { "nama": "Pemeriksaan Umum", "count": 120, "total": 6000000 }
  },
  "charts": {
    "dailyRevenue": [{ "date": "01 Jan", "revenue": 500000 }],
    "serviceDistribution": [{ "name": "Umum", "count": 100, "color": "#3b82f6" }]
  }
}
```

### Master Pelayanan

#### GET `/api/master-pelayanan?kategori=Umum&search=pemeriksaan`
Get semua master pelayanan (filtered by puskesmasId).

#### POST `/api/master-pelayanan`
Create master pelayanan baru.

**Request:**
```json
{
  "kategori": "Umum",
  "jenisPelayanan": "Pemeriksaan Umum",
  "tarif": 50000,
  "satuan": "kunjungan"
}
```

#### PUT `/api/master-pelayanan`
Update master pelayanan.

#### DELETE `/api/master-pelayanan?id=uuid`
Delete master pelayanan.

### Rekap Pelayanan

#### GET `/api/rekap-pelayanan?startDate=2024-01-01&endDate=2024-01-31`
Get semua rekap pelayanan (filtered by puskesmasId).

#### POST `/api/rekap-pelayanan`
Create rekap pelayanan baru.

#### PUT `/api/rekap-pelayanan`
Update rekap pelayanan.

#### DELETE `/api/rekap-pelayanan?id=uuid`
Delete rekap pelayanan.

## State Management

Aplikasi menggunakan React `useState` hooks untuk:
- View switching (dashboard ↔ list ↔ form)
- Dashboard filter period management
- Form data management
- Service items array management
- Modal open/close state
- Sidebar dropdown and navigation states

## Styling

### Color Scheme
- Primary: Blue (`bg-blue-600`, `text-blue-700`)
- Secondary: Slate/Gray backgrounds
- Chart colors: Blue, Cyan, Amber, Emerald, Slate, Purple
- Accent colors: Cyan, Green untuk action buttons
- Amber/Orange untuk service addition button

### Components
- Shadcn UI-inspired design system
- CSS variables untuk theming
- Responsive design dengan Tailwind breakpoints
- Custom variants untuk button colors

## Data Mock

Untuk demonstrasi, aplikasi menggunakan mock data:
- `dailyRevenueData` - Daily revenue untuk chart (14 days)
- `serviceDistributionData` - Service type distribution dengan colors
- `kpiData` - KPI metrics dengan trend indicators
- `mockData` - Sample rekapitulasi pelayanan records
- `mockServices` - Sample jenis pelayanan dengan harga

## Database Schema

### User Model
```prisma
model User {
  id          String   @id @default(uuid())
  puskesmasId String   // Multi-tenancy
  name        String
  email       String   @unique
  password    String   // Bcrypt hashed
  role        String   @default("staff")
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### MasterPelayanan Model
```prisma
model MasterPelayanan {
  id               String   @id @default(uuid())
  puskesmasId      String
  kategori         String
  jenisPelayanan   String
  tarif            Decimal  @db.Decimal(12, 2)
  satuan           String?
  createdById      String?
  createdBy        User?    @relation(...)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### RekapPelayanan Model
```prisma
model RekapPelayanan {
  id                    String    @id @default(uuid())
  puskesmasId           String
  noKwitansi            String    @unique
  tanggal               DateTime
  nama                  String
  alamat                String
  jenisKelamin          String
  usia                  Int
  nomorRm               String
  sumberPendanaan       String
  metodePembayaran      String
  totalTarifKeseluruhan Decimal   @db.Decimal(12, 2)
  detailPelayanan       DetailPelayanan[]
}
```

## Security Considerations

- ✅ Password hashed menggunakan bcrypt (10 rounds)
- ✅ JWT tokens stored in httpOnly cookies (XSS protection)
- ✅ Multi-tenancy data isolation via puskesmasId
- ✅ Token expiration: 7 days
- ⚠️ CSRF protection perlu ditambahkan
- ⚠️ Rate limiting perlu diimplementasi
- ⚠️ Input validation perlu diperkuat dengan Zod

## Catatan untuk Pengembangan Lanjutan

### ✅ Sudah Implementasi
- [x] Backend Integration dengan API endpoints
- [x] Prisma + PostgreSQL database
- [x] JWT Authentication system
- [x] Multi-tenancy support per Puskesmas
- [x] Dashboard analytics dengan real data

### 🔄 Todo Items
1. **Validation**: Implement form validation yang lebih robust dengan Zod
2. **Error Handling**: Add error boundaries dan error handling UI
3. **Loading States**: Add loading skeletons dan states
4. **Unit Testing**: Add component tests dengan React Testing Library
5. **E2E Testing**: Add E2E tests dengan Playwright atau Cypress
6. **Logout Functionality**: Implement logout endpoint dan UI
7. **Password Reset**: Add forgot password dan reset flow
8. **User Management**: Admin page untuk manage users per Puskesmas

## Security Vulnerability Note

Next.js 15.1.3 has known security vulnerabilities. Untuk production:
```bash
npm audit fix
```

Atau upgrade ke versi terbaru yang telah di-patch.

## License

Project ini dibuat untuk keperluan Puskesmas.
