import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';

export const initialProjects: Project[] = [
  {
    "id": "proj-1",
    "title": "Animacion Digital",
    "category": "Animación",
    "year": "2024",
    "description": "Performance experimental de personajes explorando la transformación orgánica en el espacio digital.",
    "fullDescription": "Un reel cinematográfico de animación digital que combina simulaciones de movimiento con iluminación reactiva. Explora la relación entre la armadura cibernética y la fluidez del fuego digital a 60 FPS.",
    "imageUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-99648-large.mp4",
    "tags": [
      "After Effects",
      "Cinema 4D",
      "Redshift",
      "Motion Graphics"
    ],
    "featured": true,
    "client": "Jovas Media Reel",
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      },
      {
        "label": "Render Engine",
        "value": "Redshift GPU"
      },
      {
        "label": "Duración",
        "value": "01:45 min"
      }
    ],
    "createdAt": "2024-03-15"
  },
  {
    "id": "proj-2",
    "title": "Ignis Vanguard",
    "category": "Ilustración",
    "year": "2024",
    "description": "Diseño de personaje cibernético envuelto en llamas digitales con estética brutalista.",
    "fullDescription": "Ilustración conceptual de alto impacto que representa a un guerrero futurista alimentado por el fuego de la energía ignia. Pintura digital avanzada con enfoque en volumen y pinceladas de textura orgánica.",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-character-40615-large.mp4",
    "tags": [
      "Photoshop",
      "Pintura Digital",
      "Character Design"
    ],
    "featured": true,
    "client": "Jovas Original",
    "specs": [
      {
        "label": "Técnica",
        "value": "Digital Painting"
      },
      {
        "label": "Herramienta",
        "value": "Photoshop 2024"
      },
      {
        "label": "DPI",
        "value": "300 DPI High-Res"
      }
    ],
    "createdAt": "2024-02-20"
  },
  {
    "id": "proj-3",
    "title": "Cyber Sanctuary",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Visualización arquitectónica 3D de un santuario futurista con iluminación neón.",
    "fullDescription": "Espacio interior cibernético diseñado con líneas geométricas afiladas y luz ambiental cálida. Se utilizó modelado poligonal de alta precisión con texturas PBR realistas y niebla volumétrica.",
    "imageUrl": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41566-large.mp4",
    "tags": [
      "Cinema 4D",
      "Redshift",
      "Hard Surface",
      "ArchViz"
    ],
    "featured": true,
    "client": "NeoTokyo Labs",
    "specs": [
      {
        "label": "Polígonos",
        "value": "2.4M Polys"
      },
      {
        "label": "Luces",
        "value": "Volumetric Neons"
      },
      {
        "label": "Materiales",
        "value": "PBR 8K Textures"
      }
    ],
    "createdAt": "2024-01-10"
  },
  {
    "id": "proj-4",
    "title": "Santuario de la Espada",
    "category": "Arte Conceptual",
    "year": "2024",
    "description": "Arte conceptual cinematográfico de una espada mística en un bosque ancestral.",
    "fullDescription": "Pieza de desarrollo conceptual para videojuego AAA. Representa el hallazgo de un artefacto dorado iluminado por rayos de luz natural en un entorno de ruinas antiguas cubiertas de musgo.",
    "imageUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-particles-background-41567-large.mp4",
    "tags": [
      "Arte Conceptual",
      "Matte Painting",
      "World Building"
    ],
    "featured": true,
    "client": "Aethelgard Game Studio",
    "specs": [
      {
        "label": "Estilo",
        "value": "Cinematic Matte"
      },
      {
        "label": "Uso",
        "value": "Keyframe Concept"
      }
    ],
    "createdAt": "2024-04-01"
  },
  {
    "id": "proj-5",
    "title": "Kinetic Brutalism",
    "category": "Animación",
    "year": "2023",
    "description": "Animación abstracta basada en sistemas para branding tecnológico de lujo.",
    "fullDescription": "Campaña en movimiento utilizando bloques tridimensionales en negro mate y dorado fiero. Transiciones agresivas de cámara para resaltar estructuras cinéticas.",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-99648-large.mp4",
    "tags": [
      "After Effects",
      "Cinema 4D",
      "Brutalism",
      "3D Motion"
    ],
    "featured": false,
    "client": "Apex Luxury Tech",
    "specs": [
      {
        "label": "Motor",
        "value": "Octane Render"
      },
      {
        "label": "Formato",
        "value": "Vertical 9:16 & 16:9"
      }
    ],
    "createdAt": "2023-11-18"
  },
  {
    "id": "proj-6",
    "title": "Precision Core",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Estudio de topología mecánica de un turbo e ingeniería de superficie dura.",
    "fullDescription": "Estudio de malla wireframe y renderizado de superficie dura para piezas automotrices y aeroespaciales. Precisión quirúrgica en flujo de polígonos sin distorsión.",
    "imageUrl": "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-character-40615-large.mp4",
    "tags": [
      "ZBrush",
      "Cinema 4D",
      "Topology",
      "Hard Surface"
    ],
    "featured": false,
    "client": "Hyperion Dynamics",
    "specs": [
      {
        "label": "Técnica",
        "value": "SubD Modeling"
      },
      {
        "label": "Malla",
        "value": "Quads Only"
      }
    ],
    "createdAt": "2024-02-05"
  },
  {
    "id": "proj-7",
    "title": "Ruinas al Atardecer",
    "category": "Arte Conceptual",
    "year": "2023",
    "description": "Ruinas de piedra ancestrales contra un atardecer incandescente en el desierto.",
    "fullDescription": "Ilustración del ambiente para escenario de fantasía épica. Iluminación trasera de alto contraste que realza los sillares de piedra y la niebla del desierto.",
    "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41566-large.mp4",
    "tags": [
      "Arte Conceptual",
      "Environment Design",
      "Photoshop"
    ],
    "featured": false,
    "client": "Vanguard Films",
    "specs": [
      {
        "label": "Mood",
        "value": "Epic Twilight"
      },
      {
        "label": "Pinceles",
        "value": "Custom Oil Brushes"
      }
    ],
    "createdAt": "2023-09-30"
  },
  {
    "id": "proj-8",
    "title": "Solaris Particles",
    "category": "Animación",
    "year": "2024",
    "description": "Simulación de partículas fluidas doradas con físicas de vórtice reactivo.",
    "fullDescription": "Experimento visual de simulación de fluidos ígneos creados en Houdini y renderizados en Redshift con profundidad de campo de alta velocidad.",
    "imageUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-particles-background-41567-large.mp4",
    "tags": [
      "Houdini",
      "Particles",
      "VFX",
      "Redshift"
    ],
    "featured": false,
    "client": "Solaris VFX",
    "specs": [
      {
        "label": "Simulación",
        "value": "10M Particles"
      },
      {
        "label": "Software",
        "value": "SideFX Houdini"
      }
    ],
    "createdAt": "2024-03-01"
  },
  {
    "id": "proj-9",
    "title": "Vanguard Unit",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Escultura 3D de cabeza cyborg con fibra de carbono mate y ojos incandescentes.",
    "fullDescription": "Busto cyborg de alta resolución modelado en ZBrush, texturizado en Substance Painter y compuesto en Photoshop con luz de acento en rojo primario.",
    "imageUrl": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-character-40615-large.mp4",
    "tags": [
      "ZBrush",
      "Substance Painter",
      "Character Sculpting"
    ],
    "featured": false,
    "client": "Titan VR",
    "specs": [
      {
        "label": "Textures",
        "value": "4K UDIMs"
      },
      {
        "label": "Format",
        "value": "FBX / OBJ / C4D"
      }
    ],
    "createdAt": "2024-01-25"
  },
  {
    "id": "proj-10",
    "title": "Chrono Engine 3D",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Mecanismo de reloj cibernético con engranes flotantes e iluminación holográfica.",
    "fullDescription": "Demostración técnica de animación mecánica compleja. Más de 100 piezas articuladas con simulación de engranajes sincronizados y materiales metálicos pulidos.",
    "imageUrl": "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-99648-large.mp4",
    "tags": [
      "Cinema 4D",
      "Redshift",
      "Hard Surface",
      "Mechanical"
    ],
    "featured": true,
    "client": "Chrono Clockworks",
    "specs": [
      {
        "label": "Piezas 3D",
        "value": "120+ Rigged Parts"
      },
      {
        "label": "Render",
        "value": "Redshift GPU"
      }
    ],
    "createdAt": "2024-04-10"
  },
  {
    "id": "proj-11",
    "title": "Neon Odyssey Reel",
    "category": "Animación",
    "year": "2024",
    "description": "Reel promocional con tipografía 3D cinética y transiciones de luz en neón magenta y dorado.",
    "fullDescription": "Secuencia tipográfica en movimiento de alto ritmo diseñada para eventos de música electrónica y festivales digitales de vanguardia.",
    "imageUrl": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-particles-background-41567-large.mp4",
    "tags": [
      "After Effects",
      "Kinetic Type",
      "Motion Graphics"
    ],
    "featured": true,
    "client": "Odyssey Nightlife",
    "specs": [
      {
        "label": "FPS",
        "value": "60 FPS"
      },
      {
        "label": "Estilo",
        "value": "Cyberpunk Neon"
      }
    ],
    "createdAt": "2024-04-05"
  },
  {
    "id": "proj-12",
    "title": "Titan Protocol",
    "category": "Arte Conceptual",
    "year": "2024",
    "description": "Diseño de mech gigante patrullando una metrópolis lluviosa en estética cyberpunk.",
    "fullDescription": "Concept art de escenario nocturno con niebla volumétrica, reflejos de neón en pavimento mojado y presencia imponente de unidades cibernéticas.",
    "imageUrl": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-character-40615-large.mp4",
    "tags": [
      "Photoshop",
      "Matte Painting",
      "Cyberpunk",
      "Concept Art"
    ],
    "featured": true,
    "client": "NeoCity Studios",
    "specs": [
      {
        "label": "Resolución",
        "value": "8K Keyframe"
      },
      {
        "label": "Técnica",
        "value": "2D/3D Hybrid"
      }
    ],
    "createdAt": "2024-03-28"
  },
  {
    "id": "proj-13",
    "title": "Aetheria Nexus",
    "category": "Ilustración",
    "year": "2024",
    "description": "Ilustración conceptual de portal dimensional canalizando energía de plasma y destellos ígneos.",
    "fullDescription": "Pintura digital envolvente con alto grado de detalle en partículas glowing, vórtice de luz de plasma y atmósfera cósmica.",
    "imageUrl": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41566-large.mp4",
    "tags": [
      "Ilustración",
      "Digital Painting",
      "Sci-Fi Art"
    ],
    "featured": false,
    "client": "Nexus Comics",
    "specs": [
      {
        "label": "DPI",
        "value": "300 DPI"
      },
      {
        "label": "Canvas",
        "value": "Ultra Wide"
      }
    ],
    "createdAt": "2024-03-20"
  },
  {
    "id": "proj-14",
    "title": "Hyperdrive Interface",
    "category": "Animación",
    "year": "2024",
    "description": "Animación FUI (Futuristic User Interface) para HUD holográfico cinemático de naves espaciales.",
    "fullDescription": "Diseño de interfaz gráfica holográfica en movimiento con diales vectoriales reactivos, lecturas telemétricas y animación fluida a 60 FPS.",
    "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-99648-large.mp4",
    "tags": [
      "After Effects",
      "FUI",
      "HUD Design",
      "Sci-Fi UI"
    ],
    "featured": false,
    "client": "Orbital Aerospace",
    "specs": [
      {
        "label": "Estilo",
        "value": "Vectorial Holográfico"
      },
      {
        "label": "Duración",
        "value": "Loop Continuo"
      }
    ],
    "createdAt": "2024-03-12"
  },
  {
    "id": "proj-15",
    "title": "Voxel Vanguard",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Escultura de cristal procedural con refracción caústica y dispersión de luz prismática.",
    "fullDescription": "Estudio de materiales refractivos avanzados utilizando trazado de rayos en Octane Render. Dispersión cromática y refracción caústica hiperrealista.",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-41566-large.mp4",
    "tags": [
      "Cinema 4D",
      "Octane Render",
      "Procedural Glass"
    ],
    "featured": false,
    "client": "Prism Gallery",
    "specs": [
      {
        "label": "Caustics",
        "value": "Path Tracing 4K"
      },
      {
        "label": "Material",
        "value": "Dispersive Crystal"
      }
    ],
    "createdAt": "2024-03-05"
  },
  {
    "id": "proj-16",
    "title": "Cinder Blade",
    "category": "Ilustración",
    "year": "2024",
    "description": "Arte conceptual de arma ancestral imbuida en llamas mágicas y runas incandescentes.",
    "fullDescription": "Desarrollo de prop de alta calidad para videojuego RPG de acción. Enfoque en materiales metálicos forjados al fuego y efectos de plasma incandescente.",
    "imageUrl": "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-particles-background-41567-large.mp4",
    "tags": [
      "Prop Design",
      "Concept Art",
      "Digital Painting"
    ],
    "featured": false,
    "client": "Ember Games Studio",
    "specs": [
      {
        "label": "Uso",
        "value": "Prop Design"
      },
      {
        "label": "Estilo",
        "value": "Dark Fantasy"
      }
    ],
    "createdAt": "2024-02-28"
  },
  {
    "id": "proj-17",
    "title": "Quantum Simulation",
    "category": "Animación",
    "year": "2024",
    "description": "Simulación de campos magnéticos y partículas de luz en Houdini y After Effects.",
    "fullDescription": "Secuencia de motion graphics procedural que representa colisión de campos cuánticos y ondas de choque electromagnéticas.",
    "imageUrl": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-particles-background-41567-large.mp4",
    "tags": [
      "Houdini",
      "Particle FX",
      "VFX",
      "After Effects"
    ],
    "featured": false,
    "client": "Quantum Energy Lab",
    "specs": [
      {
        "label": "Físicas",
        "value": "POP Solver Houdini"
      },
      {
        "label": "Res",
        "value": "4K Ultra HD"
      }
    ],
    "createdAt": "2024-02-15"
  },
  {
    "id": "proj-18",
    "title": "Apex Exoskeleton",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Modelado de armadura militar táctica futurista con detalles de superficie dura.",
    "fullDescription": "Traje exoesquelético completo con articulaciones hidráulicas, placas de blindaje de titanio y fibra de carbono teñida en rojo pasión.",
    "imageUrl": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-futuristic-robotic-character-40615-large.mp4",
    "tags": [
      "ZBrush",
      "Substance Painter",
      "Hard Surface",
      "Character Rig"
    ],
    "featured": false,
    "client": "Aethelgard Game Studio",
    "specs": [
      {
        "label": "Malla",
        "value": "High Poly Scult"
      },
      {
        "label": "Texturas",
        "value": "PBR Metallic Roughness"
      }
    ],
    "createdAt": "2024-02-01"
  },
  {
    "id": "proj-19",
    "title": "Eclipse Protocol",
    "category": "Arte Conceptual",
    "year": "2024",
    "description": "Keyframe conceptual para cinemática de apertura de ciencia ficción épica.",
    "fullDescription": "Composición de gran formato que muestra un eclipse solar sobre ruinas futuristas con iluminación cenital dramática y bruma incandescente.",
    "imageUrl": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "videoUrl": "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-99648-large.mp4",
    "tags": [
      "Keyframe Concept",
      "Matte Painting",
      "Cinematic Lighting"
    ],
    "featured": false,
    "client": "Eclipse Cinematic Universe",
    "specs": [
      {
        "label": "Resolución",
        "value": "8K Cinema"
      },
      {
        "label": "Mood",
        "value": "Dramatic Eclipse"
      }
    ],
    "createdAt": "2024-01-18"
  }
];

