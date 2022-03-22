import { AsyncRaceAPi } from '../../controller/api';
import { 
  QueryParam,
  DataParam,
  RaceWinner,
  CarSpeedDistance
} from '../../interfaces/interfaces';
import { createCar, createRandomCar } from '../car/car';
import {
  setDisableValue,
  draw,
  toWinner,
  isPrevPaginationValue,
  isNextPaginationValue
} from '../utils/utils';
import {
  CAR_LIMIT,
  START_ENGINE,
  START_ENGINE_ID,
  STOP_ENGINE,
  STOP_ENGINE_ID,
  COUNT_CARS_GENERATE,
  SELECT_DATA_ID,
  REMOVE_DATA_ID,
} from '../constants/constants';

export class Garage {
  container: HTMLElement;
  api: AsyncRaceAPi;
  pageNumber: number;

  constructor(container: HTMLElement, api: AsyncRaceAPi) {
    this.container = container;
    this.api = api;
    this.pageNumber = 1;
  }

  createControllGarage(): void {
    const controllContainer = document.createElement('div')  as HTMLElement;
    controllContainer.classList.add('controll-garage');
    controllContainer.innerHTML = `
    <div class="input-group mb-3">
      <input class="form-control me-1" type="text" id="name-car" 
      name="name-car" placeholder="Input name">
      <input class="form-control me-1" type="color" id="color-car" 
      name="color-car" value="#ffffff">
      <input class="btn btn-secondary" type="submit" 
      value="Create" id="create-car">
    </div>
    <div class="input-group mb-3">
      <input class="form-control update-car me-1" 
      type="text" id="update-name-car" 
      name="update-name-car" placeholder="Update name" disabled>
      <input class="form-control update-car me-1" 
      type="color" id="update-color-car" 
      name="update-color-car" value="#ffffff" disabled>
      <input class="btn btn-secondary update-car" 
      type="submit" id="update-car" value="Update" disabled>
    </div>
    <div class="input-group mb-3">
      <button class="btn btn-success me-2" id="race">Race</button>
      <button class="btn btn-danger me-2" id="reset" disabled>Reset</button>
      <button class="btn btn-secondary" id="generate">Generate cars</button>
    </div>
    `;
    this.container.prepend(controllContainer);
  }

  async renderCars(): Promise<void> {
    const QUERY_PARAMS: QueryParam[] = [
      { name: '_page', value: this.pageNumber },
      { name: '_limit', value: CAR_LIMIT },
    ];
    const cars = await this.api.getCars(QUERY_PARAMS);
    const carCount = this.container
      .querySelector('span[data-id="total-count"]') as HTMLElement;
    carCount.textContent = `${cars?.count}`;
    const carPage = this.container
      .querySelector('span[data-id="page"]') as HTMLElement;
    carPage.textContent = `#${this.pageNumber}`;
    const carsContainer = this.container
      .querySelector('.content') as HTMLElement;
    carsContainer.innerHTML = '';

    cars?.items.forEach((car) => carsContainer.append(createCar(car)))
  }
  
