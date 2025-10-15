import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get session ID from localStorage
function getSessionId(): string | null {
  try {
    return localStorage.getItem("sessionId");
  } catch {
    return null;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const sessionId = getSessionId();
  const headers: Record<string, string> = data ? { "Content-Type": "application/json" } : {};
  
  if (sessionId) {
    headers["Authorization"] = `Bearer ${sessionId}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    const sessionId = getSessionId();
    const headers: Record<string, string> = {};
    
    if (sessionId) {
      headers["Authorization"] = `Bearer ${sessionId}`;
    }

    // Create timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const res = await fetch(queryKey.join("/") as string, {
        credentials: "include",
        headers,
        signal: signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 60000, // 1 minute
      gcTime: 300000, // 5 minutes
      retry: 1,
      retryDelay: 1000,
      networkMode: 'online', // Only fetch when online
    },
    mutations: {
      retry: false,
      networkMode: 'online',
    },
  },
});

console.log('QueryClient initialized successfully');