export const initialProfile: UserProfile = {
  "name": "José Luis Vasquez",
  "title": "Diseñador de Movimiento & Artista 3D",
  "tagline": "Encendiendo el movimiento a través del diseño técnico y el fuego creativo.",
  "bioParagraphs": [
    "Mi nombre es José Luis Vasquez, y no solo diseño, sino que soluciono problemas con creatividad y propósito. Soy un diseñador impulsado por una sed insaciable de aprender y una curiosidad que me lleva a dominar mi oficio cada día más.",
    "Veo cada proyecto como una oportunidad para crecer, y cada desafío no es un obstáculo, sino un escalón hacia algo más grande. Para mí, los errores son maestros que me permiten levantarme con una visión más clara y un conjunto de habilidades más pulido.",
    "Más que crear imágenes, mi meta es evolucionar con cada trabajo que hago. Busco ser un profesional completo, alguien que se transforma y aprende con cada trazo, cada idea y cada desafío."
  ],
  "experienceYears": "5+ Años",
  "projectsCompletedCount": "120+",
  "email": "jovas.motion@design.com",
  "avatarUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuBVIY3R1_ShwuNazpxjXd6xyGf2xO6gNj7SUUo0pqzZuSqI873znEpmiFkgo35w_PAL893uLpJ058D1_ypOtVtWFIXJTYjVkKqCjJCfNkLCWddZ-XkJT2oufbwyt7djs9BoHLKWd5uzWELdKhyl4E4Upa7W_HQVPAIV8FFlbPEvXD8Iks3eYsoe5qy9jL2vF3zJBSzeM36egLzNcX75Cedo6CSDvj1T3QrCDdaSUkUJ_AvNNRoFBvbrWA",
  socialLinks: {
    instagram: "https://instagram.com",
    artstation: "https://artstation.com",
    linkedin: "https://linkedin.com",
    behance: "https://behance.net",
    vimeo: "https://vimeo.com"
  },
  customSocialLinks: [
    { id: '1', name: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
    { id: '2', name: 'ArtStation', url: 'https://artstation.com', icon: 'artstation' },
    { id: '3', name: 'Vimeo', url: 'https://vimeo.com', icon: 'vimeo' },
    { id: '4', name: 'LinkedIn', url: 'https://linkedin.com', icon: 'linkedin' }
  ]
};

export const initialBrandAssets: BrandAssets = {
  "logoUrl": "",
  "brandText": "JOVAS",
  "brandSubtext": "Motion Design",
  "heroText": "ENCENDIENDO EL MOVIMIENTO A TRAVÉS DEL DISEÑO",
  "heroSubtext": "JOVAS Diseñador de Movimiento. Creando experiencias digitales viscerales donde la energía del fuego creativo se encuentra con la precisión del movimiento técnico."
};

export const initialMessages: ContactMessage[] = [];

export const initialStats: Stats = {
  "totalViews": "12.8K",
  "newLeadsCount": 42,
  "activeProjectsCount": 8,
  "retentionRate": "76%"
};

export const initialPhotos: PhotoItem[] = [
  {
    id: 'photo-1',
    title: 'Retrato Urbano & Luces Neón',
    category: 'Retrato',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    description: 'Fotografía nocturna capturando claroscuros y acentos neón cromáticos.',
    cameraSpecs: 'Sony A7IV • 85mm f/1.4 • ISO 400',
    createdAt: '2024-02-10'
  },
  {
    id: 'photo-2',
    title: 'Arquitectura Brutalista & Sombras',
    category: 'Arquitectura',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    description: 'Estudio de geometría estructural y contraste solar en concreto.',
    cameraSpecs: 'Fujifilm X-T4 • 35mm f/2.0 • ISO 100',
    createdAt: '2024-02-05'
  },
  {
    id: 'photo-3',
    title: 'Texturas Volumétricas & Niebla',
    category: 'Conceptual',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    description: 'Atmósfera cinematográfica con haces de luz atravesando humo en penumbra.',
    cameraSpecs: 'Canon EOS R5 • 50mm f/1.2 • ISO 200',
    createdAt: '2024-01-28'
  },
  {
    id: 'photo-4',
    title: 'Composición Minimalista Ígnea',
    category: 'Arte Conceptual',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    description: 'Captura macro de destellos metálicos y refracción en alta velocidad.',
    cameraSpecs: 'Sony A7R V • 90mm Macro f/2.8 • ISO 100',
    createdAt: '2024-01-15'
  }
];
