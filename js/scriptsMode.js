document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('darkModeToggle');
    const toggleIcon = document.getElementById('toggleIcon');
    const toggleText = document.getElementById('toggleText');
    const navbarCls = document.getElementById('navigationBar');
    const body = document.body;
    const mutedElements = document.querySelectorAll('.text-muted');
    const modalCloseButtons = document.querySelectorAll('.modal-header .btn-close');

    // Ambil preferensi dari localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme);
        updateToggleUI(savedTheme);
        if (body.classList.contains('dark-mode')) {
            navbarCls.classList.add('navbar-dark');
        } else {
            navbarCls.classList.add('navbar-light');
        }
    } else {
        // Default light mode
        body.classList.add('light-mode');
        updateToggleUI('light-mode');
    }

    // Event klik tombol
    toggleButton.addEventListener('click', function () {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            navbarCls.classList.remove('navbar-light');
            navbarCls.classList.add('navbar-dark');
            localStorage.setItem('theme', 'dark-mode');
            updateToggleUI('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            navbarCls.classList.remove('navbar-dark');
            navbarCls.classList.add('navbar-light');
            localStorage.setItem('theme', 'light-mode');
            updateToggleUI('light-mode');
        }
    });

    // Fungsi untuk update tampilan tombol
    function updateToggleUI(mode) {
        if (mode === 'dark-mode') {
            toggleIcon.src = 'assets/sun.svg';
            toggleIcon.alt = 'Light Mode';
            toggleText.textContent = 'Light Mode';
            mutedElements.forEach(el => el.classList.remove('text-muted'));
            modalCloseButtons.forEach(btn => {
                btn.classList.add('btn-close-white');
            });
        } else {
            toggleIcon.src = 'assets/moon.svg';
            toggleIcon.alt = 'Dark Mode';
            toggleText.textContent = 'Dark Mode';
            mutedElements.forEach(el => el.classList.add('text-muted'));
            modalCloseButtons.forEach(btn => {
                btn.classList.remove('btn-close-white');
            });
        }
    }
});