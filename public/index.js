// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-app.js";
import { getDatabase, ref, child, get, set } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAd6IADZfeTRD6o_NYPuVCuauhrBSAuoZE",
    authDomain: "aeromet-usf.firebaseapp.com",
    databaseURL: "https://aeromet-usf-default-rtdb.firebaseio.com",
    projectId: "aeromet-usf",
    storageBucket: "aeromet-usf.appspot.com",
    messagingSenderId: "995947231039",
    appId: "1:995947231039:web:1276916dd2f74a4a00c58a",
    measurementId: "G-CFQN7MGRPS"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);
updateData();
document.getElementById("save").onclick = function() {
    saveSetPoints();
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