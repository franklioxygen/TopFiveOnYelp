const express = require('express');
const app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
var cors = require('cors')
app.use(cors())


const yelp = require('yelp-fusion');
const apiKey = 'GRV9E4K9Na1GbpJkUMHNQRmTIBFXeeDUl85ySWIzvqGdEFh7d-BfRZZhCVsS72jXj5YKBKajI7Yy1KDUDgRR3xQA5mmA_sQdlctop2KYIijduiR_MqMnSxgIURJ8XXYx';
const client = yelp.client(apiKey);

app.get('/', (req, res) => {
    let searchRequest = {
        term: req.query.term,
        location: req.query.location,
        limit: 50
    };
    client.search(searchRequest).then(response => {
        const result = response.jsonBody;
        let resFiltered = result.businesses.filter(function (el) {
            return el.rating >= 4 && el.review_count > 50;
        }).sort((a, b) => (a.review_count < b.review_count)).splice(0, 5);
        res.send(resFiltered);
    }).catch(e => {
        console.log(e);
    });
});


app.get('/reviews', (req, res) => {
    client.reviews(req.query.id).then(response => {
        res.send(response.jsonBody.reviews[0]);
    }).catch(e => {
        console.log(e);
    });
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});