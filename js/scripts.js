// Ambil elemen DOM
const form = document.getElementById("pengeluaranForm");
const yearSelection = document.getElementById("tahun");
const monthOption = document.getElementById("bulan");
const dataTabel = document.getElementById("tabel-body");
const totalPengeluaran = document.getElementById("total-pengeluaran");
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
    if (!yearSelection || !monthOption) return;

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
    yearSelection.innerHTML = '<option disabled selected>Pilih Tahun</option>';
    tahunSet.forEach((tahun) => {
        yearSelection.innerHTML += `<option value="${tahun}">${tahun}</option>`;
    });

    // Isi dropdown Bulan
    monthOption.innerHTML = '<option disabled selected>Pilih Bulan</option>';
    const bulanNama = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    bulanSet.forEach((bulan) => {
        monthOption.innerHTML += `<option value="${bulan}">${bulanNama[parseInt(bulan) - 1]}</option>`;
    });
}

// ** 3. Menampilkan Data yang Difilter **
async function tampilkanData() {
    if (!yearSelection || !monthOption || !dataTabel) return;

    const tahun = yearSelection.value;
    const bulan = monthOption.value;
    if (!tahun || !bulan) return;

    console.log("Filter dipilih:", tahun, bulan); 

    const pengeluaranRef = collection(db, "pengeluaran");
    const snapshot = await getDocs(pengeluaranRef);
    
    console.log("Data Firestore:", snapshot.docs.map(doc => doc.data()));

    dataTabel.innerHTML = "";
    let total = 0;
    let dataDitemukan = false;

    snapshot.forEach((doc) => {
        let data = doc.data();
        if (!data.tanggal) return;
        
        let [entryTahun, entryBulan] = data.tanggal.split("-");
        console.log(`Cek: ${data.tanggal} -> Tahun: ${entryTahun}, Bulan: ${entryBulan}`);

        if (entryTahun === tahun && entryBulan === bulan) {
            dataDitemukan = true;
            total += parseInt(data.jumlah.replace(/\D/g, ""));
            dataTabel.innerHTML += `
                <tr>
                    <td>${data.tanggal}</td>
                    <td>${data.kategori}</td>
                    <td>${data.deskripsi}</td>
                    <td>Rp ${new Intl.NumberFormat("id-ID").format(data.jumlah)}</td>
                </tr>
            `;
        }
    });

    if (!dataDitemukan) {
        dataTabel.innerHTML = `<tr><td colspan="4" class="text-center text-danger">Tidak ada data</td></tr>`;
    }

    totalPengeluaran.textContent = `Rp ${new Intl.NumberFormat("id-ID").format(total)}`;
}

// ** 4. Fungsi Download CSV **
function downloadCSVFile() {
    if (!dataTabel || !totalPengeluaran) return;

    let csv = "Tanggal,Kategori,Deskripsi,Jumlah\n";
    const rows = dataTabel.querySelectorAll("tr");

    rows.forEach((row) => {
        let cols = row.querySelectorAll("td");
        let rowData = [];
        cols.forEach((col) => rowData.push(col.innerText));
        csv += rowData.join(",") + "\n";
    });

    csv += `Total,,${totalPengeluaran.textContent},\n`;

    let hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
    hiddenElement.target = "_blank";
    hiddenElement.download = `Pengeluaran_${yearSelection.value}_${monthOption.value}.csv`;
    hiddenElement.click();
}

// ** 5. Event Listener dengan Pengecekan Elemen **
document.addEventListener("DOMContentLoaded", function() {
    isiFilterTahunBulan();
    if (yearSelection && monthOption) {
        yearSelection.addEventListener("change", tampilkanData);
        monthOption.addEventListener("change", tampilkanData);
    }
    if (downloadCSV) {
        downloadCSV.addEventListener("click", downloadCSVFile);
    }
});
