import { Project, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Neon Synthesis',
    category: 'Animación',
    year: '2024',
    description: 'Performance experimental de personajes explorando la transformación orgánica en el espacio digital.',
    fullDescription: 'Un reel cinematográfico de animación digital que combina simulaciones de movimiento con iluminación reactiva. Explora la relación entre la armadura cibernética y la fluidez del fuego digital a 60 FPS.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4bKeEYh9XdWGAQ2CFSL_4E8WmLHh3cRdkJIQx9_dZ6j0gzz5B3g7p9FBloAN57RRNvtj8H00FBq_5Mp8yPg7qLKnvkU-C2eoR9UIvrNPGiKaXC2Jo7H-iDXW9ZURk9qt51-4deAZ8LmfMGkAsgO2FEZPZtLH1Y9QcxFt9hH9M9JAIWjoAZA6RCHrYIaf8IH_rOJuzhxZeuz0UGzfHM7KyWiLIy-GcLa_V4euK8k2TzNsN7I7aA1RJVQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['After Effects', 'Cinema 4D', 'Redshift', 'Motion Graphics'],
    featured: true,
    client: 'CyberTech Studio',
    specs: [
      { label: 'Resolución', value: '4K Ultra HD' },
      { label: 'FPS', value: '60 FPS' },
      { label: 'Render Engine', value: 'Redshift GPU' },
      { label: 'Duración', value: '01:45 min' }
    ],
    createdAt: '2024-03-15'
  },
  {
    id: 'proj-2',
    title: 'Ignis Vanguard',
    category: 'Ilustración',
    year: '2024',
    description: 'Diseño de personaje cibernético envuelto en llamas digitales con estética brutalista.',
    fullDescription: 'Ilustración conceptual de alto impacto que representa a un guerrero futurista alimentado por el fuego de la energía ignia. Pintura digital avanzada con enfoque en volumen y pinceladas de textura orgánica.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tags: ['Photoshop', 'Pintura Digital', 'Character Design'],
    featured: true,
    client: 'Jovas Original',
    specs: [
      { label: 'Técnica', value: 'Digital Painting' },
      { label: 'Herramienta', value: 'Photoshop 2024' },
      { label: 'DPI', value: '300 DPI High-Res' }
    ],
    createdAt: '2024-02-20'
  },
  {
    id: 'proj-3',
    title: 'Cyber Sanctuary',
    category: 'Modelado 3D',
    year: '2024',
    description: 'Visualización arquitectónica 3D de un santuario futurista con iluminación neón.',
    fullDescription: 'Espacio interior cibernético diseñado con líneas geométricas afiladas y luz ambiental cálida. Se utilizó modelado poligonal de alta precisión con texturas PBR realistas y niebla volumétrica.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaOYQYUw06Ny1XAHTsDwOFbOSTOo3zDdl8MjM3Yd580-WEo0Q0wlbioj3kdyrcVXGY7bKcyS7r-ZkOYXdlJd_94nRk2lEBeoFIX3F_7XHRL2rRdtlg0emtyL0TDi2kjJACUkITellHpdqtXTqrK6VJO-un3WSnHeEyA5XsJXDuWTA7oo2uDNY_CU_U1jB_vs1A1omWU_kRcLePwLpOBemevbYS63w7MH_ZGeV2MOCK1d6z9J6cVqzu6w',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    tags: ['Cinema 4D', 'Redshift', 'Hard Surface', 'ArchViz'],
    featured: true,
    client: 'NeoTokyo Labs',
    specs: [
      { label: 'Polígonos', value: '2.4M Polys' },
      { label: 'Luces', value: 'Volumetric Neons' },
      { label: 'Materiales', value: 'PBR 8K Textures' }
    ],
    createdAt: '2024-01-10'
  },
  {
    id: 'proj-4',
    title: 'Santuario de la Espada',
    category: 'Arte Conceptual',
    year: '2024',
    description: 'Arte conceptual cinematográfico de una espada mística en un bosque ancestral.',
    fullDescription: 'Pieza de desarrollo conceptual para videojuego AAA. Representa el hallazgo de un artefacto dorado iluminado por rayos de luz natural en un entorno de ruinas antiguas cubiertas de musgo.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB89Bjx9EZKKcWk1gJGr4hm4lXaOxr9fOAeieKeqkApqv5-6_Ru6BjYsQCYwBaYvjFHSU0ycOUHRTREVYhafcOnL5flTOeEU8q8CFrYRewcacOGjkQBuKrMZpC2N_Re1bUQEowtvwFFnik6Gc-ixIG3ZKOyHKplkOJrUHnIsi06eLxQlFfuJpszqegsjbBf3hwXW2WGIOFj0tf_sj3sbZNGe6M32WFuEDzPRLar3mibhsihdC6vhYUnMQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    tags: ['Arte Conceptual', 'Matte Painting', 'World Building'],
    featured: true,
    client: 'Aethelgard Game Studio',
    specs: [
      { label: 'Estilo', value: 'Cinematic Matte' },
      { label: 'Uso', value: 'Keyframe Concept' }
    ],
    createdAt: '2024-04-01'
  },
  {
    id: 'proj-5',
    title: 'Kinetic Brutalism',
    category: 'Animación',
    year: '2023',
    description: 'Animación abstracta basada en sistemas para branding tecnológico de lujo.',
    fullDescription: 'Campaña en movimiento utilizando bloques tridimensionales en negro mate y dorado fiero. Transiciones agresivas de cámara para resaltar estructuras cinéticas.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_QJCZpKDchGpyuiJqDANZEb7xFerQyq2v774iIB2wSoNfFMq2YRmwP1HAnY8Sr8_RvETAx_BR0nGGSdYzuFANbAkSFGbcIsLImq2E8X8TrvjucSAOmgxl1tYYTj63H6H5jMH6QuC0eIUQH-SYgO01-T07HbkSofbjNr_X_iZ07vyGaeJEM1BU0Qp4dPvcsKhW4U3gj3qFwtKs1y290PYnAVk2WdZS0z8wZR_c4Er3woDi0TGbrQxKXg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tags: ['After Effects', 'Cinema 4D', 'Brutalism', '3D Motion'],
    featured: false,
    client: 'Apex Luxury Tech',
    specs: [
      { label: 'Motor', value: 'Octane Render' },
      { label: 'Formato', value: 'Vertical 9:16 & 16:9' }
    ],
    createdAt: '2023-11-18'
  },
  {
    id: 'proj-6',
    title: 'Precision Core',
    category: 'Modelado 3D',
    year: '2024',
    description: 'Estudio de topología mecánica de un turbo e ingeniería de superficie dura.',
    fullDescription: 'Estudio de malla wireframe y renderizado de superficie dura para piezas automotrices y aeroespaciales. Precisión quirúrgica en flujo de polígonos sin distorsión.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzheQf0AZqF--ckR64EQA8DwzcEK5LrNSYwYWIw6bhWET4RcIkDWZYJX32c-iVkq4n-M_hxz32RKIgN4dwG5Y2KgofnDN95AhkwTM1O1QYRyMVMJTvfZGQg-tDe6J2vB3iZ_MetXzWOx85NG1m2Ki6-AUhziFcNkDsr-7srLcgxZsaL624WvNfQR0PLZozHBGYZlrXX2R2erLMO18NreAsqT2od1R5GC0IG51enLwGjTLxyKPadYCiXQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['ZBrush', 'Cinema 4D', 'Topology', 'Hard Surface'],
    featured: false,
    client: 'Hyperion Dynamics',
    specs: [
      { label: 'Técnica', value: 'SubD Modeling' },
      { label: 'Malla', value: 'Quads Only' }
    ],
    createdAt: '2024-02-05'
  },
  {
    id: 'proj-7',
    title: 'Ruinas al Atardecer',
    category: 'Arte Conceptual',
    year: '2023',
    description: 'Ruinas de piedra ancestrales contra un atardecer incandescente en el desierto.',
    fullDescription: 'Ilustración del ambiente para escenario de fantasía épica. Iluminación trasera de alto contraste que realza los sillares de piedra y la niebla del desierto.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIi3GbjvkwDr1NtuiAZgVf0LYslc8mPla-KZxGvLW6Xjpa6WD2A9QuLQ5Y026QWJ0xrqFVzqAFecHoo-6DVV4YqMY6EPwEBfTYB1YZaILrEckYL1j3qZxrGKHDc0U4dvhWsCpFw-IxZj4IX6n3d_jrOd0TMUDEtBpsE6BVDWQF508UzPDEZ3wo6myxjjPfti96DVmxud0DPLbqolbMItHGubM9FHXbsdhTqAAYRh09_3bzpTf76_CDPw',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    tags: ['Arte Conceptual', 'Environment Design', 'Photoshop'],
    featured: false,
    client: 'Vanguard Films',
    specs: [
      { label: 'Mood', value: 'Epic Twilight' },
      { label: 'Pinceles', value: 'Custom Oil Brushes' }
    ],
    createdAt: '2023-09-30'
  },
  {
    id: 'proj-8',
    title: 'Solaris Particles',
    category: 'Animación',
    year: '2024',
    description: 'Simulación de partículas fluidas doradas con físicas de vórtice reactivo.',
    fullDescription: 'Experimento visual de simulación de fluidos ígneos creados en Houdini y renderizados en Redshift con profundidad de campo de alta velocidad.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCuGCaHrz-D3HqKj1jSwrlRwf6r9x851bXLeU0Wf96gdJN5C-F6kyJYWKo2F9AUkzFgSfzHBYJkO7XbxuZ97NPixF4AvbuugPYCVW09IlsXpjCGPdvVKU2usvoc8rHPxMW-SFsFJdLCTJzpDLxuH3lIZC4mtKg0MlwVtt4fOgtuLy8gx2gw3HtMQH4N6vleKXowL_RALpVoI48C_y3_OSUUPrGZJyVNPmYcsFl1WrTlkl_c5O3Fdu9ew',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    tags: ['Houdini', 'Particles', 'VFX', 'Redshift'],
    featured: false,
    client: 'Solaris VFX',
    specs: [
      { label: 'Simulación', value: '10M Particles' },
      { label: 'Software', value: 'SideFX Houdini' }
    ],
    createdAt: '2024-03-01'
  },
  {
    id: 'proj-9',
    title: 'Vanguard Unit',
    category: 'Modelado 3D',
    year: '2024',
    description: 'Escultura 3D de cabeza cyborg con fibra de carbono mate y ojos incandescentes.',
    fullDescription: 'Busto cyborg de alta resolución modelado en ZBrush, texturizado en Substance Painter y compuesto en Photoshop con luz de acento en rojo primario.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxrJALEuVMwooR2IWjx-nlwqi8-mQhQFKH__86gxcbrfGdIa1sN6TvAbb5umzkXhm8mUP1nM0t3PGqiezBCRsySBsTU8T8f9_H25jnSx4DRE2Wijro_olox7CgFKdrxaSnzO8z8MfguZr28hgW5AOIxjeXxAXlfrc8OUCEyLyQNM3Sr25HRNUJDnMpPieu3VpWl5kq7yTA-Fj5r7HRx2kiVINkxgH3bSOIkm47ahN6oOG7VIE-eesdrQ',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    tags: ['ZBrush', 'Substance Painter', 'Character Sculpting'],
    featured: false,
    client: 'Titan VR',
    specs: [
      { label: 'Textures', value: '4K UDIMs' },
      { label: 'Format', value: 'FBX / OBJ / C4D' }
    ],
    createdAt: '2024-01-25'
  }
];

