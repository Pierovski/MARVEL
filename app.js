// =============================================================================
// CONFIGURACIÓN GLOBAL (TMDB, GEMAS, RANGOS Y LOGROS)
// =============================================================================
// Opcional: pega aquí tu API Key gratuita de TMDB (https://www.themoviedb.org/settings/api)
// o ingrésala directamente desde la Bóveda > Estadísticas sin tocar el código.
const DEFAULT_TMDB_API_KEY = '';
const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const GEMS = [
    { id: 'cap-america-1', name: 'Espacio', fullName: 'Gema del Espacio', color: '#3b82f6', icon: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.55)' },
    { id: 'avengers-1', name: 'Mente', fullName: 'Gema de la Mente', color: '#facc15', icon: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.55)' },
    { id: 'thor-2', name: 'Realidad', fullName: 'Gema de la Realidad', color: '#ef4444', icon: 'text-red-500', glow: 'rgba(239, 68, 68, 0.55)' },
    { id: 'gotg-1', name: 'Poder', fullName: 'Gema del Poder', color: '#a855f7', icon: 'text-purple-500', glow: 'rgba(168, 85, 247, 0.55)' },
    { id: 'dr-strange', name: 'Tiempo', fullName: 'Gema del Tiempo', color: '#10b981', icon: 'text-emerald-500', glow: 'rgba(16, 185, 129, 0.55)' },
    { id: 'infinity-war', name: 'Alma', fullName: 'Gema del Alma', color: '#f97316', icon: 'text-orange-500', glow: 'rgba(249, 115, 22, 0.55)' }
];

const AGENT_RANKS = [
    { min: 100, title: 'El Vigilante', icon: 'fa-eye', color: 'text-amber-300 border-amber-400/50 bg-amber-500/15' },
    { min: 90, title: 'Guardián del Nexo', icon: 'fa-atom', color: 'text-purple-300 border-purple-400/50 bg-purple-500/15' },
    { min: 70, title: 'Director de S.H.I.E.L.D.', icon: 'fa-shield-halved', color: 'text-cyan-300 border-cyan-400/50 bg-cyan-500/15' },
    { min: 45, title: 'Operativo Nivel 7', icon: 'fa-user-shield', color: 'text-emerald-300 border-emerald-400/50 bg-emerald-500/15' },
    { min: 20, title: 'Especialista Nivel 4', icon: 'fa-crosshairs', color: 'text-blue-300 border-blue-400/50 bg-blue-500/15' },
    { min: 5, title: 'Agente de Campo', icon: 'fa-id-badge', color: 'text-zinc-200 border-zinc-600 bg-zinc-800/70' },
    { min: 0, title: 'Recluta Nivel 1', icon: 'fa-user-astronaut', color: 'text-zinc-400 border-zinc-700 bg-zinc-900/80' }
];

const ACHIEVEMENTS = [
    {
        id: 'fase-1',
        title: 'Iniciativa Vengador',
        desc: 'Completaste las 6 películas originales de la Fase 1.',
        icon: 'fa-shield-halved text-blue-400',
        check: (data) => ['cap-america-1', 'iron-man-1', 'iron-man-2', 'thor-1', 'hulk-1', 'avengers-1'].every(id => data.watched.includes(id))
    },
    {
        id: 'guantelete',
        title: 'Portador del Guantelete',
        desc: 'Reuniste las 6 Gemas del Infinito en la Bóveda.',
        icon: 'fa-gem text-amber-400',
        check: (data) => GEMS.every(g => data.watched.includes(g.id))
    },
    {
        id: 'thanos',
        title: 'Inevitable',
        desc: 'Sobreviviste al cierre de la Saga del Infinito en Endgame.',
        icon: 'fa-hand-fist text-orange-400',
        check: (data) => data.watched.includes('endgame')
    },
    {
        id: 'spider-verse',
        title: 'Nostalgia Pura',
        desc: 'Viste las 5 películas del legado clásico de Spider-Man.',
        icon: 'fa-spider text-red-500',
        check: (data) => ['spider-man-1', 'spider-man-2', 'spider-man-3', 'tasm-1', 'tasm-2'].every(id => data.watched.includes(id))
    },
    {
        id: 'defensores',
        title: 'Nivel Callejero',
        desc: 'Revisaste los expedientes completos de Hell\'s Kitchen.',
        icon: 'fa-hands-bound text-purple-400',
        check: (data) => ['daredevil-s1', 'daredevil-s2', 'defenders', 'daredevil-s3'].every(id => data.watched.includes(id))
    },
    {
        id: 'loki-loom',
        title: 'Guardián del Telar',
        desc: 'Completaste ambas temporadas de Loki.',
        icon: 'fa-tree text-emerald-400',
        check: (data) => ['loki-s1', 'loki-s2'].every(id => data.watched.includes(id))
    },
    {
        id: 'critico',
        title: 'Crítico del UCM',
        desc: 'Calificaste al menos 15 expedientes con estrellas.',
        icon: 'fa-star text-yellow-400',
        check: (data) => Object.keys(data.ratings || {}).length >= 15
    },
    {
        id: 'archivista',
        title: 'Archivista Nivel 7',
        desc: 'Registraste observaciones en al menos 10 libretas de campo.',
        icon: 'fa-book-open text-cyan-400',
        check: (data) => Object.values(data.notes || {}).filter(n => n && n.trim().length > 0).length >= 10
    }
];

// =============================================================================
// ALMACENAMIENTO SEGURO Y ESTADO
// =============================================================================
const Storage = {
    keys: {
        watched: 'ucm_watched',
        episodes: 'ucm_episodes',
        notes: 'ucm_notes',
        ratings: 'ucm_ratings',
        sort: 'ucm_sort',
        achievements: 'ucm_badges',
        spoilerFree: 'ucm_spoiler_free',
        viewMode: 'ucm_view_mode',
        hoursPerDay: 'ucm_hours_per_day',
        tmdbKey: 'ucm_tmdb_key',
        posterCache: 'ucm_poster_cache_v2'
    },
    save(key, data) {
        try {
            localStorage.setItem(this.keys[key], JSON.stringify(data));
        } catch (err) {
            console.warn(`Error guardando "${key}":`, err);
        }
    },
    load(key, fallback) {
        try {
            const raw = localStorage.getItem(this.keys[key]);
            if (raw === null) return fallback;
            const parsed = JSON.parse(raw);
            return parsed ?? fallback;
        } catch (err) {
            console.warn(`Datos corruptos para "${key}", restaurando valor por defecto.`, err);
            localStorage.removeItem(this.keys[key]);
            return fallback;
        }
    }
};

const State = {
    filters: {
        status: 'all',
        saga: 'all',
        sort: 'narrative',
        query: '',
        spoilerFree: false,
        viewMode: 'grid',
        hoursPerDay: 2
    },
    vaultTab: 'artifacts',
    activeDrawerId: null,
    currentListIds: [],
    konamiActive: false,
    tmdbKey: '',
    posterCache: {},
    data: {
        watched: [],
        episodes: {},
        notes: {},
        ratings: {},
        achievements: []
    },
    init() {
        const watched = Storage.load('watched', []);
        const episodes = Storage.load('episodes', {});
        const notes = Storage.load('notes', {});
        const ratings = Storage.load('ratings', {});
        const achievements = Storage.load('achievements', []);
        const sort = Storage.load('sort', 'narrative');
        const spoilerFree = Storage.load('spoilerFree', false);
        const viewMode = Storage.load('viewMode', 'grid');
        const hoursPerDay = Storage.load('hoursPerDay', 2);
        const tmdbKey = Storage.load('tmdbKey', '');
        const posterCache = Storage.load('posterCache', {});

        this.data.watched = Array.isArray(watched) ? watched : [];
        this.data.episodes = (episodes && typeof episodes === 'object' && !Array.isArray(episodes)) ? episodes : {};
        this.data.notes = (notes && typeof notes === 'object' && !Array.isArray(notes)) ? notes : {};
        this.data.ratings = (ratings && typeof ratings === 'object' && !Array.isArray(ratings)) ? ratings : {};
        this.data.achievements = Array.isArray(achievements) ? achievements : [];

        this.filters.sort = (sort === 'release' || sort === 'narrative') ? sort : 'narrative';
        this.filters.spoilerFree = Boolean(spoilerFree);
        this.filters.viewMode = (viewMode === 'timeline' || viewMode === 'grid') ? viewMode : 'grid';
        this.filters.hoursPerDay = (typeof hoursPerDay === 'number' && hoursPerDay > 0) ? hoursPerDay : 2;
        this.tmdbKey = (typeof tmdbKey === 'string' && tmdbKey.trim()) ? tmdbKey.trim() : DEFAULT_TMDB_API_KEY;
        this.posterCache = (posterCache && typeof posterCache === 'object' && !Array.isArray(posterCache)) ? posterCache : {};

        this.migrateLegacyData();
    },
    migrateLegacyData() {
        // Migra IDs agrupados de v1 (loki-s1-2) a temporadas separadas sin perder progreso
        if (this.data.watched.includes('loki-s1-2')) {
            this.data.watched = this.data.watched.filter(id => id !== 'loki-s1-2');
            if (!this.data.watched.includes('loki-s1')) this.data.watched.push('loki-s1');
            if (!this.data.watched.includes('loki-s2')) this.data.watched.push('loki-s2');
            Storage.save('watched', this.data.watched);
        }
        // Sincroniza episodios completos para series ya marcadas como vistas
        let changed = false;
        marvelDataset.forEach(m => {
            if (m.episodes && this.data.watched.includes(m.id) && this.data.episodes[m.id] !== m.episodes) {
                this.data.episodes[m.id] = m.episodes;
                changed = true;
            }
        });
        if (changed) Storage.save('episodes', this.data.episodes);
    }
};

