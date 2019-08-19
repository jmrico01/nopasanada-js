"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const ABOUT_TEXT_FADE_MS = 200;

const ENTRIES_FEATURED = {
    "noticias": {
        image: "featured-noticias.jpg",
        title: "noticias.*",
        subtitle: "",
        text1: "PROXIMAMENTE<br>&nbsp;",
        text2: "PROXIMAMENTE",
        text3: "PROXIMAMENTE"
    },
    "deportemoto": {
        image: "featured-deportemoto2.png",
        //title: "wheels,<br>metal.",
        title: "pilotos.",
        subtitle: "",
        text1: "EPISODIO 1:<br>FAMILIA",
        text2: "VER TRAILER",
        text3: "UN ESPECIAL DE<br>NOPASANADA.**"
    },
    "arteycultura": {
        image: "featured-arteycultura3.png",
        title: "arte y<br>cultura.*",
        subtitle: "",
        text1: "PROXIMAMENTE<br>&nbsp;",
        text2: "PROXIMAMENTE",
        text3: "PROXIMAMENTE"
    }
};

let prevHash = null;
let warned = false;
let player = null;

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

function SetFeaturedContent(category, instant)
{
    let entry = ENTRIES_FEATURED[category];
    $("#featuredTitle").html(entry.title);
    /*if (entry.subtitle === "") {
        $("#featuredSubtitle").css("display", "none");
    }
    else {
        $("#featuredSubtitle").html(entry.subtitle);
    }*/
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);
    $("#featuredText3").html(entry.text3);

    let href = "#video";
    if (category !== "deportemoto") {
        href = "#" + category;
    }
    $("#featuredLink").attr("href", href);

    let $currentActive = $("#featuredImageCycler img.active");
    let $currentTransition = $("#featuredImageCycler img.transition");
    let $featuredImage = $("#featuredImage-" + category);
    if (instant) {
        $currentActive.removeClass("active");
        $currentTransition.removeClass("transition");
        $featuredImage.addClass("active");
    }
    else {
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
    }
}

function HandleHash(hash, prevHash)
{
    if (prevHash === "#video") {
        player.stopVideo();
    }

    if (hash === "#video") {
        if (prevHash === "#nopasanada") {
            $("#video").show();
            $("#screen3").stop().fadeOut(ABOUT_TEXT_FADE_MS, function() {
                $("#screen1").stop().fadeIn(ABOUT_TEXT_FADE_MS);
            })
        }
        else {
            $("#video").stop().fadeIn(FEATURED_IMAGE_FADE_MS);
        }
        player.playVideo();
    }
    else if (hash === "#nopasanada") {
        $("#screen1").stop().fadeOut(ABOUT_TEXT_FADE_MS, function() {
            $("#screen3").stop().fadeIn(ABOUT_TEXT_FADE_MS);
        });
    }
    else {
        let category = "deportemoto";
        let hashIndex = hash.indexOf("#");
        if (hashIndex !== -1) {
            let hashCategory = hash.substring(hashIndex + 1, hash.length);
            if (ENTRIES_FEATURED.hasOwnProperty(hashCategory)) {
                category = hashCategory;
            }
        }

        if (prevHash === "#video") {
            SetFeaturedContent(category, true);
            $("#video").stop().fadeOut(FEATURED_IMAGE_FADE_MS);
            return;
        }
        else if (prevHash === "#nopasanada") {
            $("#video").hide();
            SetFeaturedContent(category, true);
            $("#screen3").stop().fadeOut(ABOUT_TEXT_FADE_MS, function() {
                $("#screen1").stop().fadeIn(ABOUT_TEXT_FADE_MS);
            });
        }
        else if ((hash === "" && prevHash === "#deportemoto")
        || (hash === "#deportemoto" && prevHash === "")) {
            return;
        }
        else {
            SetFeaturedContent(category, false);
        }
    }
}

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash !== prevHash) {
        let oldPrevHash = prevHash;
        prevHash = hash;
        HandleHash(hash, oldPrevHash);
    }
};

window.onload = function() {
    OnResize();

    $("#video").hide();
    $("#screen3").hide();
    try {
        player = new YT.Player("video", {
            height: "100%",
            width: "100%",
            videoId: "51aG1gGsULU",
            playerVars: {
                modestbranding: 1,
                rel: 0
            },
            events: {
                "onReady": function() {
                    for (let key in ENTRIES_FEATURED) {
                        let imgId = "featuredImage-" + key;
                        let imgPath = "images/" + ENTRIES_FEATURED[key].image;
                        $("#featuredImageCycler").append("<img id=\"" + imgId
                            + "\" src=\"" + imgPath + "\">");
                        // $("#" + imgId).hide();
                    }
                    HandleHash(window.location.hash);

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

                    $("#content").css("visibility", "visible");
                },
                "onStateChange": function(event) {
                    let state = event.data;
                    if (state === YT.PlayerState.PAUSED) {
                    }
                    else if (state === YT.PlayerState.PLAYING) {
                    }
                    else if (state === YT.PlayerState.ENDED) {
                    }
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }
};

window.onresize = OnResize;
