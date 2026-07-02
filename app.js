// --- CONFIGURACIÓN DE GEMAS Y LOGROS ---
const GEMS = [
    { id: 'cap-america-1', name: 'Espacio', icon: 'text-blue-500 shadow-blue-500/50' },
    { id: 'avengers-1', name: 'Mente', icon: 'text-yellow-400 shadow-yellow-400/50' },
    { id: 'thor-2', name: 'Realidad', icon: 'text-red-500 shadow-red-500/50' },
    { id: 'gotg-1', name: 'Poder', icon: 'text-purple-500 shadow-purple-500/50' },
    { id: 'dr-strange', name: 'Tiempo', icon: 'text-emerald-500 shadow-emerald-500/50' },
    { id: 'infinity-war', name: 'Alma', icon: 'text-orange-500 shadow-orange-500/50' }
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
    filters: { status: 'all', saga: 'all', sort: 'narrative' },
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
        
        document.getElementById('progress-stats').innerText = `${watchedInSaga.length}/${totalInSaga}`;
        
        let totalMins = watchedInSaga.reduce((acc, movie) => {
            if (movie.type.includes('Serie')) return acc + ((parseInt(movie.duration) || 0) * 45); 
            const h = movie.duration.match(/(\d+)h/) ? parseInt(movie.duration.match(/(\d+)h/)[1], 10) : 0;
            const m = movie.duration.match(/(\d+)m/) ? parseInt(movie.duration.match(/(\d+)m/)[1], 10) : 0;
            return acc + (h * 60) + m;
        }, 0);
        
        document.getElementById('time-stats').innerText = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
        this.renderGems();
    },

    renderGems() {
        const desktopTracker = document.getElementById('gem-tracker');
        const mobileTracker = document.getElementById('mobile-gem-tracker');
        
        const html = GEMS.map(gem => {
            const hasGem = State.data.watched.includes(gem.id);
            const classes = hasGem ? `${gem.icon} drop-shadow-md scale-110` : 'text-zinc-700 opacity-50';
            return `<i class="fa-solid fa-gem transition-all duration-500 ${classes}" title="Gema del ${gem.name}"></i>`;
        }).join('');

        if (desktopTracker) desktopTracker.innerHTML = html;
        if (mobileTracker) mobileTracker.innerHTML = html;
    },

    updateNavigationTabs() {
        ['all', 'Infinito', 'Multiverso'].forEach(s => {
            const btn = document.getElementById(`tab-saga-${s}`);
            btn.className = (s === State.filters.saga) 
                ? "snap-start shrink-0 font-oswald px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all bg-marvel text-white border-marvel shadow-[0_0_15px_var(--color-glow)]"
                : "snap-start shrink-0 font-oswald px-5 py-2 text-xs uppercase tracking-wider rounded-full transition-all bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:bg-zinc-800";
        });

        ['all', 'pending', 'watched'].forEach(s => {
            const btn = document.getElementById(`btn-status-${s}`);
            btn.className = (s === State.filters.status)
                ? "shrink-0 font-oswald px-4 py-1 text-xs tracking-wide rounded transition-all bg-zinc-800 text-white font-bold shadow-sm"
                : "shrink-0 font-oswald px-4 py-1 text-xs tracking-wide rounded transition-all text-zinc-500 hover:text-zinc-300 bg-transparent";
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
            card.classList.add('border-emerald-500/40', 'opacity-60', 'scale-[0.98]'); 
            card.classList.remove('border-zinc-800');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-emerald-500/20 border-emerald-500 text-emerald-400";
            iconWatch.className = "fa-solid fa-check";
        } else {
            card.style.order = '0'; 
            card.classList.remove('border-emerald-500/40', 'opacity-60', 'scale-[0.98]');
            card.classList.add('border-zinc-800');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-zinc-800/80 border-zinc-600 text-zinc-400 hover:border-marvel hover:text-marvel";
            iconWatch.className = "fa-solid fa-power-off";
        }
    },

    showToast(title, desc, iconClass) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'bg-zinc-900 border border-zinc-700/50 shadow-2xl shadow-black rounded-lg p-4 flex items-center gap-4 w-72 toast-enter backdrop-blur-md';
        toast.innerHTML = `
            <div class="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-600">
                <i class="fa-solid ${iconClass} text-lg"></i>
            </div>
            <div>
                <p class="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-0.5">Logro Desbloqueado</p>
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

        let filtered = marvelDataset.filter(movie => {
            const isWatched = State.data.watched.includes(movie.id);
            const matchStatus = State.filters.status === 'all' || 
                               (State.filters.status === 'watched' && isWatched) || 
                               (State.filters.status === 'pending' && !isWatched);
            const matchSaga = State.filters.saga === 'all' || movie.saga === State.filters.saga;
            return matchStatus && matchSaga;
        });

        if (State.filters.sort === 'release') filtered.sort((a, b) => a.releaseIndex - b.releaseIndex);
        else filtered.sort((a, b) => a.chronoIndex - b.chronoIndex);

        if (filtered.length === 0) {
            container.innerHTML = `<div class="col-span-full text-center py-20 text-zinc-600 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30"><i class="fa-solid fa-satellite-dish text-5xl mb-4 block opacity-40"></i><p class="font-oswald text-xl tracking-wide uppercase">El radar no detecta producciones.</p></div>`;
            return;
        }

        filtered.forEach(movie => {
            const isWatched = State.data.watched.includes(movie.id);
            const userNote = this.escapeHTML(State.data.notes[movie.id] || '');
            const userRating = State.data.ratings[movie.id] || 0;
            const hiddenList = movie.hiddenDetails.map(detail => `<li class="flex items-start"><span class="text-marvel mr-2">-</span> <span>${this.escapeHTML(detail)}</span></li>`).join('');
            
            let starsHTML = '';
            for(let i=1; i<=5; i++) {
                starsHTML += `<i data-tip="${i} Estrella${i>1?'s':''}" class="tech-tooltip fa-star ${i <= userRating ? 'fa-solid text-amber-400' : 'fa-regular text-zinc-600'} cursor-pointer hover:text-amber-300 transition-colors" onclick="event.stopPropagation(); App.rateMovie('${movie.id}', ${i})"></i>`;
            }

            const card = document.createElement('div');
            card.id = `card-${movie.id}`;
            card.style.order = isWatched ? '1' : '0';
            card.className = `movie-card flex flex-col border rounded-xl overflow-hidden transition-all duration-500 bg-zinc-950/60 backdrop-blur-sm ${isWatched ? 'border-emerald-500/40 opacity-60 scale-[0.98]' : 'border-zinc-800 hover:border-zinc-600'}`;
            
            card.innerHTML = `
                <div class="p-5 cursor-pointer hover:bg-zinc-800/40 transition-colors flex flex-col gap-3 relative group" onclick="App.toggleDetails('${movie.id}')">
                    <div class="flex justify-between items-start w-full">
                        <div class="flex flex-wrap gap-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded shadow-sm">${this.escapeHTML(movie.phase)}</span>
                            <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded flex items-center shadow-sm">
                                <i class="fa-solid ${movie.type.includes('Serie') ? 'fa-tv' : 'fa-film'} mr-1.5"></i>${this.escapeHTML(movie.type)}
                            </span>
                        </div>
                        <button data-tip="${isWatched ? 'Desmarcar' : 'Marcar Vista'}" id="btn-watch-${movie.id}" onclick="event.stopPropagation(); App.toggleWatched('${movie.id}')" class="tech-tooltip flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-md hover:scale-105 shrink-0 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-zinc-800/80 border-zinc-600 text-zinc-400 hover:border-marvel hover:text-marvel'}">
                            <i id="icon-watch-${movie.id}" class="fa-solid ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
                        </button>
                    </div>
                    
                    <div class="mt-1">
                        <h3 class="font-oswald text-xl sm:text-2xl font-bold text-zinc-100 leading-tight group-hover:text-marvel transition-colors duration-300 uppercase">${this.escapeHTML(movie.title)}</h3>
                        <div class="flex items-center gap-4 mt-3 text-xs text-zinc-400 font-medium">
                            <span class="flex items-center"><i class="fa-regular fa-clock text-zinc-500 mr-1.5"></i> ${movie.duration}</span>
                            <span class="flex items-center"><i class="fa-solid fa-location-crosshairs text-zinc-500 mr-1.5"></i> ${this.escapeHTML(movie.setting)}</span>
                            <span class="ml-auto bg-zinc-800/60 rounded-full w-7 h-7 flex items-center justify-center border border-zinc-700/50">
                                <i id="icon-expand-${movie.id}" class="fa-solid fa-chevron-down text-zinc-400 transition-transform duration-300 text-[10px]"></i>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div id="details-${movie.id}" class="hidden border-t border-zinc-800 bg-zinc-900/40 relative w-full">
                    <div class="bg-blue-900/10 border-b border-zinc-800 px-5 py-3 text-sm text-blue-200/80 flex items-start gap-2">
                        <i class="fa-solid fa-timeline text-blue-400 mt-1"></i>
                        <p><strong>Línea Temporal:</strong> ${this.escapeHTML(movie.timelineReason)}</p>
                    </div>

                    <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-5">
                            <div>
                                <h4 class="font-oswald text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Sinopsis / Expediente</h4>
                                <p class="text-sm text-zinc-300 leading-relaxed">${this.escapeHTML(movie.summary)}</p>
                            </div>
                            <div class="bg-zinc-800/30 rounded-lg p-3.5 border-l-2 border-marvel">
                                <p class="text-[13px] text-zinc-300 leading-relaxed">
                                    <strong class="text-marvel uppercase tracking-wide text-xs">Nivel 7:</strong> ${this.escapeHTML(movie.preData)}
                                </p>
                            </div>
                        </div>
                        
                        <div class="space-y-5">
                            <div class="bg-zinc-800/30 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-zinc-800">
                                <span class="text-xs font-bold text-zinc-400 uppercase"><i class="fa-solid fa-clapperboard mr-1.5"></i> Post-Créditos (${movie.postCredits})</span>
                                <span class="text-[11px] font-medium text-zinc-300 bg-zinc-800/80 px-2.5 py-1 rounded">${this.escapeHTML(movie.postCreditDesc)}</span>
                            </div>
                            <div>
                                <h4 class="font-oswald text-xs font-bold text-purple-400/80 uppercase tracking-widest mb-2"><i class="fa-solid fa-eye-low-vision mr-1.5"></i> Detalles Ocultos</h4>
                                <ul class="text-[13px] text-zinc-400 space-y-1.5">${hiddenList}</ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="px-5 pb-5">
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-oswald text-xs font-bold text-zinc-500 uppercase flex items-center gap-2">
                                <i class="fa-solid fa-book-open text-amber-500/60"></i> Libreta de Campo
                            </label>
                            <div class="flex gap-1.5 items-center text-sm">${starsHTML}</div>
                        </div>
                        <div class="relative">
                            <textarea id="note-${movie.id}" class="w-full bg-[#09090b] border border-zinc-700/80 rounded p-4 pb-12 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-marvel/50 transition-colors resize-y min-h-[90px] shadow-inner" placeholder="Registra tus observaciones...">${userNote}</textarea>
                            
                            <button id="btn-note-${movie.id}" onclick="App.saveNote('${movie.id}')" class="absolute bottom-3 right-3 text-[11px] font-bold tracking-wide uppercase bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-3 py-1.5 rounded transition-colors border border-zinc-700 flex items-center gap-1.5">
                                <i class="fa-solid fa-floppy-disk"></i> Guardar
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    renderInventory() {
        const artifactsList = document.getElementById('inventory-list');
        const achievementsList = document.getElementById('achievements-list');
        
        // Renderizar Artefactos
        const collected = marvelDataset.filter(m => State.data.watched.includes(m.id) && m.keyObject);
        if(collected.length === 0) {
            artifactsList.innerHTML = `<div class="col-span-full text-center py-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500">Sin artefactos asegurados.</div>`;
        } else {
            artifactsList.innerHTML = collected.map(m => `
                <div class="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl flex flex-col items-center text-center hover:border-amber-500/50 transition-colors">
                    <div class="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-lg mb-2 border border-amber-500/30"><i class="fa-solid fa-gem"></i></div>
                    <h4 class="text-[11px] font-bold text-zinc-200 mb-1 leading-tight">${this.escapeHTML(m.keyObject)}</h4>
                    <span class="text-[9px] text-zinc-500 uppercase tracking-widest">${this.escapeHTML(m.title)}</span>
                </div>`).join('');
        }

        // Renderizar Logros
        if(State.data.achievements.length === 0) {
            achievementsList.innerHTML = `<div class="col-span-full text-center py-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/30 text-zinc-500">Aún no hay logros clasificados.</div>`;
        } else {
            achievementsList.innerHTML = ACHIEVEMENTS.map(ach => {
                const isUnlocked = State.data.achievements.includes(ach.id);
                if (!isUnlocked) return ''; // Ocultar los no desbloqueados
                return `
                    <div class="bg-zinc-900/80 border border-zinc-700/50 p-4 rounded-xl flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-600"><i class="fa-solid ${ach.icon} text-xl"></i></div>
                        <div>
                            <h4 class="text-sm font-bold text-zinc-100">${this.escapeHTML(ach.title)}</h4>
                            <p class="text-[11px] text-zinc-400 leading-tight mt-0.5">${this.escapeHTML(ach.desc)}</p>
                        </div>
                    </div>`;
            }).join('');
        }
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
        // Colores Base de Tema Dinámico
        if (saga === 'Infinito') {
            root.style.setProperty('--color-marvel', '#a855f7');
            root.style.setProperty('--color-glow', 'rgba(168, 85, 247, 0.15)');
            root.style.setProperty('--bg-color', '#140c1f'); // Morado espacial muy oscuro
        } else if (saga === 'Multiverso') {
            root.style.setProperty('--color-marvel', '#10b981');
            root.style.setProperty('--color-glow', 'rgba(16, 185, 129, 0.15)');
            root.style.setProperty('--bg-color', '#091410'); // Verde oscuro TVA
        } else {
            root.style.setProperty('--color-marvel', '#dc2626');
            root.style.setProperty('--color-glow', 'rgba(220, 38, 38, 0.15)');
            root.style.setProperty('--bg-color', '#09090b'); // Negro/Zinc clásico
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
    
    toggleWatched(id) {
        const index = State.data.watched.indexOf(id);
        if (index === -1) State.data.watched.push(id); 
        else State.data.watched.splice(index, 1);
        Storage.save('watched', State.data.watched);
        
        UI.updateStats(); 
        UI.updateCardTargeted(id);
        if(navigator.vibrate) navigator.vibrate(50);
        
        // Dispara la verificación de logros de fondo
        this.checkAchievements();

        if (State.filters.status !== 'all') {
            const card = document.getElementById(`card-${id}`);
            if (card) {
                card.classList.add('opacity-0', 'scale-90');
                setTimeout(() => { UI.renderGrid(); }, 400);
            }
        }
    },

    checkAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            if (!State.data.achievements.includes(ach.id) && ach.check(State.data.watched)) {
                // Logro Desbloqueado!
                State.data.achievements.push(ach.id);
                Storage.save('achievements', State.data.achievements);
                
                // Si la pantalla vibra, es un toque inmersivo extra
                if(navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]); 
                UI.showToast(ach.title, ach.desc, ach.icon);
            }
        });
    },
    
    rateMovie(id, rating) { State.data.ratings[id] = rating; Storage.save('ratings', State.data.ratings); UI.renderGrid(); },
    
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
            // Evaluamos la tecla presionada ignorando mayúsculas/minúsculas para B y A
            const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
            if (key === this.konamiSequence[this.konamiIndex]) {
                this.konamiIndex++;
                if (this.konamiIndex === this.konamiSequence.length) {
                    // ¡Código activado!
                    this.konamiIndex = 0;
                    UI.showToast("Protocolo Cuarta Pared", "Chimichangas. Has activado el Easter Egg oculto.", "fa-mask text-marvel");
                    document.documentElement.style.setProperty('--bg-color', '#3f0000'); // Fondo Rojo Deadpool
                    document.documentElement.style.setProperty('--color-marvel', '#000000'); // Acentos Negros
                }
            } else {
                this.konamiIndex = 0; // Reinicia si te equivocas
            }
        });
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
