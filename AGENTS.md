# Presentation conventions
- Define visual roles, colors and shadows in global CSS and expose them through Tailwind tokens; presentation files consume semantic classes so the brand can change centrally.
- Use `section-label`, `heading-emphasis` and `dark-surface` for editorial labels and highlighted heading words; these roles maintain consistent typography and contrast across light and dark sections.
- Load the shared Google Fonts stylesheet once at application startup rather than through a CSS URL import; the CSS compiler must not resolve external font URLs.