// =============================================================================
// UTILIDADES DE TIEMPO Y FECHAS
// =============================================================================
const Helpers = {
    getTodayISO() {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },
    isUpcoming(movie) {
        if (!movie || !movie.releaseDate) return false;
        return movie.releaseDate > this.getTodayISO();
    },
    daysUntilRelease(movie) {
        if (!movie || !movie.releaseDate) return 0;
        const today = new Date(`${this.getTodayISO()}T00:00:00`);
        const release = new Date(`${movie.releaseDate}T00:00:00`);
        return Math.max(0, Math.ceil((release - today) / (1000 * 60 * 60 * 24)));
    },
    formatReleaseDate(isoDate) {
        if (!isoDate) return '';
        const [y, m, d] = isoDate.split('-').map(Number);
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        return `${d} ${months[(m || 1) - 1]} ${y}`;
    },
    getMovieTotalMinutes(movie) {
        if (movie.episodes) {
            return movie.episodes * (movie.episodeRuntime || 45);
        }
        if (movie.type && movie.type.includes('Serie')) {
            return (parseInt(movie.duration, 10) || 0) * 45;
        }
        const hMatch = movie.duration.match(/(\d+)h/);
        const mMatch = movie.duration.match(/(\d+)m/);
        const h = hMatch ? parseInt(hMatch[1], 10) : 0;
        const m = mMatch ? parseInt(mMatch[1], 10) : 0;
        return (h * 60) + m;
    },
    getMovieWatchedMinutes(movie) {
        if (State.data.watched.includes(movie.id)) {
            return this.getMovieTotalMinutes(movie);
        }
        if (movie.episodes) {
            const ep = State.data.episodes[movie.id] || 0;
            return Math.min(ep, movie.episodes) * (movie.episodeRuntime || 45);
        }
        return 0;
    },
    formatMinutes(totalMins) {
        const hrs = Math.floor(totalMins / 60);
        const mins = totalMins % 60;
        return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    },
    getAgentRank(percentage) {
        return AGENT_RANKS.find(r => percentage >= r.min) || AGENT_RANKS[AGENT_RANKS.length - 1];
    }
};

// =============================================================================
// GESTOR DE PÓSTERS (TMDB API + FALLBACK HOLOGRÁFICO SVG/CSS OFFLINE)
// =============================================================================
const PosterManager = {
    queue: [],
    inFlight: new Set(),
    processing: false,

    getApiKey() {
        return (State.tmdbKey || DEFAULT_TMDB_API_KEY || '').trim();
    },

    getCachedUrl(movieId) {
        const cached = State.posterCache[movieId];
        if (!cached || cached === 'none') return null;
        return cached;
    },

    requestPoster(movie) {
        const key = this.getApiKey();
        if (!key) return;
        if (State.posterCache[movie.id] !== undefined) return;
        if (this.inFlight.has(movie.id)) return;

        this.inFlight.add(movie.id);
        this.queue.push(movie);
        this.processQueue();
    },

    async processQueue() {
        if (this.processing) return;
        this.processing = true;

        while (this.queue.length > 0) {
            const movie = this.queue.shift();
            const key = this.getApiKey();
            if (!key) break;

            try {
                const url = await this.fetchFromTMDB(movie, key);
                State.posterCache[movie.id] = url || 'none';
                Storage.save('posterCache', State.posterCache);
                if (url) {
                    this.applyPosterToDOM(movie.id, url, movie.title);
                }
            } catch (err) {
                console.warn(`Error TMDB para ${movie.id}:`, err);
            } finally {
                this.inFlight.delete(movie.id);
            }

            await new Promise(r => setTimeout(r, 90));
        }

        this.processing = false;
    },

    async fetchFromTMDB(movie, apiKey) {
        const type = movie.tmdbType === 'tv' ? 'tv' : 'movie';
        const query = encodeURIComponent(movie.tmdbQuery || movie.title);
        const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : '';
        const yearParam = year ? (type === 'tv' ? `&first_air_date_year=${year}` : `&year=${year}`) : '';

        const tryFetch = async (url) => {
            const res = await fetch(url);
            if (!res.ok) return null;
            const json = await res.json();
            if (!json.results || json.results.length === 0) return null;
            const match = json.results.find(item => item.backdrop_path || item.poster_path) || json.results[0];
            const path = match.backdrop_path || match.poster_path;
            return path ? `${TMDB_IMG_BASE}${path}` : null;
        };

        // 1) Búsqueda precisa en español con año
        let found = await tryFetch(`https://api.themoviedb.org/3/search/${type}?api_key=${encodeURIComponent(apiKey)}&query=${query}${yearParam}&language=es-MX`);
        // 2) Fallback sin filtro de año (útil para One-Shots, temporadas 2/3 o fechas reprogramadas)
        if (!found) {
            found = await tryFetch(`https://api.themoviedb.org/3/search/${type}?api_key=${encodeURIComponent(apiKey)}&query=${query}&language=en-US`);
        }
        return found;
    },

    applyPosterToDOM(movieId, url, title) {
        const slots = document.querySelectorAll(`[data-poster-slot="${movieId}"]`);
        slots.forEach(slot => {
            if (slot.querySelector('img.tmdb-poster-img')) return;
            const img = document.createElement('img');
            img.src = url;
            img.alt = title;
            img.loading = 'lazy';
            img.decoding = 'async';
            img.className = 'tmdb-poster-img absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500';
            img.onload = () => img.classList.replace('opacity-0', 'opacity-80');
            img.onerror = () => img.remove();
            slot.insertBefore(img, slot.firstChild);
        });
    },

    renderBannerHTML(movie, heightClass = 'h-28') {
        const accent = movie.accent || '#e11d48';
        const icon = movie.icon || 'fa-film';
        const year = movie.releaseDate ? movie.releaseDate.slice(0, 4) : '';
        const cachedUrl = this.getCachedUrl(movie.id);

        if (!cachedUrl && this.getApiKey()) {
            this.requestPoster(movie);
        }

        return `
            <div data-poster-slot="${movie.id}" class="relative ${heightClass} w-full overflow-hidden border-b border-white/10 select-none" style="background: radial-gradient(circle at 80% 25%, ${accent}38 0%, #09090f 75%);">
                ${cachedUrl ? `<img src="${UI.escapeHTML(cachedUrl)}" alt="${UI.escapeHTML(movie.title)}" loading="lazy" decoding="async" onerror="this.remove()" class="tmdb-poster-img absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-500">` : ''}

                <!-- Patrón holográfico SVG 100% offline -->
                <svg class="absolute inset-0 w-full h-full opacity-25 pointer-events-none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid-${movie.id}" width="24" height="24" patternUnits="userSpaceOnUse">
                            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${accent}" stroke-width="0.6" stroke-opacity="0.45"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-${movie.id})" />
                    <line x1="0" y1="100%" x2="100%" y2="0" stroke="${accent}" stroke-width="1" stroke-opacity="0.25" />
                </svg>

                <!-- Degradado de contraste para legibilidad -->
                <div class="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-[#0b0b12]/45 to-transparent pointer-events-none"></div>

                <!-- Emblema SVG/Icono y marca de año -->
                <div class="absolute right-3 bottom-2 flex items-center gap-2 pointer-events-none">
                    <span class="font-display text-2xl font-black tracking-tighter opacity-15 text-white">${UI.escapeHTML(year)}</span>
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center border backdrop-blur-sm" style="background:${accent}22; border-color:${accent}55; color:${accent};">
                        <i class="fa-solid ${icon} text-base"></i>
                    </div>
                </div>
            </div>
        `;
    }
};

