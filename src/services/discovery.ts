import api from "./api";

export const discoveryService = {
  getLanding: async () => {
    const response = await api.get("/discovery/landing");
    return response.data;
  },
  getExplore: async (search?: string) => {
    const response = await api.get("/discovery/explore", {
      params: { search: search || undefined },
    });
    return response.data;
  },
  getCreators: async ({
    pageParam = 1,
    limit = 25,
    search,
    category,
  }: {
    pageParam?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) => {
    const response = await api.get("/discovery/creators", {
      params: {
        page: pageParam,
        limit,
        search: search || undefined,
        category: category && category !== "All Creators" ? category : undefined,
      },
    });
    return response.data;
  },
  getCreatorByUsername: async (username: string) => {
    const response = await api.get(`/discovery/creators/${username}`);
    return response.data;
  },
  getAuthSettings: async () => {
    const response = await api.get("/discovery/auth-settings");
    return response.data;
  },
};
