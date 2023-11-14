const arrayValuesTemperature = [];
const arrayValuesHumidity = [];
const arrayValuesPressure = [];
const DISPLAY = true;
const BORDER = true;
const CHART_AREA = true;
const TICKS = true;

var chart = null; 
export function showGraph() { // função cria gráfico pela biblioteca chart.js
    const ctx = document.getElementById('myChart');
    if(chart != null) chart.destroy();
    chart = new Chart(ctx, {
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
                label: 'Pressão (kPa)',
                data: arrayValuesPressure,
                borderWidth: 4
            }]
        },
        options: {
            scales: {
                x: {
                    border: {
                        display: BORDER
                    }
                },
                y: {
                    border: {
                        display: false
                    },
                    grid: {
                        display: DISPLAY,
                        color: '#7F7F7F'
                    }
                }
            }
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