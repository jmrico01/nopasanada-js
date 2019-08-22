"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const IMAGE_ANIM_MS = 250;

const DEFAULT_RED = "#ff301b";

const DEFAULT_CATEGORY = "temamujer";

const ENTRIES_FEATURED = {
    "noticias": {
        images: [
            "garrote1.jpg",
            "garrote2.jpg",
            "garrote3.jpg",
            "garrote4.jpg"
        ],
        pretitle: "PROXIMAMENTE:",
        title: "NOTICIAS<br>---<b>.</b>",
        decoration: "***",
        text1: "PROXIMAMENTE",
        text2: "NOPASANADA",
        link: "#noticias",
        highlightcolor: "#fe84ff"
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
        text1: "CONOCEMOS A UNA FAMILIA EN COSTA RICA QUE HA TRIUNFADO EN EL DEPORTE DE ENDURO POR M&Aacute;S DE 50 A&Ntilde;OS.",
        text2: "VER TRAILER",
        link: "/content/201908/pilotos-trailer",
        highlightcolor: "#ff613c"
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
        text1: "CONOCEMOS LAS VIDAS E HISTORIAS DE CELEBRADOS Y NUEVOS ARTISTAS VIVIENDO Y TRABAJANDO EN LATINOAM&Eacute;RICA.",
        text2: "VER TRAILER",
        link: "/content/201908/enfoque-trailer",
        highlightcolor: "#7fffcb"
    },
    "temamujer": {
        images: [
            "copanoise.jpg"
        ],
        pretitle: "TEMA SEMANAL:",
        title: "LA MUJER,<br><b>D&Iacute;A 3.</b>",
        decoration: "",
        text1: "8 PREGUNTAS FRECUENTES SOBRE LA COPA MENSTRUAL RESPONDIDAS CON LA CIENCIA.<br>POR DIANA GONZ&Aacute;LEZ",
        text2: "NO M&Aacute;S INCERTIDUMBRE O DUDAS ACERCA DE LA COPA MENSTRUAL.<br>SI ESTABAS CONSIDERANDO COMPRARLA, ESTA INFO TE AYUDAR&Aacute; A DECIDIRTE.",
        link: "/content/201908/preguntas-frecuentes-sobre-la-copa-menstrual",
        highlightcolor: "#ff3c45"
    },
    "nopasanada": {
        images: [
            "garrotex1.jpg",
            "garrotex2.jpg"
        ],
        pretitle: "ESTO ES:",
        title: "<b>NO</b> PASA<br>NADA<b>.</b>",
        decoration: "***",
        text1: "LA PLATAFORMA PREMIER DE CONTENIDO ORIGINAL, REPORTAJES Y NOTICIAS EN ESPA&Ntilde;OL PARA Y POR UNA NUEVA GENERACI&Oacute;N",
        text2: "VER VIDEO",
        link: "/content/201908/nopasanada",
        highlightcolor: "#36fffd"
    }
};

let IMAGE_ASPECT = 1920 / 960;

let prevHash = null;
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
    $("#header a").unbind("mouseover mouseout");
    $("#header a").mouseover(function() {
        $(this).css("color", entry.highlightcolor)
    });
    $("#header a").mouseout(function() {
        $(this).css("color", "#ffffff");
    });

    if (!allImagesLoaded) {
        return;
    }

    if (imgCycleInterval !== null) {
        clearInterval(imgCycleInterval);
        imgCycleInterval = null;
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

function HandleScroll()
{
    let scrollTopMax = Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight) - document.documentElement.clientHeight;
    let headerOpacity = document.documentElement.scrollTop / scrollTopMax;
    $("#header").css("background-color", "rgba(0%, 0%, 0%, " + headerOpacity * 100.0 + "%)");
}

function HandleHash(hash, prevHash)
{
    let category = DEFAULT_CATEGORY;
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

    if (aspect < 1.45) {
        $("#headerCategories").hide();
        $("#headerLogo").css("font-size", "5vw");
        $("#screenLanding").css("max-height", "78vh");
        $("#header").css("height", "18vh")
        $("#featuredText").hide();
        $(".entry").css("width", "25vw");
        $("#screenPosters").css("min-height", "120vh");
        $(".entryText").css("font-size", "3vw");
        $(".entryText").css("line-height", "3vw");
        $(".entryText").css("margin-bottom", "15vw");
    }
    else {
        $("#headerCategories").show();
        $("#headerLogo").css("font-size", "2.35vw");
        $("#screenLanding").css("max-height", "");
        $("#header").css("header", "7.9166666vw")
        $("#featuredText").show();
        $(".entry").css("width", "15.625vw");
        $("#screenPosters").css("min-height", "");
        $(".entryText").css("font-size", "0.95vw");
        $(".entryText").css("line-height", "1.6vw");
        $(".entryText").css("margin-bottom", "0");
    }
}

window.onscroll = HandleScroll;

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash === "") {
        hash = null;
    }
    if (hash !== prevHash) {
        $("html, body").animate({ scrollTop: 0 }, 200);
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
    $(".featuredImage").hide();
    $(".featuredImage").on("load", function() {
        loadedImages += 1;
        if (loadedImages === totalImages) {
            allImagesLoaded = true;
            $(".featuredImage").show();
            HandleHash(window.location.hash);
        }
    });

    OnResize();
    HandleHash(window.location.hash);

    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
