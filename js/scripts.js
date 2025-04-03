// js/scripts.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Tambahkan konfigurasi Firebase di sini
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

// ** Ambil elemen DOM dengan pengecekan null **
const form = document.getElementById("pengeluaranForm");
const tahunSelect = document.getElementById("tahun");
const bulanSelect = document.getElementById("bulan");
const dataTabel = document.getElementById("dataTabel");
const totalPengeluaran = document.getElementById("totalPengeluaran");
const downloadCSV = document.getElementById("downloadCSV");

// ** 1. Menyimpan Data ke Firestore **
if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const tanggal = document.getElementById("tanggal").value;
        const kategori = document.getElementById("kategori").value;
        const jumlah = document.getElementById("jumlah").value.replace(/\./g, ""); // Hapus format ribuan
        const deskripsi = document.getElementById("deskripsi").value;

        try {
            await addDoc(collection(db, "pengeluaran"), { tanggal, kategori, jumlah, deskripsi });
            Swal.fire("Sukses", "Data berhasil disimpan", "success");
            form.reset();
        } catch (error) {
            Swal.fire("Error", "Gagal menyimpan data", "error");
        }
    });
}

// ** 2. Mengisi Filter Tahun & Bulan dari Firestore **
async function isiFilterTahunBulan() {
    if (!tahunSelect || !bulanSelect) return; // Cek apakah elemen ada

    const pengeluaranRef = collection(db, "pengeluaran");
    const snapshot = await getDocs(pengeluaranRef);
    console.log(pengeluaranRef);
    
    let tahunSet = new Set();
    let bulanSet = new Set();

    snapshot.forEach((doc) => {
        let [tahun, bulan] = doc.data().tanggal.split("-");
        tahunSet.add(tahun);
        bulanSet.add(bulan);
    });

    console.log("Tahun tersedia:", tahunSet);
    console.log("Bulan tersedia:", bulanSet);

    // Isi dropdown Tahun
    tahunSelect.innerHTML = '<option disabled selected>Pilih Tahun</option>';
    tahunSet.forEach((tahun) => {
        tahunSelect.innerHTML += `<option value="${tahun}">${tahun}</option>`;
    });

    // Isi dropdown Bulan
    bulanSelect.innerHTML = '<option disabled selected>Pilih Bulan</option>';
    const bulanNama = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    bulanSet.forEach((bulan) => {
        bulanSelect.innerHTML += `<option value="${bulan}">${bulanNama[parseInt(bulan) - 1]}</option>`;
    });

    console.log("Dropdown Tahun & Bulan telah terisi.");
}

// ** 3. Menampilkan Data yang Difilter **
async function tampilkanData() {
    if (!tahunSelect || !bulanSelect || !dataTabel) return; // Cek apakah elemen ada

    const tahun = tahunSelect.value;
    const bulan = bulanSelect.value;
    if (!tahun || !bulan) return;

    const pengeluaranRef = collection(db, "pengeluaran");
    const snapshot = await getDocs(pengeluaranRef);
    dataTabel.innerHTML = "";
    let total = 0;

    snapshot.forEach((doc) => {
        let data = doc.data();
        let [entryTahun, entryBulan] = data.tanggal.split("-");
        if (entryTahun === tahun && entryBulan === bulan) {
            total += parseInt(data.jumlah.replace(/\D/g, ""));
            dataTabel.innerHTML += `
                <tr>
                    <td>${data.tanggal}</td>
                    <td>${data.deskripsi}</td>
                    <td>Rp ${new Intl.NumberFormat("id-ID").format(data.jumlah)}</td>
                    <td>${data.kategori}</td>
                </tr>
            `;
        }
    });

    totalPengeluaran.textContent = `Rp ${new Intl.NumberFormat("id-ID").format(total)}`;
}

// ** 4. Fungsi Download CSV **
function downloadCSVFile() {
    if (!dataTabel || !totalPengeluaran) return; // Cek apakah elemen ada

    let csv = "Tanggal,Deskripsi,Jumlah,Kategori\n";
    const rows = dataTabel.querySelectorAll("tr");

    rows.forEach((row) => {
        let cols = row.querySelectorAll("td");
        let rowData = [];
        cols.forEach((col) => rowData.push(col.innerText));
        csv += rowData.join(",") + "\n";
    });

    // Tambahkan total di akhir file CSV
    csv += `Total,,${totalPengeluaran.textContent},\n`;

    // Buat link download
    let hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `Pengeluaran_${tahunSelect.value}_${bulanSelect.value}.csv`;
    hiddenElement.click();
}

// ** 5. Event Listener dengan Pengecekan Elemen **
if (tahunSelect && bulanSelect) {
    tahunSelect.addEventListener("change", tampilkanData);
    bulanSelect.addEventListener("change", tampilkanData);
}
if (downloadCSV) {
    downloadCSV.addEventListener("click", downloadCSVFile);
}

// ** Panggil fungsi hanya jika elemen ada **
if (tahunSelect && bulanSelect) {
    isiFilterTahunBulan(); 
}
