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
