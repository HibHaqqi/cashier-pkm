Act as an expert frontend engineer specializing in Next.js, Tailwind CSS, and data visualization using Recharts (or Shadcn Chart components). Create a modern, responsive "Dashboard" view for the Puskesmas management system, matching the aesthetic and layout of the previous sidebar navigation.

### Layout & KPI Cards
The top of the dashboard should display a responsive grid (3 or 4 columns) of summary KPI cards with subtle shadows, icons, and trend indicators:
1. "Total Pendapatan (Bulan Ini)" - Displays large IDR currency format (e.g., Rp 15.420.000) with a positive/negative percentage trend indicator.
2. "Total Kunjungan Pasien" - Displays integer count of records.
3. "Layanan Terlaris" - Displays the name of the most frequently used service type.

### Analytics & Chart Components

1. Daily Revenue Chart ("Tren Pendapatan Harian")
   - A detailed Area or Bar Chart showing the total money collected on a daily basis for the current month.
   - X-Axis: Days of the month (formatted as dates or day numbers, e.g., "01 May", "02 May").
   - Y-Axis: Total money in IDR (formatted cleanly, e.g., 500k, 1M, 1.5M).
   - Features: Smooth interactive tooltips displaying the exact IDR amount when hovering over data points, a grid background, and a gradient fill matching the app's primary blue theme.

2. Service Trend Chart ("Distribusi Jenis Pelayanan")
   - A Pie Chart or Donut Chart showing the proportion/share of different services rendered (e.g., "Pemeriksaan Umum", "Tes Kehamilan", "Pemeriksaan Buta Warna").
   - Design: Clean modern color palette (Primary Blue, Cyan, Amber, Emerald, Slate).
   - Features: Responsive interactive legends mapping colors to the service name, and hovering tooltips displaying both the absolute count (Qty) and the total percentage share (e.g., "35%").

### Interactive Filter Header
- A row just below the main dashboard title containing a dropdown selector to filter data metrics ("Hari Ini", "Minggu Ini", "Bulan Ini", "Kustom Tanggal").

Ensure all charts use Mock Data matching the Firebase structure seamlessly, are fluidly responsive down to mobile screen sizes, and preserve the clean, professional look of the administrative panel.