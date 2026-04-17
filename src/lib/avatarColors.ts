export function getAvatarColors(name: string): { bg: string; text: string } {
  const letter = name.charAt(0).toUpperCase();
  const code = letter.charCodeAt(0);
  if (code >= 65 && code <= 68) return { bg: '#EEF2FF', text: '#4338CA' };
  if (code >= 69 && code <= 72) return { bg: '#CCFBF1', text: '#0F766E' };
  if (code >= 73 && code <= 76) return { bg: '#F3E8FF', text: '#7E22CE' };
  if (code >= 77 && code <= 80) return { bg: '#FFE4E6', text: '#BE123C' };
  if (code >= 81 && code <= 84) return { bg: '#FEF3C7', text: '#B45309' };
  return { bg: '#DBEAFE', text: '#1D4ED8' };
}
