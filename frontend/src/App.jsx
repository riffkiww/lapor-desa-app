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

  return (
    <>
      {/* Navbar Baru */}
      <nav className="navbar">
        <h2>LaporDesa.</h2>
      </nav>

      {/* Hero / Sambutan Dashboard */}
      <header className="hero">
        <h1>Layanan Pengaduan Warga Terpadu</h1>
        <p>Sampaikan aspirasi dan laporan Anda. Kami siap melayani dengan cepat dan transparan.</p>
      </header>

      <div className="container">
        <div className="main-content">
          
          {/* Kolom Kiri: Form */}
          <div className="form-section">
            <div className="card">
              <h3 style={{marginTop: 0, color: '#333'}}>Buat Laporan Baru</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Pelapor</label>
                  {/* Disamakan menjadi formData.nama */}
                  <input type="text" name="nama" value={formData.nama} onChange={handleChange} placeholder="Masukkan nama lengkap" required />
                </div>
                <div className="form-group">
                  <label>Judul Laporan</label>
                  {/* Disamakan menjadi formData.judul */}
                  <input type="text" name="judul" value={formData.judul} onChange={handleChange} placeholder="Contoh: Jalan berlubang di RT 01" required />
                </div>
                <div className="form-group">
                  <label>Detail Laporan</label>
                  {/* Disamakan menjadi formData.isi */}
                  <textarea rows="4" name="isi" value={formData.isi} onChange={handleChange} placeholder="Ceritakan detail aduan Anda..." required></textarea>
                </div>
                <div className="form-group">
                  <label>Upload Bukti Foto</label>
                  <input type="file" name="foto" onChange={handleChange} accept="image/*" required />
                </div>
                <button type="submit" className="btn-submit">🚀 Kirim Laporan</button>
              </form>
            </div>
          </div>

          {/* Kolom Kanan: Daftar Laporan */}
          <div className="list-section">
            {/* Disamakan menjadi laporan.length */}
            <h3 style={{marginTop: 0, color: '#333'}}>Laporan Masuk ({laporan.length})</h3>
            
            {laporan.length === 0 ? (
              <p style={{color: '#888'}}>Belum ada laporan yang masuk.</p>
            ) : (
              <div className="laporan-grid">
                {/* Disamakan menjadi laporan.map */}
                {laporan.map((item) => (
                  <div key={item.id} className="card laporan-item">
                    {/* Sesuaikan dengan nama kolom di database (HeidiSQL) */}
                    <h4 style={{margin: '0 0 5px 0'}}>{item.judul_laporan || item.judul}</h4>
                    <span style={{fontSize: '0.9rem', color: '#666'}}>Oleh: {item.nama_pelapor || item.nama}</span>
                    {item.foto_url && (
                      <img src={item.foto_url} alt="Bukti laporan" />
                    )}
                    <span className="status-badge">{item.status || 'Menunggu'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default App;