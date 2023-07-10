'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

// classes

class App {
  #map;
  #mapEvent;
  #workouts = [];

  constructor() {
    this._getPostion();

    this._loadLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleFormField);
    containerWorkouts.addEventListener('click', this._selectWorkout.bind(this));
  }

  _getPostion() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function () {
        alert('Could not get your position');
      });
    }
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputCadence.value = inputDistance.value = inputDuration.value = inputElevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleFormField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _loadMap(position) {
    const { latitude, longitude } = position.coords;
    const coords = [latitude, longitude];

    // Refactor this as part of the class properties
    const mainLayer = L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    });

    const darkLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    });

    const sateliteLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution:
          'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      }
    );

    this.#map = L.map('map', {
      center: coords,
      zoom: 13,
      layers: [mainLayer],
    });

    const mapLayers = {
      "<span class='leaflet-layer-item'>Main Layer</span>": mainLayer,
      "<span class='leaflet-layer-item'>Dark Theme Layer</span>": darkLayer,
      "<span class='leaflet-layer-item'>Satellite Layer</span>": sateliteLayer,
    };

    L.control.layers(mapLayers).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(w => {
      this._renderMapMarker(w);
    });
  }

  _newWorkout(e) {
    const { lat, lng } = this.#mapEvent.latlng;
    const coords = [lat, lng];
    let workout;

    e.preventDefault();

    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const validInputs = (...fieldsValue) => fieldsValue.every(value => Number.isFinite(value));

    const positiveInputs = (...fieldsValue) => fieldsValue.every(value => value > 0);

    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (!validInputs(distance, duration, cadence) || !positiveInputs(distance, duration, cadence)) {
        return alert('All values should be positive numbers!');
      }

      workout = new Running(coords, duration, distance, cadence);
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;

      if (!validInputs(distance, duration, elevation) || !positiveInputs(distance, duration)) {
        return alert('All values should be positive numbers!');
      }

      workout = new Cycling(coords, duration, distance, elevation);
    }

    this.#workouts.push(workout);

    this._renderMapMarker(workout);

    this._renderSidebarWorkout(workout);

    this._hideForm();

    this._saveToLocalStorage();
  }

  _renderMapMarker(workout) {
    L.marker(workout.coord)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 300,
          minWidth: 100,
          minHeight: 30,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(`${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`)
      .openPopup();
  }

  _workoutIcon(workout) {
    if (workout.type === 'running') return '🏃‍♂️';

    if (workout.type === 'cycling') return '🚴‍♀️';
  }

  _workoutSpeedUnit(workout) {
    if (workout.type === 'running') return 'min/km';

    if (workout.type === 'cycling') return 'km/h';
  }

  _workoutSpeed(workout) {
    if (workout.type === 'running') this.calcPace();

    if (workout.type === 'cycling') this.calcSpeed();
  }

  _renderSidebarWorkout(workout) {
    const html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        ${
          workout.type === 'running'
            ? `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.pace.toFixed(1)}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value">${workout.cadence.toFixed(1)}</span>
          <span class="workout__unit">spm</span>
        </div>
        `
            : `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation.toFixed(1)}</span>
          <span class="workout__unit">m</span>
        </div>
        `
        }
      </li>
    `;

    form.insertAdjacentHTML('afterend', html);
  }

  _selectWorkout(e) {
    const workoutElem = e.target.closest('.workout');

    if (!workoutElem) return;

    const currWorkout = this.#workouts.find(w => {
      return w.id === workoutElem.dataset.id;
    });

    this.#map.setView(currWorkout.coord, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _saveToLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _loadLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts.push(...data);
    this.#workouts.forEach(w => {
      this._renderSidebarWorkout(w);
    });
  }
}

class Workout {
  date = new Date();
  id = String(Math.floor(Math.random() * 100));

  constructor(coord, duration, distance) {
    this.coord = coord;
    this.duration = duration;
    this.distance = distance;
  }

  _createDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coord, duration, distance, cadence) {
    super(coord, duration, distance);
    this.cadence = cadence;
    this.calcPace();
    this._createDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coord, duration, distance, elevation) {
    super(coord, duration, distance);
    this.elevation = elevation;
    this.calcSpeed();
    this._createDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed;
  }
}

const app = new App();
