const express = require('express');
const request = require('request');
const hbs = require('hbs');

const port = process.env.PORT || 8080;

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/views'));

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

app.get('/', (request, response) => {
    response.render('main.hbs', {
        title: 'Main page',
        header: 'Main Page'
    });
});

app.get('/static', (request, response) => {
    response.render('static.hbs', {
        title: 'Static page',
        header: 'Static Page'
    });
});

var getCapital = (country) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://restcountries.eu/rest/v2/name/${encodeURIComponent(country)}?fullText=true`,
            json: true
        }, (error, response, body) => {
            if (error) {
                reject('Cannot connect to Rest Countries');
            } else if (body.status == 404) {
                reject('Cannot find requested country');
            } else if ((body[0].name).toUpperCase() == (country).toUpperCase()) {
                resolve(body[0].capital);
            }
        });
    });
};

var getTemp = (capital) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://deckofcardsapi.com/api/deck/new/draw/?count=${capital}&units=imperial&appid=41801cbcfc459a16d83d3e646db2ed3b`,
            json: true
        }, (error, response, body) => {
            resolve(body.main.temp);
        });
    })
};

var getWind = (capital) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://deckofcardsapi.com/api/deck/new/draw/?count=${capital}&units=imperial&appid=41801cbcfc459a16d83d3e646db2ed3b`,
            json: true
        }, (error, response, body) => {
            resolve(body.wind.speed);
        });
    })
};




country = "asdasdasd";

getCapital(country).then((result) => {
    capital = result
    return getTemp(result);
}).then((result) => {
    temp = result
    return getWind(capital);
}).then((result) => {
    wind = result
    weather = (`The weather in ${capital}, capital of ${country} is ${temp} degrees Fahrenheit with wind speed of ${wind}`);
}).catch((error) => {
    console.log('Error:', error);
    weather = "Error: Cannot find requested country";
});

count = 5
var getCards = (count) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://deckofcardsapi.com/api/deck/new/draw/?count=${count}`,
            json: true
        }, (error, response, body) => {
            resolve(body);
        });
    })
};

query = 'galaxy'
var getNasa = (count) => {
    return new Promise((resolve, reject) => {
        request({
            url: `https://images-api.nasa.gov/search?q=${query}`,
            json: true
        }, (error, response, body) => {
            resolve(body);
        });
    })
};

// app.get('/weather', (request, response) => {
//     response.send(weather);
// });

app.get('/cards', (request, response) => {

    getCards(count).then((result) => {
            cards = result })

    card1 = cards.cards[0].image
    card2 = cards.cards[1].image
    card3 = cards.cards[2].image
    card4 = cards.cards[3].image
    card5 = cards.cards[4].image
    

    response.render('cards.hbs', {
        title: 'Cards page',
        header: 'Cards',
        card1: card1,
        card2: card2,
        card3: card3,
        card4: card4,
        card5: card5,
    });

});

app.get('/nasa', (request, response) => {

    getNasa(count).then((result) => {
        images = result
    })

    image1 = images.collection.items[1].links[0].href
    image2 = images.collection.items[2].links[0].href
    image3 = images.collection.items[3].links[0].href
    image4 = images.collection.items[4].links[0].href
    image5 = images.collection.items[5].links[0].href


    response.render('nasa.hbs', {
        title: 'NASA page',
        header: 'NASA Images',
        image1: image1,
        image2: image2,
        image3: image3,
        image4: image4,
        image5: image5
    });

});


app.get('/weather', (request, response) => {
    response.render('weather.hbs', {
        title: 'Weather page',
        header: 'Weather',
        weather: weather
    });
});


app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});