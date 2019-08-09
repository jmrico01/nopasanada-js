"use strict";

const ENTRIES_FEATURED = {
    "#noticias": {
        image: "featured-new.png",
        title: "noticias.*",
        subtitle: "Diego Delfino.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "#deportemoto": {
        image: "featured-new.png",
        title: "wheels,<br>metal.",
        subtitle: "Los Sadistas.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "#arteycultura": {
        image: "featured4.png",
        title: "cows &<br>landscapes.*",
        subtitle: "Los Sadistas.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "#politica": {
        image: "featured-new.png",
        title: "politica.*",
        subtitle: "No Le Hablo.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "#comida": {
        image: "featured-new.png",
        title: "munchies.*",
        subtitle: "Las Delicias.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "#moda": {
        image: "featured-new.png",
        title: "rose & bare.*",
        subtitle: "Quien es esa Rica?",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    }
};

let prevHash = null;
let warned = false;

function Shuffle(array)
{
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function SetFeaturedEntry(entry)
{
    $("#featuredTitle").html(entry.title);
    $("#featuredSubtitle").html(entry.subtitle);
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);
    $("#featuredText3").html(entry.text3);

    let imagePath = "../images/" + entry.image;
    $("#featuredContainer").css("background-image", "url(\"" + imagePath + "\")");
}

function HandleHash(hash)
{
    let featuredEntry = ENTRIES_FEATURED["#deportemoto"];
    if (ENTRIES_FEATURED.hasOwnProperty(hash)) {
        featuredEntry = ENTRIES_FEATURED[hash];
    }
    SetFeaturedEntry(featuredEntry);

    let posterNums = [1, 2, 3, 4, 5, 6, 7];
    if (posterNums === null) {
        $("#screen2").hide();
        return;
    }

    Shuffle(posterNums);
    $(".entryPoster").each(function(index) {
        let $this = $(this);
        let posterImagePath = "images/poster" + posterNums[index] + ".png";
        $this.attr("src", posterImagePath);
    });

    $("#screen2").show();
}

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash !== prevHash) {
        prevHash = hash;
        HandleHash(hash);
    }
};

window.onload = function() {
    OnResize();
    HandleHash(window.location.hash);
    $("#content").css("visibility", "visible");

    SetupHeader();
};

window.onresize = OnResize;
