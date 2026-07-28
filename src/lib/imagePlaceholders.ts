/**
 * High quality SVG visual generator & blurDataURLs for image optimization
 * Ensures consistent color grading (#2563EB primary tones, natural clinical lighting)
 */

export const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZmFmYyIvPjwvc3ZnPg==";

// SVG Data URIs matching clinic visual consistency
export function generateMedicalSvgPlaceholder(
  title: string,
  subtitle: string,
  type: 'doctor' | 'clinic' | 'consultation' | 'equipment' | 'patient' | 'certificate' | 'reception' = 'clinic'
): string {
  const bgGradient = type === 'doctor' 
    ? 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)' 
    : 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)';

  const iconSvg = type === 'doctor'
    ? `<circle cx="200" cy="150" r="60" fill="#2563EB" opacity="0.15"/>
       <path d="M160 250 C160 200, 240 200, 240 250 Z" fill="#2563EB" opacity="0.2"/>`
    : `<rect x="150" y="130" width="100" height="80" rx="12" fill="#2563EB" opacity="0.12"/>
       <path d="M200 150 L200 190 M180 170 L220 170" stroke="#2563EB" stroke-width="6" stroke-linecap="round"/>`;

  const svgString = `<svg width="800" height="600" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#EFF6FF"/>
        <stop offset="100%" stop-color="#DBEAFE"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <circle cx="350" cy="50" r="120" fill="#2563EB" opacity="0.05"/>
    <circle cx="50" cy="250" r="90" fill="#3B82F6" opacity="0.05"/>
    ${iconSvg}
    <text x="200" y="220" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="16" fill="#0F172A" text-anchor="middle">${title}</text>
    <text x="200" y="240" font-family="Inter, sans-serif" font-weight="500" font-size="12" fill="#64748B" text-anchor="middle">${subtitle}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}
