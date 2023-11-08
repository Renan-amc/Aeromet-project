import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { firebaseConfig } from "./firebase/firebase.js";
import * as validator from "./validators/validator.js";
import * as errors from "./errors/errors.js";
import * as preloader from "./preloaders/preloader.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const dbRef = ref(db);
const loginForm = {
    email: () => document.getElementById("email"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
    passwordResetButton: () => document.getElementById("recover-password-button"),
}
/* GRAFICO INICIO*/
const arrayValuesTemperature = [];
const arrayValuesHumidity = [];
const arrayValuesPressure = [];
const ctxTemperature = document.getElementById('myChartTemperature');
const ctxHumidity = document.getElementById('myChartHumidity');
const ctxPressure = document.getElementById('myChartPressure');

function addValueArrayTemperature(value) { // Função Armazena dados Temperatura
    if (arrayValuesTemperature.length >= 10) { 
        arrayValuesTemperature.shift();
    }
    arrayValuesTemperature.push(value);
}

new Chart(ctxTemperature, { //GRAFICO TEMPERATURA
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: 'Temperatura',
            data: (arrayValuesTemperature),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function addValueArrayHumidity(value) { // Função Armazena dados Umidade
    if (arrayValuesHumidity.length >= 10) {
        arrayValuesHumidity.shift();
    }
    arrayValuesHumidity.push(value);
}

new Chart(ctxHumidity, { //GRAFICO UMIDADE
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: 'Umidade',
            data: (arrayValuesHumidity),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

function addValueArrayPressure(value) { // Função Armazena dados PRESSAO
    if (arrayValuesPressure.length >= 10) { 
        arrayValuesPressure.shift();
    }
    arrayValuesPressure.push(value);
}

new Chart(ctxPressure, { //GRAFICO PRESSAO
    type: 'line',
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
            label: 'Pressão',
            data: (arrayValuesPressure),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
/* GRAFICO FIM */
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateData();
        updateFormData();
        toggleButtons("logoutButton", "block");
        toggleButtons("loginButton", "none");
        document.getElementById("Login").style.display = "none";
        document.getElementById("Inicio").style.display = "none";
        document.getElementById("CoordenadorVoo").style.display = "block";
        refreshData();
    }
});
document.getElementById("save").onclick = function () {
    saveSetPoints();
    loading();
}
document.getElementById("logout-button").onclick = function () {
    handleLogout();
}
document.getElementById("logout-button-list").onclick = function () {
    handleLogout();
}
document.getElementById("logout-button-list").onclick = function () {
    handleLogout();
}
loginForm.passwordResetButton().onclick = function () {
    handlePasswordReset();
}
loginForm.loginButton().onclick = function () {
    handleLogin();
    loading();
}
loginForm.email().onchange = function () {
    handleLoginFormChange();
}
loginForm.password().onchange = function () {
    handleLoginFormChange();
}
function handleLogin() {
    signInWithEmailAndPassword(
        auth, loginForm.email().value, loginForm.password().value
    ).then(() => {
        preloader.hideloading();
        toggleButtons("logoutButton", "block");
        toggleButtons("loginButton", "none");
        document.getElementById("Login").style.display = "none";
        document.getElementById("CoordenadorVoo").style.display = "block";
        document.documentElement.scrollTop = 0;
        updateData();
        updateFormData();
    }).catch(error => {
        alert(errors.mapErrorMessage(error.code));
    });
}
function handleLogout() {
    signOut(auth)
        .then(() => {
            window.location.href = "";
        })
        .catch((error) => {
            console.log(error);
            alert("Erro ao fazer logout!");
        });
}
function handlePasswordReset() {
    if (isEmailValid()) {
        sendPasswordResetEmail(
            auth, loginForm.email().value
        ).then(() => {
            alert('Email para alteração de senha enviado com sucesso!');
        }).catch(error => {
            alert(errors.mapErrorMessage(error.code));
        })
    }
    else alert(errors.mapErrorMessage('validation/email'));
}
async function saveSetPoints() {
    await set(ref(db, 'setPoints'), writeSetPoints());
    preloader.hideloading();
}
function refreshData() {
    if (!window.intervalID) {
        window.intervalID = setInterval(updateData, 10000);
    }
}
function updateData() {
    getData("data/humidity", 'humidity', 'value');
    getData("data/pressure", 'pressure', 'value');
    getData("data/temperature", 'temperature', 'value');
    addValueArrayHumidity(document.getElementById('humidity').value);
    addValueArrayPressure(document.getElementById('pressure').value);
    addValueArrayTemperature(document.getElementById('temperature').value);
}
function updateFormData() {
    getData("setPoints/humidityFrom", 'humidityFrom', 'value');
    getData("setPoints/humidityUpTo", 'humidityUpTo', 'value');
    getData("setPoints/temperatureFrom", 'temperatureFrom', 'value');
    getData("setPoints/temperatureUpTo", 'temperatureUpTo', 'value');
    getData("setPoints/pressureFrom", 'pressureFrom', 'value');
    getData("setPoints/pressureUpTo", 'pressureUpTo', 'value');
}
function getData(path, htmlId, htmlProperty) {
    get(child(dbRef, path)).then((snapshot) => {
        if (snapshot.exists()) {
            document.getElementById(htmlId)[htmlProperty] = snapshot.val();
        }
        else {
            console.log("No data available ->", htmlId);
        }
    }).catch((error) => {
        console.error(error);
    });
}
function handleLoginFormChange() {
    loginForm.loginButton().disabled = isEmailValid() && isPasswordValid() ? false : true;
}
function writeSetPoints() {
    let setPoints =
    {
        humidityFrom: parseFloat(document.getElementById('humidityFrom')['value']),
        humidityUpTo: parseFloat(document.getElementById('humidityUpTo')['value']),
        pressureFrom: parseFloat(document.getElementById('pressureFrom')['value']),
        pressureUpTo: parseFloat(document.getElementById('pressureUpTo')['value']),
        temperatureFrom: parseFloat(document.getElementById('temperatureFrom')['value']),
        temperatureUpTo: parseFloat(document.getElementById('temperatureUpTo')['value'])
    };
    return setPoints;
}
function isEmailValid() {
    return validator.validateEmail(loginForm.email().value);
}
function isPasswordValid() {
    return validator.validatePassword(loginForm.password().value);
}
function toggleButtons(className, display) {
    var i, elements;
    elements = document.getElementsByClassName(className);
    for (i = 0; i < elements.length; i++) {
        elements[i].style.display = display;
    }
}
function loading() {
    preloader.showLoading();
}
