// Hero definition
export interface Hero {
  id: string;
  name: string;
  description: string;
  image: string;
}

// Player with assigned hero
export interface Player {
  id: number;
  name: string;
  heroId?: string;
}

// Game state
export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  isSelectionComplete: boolean;
  selectedHeroCodes: string[];
}

// Predefined heroes data
export const HEROES: Hero[] = [
  {
    id: "warrior",
    name: "El Guerrero",
    description: "Un valiente combatiente forjado en mil batallas. Su espada ha defendido reinos y su escudo ha resistido las más terribles embestidas. Maestro del combate cuerpo a cuerpo.",
    image: "/heroes/warrior.jpg",
  },
  {
    id: "mage",
    name: "El Mago",
    description: "Conocedor de los arcanos secretos y señor de los elementos. Sus conjuros pueden sanar aliados o devastar enemigos. La sabiduría antigua fluye por sus venas.",
    image: "/heroes/mage.jpg",
  },
  {
    id: "ranger",
    name: "La Arquera",
    description: "Silenciosa como la sombra, certera como el rayo. Sus flechas nunca yerran su objetivo. Guardiana de los bosques ancestrales y maestra del sigilo.",
    image: "/heroes/ranger.jpg",
  },
  {
    id: "paladin",
    name: "El Paladín",
    description: "Campeón de la luz y defensor de los inocentes. Su fe inquebrantable le otorga poderes divinos. Ninguna oscuridad puede resistir su presencia.",
    image: "/heroes/paladin.jpg",
  },
  {
    id: "rogue",
    name: "El Pícaro",
    description: "Maestro de las sombras y el engaño. Donde otros ven puertas cerradas, él ve oportunidades. Sus manos rápidas y mente astuta abren cualquier camino.",
    image: "/heroes/rogue.jpg",
  },
  {
    id: "cleric",
    name: "La Sacerdotisa",
    description: "Portadora de la luz sanadora y protectora de almas. Sus plegarias curan heridas y sus bendiciones fortalecen a los aliados en la batalla.",
    image: "/heroes/cleric.jpg",
  },
  {
    id: "barbarian",
    name: "El Bárbaro",
    description: "Furia desatada del norte helado. Su ira en combate es legendaria y su resistencia sobrehumana. Ningún enemigo permanece en pie ante su hacha.",
    image: "/heroes/barbarian.jpg",
  },
  {
    id: "bard",
    name: "El Bardo",
    description: "Tejedor de historias y canciones mágicas. Su música inspira valor en aliados y siembra confusión en enemigos. Conocedor de secretos olvidados.",
    image: "/heroes/bard.jpg",
  },
];

// Initial game state factory
export const createInitialGameState = (playerNames: string[]): GameState => ({
  players: playerNames.map((name, index) => ({
    id: index + 1,
    name,
    heroId: undefined,
  })),
  currentPlayerIndex: 0,
  isSelectionComplete: false,
  selectedHeroCodes: [],
});
