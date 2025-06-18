// Allows decimal points
export const digitsOnly = (text: string): string => {
  return text.replace(/[^\d.]/g, '');
};

// Pure integers only
export const integersOnly = (text: string): string => {
  return text.replace(/[^0-9]/g, '');
};