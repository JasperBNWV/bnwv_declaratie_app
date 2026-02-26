# MATT Declaratie Helper

De MATT Declaratie Helper is een moderne, client-side webapplicatie gebouwd met **React, TypeScript en Vite**, bedoeld om het declaratieproces van reiskosten op basis van Microsoft 365/Outlook agendagegevens aanzienlijk te versnellen. De app analyseert je afspraken, stelt declaraties voor en genereert zogenaamde 'bookmarklets' om deze declaraties vliegensvlug in het AFAS Pocket/InSite formulier in te vullen.

## Functionaliteiten

- **Microsoft 365 Integratie**: Naadloos en veilig inloggen via Azure AD (MSAL) om afspraken op te halen uit de Microsoft Graph API.
- **Instellingen en Voorkeuren**: Stel je standaard thuisadres, veelbezochte werklocaties en je voorkeurs declaratiesoort in. (Bewaard via \`localStorage\`).
- **Wachtrij Systeem**: Selecteer meerdere afspraken uit je agenda die je wil declareren, en werk ze stapsgewijs af.
- **Bookmarklet Generator**: Genereert een stukje dynamische JavaScript (een bookmarklet) per declaratie die met één klik alle velden in een extern HR webformulier (zoals AFAS) invult.

## Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Taal**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Authenticatie & API**: \`@azure/msal-react\` & \`@microsoft/microsoft-graph-client\`
- **Routering**: React Router (\`HashRouter\` i.v.m. GitHub Pages compatibiliteit)

## Vereisten

Voordat je dit project draait, heb je nodig:
1. **Node.js** (v18 of nieuwer).
2. **NPM** (of pnpm/yarn).
3. Een **Azure Active Directory App Registration** (met \`Calendars.Read\` permissies) als je daadwerkelijk afspraken wilt importeren.

## Installatie & Starten

1. **Clone de repository**:
   \`\`\`bash
   git clone <repository-url>
   cd matt-declaratie-helper
   \`\`\`

2. **Installeer dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Configureer je omgeving (`.env`)**:
   Kopieer de \`.env.example\` naar \`.env\` en vul je Microsoft (Azure AD) Entra ID details in.
   \`\`\`bash
   cp .env.example .env
   \`\`\`
   In de \`.env\` file moet je het Client ID (\`VITE_MSAL_CLIENT_ID\`) instellen en indien niet multi-tenant het \`VITE_MSAL_TENANT_ID\`.

4. **Start de development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   De app draait nu op \`http://localhost:5173\`.

## Testen

Het project is dekt door zowel Unit, Component als End-to-End (E2E) tests.

- **Type Checking & Linting**:
  \`\`\`bash
  npm run type-check
  npm run lint
  \`\`\`

- **Vitest Unit & Component Tests**:
  \`\`\`bash
  npm run test
  npm run test:ui   # Voor een grafisch overzicht
  npm run coverage  # Om de code coverage te bekijken
  \`\`\`

- **Playwright (E2E) Tests**:
  \`\`\`bash
  # Zorg dat de E2E dependencies aanwezig zijn:
  npx playwright install --with-deps
  
  # Draai de test
  npm run test:e2e
  \`\`\`

## Azure AD App Configuratie (Voor beheerder)
Voor deze app om te werken moet je een App Registreren in Azure portal:
1. Ga naar Entra ID (Azure AD) > **App Registrations** > New Registration.
2. Platform: **Single-page application (SPA)**.
3. Redirect URI: de URL waar de app draait (bijv. \`http://localhost:5173/\` en de URL van GitHub Pages).
4. **API Permissions**: Voeg de permissie `Calendars.Read` (Delegated) toe.
5. Gebruik het **Application (client) ID** in je `.env` file.

## Deployment
Dit project maakt gebruik van GitHub Actions workflow voor automatische deployment naar **GitHub Pages**. De \`base\` config is hiervoor in \`vite.config.ts\` ingesteld. Check `.github/workflows/deploy.yml` hoe dit geconfigureerd is.
