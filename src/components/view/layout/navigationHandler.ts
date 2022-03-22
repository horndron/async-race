import { HIDE_CLASS } from '../constants/constants';

function setClassName(show: HTMLElement, hide: HTMLElement): void {
  show.classList.remove(HIDE_CLASS);
  hide.classList.add(HIDE_CLASS);
}

export function addNavigationHandler(container: HTMLElement): void {
  const navigation = container.querySelector('.navbar ') as HTMLElement;
  navigation.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON') {
      const garage = container.querySelector('.garage-view') as HTMLElement;
      const winners = container.querySelector('.winners-view') as HTMLElement;

      target.dataset.page === 'garage' 
      ? setClassName(garage, winners)
      : setClassName(winners, garage);
    }
  })
}

export default addNavigationHandler;
