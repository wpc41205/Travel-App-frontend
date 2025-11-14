import type { AxiosResponse } from "axios";
import { api } from "../api";

type Nullable<T> = T | null | undefined;

export type UserTrip = {
  id: string;
  ownerId?: Nullable<string | number>;
  title?: Nullable<string>;
  province?: Nullable<string>;
  location?: Nullable<string>;
  description?: Nullable<string>;
  photos?: Nullable<string | string[]>;
  latitude?: Nullable<string | number>;
  longitude?: Nullable<string | number>;
  updatedAt?: Nullable<string | number | Date>;
  createdAt?: Nullable<string | number | Date>;
  [key: string]: unknown;
};

export type UserTripInput = {
  title: string;
  province: string;
  description?: string;
  image?: string;
  latitude?: string;
  longitude?: string;
};

type ApiListResponse<T> = AxiosResponse<T>;

const buildEndpoint = (ownerId: string, tripId?: string | number) => {
  const base = `/users/${encodeURIComponent(ownerId)}/trips`;
  return tripId ? `${base}/${encodeURIComponent(String(tripId))}` : base;
};

const toPayload = (input: UserTripInput) => {
  const photos = input.image?.trim();

  return {
    title: input.title.trim(),
    province: input.province.trim(),
    description: input.description?.trim() || undefined,
    photos: photos ? [photos] : undefined,
    latitude: input.latitude?.trim() || undefined,
    longitude: input.longitude?.trim() || undefined,
  };
};

export async function getUserTrips(ownerId: string): Promise<UserTrip[]> {
  if (!ownerId) {
    return [];
  }

  try {
    const response: ApiListResponse<UserTrip[]> = await api.get(buildEndpoint(ownerId));
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Failed to fetch user trips", error);
    throw error;
  }
}

export async function createUserTrip(ownerId: string, input: UserTripInput): Promise<UserTrip> {
  try {
    const response = await api.post<UserTrip>(buildEndpoint(ownerId), toPayload(input));
    return response.data;
  } catch (error) {
    console.error("Failed to create user trip", error);
    throw error;
  }
}

export async function updateUserTrip(
  ownerId: string,
  tripId: string | number,
  input: UserTripInput,
): Promise<UserTrip> {
  try {
    const response = await api.put<UserTrip>(buildEndpoint(ownerId, String(tripId)), toPayload(input));
    return response.data;
  } catch (error) {
    console.error("Failed to update user trip", error);
    throw error;
  }
}

export async function deleteUserTrip(ownerId: string, tripId: string | number): Promise<void> {
  try {
    await api.delete(buildEndpoint(ownerId, String(tripId)));
  } catch (error) {
    console.error("Failed to delete user trip", error);
    throw error;
  }
}


