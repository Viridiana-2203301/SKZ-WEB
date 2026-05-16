// dashboard.js - Gráficos y estadísticas

// Esperar a que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    loadTimeline();
    loadMembersStats();
    setupNavigation();
});

// Inicializar todos los gráficos
function initCharts() {
    createReleasesChart();
    createGenresChart();
    createAlbumsPopularityChart();
    createMonthlyChart();
}

// Gráfico de lanzamientos por año
function createReleasesChart() {
    const ctx = document.getElementById('releasesChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['2021', '2022', '2023', '2024'],
            datasets: [{
                label: 'Lanzamientos',
                data: [2, 8, 3, 2],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.7)',
                    'rgba(255, 0, 0, 0.8)',
                    'rgba(255, 0, 0, 0.6)',
                    'rgba(255, 0, 0, 0.5)'
                ],
                borderColor: 'rgba(255, 0, 0, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    grid: { color: 'rgba(255, 0, 0, 0.1)' }
                },
                x: {
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    grid: { color: 'rgba(255, 0, 0, 0.1)' }
                }
            }
        }
    });
}

// Gráfico de géneros musicales
function createGenresChart() {
    const ctx = document.getElementById('genresChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Hip-Hop/Rap', 'Pop', 'R&B', 'EDM', 'Otros'],
            datasets: [{
                data: [30, 25, 20, 15, 10],
                backgroundColor: [
                    'rgba(255, 0, 0, 0.8)',
                    'rgba(255, 100, 0, 0.8)',
                    'rgba(255, 200, 0, 0.8)',
                    'rgba(200, 0, 0, 0.8)',
                    'rgba(150, 0, 0, 0.8)'
                ],
                borderColor: 'rgba(0, 0, 0, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12 },
                        padding: 15
                    }
                }
            }
        }
    });
}

// Gráfico de popularidad de álbumes
function createAlbumsPopularityChart() {
    const ctx = document.getElementById('albumsPopularityChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['NOEASY', 'ODDINARY', 'ROCK-STAR', 'ATE', 'MAXIDENT'],
            datasets: [{
                label: 'Popularidad Global',
                data: [85, 92, 78, 88, 95],
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.5)',
                        stepSize: 20
                    },
                    grid: {
                        color: 'rgba(255, 0, 0, 0.1)'
                    }
                }
            }
        }
    });
}

// Gráfico de estadísticas mensuales
function createMonthlyChart() {
    const ctx = document.getElementById('monthlyChart');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: [{
                label: 'Reproducciones (M)',
                data: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 88, 95],
                borderColor: 'rgba(255, 0, 0, 1)',
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(255, 0, 0, 1)',
                pointBorderColor: '#000',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: 'rgba(255, 255, 255, 0.9)',
                        font: { size: 12 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    grid: { color: 'rgba(255, 0, 0, 0.1)' }
                },
                x: {
                    ticks: { color: 'rgba(255, 255, 255, 0.7)' },
                    grid: { color: 'rgba(255, 0, 0, 0.1)' }
                }
            }
        }
    });
}

// Cargar timeline
function loadTimeline() {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    const timelineData = [
        {
            title: 'Debut Oficial',
            description: 'Stray Kids se forma bajo JYP Entertainment',
            date: '2018-03-25'
        },
        {
            title: 'Primer Mini Álbum',
            description: 'Lanzamiento de "I am NOT" - Primer lanzamiento oficial',
            date: '2018-10-29'
        },
        {
            title: 'NOEASY',
            description: 'Primer mini álbum tras cambios en la alineación',
            date: '2021-08-13'
        },
        {
            title: 'ODDINARY',
            description: 'Segundo mini álbum con concepto único',
            date: '2022-03-18'
        },
        {
            title: 'ROCK-STAR',
            description: 'Tercer mini álbum con propuesta de rock moderno',
            date: '2022-06-18'
        },
        {
            title: 'ATE',
            description: 'Cuarto mini álbum con evolución artística',
            date: '2022-09-23'
        },
        {
            title: 'MAXIDENT',
            description: 'Quinto mini álbum - Identidad visual renovada',
            date: '2022-11-04'
        }
    ];

    timeline.innerHTML = timelineData.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
                <span class="timeline-date">${formatDate(item.date)}</span>
            </div>
        </div>
    `).join('');
}

// Cargar estadísticas de miembros
function loadMembersStats() {
    const memberStats = document.getElementById('memberStats');
    if (!memberStats) return;

    const members = [
        { name: 'Bang Chan', role: 'Líder', songs: 25, videos: 30, awards: 15 },
        { name: 'Lee Know', role: 'Vocalista', songs: 20, videos: 28, awards: 12 },
        { name: 'Changbin', role: 'Productor', songs: 22, videos: 25, awards: 14 },
        { name: 'Hyunjin', role: 'Bailarín', songs: 18, videos: 32, awards: 16 },
        { name: 'Han', role: 'Productor', songs: 24, videos: 27, awards: 13 },
        { name: 'Felix', role: 'Rapper', songs: 21, videos: 29, awards: 11 },
        { name: 'Seungmin', role: 'Vocalista', songs: 19, videos: 26, awards: 10 },
        { name: 'I.N', role: 'Vocalista', songs: 17, videos: 24, awards: 9 }
    ];

    memberStats.innerHTML = members.map(member => `
        <div class="member-stat-card">
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

// Formato de fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Setup de navegación
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}
