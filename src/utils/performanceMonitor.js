export const measurePerformance = () => {
  if ('performance' in window) {
    // Web Vitals
    const navigation = performance.getEntriesByType('navigation')[0];
    
    console.log('Performance Metrics:', {
      // First Contentful Paint
      FCP: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
      
      // Largest Contentful Paint
      LCP: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime,
      
      // Time to Interactive
      TTI: navigation?.domInteractive,
      
      // Total Blocking Time
      TBT: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    });
  }
};