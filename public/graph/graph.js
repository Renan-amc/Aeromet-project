import { arrayValuesTemperature, arrayValuesHumidity, arrayValuesPressure } from '../index.js';

export function showGraph() { // função cria gráfico pela biblioteca chart.js
    const ctx = document.getElementById('myChart');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            datasets: [{
                label: 'Temperatura (ºC)',
                data: arrayValuesTemperature,
                borderWidth: 4,
            }, {
                label: 'Umidade (%)',
                data: arrayValuesHumidity,
                borderWidth: 4
            }, {
                label: 'Pressão (hPa)',
                data: arrayValuesPressure,
                borderWidth: 4
            }]
        }
    });
}
export function addValueArrayTemperature(value) {
    if (arrayValuesTemperature.length >= 10) {
        arrayValuesTemperature.shift();
    }
    arrayValuesTemperature.push(value);
}

export function addValueArrayHumidity(value) {
    if (arrayValuesHumidity.length >= 10) {
        arrayValuesHumidity.shift();
    }
    arrayValuesHumidity.push(value);
}

export function addValueArrayPressure(value) {
    if (arrayValuesPressure.length >= 10) {
        arrayValuesPressure.shift();
    }
    arrayValuesPressure.push(value);
}

export function teste(){
    alert('funfo');
}