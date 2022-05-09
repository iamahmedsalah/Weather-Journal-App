// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + 1 +  '.' + d.getDate() + '.' + d.getFullYear();

// initialization API
let baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = 'b7d2a839ab422a8613c5c61b09fe20d4&units=metric';


document.getElementById('generate').addEventListener('click', performAction);


function performAction(e) {
    //get the input
    const zipCode = document.getElementById('zip').value;
    const content = document.getElementById('feelings').value;
    const getInfo = document.getElementById('info');
    if (zipCode !== '') {
        document.getElementById('generate').classList.remove('invalid');
        generateDataWeather(baseUrl, zipCode, apiKey)
            .then(function(data) {
                // Add data 
                postData('/add', { temp: data.main.temp, date: newDate, content: content });
            }).then(function() {
                updateUI()
            }).catch(function(error) {
                console.log(error);
                alert('The entry zip code is invalid. Try again');
            });
            getInfo.reset();
    } else {document.getElementById('generate').classList.add('invalid');}
}

// function to get data form API
const generateDataWeather = async(baseUrl, zipCode, apiKey) => {
    const res = await fetch(`${baseUrl}?q=${zipCode}&appid=${apiKey}`);
    try {
        const data = await res.json();
        return data;
    } catch (error) {
        console.log('error', error);
    }
};

// function for post data 
const postData = async(url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',},
            body: JSON.stringify({
            temp: data.temp,
            date: data.date,
            content: data.content})
    });
    try {
        const newData = await response.json();
        return newData;
        } catch (error) {
        console.log(error);}
};

// Function for updates UI
const updateUI = async() => {
    const request = await fetch('/all');
    try {
        const allData = await request.json();
        console.log(allData);
        // update values
        {
        document.getElementById('date').innerHTML = allData.date;
        document.getElementById('temp').innerHTML = allData.temp + ' degree C';
        document.getElementById('content').innerHTML = allData.content;
        }
    } catch (error) {
        console.log('error', error);}
};