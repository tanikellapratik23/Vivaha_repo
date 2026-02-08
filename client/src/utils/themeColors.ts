// Theme color mappings for dashboard background
export const themeColorMap: Record<string, { bg: string; accent: string; text: string }> = {
  'Romantic Pink': {
    bg: 'bg-pink-50',
    accent: 'bg-pink-100',
    text: 'text-pink-600',
  },
  'Classic White': {
    bg: 'bg-gray-50',
    accent: 'bg-gray-100',
    text: 'text-gray-600',
  },
  'Elegant Gold': {
    bg: 'bg-yellow-50',
    accent: 'bg-yellow-100',
    text: 'text-yellow-700',
  },
  'Navy Blue': {
    bg: 'bg-blue-50',
    accent: 'bg-blue-100',
    text: 'text-blue-700',
  },
  'Sage Green': {
    bg: 'bg-green-50',
    accent: 'bg-green-100',
    text: 'text-green-700',
  },
  'Lavender': {
    bg: 'bg-purple-50',
    accent: 'bg-purple-100',
    text: 'text-purple-700',
  },
  'Blush': {
    bg: 'bg-pink-50',
    accent: 'bg-pink-100',
    text: 'text-pink-600',
  },
  'Burgundy': {
    bg: 'bg-red-50',
    accent: 'bg-red-100',
    text: 'text-red-700',
  },
};

export function getThemeClasses(colorTheme: string | null | undefined) {
  if (!colorTheme) {
    return { bg: 'bg-white', accent: 'bg-gray-50', text: 'text-gray-600' };
  }
  return themeColorMap[colorTheme] || { bg: 'bg-white', accent: 'bg-gray-50', text: 'text-gray-600' };
}
