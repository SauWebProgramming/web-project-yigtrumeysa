// 1. Anahtarlar ve Adresler
const apiKey = 'bb45bdabfec78b5f1714daa4b80ee3a4';
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=tr-TR`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// 2. HTML Elemanlarını Seçme
const main = document.getElementById('main'); 
const form = document.getElementById('form');
const search = document.getElementById('search');

if (!main) {
    console.error("HATA: HTML dosyasında id='main' olan etiketi bulamadım! HTML'i kontrol et.");
}

// 3. Verileri Çekme
getMovies(url);

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        console.log("Veriler Geldi:", data.results);
        showMovies(data.results);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

async function showMovies(movies) {
    main.innerHTML = '';

    if (movies.length === 0) {
        main.innerHTML = '<p class="no-results">Aramanızla eşleşen film/dizi bulunamadı.</p>';
        return;
    }

    // Her film için detaylı bilgi çek (Türkçe özet için)
    for (const movie of movies) {
        const { title, poster_path, vote_average, id } = movie;
        let overview = movie.overview;

        // Eğer özet boşsa veya çok kısaysa İngilizce çek
        if (!overview || overview.trim() === '') {
            try {
                const detailRes = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`);
                const detailEN = await detailRes.json();
                overview = detailEN.overview || 'Özet bilgisi bulunamadı.';
            } catch (error) {
                overview = 'Özet bilgisi bulunamadı.';
            }
        }

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="fav-icon ${isFavorite(id) ? 'active' : ''}" data-id="${id}">
                <span class="symbols">favorite</span>
            </div>
            <div class="movie-info">
                <h3>${title}</h3>
                <div class="rating-container">
                    <span class="imdb-badge">IMDb</span>
                    <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
                </div>
            </div>
            <div class="overview">
                <h3>Özet</h3>
                ${overview}
            </div>
        `;
        
        main.appendChild(movieEl);
        
        // Karta tıklayınca detay aç (kalp hariç)
        movieEl.addEventListener('click', (e) => {
            if (!e.target.closest('.fav-icon')) {
                getMovieDetails(id);
            }
        });
        
        // Kalp ikonuna tıklama
        const favIcon = movieEl.querySelector('.fav-icon');
        favIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
            favIcon.classList.toggle('active');
        });
    }
}

// Renk Fonksiyonu
function getClassByRate(vote) {
    if (vote >= 8) return 'green';
    else if (vote >= 5) return 'orange';
    else return 'red';
}

// ARAMA FONKSİYONU
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;

    if (searchTerm && searchTerm !== '') {
        getMovies(SEARCH_API + searchTerm);
    } else {
        window.location.reload();
    }
});

// FAVORİLER SİSTEMİ
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

const favModal = document.createElement('div');
favModal.classList.add('favorites-modal');
favModal.innerHTML = `
    <div class="favorites-content">
        <div class="favorites-header">
            <h2>❤️ Favorilerim</h2>
            <button class="close-btn">Kapat</button>
        </div>
        <div class="favorites-grid" id="favoritesGrid"></div>
    </div>
`;
document.body.appendChild(favModal);

document.getElementById('favBtn').addEventListener('click', () => {
    showFavorites();
    favModal.classList.add('active');
});

favModal.querySelector('.close-btn').addEventListener('click', () => {
    favModal.classList.remove('active');
});

function showFavorites() {
    const grid = document.getElementById('favoritesGrid');
    
    if (favorites.length === 0) {
        grid.innerHTML = '<p class="no-favorites">Henüz favori film eklemediniz.</p>';
        return;
    }
    
    grid.innerHTML = '';
    favorites.forEach(movie => {
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card');
        movieEl.innerHTML = `
            <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average.toFixed(1)}</span>
            </div>
            <div class="fav-icon active" data-id="${movie.id}">
                <span class="symbols">favorite</span>
            </div>
        `;
        grid.appendChild(movieEl);
        
        movieEl.querySelector('.fav-icon').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleFavorite(movie);
            showFavorites();
        });
    });
}

function toggleFavorite(movie) {
    const index = favorites.findIndex(fav => fav.id === movie.id);
    
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(movie);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorite(movieId) {
    return favorites.some(fav => fav.id === movieId);
}

// DETAY MODAL SİSTEMİ
const detailModal = document.getElementById('detailModal');
const detailInfo = document.getElementById('detailInfo');

detailModal.querySelector('.detail-close').addEventListener('click', closeDetailModal);
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetailModal();
});

function closeDetailModal() {
    detailModal.classList.remove('active');
}

async function getMovieDetails(movieId) {
    try {
        // Önce Türkçe dene
        const [detailRes, creditsRes] = await Promise.all([
            fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=tr-TR`),
            fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}&language=tr-TR`)
        ]);
        
        const detail = await detailRes.json();
        const credits = await creditsRes.json();
        
        // Eğer özet boşsa İngilizce çek
        if (!detail.overview || detail.overview.trim() === '') {
            const detailResEN = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`);
            const detailEN = await detailResEN.json();
            detail.overview = detailEN.overview;
        }
        
        showMovieDetails(detail, credits);
    } catch (error) {
        console.error("Detay yüklenirken hata:", error);
    }
}