// =============================================================================
// INTERFAZ Y RENDERIZADO (UI)
// =============================================================================
const UI = {
    noteDebounceTimer: null,

    escapeHTML(str) {
        if (str === null || str === undefined) return '';
        return String(str).replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag]));
    },

    normalizeText(str) {
        if (!str) return '';
        return String(str)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    },

    getImportanceStyle(importance) {
        if (importance === 'Esencial') return 'text-rose-300 bg-rose-500/15 border-rose-500/30';
        if (importance === 'Recomendada') return 'text-amber-300 bg-amber-500/15 border-amber-500/30';
        return 'text-zinc-400 bg-zinc-800/70 border-zinc-700/70';
    },

    updateStats() {
        const sagaItems = marvelDataset.filter(m => State.filters.saga === 'all' || m.saga === State.filters.saga);
        const releasedInSaga = sagaItems.filter(m => !Helpers.isUpcoming(m));
        const watchedInSaga = releasedInSaga.filter(m => State.data.watched.includes(m.id));

        const totalReleased = releasedInSaga.length;
        const percentage = totalReleased > 0 ? Math.round((watchedInSaga.length / totalReleased) * 100) : 0;

        const progressStats = document.getElementById('progress-stats');
        if (progressStats) progressStats.innerText = `${watchedInSaga.length}/${totalReleased} (${percentage}%)`;

        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = `${percentage}%`;

        // Rango de agente basado en el progreso global de títulos ya estrenados
        const allReleased = marvelDataset.filter(m => !Helpers.isUpcoming(m));
        const allWatched = allReleased.filter(m => State.data.watched.includes(m.id));
        const globalPct = allReleased.length > 0 ? Math.round((allWatched.length / allReleased.length) * 100) : 0;
        const rank = Helpers.getAgentRank(globalPct);
        const rankBadge = document.getElementById('agent-rank-badge');
        if (rankBadge) {
            rankBadge.className = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-tech font-bold uppercase tracking-wider transition-all ${rank.color}`;
            rankBadge.innerHTML = `<i class="fa-solid ${rank.icon}"></i> ${this.escapeHTML(rank.title)}`;
        }

        // Tiempo total invertido (incluyendo episodios parciales)
        const totalMins = releasedInSaga.reduce((acc, movie) => acc + Helpers.getMovieWatchedMinutes(movie), 0);
        const timeStats = document.getElementById('time-stats');
        if (timeStats) timeStats.innerText = Helpers.formatMinutes(totalMins);

        this.renderGemsHeader();
        this.renderNextMission(releasedInSaga);
    },

    renderGemsHeader() {
        const buildHTML = (compact = false) => GEMS.map(gem => {
            const hasGem = State.data.watched.includes(gem.id);
            const sizeClass = compact ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm';
            const classes = hasGem
                ? `${gem.icon} drop-shadow-[0_0_10px_currentColor] scale-110 animate-pulse-glow`
                : 'text-zinc-800 opacity-35 scale-100';

            return `
                <div class="relative flex items-center justify-center ${sizeClass} rounded-full ${hasGem ? 'bg-white/5 border border-white/15' : ''} transition-all duration-500" title="${this.escapeHTML(gem.fullName)}">
                    <i class="fa-solid fa-gem transition-all duration-500 ${classes}" aria-label="${this.escapeHTML(gem.fullName)}"></i>
                </div>
            `;
        }).join('');

        const desktopTracker = document.getElementById('gem-tracker');
        if (desktopTracker) desktopTracker.innerHTML = buildHTML(false);

        const mobileTracker = document.getElementById('gem-tracker-mobile');
        if (mobileTracker) mobileTracker.innerHTML = buildHTML(true);
    },

    renderNextMission(releasedInSaga) {
        const container = document.getElementById('next-mission-banner');
        if (!container) return;

        const sorted = [...releasedInSaga].sort((a, b) => {
            if (State.filters.sort === 'release') {
                const diff = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
                return diff !== 0 ? diff : a.chronoIndex - b.chronoIndex;
            }
            return a.chronoIndex - b.chronoIndex;
        });

        const pending = sorted.filter(m => !State.data.watched.includes(m.id));
        const nextMovie = pending[0];

        // Cálculo de maratón (minutos restantes reales)
        const remainingMins = pending.reduce((acc, m) => {
            return acc + Math.max(0, Helpers.getMovieTotalMinutes(m) - Helpers.getMovieWatchedMinutes(m));
        }, 0);
        const remainingHours = Math.round((remainingMins / 60) * 10) / 10;
        const hrsPerDay = State.filters.hoursPerDay || 2;
        const daysNeeded = remainingMins > 0 ? Math.ceil((remainingMins / 60) / hrsPerDay) : 0;

        if (!nextMovie) {
            const upcomingList = marvelDataset
                .filter(m => (State.filters.saga === 'all' || m.saga === State.filters.saga) && Helpers.isUpcoming(m))
                .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate));
            const nextUpcoming = upcomingList[0];

            container.innerHTML = `
                <div class="glass-panel rounded-2xl p-4 sm:p-5 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div class="flex items-center gap-3.5">
                        <div class="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center text-xl shrink-0">
                            <i class="fa-solid fa-circle-check"></i>
                        </div>
                        <div>
                            <p class="font-tech text-[10px] font-bold uppercase tracking-widest text-emerald-400">Expedientes al Día</p>
                            <h2 class="font-display text-base sm:text-lg font-black text-white uppercase">Has completado todo lo estrenado en esta vista</h2>
                            ${nextUpcoming ? `<p class="text-xs text-zinc-400 font-tech mt-0.5">Próximo estreno en agenda: <strong class="text-amber-400">${this.escapeHTML(nextUpcoming.title)}</strong> (${Helpers.formatReleaseDate(nextUpcoming.releaseDate)} · en ${Helpers.daysUntilRelease(nextUpcoming)} días)</p>` : ''}
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        const epWatched = nextMovie.episodes ? (State.data.episodes[nextMovie.id] || 0) : 0;
        const isSeriesInProgress = Boolean(nextMovie.episodes && epWatched > 0);
        const finishDate = new Date();
        finishDate.setDate(finishDate.getDate() + daysNeeded);
        const finishStr = finishDate.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' });

        container.innerHTML = `
            <div class="glass-panel rounded-2xl p-4 sm:p-5 border border-white/10 relative overflow-hidden">
                <div class="absolute top-0 left-0 w-1 h-full bg-marvel"></div>
                <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pl-2">
                    <div class="flex items-start gap-3.5 min-w-0">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border text-lg" style="background:${nextMovie.accent || '#e11d48'}20; border-color:${nextMovie.accent || '#e11d48'}55; color:${nextMovie.accent || '#e11d48'};">
                            <i class="fa-solid ${nextMovie.icon || 'fa-play'}"></i>
                        </div>
                        <div class="min-w-0">
                            <div class="flex flex-wrap items-center gap-2 mb-0.5 font-tech">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-marvel flex items-center gap-1">
                                    <i class="fa-solid fa-crosshairs"></i> Siguiente Misión
                                </span>
                                <span class="text-[10px] text-zinc-500">•</span>
                                <span class="text-[10px] font-bold uppercase text-amber-400">${this.escapeHTML(nextMovie.phase)}</span>
                                <span class="text-[10px] text-zinc-400">(${this.escapeHTML(nextMovie.duration)})</span>
                            </div>
                            <h2 class="font-display text-base sm:text-lg font-black text-white uppercase truncate">${this.escapeHTML(nextMovie.title)}</h2>
                            <div class="flex flex-wrap items-center gap-2 mt-2">
                                ${nextMovie.episodes ? `
                                    <button type="button" onclick="App.stepEpisode('${nextMovie.id}', 1)" class="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-tech text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-1.5">
                                        <i class="fa-solid fa-plus"></i> Ep ${epWatched + 1}/${nextMovie.episodes}
                                    </button>
                                ` : ''}
                                <button type="button" onclick="App.toggleWatched('${nextMovie.id}')" class="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-tech text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-1.5">
                                    <i class="fa-solid fa-check"></i> ${isSeriesInProgress ? 'Completar Serie' : 'Marcar Vista'}
                                </button>
                                <button type="button" onclick="App.openDrawer('${nextMovie.id}')" class="px-3 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 font-tech text-xs font-bold uppercase tracking-wide transition-all flex items-center gap-1.5">
                                    <i class="fa-solid fa-folder-open"></i> Expediente
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Calculadora de Maratón -->
                    <div class="bg-black/45 border border-zinc-800/90 rounded-xl px-3.5 py-2.5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0 font-tech">
                        <div>
                            <p class="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Calculadora de Maratón</p>
                            <p class="text-xs text-zinc-200 mt-0.5">
                                Quedan <strong class="text-white">${remainingHours}h</strong> (${pending.length} pendientes) → <strong class="text-amber-400">${daysNeeded} día${daysNeeded === 1 ? '' : 's'}</strong>
                            </p>
                            <p class="text-[10px] text-zinc-500">Meta estimada: ${this.escapeHTML(finishStr)}</p>
                        </div>
                        <div class="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                            ${[1, 2, 3, 4].map(h => `
                                <button type="button" onclick="App.setHoursPerDay(${h})" class="px-2 py-0.5 rounded text-[11px] font-bold transition-all ${hrsPerDay === h ? 'bg-marvel text-white shadow' : 'text-zinc-400 hover:text-white'}">${h}h/d</button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    updateControlsUI() {
        ['all', 'Infinito', 'Multiverso'].forEach(s => {
            const btn = document.getElementById(`tab-saga-${s}`);
            if (!btn) return;
            btn.className = (s === State.filters.saga)
                ? "snap-start shrink-0 font-tech font-bold px-4 py-1 text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all bg-marvel text-white border border-marvel shadow-[0_0_15px_var(--color-glow)]"
                : "snap-start shrink-0 font-tech font-bold px-4 py-1 text-xs sm:text-sm uppercase tracking-wider rounded-full transition-all bg-zinc-900/40 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800/80";
        });

        ['all', 'pending', 'watched'].forEach(s => {
            const btn = document.getElementById(`btn-status-${s}`);
            if (!btn) return;
            btn.className = (s === State.filters.status)
                ? "shrink-0 font-tech font-bold px-3 py-0.5 text-xs tracking-wide rounded transition-all bg-zinc-800 text-white shadow-sm"
                : "shrink-0 font-tech font-bold px-3 py-0.5 text-xs tracking-wide rounded transition-all text-zinc-500 hover:text-zinc-300 bg-transparent";
        });

        // Botón Modo Sin Spoilers
        const btnSpoiler = document.getElementById('btn-spoiler-toggle');
        if (btnSpoiler) {
            if (State.filters.spoilerFree) {
                btnSpoiler.className = "shrink-0 font-tech font-bold px-3 py-1 text-xs uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 bg-amber-500/20 border-amber-500/50 text-amber-300";
                btnSpoiler.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Sin Spoilers: ON';
            } else {
                btnSpoiler.className = "shrink-0 font-tech font-bold px-3 py-1 text-xs uppercase tracking-wider rounded-lg border transition-all flex items-center gap-1.5 bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white";
                btnSpoiler.innerHTML = '<i class="fa-solid fa-eye"></i> Nivel 7';
            }
        }

        // Botones de Vista (Grid vs Línea Temporal TVA)
        ['grid', 'timeline'].forEach(mode => {
            const btn = document.getElementById(`btn-view-${mode}`);
            if (!btn) return;
            btn.className = (mode === State.filters.viewMode)
                ? "px-2.5 py-1 rounded text-xs font-bold transition-all bg-zinc-800 text-white"
                : "px-2.5 py-1 rounded text-xs font-bold transition-all text-zinc-500 hover:text-zinc-300";
        });
    },

    showToast(title, desc, iconClass, badgeLabel = 'Logro Desbloqueado') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'glass-panel rounded-lg p-4 flex items-center gap-4 w-72 toast-enter border border-amber-500/40';
        toast.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/40">
                <i class="fa-solid ${iconClass} text-lg text-amber-400"></i>
            </div>
            <div>
                <p class="text-[10px] font-tech text-amber-500 font-bold uppercase tracking-widest mb-0.5">${this.escapeHTML(badgeLabel)}</p>
                <p class="text-sm text-white font-bold leading-tight">${this.escapeHTML(title)}</p>
                <p class="text-xs text-zinc-400 mt-1 leading-tight">${this.escapeHTML(desc)}</p>
            </div>
        `;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 4200);
    },

    getFilteredMovies() {
        const q = this.normalizeText(State.filters.query.trim());

        const filtered = marvelDataset.filter(movie => {
            const isWatched = State.data.watched.includes(movie.id);
            const matchStatus = State.filters.status === 'all' ||
                (State.filters.status === 'watched' && isWatched) ||
                (State.filters.status === 'pending' && !isWatched);
            const matchSaga = State.filters.saga === 'all' || movie.saga === State.filters.saga;

            if (!matchStatus || !matchSaga) return false;
            if (!q) return true;

            const searchable = this.normalizeText([
                movie.title,
                movie.phase,
                movie.summary,
                movie.preData,
                movie.keyObject,
                movie.setting,
                movie.type,
                movie.importance,
                movie.releaseDate,
                ...(movie.hiddenDetails || [])
            ].join(' '));

            return searchable.includes(q);
        });

        if (State.filters.sort === 'release') {
            filtered.sort((a, b) => {
                const diff = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
                return diff !== 0 ? diff : a.chronoIndex - b.chronoIndex;
            });
        } else {
            filtered.sort((a, b) => a.chronoIndex - b.chronoIndex);
        }

        State.currentListIds = filtered.map(m => m.id);
        return filtered;
    },

    renderGrid() {
        const container = document.getElementById('movies-container');
        if (!container) return;
        container.innerHTML = '';

        const filtered = this.getFilteredMovies();

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 font-tech">
                    <i class="fa-solid fa-satellite-dish text-5xl mb-4 block opacity-40"></i>
                    <p class="text-xl tracking-wide uppercase font-bold">No se hallaron expedientes.</p>
                    <p class="text-xs text-zinc-500 mt-1">Prueba cambiando tus filtros de búsqueda.</p>
                </div>`;
            return;
        }

        // Agrupar consecutivamente por Arco/Fase (orden cronológico) o Año (orden estreno)
        const groups = [];
        filtered.forEach(movie => {
            const groupKey = State.filters.sort === 'release'
                ? `Estrenos ${movie.releaseDate.slice(0, 4)}`
                : movie.phase;
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.label === groupKey) {
                lastGroup.items.push(movie);
            } else {
                groups.push({ label: groupKey, items: [movie] });
            }
        });

        const fragment = document.createDocumentFragment();

        groups.forEach(group => {
            const releasedInGroup = group.items.filter(m => !Helpers.isUpcoming(m));
            const watchedInGroup = releasedInGroup.filter(m => State.data.watched.includes(m.id));
            const pct = releasedInGroup.length > 0 ? Math.round((watchedInGroup.length / releasedInGroup.length) * 100) : 0;

            const section = document.createElement('div');
            section.className = 'mb-9';

            // Divisor de Arco / Año con barra de progreso
            const header = document.createElement('div');
            header.className = 'flex items-center justify-between gap-4 mb-4 pb-2 border-b border-white/10 font-tech';
            header.innerHTML = `
                <div class="flex items-center gap-2.5 min-w-0">
                    <span class="w-2 h-2 rounded-full bg-marvel shadow-[0_0_10px_var(--color-marvel)] shrink-0"></span>
                    <h3 class="text-sm sm:text-base font-bold uppercase tracking-widest text-zinc-200 truncate">${this.escapeHTML(group.label)}</h3>
                </div>
                <div class="flex items-center gap-2.5 shrink-0">
                    <span class="text-xs font-bold text-zinc-400">${watchedInGroup.length}/${releasedInGroup.length}</span>
                    <div class="w-16 sm:w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div class="h-full bg-marvel transition-all duration-500" style="width:${pct}%"></div>
                    </div>
                </div>
            `;
            section.appendChild(header);

            if (State.filters.viewMode === 'timeline') {
                const timelineWrap = document.createElement('div');
                timelineWrap.className = 'relative pl-6 sm:pl-8 space-y-4 before:content-[""] before:absolute before:left-2 sm:before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-marvel before:via-amber-500/50 before:to-zinc-800';
                group.items.forEach(movie => {
                    timelineWrap.appendChild(this.createMovieCard(movie, true));
                });
                section.appendChild(timelineWrap);
            } else {
                const gridWrap = document.createElement('div');
                gridWrap.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-start';
                group.items.forEach(movie => {
                    gridWrap.appendChild(this.createMovieCard(movie, false));
                });
                section.appendChild(gridWrap);
            }

            fragment.appendChild(section);
        });

        container.appendChild(fragment);
    },

    createMovieCard(movie, isTimeline = false) {
        const isWatched = State.data.watched.includes(movie.id);
        const upcoming = Helpers.isUpcoming(movie);
        const daysLeft = upcoming ? Helpers.daysUntilRelease(movie) : 0;
        const userRating = State.data.ratings[movie.id] || 0;
        const hasNote = Boolean(State.data.notes[movie.id] && State.data.notes[movie.id].trim());
        const epWatched = movie.episodes ? (State.data.episodes[movie.id] || 0) : 0;
        const epPct = movie.episodes ? Math.round((epWatched / movie.episodes) * 100) : 0;
        const isGemMovie = GEMS.some(g => g.id === movie.id);

        const card = document.createElement('article');
        card.id = `card-${movie.id}`;

        const watchBtnHTML = upcoming
            ? `<span data-tip="Estreno: ${Helpers.formatReleaseDate(movie.releaseDate)}" class="tech-tooltip flex items-center justify-center w-9 h-9 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-400 shrink-0 text-xs"><i class="fa-solid fa-lock"></i></span>`
            : `<button type="button" data-tip="${isWatched ? 'Desmarcar' : 'Marcar Vista'}" aria-label="${isWatched ? 'Desmarcar' : 'Marcar Vista'}" onclick="event.stopPropagation(); App.toggleWatched('${movie.id}')" class="tech-tooltip flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all shadow-md hover:scale-105 shrink-0 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-900/90 border-zinc-600 text-zinc-300 hover:border-marvel hover:text-marvel'}">
                    <i class="fa-solid ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
               </button>`;

        const seriesBarHTML = (movie.episodes && !upcoming) ? `
            <div class="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between gap-2 font-tech" onclick="event.stopPropagation()">
                <div class="flex-1">
                    <div class="flex justify-between text-[10px] font-bold uppercase text-zinc-400 mb-1">
                        <span>Episodios</span>
                        <span class="${isWatched ? 'text-emerald-400' : 'text-cyan-400'}">${epWatched} / ${movie.episodes}</span>
                    </div>
                    <div class="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div class="h-full ${isWatched ? 'bg-emerald-500' : 'bg-cyan-400'} transition-all duration-300" style="width:${epPct}%"></div>
                    </div>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                    <button type="button" onclick="App.stepEpisode('${movie.id}', -1)" aria-label="Restar episodio" class="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] flex items-center justify-center border border-zinc-700"><i class="fa-solid fa-minus"></i></button>
                    <button type="button" onclick="App.stepEpisode('${movie.id}', 1)" aria-label="Sumar episodio" class="w-6 h-6 rounded bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 text-[10px] flex items-center justify-center border border-cyan-500/40"><i class="fa-solid fa-plus"></i></button>
                </div>
            </div>
        ` : '';

        const statusIndicators = `
            <div class="flex items-center gap-2 text-[11px] font-tech text-zinc-400">
                ${userRating > 0 ? `<span class="text-amber-400 font-bold flex items-center gap-1"><i class="fa-solid fa-star text-[10px]"></i>${userRating}/5</span>` : ''}
                ${hasNote ? `<span class="text-cyan-400" title="Tiene nota guardada"><i class="fa-solid fa-note-sticky"></i></span>` : ''}
                ${isGemMovie ? `<span class="text-purple-400" title="Contiene Gema del Infinito"><i class="fa-solid fa-gem"></i></span>` : ''}
            </div>
        `;

        if (isTimeline) {
            card.className = `relative group cursor-pointer glass-panel rounded-xl overflow-hidden border transition-all duration-300 ${isWatched ? 'border-emerald-500/40 opacity-80' : 'border-zinc-800 hover:border-zinc-500'}`;
            card.onclick = () => App.openDrawer(movie.id);

            card.innerHTML = `
                <!-- Nodo luminoso de la Línea Temporal TVA -->
                <span class="absolute -left-[25px] sm:-left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 ${isWatched ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_10px_#34d399]' : (upcoming ? 'bg-amber-400 border-amber-200' : 'bg-zinc-900 border-marvel shadow-[0_0_8px_var(--color-marvel)]')}"></span>

                <div class="flex flex-col sm:flex-row">
                    <div class="sm:w-44 shrink-0">
                        ${PosterManager.renderBannerHTML(movie, 'h-24 sm:h-full')}
                    </div>
                    <div class="p-4 flex-1 min-w-0 flex flex-col justify-between">
                        <div class="flex items-start justify-between gap-3">
                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-1.5 mb-1.5 font-tech">
                                    <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${this.getImportanceStyle(movie.importance)}">${this.escapeHTML(movie.importance)}</span>
                                    <span class="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">${this.escapeHTML(movie.type)}</span>
                                    ${upcoming ? `<span class="text-[10px] font-bold uppercase text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded">Estreno en ${daysLeft}d</span>` : ''}
                                </div>
                                <h4 class="font-display text-base font-black text-zinc-100 group-hover:text-marvel transition-colors uppercase leading-tight">${this.escapeHTML(movie.title)}</h4>
                                <p class="text-xs text-zinc-400 line-clamp-2 mt-1">${this.escapeHTML(movie.summary)}</p>
                            </div>
                            ${watchBtnHTML}
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-2 mt-3 text-xs text-zinc-400 font-tech">
                            <div class="flex flex-wrap items-center gap-3">
                                <span><i class="fa-regular fa-clock text-zinc-500 mr-1"></i>${this.escapeHTML(movie.duration)}</span>
                                <span><i class="fa-solid fa-location-crosshairs text-zinc-500 mr-1"></i>${this.escapeHTML(movie.setting)}</span>
                                <span class="text-zinc-500"><i class="fa-regular fa-calendar mr-1"></i>${Helpers.formatReleaseDate(movie.releaseDate)}</span>
                            </div>
                            ${statusIndicators}
                        </div>
                        ${seriesBarHTML}
                    </div>
                </div>
            `;
            return card;
        }

        // Vista Grid
        card.className = `movie-card group cursor-pointer flex flex-col rounded-xl overflow-hidden transition-all duration-300 glass-panel border ${isWatched ? 'border-emerald-500/40 opacity-80' : 'border-zinc-800 hover:border-zinc-500 hover:-translate-y-0.5'}`;
        card.onclick = () => App.openDrawer(movie.id);

        card.innerHTML = `
            <div class="relative">
                ${PosterManager.renderBannerHTML(movie, 'h-28')}
                <div class="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 font-tech z-10">
                    <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border backdrop-blur-md ${this.getImportanceStyle(movie.importance)}">${this.escapeHTML(movie.importance)}</span>
                    ${upcoming ? `<span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border bg-amber-500/25 border-amber-400/50 text-amber-200 backdrop-blur-md">En ${daysLeft} días</span>` : ''}
                </div>
                <div class="absolute top-2.5 right-2.5 z-10">
                    ${watchBtnHTML}
                </div>
            </div>

            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <div class="flex items-center justify-between gap-2 mb-1 font-tech">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                            <i class="fa-solid ${movie.type.includes('Serie') ? 'fa-tv' : 'fa-film'}"></i> ${this.escapeHTML(movie.type)}
                        </span>
                        ${statusIndicators}
                    </div>
                    <h4 class="font-display text-base font-black text-zinc-100 leading-snug group-hover:text-marvel transition-colors uppercase">${this.escapeHTML(movie.title)}</h4>
                    <div class="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 text-xs text-zinc-400 font-tech">
                        <span><i class="fa-regular fa-clock text-zinc-500 mr-1"></i>${this.escapeHTML(movie.duration)}</span>
                        <span><i class="fa-solid fa-location-crosshairs text-zinc-500 mr-1"></i>${this.escapeHTML(movie.setting)}</span>
                    </div>
                </div>
                ${seriesBarHTML}
            </div>
        `;
        return card;
    },

    // =========================================================================
    // DRAWER LATERAL (ESCRITORIO) / BOTTOM SHEET (MÓVIL)
    // =========================================================================
    renderDrawer(movieId) {
        const movie = marvelDataset.find(m => m.id === movieId);
        const body = document.getElementById('drawer-content');
        if (!movie || !body) return;

        const isWatched = State.data.watched.includes(movie.id);
        const upcoming = Helpers.isUpcoming(movie);
        const hideSpoilers = State.filters.spoilerFree && !isWatched;
        const userNote = this.escapeHTML(State.data.notes[movie.id] || '');
        const userRating = State.data.ratings[movie.id] || 0;
        const epWatched = movie.episodes ? (State.data.episodes[movie.id] || 0) : 0;

        const idx = State.currentListIds.indexOf(movie.id);
        const prevId = idx > 0 ? State.currentListIds[idx - 1] : null;
        const nextId = (idx !== -1 && idx < State.currentListIds.length - 1) ? State.currentListIds[idx + 1] : null;

        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            const starClass = i <= userRating
                ? 'fa-solid text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110'
                : 'fa-regular text-zinc-600 hover:text-amber-300';
            starsHTML += `<button type="button" aria-label="${i} estrellas" onclick="App.rateMovie('${movie.id}', ${i})" class="p-1 transition-transform hover:scale-125"><i class="fa-star ${starClass}"></i></button>`;
        }

        const hiddenList = (movie.hiddenDetails || [])
            .map(d => `<li class="flex items-start gap-2"><span class="text-marvel font-bold">›</span><span>${this.escapeHTML(d)}</span></li>`)
            .join('');

        const spoilerWrap = (innerHtml, label = 'Clasificado Nivel 7 — Toca para revelar') => {
            if (!hideSpoilers) return innerHtml;
            return `
                <div class="relative rounded-lg overflow-hidden cursor-pointer group" onclick="this.querySelector('.spoiler-blur').classList.remove('blur-md', 'select-none'); this.querySelector('.spoiler-overlay')?.remove();">
                    <div class="spoiler-blur blur-md select-none transition-all duration-300">${innerHtml}</div>
                    <div class="spoiler-overlay absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center p-2 text-center">
                        <span class="font-tech text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-zinc-950/90 border border-amber-500/40 px-3 py-1 rounded-full shadow">
                            <i class="fa-solid fa-eye-slash mr-1.5"></i>${label}
                        </span>
                    </div>
                </div>
            `;
        };

        body.innerHTML = `
            <div class="relative shrink-0">
                ${PosterManager.renderBannerHTML(movie, 'h-40 sm:h-44')}
                <button type="button" onclick="App.closeDrawer()" aria-label="Cerrar expediente" class="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-zinc-300 hover:text-white border border-white/15 flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-xmark text-lg"></i>
                </button>
                <div class="absolute bottom-3 left-5 right-16 z-10">
                    <div class="flex flex-wrap items-center gap-1.5 mb-1 font-tech">
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300">${this.escapeHTML(movie.phase)}</span>
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${this.getImportanceStyle(movie.importance)}">${this.escapeHTML(movie.importance)}</span>
                    </div>
                    <h2 class="font-display text-lg sm:text-xl font-black text-white uppercase leading-tight drop-shadow">${this.escapeHTML(movie.title)}</h2>
                </div>
            </div>

            <div class="p-5 overflow-y-auto flex-1 space-y-5">
                <!-- Metadatos y Botón Principal -->
                <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-800/80 font-tech">
                    <div class="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                        <span><i class="fa-regular fa-clock text-zinc-500 mr-1"></i>${this.escapeHTML(movie.duration)}</span>
                        <span><i class="fa-solid fa-location-crosshairs text-zinc-500 mr-1"></i>${this.escapeHTML(movie.setting)}</span>
                        <span><i class="fa-regular fa-calendar text-zinc-500 mr-1"></i>${Helpers.formatReleaseDate(movie.releaseDate)}</span>
                    </div>
                    ${upcoming ? `
                        <span class="px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
                            <i class="fa-solid fa-hourglass-half mr-1.5"></i>Estreno en ${Helpers.daysUntilRelease(movie)} días
                        </span>
                    ` : `
                        <button type="button" onclick="App.toggleWatched('${movie.id}')" class="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 hover:bg-emerald-500/30' : 'bg-marvel border-marvel text-white hover:brightness-110 shadow-[0_0_15px_var(--color-glow)]'}">
                            <i class="fa-solid ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
                            ${isWatched ? 'Completada' : 'Marcar como Vista'}
                        </button>
                    `}
                </div>

                ${(movie.episodes && !upcoming) ? `
                    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 font-tech">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xs font-bold uppercase tracking-wider text-cyan-400"><i class="fa-solid fa-list-ol mr-1.5"></i>Control de Episodios</span>
                            <span class="text-sm font-bold text-white">${epWatched} / ${movie.episodes} episodios</span>
                        </div>
                        <div class="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-3">
                            <div class="h-full ${isWatched ? 'bg-emerald-500' : 'bg-cyan-400'} transition-all duration-300" style="width:${Math.round((epWatched / movie.episodes) * 100)}%"></div>
                        </div>
                        <div class="flex items-center justify-between gap-2">
                            <div class="flex items-center gap-2">
                                <button type="button" onclick="App.stepEpisode('${movie.id}', -1)" class="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-bold text-zinc-200"><i class="fa-solid fa-minus mr-1"></i>1 Ep</button>
                                <button type="button" onclick="App.stepEpisode('${movie.id}', 1)" class="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/40 text-xs font-bold text-cyan-300"><i class="fa-solid fa-plus mr-1"></i>1 Ep</button>
                            </div>
                            <button type="button" onclick="App.setEpisodes('${movie.id}', ${isWatched ? 0 : movie.episodes})" class="text-[11px] font-bold uppercase text-zinc-400 hover:text-white underline">
                                ${isWatched ? 'Reiniciar' : 'Marcar todos'}
                            </button>
                        </div>
                    </div>
                ` : ''}

                <!-- Línea Temporal -->
                <div class="bg-blue-950/25 border border-blue-500/20 rounded-xl px-4 py-3 text-xs text-blue-200/90 flex items-start gap-2.5 font-tech">
                    <i class="fa-solid fa-timeline text-blue-400 mt-0.5"></i>
                    <p><strong>Ubicación Temporal:</strong> ${this.escapeHTML(movie.timelineReason)}</p>
                </div>

                <!-- Sinopsis -->
                <div>
                    <h4 class="font-tech text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Sinopsis / Expediente</h4>
                    <p class="text-sm text-zinc-200 leading-relaxed">${this.escapeHTML(movie.summary)}</p>
                </div>

                <!-- Nivel 7 (Protegido por Modo Sin Spoilers) -->
                ${spoilerWrap(`
                    <div class="bg-zinc-900/70 rounded-xl p-3.5 border-l-2 border-marvel">
                        <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                            <strong class="text-marvel font-tech uppercase tracking-wide text-[11px] block mb-1"><i class="fa-solid fa-shield-halved mr-1"></i>Informe Nivel 7</strong>
                            ${this.escapeHTML(movie.preData)}
                        </p>
                    </div>
                `)}

                <!-- Post-Créditos y Detalles Ocultos -->
                ${spoilerWrap(`
                    <div class="space-y-4">
                        <div class="bg-zinc-900/70 rounded-xl p-3.5 border border-zinc-800 flex flex-col gap-1.5">
                            <span class="text-xs font-bold font-tech text-zinc-400 uppercase"><i class="fa-solid fa-clapperboard mr-1.5 text-amber-400"></i>Escenas Post-Créditos (${movie.postCredits})</span>
                            <span class="text-xs text-zinc-200">${this.escapeHTML(movie.postCreditDesc)}</span>
                        </div>
                        <div class="bg-zinc-900/50 rounded-xl p-3.5 border border-zinc-800/80">
                            <h4 class="font-tech text-xs font-bold text-purple-400 uppercase tracking-widest mb-2"><i class="fa-solid fa-eye-low-vision mr-1.5"></i>Detalles Ocultos</h4>
                            <ul class="text-xs text-zinc-300 space-y-1.5">${hiddenList}</ul>
                        </div>
                    </div>
                `, 'Post-Créditos y Detalles — Toca para revelar')}

                <!-- Artefacto Clave -->
                <div class="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3 font-tech">
                    <i class="fa-solid fa-cube text-amber-400 text-base"></i>
                    <div class="text-xs">
                        <span class="text-zinc-500 uppercase font-bold block text-[10px]">Reliquia de la Bóveda</span>
                        <span class="text-amber-200 font-bold">${this.escapeHTML(movie.keyObject)}</span>
                    </div>
                </div>

                <!-- Libreta de Campo con Autoguardado -->
                <div class="pt-2 border-t border-zinc-800/80">
                    <div class="flex flex-wrap justify-between items-center gap-2 mb-2 font-tech">
                        <label for="drawer-note-input" class="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-amber-500/80"></i> Libreta de Campo
                            <span id="note-sync-status" class="text-[10px] font-semibold text-zinc-500 normal-case">Autoguardado activo</span>
                        </label>
                        <div id="drawer-stars-container" class="flex items-center text-sm">${starsHTML}</div>
                    </div>
                    <textarea id="drawer-note-input" oninput="App.handleNoteInput('${movie.id}', this.value)" class="w-full bg-black/60 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-marvel/60 transition-colors resize-y min-h-[100px] shadow-inner" placeholder="Escribe tus teorías, citas favoritas o observaciones...">${userNote}</textarea>
                </div>
            </div>

            <!-- Navegación Anterior / Siguiente -->
            <div class="p-3 bg-zinc-950/90 border-t border-zinc-800 flex items-center justify-between gap-2 font-tech shrink-0">
                <button type="button" ${prevId ? `onclick="App.openDrawer('${prevId}')"` : 'disabled'} class="px-3 py-1.5 rounded-lg border text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${prevId ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'}">
                    <i class="fa-solid fa-chevron-left"></i> Anterior
                </button>
                <span class="text-[10px] text-zinc-500 uppercase tracking-widest">${idx !== -1 ? `${idx + 1} / ${State.currentListIds.length}` : ''}</span>
                <button type="button" ${nextId ? `onclick="App.openDrawer('${nextId}')"` : 'disabled'} class="px-3 py-1.5 rounded-lg border text-xs font-bold uppercase flex items-center gap-1.5 transition-colors ${nextId ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:bg-zinc-800' : 'bg-zinc-950 border-zinc-900 text-zinc-700 cursor-not-allowed'}">
                    Siguiente <i class="fa-solid fa-chevron-right"></i>
                </button>
            </div>
        `;
    },

    // =========================================================================
    // BÓVEDA MULTIVERSAL (ARTEFACTOS, LOGROS Y ESTADÍSTICAS + TMDB)
    // =========================================================================
    renderInventory() {
        // Altar de Gemas
        const gemsContainer = document.getElementById('vault-gems-container');
        let countGems = 0;

        if (gemsContainer) {
            gemsContainer.innerHTML = GEMS.map(gem => {
                const hasGem = State.data.watched.includes(gem.id);
                if (hasGem) countGems++;

                return `
                    <div class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${hasGem ? 'bg-zinc-900/90 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-105' : 'bg-black/40 border-zinc-800 opacity-40'}" title="${this.escapeHTML(gem.fullName)}">
                        <div class="relative w-10 h-10 flex items-center justify-center mb-2">
                            <i class="fa-solid fa-gem text-xl ${hasGem ? gem.icon + ' animate-pulse-glow' : 'text-zinc-700'}"></i>
                            ${hasGem ? `<div class="absolute inset-0 rounded-full blur-md opacity-50" style="background:${gem.color}"></div>` : ''}
                        </div>
                        <span class="font-tech text-[10px] font-bold uppercase tracking-wider ${hasGem ? 'text-zinc-200' : 'text-zinc-600'}">${this.escapeHTML(gem.name)}</span>
                        <span class="font-tech text-[8px] ${hasGem ? 'text-amber-400' : 'text-zinc-700'} font-semibold uppercase mt-0.5">${hasGem ? 'ACTIVA' : 'BLOQUEADA'}</span>
                    </div>
                `;
            }).join('');
        }

        const badge = document.getElementById('gem-count-badge');
        if (badge) badge.innerText = `${countGems} / 6 Reunidas`;

        // 1) Artefactos
        const artifactsList = document.getElementById('inventory-list');
        if (artifactsList) {
            const collected = marvelDataset.filter(m => State.data.watched.includes(m.id) && m.keyObject);
            if (collected.length === 0) {
                artifactsList.innerHTML = `
                    <div class="col-span-full text-center py-10 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 text-zinc-500 font-tech">
                        <i class="fa-solid fa-box-open text-3xl mb-2 block opacity-40"></i>
                        <p class="text-sm font-bold uppercase">No has asegurado artefactos aún.</p>
                        <p class="text-xs text-zinc-600 mt-1">Completa expedientes para extraer reliquias multiversales.</p>
                    </div>`;
            } else {
                artifactsList.innerHTML = collected.map(m => {
                    const isGemOwner = GEMS.some(g => g.id === m.id);
                    const rarity = isGemOwner
                        ? { label: 'MULTIVERSAL', style: 'border-purple-500/50 bg-purple-500/10 text-purple-400' }
                        : { label: 'LEGENDARIO', style: 'border-amber-500/50 bg-amber-500/10 text-amber-400' };

                    return `
                        <div onclick="App.toggleInventory(true); App.openDrawer('${m.id}')" class="vault-card cursor-pointer p-4 rounded-xl flex items-start gap-3.5 relative overflow-hidden group">
                            <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-110 transition-transform">
                                <i class="fa-solid ${isGemOwner ? 'fa-gem' : (m.icon || 'fa-cube')} text-lg"></i>
                            </div>
                            <div class="flex-1 min-w-0">
                                <span class="font-tech text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${rarity.style}">${rarity.label}</span>
                                <h4 class="font-tech text-sm font-bold text-white truncate mt-1 group-hover:text-amber-400 transition-colors">${this.escapeHTML(m.keyObject)}</h4>
                                <p class="text-[10px] text-zinc-400 truncate mt-0.5"><i class="fa-solid fa-film text-zinc-600 mr-1"></i>${this.escapeHTML(m.title)}</p>
                            </div>
                        </div>`;
                }).join('');
            }
        }

        // 2) Logros
        const achievementsList = document.getElementById('achievements-list');
        if (achievementsList) {
            achievementsList.innerHTML = ACHIEVEMENTS.map(ach => {
                const isUnlocked = State.data.achievements.includes(ach.id);
                return `
                    <div class="p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${isUnlocked ? 'bg-zinc-900/80 border-amber-500/40 shadow-lg' : 'bg-black/30 border-zinc-800/80 opacity-45'}">
                        <div class="w-12 h-12 rounded-xl ${isUnlocked ? 'bg-amber-500/10 border border-amber-500/40' : 'bg-zinc-800 text-zinc-600'} flex items-center justify-center shrink-0 text-xl">
                            <i class="fa-solid ${ach.icon}"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h4 class="font-tech text-sm font-bold text-white">${this.escapeHTML(ach.title)}</h4>
                                ${isUnlocked ? '<span class="text-[9px] font-tech font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completado</span>' : ''}
                            </div>
                            <p class="text-xs text-zinc-400 leading-tight mt-1">${this.escapeHTML(ach.desc)}</p>
                        </div>
                    </div>`;
            }).join('');
        }

        // 3) Estadísticas y Configuración TMDB
        const statsPanel = document.getElementById('vault-stats-content');
        if (statsPanel) {
            const released = marvelDataset.filter(m => !Helpers.isUpcoming(m));
            const watchedMovies = released.filter(m => m.type === 'Película' && State.data.watched.includes(m.id)).length;
            const totalMovies = released.filter(m => m.type === 'Película').length;
            const watchedSeries = released.filter(m => m.type.includes('Serie') && State.data.watched.includes(m.id)).length;
            const totalSeries = released.filter(m => m.type.includes('Serie')).length;
            const watchedSpecials = released.filter(m => !m.type.includes('Serie') && m.type !== 'Película' && State.data.watched.includes(m.id)).length;
            const totalSpecials = released.filter(m => !m.type.includes('Serie') && m.type !== 'Película').length;

            const totalEpisodesWatched = released.reduce((acc, m) => {
                if (!m.episodes) return acc;
                return acc + (State.data.watched.includes(m.id) ? m.episodes : (State.data.episodes[m.id] || 0));
            }, 0);

            const postCreditsUnlocked = released
                .filter(m => State.data.watched.includes(m.id))
                .reduce((acc, m) => acc + (m.postCredits || 0), 0);

            const calcAvg = (sagaFilter) => {
                const rated = marvelDataset.filter(m => (sagaFilter === 'all' || m.saga === sagaFilter) && State.data.ratings[m.id] > 0);
                if (rated.length === 0) return '—';
                const sum = rated.reduce((acc, m) => acc + State.data.ratings[m.id], 0);
                return `${(sum / rated.length).toFixed(1)} ★`;
            };

            const topRated = marvelDataset
                .filter(m => State.data.ratings[m.id] > 0)
                .sort((a, b) => (State.data.ratings[b.id] - State.data.ratings[a.id]) || (a.chronoIndex - b.chronoIndex))
                .slice(0, 5);

            const barRow = (label, done, total, color) => {
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                return `
                    <div>
                        <div class="flex justify-between text-xs font-tech mb-1">
                            <span class="text-zinc-300 font-bold uppercase">${label}</span>
                            <span class="text-zinc-400">${done}/${total} (${pct}%)</span>
                        </div>
                        <div class="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div class="h-full ${color} transition-all duration-500" style="width:${pct}%"></div>
                        </div>
                    </div>
                `;
            };

            statsPanel.innerHTML = `
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech">
                    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
                        <p class="text-[10px] uppercase text-zinc-500 font-bold">Promedio Global</p>
                        <p class="text-xl font-black text-amber-400 mt-1">${calcAvg('all')}</p>
                    </div>
                    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
                        <p class="text-[10px] uppercase text-zinc-500 font-bold">Saga Infinito</p>
                        <p class="text-xl font-black text-purple-400 mt-1">${calcAvg('Infinito')}</p>
                    </div>
                    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
                        <p class="text-[10px] uppercase text-zinc-500 font-bold">Episodios Vistos</p>
                        <p class="text-xl font-black text-cyan-400 mt-1">${totalEpisodesWatched}</p>
                    </div>
                    <div class="bg-zinc-900/80 border border-zinc-800 rounded-xl p-3.5 text-center">
                        <p class="text-[10px] uppercase text-zinc-500 font-bold">Post-Créditos</p>
                        <p class="text-xl font-black text-emerald-400 mt-1">${postCreditsUnlocked}</p>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-3">
                        <h4 class="font-tech text-xs font-bold uppercase tracking-widest text-zinc-400">Desglose por Formato</h4>
                        ${barRow('Películas', watchedMovies, totalMovies, 'bg-marvel')}
                        ${barRow('Series', watchedSeries, totalSeries, 'bg-cyan-400')}
                        ${barRow('Cortos y Especiales', watchedSpecials, totalSpecials, 'bg-amber-400')}
                    </div>

                    <div class="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4">
                        <h4 class="font-tech text-xs font-bold uppercase tracking-widest text-zinc-400 mb-3">Tu Top 5 Mejor Calificado</h4>
                        ${topRated.length === 0
                            ? '<p class="text-xs text-zinc-500 font-tech">Califica expedientes con estrellas para construir tu ranking personal.</p>'
                            : `<ul class="space-y-2 font-tech">${topRated.map((m, i) => `
                                <li onclick="App.toggleInventory(true); App.openDrawer('${m.id}')" class="cursor-pointer flex items-center justify-between gap-2 text-xs bg-black/40 hover:bg-black/70 px-3 py-2 rounded-lg border border-zinc-800/80 transition-colors">
                                    <span class="truncate text-zinc-200 font-bold"><span class="text-amber-500 mr-2">#${i + 1}</span>${this.escapeHTML(m.title)}</span>
                                    <span class="text-amber-400 font-bold shrink-0">${'★'.repeat(State.data.ratings[m.id])}</span>
                                </li>
                            `).join('')}</ul>`
                        }
                    </div>
                </div>

                <!-- Configuración Pósters TMDB -->
                <div class="bg-zinc-900/80 border border-cyan-500/25 rounded-xl p-4 font-tech">
                    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 class="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                            <i class="fa-solid fa-image"></i> Pósters Automáticos (API Gratuita TMDB)
                        </h4>
                        <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${PosterManager.getApiKey() ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-zinc-800 text-zinc-400'}">
                            ${PosterManager.getApiKey() ? 'TMDB Activo' : 'Modo SVG Offline'}
                        </span>
                    </div>
                    <p class="text-xs text-zinc-400 mb-3">Pega tu API Key (v3) de themoviedb.org para cargar pósters reales automáticamente y guardarlos en caché local. Si lo dejas vacío, se usa el diseño holográfico SVG.</p>
                    <div class="flex flex-col sm:flex-row gap-2">
                        <input type="password" id="tmdb-key-input" value="${this.escapeHTML(State.tmdbKey)}" placeholder="Pega tu API Key de TMDB aquí..." class="flex-1 bg-black/60 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400">
                        <button type="button" onclick="App.saveTmdbKey()" class="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs uppercase transition-colors">Guardar Clave</button>
                        <button type="button" onclick="App.clearPosterCache()" class="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 font-bold text-xs uppercase transition-colors">Recargar Caché</button>
                    </div>
                </div>
            `;
        }
    }
};

// =============================================================================
// CONTROLADOR PRINCIPAL (APP)
// =============================================================================
const App = {
    konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    konamiIndex: 0,

    init() {
        State.init();
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) sortSelect.value = State.filters.sort;

        this.applyTheme(State.filters.saga);
        UI.updateControlsUI();
        UI.updateStats();
        UI.renderGrid();
        this.initKeyboardShortcuts();
    },

    applyTheme(saga) {
        if (State.konamiActive) return;
        const root = document.documentElement;
        root.style.setProperty('--bg-color', '#030308');
        if (saga === 'Infinito') {
            root.style.setProperty('--color-marvel', '#a855f7');
            root.style.setProperty('--color-glow', 'rgba(168, 85, 247, 0.25)');
        } else if (saga === 'Multiverso') {
            root.style.setProperty('--color-marvel', '#10b981');
            root.style.setProperty('--color-glow', 'rgba(16, 185, 129, 0.25)');
        } else {
            root.style.setProperty('--color-marvel', '#e11d48');
            root.style.setProperty('--color-glow', 'rgba(225, 29, 72, 0.25)');
        }
    },

    setSaga(saga) {
        State.filters.saga = saga;
        this.applyTheme(saga);
        UI.updateControlsUI();
        UI.updateStats();
        UI.renderGrid();
    },

    setStatus(status) {
        State.filters.status = status;
        UI.updateControlsUI();
        UI.renderGrid();
    },

    setSortOrder(order) {
        State.filters.sort = order;
        Storage.save('sort', order);
        UI.updateStats();
        UI.renderGrid();
    },

    setSearchQuery(query) {
        State.filters.query = query;
        UI.renderGrid();
    },

    toggleSpoilerMode() {
        State.filters.spoilerFree = !State.filters.spoilerFree;
        Storage.save('spoilerFree', State.filters.spoilerFree);
        UI.updateControlsUI();
        if (State.activeDrawerId) UI.renderDrawer(State.activeDrawerId);
        UI.showToast(
            State.filters.spoilerFree ? 'Modo Sin Spoilers Activado' : 'Acceso Nivel 7 Restaurado',
            State.filters.spoilerFree ? 'Detalles y post-créditos no vistos quedarán ocultos.' : 'Todos los expedientes visibles sin censura.',
            State.filters.spoilerFree ? 'fa-eye-slash text-amber-400' : 'fa-eye text-cyan-400',
            'Protocolo Visual'
        );
    },

    setViewMode(mode) {
        State.filters.viewMode = mode;
        Storage.save('viewMode', mode);
        UI.updateControlsUI();
        UI.renderGrid();
    },

    setHoursPerDay(hours) {
        State.filters.hoursPerDay = hours;
        Storage.save('hoursPerDay', hours);
        UI.updateStats();
    },

    setVaultTab(tab) {
        State.vaultTab = tab;
        const tabs = ['artifacts', 'achievements', 'stats'];
        tabs.forEach(t => {
            const btn = document.getElementById(`vault-tab-${t}`);
            const sec = document.getElementById(`vault-section-${t}`);
            if (btn) {
                btn.className = (t === tab)
                    ? "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all bg-amber-500 text-black shadow-md"
                    : "px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all text-zinc-400 hover:text-white";
            }
            if (sec) sec.classList.toggle('hidden', t !== tab);
        });
    },

    toggleWatched(id) {
        const movie = marvelDataset.find(m => m.id === id);
        if (!movie || Helpers.isUpcoming(movie)) return;

        const index = State.data.watched.indexOf(id);
        let nowWatched = false;

        if (index === -1) {
            State.data.watched.push(id);
            nowWatched = true;
            if (movie.episodes) State.data.episodes[id] = movie.episodes;
        } else {
            State.data.watched.splice(index, 1);
            if (movie.episodes && State.data.episodes[id] === movie.episodes) {
                State.data.episodes[id] = 0;
            }
        }

        Storage.save('watched', State.data.watched);
        Storage.save('episodes', State.data.episodes);

        if (navigator.vibrate) navigator.vibrate(40);

        if (nowWatched) {
            const gem = GEMS.find(g => g.id === id);
            if (gem) {
                UI.showToast(gem.fullName, 'Singularidad cósmica asegurada en la Bóveda.', `fa-gem ${gem.icon}`, 'Gema Obtenida');
            }
        }

        this.checkAchievements();
        UI.updateStats();
        UI.renderGrid();
        if (State.activeDrawerId === id) UI.renderDrawer(id);
    },

    stepEpisode(id, delta) {
        const movie = marvelDataset.find(m => m.id === id);
        if (!movie || !movie.episodes || Helpers.isUpcoming(movie)) return;
        const current = State.data.episodes[id] || 0;
        this.setEpisodes(id, current + delta);
    },

    setEpisodes(id, count) {
        const movie = marvelDataset.find(m => m.id === id);
        if (!movie || !movie.episodes || Helpers.isUpcoming(movie)) return;

        const clamped = Math.max(0, Math.min(movie.episodes, count));
        State.data.episodes[id] = clamped;

        const isCurrentlyWatched = State.data.watched.includes(id);
        if (clamped === movie.episodes && !isCurrentlyWatched) {
            State.data.watched.push(id);
        } else if (clamped < movie.episodes && isCurrentlyWatched) {
            State.data.watched = State.data.watched.filter(w => w !== id);
        }

        Storage.save('episodes', State.data.episodes);
        Storage.save('watched', State.data.watched);

        if (navigator.vibrate) navigator.vibrate(25);
        this.checkAchievements();
        UI.updateStats();
        UI.renderGrid();
        if (State.activeDrawerId === id) UI.renderDrawer(id);
    },

    checkAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            if (!State.data.achievements.includes(ach.id) && ach.check(State.data)) {
                State.data.achievements.push(ach.id);
                Storage.save('achievements', State.data.achievements);
                if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
                UI.showToast(ach.title, ach.desc, ach.icon);
            }
        });
    },

    rateMovie(id, rating) {
        State.data.ratings[id] = rating;
        Storage.save('ratings', State.data.ratings);
        this.checkAchievements();
        UI.renderGrid();
        if (State.activeDrawerId === id) UI.renderDrawer(id);
    },

    handleNoteInput(id, rawValue) {
        const statusEl = document.getElementById('note-sync-status');
        if (statusEl) {
            statusEl.textContent = 'Escribiendo...';
            statusEl.className = 'text-[10px] font-semibold text-amber-400 normal-case';
        }

        clearTimeout(UI.noteDebounceTimer);
        UI.noteDebounceTimer = setTimeout(() => {
            const trimmed = rawValue.trim();
            if (trimmed === '') delete State.data.notes[id];
            else State.data.notes[id] = trimmed;
            Storage.save('notes', State.data.notes);
            this.checkAchievements();
            UI.renderGrid();

            const syncEl = document.getElementById('note-sync-status');
            if (syncEl) {
                syncEl.textContent = 'Sincronizado ✓';
                syncEl.className = 'text-[10px] font-semibold text-emerald-400 normal-case';
            }
        }, 450);
    },

    openDrawer(id) {
        const overlay = document.getElementById('detail-drawer-overlay');
        const panel = document.getElementById('detail-drawer-panel');
        if (!overlay || !panel) return;

        State.activeDrawerId = id;
        UI.renderDrawer(id);
        overlay.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');

        requestAnimationFrame(() => {
            panel.classList.remove('translate-y-full', 'sm:translate-x-full');
        });
    },

    closeDrawer() {
        const overlay = document.getElementById('detail-drawer-overlay');
        const panel = document.getElementById('detail-drawer-panel');
        if (!overlay || !panel || overlay.classList.contains('hidden')) return;

        panel.classList.add('translate-y-full', 'sm:translate-x-full');
        setTimeout(() => {
            overlay.classList.add('hidden');
            State.activeDrawerId = null;
            document.body.classList.remove('overflow-hidden');
        }, 250);
    },

    toggleInventory(forceClose = false) {
        const modal = document.getElementById('inventory-modal');
        if (!modal) return;

        if (forceClose) {
            modal.classList.add('hidden');
            return;
        }

        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) {
            this.setVaultTab(State.vaultTab || 'artifacts');
            UI.renderInventory();
        }
    },

    saveTmdbKey() {
        const input = document.getElementById('tmdb-key-input');
        if (!input) return;
        State.tmdbKey = input.value.trim();
        Storage.save('tmdbKey', State.tmdbKey);

        // Limpia resultados 'none' previos para reintentar con la nueva clave
        Object.keys(State.posterCache).forEach(k => {
            if (State.posterCache[k] === 'none') delete State.posterCache[k];
        });
        Storage.save('posterCache', State.posterCache);

        UI.renderInventory();
        UI.renderGrid();
        UI.showToast(
            State.tmdbKey ? 'TMDB Conectado' : 'Modo SVG Offline',
            State.tmdbKey ? 'Cargando pósters oficiales en segundo plano...' : 'Se restauró el modo holográfico 100% offline.',
            'fa-image text-cyan-400',
            'Pósters'
        );
    },

    clearPosterCache() {
        State.posterCache = {};
        Storage.save('posterCache', {});
        UI.renderGrid();
        UI.showToast('Caché de Pósters Limpia', 'Los pósters se actualizarán al mostrarse.', 'fa-arrows-rotate text-amber-400', 'Pósters');
    },

    exportData() {
        const payload = {
            version: 2,
            exportedAt: new Date().toISOString(),
            data: State.data,
            preferences: {
                sort: State.filters.sort,
                spoilerFree: State.filters.spoilerFree,
                viewMode: State.filters.viewMode,
                hoursPerDay: State.filters.hoursPerDay
            }
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `marvel-archivo-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        UI.showToast('Respaldo Exportado', 'Tu progreso se descargó en formato JSON.', 'fa-download text-emerald-400', 'Bóveda Segura');
    },

    triggerImport() {
        const input = document.getElementById('import-file-input');
        if (input) input.click();
    },

    importData(event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                const imported = parsed.data || parsed;
                if (!Array.isArray(imported.watched)) throw new Error('Formato inválido');

                const validIds = new Set(marvelDataset.map(m => m.id));
                State.data.watched = imported.watched.filter(id => validIds.has(id) || id === 'loki-s1-2');
                State.data.episodes = (imported.episodes && typeof imported.episodes === 'object' && !Array.isArray(imported.episodes)) ? imported.episodes : {};
                State.data.notes = (imported.notes && typeof imported.notes === 'object' && !Array.isArray(imported.notes)) ? imported.notes : {};
                State.data.ratings = (imported.ratings && typeof imported.ratings === 'object' && !Array.isArray(imported.ratings)) ? imported.ratings : {};
                State.data.achievements = Array.isArray(imported.achievements) ? imported.achievements : [];

                State.migrateLegacyData();

                const prefs = parsed.preferences || {};
                const sortVal = prefs.sort || parsed.sort;
                if (sortVal === 'release' || sortVal === 'narrative') {
                    State.filters.sort = sortVal;
                    Storage.save('sort', sortVal);
                    const sortSelect = document.getElementById('sort-select');
                    if (sortSelect) sortSelect.value = sortVal;
                }

                Storage.save('watched', State.data.watched);
                Storage.save('episodes', State.data.episodes);
                Storage.save('notes', State.data.notes);
                Storage.save('ratings', State.data.ratings);
                Storage.save('achievements', State.data.achievements);

                this.checkAchievements();
                UI.updateControlsUI();
                UI.updateStats();
                UI.renderGrid();
                UI.renderInventory();
                UI.showToast('Respaldo Restaurado', `Se cargaron ${State.data.watched.length} expedientes vistos.`, 'fa-upload text-emerald-400', 'Bóveda Segura');
            } catch (err) {
                UI.showToast('Error al Importar', 'El archivo JSON no es un respaldo válido.', 'fa-triangle-exclamation text-red-400', 'Alerta S.H.I.E.L.D.');
            } finally {
                event.target.value = '';
            }
        };
        reader.readAsText(file);
    },

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeDrawer();
                this.toggleInventory(true);
                return;
            }

            const tag = document.activeElement ? document.activeElement.tagName : '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === this.konamiSequence[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiSequence.length) {
                    this.konamiIndex = 0;
                    State.konamiActive = !State.konamiActive;
                    if (State.konamiActive) {
                        UI.showToast('Protocolo Cuarta Pared', 'Chimichangas. Modo Deadpool activado (repítelo para salir).', 'fa-mask text-marvel', 'Easter Egg');
                        document.documentElement.style.setProperty('--bg-color', '#2d0000');
                        document.documentElement.style.setProperty('--color-marvel', '#e11d48');
                        document.documentElement.style.setProperty('--color-glow', 'rgba(225, 29, 72, 0.35)');
                    } else {
                        this.applyTheme(State.filters.saga);
                        UI.showToast('Protocolo Desactivado', 'Volviendo a la Línea Temporal Sagrada.', 'fa-rotate-left text-cyan-400', 'Sistema');
                    }
                }
            } else {
                this.konamiIndex = 0;
            }
        });
    }
};

