const marvelDataset = [
    {
        id: "iron-man-1", title: "Iron Man", saga: "Infinito", phase: "Arco 1: La Iniciativa", type: "Película", setting: "Año 2008", postCredits: 1,
        preData: "La piedra angular. Observa el desarrollo tecnológico y la redención del capitalista.",
        hiddenDetails: ["La corporación Roxxon aparece en un edificio.", "El escudo a medio terminar del Capitán América."],
        keyObject: "El Reactor Arc"
    },
    {
        id: "iron-man-2", title: "Iron Man 2", saga: "Infinito", phase: "Arco 1: La Iniciativa", type: "Película", setting: "Año 2010", postCredits: 1,
        preData: "Inicia 'La Gran Semana de Fury'. Ocurre al mismo tiempo que Hulk y Thor.",
        hiddenDetails: ["En el mapa holográfico hay un marcador en Wakanda (Black Panther)."],
        keyObject: "Nuevo elemento (Badassium)"
    },
    {
        id: "hulk-1", title: "El Increíble Hulk", saga: "Infinito", phase: "Arco 1: La Iniciativa", type: "Película", setting: "Año 2010", postCredits: 1,
        preData: "Explora la dualidad y los intentos del gobierno por recrear el suero del Súper Soldado.",
        hiddenDetails: ["Industrias Stark proporciona la tecnología sónica del ejército."],
        keyObject: "La sangre de Banner"
    },
    {
        id: "thor-1", title: "Thor", saga: "Infinito", phase: "Arco 1: La Iniciativa", type: "Película", setting: "Año 2011", postCredits: 1,
        preData: "Introduce la magia como ciencia avanzada y a Loki, el catalizador de los Vengadores.",
        hiddenDetails: ["Ojo de Halcón hace su primera aparición táctica."],
        keyObject: "Mjolnir"
    },
    {
        id: "cap-america-1", title: "Capitán América: El Primer Vengador", saga: "Infinito", phase: "Arco 1: La Iniciativa", type: "Película", setting: "1943 - 1945", postCredits: 1,
        preData: "El cimiento moral del universo. Su sacrificio cierra el arco de la Fase 1.",
        hiddenDetails: ["Primera aparición del Teseracto (Gema del Espacio)."],
        keyObject: "El Suero del Súper Soldado"
    },
    {
        id: "avengers-1", title: "The Avengers", saga: "Infinito", phase: "Arco 2: Ensamblaje", type: "Película", setting: "Año 2012", postCredits: 2,
        preData: "El trauma de esta batalla definirá a Tony Stark por los próximos 10 años.",
        hiddenDetails: ["Thanos manipula todo desde las sombras por primera vez."],
        keyObject: "El Cetro de Loki (Gema de la Mente)"
    },
    {
        id: "daredevil-s1", title: "Daredevil (Temp. 1 y 2)", saga: "Infinito", phase: "Arco 2.5: Nivel Callejero", type: "Serie", setting: "Post-2012", postCredits: 0,
        preData: "Las consecuencias reales de la Batalla de NY. Kingpin se adueña de la reconstrucción.",
        hiddenDetails: ["La mafia usa contratos de reconstrucción de Industrias Stark."],
        keyObject: "El traje táctico y Hell's Kitchen"
    },
    {
        id: "winter-soldier", title: "Capitán América: El Soldado de Invierno", saga: "Infinito", phase: "Arco 3: La Caída", type: "Película", setting: "Año 2014", postCredits: 2,
        preData: "Destruye a SHIELD y expone los secretos del mundo. Espionaje puro.",
        hiddenDetails: ["Se menciona a Stephen Strange como una amenaza actual."],
        keyObject: "Helicarriers del Proyecto Insight"
    },
    {
        id: "gotg-1", title: "Guardianes de la Galaxia", saga: "Infinito", phase: "Arco 3: Cósmico", type: "Película", setting: "Año 2014", postCredits: 2,
        preData: "Corta la tensión terrestre para explicar qué son las Gemas del Infinito.",
        hiddenDetails: ["El Coleccionista tiene un Elfo Oscuro y un Chitauri encerrados."],
        keyObject: "El Orbe (Gema del Poder)"
    },
    {
        id: "avengers-2", title: "Avengers: Era de Ultrón", saga: "Infinito", phase: "Arco 4: Milagros", type: "Película", setting: "Año 2015", postCredits: 1,
        preData: "El miedo de Stark crea un monstruo. Introduce a Wanda Maximoff y a Visión.",
        hiddenDetails: ["La escena del hacha de Thor presagia su forja de la Stormbreaker en Infinity War."],
        keyObject: "La cuna de regeneración"
    },
    {
        id: "ant-man-1", title: "Ant-Man", saga: "Infinito", phase: "Arco 4: Milagros", type: "Película", setting: "Año 2015", postCredits: 2,
        preData: "El puente de calma que introduce el Reino Cuántico, clave para el futuro.",
        hiddenDetails: ["Se menciona a 'un tipo que salta y trepa paredes' (Spiderman)."],
        keyObject: "Las Partículas Pym"
    },
    {
        id: "civil-war", title: "Capitán América: Civil War", saga: "Infinito", phase: "Arco 5: Fractura", type: "Película", setting: "Año 2016", postCredits: 2,
        preData: "Pierden contra Thanos porque aquí se dividen. Introduce a Black Panther y Spiderman.",
        hiddenDetails: ["El vehículo del asesinato en 1991 transportaba suero de súper soldado."],
        keyObject: "Los Acuerdos de Sokovia"
    },
    {
        id: "spiderman-homecoming", title: "Spider-Man: Homecoming", saga: "Infinito", phase: "Arco 5: Fractura", type: "Película", setting: "Año 2016", postCredits: 2,
        preData: "Las consecuencias de nivel de calle de la chatarra alienígena. La relación mentor-alumno con Tony Stark.",
        hiddenDetails: ["El Buitre recolectó tecnología de la Batalla de NY, Sokovia y Lagos."],
        keyObject: "La tecnología Chitauri modificada"
    },
    {
        id: "black-widow", title: "Black Widow", saga: "Infinito", phase: "Arco 5: Fractura", type: "Película", setting: "Año 2016", postCredits: 1,
        preData: "REGLA EXPERTA: La película va aquí, pero NO veas la escena post-créditos hasta después de Endgame.",
        hiddenDetails: ["El chaleco que Yelena compra es el mismo que Natasha usa en Infinity War."],
        keyObject: "El antídoto rojo"
    },
    {
        id: "black-panther", title: "Black Panther", saga: "Infinito", phase: "Arco 5: Fractura", type: "Película", setting: "Año 2016", postCredits: 2,
        preData: "Las consecuencias de la muerte de T'Chaka en Civil War y la apertura de Wakanda.",
        hiddenDetails: ["El escudo de Bucky (Lobo Blanco) se empieza a forjar al final."],
        keyObject: "La Hierba en forma de Corazón (Vibranium)"
    },
    {
        id: "dr-strange", title: "Doctor Strange", saga: "Infinito", phase: "Arco 6: Magia", type: "Película", setting: "Año 2016-2017", postCredits: 2,
        preData: "Abre el multiverso mágico y presenta la Gema del Tiempo.",
        hiddenDetails: ["En el teléfono de Strange antes del choque, le ofrecen el caso del soldado lesionado en Civil War."],
        keyObject: "El Ojo de Agamotto"
    },
    {
        id: "thor-3", title: "Thor: Ragnarok", saga: "Infinito", phase: "Arco 6: Magia", type: "Película", setting: "Año 2017", postCredits: 2,
        preData: "Destruye Asgard para que Thor no tenga hogar en Infinity War. La post-créditos es el inicio directo de Thanos.",
        hiddenDetails: ["El Guantelete del Infinito de Odín se revela como falso."],
        keyObject: "La Llama Eterna"
    },
    {
        id: "infinity-war", title: "Avengers: Infinity War", saga: "Infinito", phase: "Arco 7: Clímax", type: "Película", setting: "Año 2018", postCredits: 1,
        preData: "Thanos es el protagonista. Los héroes fallan por negarse a sacrificar vidas.",
        hiddenDetails: ["Cráneo Rojo reaparece como guardián de Vormir."],
        keyObject: "El Guantelete del Infinito"
    },
    {
        id: "ant-man-2", title: "Ant-Man and The Wasp", saga: "Infinito", phase: "Arco 7: Clímax", type: "Película", setting: "Año 2018", postCredits: 2,
        preData: "Muestra qué pasaba con ellos durante Infinity War. La post-créditos es un golpe durísimo.",
        hiddenDetails: ["El túnel cuántico será la única salvación futura."],
        keyObject: "El Túnel Cuántico móvil"
    },
    {
        id: "captain-marvel", title: "Capitana Marvel", saga: "Infinito", phase: "Arco 7: Clímax", type: "Película", setting: "Año 1995", postCredits: 2,
        preData: "Precuela cronológica. REGLA EXPERTA: Verla aquí para mantener el misterio de Fury y el origen del nombre 'Avengers'.",
        hiddenDetails: ["El nombre del proyecto 'Iniciativa Vengadores' proviene de la nave de Carol."],
        keyObject: "El Buscapersonas modificado"
    },
    {
        id: "endgame", title: "Avengers: Endgame", saga: "Infinito", phase: "Arco 7: Clímax", type: "Película", setting: "Año 2018 - 2023", postCredits: 0,
        preData: "El cierre magistral. No alteran el pasado, crean ramas temporales.",
        hiddenDetails: ["El sonido final sin video es el martilleo de Tony en la primera película."],
        keyObject: "El Guantelete de Stark"
    },
    {
        id: "spiderman-far-from-home", title: "Spider-Man: Far From Home", saga: "Infinito", phase: "Arco 7: Epílogo", type: "Película", setting: "Año 2024", postCredits: 2,
        preData: "El verdadero final de la Saga del Infinito. El mundo post-Blip y el legado de Tony.",
        hiddenDetails: ["Mysterio y su equipo son exempleados rencorosos de Industrias Stark."],
        keyObject: "Gafas EDITH"
    },
    {
        id: "wandavision", title: "WandaVision", saga: "Multiverso", phase: "Arco 1: El Luto", type: "Serie", setting: "Año 2023", postCredits: 3,
        preData: "El trauma no procesado de Wanda altera la realidad. Fundamental para Doctor Strange 2.",
        hiddenDetails: ["Los comerciales de televisión representan traumas del pasado de Wanda."],
        keyObject: "El Darkhold"
    },
    {
        id: "loki-s1-2", title: "Loki (Temp. 1 y 2)", saga: "Multiverso", phase: "Arco 2: Caos Temporal", type: "Serie", setting: "Fuera del Tiempo", postCredits: 1,
        preData: "Explica mecánicamente cómo funciona el multiverso y libera las líneas temporales.",
        hiddenDetails: ["Aquel que Permanece orquestó silenciosamente toda la Saga del Infinito."],
        keyObject: "El Telar Temporal"
    },
    {
        id: "spiderman-nwh", title: "Spider-Man: No Way Home", saga: "Multiverso", phase: "Arco 2: Colisión", type: "Película", setting: "Año 2024", postCredits: 2,
        preData: "El colapso multiversal. Peter asume las consecuencias de la magia irresponsable.",
        hiddenDetails: ["Aparición de Matt Murdock (Daredevil) confirmando el nivel callejero."],
        keyObject: "La Macchina de Kadavus"
    },
        {
        id: "dr-strange-2", title: "Doctor Strange en el Multiverso de la Locura", saga: "Multiverso", phase: "Arco 2: Colisión", type: "Película", setting: "Año 2024", postCredits: 2,
        preData: "Consecuencia directa de WandaVision. Muestra lo peligroso que es viajar entre universos (Incursiones).",
        hiddenDetails: ["La aparición de los Illuminati confirma que los universos de Fox (X-Men) y Marvel coexisten.", "El Darkhold corrompe a quien lo usa, igual que en Agents of SHIELD."],
        keyObject: "El Libro de los Vishanti"
    },
    {
        id: "shang-chi", title: "Shang-Chi y la Leyenda de los Diez Anillos", saga: "Multiverso", phase: "Arco 3: Nuevos Pilares", type: "Película", setting: "Año 2024", postCredits: 2,
        preData: "Expande el lado místico/alienígena y reconecta con la organización terrorista de la primera película de Iron Man.",
        hiddenDetails: ["Se ve a Wong peleando con Abominación (villano de El Increíble Hulk) en el club de pelea."],
        keyObject: "Los Diez Anillos"
    },
    {
        id: "black-panther-2", title: "Black Panther: Wakanda Forever", saga: "Multiverso", phase: "Arco 3: Nuevos Pilares", type: "Película", setting: "Año 2025", postCredits: 1,
        preData: "Un cierre emocional por la pérdida de Chadwick Boseman. Introduce a los mutantes con Namor.",
        hiddenDetails: ["La directora de la CIA, Val, sigue reclutando personajes en las sombras para su propio equipo (Thunderbolts)."],
        keyObject: "El Vibranium Submarino"
    },
    {
        id: "ant-man-3", title: "Ant-Man and The Wasp: Quantumania", saga: "Multiverso", phase: "Arco 4: Dinastía", type: "Película", setting: "Año 2026", postCredits: 2,
        preData: "Presenta la amenaza física de Kang el Conquistador y el Consejo de Kangs.",
        hiddenDetails: ["Los anillos tecnológicos del núcleo de la nave de Kang comparten el mismo diseño visual que los Diez Anillos de Shang-Chi."],
        keyObject: "El Núcleo de Energía Multiversal"
    },
    {
        id: "gotg-3", title: "Guardianes de la Galaxia Vol. 3", saga: "Multiverso", phase: "Arco 5: Despedidas", type: "Película", setting: "Año 2026", postCredits: 2,
        preData: "El final definitivo del equipo original. No trata sobre el multiverso, trata sobre sanar traumas del pasado.",
        hiddenDetails: ["Phyla-Vell (una de las niñas rescatadas al final) es una de las heroínas cósmicas más poderosas en los cómics."],
        keyObject: "El código de anulación de Rocket"
    },
    {
        id: "deadpool-3", title: "Deadpool & Wolverine", saga: "Multiverso", phase: "Arco 6: El Ancla", type: "Película", setting: "Año 2024 / Vacío Temporal", postCredits: 1,
        preData: "Crucial. Conecta oficialmente el universo extinto de Fox (X-Men) con el UCM e introduce el concepto del 'Ser Ancla'.",
        hiddenDetails: ["El logo de 20th Century Fox está destruido en el fondo del Vacío.", "Múltiples referencias directas a Loki y la Autoridad de Variación Temporal (TVA)."],
        keyObject: "El Crono-Rastreador de la TVA"
    } 
];