  async drawAnimationCar(
    car: HTMLElement,
    carId: number,
    length: number,
    stopBtn: HTMLButtonElement,
    carName?: string,
  ): Promise<RaceWinner | void> {
    const carProperties = await this.api
      .changeStateCarEngine(carId, START_ENGINE) as CarSpeedDistance;
    let result = true;
    const duration = carProperties.distance / carProperties.velocity;
    let success = this.api.switchDriveModeCarEngine(carId)
      .then(() => {
        stopBtn.disabled = false;
        return {
          id: carId,
          wins: 1,
          time: Math.round(duration) / 1000,
          name: carName,
        }
      })
      .catch(() => {
        stopBtn.disabled = false;
        result = false;
      });

    let start = performance.now();
    
    requestAnimationFrame(function animate(time: number) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;
      draw(car, timeFraction, length)
      if (timeFraction < 1 && result) {
        requestAnimationFrame(animate);
      }
    })
    return await success;
  }

  async prepareCarAnimation(
    carContainer: HTMLElement,
    name?: string,
    ) : Promise<RaceWinner | void> {
    const stopEngineBtn = carContainer.nextElementSibling as HTMLButtonElement;
    const track= carContainer.querySelector('.race-track') as HTMLElement;
    const car = carContainer.querySelector('.car-image') as HTMLElement;
    
    return this.drawAnimationCar(
      car,
      Number(carContainer.dataset.car),
      track.offsetWidth,
      stopEngineBtn,
      name,
    )
  }

  addAnimationCarHandler(): void {
    const carsContainer = this.container as HTMLElement;

    carsContainer.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLButtonElement;

      if (target.dataset.id === START_ENGINE_ID) {
        target.disabled = true;
        const stopBtn = target.nextElementSibling as HTMLButtonElement;
        const carContainer = target.closest('.car-item') as HTMLElement;
        this.prepareCarAnimation(carContainer)
          .then(() => setDisableValue(stopBtn, false));
      }
    })
  }

  resetAnimation(carContainer: HTMLElement): void {
    const startBtn = carContainer
      .querySelector('[data-id="start-engine"]') as HTMLButtonElement;
    const stopBtn = carContainer
      .querySelector('[data-id="stop-engine"]') as HTMLButtonElement;
    const carImage = carContainer.querySelector('.car-image') as HTMLElement;
    setDisableValue(startBtn, false);
    setDisableValue(stopBtn, true);
    carImage.style.transform = '';
    this.api.changeStateCarEngine(Number(carContainer.dataset.car), STOP_ENGINE);
  }

  resetAnimationCarHandler(): void {
    const carsContainer = this.container as HTMLElement;

    carsContainer.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLButtonElement;

      if (target.dataset.id === STOP_ENGINE_ID) {
        target.disabled = true;
        const carContainer = target.closest('.car-item') as HTMLElement;
        this.resetAnimation(carContainer);
      }
    })
  }

  async toRaceCars(container: HTMLElement): Promise<void> {
    const racePromises: Array<Promise<void | RaceWinner>> = [];
    const resetBtn = this.container.querySelector('#reset') as HTMLButtonElement;
    const cars = container.querySelectorAll('.car-item');

    cars.forEach((car) => {
      const carName = ((car as HTMLElement)
        .querySelector('.name') as HTMLElement).textContent as string;
      const currentCar: Promise<RaceWinner | void> = this
        .prepareCarAnimation(car as HTMLElement, carName).then((res) => {
          return new Promise((resolve, reject) => {
            res ? resolve(res) : reject('Error');
          })
        })
      
      racePromises.push(currentCar);
    });
    Promise.any(racePromises).then((result) => {
      if (result) {
        setDisableValue(resetBtn, false);
        this.api.getWinner(result.id)
          .then((winner) => {
            toWinner(result.name as string, result.time);
            if (winner) {
             const winnerCar: DataParam = {
                wins: winner.wins + 1,
                time: winner.time < result.time ? winner.time : result.time,
              };
              this.api.updateWinner(winner.id, winnerCar);
            } else {
              this.api.createWinner({id: result.id, wins: 1,time: result.time,});
            }
          })
      }
    }).catch((error) => console.warn(error as Error));
  }

  async addRaceHandler(): Promise<void> {
    const raceBtn = this.container.querySelector('#race') as HTMLButtonElement;

    raceBtn.addEventListener('click', ()=> {
      setDisableValue(raceBtn, true);
      
      this.toRaceCars(this.container);
    });
  }

  rasetCarsHandler(): void {
    const raceBtn = this.container.querySelector('#race') as HTMLButtonElement;
    const resetBtn = this.container.querySelector('#reset') as HTMLButtonElement;

    resetBtn.addEventListener('click', ()=> {
      const cars = this.container.querySelectorAll('.car-item');

      cars.forEach((car)=> {
        this.resetAnimation(car as HTMLElement);
      })
      setDisableValue(raceBtn, false);
      setDisableValue(resetBtn, true);
    });
  }

  addCreateCarHandler(): void {
    const nameInput = this.container
      .querySelector('#name-car') as HTMLInputElement;
    const colorInput = this.container
      .querySelector('#color-car') as HTMLInputElement;
    const createBtn = this.container
      .querySelector('#create-car') as HTMLInputElement;

    createBtn.addEventListener('click', () => {
      nameInput.value && colorInput.value 
      ? this.api.createCar({ name: nameInput.value, color: colorInput.value }) 
      : alert('name and color required for car!');
      this.renderCars();
    })
  }

  addUpdateCarHandler() {
    const nameInput = this.container
      .querySelector('#update-name-car') as HTMLInputElement;
    const colorInput = this.container
      .querySelector('#update-color-car') as HTMLInputElement;
    const updateBtn = this.container
      .querySelector('#update-car') as HTMLInputElement;

    updateBtn.addEventListener('click', () => {
      const carId = Number(updateBtn.dataset.car as string);
      nameInput.value && colorInput.value && carId
      ? this.api.updateCar(
        carId,
        { name: nameInput.value, color: colorInput.value }
      ) 
      : alert('name and color required for car!');
      this.renderCars();
      nameInput.value = '';
      colorInput.value = '#ffffff';
      setDisableValue(nameInput, true);
      setDisableValue(colorInput, true);
      setDisableValue(updateBtn, true);
    })
  }

  addGenerateCarsHandler() {
    const generateBtn = this.container
      .querySelector('#generate') as HTMLButtonElement;

    generateBtn.addEventListener('click', async () => {
      for (let i = 0; i < COUNT_CARS_GENERATE; i++) {
        await this.api.createCar(createRandomCar());
      }
      this.renderCars();
    })
  }

  addSelectCarHandler(): void {
    const nameInput = this.container
      .querySelector('#update-name-car') as HTMLInputElement;
    const colorInput = this.container
      .querySelector('#update-color-car') as HTMLInputElement;

    this.container.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.dataset.id === SELECT_DATA_ID) {
        const color = target.dataset.color as string;
        const name = (target.closest('.car-item') as HTMLElement)
          .querySelector('.name') as HTMLElement;

        nameInput.value = name.textContent as string || '';
        colorInput.value = color || '#ffffff';
        
        const updateSubmit = this.container
          .querySelector('#update-car') as HTMLInputElement;
        updateSubmit.dataset.car = `${target.dataset.car}`;

        const updateElements = this.container.querySelectorAll('.update-car');
        updateElements.forEach((element) => {
          setDisableValue(element as HTMLInputElement, false);
        })
      }
    })
  }

  addRemoveCarHandler() : void {
    this.container.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.dataset.id === REMOVE_DATA_ID) {
        this.api.deleteCar(Number(target.dataset.car));
        this.api.deleteWinner(Number(target.dataset.car))
        this.renderCars();
      }
    })
  }

  addPaginationsHandler(): void {
    const prevBtn = this.container
      .querySelector('button[data-id="prev-page"]') as HTMLElement;
    const nextBtn = this.container.querySelector('button[data-id="next-page"]');
    const countCars = this.container
      .querySelector('[data-id="total-count"]') as HTMLElement;
    const pagination = this.container
      .querySelector('.pagination') as HTMLElement;
  
    pagination.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement;
      if (target === prevBtn) {
        const prevValue = isPrevPaginationValue(
          prevBtn as HTMLButtonElement,
          nextBtn as HTMLButtonElement,
          this.pageNumber,
        );
  
        this.pageNumber = prevValue;
      } else if (target === nextBtn) {
        const nextValue = isNextPaginationValue(
          prevBtn as HTMLButtonElement,
          nextBtn as HTMLButtonElement,
          this.pageNumber,
          Number(countCars.textContent),
        );
  
        this.pageNumber = nextValue;
      }
      this.renderCars();
    })
  }
}

export default Garage;
