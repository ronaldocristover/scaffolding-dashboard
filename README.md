# Dashboard Scaffolding

Dashboard modern yang dibangun dengan Vue 3, Vite, dan Tailwind CSS. Aplikasi ini memiliki fitur login/logout dan desain yang mobile-friendly.

## Fitur

- ✅ **Authentication System** - Login/logout dengan localStorage
- ✅ **Responsive Design** - Mobile-friendly dengan Tailwind CSS
- ✅ **Modern UI** - Menggunakan font Inter dan Poppins
- ✅ **Vue 3 Composition API** - Menggunakan setup() function
- ✅ **Vue Router** - Navigasi antar halaman
- ✅ **Pinia Store** - State management (siap digunakan)
- ✅ **Mobile Sidebar** - Sidebar yang dapat di-toggle di mobile

## Teknologi yang Digunakan

- **Vue 3** - Framework JavaScript progresif
- **Vite** - Build tool yang cepat
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Router resmi untuk Vue.js
- **Pinia** - State management untuk Vue
- **Inter & Poppins** - Font populer untuk UI modern

## Instalasi

1. Clone atau download proyek ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:3000`

## Demo Credentials

Untuk login, gunakan kredensial berikut:
- **Email**: admin@demo.com
- **Password**: password123

Atau gunakan email dan password apa saja untuk demo.

## Struktur Proyek

```
src/
├── pages/
│   ├── Login.vue          # Halaman login
│   └── Dashboard.vue      # Halaman dashboard utama
├── App.vue                # Komponen root
├── main.js                # Entry point aplikasi
└── style.css              # Global styles dengan Tailwind
```

## Fitur Dashboard

- **Stats Cards** - Menampilkan statistik penting
- **Charts Section** - Area untuk grafik (siap untuk integrasi chart library)
- **Recent Activities** - Daftar aktivitas terbaru
- **Orders Table** - Tabel pesanan terbaru
- **Responsive Sidebar** - Navigasi yang mobile-friendly
- **User Profile** - Informasi user di sidebar

## Customization

### Mengubah Warna Tema
Edit file `tailwind.config.js` untuk mengubah warna primary:

```javascript
colors: {
  primary: {
    // Ubah warna primary di sini
    500: '#your-color',
    600: '#your-color',
    // dst...
  }
}
```

### Menambah Halaman Baru
1. Buat komponen Vue di folder `src/pages/`
2. Tambahkan route di `src/main.js`
3. Update navigation di `Dashboard.vue`

## Build untuk Production

```bash
npm run build
```

File build akan tersimpan di folder `dist/`.

## Lisensi

MIT License - bebas digunakan untuk proyek pribadi maupun komersial.