export const initialProfile: UserProfile = {
  name: 'José Luis Vasquez',
  title: 'Diseñador de Movimiento & Artista 3D',
  tagline: 'Encendiendo el movimiento a través del diseño técnico y el fuego creativo.',
  bioParagraphs: [
    'Mi nombre es José Luis Vasquez, y no solo diseño, sino que soluciono problemas con creatividad y propósito. Soy un diseñador impulsado por una sed insaciable de aprender y una curiosidad que me lleva a dominar mi oficio cada día más.',
    'Veo cada proyecto como una oportunidad para crecer, y cada desafío no es un obstáculo, sino un escalón hacia algo más grande. Para mí, los errores son maestros que me permiten levantarme con una visión más clara y un conjunto de habilidades más pulido.',
    'Más que crear imágenes, mi meta es evolucionar con cada trabajo que hago. Busco ser un profesional completo, alguien que se transforma y aprende con cada trazo, cada idea y cada desafío.'
  ],
  experienceYears: '5+ Años',
  projectsCompletedCount: '120+',
  email: 'jovas.motion@design.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA',
  socialLinks: {
    instagram: 'https://instagram.com',
    artstation: 'https://artstation.com',
    linkedin: 'https://linkedin.com',
    behance: 'https://behance.net',
    vimeo: 'https://vimeo.com'
  }
};

