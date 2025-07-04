var Esri_WorldStreetMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri",
  }
);
//
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution: "Tiles &copy; Esri",
  }
);

var map = L.map("map", {
  center: [25, 0],
  zoom: 2,
  layers: [Esri_WorldStreetMap],
});

var baseMaps = {
  "Road Map": Esri_WorldStreetMap,
  Satellite: Esri_WorldImagery,
};

const styleLine = {
	color: "#b33f62",
	weight: 5,
	opacity: 0.8,
	dashArray: '5, 10',
}

var layerControl = L.control.layers(baseMaps).addTo(map);

var strand = L.latLng(-33.85803025975863, 151.21418300826664);
var down = L.latLng(40.757961521764386, -73.98553935850234);
var museum = L.latLng(29.97777925686133, 31.132630131294945);
var york = L.latLng(51.4994794, -0.1248092);
var brompton = L.latLng(29.95669836249198, -90.06737555311587);
var stonehenge = L.latLng(51.17884555169363, -1.8261854856994666);
var redsquare = L.latLng(55.753249581832975, 37.62189442851849);
var mont = L.latLng(48.63394492959782, -1.510405739796455);
var lochness = L.latLng(57.33026677668823, -4.422900783114528);
var taj = L.latLng(27.175039786633782, 78.0421421953412);
var white = L.latLng(38.89763041994514, -77.0365583835296);
var eiffel = L.latLng(48.85827830758674, 2.2945242117654754);
var rome = L.latLng(41.8902102,12.4922309);
var liberty = L.latLng(40.68916801923921, -74.04451113288738);
var pisa = L.latLng(43.72296064433781, 10.396635032210224);
var louvre = L.latLng(48.860956933089945, 2.3358415520513116);
var petra = L.latLng(30.322150083954124, 35.45173355782087);
var forbidden = L.latLng(39.9138563,116.3991718);
var milan = L.latLng(45.47019082074276, 9.179671380870323);
var vegas = L.latLng(36.11223533675604, -115.17206894538029);
var poole = L.latLng(50.68336067015753, -1.9485918028642253);
var rio = L.latLng(-22.952086302224576, -43.21027955424402);
var gate = L.latLng(34.2972669207296, 132.3181391364216);
var itza = L.latLng(20.68301518063417, -88.56863017800832);
var pompeii = L.latLng(40.74945006471704, 14.486670030469972);
var bear = L.latLng(52.51627040272311, 13.37775684256401);
var space = L.latLng(47.62045929429556, -122.34924521349335);
var venice = L.latLng(45.43806019459171, 12.335964889509661);
var barca = L.latLng(41.40355344994936, 2.174398715342193);
var easter = L.latLng(-27.1398509,-109.4273516);


const station = document.getElementById("station");
const myDiv = document.getElementById("my-div");

const userMarkers = []; // Array to store user-added markers

const nextButton = document.createElement("subbutton");
nextButton.innerText = "Next";
nextButton.id = "buttonsdiv";
nextButton.disabled = true;
nextButton.className = "my-button";

const submitButton = document.createElement("subbutton");
submitButton.innerText = "Enter";
submitButton.id = "buttonsdiv";
submitButton.disabled = true;
submitButton.className = "my-button";

let totalDistance = 0; // Keep track of accumulated distance
let roundDistances = []; // Array to store distance for each round

// Custom user marker icon
const LeafIcon = L.Icon.extend({
  options: {
    iconSize: [30, 41],
    iconAnchor: [15, 40],
  },
});

