// --- CONFIGURACIÓN DE GEMAS Y LOGROS ---
const GEMS = [
    { id: 'cap-america-1', name: 'Espacio', color: '#3b82f6', icon: 'text-blue-500', glow: 'rgba(59, 130, 246, 0.5)' },
    { id: 'avengers-1', name: 'Mente', color: '#facc15', icon: 'text-yellow-400', glow: 'rgba(250, 204, 21, 0.5)' },
    { id: 'thor-2', name: 'Realidad', color: '#ef4444', icon: 'text-red-500', glow: 'rgba(239, 68, 68, 0.5)' },
    { id: 'gotg-1', name: 'Poder', color: '#a855f7', icon: 'text-purple-500', glow: 'rgba(168, 85, 247, 0.5)' },
    { id: 'dr-strange', name: 'Tiempo', color: '#10b981', icon: 'text-emerald-500', glow: 'rgba(16, 185, 129, 0.5)' },
    { id: 'infinity-war', name: 'Alma', color: '#f97316', icon: 'text-orange-500', glow: 'rgba(249, 115, 22, 0.5)' }
];

const ACHIEVEMENTS = [
    { id: 'fase-1', title: 'Iniciativa Vengador', desc: 'Completaste la Fase 1 original.', icon: 'fa-shield-halved text-blue-400', check: (watched) => ['cap-america-1', 'iron-man-1', 'iron-man-2', 'thor-1', 'hulk-1', 'avengers-1'].every(id => watched.includes(id)) },
    { id: 'spider-verse', title: 'Nostalgia Pura', desc: 'Viste todas las películas del legado de Spider-Man.', icon: 'fa-spider text-red-500', check: (watched) => ['spider-man-1', 'spider-man-2', 'spider-man-3', 'tasm-1', 'tasm-2'].every(id => watched.includes(id)) },
    { id: 'defensores', title: 'Nivel Callejero', desc: 'Revisaste los expedientes de Hell\'s Kitchen.', icon: 'fa-hands-bound text-purple-400', check: (watched) => ['daredevil-s1', 'defenders', 'daredevil-s3'].every(id => watched.includes(id)) },
    { id: 'thanos', title: 'Inevitable', desc: 'Sobreviviste a la Saga del Infinito.', icon: 'fa-hand-fist text-amber-500', check: (watched) => watched.includes('endgame') }
];

// --- ESTADO Y ALMACENAMIENTO ---
const Storage = {
    keys: { watched: 'ucm_watched', notes: 'ucm_notes', ratings: 'ucm_ratings', sort: 'ucm_sort', achievements: 'ucm_badges' },
    save(key, data) { localStorage.setItem(this.keys[key], JSON.stringify(data)); },
    load(key, fallback) { 
        const data = localStorage.getItem(this.keys[key]);
        return data ? JSON.parse(data) : fallback;
    }
};

const State = {
    filters: { status: 'all', saga: 'all', sort: 'narrative', query: '' },
    vaultTab: 'artifacts',
    data: { watched: [], notes: {}, ratings: {}, achievements: [] },
    init() {
        this.data.watched = Storage.load('watched', []);
        this.data.notes = Storage.load('notes', {});
        this.data.ratings = Storage.load('ratings', {});
        this.data.achievements = Storage.load('achievements', []);
        this.filters.sort = Storage.load('sort', 'narrative');
        if (typeof this.filters.sort !== 'string') this.filters.sort = 'narrative'; 
    }
};

