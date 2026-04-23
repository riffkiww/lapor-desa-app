import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Memanggil file CSS yang baru kita buat

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
      const res = await axios.get('http://localhost:5050/api/pengaduan');
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
      await axios.post('http://localhost:5050/api/pengaduan', data);
      alert("Laporan berhasil dikirim!");
      setFormData({ nama: '', judul: '', isi: '', foto: null });
      fetchLaporan();
    } catch (err) {
      alert("Backend belum siap, form belum bisa dikirim!");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Lapor Desa</h1>
        <p>Sistem Pengaduan Masyarakat Desa Berbasis Cloud</p>
      </div>
      
      {/* Bagian Form Input */}
      <div className="card">
        <h3 style={{marginTop: 0, marginBottom: '1.5rem', color: '#111827'}}>Buat Laporan Baru</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Pelapor</label>
            <input type="text" name="nama" className="form-input" placeholder="Masukkan nama lengkap" value={formData.nama} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Judul Laporan</label>
            <input type="text" name="judul" className="form-input" placeholder="Contoh: Jalan berlubang di RT 01" value={formData.judul} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Detail Laporan</label>
            <textarea name="isi" className="form-input" rows="4" placeholder="Ceritakan detail aduan Anda..." value={formData.isi} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Upload Bukti Foto</label>
            <input type="file" name="foto" className="form-input file-input" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-submit">Kirim Laporan</button>
        </form>
      </div>

      <hr style={{border: 'none', borderTop: '2px solid #e5e7eb', margin: '3rem 0'}} />

      {/* Bagian Dashboard/List Laporan */}
      <h2 style={{color: '#111827', marginBottom: '1.5rem'}}>Daftar Pengaduan Terbaru</h2>
      
      {laporan.length === 0 ? (
        <p style={{textAlign: 'center', color: '#6b7280'}}>Belum ada laporan yang masuk.</p>
      ) : (
        <div className="grid-laporan">
          {laporan.map((item) => (
            <div key={item.id} className="laporan-card">
              <h4>{item.judul_laporan}</h4>
              <p style={{color: '#6b7280', fontSize: '0.9rem'}}><strong>Pelapor:</strong> {item.nama_pelapor}</p>
              <p style={{lineHeight: '1.5'}}>{item.isi_laporan}</p>
              {item.foto_url && (
                <img src={item.foto_url} alt="bukti" style={{ width: '100%', borderRadius: '8px', marginTop: '1rem' }} />
              )}
              <span className="badge-status">{item.status || 'Menunggu'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;