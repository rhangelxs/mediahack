// ==UserScript==
// @name         MediaHack
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  try to take over the world!
// @author       Alexey Klimov
// @include      *//rutube.ru/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js
// @require      https://www.gstatic.com/firebasejs/4.12.1/firebase.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.6.1/fingerprint2.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/Faker/3.1.0/faker.min.js
// @run-at       document-idle

// ==/UserScript==

var $ = window.jQuery;
var jQuery = window.jQuery;

(function() {
    $(document).ready(function() {

    var config = {
        apiKey: "AIzaSyArBlRUF0OJxzQ_xzXByeiNN7cWvLFfZ24",
        authDomain: "fingerprint-ad3e8.firebaseapp.com",
        databaseURL: "https://fingerprint-ad3e8.firebaseio.com",
        projectId: "fingerprint-ad3e8",
        storageBucket: "",
        messagingSenderId: "314487210984"
    };
    firebase.initializeApp(config);

    // Get a reference to the database service
    var database = firebase.database();

    function writeUserData(name, email, hash) {
        firebase.database().ref('users/' + hash).set({
            //userId: "",
            username: name,
            email: email,
            old_cookie: "Place your old_cookie here (puid, etc.)"
        });
    }

    function getAlertSetting() {
        return firebase.database()
            .ref('alert')
            .once("value", (snap) => {
            return snap.val();
        });
    }
    getAlertSetting().then(alert_setting => {

        new Fingerprint2().get(function(result, components) {
            //console.log(result) // a hash, representing your device fingerprint
            //console.log(components) // an array of FP components
            firebase.database().ref('users/' + result).once('value', function(snapshot) {
                username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                email = (snapshot.val() && snapshot.val().email) || 'Anonymous';

                if (username === 'Anonymous') {
                    var fake_name = faker.name.findName();
                    var fake_email = faker.internet.email();
                    writeUserData(name = fake_name, email = fake_email, result);
                    message = "Hello you first time here, " + name + ". " + "Next time you will be busted.";
                } else {
                    message = "I watching you, " + username + ".";
                }
                console.log(message);
                if (alert_setting.val() == true) {
                    alert(message);
                }

            });
        });

        // Your code here...
    });
  });
})();