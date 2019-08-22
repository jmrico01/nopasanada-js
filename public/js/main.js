"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const ABOUT_TEXT_FADE_MS = 200;
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
        link: "#content-trailerp",
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
        link: "#content-trailere",
        highlightcolor: "#7fffcb"
    },
    "temamujer": {
        images: [
            "copanoise.jpg"
        ],
        pretitle: "TEMA SEMANAL:",
        title: "LA MUJER,<br><b>D&Iacute;A 3.</b>",
        decoration: "",
        text1: "8 PREGUNTAS FRECUENTES SOBRE LA COPA MENSTRUAL RESPONDIDAS CON LA CIENCIA.<br>POR DIANA GONZALES",
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
        link: "#content-video",
        highlightcolor: "#36fffd"
    }
};

const ARTICLES = {
    "trailerp": {
        video: "51aG1gGsULU",
        title: "Pilotos, Episodio 1<br>Trailer",
        subtitle: "",
        author: "",
        date: "",
        text: "<p><em>&ldquo;Familia&rdquo; o &ldquo;C&oacute;mo ganar en Enduro por m&aacute;s de 50 a&ntilde;os&rdquo; es el primer episodio de nuestra serie Pilotos.</em></p> <p><em>Aqu&iacute; conocemos a una familia en Costa Rica ha triunfado en el deporte de Enduro por m&aacute;s de 50 a&ntilde;os. Esta es su historia.</em></p> <p>Pilotos comienza el 23 de Agosto.</p>"
    },
    "trailere": {
        video: "g36TGvzIi5o",
        title: "Enfoque, Episodio 1<br>Trailer",
        subtitle: "",
        author: "",
        date: "",
        text: "<p><em>En Enfoque conocemos las vidas e historias de celebrados y nuevos artistas viviendo y trabajando en Latinoam&eacute;rica.</em></p>"
    },
    "video": {
        video: "TzxV2HgY35s",
        title: "No Pasa Nada:<br>El porqu&eacute;.",
        subtitle: "",
        author: "",
        date: "",
        text: "<p>La incertidumbre es una de nuestras respuestas m&aacute;s humanas. Aparece ante eventos inesperados, o momentos que quiebran nuestra rutina. Adem&aacute;s, la incertidumbre es tan cordial que no s&oacute;lo nos acompa&ntilde;a cuando no tenemos control e intentamos buscar orden, pero adem&aacute;s, cuando tenemos control y buscamos hacer algo diferente.</p> <p>La incertidumbre es ese sentimiento que nos abruma con impotencia, nos confunde, nos pesa como yugo de madera vieja en los hombros y nos quita el aire en ese espacio hueco entre nuestras costillas, arriba del estomago y debajo del coraz&otilde;n.</p> <p>La incertidumbre es miedo, es ansiedad, es emoci&oacute;n y felicidad. Es lo que sentimos al entender que vivimos nuestro primer amor, y que ese mismo se acab&oacute;. La incertidumbre es el no saber qu&eacute; va a pasar.</p> <p>Ante la incertidumbre siempre va a existir una respuesta. La respuesta nos encara con nuestra naturaleza, nos hace accionar sobre lo que somos. Ese momento de acci&oacute;n con el cual nos enfrentamos ante lo que se interpuso entre nosotros y lo incierto; nos analiza, nos juzga, nos hace lo que somos, y nos prepara para lo que vamos a ser.</p> <p>Lo que nos define no es no es la situaci&oacute;n que se interpone, ni el sentimiento previo a esta, ni tampoco sus consecuencias absolutas e incambiables. Lo que nos define s&oacute;lo existe en el hacer, porque en un mundo de constantes intangibles podemos s&oacute;lo decir que somos eso que realmente hacemos.</p> <p>Es entonces ese espacio, ese hueco entre nuestras costillas, arriba del estomago y debajo del coraz&oacute;n que se llena en grande de incertidumbre en el antes del hacer, que nace: &ldquo;No Pasa Nada.&rdquo;</p> <p>Es una voz que habla con amor y responsabilidad para decir:</p> <p><em>&ldquo;Anda amigo, tranquilo, no pasa nada.&rdquo;</em></p>"
    }
};

let IMAGE_ASPECT = 1920 / 960;

