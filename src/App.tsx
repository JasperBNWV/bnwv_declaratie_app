import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom"
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react"
import { loginRequest } from "./lib/msalConfig"

import { AgendaPage } from "./pages/AgendaPage"
import { WachtrijPage } from "./pages/WachtrijPage"
import { InstellingenPage } from "./pages/InstellingenPage"

function App() {
  const { instance } = useMsal()

  return (
    <HashRouter>
      <div className="min-h-screen bg-paper text-ink">
        <header className="bg-ink text-paper p-4 flex justify-between items-center">
          <div className="font-bold text-lg">MATT Declaratie Helper</div>
          <AuthenticatedTemplate>
            <nav className="flex gap-4">
              <Link to="/agenda" className="hover:text-accent">Agenda</Link>
              <Link to="/wachtrij" className="hover:text-accent">Wachtrij</Link>
              <Link to="/instellingen" className="hover:text-accent">Instellingen</Link>
              <button
                onClick={() => instance.logoutPopup()}
                className="text-muted hover:text-white"
              >
                Logout
              </button>
            </nav>
          </AuthenticatedTemplate>
        </header>

        <main className="max-w-4xl mx-auto py-8">
          <UnauthenticatedTemplate>
            <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-cream">
              <h1 className="text-2xl font-bold mb-4">Welkom bij de MATT Declaratie Helper</h1>
              <p className="mb-8 text-muted">Log in met je Microsoft 365 account om je agenda te koppelen.</p>
              <button
                onClick={() => instance.loginPopup(loginRequest)}
                className="bg-accent hover:bg-accent-hover text-white px-6 py-2 rounded-md transition-colors"
                data-testid="login-button"
              >
                Inloggen met Microsoft
              </button>
            </div>
          </UnauthenticatedTemplate>

          <AuthenticatedTemplate>
            <Routes>
              <Route path="/" element={<Navigate to="/agenda" replace />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/wachtrij" element={<WachtrijPage />} />
              <Route path="/instellingen" element={<InstellingenPage />} />
            </Routes>
          </AuthenticatedTemplate>
        </main>
      </div>
    </HashRouter>
  )
}

export default App