// =============================================================================
// MOTORES DE FONDO OPTIMIZADOS (SIN SHADOWBLUR, PAUSA EN SEGUNDO PLANO)
// =============================================================================
const GalaxyBackground = {
    rafId: null,
    init() {
        const canvas = document.getElementById('galaxy-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const colors = ['#ffffff', '#cbd5e1', '#e11d48', '#38bdf8', '#a855f7'];
        let stars = [];

        const buildStars = () => {
            const num = window.innerWidth < 768 ? 65 : 110;
            stars = [];
            for (let i = 0; i < num; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 1.4 + 0.5,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: Math.random() * 0.6 + 0.2,
                    speed: Math.random() * 0.12 + 0.04,
                    twinkle: Math.random() * 0.015 + 0.004
                });
            }
        };

        const draw = (step = true) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < stars.length; i++) {
                const s = stars[i];
                if (step) {
                    s.y -= s.speed;
                    if (s.y < 0) s.y = canvas.height;
                    s.alpha += s.twinkle;
                    if (s.alpha > 0.9 || s.alpha < 0.2) s.twinkle = -s.twinkle;
                }
                ctx.globalAlpha = s.alpha;
                ctx.fillStyle = s.color;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            buildStars();
            if (prefersReduced) draw(false);
        };

        const animate = () => {
            if (document.hidden) { this.rafId = null; return; }
            draw(true);
            this.rafId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        resize();
        if (!prefersReduced) {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && !this.rafId) animate();
            });
            animate();
        }
    }
};

