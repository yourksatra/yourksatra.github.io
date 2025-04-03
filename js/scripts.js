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
