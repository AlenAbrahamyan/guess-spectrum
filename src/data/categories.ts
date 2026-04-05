import type { Category } from '../types'

export const CATEGORIES: Category[] = [

  //classic
  { left: 'Hot',        right: 'Cold' },
  { left: 'Cheap',      right: 'Expensive' },

    // Gen Z
  { left: 'Green Flag',       right: 'Red Flag' },
  { left: 'Main Character',   right: 'NPC' },
  { left: 'Slay',             right: 'Flop' },
  { left: 'Rizz',             right: 'No Game' },
///////


  { left: 'Safe',       right: 'Dangerous' },
  { left: 'Popular',    right: 'Unknown' },
  { left: 'Healthy',    right: 'Unhealthy' },
  { left: 'Fast',       right: 'Slow' },
  { left: 'Loud',       right: 'Quiet' },
  { left: 'Old',        right: 'New' },
  { left: 'Simple',     right: 'Complex' },
  { left: 'Beautiful',  right: 'Ugly' },
  { left: 'Happy',      right: 'Sad' },
  { left: 'Weak',       right: 'Strong' },


    // Gen Z
  { left: 'Iconic',           right: 'Mid' },
  { left: 'Vibe',             right: 'No Vibe' },
  { left: 'Living Rent Free', right: 'Forgotten' },
  { left: 'Cringe', right: 'Iconic' },
  { left: 'Princess Treatment', right: 'Bare Minimum' },
///////

  { left: 'Rare',       right: 'Common' },
  { left: 'Funny',      right: 'Serious' },
  { left: 'Natural',    right: 'Artificial' },
  { left: 'Small',      right: 'Big' },
  { left: 'Soft',       right: 'Hard' },
  { left: 'Legal',      right: 'Illegal' },
  { left: 'Smart',      right: 'Dumb' },
  { left: 'Scary',      right: 'Cute' },
]

export function shuffleCategories(cats: Category[]): Category[] {
  const arr = [...cats]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
