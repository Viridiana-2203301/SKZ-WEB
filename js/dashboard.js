// dashboard.js - Gráficos interactivos con base Roja e integraciones de color secundarias

// Esperar a que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    initStatsOverview();
    initCharts();
    loadTimeline();
    loadMembersStats();
    loadRecentActivity();
});

// Inicializar clases especiales para las tarjetas de resumen
function initStatsOverview() {
    const cards = document.querySelectorAll('.stat-overview-card');
    const classes = ['songs', 'reach', 'videos', 'members'];
    cards.forEach((card, index) => {
        if (classes[index]) {
            card.classList.add(classes[index]);
        }
    });
}

// Inicializar todos los gráficos con base Roja y transiciones a color
function initCharts() {
    createReleasesChart();
    createGenresChart();
    createAlbumsPopularityChart();
    createMonthlyChart();
}

// Gráfico de lanzamientos por año (Barras degradadas de Rojo a Color de Álbum)
function createReleasesChart() {
    const canvas = document.getElementById('releasesChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Degradados: Base Roja (#ff0000) transicionando elegantemente al color de cada álbum
    const grad2021 = ctx.createLinearGradient(0, 300, 0, 0);
    grad2021.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Rojo base
    grad2021.addColorStop(1, '#e5a93b'); // NOEASY Gold

    const grad2022 = ctx.createLinearGradient(0, 300, 0, 0);
    grad2022.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Rojo base
    grad2022.addColorStop(1, '#ff4081'); // ODDINARY & MAXIDENT Pink

    const grad2023 = ctx.createLinearGradient(0, 300, 0, 0);
    grad2023.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Rojo base
    grad2023.addColorStop(1, '#00e5ff'); // ROCK-STAR Cyan

    const grad2024 = ctx.createLinearGradient(0, 300, 0, 0);
    grad2024.addColorStop(0, 'rgba(255, 0, 0, 0.8)'); // Rojo base
    grad2024.addColorStop(1, '#ccff00'); // ATE Lime

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2021 (NOEASY)', '2022 (ODDINARY/MAXIDENT)', '2023 (5-STAR/ROCK-STAR)', '2024 (ATE)'],
            datasets: [{
                label: 'Lanzamientos Principales',
                data: [2, 6, 4, 3],
                backgroundColor: [grad2021, grad2022, grad2023, grad2024],
                borderColor: '#ff0000',
                borderWidth: 1.5,
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 8, 8, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#e0e0e0',
                    borderColor: '#ff0000',
                    borderWidth: 1,
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'Segoe UI' } },
                    grid: { color: 'rgba(255, 0, 0, 0.05)' }
                },
                x: {
                    ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'Segoe UI' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// Gráfico de géneros musicales (Dona multicolor estilizada en gama cálida/roja)
function createGenresChart() {
    const canvas = document.getElementById('genresChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Degradados espectaculares centrados en el espectro del Rojo/Cálido de la marca
    const grad1 = ctx.createLinearGradient(0, 0, 0, 200);
    grad1.addColorStop(0, '#ff0000'); grad1.addColorStop(1, '#990000'); // Deep Red

    const grad2 = ctx.createLinearGradient(0, 0, 0, 200);
    grad2.addColorStop(0, '#ff4081'); grad2.addColorStop(1, '#ad1457'); // Pink-Red

    const grad3 = ctx.createLinearGradient(0, 0, 0, 200);
    grad3.addColorStop(0, '#ff6d00'); grad3.addColorStop(1, '#d84315'); // Orange-Red

    const grad4 = ctx.createLinearGradient(0, 0, 0, 200);
    grad4.addColorStop(0, '#e5a93b'); grad4.addColorStop(1, '#9e6a0d'); // Gold

    const grad5 = ctx.createLinearGradient(0, 0, 0, 200);
    grad5.addColorStop(0, '#b12fcb'); grad5.addColorStop(1, '#4a148c'); // Purple-Red

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Hip-Hop / Rap', 'Pop / Dance', 'R&B', 'EDM / Dubstep', 'Rock / Alternativo'],
            datasets: [{
                data: [35, 25, 15, 15, 10],
                backgroundColor: [grad1, grad2, grad3, grad4, grad5],
                borderColor: '#121214',
                borderWidth: 3,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        font: { size: 11, family: 'Segoe UI' },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 8, 8, 0.95)',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ff0000'
                }
            }
        }
    });
}