function showMovieDetails(movie, credits) {
    const {
        title,
        poster_path,
        backdrop_path,
        vote_average,
        release_date,
        runtime,
        genres,
        overview,
        production_companies,
        budget,
        revenue
    } = movie;
    
    const cast = credits.cast.slice(0, 12);
    const director = credits.crew.find(person => person.job === 'Director');
    
    detailInfo.innerHTML = `
        <div class="detail-header">
            <div class="detail-poster">
                <img src="${IMG_PATH + poster_path}" alt="${title}">
            </div>
            <div class="detail-info-main">
                <h2 class="detail-title">${title}</h2>
                <div class="detail-meta">
                    <span class="detail-badge">📅 ${release_date ? release_date.split('-')[0] : 'Bilinmiyor'}</span>
                    <span class="detail-badge">⏱️ ${runtime ? runtime + ' dk' : 'Bilinmiyor'}</span>
                    ${director ? `<span class="detail-badge">🎬 ${director.name}</span>` : ''}
                </div>
                <div class="detail-rating">
                    <span class="imdb-badge">IMDb</span>
                    <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}/10</span>
                    <span style="color: #bbb;">(${movie.vote_count} oy)</span>
                </div>
                <div class="detail-section">
                    <h3>Türler</h3>
                    <div class="genre-list">
                        ${genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                    </div>
                </div>
                <div class="detail-section">
                    <h3>Özet</h3>
                    <p class="detail-overview">${overview || 'Özet bilgisi bulunamadı.'}</p>
                </div>
            </div>
        </div>
        
        ${cast.length > 0 ? `
        <div class="detail-section">
            <h3>Oyuncular</h3>
            <div class="cast-grid">
                ${cast.map(actor => `
                    <div class="cast-card">
                        <img src="${actor.profile_path ? IMG_PATH + actor.profile_path : 'https://via.placeholder.com/150x200?text=Fotoğraf+Yok'}" alt="${actor.name}">
                        <div class="cast-info">
                            <div class="cast-name">${actor.name}</div>
                            <div class="cast-character">${actor.character}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        ` : ''}
        
        ${production_companies.length > 0 ? `
        <div class="detail-section">
            <h3>Yapım Şirketleri</h3>
            <p>${production_companies.map(c => c.name).join(', ')}</p>
        </div>
        ` : ''}
    `;
    
    detailModal.classList.add('active');
}

// FİLTRELEME SİSTEMİ
const filterModal = document.getElementById('filterModal');
const filterBtn = document.getElementById('filterBtn');
const genreList = document.getElementById('genreList');
const yearSelect = document.getElementById('yearSelect');
let selectedGenre = null;
let selectedYear = '';

// Türleri getir
const genres = [
    { id: 28, name: 'Aksiyon' },
    { id: 12, name: 'Macera' },
    { id: 16, name: 'Animasyon' },
    { id: 35, name: 'Komedi' },
    { id: 80, name: 'Suç' },
    { id: 99, name: 'Belgesel' },
    { id: 18, name: 'Dram' },
    { id: 10751, name: 'Aile' },
    { id: 14, name: 'Fantastik' },
    { id: 36, name: 'Tarih' },
    { id: 27, name: 'Korku' },
    { id: 10402, name: 'Müzik' },
    { id: 9648, name: 'Gizem' },
    { id: 10749, name: 'Romantik' },
    { id: 878, name: 'Bilim Kurgu' },
    { id: 10770, name: 'TV Film' },
    { id: 53, name: 'Gerilim' },
    { id: 10752, name: 'Savaş' },
    { id: 37, name: 'Western' }
];

// Yılları doldur (2024'ten 1990'a)
for (let year = 2024; year >= 1990; year--) {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// Türleri listele
genres.forEach(genre => {
    const genreEl = document.createElement('div');
    genreEl.classList.add('genre-option');
    genreEl.textContent = genre.name;
    genreEl.dataset.id = genre.id;
    
    genreEl.addEventListener('click', () => {
        // Diğerlerini kaldır
        document.querySelectorAll('.genre-option').forEach(el => el.classList.remove('active'));
        genreEl.classList.add('active');
        selectedGenre = genre.id;
    });
    
    genreList.appendChild(genreEl);
});

// Filtre modal aç/kapa
filterBtn.addEventListener('click', () => {
    filterModal.classList.add('active');
});

filterModal.querySelector('.filter-close').addEventListener('click', () => {
    filterModal.classList.remove('active');
});

filterModal.addEventListener('click', (e) => {
    if (e.target === filterModal) {
        filterModal.classList.remove('active');
    }
});

// Filtreyi uygula
document.getElementById('applyFilter').addEventListener('click', () => {
    selectedYear = yearSelect.value;
    applyFilters();
    filterModal.classList.remove('active');
});

// Filtreyi temizle
document.getElementById('clearFilter').addEventListener('click', () => {
    selectedGenre = null;
    selectedYear = '';
    yearSelect.value = '';
    document.querySelectorAll('.genre-option').forEach(el => el.classList.remove('active'));
    getMovies(url); // Ana sayfaya dön
    filterModal.classList.remove('active');
});

// Filtreleri uygula
function applyFilters() {
    let filterUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=tr-TR`;
    
    if (selectedGenre) {
        filterUrl += `&with_genres=${selectedGenre}`;
    }
    
    if (selectedYear) {
        filterUrl += `&primary_release_year=${selectedYear}`;
    }
    
    getMovies(filterUrl);
}