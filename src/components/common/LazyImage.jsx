import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styles from './LazyImage.module.css';

export const LazyImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '',
  placeholder = null 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div 
      ref={ref} 
      className={`${styles.container} ${className}`}
      style={{ width, height }}
    >
      {inView ? (
        <>
          {!isLoaded && (
            <div className={styles.placeholder}>
              {placeholder || <div className={styles.skeleton} />}
            </div>
          )}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            className={`${styles.image} ${isLoaded ? styles.loaded : ''}`}
            width={width}
            height={height}
          />
        </>
      ) : (
        <div className={styles.placeholder}>
          {placeholder || <div className={styles.skeleton} />}
        </div>
      )}
    </div>
  );
};