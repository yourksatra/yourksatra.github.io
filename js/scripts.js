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


// Show or hide the button based on scroll position
window.onscroll = function() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    const navbarStyle = document.getElementById('navigationBar');
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbarStyle.classList.add('navbar-scrolled');
        backToTopBtn.style.display = "block";
    } else {
        navbarStyle.classList.remove('navbar-scrolled')
        backToTopBtn.style.display = "none";
    }
};

// Scroll to the top when the button is clicked
backToTopBtn.onclick = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function openModal(element) {
    const folder = element.closest('.project-card').getAttribute('data-folder');
    const totalImages = element.closest('.project-card').getAttribute('data-total-images');

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

function openExprModal(element) {
    const images = JSON.parse(element.getAttribute('data-images'));
    const imgSrc = images[1] ? `assets/SERTIP/${images[1]}` : `assets/SERTIP/${images[0]}`;
    const modalContent = document.getElementById('exprModalBody');
    // Masukkan gambar baru
    modalContent.innerHTML = `<img src="${imgSrc}" alt="Experience Image" class="img-fluid">`;
    // Panggil modal untuk muncul
    const exprModal = new bootstrap.Modal(document.getElementById('exprModal'));
    exprModal.show();
}

// animation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.getElementById('navbarSupportedContent');
        if (navbarCollapse.classList.contains('show')) {
            new bootstrap.Collapse(navbarCollapse).hide();
        }
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
});

document.querySelectorAll('.animate-slide-up').forEach(element => {
    observer.observe(element);
});

// skills collaps button
document.addEventListener('DOMContentLoaded', () => {
    const skillSection = document.querySelector('.skill-section');
    const toggleBtn = document.getElementById('toggleSkillsBtn');

    // Set default state collapsed
    skillSection.classList.add('collapsed');
    toggleBtn.textContent = 'Lihat Selengkapnya';

    toggleBtn.addEventListener('click', () => {
        skillSection.classList.toggle('collapsed');
        
        if (skillSection.classList.contains('collapsed')) {
            toggleBtn.textContent = 'Lihat Selengkapnya';
        } else {
            toggleBtn.textContent = 'Tutup';
        }
    });
});
// Experience collaps button
document.addEventListener('DOMContentLoaded', () => {
    const exprSection = document.querySelector('.expr-section');
    const toggleExprBtn = document.getElementById('toggleExprBtn');

    // Set default state collapsed
    exprSection.classList.add('collapsed');
    toggleExprBtn.textContent = 'Lihat Selengkapnya';

    toggleExprBtn.addEventListener('click', () => {
        exprSection.classList.toggle('collapsed');
        
        if (exprSection.classList.contains('collapsed')) {
            toggleExprBtn.textContent = 'Lihat Selengkapnya';
        } else {
            toggleExprBtn.textContent = 'Tutup';
        }
    });
});

// project collaps button
document.addEventListener('DOMContentLoaded', () => {
    const projectSection = document.querySelector('.project-section');
    const toggleProjectBtn = document.getElementById('toggleProjectBtn');

    // Set default state collapsed
    projectSection.classList.add('collapsed');
    toggleProjectBtn.textContent = 'Lihat Selengkapnya';

    toggleProjectBtn.addEventListener('click', () => {
        projectSection.classList.toggle('collapsed');
        
        if (projectSection.classList.contains('collapsed')) {
            toggleProjectBtn.textContent = 'Lihat Selengkapnya';
        } else {
            toggleProjectBtn.textContent = 'Tutup';
        }
    });

});
