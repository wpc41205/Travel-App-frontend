import { computed, ref } from "vue";

const AUTH_KEY = "authToken";
const FALLBACK_TOKEN = "__authenticated__";

const currentToken = ref<string | null>(getStoredToken());

function getStoredToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem(AUTH_KEY) ||
    window.sessionStorage.getItem(AUTH_KEY)
  );
}

function persistToken(token: string | null, remember: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_KEY);
  window.sessionStorage.removeItem(AUTH_KEY);

  if (!token) {
    console.warn("No token provided to persistToken");
    return;
  }

  if (remember) {
    window.localStorage.setItem(AUTH_KEY, token);
  } else {
    window.sessionStorage.setItem(AUTH_KEY, token);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", () => {
    currentToken.value = getStoredToken();
  });
}

export function useAuth() {
  const isAuthenticated = computed(() => Boolean(currentToken.value));

  const login = (token?: string | null, remember = false) => {
    const value = token ?? FALLBACK_TOKEN;
    currentToken.value = value;
    persistToken(value, remember);
  };

  const logout = () => {
    currentToken.value = null;
    persistToken(null, false);
  };

  const sync = () => {
    currentToken.value = getStoredToken();
  };

  return { isAuthenticated, login, logout, sync };
}

export function getAuthToken() {
  return currentToken.value;
}

