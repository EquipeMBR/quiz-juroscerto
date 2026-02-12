
/**
 * Simple analytics utility for tracking user progression.
 * In a production environment, these methods would call an external API 
 * (e.g., Google Analytics, Mixpanel, Segment).
 */

export const trackPageView = (pageId: number, title: string) => {
  console.log(`[Analytics] Page View: ${pageId} - ${title}`, {
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
};

export const trackAnswer = (questionTitle: string, answerLabel: string) => {
  console.log(`[Analytics] Answer Selected:`, {
    question: questionTitle,
    answer: answerLabel,
    timestamp: new Date().toISOString(),
  });
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log(`[Analytics] Event: ${eventName}`, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};
