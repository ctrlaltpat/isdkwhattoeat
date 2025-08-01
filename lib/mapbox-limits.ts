export const MAPBOX_LIMITS = {
  MAX_SEARCHES_PER_DAY: 1000,
  MAX_DIRECTIONS_PER_DAY: 500,

  SEARCH_COOLDOWN_MS: 2000,
  DIRECTIONS_COOLDOWN_MS: 5000,
};

class UsageTracker {
  private static instance: UsageTracker;
  private searchCount = 0;
  private directionsCount = 0;
  private lastSearch = 0;
  private lastDirections = 0;
  private resetDate = new Date().toDateString();

  static getInstance(): UsageTracker {
    if (!UsageTracker.instance) {
      UsageTracker.instance = new UsageTracker();
    }
    return UsageTracker.instance;
  }

  private resetIfNewDay() {
    const today = new Date().toDateString();
    if (today !== this.resetDate) {
      this.searchCount = 0;
      this.directionsCount = 0;
      this.resetDate = today;
    }
  }

  canMakeSearchRequest(): boolean {
    this.resetIfNewDay();
    const now = Date.now();

    if (this.searchCount >= MAPBOX_LIMITS.MAX_SEARCHES_PER_DAY) {
      return false;
    }

    if (now - this.lastSearch < MAPBOX_LIMITS.SEARCH_COOLDOWN_MS) {
      return false;
    }

    return true;
  }

  canMakeDirectionsRequest(): boolean {
    this.resetIfNewDay();
    const now = Date.now();

    if (this.directionsCount >= MAPBOX_LIMITS.MAX_DIRECTIONS_PER_DAY) {
      return false;
    }

    if (now - this.lastDirections < MAPBOX_LIMITS.DIRECTIONS_COOLDOWN_MS) {
      return false;
    }

    return true;
  }

  recordSearchRequest() {
    this.searchCount++;
    this.lastSearch = Date.now();
  }

  recordDirectionsRequest() {
    this.directionsCount++;
    this.lastDirections = Date.now();
  }

  getUsageStats() {
    this.resetIfNewDay();
    return {
      searches: this.searchCount,
      directions: this.directionsCount,
      maxSearches: MAPBOX_LIMITS.MAX_SEARCHES_PER_DAY,
      maxDirections: MAPBOX_LIMITS.MAX_DIRECTIONS_PER_DAY,
    };
  }
}

export const usageTracker = UsageTracker.getInstance();
