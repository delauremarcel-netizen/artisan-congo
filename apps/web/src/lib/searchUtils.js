import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing search inputs
 */
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Generates a PocketBase filter string based on search criteria
 */
export const buildSearchFilter = (filters, debouncedSearch) => {
  const conditions = [];

  // Base condition: only visible profiles
  conditions.push(`profile_visibility = "visible"`);

  if (debouncedSearch) {
    conditions.push(`(name ~ "${debouncedSearch.replace(/"/g, '\\"')}" || bio ~ "${debouncedSearch.replace(/"/g, '\\"')}")`);
  }

  if (filters.category && filters.category !== 'all') {
    conditions.push(`category = "${filters.category}"`);
  }

  if (filters.city && filters.city !== 'all') {
    conditions.push(`city = "${filters.city}"`);
  }

  if (filters.minScore > 0) {
    conditions.push(`score_global >= ${filters.minScore}`);
  }

  if (filters.minRating > 0) {
    conditions.push(`rating_average >= ${filters.minRating}`);
  }

  if (filters.badges && filters.badges.length > 0) {
    const badgeConditions = filters.badges.map(b => `badge = "${b}"`);
    conditions.push(`(${badgeConditions.join(' || ')})`);
  }

  return conditions.join(' && ');
};

/**
 * Maps frontend sort options to PocketBase sort strings
 */
export const getSortString = (sortBy) => {
  switch (sortBy) {
    case 'score': return '-score_global';
    case 'rating': return '-rating_average';
    case 'newest': return '-created';
    case 'relevance': default: return '-score_global,-rating_average';
  }
};

/**
 * Returns color classes based on score
 */
export const getScoreColorClasses = (score) => {
  if (score >= 71) return 'bg-success/10 text-success border-success/20';
  if (score >= 41) return 'bg-warning/10 text-warning border-warning/20';
  return 'bg-destructive/10 text-destructive border-destructive/20';
};