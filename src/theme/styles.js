import { StyleSheet, Platform } from 'react-native';
import { Colors } from './colors';

export const GlobalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.darkBg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Cards
  card: {
    backgroundColor: Colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardGlass: {
    backgroundColor: 'rgba(26, 26, 46, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  // Typography
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.textMuted,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: Colors.accentGreen,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.darkBg,
    letterSpacing: 0.5,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.accentGreen,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.accentGreen,
  },

  // Input
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputFocused: {
    borderColor: Colors.accentGreen,
  },

  // Badges
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeGreen: {
    backgroundColor: 'rgba(0, 230, 118, 0.15)',
  },
  badgeYellow: {
    backgroundColor: 'rgba(255, 214, 0, 0.15)',
  },
  badgeRed: {
    backgroundColor: 'rgba(255, 23, 68, 0.15)',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },

  // Shadow
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
