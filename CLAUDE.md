# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Start Expo dev server (npx expo start)
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS simulator
npm run web        # Run web version
```

No test runner or linter is configured.

## Architecture

React Native app (Expo SDK 54, React 19, RN 0.81) for personalized Vietnamese food nutrition advice using a traffic-light system (green/yellow/red).

**Entry flow:** `index.js` → `App.js` → `AppNavigator.js`

**Navigation:** Bottom tab navigator with 4 tabs:
- **Home** — Feature overview with animated cards
- **Flashlight** — Fun random chicken preference game
- **Nutrition** — Nested stack: `FoodCheckerScreen` (search/browse 60+ foods) → `RecommendationsScreen` (personalized tips)
- **Profile** — `HealthProfileScreen` (health data entry form)

**Core data flow:**
1. User creates health profile (conditions, allergies, BMI, goals) in Profile tab
2. Profile persisted to AsyncStorage (`@health_profile` key)
3. `evaluateFood(food, profile)` in `healthRules.js` computes traffic-light level per food
4. Priority: allergy → RED, health condition warnings → RED/YELLOW, calorie/BMI checks → YELLOW, else GREEN

**Key modules:**
- `src/data/foods.js` — Food database with per-condition warnings/tips
- `src/data/healthRules.js` — Evaluation logic, BMI calc, health tips, condition/allergy definitions
- `src/utils/storage.js` — AsyncStorage wrapper (profile + search history)
- `src/theme/colors.js` — Centralized dark-mode color palette
- `src/theme/styles.js` — Global shared styles with platform-specific handling

## Conventions

- All UI text is in Vietnamese
- Dark-mode-only design; all colors via `Colors` object from `theme/colors.js`
- Emoji icons instead of icon libraries (🏠🔦🥗👤🦴🩸 etc.)
- Haptic feedback on interactive elements via `expo-haptics`
- Animations use React Native `Animated` API with `useNativeDriver: true`
- No state management library; each screen uses local `useState` + loads profile from AsyncStorage on mount
- Food evaluation result shape: `{ level: 'green'|'yellow'|'red', reasons: string[] }`
- Food data shape includes `warnings: { [conditionId]: 'red'|'yellow' }` and `tips: { [conditionId]: string }`
- 7 health conditions: gout, diabetes, hypertension, kidney, obesity, heartDisease, pregnancy
- 5 allergies: seafoodAllergy, peanutAllergy, milkAllergy, eggAllergy, glutenAllergy
