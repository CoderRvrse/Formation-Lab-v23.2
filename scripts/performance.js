// Performance monitoring module for Formation Lab v23.2+
// Tracks Core Web Vitals and provides performance insights

/**
 * Performance metrics tracking
 */
const metrics = {
  FCP: null,  // First Contentful Paint
  LCP: null,  // Largest Contentful Paint
  FID: null,  // First Input Delay
  CLS: null,  // Cumulative Layout Shift
  TTFB: null  // Time to First Byte
};

/**
 * Initialize performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof performance === 'undefined' || typeof PerformanceObserver === 'undefined') {
    console.warn('Performance API not supported');
    return;
  }

  // Track First Contentful Paint (FCP)
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          console.log(`⚡ FCP: ${Math.round(entry.startTime)}ms`);
        }
      }
    });
    fcpObserver.observe({ entryTypes: ['paint'] });
  } catch (e) {
    // Silently fail if not supported
  }

  // Track Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      console.log(`⚡ LCP: ${Math.round(metrics.LCP)}ms`);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    // Silently fail if not supported
  }

  // Track First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        metrics.FID = entry.processingStart - entry.startTime;
        console.log(`⚡ FID: ${Math.round(metrics.FID)}ms`);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    // Silently fail if not supported
  }

  // Track Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          metrics.CLS = clsValue;
        }
      }
      console.log(`⚡ CLS: ${metrics.CLS.toFixed(4)}`);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    // Silently fail if not supported
  }

  // Track Time to First Byte (TTFB)
  try {
    const navigationTiming = performance.getEntriesByType('navigation')[0];
    if (navigationTiming) {
      metrics.TTFB = navigationTiming.responseStart - navigationTiming.requestStart;
      console.log(`⚡ TTFB: ${Math.round(metrics.TTFB)}ms`);
    }
  } catch (e) {
    // Silently fail if not supported
  }

  // Log performance summary after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logPerformanceSummary();
    }, 3000); // Wait 3s for metrics to settle
  });
}

/**
 * Get current performance metrics
 * @returns {Object} Performance metrics
 */
export function getPerformanceMetrics() {
  return { ...metrics };
}

/**
 * Log performance summary to console
 */
export function logPerformanceSummary() {
  console.group('⚡ Performance Summary');

  if (metrics.FCP) {
    const fcpGrade = metrics.FCP < 1800 ? '✅ Good' : metrics.FCP < 3000 ? '⚠️ Needs Improvement' : '❌ Poor';
    console.log(`FCP: ${Math.round(metrics.FCP)}ms ${fcpGrade}`);
  }

  if (metrics.LCP) {
    const lcpGrade = metrics.LCP < 2500 ? '✅ Good' : metrics.LCP < 4000 ? '⚠️ Needs Improvement' : '❌ Poor';
    console.log(`LCP: ${Math.round(metrics.LCP)}ms ${lcpGrade}`);
  }

  if (metrics.FID !== null) {
    const fidGrade = metrics.FID < 100 ? '✅ Good' : metrics.FID < 300 ? '⚠️ Needs Improvement' : '❌ Poor';
    console.log(`FID: ${Math.round(metrics.FID)}ms ${fidGrade}`);
  }

  if (metrics.CLS !== null) {
    const clsGrade = metrics.CLS < 0.1 ? '✅ Good' : metrics.CLS < 0.25 ? '⚠️ Needs Improvement' : '❌ Poor';
    console.log(`CLS: ${metrics.CLS.toFixed(4)} ${clsGrade}`);
  }

  if (metrics.TTFB) {
    const ttfbGrade = metrics.TTFB < 800 ? '✅ Good' : metrics.TTFB < 1800 ? '⚠️ Needs Improvement' : '❌ Poor';
    console.log(`TTFB: ${Math.round(metrics.TTFB)}ms ${ttfbGrade}`);
  }

  console.groupEnd();
}

/**
 * Track custom performance mark
 * @param {string} name - Mark name
 */
export function mark(name) {
  if (typeof performance !== 'undefined' && performance.mark) {
    performance.mark(name);
  }
}

/**
 * Measure performance between two marks
 * @param {string} name - Measure name
 * @param {string} startMark - Start mark name
 * @param {string} endMark - End mark name
 * @returns {number|null} Duration in ms
 */
export function measure(name, startMark, endMark) {
  if (typeof performance !== 'undefined' && performance.measure) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure ? measure.duration : null;
    } catch (e) {
      console.warn(`Could not measure ${name}:`, e);
      return null;
    }
  }
  return null;
}

/**
 * Get bundle size estimate from loaded scripts
 * @returns {Object} Bundle size information
 */
export function getBundleSize() {
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;

  const sizes = Array.from(scripts).map(script => {
    const entry = performance.getEntriesByName(script.src)[0];
    if (entry) {
      const size = entry.transferSize || entry.encodedBodySize || 0;
      totalSize += size;
      return {
        url: script.src,
        size: size,
        sizeKB: (size / 1024).toFixed(2)
      };
    }
    return null;
  }).filter(Boolean);

  return {
    scripts: sizes,
    totalSize: totalSize,
    totalSizeKB: (totalSize / 1024).toFixed(2)
  };
}

/**
 * Get memory usage (if available)
 * @returns {Object|null} Memory usage information
 */
export function getMemoryUsage() {
  if (performance.memory) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      usedMB: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2),
      totalMB: (performance.memory.totalJSHeapSize / 1024 / 1024).toFixed(2)
    };
  }
  return null;
}

/**
 * Log bundle size information
 */
export function logBundleSize() {
  const bundleInfo = getBundleSize();
  console.group('📦 Bundle Size');
  console.log(`Total: ${bundleInfo.totalSizeKB} KB`);
  bundleInfo.scripts.forEach(script => {
    console.log(`  ${script.sizeKB} KB - ${script.url.split('/').pop()}`);
  });
  console.groupEnd();
}

/**
 * Monitor long tasks (> 50ms)
 */
export function monitorLongTasks() {
  if (typeof PerformanceObserver === 'undefined') {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.warn(`⚠️ Long Task detected: ${Math.round(entry.duration)}ms`);
      }
    });
    observer.observe({ entryTypes: ['longtask'] });
  } catch (e) {
    // Long task API not supported
  }
}

// Auto-initialize performance monitoring in dev environment
if (location.hostname === '127.0.0.1' || location.hostname === 'localhost') {
  window.addEventListener('DOMContentLoaded', () => {
    initPerformanceMonitoring();
    monitorLongTasks();
  });
}

// Export for manual use
export default {
  init: initPerformanceMonitoring,
  getMetrics: getPerformanceMetrics,
  logSummary: logPerformanceSummary,
  mark,
  measure,
  getBundleSize,
  getMemoryUsage,
  logBundleSize,
  monitorLongTasks
};
