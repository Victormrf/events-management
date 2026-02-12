import { Injectable } from '@nestjs/common';

@Injectable()
export class GeocodingService {
  private readonly baseUrl = 'https://nominatim.openstreetmap.org/search';

  async getCoordinates(address: {
    street: string;
    city: string;
    state: string;
    country: string;
  }): Promise<{ lat: number; lng: number } | null> {
    const query = `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
    const url = `${this.baseUrl}?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'XploreHub-Portfolio-App',
        },
      });

      if (!response.ok) return null;

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (error) {
      console.error('Erro na Geocodificação Nominatim:', error.message);
      return null;
    }
  }

  async getCoordinatesByQuery(
    query: string,
  ): Promise<{ lat: number; lng: number } | null> {
    const url = `${this.baseUrl}?format=json&q=${encodeURIComponent(query)}&limit=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'XploreHub-Portfolio-App',
        },
      });

      if (!response.ok) return null;

      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (error) {
      console.error('Erro na Geocodificação Nominatim:', error.message);
      return null;
    }
  }
}
