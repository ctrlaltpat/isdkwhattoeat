import { User, UserSettings, UserHistory } from "@/types";

class APIClient {
  private baseUrl = "/api";

  private async fw<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async createUser(userData: {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    password: string;
  }) {
    return this.fw<User>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getUserSettings() {
    return this.fw<UserSettings>("/user/settings");
  }

  async updateUserSettings(settings: Partial<UserSettings>) {
    return this.fw<UserSettings>("/user/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    });
  }

  async getUserHistory() {
    return this.fw<UserHistory[]>("/user/history");
  }

  async addToHistory(placeData: object) {
    return this.fw<UserHistory>("/user/history", {
      method: "POST",
      body: JSON.stringify({ placeObj: JSON.stringify(placeData) }),
    });
  }

  async get<T>(url: string) {
    return this.fw<T>(url);
  }

  async patch<T>(url: string, data: object) {
    return this.fw<T>(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }
}

export const api = new APIClient();
