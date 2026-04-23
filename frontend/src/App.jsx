import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [laporan, setLaporan] = useState([]);
  const [formData, setFormData] = useState({
    nama: '',
    judul: '',
    isi: '',
    foto: null
  });

  const fetchLaporan = async () => {
    try {
      const res = await axios.get('http://18.143.140.149:5050/api/pengaduan');
      setLaporan(res.data);
    } catch (err) {
      console.log("Belum terhubung ke backend");
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
    const data = new FormData();
    data.append('nama', formData.nama);
    data.append('judul', formData.judul);
    data.append('isi', formData.isi);
    data.append('foto', formData.foto);

    try {
      await axios.post('http://18.143.140.149:5050/api/pengaduan', data);
      alert("Laporan berhasil dikirim!");
      setFormData({ nama: '', judul: '', isi: '', foto: null });
      fetchLaporan(); // Otomatis refresh daftar laporan setelah kirim
    } catch (err) {
      alert("Backend belum siap, form belum bisa dikirim!");
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

      <nav className="navbar glass-panel">
        <div className="brand-wrap">
          <span className="brand-dot" aria-hidden="true" />
          <h2>LaporDesa</h2>
        </div>
        <span className="badge-live">Realtime Citizen Desk</span>
      </nav>

      <main className="container">
        <header className="hero glass-panel">
          <p className="hero-kicker">Platform Pengaduan Terintegrasi</p>
          <h1>Pengaduan Warga, Dikelola Cepat dan Transparan.</h1>
          <p className="hero-subtext">
            Antarmuka modern untuk menerima laporan, memantau status, dan mempercepat tindakan.
          </p>
        </header>

        <section className="dashboard-grid">
          <aside className="form-section glass-panel">
            <div className="section-head">
              <h3>Buat Laporan Baru</h3>
              <span>Form Aman</span>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <div className="form-group">
                <label htmlFor="nama">Nama Pelapor</label>
                <input
                  id="nama"
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="judul">Judul Laporan</label>
                <input
                  id="judul"
                  type="text"
                  name="judul"
                  value={formData.judul}
                  onChange={handleChange}
                  placeholder="Contoh: Jalan berlubang di RT 01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="isi">Detail Laporan</label>
                <textarea
                  id="isi"
                  rows="5"
                  name="isi"
                  value={formData.isi}
                  onChange={handleChange}
                  placeholder="Ceritakan detail aduan Anda"
                  required
                />
              </div>

              <div className="form-group form-group-file">
                <label htmlFor="foto">Upload Bukti Foto</label>
                <input
                  id="foto"
                  type="file"
                  name="foto"
                  onChange={handleChange}
                  accept="image/*"
                  required
                />
              </div>

              <button type="submit" className="btn-submit">
                Kirim Laporan
              </button>
            </form>
          </aside>

          <section className="list-section">
            <div className="section-head list-head">
              <h3>Laporan Masuk</h3>
              <span className="count-pill">{laporan.length} total</span>
            </div>

            {laporan.length === 0 ? (
              <div className="empty-state glass-panel">
                <p>Belum ada laporan masuk. Laporan pertama akan tampil di sini.</p>
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
      </main>
    </div>
  );
}

export default App;