const QuantumField = {
    rafId: null,
    init() {
        const canvas = document.getElementById('foreground-3d-canvas');
        if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const ctx = canvas.getContext('2d');
        const colors = ['#e11d48', '#38bdf8', '#f59e0b', '#a855f7', '#ffffff'];

        let particles = [];
        let centerX = window.innerWidth / 2;
        let centerY = window.innerHeight / 2;
        let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;

        const reset = (p) => {
            p.x = (Math.random() - 0.5) * canvas.width * 2.5;
            p.y = (Math.random() - 0.5) * canvas.height * 2.5;
            p.z = Math.random() * 1000 + 120;
            p.pz = p.z;
            p.color = colors[Math.floor(Math.random() * colors.length)];
            p.speedZ = Math.random() * 2.2 + 0.7;
        };

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
            const count = window.innerWidth < 768 ? 45 : 95;
            particles = [];
            for (let i = 0; i < count; i++) {
                const p = {};
                reset(p);
                particles.push(p);
            }
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - centerX) * 0.22;
            targetY = (e.clientY - centerY) * 0.22;
        }, { passive: true });

        resize();
        const fov = 350;

        const animate = () => {
            if (document.hidden) { this.rafId = null; return; }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            mouseX += (targetX - mouseX) * 0.08;
            mouseY += (targetY - mouseY) * 0.08;
            ctx.lineCap = 'round';

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.pz = p.z;
                p.z -= p.speedZ + (1000 - p.z) * 0.02;
                if (p.z < 1) { reset(p); continue; }

                const s = fov / p.z;
                const ps = fov / p.pz;
                const depth = 1 - (p.z / 1000);

                ctx.globalAlpha = Math.max(0.06, depth * 0.65);
                ctx.strokeStyle = p.color;
                ctx.lineWidth = Math.max(0.8, depth * 3.5);
                ctx.beginPath();
                ctx.moveTo((p.x + mouseX) * ps + centerX, (p.y + mouseY) * ps + centerY);
                ctx.lineTo((p.x + mouseX) * s + centerX, (p.y + mouseY) * s + centerY);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            this.rafId = requestAnimationFrame(animate);
        };

        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && !this.rafId) animate();
        });
        animate();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
    GalaxyBackground.init();
    QuantumField.init();
});
