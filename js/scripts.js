// Ambil elemen DOM
const form = document.getElementById("pengeluaranForm");
const yearSelect = document.getElementById("tahun");
const monthSelect = document.getElementById("bulan");
const tableBody = document.getElementById("tabel-body");
const statistikBody = document.getElementById("statistik-body");
const totalPengeluaranEl = document.getElementById("total-pengeluaran");
const rataRataEl = document.getElementById("rata-rata");
const downloadCSV = document.getElementById("downloadCSV");

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// konfigurasi Firebase 
const firebaseConfig = {
    apiKey: "AIzaSyAIN63oj7OWScZ5kV0G7MxQL1bq3rgGcF0",
    authDomain: "webmoneynote.firebaseapp.com",
    projectId: "webmoneynote",
    storageBucket: "webmoneynote.firebasestorage.app",
    messagingSenderId: "916249252817",
    appId: "1:916249252817:web:7359ed42699da26e60c6f0",
    measurementId: "G-732CV0099G"
  };

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ** 1. Menyimpan Data ke Firestore **
if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const tanggal = document.getElementById("tanggal").value;
        const kategori = document.getElementById("kategori").value;
        const kategoriManual = document.getElementById("kategoriManual").value;
        const jumlah = document.getElementById("jumlah").value.replace(/\./g, ""); // Hapus format ribuan
        const deskripsi = document.getElementById("deskripsi").value;

        try {
            if(kategori == 'custom'){
                await addDoc(collection(db, "pengeluaran"), { tanggal, kategoriManual, jumlah, deskripsi });
            }else{
                await addDoc(collection(db, "pengeluaran"), { tanggal, kategori, jumlah, deskripsi });
            }
            Swal.fire("Sukses", "Data berhasil disimpan", "success");
            form.reset();
        } catch (error) {
            Swal.fire("Error", "Gagal menyimpan data", "error");
        }
    });
}

// ** 2. Mengisi Filter Tahun & Bulan dari Firestore **
async function isiFilterTahunBulan() {
    if (!yearSelect || !monthSelect) return;

    const pengeluaranRef = collection(db, "pengeluaran");
    const snapshot = await getDocs(pengeluaranRef);
    
    let tahunSet = new Set();
    let bulanSet = new Set();

    snapshot.forEach((doc) => {
        let [tahun, bulan] = doc.data().tanggal.split("-");
        tahunSet.add(tahun);
        bulanSet.add(bulan);
    });

    // Isi dropdown Tahun
    yearSelect.innerHTML = '<option disabled selected>Pilih Tahun</option>';
    tahunSet.forEach((tahun) => {
        yearSelect.innerHTML += `<option value="${tahun}">${tahun}</option>`;
    });

    // Isi dropdown Bulan
    monthSelect.innerHTML = '<option disabled selected>Pilih Bulan</option>';
    const bulanNama = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    bulanSet.forEach((bulan) => {
        monthSelect.innerHTML += `<option value="${bulan}">${bulanNama[parseInt(bulan) - 1]}</option>`;
    });
}

// ** 3. Menampilkan Data yang Difilter **
// Tampilkan Data
async function tampilkanData() {
    const tahun = yearSelect.value;
    const bulan = monthSelect.value;
    if (!tahun || !bulan) return;

    const snapshot = await getDocs(collection(db, "pengeluaran"));
    const allData = [];
    const statistik = {};

    let totalPengeluaran = 0;
    let tanggalTerakhir = 0;

    snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.tanggal) return;
        const [y, m, d] = data.tanggal.split("-");

        if (y === tahun && m === bulan) {
            const tanggalKey = `${y}-${m}-${d}`;
            allData.push({ ...data, tanggal: tanggalKey });

            // Statistik per tanggal
            if (!statistik[tanggalKey]) statistik[tanggalKey] = 0;
            statistik[tanggalKey] += parseInt(data.jumlah.replace(/\D/g, ""));

            totalPengeluaran += parseInt(data.jumlah.replace(/\D/g, ""));
            if (parseInt(d) > tanggalTerakhir) tanggalTerakhir = parseInt(d);
        }
    });

    // Urutkan data berdasarkan tanggal
    allData.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    // Tampilkan tabel utama
    tableBody.innerHTML = "";
    allData.forEach((data) => {
        tableBody.innerHTML += `
            <tr>
                <td>${data.tanggal}</td>
                <td>${data.kategori}</td>
                <td>${data.deskripsi}</td>
                <td>Rp ${new Intl.NumberFormat("id-ID").format(data.jumlah)}</td>
            </tr>`;
    });

    // Inisialisasi DataTable
    $('#pengeluaranTable').DataTable({
        order: [[0, "asc"]],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            info: "Menampilkan _START_ - _END_ dari _TOTAL_ data",
            paginate: { previous: "Sebelumnya", next: "Berikutnya" },
            zeroRecords: "Tidak ada data ditemukan"
        }
    });

    // Statistik Tabel
    statistikBody.innerHTML = "";
    for (let i = 1; i <= tanggalTerakhir; i++) {
        let day = i.toString().padStart(2, "0");
        let tanggal = `${tahun}-${bulan}-${day}`;
        let jumlah = statistik[tanggal] || 0;
    
        statistikBody.innerHTML += `
            <tr>
                <td>${tanggal}</td>
                <td>${formatRupiah(jumlah)}</td>
            </tr>`;
    }
    
    // Update total dan rata-rata
    totalPengeluaranEl.textContent = formatRupiah(totalPengeluaran);
    let rata2 = totalPengeluaran / tanggalTerakhir;
    rataRataEl.textContent = formatRupiah(Math.round(rata2));
}

function formatRupiah(angka) {
    return "Rp " + new Intl.NumberFormat("id-ID").format(angka);
}

// Event
document.addEventListener("DOMContentLoaded", () => {
    isiFilterTahunBulan();
    if (yearSelect && monthSelect) {
        yearSelect.addEventListener("change", tampilkanData);
        monthSelect.addEventListener("change", tampilkanData);
    }

    if (downloadCSV) {
        downloadCSV.addEventListener("click", () => {
            let csv = "Tanggal,Kategori,Deskripsi,Jumlah\n";
            const rows = document.querySelectorAll("#tabel-body tr");
            rows.forEach(row => {
                const cols = row.querySelectorAll("td");
                const data = Array.from(cols).map(col => col.textContent);
                csv += data.join(",") + "\n";
            });
            csv += `Total,,,,${totalPengeluaranEl.textContent}\n`;

            let hiddenElement = document.createElement("a");
            hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
            hiddenElement.download = `pengeluaran_${yearSelect.value}_${monthSelect.value}.csv`;
            hiddenElement.click();
        });
    }
});
