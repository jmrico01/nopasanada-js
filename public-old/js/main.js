"use strict";

const FEATURED_IMAGE_FADE_MS = 400;

const ENTRIES_FEATURED = {
    "noticias": {
        image: "featured-new2.png",
        title: "noticias.*",
        subtitle: "Diego Delfino.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "deportemoto": {
        image: "featured-new1.png",
        title: "wheels,<br>metal.",
        subtitle: "Los Sadistas.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "arteycultura": {
        image: "featured-new2.png",
        title: "cows &<br>landscapes.*",
        subtitle: "Los Sadistas.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "politica": {
        image: "featured-new1.png",
        title: "politica.*",
        subtitle: "No Le Hablo.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "comida": {
        image: "featured-new2.png",
        title: "munchies.*",
        subtitle: "Las Delicias.",
        text1: "CONQUISTA SESSIONS.<br>TRIGGER.**",
        text2: "WATCH<br>LIVE DOCUMENTARY",
        text3: "A NOPASANADA FEATURE"
    },
    "moda": {
        image: "featured-new1.png",
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

function SetFeaturedEntry(hash)
{
    let category = "deportemoto";
    let hashIndex = hash.indexOf("#");
    if (hashIndex !== -1) {
        let hashCategory = hash.substring(hashIndex + 1, hash.length);
        if (ENTRIES_FEATURED.hasOwnProperty(hashCategory)) {
            category = hashCategory;
        }
    }

    let $currentActive = $("#featuredImageCycler img.active");
    let $currentTransition = $("#featuredImageCycler img.transition");
    let $featuredImage = $("#featuredImage-" + category);
    if ($currentActive.length === 0 && $currentTransition.length === 0) {
        $featuredImage.addClass("active");
    }
    else if ($currentActive.length > 0 && $currentTransition.length === 0) {
        $featuredImage.addClass("transition");
        $currentActive.fadeOut(FEATURED_IMAGE_FADE_MS, function() {
            $currentActive.removeClass("active").show();
            $(".transition").addClass("active").removeClass("transition");
        });
    }
    else if ($currentActive.length === 0 && $currentTransition.length > 0) {
        // strange case, small timing issue, but this is JS so who knows
        return;
    }
    else if ($currentActive.length > 0 && $currentTransition.length > 0) {
        $(".transition").removeClass("transition");
        $featuredImage.addClass("transition");
    }

    let entry = ENTRIES_FEATURED[category];
    $("#featuredTitle").html(entry.title);
    $("#featuredSubtitle").html(entry.subtitle);
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);
    $("#featuredText3").html(entry.text3);
}

function HandleHash(hash)
{
    SetFeaturedEntry(hash);

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
    for (let key in ENTRIES_FEATURED) {
        let imgId = "featuredImage-" + key;
        let imgPath = "images/" + ENTRIES_FEATURED[key].image;
        $("#featuredImageCycler").append("<img id=\"" + imgId
            + "\" src=\"" + imgPath + "\">");
        // $("#" + imgId).hide();
    }
    HandleHash(window.location.hash);
    $("#content").css("visibility", "visible");

    const MONTHS_SPANISH = [
        "ENERO", "FEBRERO", "MARZO",
        "ABRIL", "MAYO", "JUNIO",
        "JULIO", "AGOSTO", "SEPTIEMBRE",
        "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
    ];
    let today = new Date();
    $("#footerText1").html(today.getDate() + " DE "
        + MONTHS_SPANISH[today.getMonth()] + ",<br>"
        + today.getFullYear());

    SetupHeader();
};

window.onresize = OnResize;
