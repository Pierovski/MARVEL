// --- ESTADO Y ALMACENAMIENTO ---
const Storage = {
    keys: { watched: 'ucm_watched', notes: 'ucm_notes', ratings: 'ucm_ratings', sort: 'ucm_sort' },
    save(key, data) { localStorage.setItem(this.keys[key], JSON.stringify(data)); },
    load(key, fallback) { 
        const data = localStorage.getItem(this.keys[key]);
        return data ? JSON.parse(data) : fallback;
    }
};

const State = {
    filters: { status: 'all', saga: 'all', sort: 'narrative' },
    data: { watched: [], notes: {}, ratings: {} },
    init() {
        this.data.watched = Storage.load('watched', []);
        this.data.notes = Storage.load('notes', {});
        this.data.ratings = Storage.load('ratings', {});
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
        const watchedCount = watchedInSaga.length;

        const labels = { 'all': 'Progreso Total', 'Infinito': 'Progreso Infinito', 'Multiverso': 'Progreso Multiverso' };
        document.getElementById('stats-label').innerText = labels[State.filters.saga];
        document.getElementById('progress-stats').innerText = `${watchedCount} / ${totalInSaga}`;
        
        let totalMins = watchedInSaga.reduce((acc, movie) => {
            if (movie.type.includes('Serie')) {
                return acc + ((parseInt(movie.duration) || 0) * 45); 
            } else {
                const h = movie.duration.match(/(\d+)h/) ? parseInt(movie.duration.match(/(\d+)h/)[1], 10) : 0;
                const m = movie.duration.match(/(\d+)m/) ? parseInt(movie.duration.match(/(\d+)m/)[1], 10) : 0;
                return acc + (h * 60) + m;
            }
        }, 0);
        
        document.getElementById('time-stats').innerText = `${Math.floor(totalMins / 60)}h ${totalMins % 60}m`;
    },

    updateNavigationTabs() {
        ['all', 'Infinito', 'Multiverso'].forEach(s => {
            const btn = document.getElementById(`tab-saga-${s}`);
            btn.className = (s === State.filters.saga) 
                ? "font-oswald flex-1 px-4 py-2 text-sm uppercase tracking-wide font-bold rounded-md transition-all bg-marvel text-white shadow-[0_0_15px_var(--color-glow)] duration-500"
                : "font-oswald flex-1 px-4 py-2 text-sm uppercase tracking-wide rounded-md transition-all text-slate-400 hover:bg-slate-800 hover:text-white";
        });

        ['all', 'pending', 'watched'].forEach(s => {
            const btn = document.getElementById(`btn-status-${s}`);
            btn.className = (s === State.filters.status)
                ? "font-oswald px-3 py-1.5 text-sm tracking-wide font-bold rounded-lg transition-all bg-slate-800 text-white border border-slate-600 shadow-md"
                : "font-oswald px-3 py-1.5 text-sm tracking-wide rounded-lg transition-all text-slate-400 hover:text-white bg-transparent";
        });
    },

    updateCardTargeted(id) {
        const isWatched = State.data.watched.includes(id);
        const card = document.getElementById(`card-${id}`);
        const btnWatch = document.getElementById(`btn-watch-${id}`);
        const iconWatch = document.getElementById(`icon-watch-${id}`);
        const spoilerOverlay = document.getElementById(`spoiler-overlay-${id}`);
        const detailsContainer = document.getElementById(`details-container-${id}`);
        
        if(!card) return;

        if(isWatched) {
            card.classList.add('border-emerald-500/40', 'opacity-90');
            card.classList.remove('border-slate-700');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-emerald-500/20 border-emerald-500 text-emerald-400";
            iconWatch.className = "fa-solid sm:fa-xl fa-check";
            if(spoilerOverlay) spoilerOverlay.classList.add('hidden');
            if(detailsContainer) detailsContainer.classList.remove('opacity-30', 'pointer-events-none', 'select-none');
        } else {
            card.classList.remove('border-emerald-500/40', 'opacity-90');
            card.classList.add('border-slate-700');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-slate-900 border-slate-700 text-slate-400 hover:border-marvel hover:text-marvel";
            iconWatch.className = "fa-solid sm:fa-xl fa-power-off";
            if(spoilerOverlay) spoilerOverlay.classList.remove('hidden');
            if(detailsContainer) detailsContainer.classList.add('opacity-30', 'pointer-events-none', 'select-none');
        }

        if(State.filters.status !== 'all') this.renderGrid();
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
            container.innerHTML = `<div class="col-span-full text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/30 glass-panel"><i class="fa-solid fa-satellite-dish text-5xl mb-4 block opacity-40"></i><p class="font-oswald text-xl tracking-wide uppercase">El radar no detecta producciones.</p></div>`;
            return;
        }

        filtered.forEach(movie => {
            const isWatched = State.data.watched.includes(movie.id);
            const userNote = this.escapeHTML(State.data.notes[movie.id] || '');
            const userRating = State.data.ratings[movie.id] || 0;
            const hiddenList = movie.hiddenDetails.map(detail => `<li>- ${this.escapeHTML(detail)}</li>`).join('');
            
            let starsHTML = '';
            for(let i=1; i<=5; i++) {
                starsHTML += `<i data-tip="${i} Estrella${i>1?'s':''}" class="tech-tooltip fa-star ${i <= userRating ? 'fa-solid text-amber-400' : 'fa-regular text-slate-600'} cursor-pointer hover:text-amber-300 transition-colors" onclick="event.stopPropagation(); App.rateMovie('${movie.id}', ${i})"></i>`;
            }

            const card = document.createElement('div');
            card.id = `card-${movie.id}`;
            card.className = `movie-card flex flex-col border rounded-xl overflow-hidden transition-all duration-500 card-glow shadow-xl ${isWatched ? 'border-emerald-500/40 opacity-90' : 'border-slate-700 bg-slate-950/50 backdrop-blur-sm'}`;
            
            card.innerHTML = `
                <div class="p-5 sm:p-6 cursor-pointer hover:bg-slate-800/30 transition-colors group relative" onclick="App.toggleDetails('${movie.id}')">
                    <div class="flex justify-between items-start gap-4">
                        <div class="flex-grow z-10">
                            <div class="flex flex-wrap gap-2 mb-3">
                                <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded shadow-sm">${this.escapeHTML(movie.phase)}</span>
                                <span class="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                    <i class="fa-solid ${movie.type.includes('Serie') ? 'fa-tv' : 'fa-film'}"></i> ${this.escapeHTML(movie.type)}
                                </span>
                            </div>
                            <h3 class="font-oswald text-xl sm:text-2xl font-bold text-slate-100 leading-tight group-hover:text-marvel transition-colors duration-300 uppercase">${this.escapeHTML(movie.title)}</h3>
                            <div class="flex flex-wrap gap-3 sm:gap-4 mt-3">
                                <p class="text-[11px] sm:text-xs font-medium text-slate-400"><i class="fa-regular fa-clock text-emerald-500 mr-1"></i> ${movie.duration}</p>
                                <p class="text-[11px] sm:text-xs font-medium text-slate-400"><i class="fa-solid fa-location-crosshairs text-blue-400 mr-1"></i> ${this.escapeHTML(movie.setting)}</p>
                            </div>
                        </div>
                        
                        <div class="flex flex-col items-end gap-3 shrink-0 z-10">
                            <button data-tip="${isWatched ? 'Desmarcar' : 'Marcar Vista'}" id="btn-watch-${movie.id}" onclick="event.stopPropagation(); App.toggleWatched('${movie.id}')" class="tech-tooltip flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 transition-all shadow-md hover:scale-105 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-marvel hover:text-marvel'}">
                                <i id="icon-watch-${movie.id}" class="fa-solid sm:fa-xl ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
                            </button>
                            <div class="bg-slate-800/50 rounded-full w-8 h-8 flex items-center justify-center border border-slate-700/50">
                                <i id="icon-expand-${movie.id}" class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300 text-sm"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="details-${movie.id}" class="hidden border-t border-slate-800/80 bg-slate-950/90 relative w-full">
                    <div class="bg-blue-900/10 border-b border-blue-500/20 p-4 px-6 flex items-start gap-3">
                        <i class="fa-solid fa-timeline text-blue-400 mt-1"></i>
                        <p class="text-sm text-blue-100/80 leading-relaxed"><strong class="text-blue-400 font-oswald uppercase tracking-wide">Línea Temporal:</strong> ${this.escapeHTML(movie.timelineReason)}</p>
                    </div>

                    <div class="p-6 space-y-5 relative">
                        <div id="spoiler-overlay-${movie.id}" class="${!isWatched ? 'absolute inset-0 z-10 flex items-center justify-center backdrop-blur-md bg-slate-950/70' : 'hidden'}">
                            <div class="bg-slate-900 border border-slate-700 px-5 py-3 rounded-lg text-sm text-slate-300 shadow-[0_0_30px_rgba(0,0,0,0.8)] flex items-center gap-3 font-medium">
                                <i class="fa-solid fa-lock text-marvel"></i> Marca como vista para revelar Archivos Clasificados
                            </div>
                        </div>
                        
                        <div id="details-container-${movie.id}" class="${!isWatched ? 'opacity-30 pointer-events-none select-none' : ''} transition-opacity duration-500">
                            <div>
                                <h4 class="font-oswald text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Sinopsis / Expediente</h4>
                                <p class="text-sm text-slate-300 leading-relaxed">${this.escapeHTML(movie.summary)}</p>
                            </div>

                            <div class="bg-slate-900/80 rounded-lg p-4 border-l-4 border-marvel transition-colors duration-300 mt-5 shadow-inner">
                                <p class="text-sm text-slate-300 leading-relaxed">
                                    <strong class="font-oswald uppercase tracking-wide text-marvel"><i class="fa-solid fa-circle-exclamation mr-1"></i> Recomendación Nivel 7:</strong><br>
                                    ${this.escapeHTML(movie.preData)}
                                </p>
                            </div>
                            
                            <div class="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-900 rounded-lg p-4 border border-slate-800 mt-5 gap-3">
                                <span class="text-xs font-bold text-slate-400 uppercase tracking-wider"><i class="fa-solid fa-clapperboard mr-1"></i> Post-Créditos (${movie.postCredits}):</span>
                                <span class="text-xs font-medium text-slate-200 bg-slate-800 px-3 py-1.5 rounded border border-slate-700">${this.escapeHTML(movie.postCreditDesc)}</span>
                            </div>
                            
                            <div class="bg-slate-900/50 rounded-lg p-4 border border-slate-800/50 mt-5">
                                <h4 class="font-oswald text-sm font-bold text-purple-400 uppercase tracking-wide mb-3"><i class="fa-solid fa-eye-low-vision mr-1"></i> Detalles Ocultos:</h4>
                                <ul class="text-sm text-slate-400 space-y-2 pl-1">${hiddenList}</ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="bg-slate-900 border-t border-slate-800 p-5 relative z-20">
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-3">
                            <label class="font-oswald text-sm font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
                                <i class="fa-solid fa-book-open text-amber-500/70"></i> Libreta de Campo:
                            </label>
                            <div class="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div class="flex gap-1 text-base">${starsHTML}</div>
                                <button data-tip="Archivar Registro" id="btn-note-${movie.id}" onclick="App.saveNote('${movie.id}')" class="tech-tooltip text-xs font-bold tracking-wide uppercase text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition-colors flex items-center gap-2 border border-slate-700 hover:border-slate-500">
                                    <i class="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <textarea id="note-${movie.id}" class="w-full bg-[#0b1121] border-b-2 border-slate-700 rounded-t p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-marvel transition-all resize-y min-h-[100px] leading-relaxed shadow-inner" style="background-image: repeating-linear-gradient(transparent, transparent 27px, rgba(255,255,255,0.03) 28px);" placeholder="Registra tus observaciones operativas aquí...">${userNote}</textarea>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    renderInventory() {
        const list = document.getElementById('inventory-list');
        const collected = marvelDataset.filter(m => State.data.watched.includes(m.id) && m.keyObject);
        
        if(collected.length === 0) {
            list.innerHTML = `<div class="col-span-full text-center py-16"><i class="fa-solid fa-box-open text-6xl text-slate-700 mb-4 block"></i><p class="font-oswald text-xl text-slate-500 uppercase tracking-wide">Bóveda Vacía</p><p class="text-sm text-slate-600 mt-2">Marca películas como vistas para asegurar artefactos multiversales.</p></div>`;
            return;
        }
        
        list.innerHTML = `<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">` + 
            collected.map(m => `
            <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl flex flex-col items-center text-center shadow-lg hover:border-amber-500/50 hover:bg-slate-900 transition-all group">
                <div class="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl mb-3 border border-amber-500/30 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                    <i class="fa-solid fa-gem"></i>
                </div>
                <h4 class="text-sm font-bold text-slate-200 mb-1 leading-tight">${this.escapeHTML(m.keyObject)}</h4>
                <span class="text-[10px] text-slate-500 font-medium uppercase tracking-wider">${this.escapeHTML(m.title)}</span>
            </div>`).join('') + `</div>`;
    }
};

const App = {
    init() {
        State.init();
        document.getElementById('sort-select').value = State.filters.sort;
        UI.updateNavigationTabs();
        UI.updateStats();
        UI.renderGrid();
    },
    setSaga(saga) { 
        State.filters.saga = saga; 
        const root = document.documentElement;
        if (saga === 'Infinito') {
            root.style.setProperty('--color-marvel', '#a855f7');
            root.style.setProperty('--color-glow', 'rgba(168, 85, 247, 0.15)');
        } else if (saga === 'Multiverso') {
            root.style.setProperty('--color-marvel', '#10b981');
            root.style.setProperty('--color-glow', 'rgba(16, 185, 129, 0.15)');
        } else {
            root.style.setProperty('--color-marvel', '#dc2626');
            root.style.setProperty('--color-glow', 'rgba(220, 38, 38, 0.15)');
        }
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
        UI.updateStats(); UI.updateCardTargeted(id);
        if(navigator.vibrate) navigator.vibrate(50);
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
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Archivado';
        btn.classList.replace('text-slate-400', 'text-emerald-400');
        btn.classList.add('border-emerald-500/50');
        if(navigator.vibrate) navigator.vibrate([30, 50, 30]);
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.replace('text-emerald-400', 'text-slate-400');
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
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
