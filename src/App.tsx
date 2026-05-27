import { useEffect, useState } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { fetchAppConfig } from './services/mockApi';
import type { AppConfig } from './types/config';
import './App.css';

function App() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchAppConfig()
      .then((appConfig) => {
        if (isMounted) {
          setConfig(appConfig);
          setError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Unable to load contact details.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <main className="app-state">
        <section className="app-state__panel">
          <h1>Contact details unavailable</h1>
          <p>{error} Please refresh the page and try again.</p>
        </section>
      </main>
    );
  }

  if (!config) {
    return (
      <main className="app-state">
        <section className="app-state__panel">
          <h1>Loading contact details</h1>
          <p>Fetching the latest mock API response...</p>
        </section>
      </main>
    );
  }

  return <PageLayout config={config} />;
}

export default App;
