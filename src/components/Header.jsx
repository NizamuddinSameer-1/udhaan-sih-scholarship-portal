import React from 'react';
import { BookOpen, Clock3, Database, Globe2, Landmark, ShieldCheck } from 'lucide-react';

const navigation = [
  { id: 'screen1', label: 'Student intake', hindi: 'छात्र आवेदन', icon: BookOpen },
  { id: 'screen2', label: 'DWO register', hindi: 'जिला समीक्षा', icon: Landmark },
  { id: 'screen3', label: 'Track a file', hindi: 'आवेदन स्थिति', icon: Clock3 }
];

export function Header({ currentScreen, onSelectScreen, lang, onToggleLang, onOpenGovData }) {
  return (
    <header className="register-header">
      <div className="prototype-ribbon">
        <span className="prototype-mark" aria-hidden="true" />
        <strong>Prototype · sample casework</strong>
        <span className="ribbon-divider" aria-hidden="true" />
        <span className="ribbon-purpose">Udaan supports the NSP workflow; NSP remains the system of record.</span>
        <span className="human-authority"><ShieldCheck size={14} aria-hidden="true" /> Officer decision required</span>
      </div>

      <div className="header-main">
        <div className="brand-lockup">
          <div className="folio-mark" aria-hidden="true"><span>उ</span></div>
          <div className="brand-copy">
            <h1>Udaan <span lang="hi">उड़ान</span></h1>
            <p>Scholarship review register <span aria-hidden="true">/</span> Jharkhand</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="integration-key" aria-label="Integration status: image checks run locally, live IFSC lookup is on request, government adapters are mocked, OCR fields are simulated">
            <span><i className="key-local" aria-hidden="true" />Image checks <b>Local</b></span>
            <span><i className="key-live" aria-hidden="true" />IFSC lookup <b>Live</b></span>
            <span><i className="key-mock" aria-hidden="true" />Govt adapters <b>Mock</b></span>
            <span><i className="key-simulated" aria-hidden="true" />OCR fields <b>Simulated</b></span>
          </div>
          <button
            type="button"
            onClick={onOpenGovData}
            className="header-tool"
            aria-haspopup="dialog"
          >
            <Database size={16} aria-hidden="true" />
            <span>Registry index</span>
          </button>
          <button
            type="button"
            onClick={onToggleLang}
            className="header-tool language-tool"
            title="Toggle language / भाषा बदलें"
          >
            <Globe2 size={16} aria-hidden="true" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>

      <nav className="primary-nav" aria-label="Main navigation">
        {navigation.map(({ id, label, hindi, icon: Icon }) => {
          const current = currentScreen === id;
          return (
            <button
              type="button"
              key={id}
              onClick={() => onSelectScreen(id)}
              className={`nav-entry${current ? ' is-current' : ''}`}
              aria-current={current ? 'page' : undefined}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
              <span className="nav-hindi" lang="hi">{hindi}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
