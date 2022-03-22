import { AsyncRaceAPi } from '../../controller/api';
import { QueryParam } from '../../interfaces/interfaces';
import { createWinnerCars } from '../car/car';
import { isPrevPaginationValue, isNextPaginationValue } from '../utils/utils';
import {
  WINNERS_LIMIT,
  SORT_WINS,
  SORT_TIME,
  ORDER_ASC,
  ORDER_DESC,
} from '../constants/constants';

export class Winners {
  container: HTMLElement;
  api: AsyncRaceAPi;
  pageNumber: number;
  sort: string;
  order: string;

  constructor(container: HTMLElement, api: AsyncRaceAPi) {
    this.container = container;
    this.api = api;
    this.pageNumber = 1;
    this.sort = 'wins';
    this.order = 'DESC';

  }

  createWinnersTable(): void {
    const winnersContainer = this.container
      .querySelector('.content') as HTMLElement;
    const winnersTable = document.createElement('div');
    winnersTable.className = 'table-responsive';
    winnersTable.innerHTML = `
    <table class="table table-dark table-bordered">
      <thead>
        <tr>
          <th class="bg-success" scope="col">№</th>
          <th class="bg-success" scope="col">Car</th>
          <th class="bg-success" scope="col">Name</th>
          <th class="bg-success sort" data-sort="wins" scope="col">Wins</th>
          <th 
            class="bg-success sort" 
            data-sort="time" 
            scope="col"
          >Best time<br>(seconds)</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    `;
    winnersContainer.append(winnersTable);
  }

  async renderWinners(): Promise<void> {
    const QUERY_PARAMS: QueryParam[] = [
      { name: '_page', value: this.pageNumber },
      { name: '_limit', value: WINNERS_LIMIT },
      { name: '_sort', value: this.sort },
      { name: '_order', value: this.order },
    ];
    const winners = await this.api.getWinners(QUERY_PARAMS);
    const winnersCount = this.container
      .querySelector('span[data-id="total-count"]') as HTMLElement;
    winnersCount.textContent = `${winners?.count}`;
    const winnersPage = this.container
      .querySelector('span[data-id="page"]') as HTMLElement;
    winnersPage.textContent = `#${this.pageNumber}`;
    const winnersTableTbody = this.container
      .querySelector('tbody') as HTMLElement;
    winnersTableTbody.innerHTML = '';

    winners?.items.forEach( async (winner, index) => {
      const car = await this.api.getCar(winner.id);
      winnersTableTbody.append(
        createWinnerCars(car, winner, Number(index + 1)),
      );
    });
  }

  addUpdateWinnersHandler(): void {
    const winnersBtn = document
    .querySelector('[data-page="winners"]') as HTMLButtonElement;

    winnersBtn.addEventListener('click', () => {
      this.renderWinners();
    });
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
      this.renderWinners();
    })
  }

  addSortWinnerHandler() {
    const sortElementsContaner = this.container
      .querySelector('thead') as HTMLElement;

    sortElementsContaner.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if(target.dataset.sort === SORT_WINS) {
        this.sort = SORT_WINS;
        this.order = this.order === ORDER_ASC ? ORDER_DESC : ORDER_ASC;

        this.renderWinners();
      } else if (target.dataset.sort === SORT_TIME) {
        this.sort = SORT_TIME;
        this.order = this.order === ORDER_ASC ? ORDER_DESC : ORDER_ASC;

        this.renderWinners();
      }
    })
  }
}

export default Winners;
