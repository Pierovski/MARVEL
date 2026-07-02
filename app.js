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
        document.getElementById('stats-label') ? document.getElementById('stats-label').innerText = labels[State.filters.saga] : null;
        document.getElementById('progress-stats').innerText = `${watchedCount}/${totalInSaga}`;
        
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
        // Estilos limpios sin cajas para las Sagas
        ['all', 'Infinito', 'Multiverso'].forEach(s => {
            const btn = document.getElementById(`tab-saga-${s}`);
            btn.className = (s === State.filters.saga) 
                ? "snap-start shrink-0 pb-1.5 text-sm font-oswald uppercase tracking-wider transition-all border-b-2 border-marvel text-white drop-shadow-[0_0_8px_var(--color-glow)]"
                : "snap-start shrink-0 pb-1.5 text-sm font-oswald uppercase tracking-wider transition-all border-b-2 border-transparent text-slate-500 hover:text-slate-300";
        });

        // Píldoras compactas para los Estados
        ['all', 'pending', 'watched'].forEach(s => {
            const btn = document.getElementById(`btn-status-${s}`);
            btn.className = (s === State.filters.status)
                ? "shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all bg-slate-800 text-white border border-slate-600 shadow-md"
                : "shrink-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full transition-all text-slate-500 hover:text-slate-300 bg-transparent border border-transparent";
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
            card.classList.remove('border-slate-800');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-emerald-500/20 border-emerald-500 text-emerald-400";
            iconWatch.className = "fa-solid fa-check";
        } else {
            card.style.order = '0'; 
            card.classList.remove('border-emerald-500/40', 'opacity-60', 'scale-[0.98]');
            card.classList.add('border-slate-800');
            btnWatch.className = "tech-tooltip flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-md hover:scale-105 bg-slate-800/80 border-slate-600 text-slate-400 hover:border-marvel hover:text-marvel";
            iconWatch.className = "fa-solid fa-power-off";
        }
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
            const hiddenList = movie.hiddenDetails.map(detail => `<li class="flex items-start"><span class="text-marvel mr-2">-</span> <span>${this.escapeHTML(detail)}</span></li>`).join('');
            
            let starsHTML = '';
            for(let i=1; i<=5; i++) {
                starsHTML += `<i data-tip="${i} Estrella${i>1?'s':''}" class="tech-tooltip fa-star ${i <= userRating ? 'fa-solid text-amber-400' : 'fa-regular text-slate-600'} cursor-pointer hover:text-amber-300 transition-colors" onclick="event.stopPropagation(); App.rateMovie('${movie.id}', ${i})"></i>`;
            }

            const card = document.createElement('div');
            card.id = `card-${movie.id}`;
            card.style.order = isWatched ? '1' : '0';
            card.className = `movie-card flex flex-col border rounded-xl overflow-hidden transition-all duration-500 bg-slate-950/60 backdrop-blur-sm ${isWatched ? 'border-emerald-500/40 opacity-60 scale-[0.98]' : 'border-slate-800 hover:border-slate-600'}`;
            
            card.innerHTML = `
                <div class="p-5 cursor-pointer hover:bg-slate-800/40 transition-colors flex flex-col gap-3 relative group" onclick="App.toggleDetails('${movie.id}')">
                    <div class="flex justify-between items-start w-full">
                        <div class="flex flex-wrap gap-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded shadow-sm">${this.escapeHTML(movie.phase)}</span>
                            <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-1 rounded flex items-center shadow-sm">
                                <i class="fa-solid ${movie.type.includes('Serie') ? 'fa-tv' : 'fa-film'} mr-1.5"></i>${this.escapeHTML(movie.type)}
                            </span>
                        </div>
                        <button data-tip="${isWatched ? 'Desmarcar' : 'Marcar Vista'}" id="btn-watch-${movie.id}" onclick="event.stopPropagation(); App.toggleWatched('${movie.id}')" class="tech-tooltip flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all shadow-md hover:scale-105 shrink-0 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-800/80 border-slate-600 text-slate-400 hover:border-marvel hover:text-marvel'}">
                            <i id="icon-watch-${movie.id}" class="fa-solid ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
                        </button>
                    </div>
                    
                    <div class="mt-1">
                        <h3 class="font-oswald text-xl sm:text-2xl font-bold text-slate-100 leading-tight group-hover:text-marvel transition-colors duration-300 uppercase">${this.escapeHTML(movie.title)}</h3>
                        <div class="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                            <span class="flex items-center"><i class="fa-regular fa-clock text-slate-500 mr-1.5"></i> ${movie.duration}</span>
                            <span class="flex items-center"><i class="fa-solid fa-location-crosshairs text-slate-500 mr-1.5"></i> ${this.escapeHTML(movie.setting)}</span>
                            <span class="ml-auto bg-slate-800/60 rounded-full w-7 h-7 flex items-center justify-center border border-slate-700/50">
                                <i id="icon-expand-${movie.id}" class="fa-solid fa-chevron-down text-slate-400 transition-transform duration-300 text-[10px]"></i>
                            </span>
                        </div>
                    </div>
                </div>
                
                <div id="details-${movie.id}" class="hidden border-t border-slate-800 bg-slate-900/40 relative w-full">
                    <div class="bg-blue-900/10 border-b border-slate-800 px-5 py-3 text-sm text-blue-200/80 flex items-start gap-2">
                        <i class="fa-solid fa-timeline text-blue-400 mt-1"></i>
                        <p><strong>Línea Temporal:</strong> ${this.escapeHTML(movie.timelineReason)}</p>
                    </div>

                    <div class="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-5">
                            <div>
                                <h4 class="font-oswald text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Sinopsis / Expediente</h4>
                                <p class="text-sm text-slate-300 leading-relaxed">${this.escapeHTML(movie.summary)}</p>
                            </div>
                            <div class="bg-slate-800/30 rounded-lg p-3.5 border-l-2 border-marvel">
                                <p class="text-[13px] text-slate-300 leading-relaxed">
                                    <strong class="text-marvel uppercase tracking-wide text-xs">Nivel 7:</strong> ${this.escapeHTML(movie.preData)}
                                </p>
                            </div>
                        </div>
                        
                        <div class="space-y-5">
                            <div class="bg-slate-800/30 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-800">
                                <span class="text-xs font-bold text-slate-400 uppercase"><i class="fa-solid fa-clapperboard mr-1.5"></i> Post-Créditos (${movie.postCredits})</span>
                                <span class="text-[11px] font-medium text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded">${this.escapeHTML(movie.postCreditDesc)}</span>
                            </div>
                            <div>
                                <h4 class="font-oswald text-xs font-bold text-purple-400/80 uppercase tracking-widest mb-2"><i class="fa-solid fa-eye-low-vision mr-1.5"></i> Detalles Ocultos</h4>
                                <ul class="text-[13px] text-slate-400 space-y-1.5">${hiddenList}</ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="px-5 pb-5">
                        <div class="flex justify-between items-center mb-3">
                            <label class="font-oswald text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <i class="fa-solid fa-book-open text-amber-500/60"></i> Libreta de Campo
                            </label>
                            <div class="flex gap-1.5 items-center text-sm">${starsHTML}</div>
                        </div>
                        <div class="relative">
                            <textarea id="note-${movie.id}" class="w-full bg-[#0b1121] border border-slate-700/80 rounded p-4 pb-12 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-marvel/50 transition-colors resize-y min-h-[90px] shadow-inner" placeholder="Registra tus observaciones...">${userNote}</textarea>
                            
                            <button id="btn-note-${movie.id}" onclick="App.saveNote('${movie.id}')" class="absolute bottom-3 right-3 text-[11px] font-bold tracking-wide uppercase bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded transition-colors border border-slate-700 flex items-center gap-1.5">
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
        
        UI.updateStats(); 
        UI.updateCardTargeted(id);
        if(navigator.vibrate) navigator.vibrate(50);

        if (State.filters.status !== 'all') {
            const card = document.getElementById(`card-${id}`);
            if (card) {
                card.classList.add('opacity-0', 'scale-90');
                setTimeout(() => {
                    UI.renderGrid();
                }, 400);
            }
        }
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
