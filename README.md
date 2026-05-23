# Rekapitulasi Pelayanan - Puskesmas

Sistem informasi rekapitulasi pelayanan untuk Puskesmas yang dibangun dengan Next.js, Tailwind CSS, dan Shadcn UI.

## Fitur Utama

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

- **Next.js 15.1.3** - React framework dengan App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling dan design system
- **Lucide React** - Icon library
- **Recharts 3.8.1** - Data visualization charts
- **Class Variance Authority** - Component variant management

## Struktur Project

```
cashier-pkm/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page dengan view switching
│   └── globals.css         # Global styles dan CSS variables
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
│   └── utils.ts            # Utility functions (cn helper)
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

## Catatan untuk Pengembangan Lanjutan

1. **Backend Integration**: Hubungkan dengan API endpoints untuk CRUD operations
2. **Database**: Implementasikan Prisma + PostgreSQL sesuai spec di `brief/back.md`
3. **Authentication**: Add user authentication dan authorization
4. **Validation**: Implement form validation yang lebih robust
5. **Error Handling**: Add error boundaries dan error handling
6. **Loading States**: Add loading skeletons dan states
7. **Unit Testing**: Add component tests dengan React Testing Library
8. **E2E Testing**: Add E2E tests dengan Playwright atau Cypress

## Security Vulnerability Note

Next.js 15.1.3 has known security vulnerabilities. Untuk production:
```bash
npm audit fix
```

Atau upgrade ke versi terbaru yang telah di-patch.

## License

Project ini dibuat untuk keperluan Puskesmas.
