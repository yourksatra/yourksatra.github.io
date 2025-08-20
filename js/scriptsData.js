// skills & tools
fetch('js/data.json')
    .then(response => response.json())
    .then(data => {
        renderTools(data.tools);
    })
    .catch(error => console.error('Gagal memuat data.json:', error))
    ;

function renderTools(tools) {
    const skillsContainer = document.getElementById('skillsContainer');

    tools.forEach(tool => {
        const card = document.createElement('div');
        card.classList.add('skill-card');

        card.innerHTML = `
            <img src="assets/Tools/${tool.img}" alt="${tool.name}">
            <div class="skill-info">
                <p class="skill-name text-gradient">${tool.name} <span class="skill-level">(${tool.level})</span></p>
                <p class="skill-type">${tool.type}</p>
            </div>
        `;

        skillsContainer.appendChild(card);
    });
}

// Experience
fetch('js/data.json')
    .then(response => response.json())
    .then(data => {
        renderExperience(data.experience);
    })
    .catch(error => console.error('Gagal memuat data.json:', error))
    ;

function renderExperience(experiences) {
    const container = document.getElementById('exprContainer');

    // Urutkan berdasarkan tanggal terbaru
    experiences.sort((a, b) => {
        const dateA = a.type === 'period' ? a.endDate : a.date;
        const dateB = b.type === 'period' ? b.endDate : b.date;
        return new Date(dateB) - new Date(dateA);
    });

    experiences.forEach(exp => {
        // Tentukan informasi waktu
        let waktuText = '';
        if (exp.type === 'onetime') {
            waktuText = formatDate(exp.date);
        } else if (exp.type === 'period') {
            waktuText = `${formatPeriod(exp.startDate)} - ${formatPeriod(exp.endDate)}`;
        }

        const card = document.createElement('div');
        card.className = 'expr-card';
        card.innerHTML = `
            <div class="expr-card-content">
                <div class="expr-img">
                    <img src="assets/SERTIP/${exp.certificateImg[0]}" alt="Experience Image" class="img-fluid img-hover"
                            onclick="openExprModal(this)">
                </div>
                <div class="expr-details">
                    <h5 class="expr-title text-gradient">${exp.title}</h5>
                    <div class="expr-description">${exp.description}</div>
                    <div class="expr-meta">
                        <div class="meta-item">
                            <span class="meta-label text-gradient">Waktu:</span>
                            <span class="meta-value">${waktuText}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label text-gradient">Penyelenggara:</span>
                            <span class="meta-value">${exp.organizer}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label text-gradient">Tempat:</span>
                            <span class="meta-value">${exp.location}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Fungsi bantu format tanggal onetime
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long' };
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', options);
}

// Fungsi bantu format period (YYYY-MM => Bulan Tahun)
function formatPeriod(periodString) {
    const [year, month] = periodString.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('id-ID', { year: 'numeric', month: 'long' });
}

// Project
fetch('js/data.json')
    .then(response => response.json())
    .then(data => {
        renderProjects(data.project);
    })
    .catch(error => console.error('Gagal memuat data.json:', error));

function renderProjects(projects) {
    const container = document.getElementById('projectContainer');

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.folder = project['img-folder'];
        card.dataset.totalImages = project['total-img'];

        const techTags = project.techInformation.map(tech => `<span>${tech}</span>`).join('');

        card.innerHTML = `
            <div class="project-content">
                <h2 class="text-gradient">${project.title}</h2>
                <p>${project.description}</p>
                <div class="project-tech">${techTags}</div>
            </div>
            <div class="project-img-wrapper">
                <img class="project-img" 
                    src="assets/${project['img-folder']}/${project['img-thumbnail']}" 
                    alt="Project Image" 
                    onclick="openModal(this)" />
            </div>
            <div class="project-buttons">
                <button class="btn btn-primary" onclick="openModal(this)">Lihat Gambar</button>
            </div>
        `;

        container.appendChild(card);
    });

}

