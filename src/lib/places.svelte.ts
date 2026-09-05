export interface Place {
  id: number;
  owner_id: number;
  group_id: number | null;
  owner_username: string;
  title: string;
  description: string;
  access: string;
  max_players: number;
  visit_count: number;
  thumbs_up: number;
  thumbs_down: number;
  active_players: number;
  created_at: number;
  updated_at: number;
  thumbnail_url: string | null;
  square_thumbnail_url: string | null;
  age_rating: string;
  content_warnings: string[];
  content_warning: string | null;
}

export function createPlacesStore(userId: number | string) {
  let places = $state<Place[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  let currentPage = $state(0);
  let limit = $state(50);
  let total = $state(0);

  let totalVisits = $state(0);
  let totalVisitsLoading = $state(true);

  const totalPages = $derived(Math.max(1, Math.ceil(total / limit)));

  async function fetchPlaces(pageIndex: number) {
    loading = true;
    error = null;

    try {
      const offset = pageIndex * limit;
      const res = await fetch(
        `https://api.luduvo.com/users/${userId}/places?offset=${offset}&limit=${limit}`,
      );

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }

      const data = await res.json();

      places = data.places;
      total = data.total;
      limit = data.limit;
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load games";
    } finally {
      loading = false;
    }
  }

  async function fetchTotalVisits() {
    totalVisitsLoading = true;

    try {
      const pageLimit = 100;
      let offset = 0;
      let sum = 0;
      let seenTotal = Infinity;

      while (offset < seenTotal) {
        const res = await fetch(
          `https://api.luduvo.com/users/${userId}/places?offset=${offset}&limit=${pageLimit}`,
        );

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();

        for (const place of data.places as Place[]) {
          sum += place.visit_count;
        }

        seenTotal = data.total;
        offset += data.places.length || pageLimit;

        if (data.places.length === 0) break;
      }

      totalVisits = sum;
    } catch {
      // noop
    } finally {
      totalVisitsLoading = false;
    }
  }

  function nextPage() {
    if (currentPage < totalPages - 1) {
      currentPage += 1;

      fetchPlaces(currentPage);
    }
  }

  function prevPage() {
    if (currentPage > 0) {
      currentPage -= 1;

      fetchPlaces(currentPage);
    }
  }

  function firstPage() {
    if (currentPage !== 0) {
      currentPage = 0;

      fetchPlaces(currentPage);
    }
  }

  function lastPage() {
    const last = totalPages - 1;

    if (currentPage !== last) {
      currentPage = last;

      fetchPlaces(currentPage);
    }
  }

  return {
    get places() {
      return places;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get currentPage() {
      return currentPage;
    },
    get limit() {
      return limit;
    },
    get total() {
      return total;
    },
    get totalPages() {
      return totalPages;
    },
    get totalVisits() {
      return totalVisits;
    },
    get totalVisitsLoading() {
      return totalVisitsLoading;
    },
    fetchPlaces,
    fetchTotalVisits,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
  };
}
