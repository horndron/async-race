import { AppView } from '../view/appView';
import { AsyncRaceAPi } from '../controller/api';

export class App {
  appview: AppView;

  constructor(
    api: AsyncRaceAPi,
    carContainer: HTMLElement,
    winnersContainer: HTMLElement,
  ) {
    this.appview = new AppView(api, carContainer, winnersContainer);
  }

  start(): void {
    this.appview.renderView();
    this.appview.addHandlers(); 
  }
}

export default App;
