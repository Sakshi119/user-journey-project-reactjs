import React, { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/common/ThemeToggle';
import LoadingSpinner from './components/common/LoadingSpinner';
import './styles/global.scss';

// Lazy load pages
const Registration = lazy(() => import('./pages/Registration'));

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <ThemeToggle />
        
        <Suspense fallback={<LoadingSpinner />}>
          <Registration />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}

export default App;