import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- STATE UNTUK PINDAH HALAMAN ---
  const [halamanAktif, setHalamanAktif] = useState('dashboard');
  const [arahTransisi, setArahTransisi] = useState('forward');

  const [laporan, setLaporan] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    judul: '',
    isi: '',
    foto: null
  });

  useEffect(() => {
    if (!toast) {
      return undefined;
    }
    const timeout = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timeout);
  }, [toast]);

  const fetchLaporan = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get('http://18.143.140.149:5050/api/pengaduan');
      setLaporan(res.data);
    } catch (err) {
      console.log("Belum terhubung ke backend");
      setToast({ type: 'error', message: 'Tidak dapat memuat laporan dari server.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLaporan(); }, []);

  const handleChange = (e) => {
    if (e.target.name === 'foto') {
      setFormData({ ...formData, foto: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('judul', formData.judul);
    data.append('isi', formData.isi);
    data.append('foto', formData.foto);

    try {
      await axios.post('http://18.143.140.149:5050/api/pengaduan', data);
      setToast({ type: 'success', message: 'Laporan berhasil dikirim.' });
      setFormData({ nama: '', judul: '', isi: '', foto: null });
      fetchLaporan(); 
      
      // KEMBALI KE DASHBOARD SETELAH SUKSES KIRIM
      pindahHalaman('dashboard');
    } catch (err) {
      setToast({ type: 'error', message: 'Backend belum siap, form belum bisa dikirim.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCardVariant = (index, hasImage) => {
    const variants = ['accent-cyan', 'accent-indigo', 'accent-emerald', 'accent-amber'];
    const size = hasImage ? 'bento-wide' : index % 3 === 0 ? 'bento-tall' : 'bento-regular';
    return `${size} ${variants[index % variants.length]}`;
  };

  const pindahHalaman = (target) => {
    if (target === halamanAktif) {
      return;
    }

    const urutanHalaman = { dashboard: 0, form: 1 };
    setArahTransisi(urutanHalaman[target] > urutanHalaman[halamanAktif] ? 'forward' : 'backward');
    setHalamanAktif(target);
  };

  const getViewTransitionClass = (viewName) => {
    if (viewName === 'form' && arahTransisi === 'forward') {
      return 'enter-from-right';
    }

    if (viewName === 'dashboard' && arahTransisi === 'backward') {
      return 'enter-from-left';
    }

    return 'enter-fade';
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <nav className="navbar glass-panel">
        <div className="brand-wrap">
          <span className="brand-dot" aria-hidden="true" />
          <h2 className="brand-title" onClick={() => pindahHalaman('dashboard')}>LaporDesa</h2>
        </div>
        
        {/* Menu Navigasi Tengah */}
        <div className="nav-tabs">
          <button 
            onClick={() => pindahHalaman('dashboard')}
            className={`nav-tab ${halamanAktif === 'dashboard' ? 'active' : ''}`}
          >
            Beranda
          </button>
          <button 
            onClick={() => pindahHalaman('form')}
            className={`nav-tab ${halamanAktif === 'form' ? 'active' : ''}`}
          >
            Form Laporan
          </button>
        </div>

        <span className="badge-live">Realtime Citizen Desk</span>
      </nav>

      {toast && (
        <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}

      <main className="container">
        
        {/* ==========================================
            HALAMAN 1: DASHBOARD
            ========================================== */}
        {halamanAktif === 'dashboard' && (
          <div className={`page-view dashboard-view ${getViewTransitionClass('dashboard')}`}>
            <header className="hero glass-panel hero-centered">
              <p className="hero-kicker">Platform Pengaduan Terintegrasi</p>
              <h1>Pengaduan Warga, Dikelola Cepat dan Transparan.</h1>
              <p className="hero-subtext hero-subtext-centered">
                Antarmuka modern untuk menerima laporan, memantau status, dan mempercepat tindakan secara real-time.
              </p>
              
              {/* Box Statistik Buatan */}
              <div className="stats-container">
                <div className="glass-panel stat-card">
                  <h2 className="stat-value stat-cyan">{laporan.length}</h2>
                  <span className="stat-label">Total Laporan</span>
                </div>
                <div className="glass-panel stat-card">
                  <h2 className="stat-value stat-emerald">98%</h2>
                  <span className="stat-label">Tingkat Respon</span>
                </div>
              </div>

              {/* Tombol Call to Action */}
              <button 
                className="btn-submit huge-cta" 
                onClick={() => pindahHalaman('form')}
              >
                ⚡ Laporkan Masalah Sekarang
              </button>
            </header>

            <section className="dashboard-grid dashboard-feed-wrap">
              <section className="list-section">
                <div className="section-head list-head">
                  <h3>Live Feed Laporan</h3>
                  <span className="count-pill">Realtime updates</span>
                </div>

                {isLoading ? (
                  <div className="laporan-grid">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className={`laporan-item skeleton-card ${index === 0 ? 'bento-wide' : 'bento-regular'}`}>
                        <span className="skeleton-line short" />
                        <span className="skeleton-line" />
                        <span className="skeleton-line" />
                      </div>
                    ))}
                  </div>
                ) : laporan.length === 0 ? (
                  <div className="empty-state glass-panel">
                    <p>Belum ada laporan masuk. Sistem siap menerima laporan pertama.</p>
                  </div>
                ) : (
                  <div className="laporan-grid">
                    {laporan.map((item, index) => {
                      const judul = item.judul_laporan || item.judul;
                      const nama = item.nama_pelapor || item.nama;
                      const status = item.status || 'Menunggu';
                      const hasImage = Boolean(item.foto_url);

                      return (
                        <article
                          key={item.id || `${judul}-${index}`}
                          className={`laporan-item glass-panel ${getCardVariant(index, hasImage)}`}
                          style={{ 
                            animationDelay: `${index * 80}ms`,
                            display: 'flex', 
                            flexDirection: 'column' // Ditambahkan agar tombol Share selalu di bawah
                          }}
                        >
                          <div className="laporan-meta">
                            <span className="status-badge">{status}</span>
                            <span className="laporan-author">Oleh {nama}</span>
                          </div>
                          <h4>{judul}</h4>
                          {hasImage && (
                            <div className="image-wrap" style={{ marginBottom: '15px' }}>
                              <img src={item.foto_url} alt={`Bukti laporan ${judul}`} />
                            </div>
                          )}

                          {/* --- TOMBOL SHARE WHATSAPP --- */}
                          <div style={{ marginTop: 'auto', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                            <a 
                              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`🚨 *LAPOR DESA ALERT* 🚨\n\nAda aduan baru masuk dari warga!\n\n🗣️ *Pelapor:* ${nama}\n📌 *Kasus:* ${judul}\n\nMohon segera ditindaklanjuti ya, Pak/Bu! 🙏`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '8px',
                                textDecoration: 'none', 
                                color: '#22c55e',
                                background: 'rgba(34, 197, 94, 0.1)',
                                padding: '10px', 
                                borderRadius: '8px', 
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: '0.2s'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.2)'}
                              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(34, 197, 94, 0.1)'}
                            >
                              <span>📱</span> Viralkan ke WhatsApp
                            </a>
                          </div>
                          {/* ----------------------------- */}

                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </section>
          </div>
        )}

        {/* ==========================================
            HALAMAN 2: FORM INPUT
            ========================================== */}
        {halamanAktif === 'form' && (
          <div className={`form-page-wrap page-view form-view ${getViewTransitionClass('form')}`}>
            <button 
              onClick={() => pindahHalaman('dashboard')}
              className="btn-back"
            >
              ← Kembali ke Dashboard
            </button>

            <aside className="form-section glass-panel form-panel-full">
              <div className="section-head">
                <h3>Buat Laporan Baru</h3>
                <span>Enkripsi Aktif 🔒</span>
              </div>

              <form onSubmit={handleSubmit} className="report-form">
                <div className="form-group">
                  <label htmlFor="nama">Nama Pelapor</label>
                  <input id="nama" type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" required />
                </div>

                <div className="form-group">
                  <label htmlFor="judul">Judul Kasus</label>
                  <input id="judul" type="text" name="judul" value={formData.judul} onChange={handleChange} placeholder="Contoh: Lampu jalan mati di Blok A" required />
                </div>

                <div className="form-group">
                  <label htmlFor="isi">Kronologi Detail</label>
                  <textarea id="isi" rows="5" name="isi" value={formData.isi} onChange={handleChange} placeholder="Ceritakan detail temuan Anda" required />
                </div>

                <div className="form-group form-group-file">
                  <label htmlFor="foto">Lampiran Bukti (Foto)</label>
                  <input id="foto" type="file" name="foto" onChange={handleChange} accept="image/*" required />
                </div>

                <button type="submit" className="btn-submit form-submit" disabled={isSubmitting}>
                  <span>{isSubmitting ? 'Memproses Data...' : 'Kirim Laporan Resmi'}</span>
                  {isSubmitting && <span className="btn-progress" aria-hidden="true" />}
                </button>
              </form>
            </aside>
          </div>
        )}

      </main>
    </div>
  );
}

export default App;