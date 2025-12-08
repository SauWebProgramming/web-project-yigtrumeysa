// 1. Anahtarlar ve Adresler
const apiKey = 'bb45bdabfec78b5f1714daa4b80ee3a4'; // Senin anahtarın
const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=tr-TR`;
const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=`;

// 2. HTML Elemanlarını Seçme
// DİKKAT: Senin HTML kodundaki id="main" ile burası EŞLEŞMELİ.
const main = document.getElementById('main'); 
const form = document.getElementById('form');
const search = document.getElementById('search');

// Hata Ayıklama: Eğer main kutusunu bulamazsa konsola hata yazsın
if (!main) {
    console.error("HATA: HTML dosyasında id='main' olan etiketi bulamadım! HTML'i kontrol et.");
}

// 3. Verileri Çekme (Motoru Çalıştır)
getMovies(url);

async function getMovies(url) {
    try {
        const res = await fetch(url);
        const data = await res.json();
        
        console.log("Veriler Geldi:", data.results); // Konsolda verileri gör
        showMovies(data.results);
    } catch (error) {
        console.error("Veri çekme hatası:", error);
    }
}

// 4. Ekrana Basma
function showMovies(movies) {
    main.innerHTML = ''; // Ekranı temizle

    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview } = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie-card'); // CSS'teki stil sınıfı

        movieEl.innerHTML = `
            <img src="${IMG_PATH + poster_path}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getClassByRate(vote_average)}">${vote_average.toFixed(1)}</span>
            </div>
            <div class="overview">
                <h3>Özet</h3>
                ${overview}
            </div>
        `;
        main.appendChild(movieEl);
    });
}

// Renk Fonksiyonu
function getClassByRate(vote) {
    if (vote >= 8) return 'green';
    else if (vote >= 5) return 'orange';
    else return 'red';
}

// --- ARAMA FONKSİYONU ---

form.addEventListener('submit', (e) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle (yoksa arama kaybolur)

    const searchTerm = search.value; // Kutudaki yazıyı al

    if (searchTerm && searchTerm !== '') {
        // Eğer kutu boş değilse, yeni adrese git verileri getir
        getMovies(SEARCH_API + searchTerm);
        
       
    } else {
        // Kutu boşsa sayfayı yenile (Ana sayfaya dön)
        window.location.reload();
    }
});