export const initialBrandAssets: BrandAssets = {
  logoUrl: '',
  brandText: 'JOVAS',
  brandSubtext: 'Motion Design',
  heroText: 'ENCENDIENDO EL MOVIMIENTO A TRAVÉS DEL DISEÑO',
  heroSubtext: 'JOVAS Diseñador de Movimiento. Creando experiencias digitales viscerales donde la energía del fuego creativo se encuentra con la precisión del movimiento técnico.'
};

export const initialMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Director Creativo @ Meta',
    email: 'creative@meta.com',
    projectType: 'Modelado 3D & Animación',
    budget: '$5,000 - $10,000',
    message: 'Me encantó tu trabajo de modelado 3D y animación para Cyber Sanctuary. Queremos colaborar para una secuencia de títulos 3D en nuestro nuevo proyecto de realidad mixta.',
    date: 'Hace 2 horas',
    read: false
  },
  {
    id: 'msg-2',
    name: 'James K. (Líder de Estudio)',
    email: 'james@vanguardgame.com',
    projectType: 'Arte Conceptual & Motion',
    budget: '$10,000+',
    message: 'Consulta de proyecto para motion graphics e ilustración de personajes para un juego independiente AAA. ¿Tienes disponibilidad este próximo mes?',
    date: 'Ayer',
    read: false
  },
  {
    id: 'msg-3',
    name: 'Aria Luna (Freelancer)',
    email: 'aria.luna@studio.io',
    projectType: 'Ilustración Digital',
    budget: '$2,000 - $5,000',
    message: 'Solicitud de colaboración para portadas digitales de soundtrack de videojuegos. Me impresionó tu paleta de colores ígnea.',
    date: 'Hace 3 días',
    read: true
  }
];

export const initialStats: Stats = {
  totalViews: '12.8K',
  newLeadsCount: 42,
  activeProjectsCount: 8,
  retentionRate: '76%'
};
