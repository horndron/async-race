import { createDivBlock } from '../utils/utils';
import { addNavigationHandler } from './navigationHandler';
import {
  GARAGE_CLASSNAME,
  GARAGE_TITLE,
  WINNERS_CLASSNAME,
  WINNERS_TITLE,
} from '../constants/constants';

function createHeader(container: HTMLElement): void {
  const header = document.createElement('header');
  header.innerHTML = `
  <nav class="navbar container justify-content-start mt-1 mb-3">
    <button class="btn btn-success me-3" data-page="garage">TO GARAGE</button>
    <button class="btn btn-success"  data-page="winners">TO WINNERS</button>
  </nav>
  `;
  container.prepend(header);
}

function createMainLayout(container: HTMLElement): void {
  const main = document.createElement('main') as HTMLElement;
  main.classList.add('container');
  main.innerHTML = `
  <section class="garage-view"></section>
  <section class="winners-view d-none"></section>
  `;

  const garage = main.querySelector('.garage-view') as HTMLElement;
  garage.append(createDivBlock(GARAGE_CLASSNAME, GARAGE_TITLE));

  const winners = main.querySelector('.winners-view') as HTMLElement;
  winners.append(createDivBlock(WINNERS_CLASSNAME, WINNERS_TITLE));

  container.append(main);
}

export function renderBasicLayout() {
  const BODY = document.querySelector('body') as HTMLBodyElement;

  createHeader(BODY);
  createMainLayout(BODY);
  addNavigationHandler(BODY);
}

export default renderBasicLayout;
