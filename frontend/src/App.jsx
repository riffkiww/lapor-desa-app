import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- STATE UNTUK PINDAH HALAMAN ---
  const [halamanAktif, setHalamanAktif] = useState('dashboard');

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
      setHalamanAktif('dashboard');
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

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <nav className="navbar glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="brand-wrap">
          <span className="brand-dot" aria-hidden="true" />
          <h2 style={{ cursor: 'pointer' }} onClick={() => setHalamanAktif('dashboard')}>LaporDesa</h2>
        </div>
        
        {/* Menu Navigasi Tengah */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => setHalamanAktif('dashboard')}
            style={{ background: halamanAktif === 'dashboard' ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', transition: '0.3s' }}
          >
            Beranda
          </button>
          <button 
            onClick={() => setHalamanAktif('form')}
            style={{ background: halamanAktif === 'form' ? 'rgba(255,255,255,0.1)' : 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', transition: '0.3s' }}
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
          <>
            <header className="hero glass-panel" style={{ textAlign: 'center' }}>
              <p className="hero-kicker">Platform Pengaduan Terintegrasi</p>
              <h1>Pengaduan Warga, Dikelola Cepat dan Transparan.</h1>
              <p className="hero-subtext" style={{ margin: '0 auto', maxWidth: '600px' }}>
                Antarmuka modern untuk menerima laporan, memantau status, dan mempercepat tindakan secara real-time.
              </p>
              
              {/* Box Statistik Buatan */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: '30px 0' }}>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', minWidth: '150px' }}>
                  <h2 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: '#38bdf8' }}>{laporan.length}</h2>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Total Laporan</span>
                </div>
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', minWidth: '150px' }}>
                  <h2 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: '#10b981' }}>98%</h2>
                  <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>Tingkat Respon</span>
                </div>
              </div>

              {/* Tombol Call to Action */}
              <button 
                className="btn-submit" 
                onClick={() => setHalamanAktif('form')}
                style={{ maxWidth: '300px', margin: '0 auto', fontSize: '1.1rem', padding: '16px' }}
              >
                ⚡ Laporkan Masalah Sekarang
              </button>
            </header>

            <section className="dashboard-grid" style={{ display: 'block', marginTop: '40px' }}>
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
                          style={{ animationDelay: `${index * 80}ms` }}
                        >
                          <div className="laporan-meta">
                            <span className="status-badge">{status}</span>
                            <span className="laporan-author">Oleh {nama}</span>
                          </div>
                          <h4>{judul}</h4>
                          {hasImage && (
                            <div className="image-wrap">
                              <img src={item.foto_url} alt={`Bukti laporan ${judul}`} />
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>
            </section>
          </>
        )}

        {/* ==========================================
            HALAMAN 2: FORM INPUT
            ========================================== */}
        {halamanAktif === 'form' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <button 
              onClick={() => setHalamanAktif('dashboard')}
              style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              ← Kembali ke Dashboard
            </button>

            <aside className="form-section glass-panel" style={{ width: '100%' }}>
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

                <button type="submit" className="btn-submit" disabled={isSubmitting} style={{ marginTop: '20px' }}>
                  {isSubmitting ? 'Memproses Data...' : 'Kirim Laporan Resmi'}
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