# Geaux Academy UI Redesign Notes

## Design tokens
### Palette
- **Primary (Academy Blue):** `#4654F6` (light), `#2F3AC4` (dark)
- **Accent (Warm Gold):** `#E1B354` (light), `#B98C33` (dark)
- **Background:** `#F5F7FF` (light), `#0B1020` (dark)
- **Surface:** `#FFFFFF` (light), `#121A2F` (dark)
- **Text:** `#101326` / `#4B5563` (light), `#F8FAFF` / `#B8C0E0` (dark)
- **Status colors:** success `#22C55E`, warning `#F59E0B`, error `#EF4444`

### Typography
- **Font:** Manrope + Inter fallback
- **Scale:**
  - Hero: `clamp(2.5rem, 3vw, 3.5rem)`
  - H2: `clamp(2rem, 2.4vw, 2.75rem)`
  - Body: `1rem` with `1.6–1.7` line height

### Spacing & radius
- Spacing scale: `xs 0.25rem`, `sm 0.5rem`, `md 1rem`, `lg 2rem`, `xl 3rem`
- Radius: `8px`, `12px`, `16px`, `24px`, pill `999px`

### Shadows & glow
- Soft elevation: `0 10px 30px rgba(15, 23, 42, 0.08)`
- Deep elevation: `0 24px 60px rgba(15, 23, 42, 0.12)`
- Glow accent: `0 0 40px rgba(70, 84, 246, 0.25)`

## Layout rules
- **Max width:** 1200px
- **App shell:** sticky header, main content padded by `6.5rem` top on desktop and `5.5rem` on mobile.
- **Cards:** use `.glass-card` for glassmorphism surfaces.
- **Buttons:** use `.btn` with `.btn-primary`, `.btn-secondary`, `.btn-ghost` variants.

## Where to add new UI
- **Pages:** `src/pages/*` (routes are defined in `src/App.tsx`)
- **Layout:** `src/components/layout/*`
- **Reusable UI:** prefer `src/components/common/*` or `src/components/ui/*`
- **Global styles:** `src/styles/global.css`

## Dark mode behavior
- Theme is controlled by `ThemeModeProvider` in `src/theme/ThemeModeContext.tsx`.
- User preference is stored in `localStorage` under `ga-theme`.
- The HTML root gets `data-theme="light" | "dark"` so CSS variables can respond instantly.
- Toggle is in the header and updates both MUI and styled-components themes.
