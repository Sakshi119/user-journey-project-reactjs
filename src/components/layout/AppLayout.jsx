import React from 'react';
import { ThemeToggle } from '../common/ThemeToggle';
import styles from './AppLayout.module.css';

export const AppLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      {/* Skip to main content link for screen readers */}
      <a href="#main-content" className={styles.skipLink}>
        Skip to main content
      </a>
      
      <header className={styles.header} role="banner">
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Registration Portal</h1>
          <ThemeToggle />
        </div>
      </header>
      
      <main id="main-content" className={styles.main} role="main">
        {children}
      </main>
      
      <footer className={styles.footer} role="contentinfo">
        <p>&copy; 2024 Registration Portal. All rights reserved.</p>
      </footer>
    </div>
  );
};