let prevHash = null;
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
    $("#header a").unbind("mouseover");
    $("#header a").mouseover(function() {
        $(this).css("color", entry.highlightcolor)
    });

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
    console.log("SetArticle: " + articleName);
    let article = ARTICLES[articleName];

    $("#articleTitle").html(article.title);
    if (article.author === "") {
        $("#articleSubtitle").css("display", "none");
        $("#articleSubtext").css("display", "none");
        $("#color1").hide();
        $("#color2").hide();
    }
    else {
        $("#color1").show();
        $("#color2").show();
        $("#articleSubtitle").css("display", "block");
        $("#articleSubtext").css("display", "block");
        $("#articleSubtitle").html(article.subtitle);
        $("#articleAuthor").html(article.author);
        $("#articleDate").html(article.date);
    }
    $("#articleText").html(article.text);

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

    OnResize();
}

function HandleScroll() {
    let scrollTopMax = Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight) - document.documentElement.clientHeight;
    let headerOpacity = document.documentElement.scrollTop / scrollTopMax;
    if (!$("#article").is(':visible')) {
        $("#header").css("background-color", "rgba(0%, 0%, 0%, " + headerOpacity * 100.0 + "%)");
    }
    else {
        $("#header").css("background-color", "rgba(100%, 100%, 100%, 100%)");
    }
}

function HandleHash(hash, prevHash)
{
    let isCategory = hash === null || hash === "";
    let category = DEFAULT_CATEGORY;
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
        $("#header a").unbind("mouseover mouseout");
        $("#header a").css("color", "");
        $("#header").css("color", "#fff");
        $("#header a").mouseout(function() {
            $(this).css("color", "#fff");
        });
        $("#article").hide();
        $("#screenLanding").show();
        $("#screenPosters").show();
        HandleScroll();
        SetFeaturedContent(category, false);
    }
    else {
        $("#header a").unbind("mouseover mouseout");
        $("#header a").css("color", "");
        $("#header").css("color", "#000");
        $("#header a").mouseover(function() {
            $(this).css("color", DEFAULT_RED)
        });
        $("#header a").mouseout(function() {
            $(this).css("color", "#000");
        });
        let articleName = hash.substring(hash.indexOf("-") + 1, hash.length);
        $("#screenLanding").hide();
        $("#screenPosters").hide();
        $("#article").show();
        HandleScroll();
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

    if (aspect < 1.45) {
        $("#headerCategories").hide();
        $("#headerLogo").css("font-size", "5vw");
        $("#screenLanding").css("max-height", "78vh");
        $("#header").css("height", "18vh")
        $("#featuredText").hide();
        $(".entry").css("width", "25vw");
        $("#articleContainer").css("padding-left", "5vw");
        $("#articleContainer").css("padding-right", "5vw");
        $("#articleTitle").css("font-size", "24pt");
        $("#articleTitle").css("line-height", "24pt");
        $("#articleSubtitle").css("font-size", "20pt");
        $("#articleSubtitle").css("line-height", "20pt");
        $("#articleSubtext").css("font-size", "10pt");
        $("#articleText p").css("font-size", "14pt");
        $("#articleText p").css("line-height", "16pt");
        $("#screenPosters").css("height", "120vh");
        $(".entryText").css("font-size", "3vw");
        $(".entryText").css("line-height", "3vw");
        $(".entryText").css("margin-bottom", "15vw");
        $("#color1").css("display", "none");
        $("#color2").css("display", "none");
    }
    else {
        $("#headerCategories").show();
        $("#headerLogo").css("font-size", "2.35vw");
        $("#screenLanding").css("max-height", "");
        $("#header").css("header", "7.9166666vw")
        $("#featuredText").show();
        $(".entry").css("width", "15.625vw");
        $("#articleContainer").css("padding-left", "23vw");
        $("#articleContainer").css("padding-right", "23vw");
        $("#articleTitle").css("font-size", "5.4vw");
        $("#articleTitle").css("line-height", "6.25vw");
        $("#articleSubtitle").css("font-size", "3.4vw");
        $("#articleSubtitle").css("line-height", "3.9vw");
        $("#articleSubtext").css("font-size", "1vw");
        $("#articleText p").css("font-size", "1.4vw");
        $("#articleText p").css("line-height", "2.2vw");
        $(".entryText").css("font-size", "0.95vw");
        $(".entryText").css("line-height", "1.6vw");
        $(".entryText").css("margin-bottom", "0");
        $("#color1").css("display", "block");
        $("#color2").css("display", "block");
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

    $("#screenArticle").hide();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
