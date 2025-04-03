// js/scripts.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

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

document.getElementById("pengeluaranForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const tanggal = document.getElementById("tanggal").value;
    const kategori = document.getElementById("kategori").value;
    const jumlah = document.getElementById("jumlah").value.replace(/\./g, ""); // Hapus format ribuan
    const deskripsi = document.getElementById("deskripsi").value;

    try {
        await addDoc(collection(db, "pengeluaran"), { tanggal, kategori, jumlah, deskripsi });
        Swal.fire("Sukses", "Data berhasil disimpan", "success");
        document.getElementById("pengeluaranForm").reset();
    } catch (error) {
        Swal.fire("Error", "Gagal menyimpan data", "error");
    }
});

// Ambil elemen filter & tabel
const tahunSelect = document.getElementById("tahun");
const bulanSelect = document.getElementById("bulan");
const dataTabel = document.getElementById("dataTabel");
const totalPengeluaran = document.getElementById("totalPengeluaran");
const downloadCSV = document.getElementById("downloadCSV");

// Fungsi untuk mendapatkan tahun & bulan unik dari database
function isiFilterTahunBulan() {
    const pengeluaranRef = ref(db, "pengeluaran");
    onValue(pengeluaranRef, (snapshot) => {
        const data = snapshot.val();
        let tahunSet = new Set();
        let bulanSet = new Set();

        if (data) {
            Object.values(data).forEach(entry => {
                let [tahun, bulan] = entry.tanggal.split("-"); 
                tahunSet.add(tahun);
                bulanSet.add(bulan);
            });

            // Isi Select Tahun
            tahunSelect.innerHTML = '<option disable selected>Pilih Tahun</option>';
            tahunSet.forEach(tahun => {
                tahunSelect.innerHTML += `<option value="${tahun}">${tahun}</option>`;
            });

            // Isi Select Bulan
            bulanSelect.innerHTML = '<option disable selected>Pilih Bulan</option>';
            const bulanNama = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
            bulanSet.forEach(bulan => {
                bulanSelect.innerHTML += `<option value="${bulan}">${bulanNama[parseInt(bulan) - 1]}</option>`;
            });
        }
    });
}

// Fungsi untuk menampilkan data sesuai tahun & bulan
function tampilkanData() {
    const tahun = tahunSelect.value;
    const bulan = bulanSelect.value;
    if (!tahun || !bulan) return;

    const pengeluaranRef = ref(db, "pengeluaran");
    onValue(pengeluaranRef, (snapshot) => {
        dataTabel.innerHTML = "";
        let total = 0;
        const data = snapshot.val();

        if (data) {
            Object.values(data).forEach(entry => {
                let [entryTahun, entryBulan] = entry.tanggal.split("-");
                if (entryTahun === tahun && entryBulan === bulan) {
                    total += parseInt(entry.jumlah.replace(/\D/g, ""));
                    dataTabel.innerHTML += `
                        <tr>
                            <td>${entry.tanggal}</td>
                            <td>${entry.deskripsi}</td>
                            <td>Rp ${new Intl.NumberFormat("id-ID").format(entry.jumlah)}</td>
                            <td>${entry.kategori}</td>
                        </tr>
                    `;
                }
            });

            totalPengeluaran.textContent = `Rp ${new Intl.NumberFormat("id-ID").format(total)}`;
        }
    });
}

// Fungsi Download CSV
function downloadCSVFile() {
    let csv = "Tanggal,Deskripsi,Jumlah,Kategori\n";
    const rows = dataTabel.querySelectorAll("tr");

    rows.forEach(row => {
        let cols = row.querySelectorAll("td");
        let rowData = [];
        cols.forEach(col => rowData.push(col.innerText));
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

// Event Listener
tahunSelect.addEventListener("change", tampilkanData);
bulanSelect.addEventListener("change", tampilkanData);
downloadCSV.addEventListener("click", downloadCSVFile);

// Inisialisasi
isiFilterTahunBulan();

let slideIndex = 1;
let slideTimeout;
showSlides(slideIndex);

// Fungsi untuk mengganti slide dengan tombol
function plusSlides(n) {
    clearTimeout(slideTimeout); // Hentikan sementara slide otomatis ketika tombol diklik
    showSlides(slideIndex += n);
}

// Fungsi untuk menampilkan slide sesuai urutan
function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    
    slides[slideIndex-1].style.display = "block";  
    
    slideTimeout = setTimeout(() => showSlides(slideIndex += 1), 5500); // Ganti slide setiap 2 detik
}

const backToTopBtn = document.getElementById('backToTopBtn');

// Show or hide the button based on scroll position
window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Scroll to the top when the button is clicked
backToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function openModal(element) {
    const folder = element.closest('.card').getAttribute('data-folder');
    const totalImages = element.closest('.card').getAttribute('data-total-images');

    const modalCarousel = document.querySelector('#modalCarousel .carousel-inner');
    const modalFooter = document.querySelector('.modal-footer');

    // Clear previous content
    modalCarousel.innerHTML = '';
    modalFooter.innerHTML = '';

    for (let i = 1; i <= totalImages; i++) {
        const imgSrc = `assets/${folder}/${i}.png`;

        // Buat slide untuk modal carousel
        const modalSlide = document.createElement('div');
        modalSlide.className = `carousel-item${i === 1 ? ' active' : ''}`;
        modalSlide.innerHTML = `<img src="${imgSrc}" class="d-block w-100" alt="Project Image ${i}">`;
        modalCarousel.appendChild(modalSlide);

        // Buat thumbnail untuk modal footer
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.className = 'img-thumbnail mx-1';
        thumbnail.style.width = '50px';
        thumbnail.style.cursor = 'pointer';
        thumbnail.onclick = () => {
            document.querySelector(`#modalCarousel .carousel-item.active`).classList.remove('active');
            modalSlide.classList.add('active');
        };
        modalFooter.appendChild(thumbnail);
    }
    
    // Tampilkan modal
    const modal = new bootstrap.Modal(document.getElementById('projectModal'));
    modal.show();
}