const greenIcon = new LeafIcon({
  iconUrl: "videos/_265a5cce-4ba0-4c1c-a76f-a7d5f00d8ea0-removebg-preview (1) (1).png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

let randomIndex;
let idSetInterval;
let userMarker;

function postScoreToBluesky(totalDistance) {
  const message = encodeURIComponent(
    `I traveled ${totalDistance} kilometers hunting ghosts! <br> Play https://tripgeo.com/nightmareonviewstreet and see if you can beat my score.`
  );
  const blueskyPostUrl = `https://bsky.app/intent/compose?text=${message}`;
  console.log("Bluesky Post URL:", blueskyPostUrl); // Debugging statement
  window.open(blueskyPostUrl, "_blank");
}

function postScoreToTwitter(totalDistance) {
  const message = encodeURIComponent(
    `I traveled ${totalDistance} kilometers hunting ghosts! Play https://tripgeo.com/nightmareonviewstreet and see if you can beat my score.`
  );
  const TwitterPostUrl = `https://twitter.com/intent/tweet?text=${message}`;
  console.log("Twitter Post URL:", TwitterPostUrl); // Debugging statement
  window.open(TwitterPostUrl, "_blank");
}

function generateAndPlay(remainingPoints) {
  if (remainingPoints.length === 0) {
    // End of game logic

    if (userMarkers.length !== 0) {
      // Fit the map to the user-added markers
      const bounds = new L.LatLngBounds();
      userMarkers.forEach(function (markerLatLng) {
        bounds.extend(markerLatLng);
      });
      map.fitBounds(bounds);
    }

    // Remove round 5 picture
    ghostinfo.innerHTML = "";

    // Add the "Play Again" button
    const playAgainButton = document.createElement("subbutton");
    playAgainButton.id = "playAgainBtn";
    playAgainButton.innerText = "Play again";
    playAgainButton.className = "my-button";

    // Add click event listener to the button
    playAgainButton.addEventListener("click", function () {
      location.reload();
    });

    document.getElementById("playagain").appendChild(playAgainButton);

    // Save personal best scores
    const personalBest = localStorage.getItem("personalBest");

    if (personalBest === null || totalDistance < parseFloat(personalBest)) {
      localStorage.setItem("personalBest", totalDistance.toFixed(2));
    }

    // Create a container for the social media buttons
const socialButtonsContainer = document.createElement("div");
socialButtonsContainer.className = "social-buttons"; // Add the class for styling

// Create Bluesky button
const blueskyButton = document.createElement("subbutton");
blueskyButton.innerHTML = `
  <div class="tooltip">
    <button onclick="postScoreToBluesky(totalDistance.toFixed(2))">
      <img
        src="https://cdn.glitch.global/5c79659d-2de3-48c0-b764-8b0e57d2e123/Bluesky_Logo.svg.png?v=1726579976732"
        id="bluesky-button"
        alt="Logo"
        style="height: 18px; vertical-align: middle; cursor: pointer"
      />
    </button>
    <div class="tooltiptext">Share on Bluesky</div>
  </div>
`;

// Create Twitter button
const twitterButton = document.createElement("subbutton");
twitterButton.innerHTML = `
  <div class="tooltip">
    <button onclick="postScoreToTwitter(totalDistance.toFixed(2))">
      <img
        src="https://cdn.glitch.global/5c79659d-2de3-48c0-b764-8b0e57d2e123/logo-black.png?v=1726492469512"
        id="twitter-button"
        alt="Logo"
        style="height: 18px; vertical-align: middle; cursor: pointer"
      />
    </button>
    <div class="tooltiptext">Share on X</div>
  </div>
`;

// Append the buttons to the container
socialButtonsContainer.appendChild(blueskyButton);
socialButtonsContainer.appendChild(twitterButton);

// Append the container to the playagain div
document.getElementById("playagain").appendChild(socialButtonsContainer);
    
    // Display game score
    station.style.color = "#333";
    station.innerHTML = `Game ended<br><br>
    ${roundDistances
      .map((distance, index) => `round ${index + 1}: ${distance.toFixed(2)} kilometres`)
      .join("<br>")}<br>
    <br>Total distance: ${totalDistance.toFixed(2)} kilometers.<br>
    Best game: ${localStorage.getItem("personalBest")} kilometers.`;

    document
      .getElementById("station")
      .animate(
        [
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
          { transform: "rotate(-10deg)" },
          { transform: "rotate(10deg)" },
        ],
        {
          duration: 1000,
          iterations: 1,
        }
      );

    return;
    }

  randomIndex = Math.floor(Math.random() * remainingPoints.length);
  const referencePoint = remainingPoints[randomIndex];

  const roundNumber = Math.ceil(5 - remainingPoints.length + 1); // Calculate round number

  const capitalizedRound = "round".charAt(0).toUpperCase() + "round".slice(1);
  station.innerHTML = `${capitalizedRound}  ${roundNumber}.<br>`;
  ghostinfo.innerHTML = `${stationInfo[referencePoint]}<br><div id="myProgress"><div id="myBar"></div></div>`;

  document.getElementById("myProgress").style.display = "block";

  move(remainingPoints);

  map.off("click"); // Remove previous click event listener

  // Function to create the midpoint variable
  function createMidpoint(markerLatLng, referencePointLatLng) {
    const markerLat = markerLatLng.lat;
    const markerLng = markerLatLng.lng;
    const referencePointLat = referencePointLatLng.lat;
    const referencePointLng = referencePointLatLng.lng;

    // Calculate the midpoint's latitude and longitude
    const midpointLat = (markerLat + referencePointLat) / 2;
    const midpointLng = (markerLng + referencePointLng) / 2;

    // Create the midpoint L.latLng object
    const midpoint = L.latLng(midpointLat, midpointLng);

    return midpoint;
  }

  map.on("click", function (e) {

    myDiv.innerHTML = "Click again to move the marker.<br>Click on 'Enter' to submit your guess.";

    // Add user marker to the array

    if (userMarker) {
      map.removeLayer(userMarker); // Remove the previous marker
    }

    userMarker = L.marker(e.latlng).addTo(map); // Add the new marker
    userMarker._icon.classList.add("huechange");
    userMarkers.push(userMarker.getLatLng());

    //add submitbutton
    document.getElementById("buttonsdiv").appendChild(submitButton);

    submitButton.onclick = function () {

      document.getElementById("myProgress").style.display = "none";
      clearInterval(idSetInterval);

      const marker = L.marker(e.latlng).addTo(map);
      marker._icon.classList.add("huechange");
      const distance = L.latLng(e.latlng).distanceTo(referencePoint);
      map.off("click");

      // Create a bounds object encompassing both markers
      const bounds = L.latLngBounds([e.latlng, referencePoint]);

      // Zoom the map to fit those bounds
      map.fitBounds(bounds);

      //remove submit button and add next painting button
      document.getElementById("buttonsdiv").appendChild(nextButton);
      document.getElementById("buttonsdiv").removeChild(submitButton);

      // Convert meters to miles:
      //const distanceInMiles = distance * 0.000621371;
      const distanceInKilometers = distance * 0.001;

      myDiv.innerHTML = `You clicked ${distanceInKilometers.toFixed(2)} kilometers from the correct location`;
        
      // Create the midpoint variable and display message
      const midpoint = createMidpoint(e.latlng, referencePoint);

      let backgroundColor = '';
      let gaEventDistance = '';

      if (distanceInKilometers < 0.5) {
        backgroundColor = 'rgba(0, 128, 0, 0.9)';
        gaEventDistance = "Less than 500m";
      } else if (distanceInKilometers < 2) {
        backgroundColor = 'rgba(139, 197, 0, 0.9)';
        gaEventDistance = "Less than 2000m";
      } else if (distanceInKilometers < 10) {
        backgroundColor = 'rgba(202, 180, 0, 0.9)';
        gaEventDistance = "Less than 10000m";
      } else if (distanceInKilometers < 25) {
        backgroundColor = 'rgba(255, 127, 14, 0.9)';
        gaEventDistance = "Less than 25000m";
      } else {
        backgroundColor = 'rgba(255, 0, 0, 0.9)';
        gaEventDistance = "More 25000m";
      }


      // emojis from https://www.w3schools.com/charsets/ref_emoji_smileys.asp
      const popup = L.popup().setLatLng(midpoint)
        .setContent(
          distanceInKilometers < 0.5
            ? "Perfect <span style='font-size:24px;'>&#128512;</span>"
            : distanceInKilometers < 2
            ? "Quite good <span style='font-size:24px;'>&#128521;</span>"
            : distanceInKilometers < 10
            ? "OK <span style='font-size:24px;'>&#128558;</span>"
            : distanceInKilometers < 100
            ? "Not good <span style='font-size:24px;'>&#128551;</span>"
            : "Way Off!! <span style='font-size:24px;'>&#128553;</span>" // Default message for distances 100 km or more
        )
        .openOn(map);

      // Set background color dynamically
      const popupWrapper = document.querySelector('.leaflet-popup-content-wrapper');
      if (popupWrapper) {
        popupWrapper.style.backgroundColor = backgroundColor;
      }

      // Update total distance with clicked marker's distance
      totalDistance += distanceInKilometers;
      roundDistances.push(distanceInKilometers); // Add distance to the roundDistances array
      // connect user marker to correct location
      const polyline = L.polyline([e.latlng, referencePoint], styleLine).addTo(map);

      // Put marker on correct location
      const stationMarker = L.marker(referencePoint, { icon: greenIcon }).addTo(
        map
      );

      // Remove the used reference point from the remaining pool
      remainingPoints.splice(randomIndex, 1);
      
           
    };
  });

  // Enable next button when a new game round starts
  nextButton.disabled = false;

  // Handle next button click
  nextButton.onclick = function () {
    //remove popup message
    map.closePopup();
    // Change button text to "Results" on the fifth question
    if (roundNumber === 4) {
      nextButton.innerText = "Results";
    }

    //remove next button and add submit painting button
    document.getElementById("buttonsdiv").removeChild(nextButton);
    map.setView([25, 0], 2);
    document
      .getElementById("station")
      .animate(
        [
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
          { transform: "translateX(-3px)" },
          { transform: "translateX(3px)" },
        ],
        {
          duration: 1000,
          iterations: 1,
        }
      );

    generateAndPlay(remainingPoints);
    myDiv.innerHTML = "Click on map";
  };
}

function move(remainingPoints) {
  var elem = document.getElementById("myBar");
  var width = 100; // Initial width set to 100%
  var decrementRate = 1; // Decrement rate for width
  var duration = 60 * 1000; // Duration in milliseconds
  var intervalTime = 60; // Interval time in milliseconds
  var steps = duration / intervalTime; // Total steps

  var stepWidth = width / steps; // Width to decrement at each step

  idSetInterval = setInterval(frame, intervalTime);
  
  function frame() {
    if (width <= 0) {
      clearInterval(idSetInterval);
      
      remainingPoints.splice(randomIndex, 1); // Remove the used reference point from the remaining pool
      // if submitButton ("Comprovar") exists, then remove it
      document.getElementById("buttonsdiv").contains(submitButton) ? document.getElementById("buttonsdiv").removeChild(submitButton) : false;
      document.getElementById("buttonsdiv").appendChild(nextButton);
      // Remove marker if there is on map
      //userMarkers.slice(0, -1);

      if (userMarker) {
        map.removeLayer(userMarker); // Remove the previous marker
      }

      userMarkers.pop();

      roundDistances.push(300); // Add max distance


    } else {
      width -= stepWidth;
      elem.style.width = width + "%";
      // Dynamically adjust color from green to yellow/orange to red based on width
      var startColor = [200, 0, 40]; // Green: rgb(0,145,40)
      var midColor = [255, 205, 0]; // Orange: rgb(255,165,0)
      var endColor = [0, 145, 40]; // Red: rgb(200,0,40)
      var red, green, blue;

      if (width >= 50) {
        // Transition from green to yellow/orange
        var ratio = (width - 50) / 50;
        red = Math.round(midColor[0] + (endColor[0] - midColor[0]) * ratio);
        green = Math.round(midColor[1] + (endColor[1] - midColor[1]) * ratio);
        blue = Math.round(midColor[2] + (endColor[2] - midColor[2]) * ratio);
      } else {
        // Transition from yellow/orange to red
        var ratio = width / 50;
        red = Math.round(startColor[0] + (midColor[0] - startColor[0]) * ratio);
        green = Math.round(startColor[1] + (midColor[1] - startColor[1]) * ratio);
        blue = Math.round(startColor[2] + (midColor[2] - startColor[2]) * ratio);
      }

      elem.style.backgroundColor = "rgb(" + red + "," + green + "," + blue + ")";
    }
  }

}

const locationNames = {
  [strand]: "Sydney Opera House",
  [down]: "Times Square, New York",
  [museum]: "The Great Pyramid of Giza",
  [york]: "Houses of Parliament, London",
  [brompton]: "Bourbon Street, New Orleans",
  [stonehenge]: "Stonehenge, England",
  [redsquare]: "Red Square, Moscow",
  [mont]: "Mont Saint-Michel",
  [lochness]: "Loch Ness, Scotland",
  [taj]: "Taj Mahal, Agra",
  [white]: "White House, D.C.",
  [eiffel]: "Eiffel Tower, Paris",
  [rome]: "Colosseum, Rome",
  [liberty]: "Statue of Liberty, New York",
  [pisa]: "Leaning Tower of Pisa",
  [louvre]: "Louvre Museum, Paris",
  [petra]: "Petra, Jordan",
  [forbidden]: "Forbidden City, Beijing",
  [milan]: "Sforzesco Castle, Milan",
  [vegas]: "Sforzesco Castle, Milan",
  [poole]: "Poole Harbour, UK",
  [rio]: "Christ the Redeemer, Brazil",
  [gate]: "Itsukushima Shrine, Japan",
  [itza]: "Chichén Itzá, Mexico",
  [pompeii]: "Pompeii, Italy",
  [bear]: "Brandenburg Gate, Berlin",
  [space]: "Space Needle, Seattle",
  [venice]: "Rialto Bridge, Venice",
  [barca]: "Sagrada Família, Barcelona",
  [easter]: "Easter Island",

};

const stationInfo = {
  [strand]:
    '<video src="videos/300822432191971330.mp4?v=1728595880260" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [down]:
    '<video src="videos/1728568125364782660-video_watermark_ec069341b631bf06bf5a74ec5929609f_300769596204732423.mp4?v=1728596738714" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [museum]:
    '<video src="videos/300869593277497352.mp4?v=1728597106070" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [york]:
    '<video src="videos/300803451234127876.mp4?v=1728597338078" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [brompton]:
    '<video src="videos/300845843064651785.mp4?v=1728597457522" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [stonehenge]:
    '<video src="videos/300839622144270336.mp4?v=1728598071541" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [redsquare]:
    '<video src="videos/300897565061513216.mp4?v=1728603653498" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [mont]:
    '<video src="videos/300933185649618949.mp4?v=1728632877791" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [lochness]:
    '<video src="videos/301052877836034052.mp4?v=1728640003777" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [taj]:
    '<video src="videos/301070690785079304.mp4?v=1728640417861" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [white]:
    '<video src="videos/whitehouse.mp4" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [eiffel]:
    '<video src="videos/301217118039867395.mp4?v=1728679062892" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [rome]:
    '<video src="videos/301311435337146376.mp4?v=1728740140032" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [liberty]:
    '<video src="videos/301507920368570372.mp4?v=1728752507893" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [pisa]:
    '<video src="videos/301619905005424645.mp4?v=1728830838825" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [louvre]:
    '<video src="videos/301551115798388741.mp4?v=1728831161944" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [petra]:
    '<video src="videos/301890284592648193.mp4?v=1728837714202" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [forbidden]:
    '<video src="videos/301936348553101319.mp4?v=1728910576597" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [milan]:
    '<video src="videos/301609655875473416.mp4?v=1728915265485" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [vegas]:
    '<video src="videos/302255211597688832.mp4?v=1728929334836" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [poole]:
    '<video src="videos/302418054473203721%20(1).mp4?v=1728983668451" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [rio]:
    '<video src="videos/302954437826752512.mp4?v=1729091049372" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [gate]:
    '<video src="videos/303044970762895365.mp4?v=1729113454631" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [itza]:
    '<video src="videos/mexico.mp4" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [pompeii]:
    '<video src="videos/303333184803356673.mp4?v=1729189016099" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [bear]:
    '<video src="videos/303485532536238085.mp4?v=1729252505520" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [space]:
    '<video src="videos/303722675565154304%20(online-video-cutter.com)%20(1).mp4?v=1729279316438" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [venice]:
    '<video src="videos/303941119166312456.mp4?v=1729326472221" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [barca]:
    '<video src="videos/304049258947616772%20(online-video-cutter.com).mp4?v=1729354819884" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',
  [easter]:
    '<video src="videos/1734991216528112817-video_watermark_adacaaea581fdcc62c620597857c1eaf_327720127059906564%20(online-video-cutter.com)%20(1).mp4?v=1734992528280" autoplay loop class="center responsive-video" onclick="this.requestFullscreen()"></video>',

};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Start the game with all reference points

function toPlay() {

  playbutton.remove();
  const shuffledEntries = [
    strand, down, museum, york, brompton, stonehenge, redsquare, mont, lochness, taj, white, eiffel, rome, liberty, pisa, louvre, petra, forbidden, milan, vegas, poole, rio, gate, itza, pompeii, bear, space, venice, barca, easter
  ];
    //select 5 random pictures
  //  .slice()
  //  .sort(() => Math.random() - 0.5); // Shuffle using Fisher-Yates
  //const randomEntries = shuffledEntries.slice(0, 5);


  const shuffled = shuffleArray([...shuffledEntries]);
  const randomEntries = shuffled.slice(0, 5);

  generateAndPlay(randomEntries);
  myDiv.innerHTML = "Click on the map";
}

function addMarkers(map) {
  var markers = [
    strand, down, museum, york, brompton, stonehenge, redsquare, mont, lochness, taj, white, eiffel, rome, liberty, pisa, louvre, petra, forbidden, milan, vegas, poole, rio, gate, itza, pompeii, bear, space, venice, barca, easter
  ];

  for (var i = 0; i < markers.length; i++) {
    var marker = L.marker(markers[i], {
      icon: greenIcon,
      referencePoint: markers[i]
    });

    marker.addTo(map).on('click', function() {

      var markerKey = this.options.referencePoint;
      var correctContent = stationInfo[markerKey];
      document.getElementById('ghostinfo').innerHTML = correctContent + '<br>';
    });
  }
}

var mapSequence = [];

document.addEventListener("keydown", function (event) {
  mapSequence.push(event.key);

  if (mapSequence.length === 3 && mapSequence.join("") === "map") {
    event.preventDefault();
    mapSequence = [];
    addMarkers(map);
  } else if (mapSequence.length > 3) {
    mapSequence = [];
  }
});

document.getElementById("about").addEventListener("click", function(event) {
  event.preventDefault();
  
  const ghostinfo = document.getElementById("ghostinfo");
  const playbutton = document.getElementById("playbutton");
  const home = document.getElementById("home");
  const aboutContent = document.getElementById("aboutContent");
  const about = document.getElementById("about");

  if (ghostinfo) {
    ghostinfo.style.display = "none";
  }

  if (playbutton) {
    playbutton.style.display = "none";
  }

  if (home) {
    home.classList.remove("active");
  }

  if (aboutContent) {
    aboutContent.style.display = "block";
  }

  if (about) {
    about.classList.add("active");
  }
  
});

document.getElementById("home").addEventListener("click", function(event) {
  event.preventDefault();

  const ghostinfo = document.getElementById("ghostinfo");
  const playbutton = document.getElementById("playbutton");
  const home = document.getElementById("home");
  const aboutContent = document.getElementById("aboutContent");
  const about = document.getElementById("about");
  
  if (ghostinfo) {
    ghostinfo.style.display = "block";
  }

  if (playbutton) {
    playbutton.style.display = "block";
  }

  if (home) {
    home.classList.add("active");
  }

  if (aboutContent) {
    aboutContent.style.display = "none";
  }

  if (about) {
    about.classList.remove("active");
  }

});

 // Function to toggle fullscreen mode
        function toggleFullscreen() {
            // Check if the document is already in fullscreen mode
            if (!document.fullscreenElement) {
                // If not, request fullscreen
                document.documentElement.requestFullscreen().catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
            } else {
                // If in fullscreen, exit fullscreen
                document.exitFullscreen();
            }
        }

        // Add event listener to the button
        document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);
