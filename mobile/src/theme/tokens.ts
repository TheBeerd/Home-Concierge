/**
 * Design tokens lifted directly from the approved wireframe
 * (mobilescreens.html) so the app matches the reviewed design 1:1.
 */

export const colors = {
  ink: '#12203B',
  inkSoft: '#4A5468',
  bgApp: '#F6F7F5',
  surface: '#FFFFFF',
  line: '#E3E6E1',
  teal: '#167C74',
  tealSoft: '#E4F1EF',
  tealMuted: '#9FD6D0',
  clay: '#B54A24',
  claySoft: '#F7E9E1',
  clayText: '#7A331A',
  moss: '#4C7A3D',
  mossSoft: '#EAF1E5',
  mossText: '#3E5E33',
  inkMutedText: '#C7CEDB',
  inkFaintText: '#DCE1EB',
  white: '#FFFFFF',
} as const;

export const fonts = {
  serif: 'Fraunces_500Medium',
  serifRegular: 'Fraunces_400Regular',
  serifSemiBold: 'Fraunces_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
} as const;

export const radii = {
  sm: 10,
  md: 12,
  lg: 16,
  xl: 18,
  pill: 20,
} as const;

export const type = {
  eyebrow: { fontFamily: fonts.serif, fontSize: 15 },
  h1: { fontFamily: fonts.serif, fontSize: 24 },
  h2: { fontFamily: fonts.serif, fontSize: 21 },
  h3: { fontFamily: fonts.serif, fontSize: 19 },
  body: { fontFamily: fonts.sans, fontSize: 14 },
  bodySmall: { fontFamily: fonts.sans, fontSize: 12.5 },
  caption: { fontFamily: fonts.sansSemiBold, fontSize: 12 },
} as const;
