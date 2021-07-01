var OAuth = require("oauth");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

var oauth = new OAuth.OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    process.env.twitter_application_consumer_key,
    process.env.twitter_application_secret,
    "1.0A",
    null,
    "HMAC-SHA1"
);
const fetch = require("node-fetch");
const url = "https://type.fit/api/quotes";
const numberMatch = {
    0: "0️⃣",
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
};

var express = require("express");
var port = process.env.PORT || 4014;
var app = express();
app.get("/", function(req, res) {
    res.send(JSON.stringify({ Hello: "World!!!!" }));
});
app.listen(port, function() {});

async function updateDayCountInProfile() {
    oauth.post(
        "https://api.twitter.com/1.1/account/update_profile.json",
        process.env.twitter_user_access_token,
        process.env.twitter_user_secret,
        postBody,
        "", // post content type ?
        function(err, data, res) {
            if (err) {} else {
                currDay = JSON.parse(data).name;

                updatedDay = getdayCount(currDay);

                myname = "StopNot!-" + updatedDay;

                oauth.post(
                    "https://api.twitter.com/1.1/account/update_profile.json",
                    process.env.twitter_user_access_token,
                    process.env.twitter_user_secret, { name: myname },
                    "", // post content type ?
                    function(err, data, res) {
                        if (err) {} else {}
                    }
                );
            }
        }
    );
}

function getRandomIndex() {
    return Math.floor(Math.random() * (1640 - 0) + 0);
}

function getdayCount(day) {
    curr = day.split("-")[1];

    var result = "";
    curr.split("").forEach(function(letter) {
        if ("0123456789".includes(letter)) result = result + "" + letter;
    });
    dayCount = parseInt(result) + 1 + "";
    emojiDay = "";

    dayCount.split("").forEach(function(letter) {
        emojiDay += numberMatch[letter];
    });

    return emojiDay;
}

var postBody = {
    status: "",
};

setInterval(function() {
    var date = new Date();
    console.log(
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    );

    if (
        date.getHours() === 10 &&
        date.getMinutes() === 55 &&
        date.getSeconds() == 0
    ) {
        let settings = { method: "Get" };

        fetch(url, settings)
            .then((res) => res.json())
            .then((json) => {
                let index = getRandomIndex();
                console.log(index);
                console.log(json);
                let status = json[index].text;
                let author = json[index].author;
                postBody.status = `${status}\n-${author} #100DaysOfCode #DevCommunity`;
                oauth.post(
                    "https://api.twitter.com/1.1/statuses/update.json",
                    process.env.twitter_user_access_token,
                    process.env.twitter_user_secret,
                    postBody,
                    "", // post content type ?
                    function(err, data, res) {
                        if (err) {} else {
                            updateDayCountInProfile();
                        }
                    }
                );
            });
    }
    if (
        date.getHours() === 22 &&
        date.getMinutes() === 55 &&
        date.getSeconds() == 0
    ) {
        let settings = { method: "Get" };

        fetch(url, settings)
            .then((res) => res.json())
            .then((json) => {
                let index = getRandomIndex();
                let status = json[index].text;
                let author = json[index].author;
                postBody.status = `${status}\n-${author} #100DaysOfCode #DevCommunity`;
                oauth.post(
                    "https://api.twitter.com/1.1/statuses/update.json",
                    process.env.twitter_user_access_token,
                    process.env.twitter_user_secret,
                    postBody,
                    "", // post content type
                    function(err, data, res) {
                        if (err) {} else {}
                    }
                );
            });
    }
}, 1000);