// --- INTERFAZ Y RENDERIZADO (UI) ---
const UI = {
    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag]));
    },

    updateStats() {
        const currentSagaMovies = marvelDataset.filter(m => State.filters.saga === 'all' || m.saga === State.filters.saga);
        const totalInSaga = currentSagaMovies.length;
        const watchedInSaga = currentSagaMovies.filter(m => State.data.watched.includes(m.id));
        
        const percentage = totalInSaga > 0 ? Math.round((watchedInSaga.length / totalInSaga) * 100) : 0;
        
        document.getElementById('progress-stats').innerText = `${watchedInSaga.length}/${totalInSaga} (${percentage}%)`;
        
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) progressBar.style.width = `${percentage}%`;
        
        let totalMins = watchedInSaga.reduce((acc, movie) => {
            if (movie.type.includes('Serie')) return acc + ((parseInt(movie.duration) || 0) * 45); 
            const h = movie.duration.match(/(\d+)h/) ? parseInt(movie.duration.match(/(\d+)h/)[1], 10) : 0;
            const m = movie.duration.match(/(\d+)m/) ? parseInt(movie.duration.match(/(\d+)m/)[1], 10) : 0;
            return acc + (h * 60) + m;
        }, 0);
        
        document.getElementById('time-stats').innerText = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
        this.renderGemsHeader();
    },

    renderGemsHeader() {
        const desktopTracker = document.getElementById('gem-tracker');
        const html = GEMS.map(gem => {
            const hasGem = State.data.watched.includes(gem.id);
            const classes = hasGem 
                ? `${gem.icon} drop-shadow-[0_0_12px_currentColor] scale-125 animate-float animate-pulse-glow` 
                : 'text-zinc-800 opacity-30 drop-shadow-none scale-100';
            
            return `
                <div class="relative group flex items-center justify-center w-8 h-8 rounded-full ${hasGem ? 'bg-white/5 border border-white/10' : ''} transition-all duration-500">
                    <i class="fa-solid fa-gem transition-all duration-500 ${classes}" title="Gema del ${gem.name}"></i>
                </div>
            `;
        }).join('');

        if (desktopTracker) desktopTracker.innerHTML = html;
    },

    updateNavigationTabs() {
        ['all', 'Infinito', 'Multiverso'].forEach(s => {
            const btn = document.getElementById(`tab-saga-${s}`);
            if (!btn) return;
            btn.className = (s === State.filters.saga) 
                ? "snap-start shrink-0 font-tech font-bold px-5 py-1 text-sm uppercase tracking-wider rounded-full transition-all bg-marvel text-white border-marvel shadow-[0_0_15px_var(--color-glow)]"
                : "snap-start shrink-0 font-tech font-bold px-5 py-1 text-sm uppercase tracking-wider rounded-full transition-all bg-zinc-900/40 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800/80";
        });

        ['all', 'pending', 'watched'].forEach(s => {
            const btn = document.getElementById(`btn-status-${s}`);
            if (!btn) return;
            btn.className = (s === State.filters.status)
                ? "shrink-0 font-tech font-bold px-3 py-0.5 text-xs tracking-wide rounded transition-all bg-zinc-800 text-white shadow-sm"
                : "shrink-0 font-tech font-bold px-3 py-0.5 text-xs tracking-wide rounded transition-all text-zinc-500 hover:text-zinc-300 bg-transparent";
        });
    },

    updateCardTargeted(id) {
        const isWatched = State.data.watched.includes(id);
        const card = document.getElementById(`card-${id}`);
        const btnWatch = document.getElementById(`btn-watch-${id}`);
        const iconWatch = document.getElementById(`icon-watch-${id}`);
        
        if(!card) return;

        if(isWatched) {
            card.style.order = '1'; 
            card.classList.add('border-emerald-500/40', 'opacity-70', 'scale-[0.99]'); 
            card.classList.remove('border-zinc-800');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-emerald-500/20 border-emerald-500 text-emerald-400";
            iconWatch.className = "fa-solid fa-check";
        } else {
            card.style.order = '0'; 
            card.classList.remove('border-emerald-500/40', 'opacity-70', 'scale-[0.99]');
            card.classList.add('border-zinc-800');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-zinc-800/80 border-zinc-600 text-zinc-400 hover:border-marvel hover:text-marvel";
            iconWatch.className = "fa-solid fa-power-off";
        }
    },

    updateStarsTargeted(id, userRating) {
        const container = document.getElementById(`stars-container-${id}`);
        if (!container) return;
        
        let starsHTML = '';
        for(let i=1; i<=5; i++) {
            const starClass = i <= userRating 
                ? 'fa-solid text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110' 
                : 'fa-regular text-zinc-600 hover:scale-110';
            
            starsHTML += `<i data-tip="${i} Estrella${i>1?'s':''}" class="tech-tooltip fa-star ${starClass} cursor-pointer transition-all duration-300" onclick="event.stopPropagation(); App.rateMovie('${id}', ${i})"></i>`;
        }
        container.innerHTML = starsHTML;
    },

    showToast(title, desc, iconClass) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'glass-panel rounded-lg p-4 flex items-center gap-4 w-72 toast-enter border-amber-500/40';
        toast.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/40">
                <i class="fa-solid ${iconClass} text-lg text-amber-400"></i>
            </div>
            <div>
                <p class="text-[10px] font-tech text-amber-500 font-bold uppercase tracking-widest mb-0.5">Logro Desbloqueado</p>
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
        }, 4000);
    },

    renderGrid() {
        const container = document.getElementById('movies-container');
        container.innerHTML = '';

        const q = State.filters.query.toLowerCase().trim();

        let filtered = marvelDataset.filter(movie => {
            const isWatched = State.data.watched.includes(movie.id);
            const matchStatus = State.filters.status === 'all' || 
                               (State.filters.status === 'watched' && isWatched) || 
                               (State.filters.status === 'pending' && !isWatched);
            const matchSaga = State.filters.saga === 'all' || movie.saga === State.filters.saga;
            
            const matchQuery = !q || 
                movie.title.toLowerCase().includes(q) || 
                movie.phase.toLowerCase().includes(q) || 
                movie.summary.toLowerCase().includes(q);

            return matchStatus && matchSaga && matchQuery;
        });

        if (State.filters.sort === 'release') filtered.sort((a, b) => a.releaseIndex - b.releaseIndex);
        else filtered.sort((a, b) => a.chronoIndex - b.chronoIndex);

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20 font-tech">
                    <i class="fa-solid fa-satellite-dish text-5xl mb-4 block opacity-40"></i>
                    <p class="text-xl tracking-wide uppercase font-bold">No se hallaron expedientes.</p>
                    <p class="text-xs text-zinc-500 mt-1">Prueba cambiando tus filtros de búsqueda.</p>
                </div>`;
            return;
        }

        filtered.forEach(movie => {
            const card = this.createMovieCard(movie);
            container.appendChild(card);
        });
    },

    createMovieCard(movie) {
        const isWatched = State.data.watched.includes(movie.id);
        const userNote = this.escapeHTML(State.data.notes[movie.id] || '');
        const userRating = State.data.ratings[movie.id] || 0;
        const hiddenList = movie.hiddenDetails.map(detail => `<li class="flex items-start"><span class="text-marvel mr-2">-</span> <span>${this.escapeHTML(detail)}</span></li>`).join('');
        
        let starsHTML = '';
        for(let i=1; i<=5; i++) {
            const starClass = i <= userRating 
                ? 'fa-solid text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-110' 
                : 'fa-regular text-zinc-600 hover:scale-110';
            starsHTML += `<i data-tip="${i} Estrella${i>1?'s':''}" class="tech-tooltip fa-star ${starClass} cursor-pointer transition-all duration-300" onclick="event.stopPropagation(); App.rateMovie('${movie.id}', ${i})"></i>`;
        }

        const card = document.createElement('div');
        card.id = `card-${movie.id}`;
        card.style.order = isWatched ? '1' : '0';
        card.className = `movie-card flex flex-col rounded-xl overflow-hidden transition-all duration-300 glass-panel ${isWatched ? 'border-emerald-500/40 opacity-70 scale-[0.99]' : 'border-zinc-800 hover:border-zinc-600'}`;
        
        card.innerHTML = `
            <div class="p-5 cursor-pointer hover:bg-white/5 transition-colors flex flex-col gap-3 relative group" onclick="App.toggleDetails('${movie.id}')">
                <div class="flex justify-between items-start w-full font-tech">
                    <div class="flex flex-wrap gap-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded shadow-sm">${this.escapeHTML(movie.phase)}</span>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded flex items-center shadow-sm">
                            <i class="fa-solid ${movie.type.includes('Serie') ? 'fa-tv' : 'fa-film'} mr-1.5"></i>${this.escapeHTML(movie.type)}
                        </span>
                    </div>
                    <button data-tip="${isWatched ? 'Desmarcar' : 'Marcar Vista'}" id="btn-watch-${movie.id}" onclick="event.stopPropagation(); App.toggleWatched('${movie.id}')" class="tech-tooltip flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all shadow-md hover:scale-105 shrink-0 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800/80 border-zinc-600 text-zinc-400 hover:border-marvel hover:text-marvel'}">
                        <i id="icon-watch-${movie.id}" class="fa-solid ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
                    </button>
                </div>
                
                <div class="mt-1">
                    <h3 class="font-display text-lg font-black text-zinc-100 leading-tight group-hover:text-marvel transition-colors duration-300 uppercase">${this.escapeHTML(movie.title)}</h3>
                    <div class="flex items-center gap-4 mt-3 text-xs text-zinc-400 font-medium font-tech">
                        <span class="flex items-center"><i class="fa-regular fa-clock text-zinc-500 mr-1.5"></i> ${movie.duration}</span>
                        <span class="flex items-center"><i class="fa-solid fa-location-crosshairs text-zinc-500 mr-1.5"></i> ${this.escapeHTML(movie.setting)}</span>
                        <span class="ml-auto bg-zinc-800/60 rounded-full w-7 h-7 flex items-center justify-center border border-zinc-700/50">
                            <i id="icon-expand-${movie.id}" class="fa-solid fa-chevron-down text-zinc-400 transition-transform duration-300 text-[10px]"></i>
                        </span>
                    </div>
                </div>
            </div>
            
            <div id="details-${movie.id}" class="hidden border-t border-zinc-800/80 bg-black/40 relative w-full">
                <div class="bg-blue-950/20 border-b border-zinc-800/80 px-5 py-2.5 text-xs text-blue-200/90 flex items-start gap-2 font-tech">
                    <i class="fa-solid fa-timeline text-blue-400 mt-0.5"></i>
                    <p><strong>Línea Temporal:</strong> ${this.escapeHTML(movie.timelineReason)}</p>
                </div>

                <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="space-y-4">
                        <div>
                            <h4 class="font-tech text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Sinopsis / Expediente</h4>
                            <p class="text-xs sm:text-sm text-zinc-300 leading-relaxed">${this.escapeHTML(movie.summary)}</p>
                        </div>
                        <div class="bg-zinc-800/30 rounded-lg p-3 border-l-2 border-marvel">
                            <p class="text-xs text-zinc-300 leading-relaxed">
                                <strong class="text-marvel font-tech uppercase tracking-wide text-[10px] block mb-0.5">Nivel 7:</strong> ${this.escapeHTML(movie.preData)}
                            </p>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div class="bg-zinc-800/30 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-zinc-800/60">
                            <span class="text-xs font-bold font-tech text-zinc-400 uppercase"><i class="fa-solid fa-clapperboard mr-1.5"></i> Post-Créditos (${movie.postCredits})</span>
                            <span class="text-[11px] font-medium text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded">${this.escapeHTML(movie.postCreditDesc)}</span>
                        </div>
                        <div>
                            <h4 class="font-tech text-xs font-bold text-purple-400/80 uppercase tracking-widest mb-1.5"><i class="fa-solid fa-eye-low-vision mr-1.5"></i> Detalles Ocultos</h4>
                            <ul class="text-xs text-zinc-400 space-y-1.5">${hiddenList}</ul>
                        </div>
                    </div>
                </div>
                
                <div class="px-5 pb-5">
                    <div class="flex justify-between items-center mb-2 font-tech">
                        <label class="text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-amber-500/60"></i> Libreta de Campo
                        </label>
                        <div id="stars-container-${movie.id}" class="flex gap-1.5 items-center text-xs">${starsHTML}</div>
                    </div>
                    <div class="relative">
                        <textarea id="note-${movie.id}" class="w-full bg-black/50 border border-zinc-800 rounded p-3 pb-10 text-xs sm:text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-marvel/50 transition-colors resize-y min-h-[80px] shadow-inner" placeholder="Registra observaciones de la misión...">${userNote}</textarea>
                        
                        <button id="btn-note-${movie.id}" onclick="App.saveNote('${movie.id}')" class="absolute bottom-2.5 right-2.5 text-[10px] font-bold font-tech tracking-wide uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-2.5 py-1 rounded transition-colors border border-zinc-700 flex items-center gap-1.5">
                            <i class="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                    </div>
                </div>
            </div>
        `;
        return card;
    },

    // --- BÓVEDA MULTIVERSAL REDISEÑADA ---
    renderInventory() {
        // Renderizar Gemas en Altar Bóveda
        const gemsContainer = document.getElementById('vault-gems-container');
        let countGems = 0;

        gemsContainer.innerHTML = GEMS.map(gem => {
            const hasGem = State.data.watched.includes(gem.id);
            if(hasGem) countGems++;

            return `
                <div class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 ${hasGem ? 'bg-zinc-900/90 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)] scale-105' : 'bg-black/40 border-zinc-800 opacity-40'}">
                    <div class="relative w-10 h-10 flex items-center justify-center mb-2">
                        <i class="fa-solid fa-gem text-xl ${hasGem ? gem.icon + ' animate-pulse-glow' : 'text-zinc-700'}"></i>
                        ${hasGem ? `<div class="absolute inset-0 rounded-full blur-md opacity-50" style="background:${gem.color}"></div>` : ''}
                    </div>
                    <span class="font-tech text-[10px] font-bold uppercase tracking-wider ${hasGem ? 'text-zinc-200' : 'text-zinc-600'}">${gem.name}</span>
                    <span class="font-tech text-[8px] ${hasGem ? 'text-amber-400' : 'text-zinc-700'} font-semibold uppercase mt-0.5">${hasGem ? 'ACTIVA' : 'BLOQUEADA'}</span>
                </div>
            `;
        }).join('');

        document.getElementById('gem-count-badge').innerText = `${countGems} / 6 Reunidas`;

        // Renderizar Artefactos
        const artifactsList = document.getElementById('inventory-list');
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
                const rarity = isGemOwner ? { label: 'MULTIVERSAL', style: 'border-purple-500/50 bg-purple-500/10 text-purple-400' } : { label: 'LEGENDARIO', style: 'border-amber-500/50 bg-amber-500/10 text-amber-400' };

                return `
                    <div class="vault-card p-4 rounded-xl flex items-start gap-3.5 relative overflow-hidden group">
                        <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-110 transition-transform">
                            <i class="fa-solid ${isGemOwner ? 'fa-gem' : 'fa-shield-cat'} text-lg"></i>
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-center gap-2 mb-1">
                                <span class="font-tech text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${rarity.style}">${rarity.label}</span>
                            </div>
                            <h4 class="font-tech text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">${this.escapeHTML(m.keyObject)}</h4>
                            <p class="text-[10px] text-zinc-400 truncate mt-0.5"><i class="fa-solid fa-film text-zinc-600 mr-1"></i>${this.escapeHTML(m.title)}</p>
                        </div>
                    </div>`;
            }).join('');
        }

        // Renderizar Logros
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = ACHIEVEMENTS.map(ach => {
            const isUnlocked = State.data.achievements.includes(ach.id);
            return `
                <div class="p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 ${isUnlocked ? 'bg-zinc-900/80 border-amber-500/40 shadow-lg' : 'bg-black/30 border-zinc-800/80 opacity-40'}">
                    <div class="w-12 h-12 rounded-xl ${isUnlocked ? 'bg-amber-500/10 border border-amber-500/40 text-amber-400' : 'bg-zinc-800 text-zinc-600'} flex items-center justify-center shrink-0 text-xl">
                        <i class="fa-solid ${ach.icon}"></i>
                    </div>
                    <div>
                        <div class="flex items-center gap-2">
                            <h4 class="font-tech text-sm font-bold text-white">${this.escapeHTML(ach.title)}</h4>
                            ${isUnlocked ? '<span class="text-[9px] font-tech font-bold uppercase px-2 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Completado</span>' : ''}
                        </div>
                        <p class="text-xs text-zinc-400 leading-tight mt-1">${this.escapeHTML(ach.desc)}</p>
                    </div>
                </div>`;
        }).join('');
    }
};

const App = {
    konamiSequence: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'],
    konamiIndex: 0,

    init() {
        State.init();
        document.getElementById('sort-select').value = State.filters.sort;
        UI.updateNavigationTabs();
        UI.updateStats();
        UI.renderGrid();
        this.initKonamiCode();
        this.applyTheme(State.filters.saga);
    },

    applyTheme(saga) {
        const root = document.documentElement;
        if (saga === 'Infinito') {
            root.style.setProperty('--color-marvel', '#a855f7');
            root.style.setProperty('--color-glow', 'rgba(168, 85, 247, 0.2)');
        } else if (saga === 'Multiverso') {
            root.style.setProperty('--color-marvel', '#10b981');
            root.style.setProperty('--color-glow', 'rgba(16, 185, 129, 0.2)');
        } else {
            root.style.setProperty('--color-marvel', '#e11d48');
            root.style.setProperty('--color-glow', 'rgba(225, 29, 72, 0.2)');
        }
    },

    setSaga(saga) { 
        State.filters.saga = saga; 
        this.applyTheme(saga);
        UI.updateNavigationTabs(); 
        UI.renderGrid();
        UI.updateStats(); 
    },
    
    setStatus(status) { State.filters.status = status; UI.updateNavigationTabs(); UI.renderGrid(); },
    setSortOrder(order) { State.filters.sort = order; Storage.save('sort', order); UI.renderGrid(); },
    setSearchQuery(query) { State.filters.query = query; UI.renderGrid(); },

    setVaultTab(tab) {
        State.vaultTab = tab;
        const btnArt = document.getElementById('vault-tab-artifacts');
        const btnAch = document.getElementById('vault-tab-achievements');
        const secArt = document.getElementById('vault-section-artifacts');
        const secAch = document.getElementById('vault-section-achievements');

        if(tab === 'artifacts') {
            btnArt.className = "px-3.5 py-1 rounded-lg text-xs font-bold uppercase transition-all bg-amber-500 text-black shadow-md";
            btnAch.className = "px-3.5 py-1 rounded-lg text-xs font-bold uppercase transition-all text-zinc-400 hover:text-white";
            secArt.classList.remove('hidden');
            secAch.classList.add('hidden');
        } else {
            btnAch.className = "px-3.5 py-1 rounded-lg text-xs font-bold uppercase transition-all bg-amber-500 text-black shadow-md";
            btnArt.className = "px-3.5 py-1 rounded-lg text-xs font-bold uppercase transition-all text-zinc-400 hover:text-white";
            secAch.classList.remove('hidden');
            secArt.classList.add('hidden');
        }
    },

    toggleWatched(id) {
        const index = State.data.watched.indexOf(id);
        if (index === -1) State.data.watched.push(id); 
        else State.data.watched.splice(index, 1);
        Storage.save('watched', State.data.watched);
        
        UI.updateStats(); 
        UI.updateCardTargeted(id);
        if(navigator.vibrate) navigator.vibrate(40);
        
        this.checkAchievements();

        if (State.filters.status !== 'all') {
            const card = document.getElementById(`card-${id}`);
            if (card) {
                card.classList.add('opacity-0', 'scale-90');
                setTimeout(() => { UI.renderGrid(); }, 350);
            }
        }
    },

    checkAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            if (!State.data.achievements.includes(ach.id) && ach.check(State.data.watched)) {
                State.data.achievements.push(ach.id);
                Storage.save('achievements', State.data.achievements);
                
                if(navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]); 
                UI.showToast(ach.title, ach.desc, ach.icon);
            }
        });
    },
    
    rateMovie(id, rating) { 
        State.data.ratings[id] = rating; 
        Storage.save('ratings', State.data.ratings); 
        UI.updateStarsTargeted(id, rating); 
    },
    
    saveNote(id) {
        const textarea = document.getElementById(`note-${id}`);
        const noteText = textarea.value.trim();
        if (noteText === '') delete State.data.notes[id]; 
        else State.data.notes[id] = noteText;
        Storage.save('notes', State.data.notes);
        
        const btn = document.getElementById(`btn-note-${id}`);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i>';
        btn.classList.replace('text-zinc-400', 'text-emerald-400');
        btn.classList.add('border-emerald-500/50');
        if(navigator.vibrate) navigator.vibrate([30, 50, 30]);
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.replace('text-emerald-400', 'text-zinc-400');
            btn.classList.remove('border-emerald-500/50');
        }, 1500);
    },

    toggleDetails(id) {
        const detailsDiv = document.getElementById(`details-${id}`);
        const icon = document.getElementById(`icon-expand-${id}`);
        if (detailsDiv.classList.contains('hidden')) {
            detailsDiv.classList.remove('hidden');
            icon.style.transform = 'rotate(180deg)';
        } else {
            detailsDiv.classList.add('hidden');
            icon.style.transform = 'rotate(0deg)';
        }
    },

    toggleInventory() {
        const modal = document.getElementById('inventory-modal');
        modal.classList.toggle('hidden');
        if (!modal.classList.contains('hidden')) UI.renderInventory();
    },

    initKonamiCode() {
        document.addEventListener('keydown', (e) => {
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === this.konamiSequence[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiSequence.length) {
                    this.konamiIndex = 0;
                    UI.showToast("Protocolo Cuarta Pared", "Chimichangas. Has activado el Easter Egg oculto.", "fa-mask text-marvel");
                    document.documentElement.style.setProperty('--bg-color', '#2d0000'); 
                    document.documentElement.style.setProperty('--color-marvel', '#e11d48'); 
                }
            } else {
                this.konamiIndex = 0; 
            }
        });
    }
};

// --- MOTOR DE GALAXIA DE FONDO ---
const GalaxyBackground = {
    init() {
        const canvas = document.getElementById('galaxy-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let stars = [];
        const numStars = 140;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                color: ['#ffffff', '#cbd5e1', '#e11d48', '#38bdf8', '#a855f7'][Math.floor(Math.random() * 5)],
                alpha: Math.random(),
                speed: Math.random() * 0.15 + 0.05,
                twinkleSpeed: Math.random() * 0.02 + 0.005
            });
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach(star => {
                star.y -= star.speed;
                if (star.y < 0) star.y = canvas.height;
                star.alpha += star.twinkleSpeed;
                if (star.alpha > 1 || star.alpha < 0.2) star.twinkleSpeed = -star.twinkleSpeed;

                ctx.save();
                ctx.globalAlpha = Math.abs(star.alpha);
                ctx.fillStyle = star.color;
                ctx.shadowBlur = star.size * 3;
                ctx.shadowColor = star.color;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
};

// --- MOTOR 3D DE PRIMER PLANO (FOREGROUND 3D ENGINE) ---
// --- MOTOR 3D DE PRIMER PLANO (EFECTO VIAJE CUÁNTICO) ---
const Foreground3D = {
    init() {
        const canvas = document.getElementById('foreground-3d-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let particles = [];
        const numParticles = 180; // Aumentamos la cantidad para más impacto
        let centerX = canvas.width / 2;
        let centerY = canvas.height / 2;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            centerX = canvas.width / 2;
            centerY = canvas.height / 2;
        }
        window.addEventListener('resize', resize);
        resize();

        // Movimiento interactivo: El centro de fuga sigue ligeramente al ratón
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        
        window.addEventListener('mousemove', (e) => {
            targetX = (e.clientX - centerX) * 0.3;
            targetY = (e.clientY - centerY) * 0.3;
        });

        class QuantumParticle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = (Math.random() - 0.5) * canvas.width * 3;
                this.y = (Math.random() - 0.5) * canvas.height * 3;
                this.z = Math.random() * 1000 + 100; // Profundidad inicial en eje Z
                this.pz = this.z; // Guardamos la posición Z anterior para dibujar el rastro
                this.color = ['#e11d48', '#38bdf8', '#f59e0b', '#a855f7', '#ffffff'][Math.floor(Math.random() * 5)];
                this.speedZ = Math.random() * 3 + 1; // Velocidad base
            }

            update() {
                this.pz = this.z;
                // ACELERACIÓN EXPONENCIAL: Mientras más cerca (z menor), más rápido viaja hacia ti
                this.z -= this.speedZ + (1000 - this.z) * 0.03; 
                
                // Si la partícula pasa por detrás de la "cámara" (sale de la pantalla), se reinicia al fondo
                if (this.z < 1) {
                    this.reset();
                    this.pz = this.z;
                }
            }

            draw() {
                const fov = 350; // Distancia focal (ajusta la distorsión 3D)
                
                // Proyección 3D a 2D de la posición actual
                const scale = fov / this.z;
                const x2d = (this.x + mouseX) * scale + centerX;
                const y2d = (this.y + mouseY) * scale + centerY;
                
                // Proyección 3D a 2D de la posición anterior (para el efecto de estela/rayo)
                const pScale = fov / this.pz;
                const px2d = (this.x + mouseX) * pScale + centerX;
                const py2d = (this.y + mouseY) * pScale + centerY;

                // El grosor aumenta agresivamente al acercarse a la pantalla
                const size = Math.max(1, (1 - this.z / 1000) * 6);
                
                // La opacidad es baja a lo lejos y brillante de cerca
                const alpha = Math.max(0.1, 1 - (this.z / 1000));

                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = size;
                ctx.lineCap = 'round';
                ctx.shadowBlur = size * 3;
                ctx.shadowColor = this.color;
                
                // Dibuja una línea desde la posición Z anterior a la actual (efecto estela de luz)
                ctx.beginPath();
                ctx.moveTo(px2d, py2d);
                ctx.lineTo(x2d, y2d);
                ctx.stroke();
                ctx.restore();
            }
        }

        for (let i = 0; i < numParticles; i++) {
            particles.push(new QuantumParticle());
        }

        function animate() {
            // Limpiamos el canvas en cada frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Suavizamos el movimiento de la cámara respecto al ratón
            mouseX += (targetX - mouseX) * 0.1;
            mouseY += (targetY - mouseY) * 0.1;

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animate);
        }
        animate();
    }
};


// Inicialización conjunta
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    GalaxyBackground.init();
    Foreground3D.init();
});
