import axios from "axios";

type Nullable<T> = T | null | undefined;

export type Trip = {
  id?: Nullable<string | number>;
  title?: Nullable<string>;
  category?: Nullable<string>;
  subtitle?: Nullable<string>;
  description?: Nullable<string>;
  photos?: Nullable<string | string[]>;
  latitude?: Nullable<number | string>;
  longitude?: Nullable<number | string>;
  price?: Nullable<number | string>;
  duration?: Nullable<string>;
  location?: Nullable<string>;
  tags?: Nullable<string | string[]>;
  topics?: Nullable<string | string[]>;
  keywords?: Nullable<string | string[]>;
  link?: Nullable<string>;
  url?: Nullable<string>;
  [key: string]: unknown;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
});

export async function getTrips(): Promise<Trip[]> {
  try {
    const response = await api.get<Trip[]>("/trips");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error fetching trips:", error);
    return [];
  }
}

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
};

export async function register(payload: RegisterPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await api.post("/register", payload);
    return { success: true, ...response.data };
  } catch (error: any) {
    let message = "การลงทะเบียนล้มเหลว";
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    return { success: false, message };
  }
}

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload): Promise<{ success: boolean; message?: string; token?: string }> {
  try {
    const response = await api.post("/login", payload);
    // Assume the backend returns a token and/or a success message
    return { success: true, ...response.data };
  } catch (error: any) {
    let message = "เข้าสู่ระบบไม่สำเร็จ";
    if (error.response && error.response.data && error.response.data.message) {
      message = error.response.data.message;
    }
    return { success: false, message };
  }
}
