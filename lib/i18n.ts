export const languages = {
  en: {
    name: "English",
    flag: "🇺🇸",
  },
  id: {
    name: "Bahasa Indonesia",
    flag: "🇮🇩",
  },
} as const

export type Language = keyof typeof languages

export const defaultLanguage: Language = "id"

// Translation keys and values
export const translations = {
  en: {
    // Navigation
    "nav.signin": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.startNow": "Start Now",

    // Landing Page
    "landing.title": "Smart Weather Intelligence with Trend Analysis",
    "landing.subtitle":
      "Next-generation hydrometeorological platform featuring real-time trend indicators, comprehensive device metadata, and intelligent analytics. Monitor weather patterns with visual trend arrows, track device health with battery levels, and access complete operational history for every monitoring station.",
    "landing.startMonitoring": "Start Smart Monitoring",
    "landing.watchDemo": "Watch Trend Demo",
    "landing.trendAnalysis": "Advanced Trend Analysis & Device Intelligence",

    // Features
    "features.trendAnalysis.title": "Real-time Trend Analysis",
    "features.trendAnalysis.description":
      "Advanced trend indicators with visual arrows showing upward, downward, or stable patterns for all weather parameters.",
    "features.deviceMetadata.title": "Comprehensive Device Metadata",
    "features.deviceMetadata.description":
      "Complete device information including registration date, operational status, battery levels, and precise GPS coordinates.",
    "features.multiParameter.title": "Multi-Parameter Monitoring",
    "features.multiParameter.description":
      "Monitor floods, droughts, storms, temperature extremes, and all weather phenomena with intelligent trend detection.",
    "features.deviceHealth.title": "Device Health Monitoring",
    "features.deviceHealth.description":
      "Real-time battery status, connectivity health, and operational diagnostics for all monitoring stations.",
    "features.analytics.title": "Advanced Analytics Dashboard",
    "features.analytics.description":
      "Interactive visualizations with trend arrows, historical comparisons, and predictive modeling capabilities.",
    "features.alerts.title": "Intelligent Alert System",
    "features.alerts.description":
      "Smart notifications based on trend analysis, threshold breaches, and device health status changes.",

    // Trend Features
    "trends.upward.title": "Upward Trends",
    "trends.upward.description": "Rising values with green indicators",
    "trends.downward.title": "Downward Trends",
    "trends.downward.description": "Declining values with red indicators",
    "trends.stable.title": "Stable Patterns",
    "trends.stable.description": "Consistent values with neutral indicators",
    "trends.volatility.title": "Volatility Analysis",
    "trends.volatility.description": "Pattern recognition and variability tracking",

    // Authentication
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.createAccount": "Create Account",
    "auth.signinDescription": "Sign in to your weather dashboard",
    "auth.signupDescription": "Create your account to start monitoring",
    "auth.fullName": "Full Name",
    "auth.email": "Email Address",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.enterFullName": "Enter your full name",
    "auth.enterEmail": "Enter your email",
    "auth.enterPassword": "Enter your password",
    "auth.confirmYourPassword": "Confirm your password",
    "auth.signingIn": "Signing In...",
    "auth.creatingAccount": "Creating Account...",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.signinHere": "Sign in here",
    "auth.signupHere": "Sign up here",
    "auth.forgotPassword": "Forgot your password?",
    "auth.passwordStrength.weak": "Weak",
    "auth.passwordStrength.fair": "Fair",
    "auth.passwordStrength.good": "Good",
    "auth.passwordStrength.strong": "Strong",
    "auth.passwordNeeds": "Password needs:",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.logout": "Logout",
    "dashboard.totalStations": "Total Stations",
    "dashboard.onlineStations": "Online Stations",
    "dashboard.alertStations": "Alert Stations",
    "dashboard.avgBattery": "Avg Battery",
    "dashboard.weatherStations": "Weather monitoring stations",
    "dashboard.currentlyActive": "Currently active",
    "dashboard.aboveThreshold": "Above threshold",
    "dashboard.allStations": "Across all stations",
    "dashboard.stationStatus": "Station Status & Trends",
    "dashboard.loading": "Loading...",

    // Navigation Menu
    "menu.dashboard": "Dashboard",
    "menu.devices": "Devices",
    "menu.charts": "Charts",
    "menu.logs": "Event Logs",

    // Device Management
    "devices.title": "Smart Device Management",
    "devices.description": "Manage weather stations with comprehensive metadata and trend analysis",
    "devices.addDevice": "Add Device",
    "devices.addNewStation": "Add New Weather Station",
    "devices.addDescription": "Add a new hydrometeorological monitoring station to your network.",
    "devices.stationName": "Station Name",
    "devices.location": "Location",
    "devices.latitude": "Latitude",
    "devices.longitude": "Longitude",
    "devices.alertThreshold": "Alert Threshold (meters)",
    "devices.initialBattery": "Initial Battery Level (%)",
    "devices.registered": "Registered",
    "devices.battery": "Battery",
    "devices.coordinates": "Coordinates",
    "devices.currentTrends": "Current Trends",
    "devices.edit": "Edit",
    "devices.delete": "Delete",
    "devices.editStation": "Edit Weather Station",
    "devices.editDescription": "Update device information, settings, and metadata.",
    "devices.status": "Status",
    "devices.online": "Online",
    "devices.offline": "Offline",
    "devices.cancel": "Cancel",
    "devices.saveChanges": "Save Changes",
    "devices.lowBattery": "Low battery - maintenance required",

    // Charts
    "charts.title": "Smart Analytics & Trends",
    "charts.description": "Advanced data visualization with intelligent trend analysis",
    "charts.waterLevelTrends": "Water Level Trends",
    "charts.waterLevelDescription": "Real-time water level monitoring with trend analysis",
    "charts.precipitationAnalysis": "Precipitation Analysis",
    "charts.precipitationDescription": "Rainfall patterns and intensity monitoring",
    "charts.multiStationIntelligence": "Multi-Station Intelligence",
    "charts.multiStationDescription": "Comparative analysis across weather monitoring stations",
    "charts.currentTrend": "Current Trend",

    // Logs
    "logs.title": "Event Logs",
    "logs.description": "Monitor system activities and device events",
    "logs.filtersSearch": "Filters & Search",
    "logs.recentEvents": "Recent Events",
    "logs.recentDescription": "Latest system activities and alerts",
    "logs.searchLogs": "Search logs...",
    "logs.allTypes": "All Types",
    "logs.alerts": "Alerts",
    "logs.connections": "Connections",
    "logs.disconnections": "Disconnections",
    "logs.configuration": "Configuration",
    "logs.threshold": "Threshold",
    "logs.allSeverities": "All Severities",
    "logs.high": "High",
    "logs.medium": "Medium",
    "logs.low": "Low",
    "logs.allTime": "All Time",
    "logs.today": "Today",
    "logs.lastWeek": "Last Week",
    "logs.lastMonth": "Last Month",
    "logs.showing": "Showing",
    "logs.of": "of",
    "logs.events": "events",
    "logs.clearFilters": "Clear Filters",
    "logs.noEvents": "No events found matching your criteria",

    // Common
    "common.water": "Water",
    "common.rain": "Rain",
    "common.temp": "Temp",
    "common.humidity": "Humidity",
    "common.wind": "Wind",
    "common.pressure": "Pressure",
    "common.lastUpdate": "Last update",
    "common.justNow": "Just now",
    "common.minutesAgo": "m ago",
    "common.hoursAgo": "h ago",
    "common.waterLevelAboveThreshold": "Water level above threshold",
    "common.selectDevice": "Select device",
    "common.hours24": "24 Hours",
    "common.days7": "7 Days",
    "common.days30": "30 Days",

    // Footer
    "footer.intelligence": "Intelligence",
    "footer.monitoring": "Monitoring",
    "footer.support": "Support",
    "footer.trendAnalysis": "Trend Analysis",
    "footer.deviceIntelligence": "Device Intelligence",
    "footer.predictiveAnalytics": "Predictive Analytics",
    "footer.smartAlerts": "Smart Alerts",
    "footer.weatherPatterns": "Weather Patterns",
    "footer.deviceHealth": "Device Health",
    "footer.batteryStatus": "Battery Status",
    "footer.locationTracking": "Location Tracking",
    "footer.documentation": "Documentation",
    "footer.apiReference": "API Reference",
    "footer.training": "Training",
    "footer.technicalSupport": "Technical Support",
    "footer.allRightsReserved": "All rights reserved",

    // CTA Section
    "cta.title": "Ready for Intelligent Weather Monitoring?",
    "cta.description":
      "Experience the power of trend analysis and comprehensive device intelligence. Transform your weather monitoring with smart insights and complete operational visibility.",
    "cta.startMonitoring": "Start Smart Monitoring",
    "cta.accessDashboard": "Access Intelligence Dashboard",
  },
  id: {
    // Navigation
    "nav.signin": "Masuk",
    "nav.getStarted": "Mulai Sekarang",
    "nav.startNow": "Mulai Sekarang",

    // Landing Page
    "landing.title": "Intelijen Cuaca Cerdas dengan Analisis Tren",
    "landing.subtitle":
      "Platform hidrometeorologi generasi terbaru dengan indikator tren real-time, metadata perangkat komprehensif, dan analitik cerdas. Monitor pola cuaca dengan panah tren visual, lacak kesehatan perangkat dengan level baterai, dan akses riwayat operasional lengkap untuk setiap stasiun monitoring.",
    "landing.startMonitoring": "Mulai Monitoring Cerdas",
    "landing.watchDemo": "Lihat Demo Tren",
    "landing.trendAnalysis": "Analisis Tren Canggih & Intelijen Perangkat",

    // Features
    "features.trendAnalysis.title": "Analisis Tren Real-time",
    "features.trendAnalysis.description":
      "Indikator tren canggih dengan panah visual yang menunjukkan pola naik, turun, atau stabil untuk semua parameter cuaca.",
    "features.deviceMetadata.title": "Metadata Perangkat Komprehensif",
    "features.deviceMetadata.description":
      "Informasi perangkat lengkap termasuk tanggal registrasi, status operasional, level baterai, dan koordinat GPS yang presisi.",
    "features.multiParameter.title": "Monitoring Multi-Parameter",
    "features.multiParameter.description":
      "Monitor banjir, kekeringan, badai, suhu ekstrem, dan semua fenomena cuaca dengan deteksi tren cerdas.",
    "features.deviceHealth.title": "Monitoring Kesehatan Perangkat",
    "features.deviceHealth.description":
      "Status baterai real-time, kesehatan konektivitas, dan diagnostik operasional untuk semua stasiun monitoring.",
    "features.analytics.title": "Dashboard Analitik Canggih",
    "features.analytics.description":
      "Visualisasi interaktif dengan panah tren, perbandingan historis, dan kemampuan pemodelan prediktif.",
    "features.alerts.title": "Sistem Peringatan Cerdas",
    "features.alerts.description":
      "Notifikasi pintar berdasarkan analisis tren, pelanggaran ambang batas, dan perubahan status kesehatan perangkat.",

    // Trend Features
    "trends.upward.title": "Tren Naik",
    "trends.upward.description": "Nilai naik dengan indikator hijau",
    "trends.downward.title": "Tren Turun",
    "trends.downward.description": "Nilai turun dengan indikator merah",
    "trends.stable.title": "Pola Stabil",
    "trends.stable.description": "Nilai konsisten dengan indikator netral",
    "trends.volatility.title": "Analisis Volatilitas",
    "trends.volatility.description": "Pengenalan pola dan pelacakan variabilitas",

    // Authentication
    "auth.signin": "Masuk",
    "auth.signup": "Daftar",
    "auth.createAccount": "Buat Akun",
    "auth.signinDescription": "Masuk ke dashboard cuaca Anda",
    "auth.signupDescription": "Buat akun untuk memulai monitoring",
    "auth.fullName": "Nama Lengkap",
    "auth.email": "Alamat Email",
    "auth.password": "Kata Sandi",
    "auth.confirmPassword": "Konfirmasi Kata Sandi",
    "auth.enterFullName": "Masukkan nama lengkap Anda",
    "auth.enterEmail": "Masukkan email Anda",
    "auth.enterPassword": "Masukkan kata sandi Anda",
    "auth.confirmYourPassword": "Konfirmasi kata sandi Anda",
    "auth.signingIn": "Masuk...",
    "auth.creatingAccount": "Membuat Akun...",
    "auth.alreadyHaveAccount": "Sudah punya akun?",
    "auth.dontHaveAccount": "Belum punya akun?",
    "auth.signinHere": "Masuk di sini",
    "auth.signupHere": "Daftar di sini",
    "auth.forgotPassword": "Lupa kata sandi?",
    "auth.passwordStrength.weak": "Lemah",
    "auth.passwordStrength.fair": "Cukup",
    "auth.passwordStrength.good": "Baik",
    "auth.passwordStrength.strong": "Kuat",
    "auth.passwordNeeds": "Kata sandi memerlukan:",

    // Dashboard
    "dashboard.welcome": "Selamat datang kembali",
    "dashboard.logout": "Keluar",
    "dashboard.totalStations": "Total Stasiun",
    "dashboard.onlineStations": "Stasiun Online",
    "dashboard.alertStations": "Stasiun Siaga",
    "dashboard.avgBattery": "Rata-rata Baterai",
    "dashboard.weatherStations": "Stasiun monitoring cuaca",
    "dashboard.currentlyActive": "Saat ini aktif",
    "dashboard.aboveThreshold": "Di atas ambang batas",
    "dashboard.allStations": "Semua stasiun",
    "dashboard.stationStatus": "Status Stasiun & Tren",
    "dashboard.loading": "Memuat...",

    // Navigation Menu
    "menu.dashboard": "Dashboard",
    "menu.devices": "Perangkat",
    "menu.charts": "Grafik",
    "menu.logs": "Log Kejadian",

    // Device Management
    "devices.title": "Manajemen Perangkat Cerdas",
    "devices.description": "Kelola stasiun cuaca dengan metadata komprehensif dan analisis tren",
    "devices.addDevice": "Tambah Perangkat",
    "devices.addNewStation": "Tambah Stasiun Cuaca Baru",
    "devices.addDescription": "Tambahkan stasiun monitoring hidrometeorologi baru ke jaringan Anda.",
    "devices.stationName": "Nama Stasiun",
    "devices.location": "Lokasi",
    "devices.latitude": "Lintang",
    "devices.longitude": "Bujur",
    "devices.alertThreshold": "Ambang Batas Siaga (meter)",
    "devices.initialBattery": "Level Baterai Awal (%)",
    "devices.registered": "Terdaftar",
    "devices.battery": "Baterai",
    "devices.coordinates": "Koordinat",
    "devices.currentTrends": "Tren Saat Ini",
    "devices.edit": "Edit",
    "devices.delete": "Hapus",
    "devices.editStation": "Edit Stasiun Cuaca",
    "devices.editDescription": "Perbarui informasi perangkat, pengaturan, dan metadata.",
    "devices.status": "Status",
    "devices.online": "Online",
    "devices.offline": "Offline",
    "devices.cancel": "Batal",
    "devices.saveChanges": "Simpan Perubahan",
    "devices.lowBattery": "Baterai lemah - perlu perawatan",

    // Charts
    "charts.title": "Analitik & Tren Cerdas",
    "charts.description": "Visualisasi data canggih dengan analisis tren intelijen",
    "charts.waterLevelTrends": "Tren Tinggi Air",
    "charts.waterLevelDescription": "Monitoring tinggi air real-time dengan analisis tren",
    "charts.precipitationAnalysis": "Analisis Curah Hujan",
    "charts.precipitationDescription": "Pola curah hujan dan monitoring intensitas",
    "charts.multiStationIntelligence": "Intelijen Multi-Stasiun",
    "charts.multiStationDescription": "Analisis komparatif lintas stasiun monitoring cuaca",
    "charts.currentTrend": "Tren Saat Ini",

    // Logs
    "logs.title": "Log Kejadian",
    "logs.description": "Monitor aktivitas sistem dan kejadian perangkat",
    "logs.filtersSearch": "Filter & Pencarian",
    "logs.recentEvents": "Kejadian Terbaru",
    "logs.recentDescription": "Aktivitas sistem dan peringatan terbaru",
    "logs.searchLogs": "Cari log...",
    "logs.allTypes": "Semua Jenis",
    "logs.alerts": "Peringatan",
    "logs.connections": "Koneksi",
    "logs.disconnections": "Pemutusan",
    "logs.configuration": "Konfigurasi",
    "logs.threshold": "Ambang Batas",
    "logs.allSeverities": "Semua Tingkat",
    "logs.high": "Tinggi",
    "logs.medium": "Sedang",
    "logs.low": "Rendah",
    "logs.allTime": "Semua Waktu",
    "logs.today": "Hari Ini",
    "logs.lastWeek": "Minggu Lalu",
    "logs.lastMonth": "Bulan Lalu",
    "logs.showing": "Menampilkan",
    "logs.of": "dari",
    "logs.events": "kejadian",
    "logs.clearFilters": "Hapus Filter",
    "logs.noEvents": "Tidak ada kejadian yang sesuai dengan kriteria Anda",

    // Common
    "common.water": "Air",
    "common.rain": "Hujan",
    "common.temp": "Suhu",
    "common.humidity": "Kelembaban",
    "common.wind": "Angin",
    "common.pressure": "Tekanan",
    "common.lastUpdate": "Update terakhir",
    "common.justNow": "Baru saja",
    "common.minutesAgo": "m lalu",
    "common.hoursAgo": "j lalu",
    "common.waterLevelAboveThreshold": "Tinggi air di atas ambang batas",
    "common.selectDevice": "Pilih perangkat",
    "common.hours24": "24 Jam",
    "common.days7": "7 Hari",
    "common.days30": "30 Hari",

    // Footer
    "footer.intelligence": "Intelijen",
    "footer.monitoring": "Monitoring",
    "footer.support": "Dukungan",
    "footer.trendAnalysis": "Analisis Tren",
    "footer.deviceIntelligence": "Intelijen Perangkat",
    "footer.predictiveAnalytics": "Analitik Prediktif",
    "footer.smartAlerts": "Peringatan Cerdas",
    "footer.weatherPatterns": "Pola Cuaca",
    "footer.deviceHealth": "Kesehatan Perangkat",
    "footer.batteryStatus": "Status Baterai",
    "footer.locationTracking": "Pelacakan Lokasi",
    "footer.documentation": "Dokumentasi",
    "footer.apiReference": "Referensi API",
    "footer.training": "Pelatihan",
    "footer.technicalSupport": "Dukungan Teknis",
    "footer.allRightsReserved": "Hak cipta dilindungi",

    // CTA Section
    "cta.title": "Siap untuk Monitoring Cuaca Cerdas?",
    "cta.description":
      "Rasakan kekuatan analisis tren dan intelijen perangkat komprehensif. Transformasikan monitoring cuaca Anda dengan wawasan cerdas dan visibilitas operasional lengkap.",
    "cta.startMonitoring": "Mulai Monitoring Cerdas",
    "cta.accessDashboard": "Akses Dashboard Intelijen",
  },
} as const

export type TranslationKey = keyof (typeof translations)["en"]

// Get translation function
export function getTranslation(language: Language, key: TranslationKey): string {
  return translations[language][key] || translations[defaultLanguage][key] || key
}

// Get all translations for a language
export function getTranslations(language: Language) {
  return translations[language] || translations[defaultLanguage]
}
