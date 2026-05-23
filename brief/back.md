Act as a Full-Stack developer experienced in Next.js and postgress. Write the TypeScript logic, postgres prisma  initialization setup, and postgres  data fetching rules for the "cashier" app based on the following structural specifications.

### 1. Database Schema Design (Firestore Collection: `rekap_pelayanan`)
Design a structured JSON/NoSQL document map reflecting these fields:
- `id`: string (Auto-generated Firestore ID)
- `no_kwitansi`: string (Format: KW-YYYYMMDD-XXXX sequential or unique hash)
- `tanggal`: Timestamp
- `nama`: string
- `alamat`: string
- `jenis_kelamin`: string ('L' | 'P')
- `usia`: number
- `nomor_rm`: string
- `sumber_pendanaan`: string
- `metode_pembayaran`: string
- `layanan_items`: Array of objects:
  - `jenis_pelayanan`: string
  - `tarif_dasar`: number
  - `qty_kilometer`: number
  - `subtotal`: number
- `total_tarif_keseluruhan`: number
- `created_at`: Timestamp

### 2. State Management & Calculators
Provide React hooks handles for managing form states:
- Dynamic math logic where `subtotal = tarif_dasar * qty_kilometer`.
- Array reducer computing `total_tarif_keseluruhan = sum of all subtotals`.

### 3. Firebase CRUD Implementations
Write complete Next.js utility files for:
- `addPelayananRecord(data)`: Automates sequential invoice generation or timestamps, saves the structured form object, and pushes it safely to Firestore.
- `getPelayananRecords(filters)`: Handles fetching data with date ranges (`start_date`, `end_date`) and text-search queries.

Include necessary error handling structures.
