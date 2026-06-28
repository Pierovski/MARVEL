let appState = { statusFilter: 'all', sagaFilter: 'all', searchQuery: '', watched: [], notes: {} };

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateUI();
});

function loadData() {
    const savedWatched = localStorage.getItem('ucm_watched');
    const savedNotes = localStorage.getItem('ucm_notes');
    if (savedWatched) appState.watched = JSON.parse(savedWatched);
    if (savedNotes) appState.notes = JSON.parse(savedNotes);
}

function saveData() {
    localStorage.setItem('ucm_watched', JSON.stringify(appState.watched));
    localStorage.setItem('ucm_notes', JSON.stringify(appState.notes));
}

function saveNote(id) {
    const textarea = document.getElementById(`note-${id}`);
    const noteText = textarea.value.trim();
    if (noteText === '') { delete appState.notes[id]; } else { appState.notes[id] = noteText; }
    saveData();
    
    const btn = document.getElementById(`btn-note-${id}`);
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Guardado';
    btn.classList.add('text-emerald-400');
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('text-emerald-400');
    }, 1500);
}

function toggleWatched(id) {
    const index = appState.watched.indexOf(id);
    if (index === -1) { appState.watched.push(id); } else { appState.watched.splice(index, 1); }
    saveData();
    renderGrid();
}

// Nueva animación con max-height en lugar de 'hidden'
function toggleDetails(id) {
    const detailsDiv = document.getElementById(`details-${id}`);
    const icon = document.getElementById(`icon-expand-${id}`);
    
    detailsDiv.classList.toggle('open');
    
    if (detailsDiv.classList.contains('open')) {
        icon.style.transform = 'rotate(180deg)';
    } else {
        icon.style.transform = 'rotate(0deg)';
    }
}

function setSaga(saga) { appState.sagaFilter = saga; updateUI(); }
function setStatus(status) { appState.statusFilter = status; updateUI(); }
function setSearch(query) { appState.searchQuery = query.toLowerCase(); renderGrid(); } // Filtro de búsqueda

function updateUI() {
    ['all', 'Infinito', 'Multiverso'].forEach(s => {
        const btn = document.getElementById(`tab-saga-${s}`);
        btn.className = (s === appState.sagaFilter) 
            ? "flex-1 px-4 py-2 text-sm font-bold rounded-md transition-all bg-red-600 text-white shadow-md"
            : "flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all text-slate-400 hover:bg-slate-800 hover:text-white";
    });

    ['all', 'pending', 'watched'].forEach(s => {
        const btn = document.getElementById(`btn-status-${s}`);
        btn.className = (s === appState.statusFilter)
            ? "px-4 py-2 text-sm font-bold rounded-lg transition-all bg-slate-800 text-white border border-slate-700 shadow-md"
            : "px-4 py-2 text-sm font-medium rounded-lg transition-all text-slate-400 hover:text-white bg-transparent";
    });
    renderGrid();
}