// Gráfico de popularidad de álbumes (Radar con malla Roja y nodos de color de álbum)
function createAlbumsPopularityChart() {
    const canvas = document.getElementById('albumsPopularityChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fondo degradado rojo translúcido
    const radarFillGrad = ctx.createLinearGradient(0, 0, 0, 300);
    radarFillGrad.addColorStop(0, 'rgba(255, 0, 0, 0.25)');
    radarFillGrad.addColorStop(1, 'rgba(255, 0, 0, 0.03)');

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['NOEASY', 'ODDINARY', '5-STAR', 'ROCK-STAR', 'ATE', 'MAXIDENT'],
            datasets: [{
                label: 'Popularidad de Álbumes (Métrica de Impacto)',
                data: [88, 93, 96, 91, 95, 94],
                borderColor: '#ff0000', // Malla principal Roja
                backgroundColor: radarFillGrad,
                borderWidth: 2,
                pointBackgroundColor: ['#e5a93b', '#00e676', '#3f51b5', '#00e5ff', '#ccff00', '#ff4081'], // Nodos de color del álbum
                pointBorderColor: '#121214',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 8, 8, 0.95)',
                    padding: 12,
                    borderColor: '#ff0000',
                    borderWidth: 1
                }
            },
            scales: {
                r: {
                    angleLines: { color: 'rgba(255, 0, 0, 0.12)' },
                    grid: { color: 'rgba(255, 0, 0, 0.12)' },
                    pointLabels: {
                        color: 'rgba(255, 255, 255, 0.85)',
                        font: { size: 11, weight: 'bold', family: 'Segoe UI' }
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: 'rgba(255, 255, 255, 0.3)',
                        font: { size: 9 },
                        stepSize: 20
                    },
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// Gráfico de estadísticas mensuales (Línea de degradado Roja a Coral/Naranja)
function createMonthlyChart() {
    const canvas = document.getElementById('monthlyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Degradado Rojo a Coral brillante para la línea principal
    const lineGrad = ctx.createLinearGradient(0, 0, 400, 0);
    lineGrad.addColorStop(0, '#ff0000');     // Rojo puro
    lineGrad.addColorStop(0.5, '#ff4d4d');   // Rojo brillante
    lineGrad.addColorStop(1, '#ff8000');     // Naranja coral

    // Relleno degradado rojo translúcido debajo de la línea
    const fillGrad = ctx.createLinearGradient(0, 0, 0, 250);
    fillGrad.addColorStop(0, 'rgba(255, 0, 0, 0.18)');
    fillGrad.addColorStop(1, 'rgba(255, 0, 0, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Reproducciones Mensuales (Millones)',
                data: [50, 58, 64, 72, 69, 81, 88, 85, 94, 102, 115, 128],
                borderColor: lineGrad,
                backgroundColor: fillGrad,
                borderWidth: 3,
                fill: true,
                tension: 0.45,
                pointRadius: 4,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#ff0000',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#ff0000',
                pointHoverBorderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(18, 8, 8, 0.95)',
                    padding: 12,
                    borderWidth: 1,
                    borderColor: '#ff0000'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'Segoe UI' } },
                    grid: { color: 'rgba(255, 0, 0, 0.05)' }
                },
                x: {
                    ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { family: 'Segoe UI' } },
                    grid: { display: false }
                }
            }
        }
    });
}

