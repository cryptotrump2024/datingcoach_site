// Showcase persona presets — shared by the home page, persona builder and scenarios.
export interface ShowcasePersona {
  name: string
  age: number
  ethnicity: string
  personality: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Master'
  image: string
  color: string
  hairColor: string
  hairLength: string
  eyeColor: string
  bodyType: string
  height: string
  style: string
  glasses: boolean
  tattoos: boolean
  piercings: boolean
  archetype: string
  bio: string
  scenario: string
}

export const showcasePersonas: ShowcasePersona[] = [
  { name: 'Sophia', age: 28, ethnicity: 'Italian-American', personality: ['Warm', 'Playful'], difficulty: 'Intermediate', image: '/persona-sophia.jpg', color: '#D97706', hairColor: 'Brunette', hairLength: 'Long', eyeColor: 'Brown', bodyType: 'Slim', height: "Average (5'3 - 5'7)", style: 'Elegant', glasses: false, tattoos: false, piercings: true, archetype: 'The Romantic', bio: 'Sophia is a warm and playful Italian-American who loves cooking and Sunday dinners with family.', scenario: 'Dating App Match' },
  { name: 'Maya', age: 30, ethnicity: 'South Asian', personality: ['Intellectual', 'Sophisticated'], difficulty: 'Advanced', image: '/persona-maya.jpg', color: '#EA580C', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Dark Brown', bodyType: 'Slim', height: "Average (5'3 - 5'7)", style: 'Professional', glasses: true, tattoos: false, piercings: false, archetype: 'The Intellectual', bio: 'Maya is a sophisticated intellectual who works in finance and enjoys art galleries and wine tastings.', scenario: 'Dating App Match' },
  { name: 'Chloe', age: 24, ethnicity: 'French', personality: ['Mysterious', 'Romantic'], difficulty: 'Expert', image: '/persona-chloe.jpg', color: '#059669', hairColor: 'Blonde', hairLength: 'Medium', eyeColor: 'Blue', bodyType: 'Athletic', height: "Petite (under 5'3)", style: 'Edgy', glasses: false, tattoos: true, piercings: true, archetype: 'The Free Spirit', bio: 'Chloe is a mysterious free spirit who travels the world, writes poetry, and lives for spontaneous adventures.', scenario: 'Dating App Match' },
  { name: 'Ava', age: 26, ethnicity: 'East Asian', personality: ['Creative', 'Artistic'], difficulty: 'Advanced', image: '/persona-ava.jpg', color: '#7C3AED', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Brown', bodyType: 'Slim', height: "Petite (under 5'3)", style: 'Bohemian', glasses: false, tattoos: false, piercings: true, archetype: 'The Girl Next Door', bio: 'Ava is a creative artist who spends her weekends at farmers markets and painting in her studio.', scenario: 'Dating App Match' },
  { name: 'Zara', age: 32, ethnicity: 'Middle Eastern', personality: ['Confident', 'Direct'], difficulty: 'Expert', image: '/persona-zara.jpg', color: '#DC2626', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Hazel', bodyType: 'Curvy', height: "Tall (5'8 - 5'11)", style: 'Elegant', glasses: false, tattoos: false, piercings: false, archetype: 'The Diva', bio: 'Zara is a confident, direct woman who knows what she wants. She runs her own business and does not waste time.', scenario: 'Dating App Match' },
  { name: 'Luna', age: 22, ethnicity: 'Latina', personality: ['Energetic', 'Passionate'], difficulty: 'Beginner', image: '/persona-luna.jpg', color: '#DB2777', hairColor: 'Brunette', hairLength: 'Long', eyeColor: 'Brown', bodyType: 'Curvy', height: "Average (5'3 - 5'7)", style: 'Trendy', glasses: false, tattoos: true, piercings: true, archetype: 'The Free Spirit', bio: 'Luna is an energetic dancer who brings passion to everything she does. She loves salsa, tacos, and late night talks.', scenario: 'Dating App Match' },
  { name: 'Isabella', age: 27, ethnicity: 'Brazilian', personality: ['Passionate', 'Dancer'], difficulty: 'Intermediate', image: '/persona-isabella.jpg', color: '#C026D3', hairColor: 'Brunette', hairLength: 'Very Long', eyeColor: 'Green', bodyType: 'Athletic', height: "Tall (5'8 - 5'11)", style: 'Sporty', glasses: false, tattoos: false, piercings: true, archetype: 'The Romantic', bio: 'Isabella is a passionate Brazilian who teaches yoga, surfs on weekends, and lives for carnival season.', scenario: 'Dating App Match' },
  { name: 'Natasha', age: 31, ethnicity: 'Russian', personality: ['Direct', 'Sophisticated'], difficulty: 'Advanced', image: '/persona-natasha.jpg', color: '#4F46E5', hairColor: 'Blonde', hairLength: 'Medium', eyeColor: 'Blue', bodyType: 'Slim', height: "Tall (5'8 - 5'11)", style: 'Professional', glasses: false, tattoos: false, piercings: false, archetype: 'The Intellectual', bio: 'Natasha is a sophisticated analyst who speaks three languages, skis in the Alps, and hosts dinner parties.', scenario: 'Dating App Match' },
  { name: 'Priya', age: 24, ethnicity: 'Indian', personality: ['Warm', 'Family-oriented'], difficulty: 'Beginner', image: '/persona-priya.jpg', color: '#EA580C', hairColor: 'Black', hairLength: 'Long', eyeColor: 'Dark Brown', bodyType: 'Curvy', height: "Average (5'3 - 5'7)", style: 'Casual', glasses: true, tattoos: false, piercings: true, archetype: 'The Girl Next Door', bio: 'Priya is a warm family-oriented woman who balances her IT career with traditional values and modern views.', scenario: 'Dating App Match' },
  { name: 'Elena', age: 29, ethnicity: 'Spanish', personality: ['Fiery', 'Independent'], difficulty: 'Expert', image: '/persona-elena.jpg', color: '#DC2626', hairColor: 'Red', hairLength: 'Long', eyeColor: 'Hazel', bodyType: 'Athletic', height: "Average (5'3 - 5'7)", style: 'Edgy', glasses: false, tattoos: true, piercings: true, archetype: 'The Mysterious', bio: 'Elena is a fiery independent woman who left her small town to build a life in the city. She does not do boring.', scenario: 'Dating App Match' },
  { name: 'Yuki', age: 25, ethnicity: 'Japanese', personality: ['Quiet', 'Artistic'], difficulty: 'Intermediate', image: '/persona-yuki.jpg', color: '#0891B2', hairColor: 'Black', hairLength: 'Short', eyeColor: 'Dark Brown', bodyType: 'Slim', height: "Petite (under 5'3)", style: 'Minimalist', glasses: false, tattoos: false, piercings: false, archetype: 'The Intellectual', bio: 'Yuki is a quiet artistic soul who finds beauty in simplicity. She works as a graphic designer and loves ceramics.', scenario: 'Dating App Match' },
  { name: 'Amina', age: 26, ethnicity: 'Nigerian', personality: ['Confident', 'Ambitious'], difficulty: 'Advanced', image: '/persona-amina.jpg', color: '#7C3AED', hairColor: 'Black', hairLength: 'Medium', eyeColor: 'Brown', bodyType: 'Athletic', height: "Tall (5'8 - 5'11)", style: 'Trendy', glasses: false, tattoos: false, piercings: true, archetype: 'The Diva', bio: 'Amina is an ambitious entrepreneur building her fashion brand. Confident, stylish, and always networking.', scenario: 'Dating App Match' },
]