function renderGrid() {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';

    const filtered = marvelDataset.filter(movie => {
        const isWatched = appState.watched.includes(movie.id);
        const matchStatus = appState.statusFilter === 'all' || 
                           (appState.statusFilter === 'watched' && isWatched) || 
                           (appState.statusFilter === 'pending' && !isWatched);
        const matchSaga = appState.sagaFilter === 'all' || movie.saga === appState.sagaFilter;
        const matchSearch = appState.searchQuery === '' || movie.title.toLowerCase().includes(appState.searchQuery);
        
        return matchStatus && matchSaga && matchSearch;
    });

    document.getElementById('progress-stats').innerText = `${appState.watched.length} / ${marvelDataset.length}`;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-16 text-slate-500 border border-dashed border-slate-800 rounded-xl bg-slate-900/50">
                <i class="fa-solid fa-satellite-dish text-4xl mb-4 block opacity-50"></i>
                <p>El radar no detecta producciones en esta categoría o búsqueda.</p>
            </div>`;
        return;
    }

    filtered.forEach(movie => {
        const isWatched = appState.watched.includes(movie.id);
        const hiddenList = movie.hiddenDetails.map(detail => `<li>- ${detail}</li>`).join('');
        
        const card = document.createElement('div');
        card.className = `flex flex-col border rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 transition-all duration-300 ${isWatched ? 'border-emerald-500/30 opacity-75' : 'border-slate-700 shadow-lg shadow-black/50'}`;
        
        card.innerHTML = `
            <div class="p-5 cursor-pointer hover:bg-slate-800/40 transition-colors group" onclick="toggleDetails('${movie.id}')">
                <div class="flex justify-between items-center gap-4">
                    <div class="flex-grow">
                        <div class="flex flex-wrap gap-2 mb-2">
                            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">${movie.phase}</span>
                            <span class="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded flex items-center gap-1">
                                <i class="fa-solid ${movie.type === 'Serie' ? 'fa-tv' : 'fa-film'}"></i> ${movie.type}
                            </span>
                        </div>
                        <h3 class="text-xl font-bold text-slate-100 leading-tight group-hover:text-red-500 transition-colors">${movie.title}</h3>
                        <p class="text-xs text-slate-400 mt-1"><i class="fa-regular fa-clock"></i> ${movie.setting}</p>
                    </div>
                    
                    <div class="flex items-center gap-4 shrink-0">
                        <button onclick="event.stopPropagation(); toggleWatched('${movie.id}')" class="flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all shadow-md hover:scale-105 ${isWatched ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-red-500 hover:text-red-500'}">
                            <i class="fa-solid fa-xl ${isWatched ? 'fa-check' : 'fa-power-off'}"></i>
                        </button>
                        <i id="icon-expand-${movie.id}" class="fa-solid fa-chevron-down text-slate-500 transition-transform duration-300"></i>
                    </div>
                </div>
            </div>
            
            <div id="details-${movie.id}" class="details-panel border-t border-slate-800/80 bg-slate-950/50">
                <div class="p-5 space-y-3">
                    <div class="bg-slate-900/80 rounded-lg p-3 border-l-2 border-l-red-600">
                        <p class="text-sm text-slate-300 leading-relaxed">${movie.preData}</p>
                    </div>
                    
                    <div class="flex items-center justify-between bg-amber-500/5 rounded-lg p-3 border border-amber-500/20">
                        <span class="text-xs font-bold text-amber-500 uppercase"><i class="fa-solid fa-gem"></i> Objeto Clave:</span>
                        <span class="text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-1 rounded">${movie.keyObject}</span>
                    </div>

                    <div class="flex items-center justify-between bg-slate-900 rounded-lg p-3 border border-slate-800">
                        <span class="text-xs font-bold text-slate-400 uppercase"><i class="fa-solid fa-clapperboard"></i> Post-Créditos:</span>
                        <span class="bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded">${movie.postCredits}</span>
                    </div>
                    <div class="bg-slate-900 rounded-lg p-3 border border-slate-800">
                        <h4 class="text-xs font-bold text-purple-400 uppercase mb-2"><i class="fa-solid fa-eye-low-vision"></i> Detalles (1%):</h4>
                        <ul class="text-xs text-slate-400 space-y-1 pl-1">${hiddenList}</ul>
                    </div>
                </div>
                
                <div class="bg-slate-950 border-t border-slate-900 p-4">
                    <div class="flex justify-between items-center mb-2">
                        <label class="text-xs font-bold text-slate-500 uppercase"><i class="fa-solid fa-pen-clip"></i> Tus Notas:</label>
                        <button id="btn-note-${movie.id}" onclick="saveNote('${movie.id}')" class="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                            <i class="fa-solid fa-floppy-disk"></i> Guardar
                        </button>
                    </div>
                    <textarea id="note-${movie.id}" class="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-red-500/50 resize-y min-h-[80px]" placeholder="Observaciones de campo..."></textarea>
                </div>
            </div>
        `;
        container.appendChild(card);
        
        // Inyección segura del texto del usuario para prevenir XSS
        document.getElementById(`note-${movie.id}`).value = appState.notes[movie.id] || '';
    });
}
