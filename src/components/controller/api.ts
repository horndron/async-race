import { 
  QueryParam,
  Car,
  CarView,
  CarSpeedDistance,
  Winner,
  WinnerView,
  RaceStatus,
  DataParam,
} from '../interfaces/interfaces';

export class AsyncRaceAPi {
  baseUrl: string;

  carsUrl: string;

  engineUrl: string;

  winnersUrl: string;

  constructor(
    baseUrl: string,
    carsUrl: string,
    engineUrl: string,
    winnersUrl: string,
  ) {
    this.baseUrl = baseUrl;
    this.carsUrl = carsUrl;
    this.engineUrl = engineUrl;
    this.winnersUrl = winnersUrl;
  }

  errorHandler(response: Response): void {
    console.error(`${response.status}: ${response.statusText}`);
  }

  queryParamsToString(queryParams: QueryParam[]): string {
    return `${queryParams
      .map((query) => `${query.name}=${query.value}`).join('&')}`;
  }

  async getCars(queryParams: QueryParam[] = []): Promise<CarView | void> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.carsUrl}${
        queryParams.length ? `?${this.queryParamsToString(queryParams)}` : ''}`)
  
        return response.ok 
        ? {
        items: await response.json(),
        count: Number(response.headers.get('X-Total-Count')),
      }
      : this.errorHandler(response);
    } catch (error) {
      console.warn(error as Error);
    }
  }

  async getCar(id: number): Promise<Car> {
    const response = await fetch(`${this.baseUrl}/${this.carsUrl}/${id}`);

    return response.json();
  }

  async createCar(newcar: Car): Promise<Car | void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.carsUrl}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newcar),
        });

      return await response.json();
    } catch (error) {
      console.warn(error as Error);
    }
  }

  async deleteCar(id: number): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/${this.carsUrl}/${id}`, { method: 'DELETE' });

    return await response.json();
  }

  async updateCar(id: number, body: Car): Promise<Car> {
    const response = await fetch(
      `${this.baseUrl}/${this.carsUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

    return await response.json();
  }

  async changeStateCarEngine(
    id: number,
    status: string,
  ): Promise<CarSpeedDistance | void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.engineUrl}?id=${id}&status=${status}`,
        { method: 'PATCH' },
      );
    
      return await response.json();
    } catch (error) {
      console.warn(error as Error);
    }
  }

  async switchDriveModeCarEngine(id: number): Promise<RaceStatus | void> {
    try {
      const response = await fetch(
        `${this.baseUrl}/${this.engineUrl}?id=${id}&status=drive`,
        { method: 'PATCH' },
      );
      
      return response.json();
    } catch (error) {
      console.warn(error as Error);
    }
  }

  async getWinners(queryParams: QueryParam[] = []): Promise<WinnerView | void> {
    try {
      const response = await fetch(`${this.baseUrl}/${this.winnersUrl}${
        queryParams.length ? `?${this.queryParamsToString(queryParams)}` : ''}`);

      return {
        items: await response.json(),
        count: Number(response.headers.get('X-Total-Count')),
      };
    } catch (error) {
      console.warn(error as Error);
    }
  }

  async getWinner(id: number): Promise<Winner | void> {
    const response = await fetch(`${this.baseUrl}/${this.winnersUrl}/${id}`);

    return response.ok ? await response.json() : this.errorHandler(response);
  }

  async createWinner(newWinner: Winner): Promise<Winner | void> {
    const response = await fetch(
      `${this.baseUrl}/${this.winnersUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWinner),
      });

    return response.ok ? await response.json() : this.errorHandler(response);
  }

  async deleteWinner(id: number): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/${this.winnersUrl}/${id}`, { method: 'DELETE' });
    
    return response.ok ? await response.json() : this.errorHandler(response);
  }

  async updateWinner(id: number, body: DataParam): Promise<Car> {
    const response = await fetch(
      `${this.baseUrl}/${this.winnersUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    return response.ok ? await response.json() : this.errorHandler(response);
  }
}

export default AsyncRaceAPi;
