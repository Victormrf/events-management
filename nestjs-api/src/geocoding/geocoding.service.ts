import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GeocodingService {
  private readonly logger = new Logger(GeocodingService.name);
  private readonly baseUrl = 'https://nominatim.openstreetmap.org';

  async getCoordinates(address: {
    street: string;
    city: string;
    state: string;
    country: string;
  }): Promise<{ lat: number; lng: number } | null> {
    const query = `${address.street}, ${address.city}, ${address.state}, ${address.country}`;
    const url = `${this.baseUrl}/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

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
    const url = `${this.baseUrl}/search?format=json&q=${encodeURIComponent(query)}&limit=1`;

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
    // Forçamos o uso de ponto como separador e 6 casas decimais
    const safeLat = lat.toFixed(6);
    const safeLng = lng.toFixed(6);
    const url = `${this.baseUrl}/reverse?format=json&lat=${safeLat}&lon=${safeLng}&zoom=10&addressdetails=1`;

    this.logger.debug(`Consultando Nominatim em: ${url}`);

    try {
      // Verificamos se o fetch existe (para Node < 18)
      if (typeof fetch === 'undefined') {
        throw new Error(
          'Global fetch não está disponível. Por favor, use Node 18+ ou instale o node-fetch.',
        );
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'XploreHub-App-NestJS-v2', // Alterado para garantir exclusividade
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Nominatim retornou status ${response.status}: ${errorText}`,
        );
        return null;
      }

      const data = await response.json();

      if (data.error) {
        this.logger.warn(`Nominatim retornou um erro lógico: ${data.error}`);
        return null;
      }

      const addr = data.address;

      if (!addr) {
        this.logger.warn(
          `Nominatim não retornou o objeto 'address' para ${url}`,
        );
        return null;
      }

      return {
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
      this.logger.error(
        `Exceção capturada no Geocoding Service: ${error.message}`,
      );
      return null;
    }
  }
}
