import { AsyncRaceAPi } from '../controller/api';
import { Garage } from './garage/garage';
import { Winners } from './winners/winners';

export class AppView {
  garage: Garage;

  winners: Winners

  constructor(
    api: AsyncRaceAPi,
    carContainer: HTMLElement,
    winnersContainer: HTMLElement,
  ) {
    this.garage = new Garage(carContainer, api);
    this.winners = new Winners(winnersContainer, api);
  }

  renderView(): void {
    try {
      this.garage.createControllGarage();
      this.garage.renderCars();
      this.winners.createWinnersTable();
      this.winners.renderWinners();
    } catch (error) {
      console.error('Error');
    }
    
  }

  addHandlers(): void {
    this.garage.addCreateCarHandler();
    this.garage.addUpdateCarHandler();
    this.garage.addGenerateCarsHandler();
    this.garage.addSelectCarHandler();
    this.garage.addRemoveCarHandler();
    this.garage.addAnimationCarHandler();
    this.garage.resetAnimationCarHandler();
    this.garage.addRaceHandler();
    this.garage.rasetCarsHandler();
    this.garage.addPaginationsHandler();
    this.winners.addUpdateWinnersHandler();
    this.winners.addSortWinnerHandler();
    this.winners.addPaginationsHandler();
  }
}

export default AppView;
