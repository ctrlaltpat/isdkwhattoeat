export interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface UserRecord extends User {
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  cuisine: string;
  radius: number;
  location?: string;
}

export interface UserSettingsRecord extends UserSettings {
  id: string;
  userId: string;
}

export interface UserHistory {
  id: string;
  userId: string;
  placeObj: string | object;
  createdAt: Date;
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GooglePlacePhoto {
  height: number;
  width: number;
  photo_reference: string;
  html_attributions: string[];
}
