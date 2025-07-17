const form = document.getElementById('productForm');
const produkList = document.getElementById('produkList');
const searchInput = document.getElementById('searchInput');
const filterKategori = document.getElementById('filterKategori');
const exportBtn = document.getElementById('exportExcel');
let produk = JSON.parse(localStorage.getItem('produk')) || [];

function updateKategoriOptions() {
  const cats = [...new Set(produk.map(p=>p.kategori).filter(c=>c))];
  filterKategori.innerHTML = `<option value="">Semua Kategori</option>`;
  cats.forEach(cat => {
    filterKategori.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}
function renderProduk() {
  const keyword = searchInput.value.toLowerCase();
  const catFilter = filterKategori.value;
  produkList.innerHTML = '';
  produk.filter(p=>{
    const matchesSearch = p.nama.toLowerCase().includes(keyword);
    const matchesCat = !catFilter || p.kategori === catFilter;
    return matchesSearch && matchesCat;
  }).forEach(item => {
    produkList.innerHTML += `
      <div class="produk-card">
        <img src="${item.gambar}" alt="${item.nama}" />
        <h3>${item.nama}</h3>
        <span class="kategori">${item.kategori||''}</span>
        <p class="price">${item.harga}</p>
        <a href="${item.link}" target="_blank">Lihat Produk</a>
      </div>`;
  });
}

form.addEventListener('submit', e => {
  e.preventDefault(); const link=document.getElementById('link').value;
  const nama=document.getElementById('nama').value;
  const harga=document.getElementById('harga').value;
  const kategori=document.getElementById('kategori').value;
  const file=document.getElementById('gambarFile').files[0];
  let gambar='';
  if (file) {
    const reader=new FileReader();
    reader.onload=()=>{
      gambar=reader.result; simpan(link,nama,harga,kategori,gambar);
    }
    reader.readAsDataURL(file);
  } else simpan(link,nama,harga,kategori,gambar);
  form.reset();
});

function simpan(link,nama,harga,kategori,gambar){
  produk.push({ link,nama,harga,kategori,gambar });
  localStorage.setItem('produk', JSON.stringify(produk));
  updateKategoriOptions(); renderProduk();
}

searchInput.addEventListener('input', renderProduk);
filterKategori.addEventListener('change', renderProduk);
exportBtn.addEventListener('click', ()=>{
  const wb = XLSX.utils.book_new();
  const wsData = [['Nama','Harga','Kategori','Link']];
  produk.forEach(p => wsData.push([p.nama, p.harga, p.kategori, p.link]));
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Produk');
  XLSX.writeFile(wb, 'produk_afiliasi.xlsx');
});

updateKategoriOptions();
renderProduk();
