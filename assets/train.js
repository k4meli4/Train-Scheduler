$(document).ready(function(){
    //FIREBASE=========================================================
    var config = {
        apiKey: "AIzaSyAnfXbjRx6zeLMUVHeRvNGUqs3RwvUFyXY",
        authDomain: "train-scheduler-1fb84.firebaseapp.com",
        databaseURL: "https://train-scheduler-1fb84.firebaseio.com",
        projectId: "train-scheduler-1fb84",
        storageBucket: "",
        messagingSenderId: "10775513762"
      };
      firebase.initializeApp(config);
    //VARIABLES=========================================================
    var database = firebase.database();
    //CONVERT TRAIN TIME================================================
    //var currentTime = moment();
    //console.log("Current Time: " + currentTime);
   // Connect below to show current time
    var datetime = null,
        date = null;

var update = function () {
    date = moment(new Date())
    datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
    datetime = $('#datetime')
    update();
    setInterval(update, 1000);
});

    //FUNCTIONS=========================================================
    
    // CAPTURE BUTTON CLICK
    $("#submit").on("click", function() {
    
    //VALUES FOR EACH VARIABLE IN HTML
        var name = $('#nameInput').val().trim();
        var dest = $('#destInput').val().trim();
        var time = $('#timeInput').val().trim();
        var freq = $('#freqInput').val().trim();
    
    // PUSH NEW ENTRY TO FIREBASE
        database.ref().push({
            name: name,
            dest: dest,
            time: time,
            freq: freq,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
        });
        // NO REFRESH
        $("input").val('');
        return false;
    });
    
    //ON CLICK CHILD FUNCTION
    database.ref().on("child_added", function(childSnapshot){
        // console.log(childSnapshot.val());
        var name = childSnapshot.val().name;
        var dest = childSnapshot.val().dest;
        var time = childSnapshot.val().time;
        var freq = childSnapshot.val().freq;
    
        console.log("Name: " + name);
        console.log("Destination: " + dest);
        console.log("Time: " + time);
        console.log("Frequency: " + freq);
        //console.log(moment().format("HH:mm"));
    
    //CONVERT TRAIN TIME================================================
        var freq = parseInt(freq);
        //CURRENT TIME
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment().format('HH:mm'));
        //FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
        // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
        var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
        console.log("DATE CONVERTED: " + dConverted);
        var trainTime = moment(dConverted).format('HH:mm');
        console.log("TRAIN TIME : " + trainTime);
        
        //DIFFERENCE B/T THE TIMES 
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        console.log("DIFFERENCE IN TIME: " + tDifference);
        //REMAINDER 
        var tRemainder = tDifference % freq;
        console.log("TIME REMAINING: " + tRemainder);
        //MINUTES UNTIL NEXT TRAIN
        var minsAway = freq - tRemainder;
        console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
        //NEXT TRAIN
        var nextTrain = moment().add(minsAway, 'minutes');
        console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
        //console.log(==============================);
    
     //TABLE DATA=====================================================
     //APPEND TO DISPLAY IN TRAIN TABLE
    $('#currentTime').text(currentTime);
    $('#trainTable').append(
            "<tr><td id='nameDisplay'>" + childSnapshot.val().name +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
     },
    
    function(errorObject){
        console.log("Read failed: " + errorObject.code)
    });
    
    // database.ref().orderByChild("timeAdded").limitToLast(1).on("child_added", function(snapshot){
    //     // Change the HTML to reflect
    //     $("#nameDisplay").html(snapshot.val().name);
    //     $("#destDisplay").html(snapshot.val().dest);
    //     $("#timeDisplay").html(snapshot.val().time);
    //     $("#freqDisplay").html(snapshot.val().freq);
    // })
    
    }); //END DOCUMENT.READY