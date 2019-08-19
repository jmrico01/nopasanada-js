"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const ABOUT_TEXT_FADE_MS = 200;

const ENTRIES_FEATURED = {
    "noticias": {
        image: "garrazo.png",
        pretitle: "ESTO ES:",
        title: "<b>NO</b> PASA<br>NADA<b>.</b>",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        canvasContext: null,
        canvasWidth: 0,
        canvasHeight: 0
    },
    "deporteymoto": {
        image: "garrazo.png",
        pretitle: "ESTO ES:",
        title: "<b>NO</b> PASA<br>TODO<b>.</b>",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        canvasContext: null,
        canvasWidth: 0,
        canvasHeight: 0
    },
    "arteycultura": {
        image: "garrazo.png",
        pretitle: "ESTO ES:",
        title: "<b>SI</b> PASA<br>TOME<b>.</b>",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        canvasContext: null,
        canvasWidth: 0,
        canvasHeight: 0
    },
    "moda": {
        image: "garrazo.png",
        pretitle: "ESTO ES:",
        title: "<b>NO</b> PASA<br>CHUPE<b>.</b>",
        text1: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        text2: "LOREM IPSUM DOLOR SIT AMET, CON<br>TETUR ADIPISCING ELIT, SED DO EIUS-<br>MOD TEMPOR INCIDIDUNT UT LABOR<br>DOLORE MAGNA ALIQUA",
        canvasContext: null,
        canvasWidth: 0,
        canvasHeight: 0
    }
};

let prevHash = null;
let warned = false;
let player = null;

// change these settings
let PATTERN_WIDTH   = 592;
let PATTERN_HEIGHT  = 577;
let PATTERN_ALPHA   = 15;
let PATTERN_PIXELS  = PATTERN_WIDTH * PATTERN_HEIGHT * 4;
let PATTERN_REFRESH_INTERVAL = 1;

let patternCanvas;
let patternCtx;
let patternData;
let frame = 0;

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
    $("#featuredTitle").html(entry.title);
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);

    /*
    let href = "#video";
    if (category !== "deportemoto") {
        href = "#" + category;
    }
    $("#featuredLink").attr("href", href);
    */

    let $currentActive = $("#landingImageCycler img.active");
    let $currentTransition = $("#landingImageCycler img.transition");
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
    let category = "noticias";
    let hashIndex = hash.indexOf("#");
    if (hashIndex !== -1) {
        let hashCategory = hash.substring(hashIndex + 1, hash.length);
        if (ENTRIES_FEATURED.hasOwnProperty(hashCategory)) {
            category = hashCategory;
        }
    }

    SetFeaturedContent(category, false);
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

// create a canvas which will be used as a pattern
function initGrain() {
    patternCanvas = document.createElement('canvas');
    patternCanvas.width = PATTERN_WIDTH;
    patternCanvas.height = PATTERN_HEIGHT;
    patternCtx = patternCanvas.getContext('2d');
    patternData = patternCtx.createImageData(PATTERN_WIDTH, PATTERN_HEIGHT);
}

// put a random shade of gray into every pixel of the pattern
function update() {
    var value;

    for (var i = 0; i < PATTERN_PIXELS; i += 4) {
        value = (Math.random() * 255) | 0;

        patternData.data[i    ] = value;
        patternData.data[i + 1] = value;
        patternData.data[i + 2] = value;
        patternData.data[i + 3] = PATTERN_ALPHA;
    }

    patternCtx.putImageData(patternData, 0, 0);
}

// fill the canvas using the pattern
function draw() {
    let entry = ENTRIES_FEATURED["noticias"];
    let context = entry.canvasContext;
    entry.canvasContext.clearRect(0, 0, entry.canvasWidth, entry.canvasHeight);

    entry.canvasContext.fillStyle = entry.canvasContext.createPattern(patternCanvas, "repeat");
    entry.canvasContext.fillRect(0, 0, entry.canvasWidth, entry.canvasHeight);
}

function loop() {
    if (++frame % PATTERN_REFRESH_INTERVAL === 0) {
        update();
        draw();
    }

    requestAnimationFrame(loop);
}

window.onload = function() {
    for (let key in ENTRIES_FEATURED) {
        let imgId = "featuredImage-" + key;
        let imgPath = "images/" + ENTRIES_FEATURED[key].image;
        $("#landingImageCycler").append("<canvas id=\"" + imgId + "\">");
        let $canvas = $("#" + imgId);
        $canvas.width("100%");
        $canvas.height("100%");
        $canvas.css("background-image", "url(\"" + imgPath + "\")");
        $canvas.css("background-repeat", "no-repeat");
        $canvas.css("background-size", "cover");

        ENTRIES_FEATURED[key].canvasContext = $canvas[0].getContext("2d");
        ENTRIES_FEATURED[key].canvasWidth = $canvas[0].clientWidth;
        ENTRIES_FEATURED[key].canvasHeight = $canvas[0].clientHeight;
        //ENTRIES_FEATURED[key].canvasContext.scale(patternScaleX, patternScaleY);
    }
    initGrain();
    requestAnimationFrame(loop);
    HandleHash(window.location.hash);
    OnResize();

    $("#screenArticle").hide();
    $("#content").css("visibility", "visible");

/*
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
*/
};

window.onresize = OnResize;
