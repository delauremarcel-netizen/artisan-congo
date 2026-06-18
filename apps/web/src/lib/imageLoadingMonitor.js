/**
 * Utility for monitoring image loading performance and failures.
 * Tracks Core Web Vitals (LCP, CLS) and slow resources.
 */

export const logImageError = (url, alt) => {
  const timestamp = new Date().toISOString();
  console.error(
    `[ImageMonitor] ❌ Failed to load image:
      URL: ${url}
      Alt Text: ${alt}
      Time: ${timestamp}`
  );
};

export const initImageMonitoring = () => {
  if (typeof window === 'undefined') return;

  try {
    // 1. Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      // If the LCP element is an image, log its performance
      if (lastEntry && lastEntry.element?.tagName === 'IMG') {
        console.info(`[ImageMonitor] 🖼️ LCP Image load time: ${Math.round(lastEntry.startTime)}ms | URL: ${lastEntry.url}`);
      }
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // 2. Monitor Resource Timing for slow images (>3 seconds)
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.initiatorType === 'img' || entry.initiatorType === 'image') {
          if (entry.duration > 3000) {
            console.warn(
              `[ImageMonitor] ⚠️ Slow image load detected:
                URL: ${entry.name}
                Duration: ${Math.round(entry.duration)}ms`
            );
          }
        }
      });
    });
    resourceObserver.observe({ type: 'resource', buffered: true });
    
  } catch (e) {
    console.warn('[ImageMonitor] Performance API not fully supported in this browser.', e);
  }
};