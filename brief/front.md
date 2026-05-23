Act as an expert frontend engineer specializing in Next.js, Tailwind CSS, and Shadcn UI. Build a clean, professional "Service Recapitulation" (Rekapitulation Pelayanan) web application interface for an Indonesian healthcare facility (Puskesmas), matching the provided design requirements.

### Core Framework & Styling
- Next.js (App Router), Tailwind CSS, Lucide React icons, and Shadcn UI components.
- Responsive design with a sticky left sidebar and a main content area using a light, modern aesthetic (slate/gray backgrounds with primary blue elements).

### Layout Components

1. Sidebar Navigation:
   - Header with placeholder for a logo and profile icon.
   - Menu items: "Dashboard", "Master Data", "Keuangan" (Dropdown active), with sub-items "Rekapitulation Pelayanan" (Active state) and "Ringkasan".

2. Main Section View 1: Data Table List ("Rekapitulation Pelayanan")
   - Top action bar: "Show Total Pendapatan" (Cyan button), "Export Excel" (Green button), and "+ Tambah Rekapitulasi Pelayanan" (Blue button to switch to the form view).
   - Filter controls: Date range picker ("mm/dd/yyyy to mm/dd/yyyy"), a green "Cari" button, a "Show entries" dropdown, and a search input box.
   - Data Table columns: No (Implicit), Alamat (Truncated), Jenis Pelayanan (Numbered list inside cell), Total Tarif (IDR Currency format, e.g., Rp 35.000), Sumber Pendanaan, Metode Pembayaran, Aksi.
   - Action Menu: A dropdown button under "Aksi" showing "Edit", "Print Kwitansi", "Detail", and "Hapus" options.

3. Main Section View 2: Add Service Form ("Tambah Rekapitulasi Pelayanan")
   - Title breadcrumb: Dashboard / Rekapitulasi Pelayanan / Tambah Rekapitulasi Pelayanan.
   - Input Fields grid:
     - NO. KWITANSI: Disabled input displaying "Auto Generate".
     - TANGGAL*: Date picker.
     - NAMA*: Text input with placeholder "Masukan nama pasien".
     - ALAMAT*: Full-width text input with placeholder "Masukan alamat pasien".
     - JENIS KELAMIN*: Radio buttons or toggle for "L" and "P".
     - USIA: Text/number input "Masukan usia pasien".
     - NOMOR RM: Text input "Masukan nomor rekam medis".
     - SUMBER PENDANAAN*: Select dropdown ("Pilih Sumber Pendanaan").
     - METODE PEMBAYARAN*: Select dropdown ("Pilih Metode Pembayaran").
   - Service Item Sub-Form ("Daftar Jenis Pelayanan Pasien"):
     - An amber/orange button "+ Tambah Jenis Pelayanan" that triggers a Pop-up modal.
     - The Pop-up modal must contain a searchable dropdown selection of services, an input field for "Qty / Kilometer", and a calculated "Total Tarif".
     - A dynamic sub-table displaying selected services with columns: JENIS PELAYANAN, TOTAL TARIF, QTY / KILOMETER, SUBTOTAL, and an action column to remove items.
     - A footer row in the sub-table showing "Total Tarif Keseluruhan" with a auto-calculated IDR value (defaulting to Rp 0).
   - Form Action Footer: Centered or right-aligned buttons for "<- Kembali" (Gray/Slate) and "Simpan" (Blue with a save icon).

Ensure clean code modularity, using standard state management (`useState`) to toggle between the list view and the creation form view smoothly.
