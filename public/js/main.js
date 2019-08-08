"use strict";

const ENTRIES_FEATURED = [
    {
        image: "featured1.jpg",
        title: "tragicomedia<br>van jalados",
        subtitle: "SUBTITLE > CONTENT<br>BRIEF."
    },
    {
        image: "featured2.jpg",
        title: "quien dijo<br>motos?",
        subtitle: "SUBTITLE > CONTENT<br>BRIEF."
    },
    {
        image: "featured3.jpg",
        title: "magpie jay<br>on tour",
        subtitle: "SUBTITLE > CONTENT<br>BRIEF."
    },
];

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
    let imagePath = "../images/" + entry.image;
    $("#featuredContainer").css("background-image", "url(\"" + imagePath + "\")");
    $("#featuredTitle").html(entry.title);
    $("#featuredSubtitle").html(entry.subtitle);
}

function HandleHash(hash)
{
    let entryIndex = 0;
    let posterNums = [1, 2, 3, 4, 5, 6, 7];
    if (hash === "") {
        entryIndex = 2;
    }
    else if (hash === "#noticias") {
        entryIndex = 0;
    }
    else if (hash === "#deportemoto") {
        entryIndex = 1;
    }
    else if (hash === "#arteycultura") {
        entryIndex = 2;
    }
    else if (hash === "#politica") {
        entryIndex = 0;
    }
    else if (hash === "#comida") {
        entryIndex = 1;
    }
    else if (hash === "#moda") {
        entryIndex = 2;
    }
    else if (hash === "#magpiejay") {
        entryIndex = 2;
        posterNums = null;
    }

    SetFeaturedEntry(ENTRIES_FEATURED[entryIndex]);

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

function OnResize() {
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        let thisHeight = $this.height();
        let topSpacing = headerHeight;
        let bottomSpacing = document.documentElement.clientHeight - thisHeight - topSpacing;
        $this.css("padding-top", topSpacing);
        $this.css("padding-bottom", bottomSpacing);
    })

    $("#screen2").css("padding-top", 0);

    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    if (aspect < 1.45 && !warned) {
        warned = true;
        setTimeout(function() {
            alert("WARNING\n\n"
                + "You are viewing the website at a thin aspect ratio (less than 1.5).\n"
                + "Layout and spacing will be messed up until we explicitly design\n"
                + "for these taller formats (tall windows / mobile)");
        }, 0);
    }
}

window.onload = function() {
    OnResize();
    HandleHash(window.location.hash);
    $("#content").css("visibility", "visible");

    SetupHeader();
};

window.onresize = OnResize;