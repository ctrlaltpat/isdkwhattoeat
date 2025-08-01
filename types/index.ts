export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id: string;
  userId: string;
  cuisine: string;
  radius: number;
}

export interface UserHistory {
  id: string;
  userId: string;
  placeObj: string | object;
  createdAt: Date;
}

export interface PlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
  html_attributions: string[];
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  rating?: number;
  price_level?: number;
  opening_hours?: {
    periods: Array<{
      close: {
        day: number;
        time: string;
        hours: number;
      };
      open: {
        day: number;
        time: string;
        hours: number;
      };
    }>;
  };
  photos?: PlacePhoto[];
  geometry: {
    location: LatLng | { lat: number; lng: number };
  };
  website?: string;
  url?: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
