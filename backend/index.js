require('dotenv').config(); // WAJIB DI BARIS PALING ATAS
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');

const app = express();
const port = 5050;

// --- 1. MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. KONFIGURASI AWS S3 ---
// Sekarang menggunakan variabel dari file .env (Lebih Aman!)
const s3 = new S3Client({
    region: 'ap-southeast-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_S3_BUCKET_NAME || 'lapor-desa-rifki-2026', 
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});

// --- 3. KONEKSI DATABASE (AWS RDS AURORA) ---
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Gagal konek database RDS:', err);
        return;
    }
    console.log('✅ Terhubung ke database MySQL (AWS RDS)!');
});

// --- 4. ROUTES (API ENDPOINTS) ---

// Fitur 1: Dashboard (Read)
app.get('/api/pengaduan', (req, res) => {
    const sql = "SELECT * FROM pengaduan ORDER BY created_at DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Fitur 2: Upload Laporan ke S3 & Database (Create)
app.post('/api/pengaduan', upload.single('foto'), (req, res) => {
    const { nama, judul, isi } = req.body;
    const foto_url = req.file ? req.file.location : null;

    const sql = "INSERT INTO pengaduan (nama_pelapor, judul_laporan, isi_laporan, foto_url) VALUES (?, ?, ?, ?)";
    db.query(sql, [nama, judul, isi, foto_url], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.status(200).json({ message: 'Laporan berhasil disimpan ke S3 dan Database!' });
    });
});

app.listen(port, () => {
    console.log(`🚀 Server Backend berjalan di port ${port}`);
});