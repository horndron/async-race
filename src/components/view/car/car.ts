import { Car, Winner } from '../../interfaces/interfaces';
import { toRandomName, toRandomColor } from '../utils/utils';

function setColorCarImage(color: string): string {
  const carImage = `
  <svg class="car-image" version="1.1" xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" 
    viewBox="0 200 1000 500" enable-background="new 0 200 1000 500" 
    xml:space="preserve" fill="${color}"><g>
    <g transform="translate(0.000000,511.000000) scale(0.100000,-0.100000)">
      <path d="M3822.8,
      1909.3c-621.2-27.7-1133.6-83.1-1392.8-150.4c-346.2-89-1778.6-785.4-1978.4-961.5c-104.9-93-229.5-462.9-318.5-945.7c-37.6-207.7-45.5-852.7-11.9-959.5c19.8-63.3,
      25.7-65.3,314.6-95l100.9-11.9L548.6-987c25.7,464.9,223.6,787.4,597.5,
      967.4c308.6,146.4,601.4,146.4,912-2c364-172.1,561.9-488.7,
      591.5-941.7l13.9-213.7H4905h2239.5l11.9,263.1c13.8,379.9,85.1,557.9,
      304.7,767.6c203.8,195.8,413.5,275,720.1,275c435.2,0,809.2-221.6,
      985.2-581.6c67.3-140.5,93-265.1,110.8-530.2L9291-1177h120.7c126.6,2,
      389.7,29.7,455,51.5c37.6,11.9,37.6,29.7,27.7,342.3c-21.8,650.9-138.5,
      931.8-459,1103.9c-184,96.9-654.8,257.2-1177.1,
      399.6c-413.5,112.8-472.8,134.5-1078.2,417.4c-1181.1,550-1600.5,
      710.2-1978.4,749.8C4932.7,1917.2,4238.3,1927.1,3822.8,
      1909.3z M4396.5,1108.1c-5.9-255.2-15.8-470.8-21.8-478.8C4355,609.5,
      2481.5,728.2,2481.5,748c0,29.7,114.7,225.5,223.5,385.8c120.7,176.1,
      261.1,304.7,362.1,336.3c191.9,55.4,603.4,95,1054.5,100.9l284.9,
      2L4396.5,1108.1z M5360,1523.5c470.8-98.9,904.1-261.1,
      1446.2-542.1c304.7-158.3,561.9-322.5,599.5-381.8c21.7-33.6,
      19.8-45.5-5.9-71.2c-27.7-27.7-140.5-27.7-1183.1,11.9c-635,
      25.7-1236.5,49.5-1335.4,57.4l-184,11.9v484.7v484.7l253.2-11.9C5089,
      1561.1,5272.9,1541.3,5360,1523.5z"/><path 
      d="M1353.8-237.2c-215.6-67.2-413.5-273-484.7-494.6c-49.5-158.3-33.6-377.9,
      33.6-528.2c217.6-470.8,846.7-587.6,1210.8-221.6c364,364,263.1,
      971.4-201.8,1198.9c-112.8,55.4-154.3,65.3-300.7,69.2C1506.1-209.5,
      1409.2-219.4,1353.8-237.2z M1705.9-710.1c178.1-93,203.8-312.6,
      53.4-445.1c-57.4-49.5-87-61.3-164.2-61.3c-215.6,0-346.2,205.8-245.3,
      391.7C1417.1-698.2,1579.3-644.8,1705.9-710.1z"/>
      <path d="M7971.5-241.2c-324.5-116.7-524.3-421.4-500.5-763.6c43.5-635,
      823-925.9,1272.1-474.8c362,360.1,263.1,963.5-195.9,1196.9c-102.9,
      53.4-146.4,63.3-298.7,69.2C8113.9-207.6,8046.6-215.5,
      7971.5-241.2z M8333.5-710.1c178.1-93,203.8-312.6,
      53.4-445.1c-182-158.3-470.8-2-439.2,237.4C7971.5-735.8,
      8173.3-627,8333.5-710.1z"/></g></g></svg>
  `;
  return carImage;
}

export function createCar(car: Car): HTMLElement {
  const newCar = document.createElement('div')  as HTMLElement;
  newCar.classList.add('car-item', 'mb-3');
  newCar.dataset.car = `${car.id as number}`;
  newCar.innerHTML = `
  <div class="controll d-flex flex-wrap justify-content-start align-items-center mb-2">
    <button class="btn btn-secondary btn-sm me-1" 
    data-id="select-car" 
    data-color="${car.color}" 
    data-car="${car.id}"
    >Select</button>
    <button class="btn btn-secondary btn-sm me-3" 
    data-id="remove-car" data-car="${car.id}">Remove</button>
    <p class="name">${car.name}</p>
  </div>
  <div class="wrapper-track d-flex flex-wrap justify-content-start align-items-start">
    <div class="engine d-flex flex-wrap justify-content-start">
      <button class="btn btn-success btn-sm me-1" 
      data-id="start-engine" data-car="${car.id}">A</button>
      <button class="btn btn-danger btn-sm me-3" 
      data-id="stop-engine" data-car="${car.id}" disabled>B</button>
    </div>
    <div class="race-track">
      ${setColorCarImage(car.color as string)}
    </div>
  </div>
  `;
  return newCar;
}

export function createRandomCar(): Car {
  return {
    name: `${toRandomName()}`,
    color: `#${toRandomColor()}`,
  }
}

export function createWinnerCars(
  car: Car,
  winner: Winner,
  number: number,
): HTMLElement {
  const winnerCar = document.createElement('tr');
  winnerCar.innerHTML = `
  <tr>
    <th scope="row">${number}</th>
    <td>
      ${setColorCarImage(car.color as string)}
    </td>
    <td>${car.name}</td>
    <td>${winner.wins}</td>
    <td>${winner.time}</td>
  </tr>
  `;

  return winnerCar;
}

export default createCar;
