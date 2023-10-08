import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { firebaseConfig }  from "./firebase/firebase.js"
import * as validator from "./validators/validator.js"

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const auth = getAuth();
const dbRef = ref(db);
updateData();
const loginForm = {
    email: () => document.getElementById("email"),
    loginButton: () => document.getElementById("login-button"),
    password: () => document.getElementById("password"),
}
document.getElementById("save").onclick = function() {
    saveSetPoints();
}
loginForm.loginButton().onclick = function() {
    login();
}
loginForm.email().onchange = function() {
    validateFields();
}
loginForm.password().onchange = function() {
    validateFields();
}
function login() 
{
    signInWithEmailAndPassword( 
        auth, loginForm.email().value, loginForm.password().value
    ).then(response => 
    {
        console.log('Logado com sucesso!');

    }).catch(error => 
    {
        alert(error.code);
    });
}
function saveSetPoints()
{
    set(ref(db, 'setPoints'), writeSetPoints());
}
function updateData()
{
    getData("data/humidity",'humidity','innerHTML','%');
    getData("data/pressure",'pressure','innerHTML',' hPa');
    getData("data/temperature",'temperature','innerHTML','ºC');
    getData("setPoints/humidityFrom",'humidityFrom','value','');
    getData("setPoints/humidityUpTo",'humidityUpTo','value','');
    getData("setPoints/temperatureFrom",'temperatureFrom','value','');
    getData("setPoints/temperatureUpTo",'temperatureUpTo','value','');
    getData("setPoints/pressureFrom",'pressureFrom','value','');
    getData("setPoints/pressureUpTo",'pressureUpTo','value','');
}
function getData(path,htmlId,htmlProperty,symbol) 
{
    get(child(dbRef, path)).then((snapshot) => 
    {
        if (snapshot.exists()) 
        {
            document.getElementById(htmlId)[htmlProperty] = snapshot.val() + symbol;
        } 
        else 
        {
            console.log("No data available ->", htmlId);
        }
    }).catch((error) => 
    {
        console.error(error);
    });
}
function handleLoginFormChange()
{
    loginForm.loginButton().disabled = validator.validateEmail(loginForm.email().value) && validator.validatePassword(loginForm.password().value) ? false : true;
}
function writeSetPoints()
{
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


function validateFields() {
    const emailValid = isEmailValid();
    document.getElementById('recover-password-button').disabled = !emailValid;

    const passwordValid = isPasswordValid();
    document.getElementById('login-button').disabled = !emailValid || !passwordValid;
  }
  function isEmailValid(){
    const email = document.getElementById("email").value;
    if(!email){
      return false;
    }
    return validateEmail(email);
  }
  function isPasswordValid() {
    const password = document.getElementById('password').value;
    if(!password){
      return false;
    }
    return true;
  }
  function validateEmail(email) {
    return  /\S+@\S+\.\S+/.test(email);
  }
