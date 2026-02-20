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

  async getReverseGeocoding(
    lat: number,
    lng: number,
  ): Promise<{ city: string; state: string; country: string } | null> {
    const url = `${this.baseUrl}/reverse?format=json&lat=${lat.toFixed(6)}&lon=${lng.toFixed(6)}&zoom=10&addressdetails=1`;

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'XploreHub-App-NestJS',
        },
      });

      if (!response.ok) return null;

      const data = await response.json();
      const addr = data.address;

      if (!addr) return null;

      return {
        // Nominatim pode retornar a cidade em campos diferentes dependendo da região
        city:
          addr.city ||
          addr.town ||
          addr.village ||
          addr.municipality ||
          addr.county ||
          '',
        state: addr.state || '',
        country: addr.country || '',
      };
    } catch (error) {
      console.error('Erro no Reverse Geocoding (Nominatim):', error.message);
      return null;
    }
  }
}
