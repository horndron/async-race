import { AsyncRaceAPi } from './components/controller/api';
import { App } from './components/app/app';
import { renderBasicLayout } from './components/view/layout/layout';
import {
  API_HOST,
  API_GARAGE_URL,
  API_ENGINE_URL,
  API_WINNERS_URL,
} from './components/view/constants/constants';
import './global.sass';

renderBasicLayout();

const garageContainer = document.querySelector('.garage-view') as HTMLElement;
const winnersContainer = document.querySelector('.winners-view') as HTMLElement;
const api = new AsyncRaceAPi(
  API_HOST,
  API_GARAGE_URL,
  API_ENGINE_URL,
  API_WINNERS_URL,
);

const app = new App(api, garageContainer, winnersContainer);

app.start();
