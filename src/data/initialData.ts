import { Project, PhotoItem, UserProfile, BrandAssets, ContactMessage, Stats } from '../types';

export const initialProjects: Project[] = [
  {
    "title": "Modelado Mech Cyberpunk 3D",
    "category": "Modelado 3D",
    "year": "2024",
    "description": "Escultura y modelado 3D hard-surface con texturizado PBR y renderizado fotorrealista.",
    "fullDescription": "Proyecto conceptual de robótica avanzada. Incluye modelado orgánico y mecánico en Blender y ZBrush, desenvuelto UV, texturizado 8K en Substance Painter y composición final.",
    "imageUrl": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "galleryUrls": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80"
    ],
    "tags": [
      "Blender",
      "Modelado 3D",
      "ZBrush",
      "Octane Render"
    ],
    "featured": true,
    "specs": [
      { "label": "Motor Render", "value": "Octane / Redshift" },
      { "label": "Polígonos", "value": "2.4M Tris" },
      { "label": "Texturas", "value": "8K PBR Maps" }
    ],
    "id": "proj-3d-cybermech-01",
    "createdAt": "2026-08-13"
  },
  {
    "title": "Santuario Neón 3D",
    "category": "Modelado 3D",
    "year": "2025",
    "description": "Entorno tridimensional futurista con shaders lumínicos y simulación de fluidos.",
    "fullDescription": "Diseño de entorno 3D espacial utilizando Cinema 4D y Redshift. Iluminación volumétrica, niebla atmosférica y shaders especulares avanzados.",
    "imageUrl": "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "galleryUrls": [
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80"
    ],
    "tags": [
      "Cinema 4D",
      "Redshift",
      "3D Environment"
    ],
    "featured": true,
    "specs": [
      { "label": "Software", "value": "Cinema 4D S26" },
      { "label": "Resolución", "value": "4K Ultra HD" }
    ],
    "id": "proj-3d-sanctuary-02",
    "createdAt": "2026-08-13"
  },
  {
    "title": "Robot Atardecer ",
    "category": "Arte Conceptual",
    "year": "2022",
    "description": "",
    "fullDescription": "",
    "imageUrl": "/images/extracted-01.jpg",
    "tags": [
      "Blender",
      "Photoshop"
    ],
    "featured": true,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785747374534",
    "createdAt": "2026-08-03"
  },
  {
    "title": "ESPADA MAESTRA ",
    "category": "Arte Conceptual",
    "year": "2022",
    "description": "CONCEPT ESPADA MAESTRA ILUSTRACIÓN Y 3D",
    "fullDescription": "CONCEPT ESPADA MAESTRA ILUSTRACIÓN Y 3D",
    "imageUrl": "/images/extracted-02.jpg",
    "tags": [
      "3D Render",
      "ILUSTRACIÓN"
    ],
    "featured": true,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785742832664",
    "createdAt": "2026-08-03"
  },
  {
    "title": "INTRO Jovas Motion Designer  2025",
    "category": "Animación",
    "year": "2024",
    "description": "INTRO Jovas Motion Designer  2025",
    "fullDescription": "INTRO Jovas Motion Designer  2025",
    "imageUrl": "https://img.youtube.com/vi/wFfbPEybW4I/hqdefault.jpg",
    "videoUrl": "https://youtube.com/shorts/wFfbPEybW4I",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785735581890",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Intro Logo Jovas Game",
    "category": "Animación",
    "year": "2023",
    "description": "Logo Intro Streams",
    "fullDescription": "Logo Intro Streams",
    "imageUrl": "https://img.youtube.com/vi/Y9R9SeGhn04/hqdefault.jpg",
    "videoUrl": "https://youtu.be/Y9R9SeGhn04",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785735403365",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Revlur Intro II  3D ,2D",
    "category": "Animación",
    "year": "2025",
    "description": "Revlur Intro II  3D ,2D",
    "fullDescription": "Revlur Intro II  3D ,2D",
    "imageUrl": "https://img.youtube.com/vi/bbrd9-zaN4M/hqdefault.jpg",
    "videoUrl": "https://youtu.be/bbrd9-zaN4M",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785735274195",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Intro 2023 Motion Graphics",
    "category": "Animación",
    "year": "2024",
    "description": "Intro 2023 Motion Graphics",
    "fullDescription": "Intro 2023 Motion Graphics",
    "imageUrl": "https://img.youtube.com/vi/Rbr0M1QJ0jQ/hqdefault.jpg",
    "videoUrl": "https://youtu.be/Rbr0M1QJ0jQ",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785735038699",
    "createdAt": "2026-08-03"
  },
  {
    "title": "INTRO NOVA ANIMACION 2D",
    "category": "Animación",
    "year": "2024",
    "description": "Animación 2D semana de Diseñador Nova Intro ",
    "fullDescription": "Animación 2D semana de Diseñador Nova Intro ",
    "imageUrl": "https://img.youtube.com/vi/SmyxU4nmOBc/hqdefault.jpg",
    "videoUrl": "https://youtu.be/SmyxU4nmOBc",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785734623366",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Semana del diseñador 2024 Spot Publicitario",
    "category": "Animación",
    "year": "2024",
    "description": "Animación 2D, Spot Publicitario.",
    "fullDescription": "Animación 2D, Spot Publicitario.",
    "imageUrl": "https://img.youtube.com/vi/cM_E9CT0Ufk/hqdefault.jpg",
    "videoUrl": "https://youtu.be/cM_E9CT0Ufk",
    "tags": [
      "Motion Graphics"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785734306412",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Spot Publicitario Variedades Genesis 2",
    "category": "Animación",
    "year": "2018",
    "description": "Animación Spot Variedades Génesis ",
    "fullDescription": "Animación Spot Variedades Génesis ",
    "imageUrl": "https://img.youtube.com/vi/Sh0nwFVPkOc/hqdefault.jpg",
    "videoUrl": "https://youtu.be/Sh0nwFVPkOc",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785733017111",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Personaje Aesartes Animación Digital",
    "category": "Animación",
    "year": "2023",
    "description": "Personaje Aesartes Animación Digital, Motion Graphics Aesartes",
    "fullDescription": "Personaje Aesartes Animación Digital, Motion Graphics Aesartes",
    "imageUrl": "https://img.youtube.com/vi/_AiKkHojrUk/hqdefault.jpg",
    "videoUrl": "https://youtu.be/_AiKkHojrUk",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785730703386",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Logo Intelmax 3D",
    "category": "Animación",
    "year": "2024",
    "description": "Animación 3D Intelmax",
    "fullDescription": "Animación 3D Intelmax",
    "imageUrl": "https://img.youtube.com/vi/tySFc7k24CQ/hqdefault.jpg",
    "videoUrl": "https://youtu.be/tySFc7k24CQ",
    "tags": [
      "Motion Graphics"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785730085927",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Revlur Animación Intro ",
    "category": "Animación",
    "year": "2025",
    "description": "Intro de logo Revlur Portafolio 2025",
    "fullDescription": "Intro de logo Revlur Portafolio 2025",
    "imageUrl": "https://img.youtube.com/vi/2GwO0WKuLis/hqdefault.jpg",
    "videoUrl": "https://youtu.be/2GwO0WKuLis",
    "tags": [
      "Motion Graphics",
      "Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785729264860",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Proyecto Expo Escultura Intro",
    "category": "Animación",
    "year": "2022",
    "description": "Animación Intro Expo Escultura ",
    "fullDescription": "Animación Intro Expo Escultura ",
    "imageUrl": "https://img.youtube.com/vi/9lZ80SywBso/hqdefault.jpg",
    "videoUrl": "https://youtu.be/9lZ80SywBso",
    "tags": [
      "Animación 2D"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785729125641",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Publicidad UILINK",
    "category": "Animación",
    "year": "2024",
    "description": "Publicidad UILink",
    "fullDescription": "Publicidad UILink",
    "imageUrl": "https://img.youtube.com/vi/Z_V4C5gulWM/hqdefault.jpg",
    "videoUrl": "https://youtu.be/Z_V4C5gulWM",
    "tags": [
      "Motion Graphics",
      "Animación"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785728934677",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Publicidad Variedades Génesis 2018",
    "category": "Animación",
    "year": "2018",
    "description": "Post Publicitario Variedades Génesis ",
    "fullDescription": "Post Publicitario Variedades Génesis ",
    "imageUrl": "https://img.youtube.com/vi/5MwOg8fr9K4/hqdefault.jpg",
    "videoUrl": "https://youtu.be/5MwOg8fr9K4",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785728699128",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Proyecto animación 3D personajes ",
    "category": "Animación",
    "year": "2024",
    "description": "Proyecto Modelado y Animación 3D",
    "fullDescription": "Proyecto Modelado y Animación 3D",
    "imageUrl": "https://img.youtube.com/vi/E493XG3Adr0/hqdefault.jpg",
    "videoUrl": "https://youtu.be/E493XG3Adr0",
    "tags": [
      "Motion Graphics",
      "Blender"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785728455589",
    "createdAt": "2026-08-03"
  },
  {
    "title": "INTRO 2023",
    "category": "Animación",
    "year": "2023",
    "description": "Intro logo 2023",
    "fullDescription": "Intro logo 2023",
    "imageUrl": "https://img.youtube.com/vi/Qqd94DPr1TY/hqdefault.jpg",
    "videoUrl": "https://youtu.be/Qqd94DPr1TY",
    "tags": [
      "Motion Graphics",
      "fvx"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785728157418",
    "createdAt": "2026-08-03"
  },
  {
    "title": "ILUSTRACIÓN CONCEPTUAL",
    "category": "Ilustración",
    "year": "2022",
    "description": "RECUERDO DE HERRAMIENTAS EN MI VIDA ",
    "fullDescription": "RECUERDO DE HERRAMIENTAS EN MI VIDA ",
    "imageUrl": "/images/extracted-03.jpg",
    "tags": [
      "Motion Graphics",
      "3D Render"
    ],
    "featured": true,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785658575603",
    "createdAt": "2026-08-02"
  },
  {
    "title": "Vader Vectorial",
    "category": "Ilustración",
    "year": "2022",
    "description": "Ilustración vectorial, Dark Vader ",
    "fullDescription": "Ilustración vectorial, Dark Vader ",
    "imageUrl": "/images/extracted-04.jpg",
    "tags": [
      "Ilustrador",
      "vector"
    ],
    "featured": true,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785645002584",
    "createdAt": "2026-08-02"
  },
  {
    "title": "INTRO REEL 2'025",
    "category": "Animación",
    "year": "2025",
    "description": "Intro logo Jovas 2025",
    "fullDescription": "Intro logo Jovas 2025",
    "imageUrl": "https://img.youtube.com/vi/HTlHxLoZ7iM/hqdefault.jpg",
    "videoUrl": "https://youtu.be/HTlHxLoZ7iM",
    "tags": [
      "Motion Graphics",
      "After Effects"
    ],
    "featured": false,
    "specs": [
      {
        "label": "Resolución",
        "value": "4K Ultra HD"
      },
      {
        "label": "FPS",
        "value": "60 FPS"
      }
    ],
    "id": "proj-1785644799339",
    "createdAt": "2026-08-02"
  }
];

export const initialProfile: UserProfile = {
  "name": "José Luis Vásquez",
  "title": "Diseñador de Movimiento y Artista 3D",
  "tagline": "Encendiendo el movimiento a través del diseño técnico y el fuego creativo.",
  "bioParagraphs": [
    "Mi nombre es José Luis Vásquez, y no solo diseño, sino que soluciono problemas con creatividad y propósito. Soy un diseñador impulsado por una sed insaciable de aprender y una curiosidad que me lleva a dominar mi oficio cada día más.",
    "Veo cada proyecto como una oportunidad para crecer, y cada desafío no es un obstáculo, sino un escalón hacia algo más grande. Para mí, los errores son maestros que me permiten levantarme con una visión más clara y un conjunto de habilidades más pulido.",
    "Más que crear imágenes, mi meta es evolucionar con cada trabajo que hago. Busco ser un profesional completo, alguien que se transforma y aprende con cada trazo, cada idea y cada desafío."
  ],
  "experienceYears": "10 Años",
  "projectsCompletedCount": "120+",
  "email": "jovas.motion@design.com",
  "avatarUrl": "/images/extracted-05.jpg",
  "socialLinks": {
    "instagram": "https://instagram.com",
    "artstation": "https://artstation.com",
    "linkedin": "https://linkedin.com",
    "behance": "https://behance.net",
    "vimeo": "https://vimeo.com"
  },
  "customSocialLinks": [
    {
      "id": "1",
      "name": "Instagram",
      "url": "https://instagram.com",
      "icon": "instagram"
    },
    {
      "id": "2",
      "name": "ArtStation",
      "url": "https://artstation.com",
      "icon": "artstation"
    },
    {
      "id": "3",
      "name": "Vimeo",
      "url": "https://vimeo.com",
      "icon": "vimeo"
    },
    {
      "id": "4",
      "name": "LinkedIn",
      "url": "https://linkedin.com",
      "icon": "linkedin"
    }
  ]
};

export const initialBrandAssets: BrandAssets = {
  "logoUrl": "/images/extracted-06.jpg",
  "brandText": "JOVAS",
  "brandSubtext": "Motion Design",
  "heroText": "ENCENDIENDO EL MOVIMIENTO A TRAVÉS DEL DISEÑO",
  "heroSubtext": "JOVAS Diseñador de Movimiento. Creando experiencias digitales viscerales donde la energía del fuego creativo se encuentra con la precisión del movimiento técnico.",
  "heroBgUrl": "",
  "metallicIconUrl": "/images/extracted-07.jpg"
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
    "title": "TRONCO VALLE",
    "category": "NATURALEZA",
    "imageUrl": "/images/extracted-08.jpg",
    "cameraSpecs": "NIKON D7200 • 85mm f/1.4 • ISO 400",
    "id": "photo-1785742670160",
    "createdAt": "2026-08-03"
  },
  {
    "title": "URBANO",
    "category": "URBANO",
    "imageUrl": "/images/extracted-09.jpg",
    "cameraSpecs": "Sony A65 • 85mm f/1.4 • ISO 400",
    "id": "photo-1785742557912",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Tronco Textura",
    "category": "Naturaleza",
    "imageUrl": "/images/extracted-10.jpg",
    "cameraSpecs": "NIKON D7200• 85mm f/1.4 • ISO 400",
    "id": "photo-1785742535000",
    "createdAt": "2026-08-03"
  },
  {
    "title": "Cuervo",
    "category": "Animales ",
    "imageUrl": "/images/extracted-11.jpg",
    "cameraSpecs": "NIKON D7200 • 85mm f/1.4 • ISO 400",
    "id": "photo-1785742480385",
    "createdAt": "2026-08-03"
  },
  {
    "id": "photo-1",
    "title": "Iguana al Sol ",
    "category": "Animales",
    "imageUrl": "/images/extracted-12.jpg",
    "description": "Iguana al sol ",
    "cameraSpecs": "Sony A65 • 85mm f/1.4 • ISO 400",
    "createdAt": "2024-02-10"
  },
  {
    "id": "photo-2",
    "title": "Arquitectura ",
    "category": "Arquitectura",
    "imageUrl": "/images/extracted-13.jpg",
    "description": "IGLESIA SUSHITOTO",
    "cameraSpecs": "NIKON D7200 • 35mm f/2.0 • ISO 100",
    "createdAt": "2024-02-05"
  },
  {
    "id": "photo-3",
    "title": "Lámpara Suchitoto",
    "category": "Arquitectura",
    "imageUrl": "/images/extracted-14.jpg",
    "description": "Lámpara Suchitoto",
    "cameraSpecs": "NIKON D7200 • 50mm f/1.2 • ISO 200",
    "createdAt": "2024-01-28"
  }
];