// Cargar línea de tiempo con colores temáticos de álbumes en formato de tarjeta unificado (borde rojo)
function loadTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const timelineData = [
        {
            title: 'Debut Oficial',
            description: 'Stray Kids debuta oficialmente en la escena mundial del K-Pop.',
            date: '2018-03-25',
            theme: 'default'
        },
        {
            title: 'Era NOEASY',
            description: 'Lanzamiento del icónico álbum que consolidó su sonido "thunderous" autoproducido.',
            date: '2021-08-23',
            theme: 'noeasy'
        },
        {
            title: 'Era ODDINARY',
            description: 'El disco que los llevó a la cima mundial con conceptos visuales disruptivos y el hit MANIAC.',
            date: '2022-03-18',
            theme: 'oddinary'
        },
        {
            title: 'Era MAXIDENT',
            description: 'Explosión de colores y romanticismo rebelde liderado por el MV de CASE 143.',
            date: '2022-10-07',
            theme: 'maxident'
        },
        {
            title: 'Era ROCK-STAR',
            description: 'Regreso triunfal con toques de rock digital enérgico y su tema principal LALALALA.',
            date: '2023-11-10',
            theme: 'rockstar'
        },
        {
            title: 'Era ATE',
            description: 'Evolución visual, ritmos magnéticos y coreografías espectaculares en su último gran comeback.',
            date: '2024-07-19',
            theme: 'ate'
        }
    ];

    timeline.innerHTML = timelineData.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot dot-${item.theme}"></div>
            <div class="timeline-content t-${item.theme}">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <span class="timeline-date">${formatDate(item.date)}</span>
            </div>
        </div>
    `).join('');
}

// Cargar estadísticas de miembros con temas cromáticos individuales en las cifras (cuerpo de tarjeta unificado en Rojo)
function loadMembersStats() {
    const memberStats = document.getElementById('memberStats');
    if (!memberStats) return;

    // Colores y sombras específicas para cada miembro
    const members = [
        { name: 'Bang Chan', role: 'Líder / Productor', songs: 154, videos: 45, awards: 18, color: '#00f2fe', shadow: '0, 242, 254', border: '0, 242, 254' },
        { name: 'Lee Know', role: 'Líder de Baile', songs: 88, videos: 40, awards: 15, color: '#b12fcb', shadow: '177, 47, 203', border: '177, 47, 203' },
        { name: 'Changbin', role: 'Rapper / Productor', songs: 142, videos: 38, awards: 17, color: '#ccff00', shadow: '204, 255, 0', border: '204, 255, 0' },
        { name: 'Hyunjin', role: 'Visual / Bailarín', songs: 95, videos: 48, awards: 16, color: '#ff4081', shadow: '255, 64, 129', border: '255, 64, 129' },
        { name: 'Han', role: 'Productor / Rapper / Vocal', songs: 135, videos: 42, awards: 16, color: '#ff0844', shadow: '255, 8, 68', border: '255, 8, 68' },
        { name: 'Felix', role: 'Rapper de Voz Grave', songs: 90, videos: 46, awards: 15, color: '#e5a93b', shadow: '229, 169, 59', border: '229, 169, 59' },
        { name: 'Seungmin', role: 'Vocalista Principal', songs: 85, videos: 39, awards: 14, color: '#00e5ff', shadow: '0, 229, 255', border: '0, 229, 255' },
        { name: 'I.N', role: 'Vocalista / Maknae', songs: 82, videos: 37, awards: 13, color: '#fda085', shadow: '253, 160, 133', border: '253, 160, 133' }
    ];

    memberStats.innerHTML = members.map(member => `
        <div class="member-stat-card" style="
            --member-color: ${member.color};
            --m-shadow: ${member.shadow};
            --m-border: ${member.border};
        ">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <div class="member-stats-items">
                <div class="member-stat-item">
                    <span>${member.songs}</span>
                    <p>Canciones</p>
                </div>
                <div class="member-stat-item">
                    <span>${member.videos}</span>
                    <p>Videos</p>
                </div>
                <div class="member-stat-item">
                    <span>${member.awards}</span>
                    <p>Premios</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Cargar lista de actividad reciente con color de categoría en hover y borde rojo unificado
function loadRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;

    const activities = [
        {
            title: 'Nuevo Récord de Ventas',
            description: 'El álbum "MAXIDENT" supera las 3 millones de copias físicas vendidas a nivel mundial.',
            date: 'Hace 3 días',
            type: 'act-record',
            icon: 'fa-star'
        },
        {
            title: 'Lanzamiento de MV Oficial',
            description: 'Estreno mundial del video musical oficial para "특(S-Class)" con récords de visualizaciones en YouTube.',
            date: 'Hace 1 semana',
            type: 'act-mv',
            icon: 'fa-play'
        },
        {
            title: 'Reconocimiento Internacional',
            description: 'Stray Kids se consagra ganador del galardón "Mejor Performance del Año" en la gala de los MAMA 2023.',
            date: 'Hace 2 semanas',
            type: 'act-award',
            icon: 'fa-award'
        }
    ];

    activityList.innerHTML = activities.map(act => `
        <div class="activity-item ${act.type}">
            <div class="activity-icon">
                <i class="fas ${act.icon}"></i>
            </div>
            <div class="activity-content">
                <h4>${act.title}</h4>
                <p>${act.description}</p>
                <span class="activity-date">${act.date}</span>
            </div>
        </div>
    `).join('');
}

// Formatear fechas de manera elegante
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

