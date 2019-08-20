"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const ABOUT_TEXT_FADE_MS = 200;
const IMAGE_ANIM_MS = 250;

const ENTRIES_FEATURED = {
    "noticias": {
        images: [
            "garrotex1.jpg",
            "garrotex2.jpg"
        ],
        pretitle: "PROXIMAMENTE:",
        title: "NOTICIAS<br>---<b>.</b>",
        decoration: "***",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        link: "#noticias"
    },
    "deporteymoto": {
        images: [
            "moto1.jpg",
            "moto2.jpg",
            "moto3.jpg",
            "moto4.jpg"
        ],
        pretitle: "SERIE:",
        title: "PILOTOS<br><b>EP 1.</b>",
        decoration: "***",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        link: "#content-trailerp"
    },
    "arteycultura": {
        images: [
            "enfoque1.jpg",
            "enfoque2.jpg",
            "enfoque3.jpg",
            "enfoque4.jpg"
        ],
        pretitle: "SERIE:",
        title: "ENFOQUE<br><b>EP 1.</b>",
        decoration: "***",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        link: "#content-trailere"
    },
    "moda": {
        images: [
            "guilasexual1.jpg"
        ],
        pretitle: "TEMA SEMANAL:",
        title: "LA MUJER,<br><b>D&Iacute;A 1.</b>",
        decoration: "",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        link: "#content-articulo1"
    },
    "nopasanada": {
        images: [
            "garrote1.jpg",
            "garrote2.jpg",
            "garrote3.jpg",
            "garrote4.jpg"
        ],
        pretitle: "ESTO ES:",
        title: "<b>NO</b> PASA<br>NADA<b>.</b>",
        decoration: "***",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        link: "#content-video"
    }
};

const ARTICLES = {
    "trailerp": {
        video: "51aG1gGsULU"
    },
    "trailere": {
        video: "g36TGvzIi5o"
    },
    "articulo1": {
        image: "guilasexual1.jpg"
    },
    "video": {
        video: "TzxV2HgY35s"
    }
};

let IMAGE_ASPECT = 1920 / 960;

let prevHash = null;
let warned = false;
let player = null;
let imgCycleInterval = null;
let allImagesLoaded = false;

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
    $("#featuredPretitle").html(entry.pretitle);
    $("#featuredTitle a").html(entry.title);
    $("#featuredTitle a").attr("href", entry.link);
    $("#featuredDecoration").html(entry.decoration);
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);

    if (!allImagesLoaded) {
        return;
    }

    if (imgCycleInterval !== null) {
        clearInterval(imgCycleInterval);
    }

    let imageClass = ".featuredImage-" + category;
    let imageId = "#featuredImage-" + category + "-0";
    let $currentActive = $("#landingImageCycler img.active");
    let $currentTransition = $("#landingImageCycler img.transition");
    let $featuredImage = $(imageId);
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
        }
        else if ($currentActive.length > 0 && $currentTransition.length > 0) {
            $(".transition").removeClass("transition");
            $featuredImage.addClass("transition");
        }
    }

    let counter = 0;
    let counterDir = 1;
    imgCycleInterval = setInterval(function() {
        let numImages = ENTRIES_FEATURED[category].images.length;
        if (numImages === 1) {
            return;
        }
        let imageId = "#featuredImage-" + category + "-" + counter;
        let $currentActive = $("#landingImageCycler img.active");
        $currentActive.removeClass("active");
        let $featuredImage = $(imageId).addClass("active");
        if (counter >= numImages - 1) {
            counterDir = -1;
        }
        else if (counter <= 0) {
            counterDir = 1;
        }
        counter += counterDir;
    }, IMAGE_ANIM_MS);
}

function SetArticle(articleName)
{
    $("html, body").animate({ scrollTop: 0 }, 200);
    let article = ARTICLES[articleName];

    if (article.hasOwnProperty("video")) {
        $("#articleImage").hide();
        $("#articleVideo").show();
        try {
            player = new YT.Player("articleVideo", {
                height: "100%",
                width: "100%",
                videoId: article.video,
                playerVars: {
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    "onReady": function() {
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
    }
    else {
        $("#articleVideo").hide();
        $("#articleImage").show();
        $("#articleImage").css("background-image", "url(\"" + "../images/" + article.image + "\")");
    }
}

function HandleHash(hash, prevHash)
{
    let isCategory = hash === null || hash === "";
    let category = "nopasanada";
    if (!isCategory) {
        let hashIndex = hash.indexOf("#");
        if (hashIndex !== -1) {
            let hashCategory = hash.substring(hashIndex + 1, hash.length);
            if (ENTRIES_FEATURED.hasOwnProperty(hashCategory)) {
                isCategory = true;
                category = hashCategory;
            }
        }
    }

    if (player !== null) {
        player.destroy();
        player = null;
    }
    if (isCategory) {
        $("#article").hide();
        $("#screenLanding").show();
        $("#screenPosters").show();
        SetFeaturedContent(category, false);
    }
    else {
        let articleName = hash.substring(hash.indexOf("-") + 1, hash.length);
        $("#screenLanding").hide();
        $("#screenPosters").hide();
        $("#article").show();
        SetArticle(articleName);
    }
}

function OnResize() {
    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(document.documentElement.clientHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    $(".featuredImage").each(function(index) {
        let $this = $(this);
        if (aspect > IMAGE_ASPECT) {
            $this.width("100%");
            $this.height("auto");
        }
        else {
            $this.width("auto");
            $this.height("100%");
            let imageWidth = document.documentElement.clientHeight * IMAGE_ASPECT;
            let marginX = (imageWidth - document.documentElement.clientWidth) / 2;
            $this.css("margin-left", -marginX);
        }
    });

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

window.onscroll = function() {
    let scrollTopMax = Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight) - document.documentElement.clientHeight;
    let headerOpacity = document.documentElement.scrollTop / scrollTopMax;
    $("#header").css("background-color", "rgba(0%, 0%, 0%, " + headerOpacity * 100.0 + "%)");
};

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash === "") {
        hash = null;
    }
    if (hash !== prevHash) {
        let oldPrevHash = prevHash;
        prevHash = hash;
        HandleHash(hash, oldPrevHash);
    }
};

window.onload = function() {
    let totalImages = 0;
    for (let key in ENTRIES_FEATURED) {
        let imgClass = "featuredImage-" + key;
        for (let i = 0; i < ENTRIES_FEATURED[key].images.length; i++) {
            let imgId = imgClass + "-" + i;
            let imgPath = "images/" + ENTRIES_FEATURED[key].images[i];
            $("#landingImageCycler").append("<img id=\"" + imgId + "\" class=\"featuredImage " + imgClass + "\" src=\"" + imgPath + "\">");
            totalImages += 1;
        }
    }

    let loadedImages = 0;
    $(".featuredImage").on("load", function() {
        loadedImages += 1;
        if (loadedImages === totalImages) {
            allImagesLoaded = true;
            HandleHash(window.location.hash);
        }
    });

    OnResize();
    HandleHash(window.location.hash);

    $("#screenArticle").hide();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
