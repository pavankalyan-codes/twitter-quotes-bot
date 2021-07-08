var OAuth = require("oauth");
const quote = require("./quote");

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
app.get("/", function (req, res) {
    res.send(JSON.stringify({ Hello: "World!!!!" }));
});
app.listen(port, function () { });

async function updateDayCountInProfile() {
    oauth.post(
        "https://api.twitter.com/1.1/account/update_profile.json",
        process.env.twitter_user_access_token,
        process.env.twitter_user_secret,
        postBody,
        "", // post content type ?
        function (err, data, res) {
            if (err) { console.log(err); } else {
                console.log(data);
                currDay = JSON.parse(data).name;

                updatedDay = getdayCount(currDay);

                myname = "StopNot!-" + updatedDay;

                oauth.post(
                    "https://api.twitter.com/1.1/account/update_profile.json",
                    process.env.twitter_user_access_token,
                    process.env.twitter_user_secret, { name: myname },
                    "", // post content type ?
                    function (err, data, res) {
                        if (err) { console.log("in innner" + err) } else { console.log("sucess!!"); }
                    }
                );
            }
        }
    );
}

function getdayCount(day) {
    let dayCount = "1";
    let previousDayCount = day.split("-")[1];
    if (previousDayCount) {
        let result = "";
        previousDayCount.split("").forEach(function (letter) {
            if ("0123456789".includes(letter)) result = result + "" + letter;
        });
        dayCount = parseInt(result) + 1 + "";
    }

    let emojiDay = "";

    dayCount.split("").forEach(function (letter) {
        emojiDay += numberMatch[letter];
    });

    return emojiDay;
}

var postBody = {
    status: "",
};

setInterval(async function () {
    var date = new Date();
    console.log(
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    );

    if (
        date.getHours() === 11 &&
        date.getMinutes() === 59 &&
        date.getSeconds() == 10
    ) {
        console.log("Posting");
        let qt = await quote.getQuote();
        let status = qt.text;
        let author = qt.author;
        console.log(status);
        console.log(author);
        postBody.status = `${status}\n-${author} #100DaysOfCode #DevCommunity`;
        oauth.post(
            "https://api.twitter.com/1.1/statuses/update.json",
            process.env.twitter_user_access_token,
            process.env.twitter_user_secret,
            postBody,
            "", // post content type ?
            function (err, data, res) {
                if (err) { console.log(err); } else {
                    console.log("updating profile");
                    updateDayCountInProfile();
                }
            }
        );
    }
    if (
        date.getHours() === 23 &&
        date.getMinutes() === 11 &&
        date.getSeconds() === 0
    ) {
        let qt = await quote.getQuote();
        let status = qt.text;
        let author = qt.author;

        postBody.status = `${status}\n-${author} #100DaysOfCode #DevCommunity`;
        oauth.post(
            "https://api.twitter.com/1.1/statuses/update.json",
            process.env.twitter_user_access_token,
            process.env.twitter_user_secret,
            postBody,
            "", // post content type
            function (err, data, res) {
                if (err) { } else { }
            }
        );
    }
}, 1000);