import {
  CAR_PER_PAGE,
  BRAND_CAR,
  MODEL_CAR,
  COLOR_CHARS_COUNT,
} from '../constants/constants';

export type Callback = () => void;

export function toRandomNumber(num: number): number {
  return Math.floor(Math.random() * num);
}

export function setDisableValue(
  element: HTMLInputElement | HTMLButtonElement,
  value: boolean,
): void {
  element.disabled = value;
}

export function createDivBlock(classList: string, title: string): HTMLElement {
  const section = document.createElement('div')  as HTMLElement;
  section.className = `${classList}`;
  section.innerHTML = `
  <h2 class="h2 mb-3">${title} (<span data-id="total-count"></span>)</h2>
  <h3 class="h2 mb-3">Page <span data-id="page"></span></h3>
  <div class="content mb-4"></div>
  <div class="pagination d-flex justify-content-start mb-2">
    <button class="btn btn-success btn-sm me-2 px-3" 
    data-id="prev-page" disabled>Prev</button>
    <button class="btn btn-success btn-sm px-3" data-id="next-page">Next</button>
  </div>
  `;
  
  return section;
}

export function isPrevPaginationValue(
  prev: HTMLButtonElement,
  next: HTMLButtonElement,
  page: number,
): number {
  const result = page - 1;

  if(result === 1) setDisableValue(prev, true);
  setDisableValue(next, false);

  return result >= 1 ? result : page;
}

export function isNextPaginationValue(
  prev: HTMLButtonElement,
  next: HTMLButtonElement,
  page: number,
  count: number,
): number {
  const result = page + 1;
  if(result === Math.ceil(count / CAR_PER_PAGE)) setDisableValue(next, true);
  setDisableValue(prev, false);

  return result <= Math.ceil(count / CAR_PER_PAGE) ? result : page;
}

export function toRandomName(): string {
  return `
  ${BRAND_CAR[toRandomNumber(BRAND_CAR.length)]} 
  ${MODEL_CAR[toRandomNumber(MODEL_CAR.length)]}
  `;
}

export function toRandomColor(): string {
  const COLOR_LETTERS = '0123456789ABCDEF';
  let color = '';

  for (let i = 0; i < COLOR_CHARS_COUNT; i += 1) {
    color += COLOR_LETTERS[toRandomNumber(COLOR_LETTERS.length)];
  }

  return color;
}

export function draw(car: HTMLElement, progress: number, length: number): void {
  car.style.transform = `translateX(${progress * (length - 80)}px)`;
}

export function toWinner(name: string, time: number): void {
  const winner = document.createElement('div');
  winner.classList.add('winner-modal', 'bg-success');
  winner.innerHTML = `${name} went first <span>${time}</span>!`;

  document.body.append(winner);
  setInterval(() => winner.remove(), 3000);
}

export default toRandomNumber;
