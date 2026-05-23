Act as an expert Full-Stack Engineer specializing in Next.js (App Router), PostgreSQL, Prisma ORM, and TypeScript. Write the database architecture, schema definitions, and API route integrations to connect the "Rekapitulasi Pelayanan" application frontend seamlessly with a PostgreSQL backend database.

### 1. Prisma Schema Design (`schema.prisma`)
Generate a robust, relational schema that handles cascading structural mechanics correctly:

- `MasterPelayanan` Table:
  - `id`: String (UUID or custom String ID primary key)
  - `kategori`: String
  - `jenisPelayanan`: String
  - `tarif`: Decimal (Precision 12, scale 2 for accurate IDR monetary storage)
  - `satuan`: String (Optional, e.g., 'Kali', 'Km')
  - `createdAt` / `updatedAt`: Timestamps
  - Relation: One-to-many relation to `DetailPelayanan`

- `RekapPelayanan` Table (Patient Invoices):
  - `id`: String (UUID primary key)
  - `noKwitansi`: String (Unique index string)
  - `tanggal`: DateTime
  - `nama`: String
  - `alamat`: String
  - `jenisKelamin`: String (Char or String limit)
  - `usia`: Integer
  - `nomorRm`: String
  - `sumberPendanaan`: String
  - `metodePembayaran`: String
  - `totalTarifKeseluruhan`: Decimal (Precision 12, scale 2)
  - `createdAt` / `updatedAt`: Timestamps
  - Relation: One-to-many relation to `DetailPelayanan` (Cascading deletes enabled)

- `DetailPelayanan` Table (Junction Table for Selected Services):
  - `id`: String (UUID primary key)
  - `rekapPelayananId`: String (Foreign Key linking to RekapPelayanan)
  - `masterPelayananId`: String (Foreign Key linking to MasterPelayanan)
  - `jenisPelayananSnapshot`: String (Saves the service name string snapshot at time of billing)
  - `tarifDasar`: Decimal (Saves historical base rate price snapshot)
  - `qtyKilometer`: Decimal (Precision 10, scale 2 to capture distance fractions if needed)
  - `subtotal`: Decimal (Precision 12, scale 2)

### 2. Next.js API Routes Integration (App Router `/api/...`)

Generate clean Next.js server actions or API endpoints using `@prisma/client` to manage frontend state transformations:

- `POST /api/rekap-pelayanan` (Create Transaction Invoice):
  - Must use a Prisma Transaction (`prisma.$transaction`) framework block to ensure atomic multi-table inserts.
  - Generates the sequential dynamic invoice code (`noKwitansi`) inside the block handler safely.
  - Maps incoming form payloads into the parent `RekapPelayanan` row while simultaneously mapping the array items seamlessly into nested `DetailPelayanan` entries.

- `GET /api/rekap-pelayanan` (Fetch Data Rows & Aggregates):
  - Implements relational fetching (`include: { detailPelayanan: true }`).
  - Supports structural URL query params handling for `startDate`, `endDate`, and text `search` values mapping directly into conditional Prisma `where` blocks.

- `GET /api/dashboard/metrics` (Dashboard Analytics Pipeline):
  - Implements automated raw or aggregated queries returning cumulative global monthly totals (`_sum`), complete patient data metrics (`_count`), and a daily breakdown list array mapping values seamlessly to Recharts components.

Include type definitions, proper Decimal-to-Number parsers for frontend compatibility, and centralized prisma client connection configurations.