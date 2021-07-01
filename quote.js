const axios = require("axios");

const url = "https://type.fit/api/quotes";

function getRandomIndex() {
    return Math.floor(Math.random() * (1640 - 0) + 0);
}

async function getQuote() {
    return new Promise(function(resolve, reject) {
        axios
            .get(url)
            .then((response) => {
                return response.data;
            })
            .then(function(response) {
                let index = getRandomIndex();
                resolve({
                    text: response[index].text,
                    author: response[index].author,
                });
            })
            .catch(function(error) {
                resolve("Unknown error occured!");
            });
    });
}

module.exports = { getQuote };