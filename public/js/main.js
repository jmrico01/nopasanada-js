"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const IMAGE_ANIM_MS = 250;

const DEFAULT_CATEGORY = "ciencia";

const ENTRIES_FEATURED = {
    "noticias": {
        images: [
            "201909/headers/13-lo-importante.jpg"
        ],
        pretitle: "NOTICIAS:",
        title: "LO IMPORTANTE<br><b>13-09-19. *</b>",
        decoration: "",
        text1: "4 HISTORIAS IMPORTANTES DE LAS M&Aacute;S RECIENTES NOTICIAS INTERNACIONALES.",
        text2: "CURADAS POR<br>NO PASA NADA",
        link: "/content/201909/13-lo-importante",
        highlightcolor: "#ff613c"
    },
    "cultura": {
        images: [
            "201909/headers/maquillaje.jpg"
        ],
        pretitle: "EDITORIAL:",
        title: "MAQUILLAJE,<br><b>IDENTIDAD. *</b>",
        decoration: "",
        text1: "YA NO SE TRATA DE ALCANZAR LA PERFECCIÓN; NUESTRA RELACIÓN CON EL MAQUILLAJE SE HA TRANSFORMADO.",
        text2: "POR PAULINA JOARISTI",
        link: "/content/201909/11-maquillaje-es-identidad",
        highlightcolor: "#7fffcb"
    },
    "deporte": {
        images: [
            "201908/headers/moto1.jpg",
            "201908/headers/moto2.jpg",
            "201908/headers/moto3.jpg",
            "201908/headers/moto4.jpg"
        ],
        pretitle: "SERIE:",
        title: "PILOTOS <b>*</><br><b>EP 1.</b>",
        decoration: "",
        text1: "CONOCEMOS A UNA FAMILIA EN COSTA RICA QUE HA TRIUNFADO EN EL DEPORTE DE ENDURO POR M&Aacute;S DE 50 A&Ntilde;OS.",
        text2: "VER TRAILER",
        link: "/content/201908/pilotos-trailer",
        highlightcolor: "#ff613c"
    },
    "ciencia": {
        images: [
            "201909/headers/dormir.jpg"
        ],
        pretitle: "EDITORIAL:",
        title: "<b>DORMIR</b> NO<br>EST&Aacute; DE MODA.",
        decoration: "",
        text1: "LOS ESTRAGOS DE LA DEPRIVACI&Oacute;N DE SUE&Ntilde;O EN EL CUERPO",
        text2: "PRIMERA PARTE DE NUESTRO ESPECIAL SOBRE EL SUE&Ntilde;O.<br>POR DIANA GONZ&Aacute;LEZ",
        link: "/content/201909/14-dormir",
        highlightcolor: "#ff613c"
    },
    "opinion": {
        images: [
            "201908/headers/teletrabajo.jpg"
        ],
        pretitle: "OPINI&Oacute;N:",
        title: "LA <b>LEY</b> DEL <b>*</b><br>TELETRABAJO</b>",
        decoration: "",
        text1: "LA NUEVA LEY PARA REGULAR EL TELETRABAJO ES UN RESPIRO PARA EMPLEADOS, EMPRESAS - Y EL PAÍS.",
        text2: "POR ALICIA CASTRO",
        link: "/content/201908/teletrabajo",
        highlightcolor: "#ff613c"
    },
    "nopasanada": {
        images: [
            "201908/headers/garrotex1.jpg",
            "201908/headers/garrotex2.jpg"
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

let allEntries = null;

let entryTemplate = null;
let postersPerScreen = 5;
let posterPositionIndex = 0;

let prevHash = null;
let imgCycleInterval = null;
let allImagesLoaded = false;

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

function MovePosters(entries, indexDelta)
{
    let indexMax = Math.floor((entries.length - 1) / postersPerScreen);
    posterPositionIndex = Math.min(Math.max(posterPositionIndex + indexDelta, 0), indexMax);

    $("#contentList").css("margin-left", -posterPositionIndex * window.innerWidth);
    if (posterPositionIndex == 0) {
        $("#contentArrowLeftButton").hide();
    }
    else {
        $("#contentArrowLeftButton").show();
    }
    if (posterPositionIndex == indexMax) {
        $("#contentArrowRightButton").hide();
    }
    else {
        $("#contentArrowRightButton").show();
    }
}

function ResetPosters(entries)
{
    if (entryTemplate === null) {
        return;
    }

    let $contentList = $("#contentList");
    let width = Math.ceil(entries.length / postersPerScreen) * window.innerWidth;
    $contentList.css("width", width);
    $contentList.html("");

    $contentList.append("<div class=\"entrySpaceEdge\"></div>");
    for (let i = 0; i < entries.length; i++) {
        let entryData = entries[i];

        let $entry = $(entryTemplate);
        $entry.find("a").attr("href", entryData.link);
        $entry.find("img").attr("src", entryData.image);
        $entry.find(".entryNumber").html(i + 1 + ".");
        $entry.find(".entryText").html(entryData.title);
        $contentList.append($entry);

        if (i !== entries.length - 1) {
            if ((i + 1) % postersPerScreen === 0) {
                $contentList.append("<div class=\"entrySpaceEdge\"></div>");
                if (isNarrow) {
                    $contentList.append("<div style=\"width: 100%; height: 65vw;\"></div>");
                }
                $contentList.append("<div class=\"entrySpaceEdge\"></div>");
            }
            else {
                $contentList.append("<div class=\"entrySpace\"></div>");
            }
        }
    }

    posterPositionIndex = 0;
    MovePosters(entries, 0);
}

function HandleScroll()
{
    let headerOpacity = Math.min(document.documentElement.scrollTop / window.innerHeight, 1.0);
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

function AspectChanged(narrow)
{
    if (narrow) {
        cssNarrow.href = "css/main-narrow.css";
        postersPerScreen = 3;
        $("#contentList").css("width", "100%");
    }
    else {
        cssNarrow.href = "";
        postersPerScreen = 5;
    }

    if (allEntries !== null) {
        ResetPosters(allEntries);
    }
}

function OnResize()
{
    if (isNarrow) {
        $("#screenPosters").css("height", "auto");
    }

    let aspect = window.innerWidth / window.innerHeight;
    if (allImagesLoaded) {
        $(".featuredImage").each(function(index) {
            let $this = $(this);
            var img = new Image();
            img.onload = function() {
                let imageAspect = img.width / img.height;
                if (aspect > imageAspect) {
                    $this.width("100%");
                    $this.height("auto");
                }
                else {
                    $this.width("auto");
                    $this.height("100%");
                    let imageWidth = document.documentElement.clientHeight * imageAspect;
                    let marginX = (imageWidth - document.documentElement.clientWidth) / 2;
                    $this.css("margin-left", -marginX);
                }
            };
            img.src = $this.attr("src");
        });
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

$(document).ready(function() {
    entryTemplate = $("#entryTemplate").html();
    $("#entryTemplate").remove();

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
            OnResize();
            HandleHash(window.location.hash);
        }
    });

    $.post("/content", {}, function(data, status) {
        if (status !== "success") {
            console.error("Failed to load entries");
            return;
        }

        allEntries = data;
        ResetPosters(allEntries);
    });

    $("#contentArrowLeftButton").on("click", function() {
        MovePosters(allEntries, -1);
    })
    $("#contentArrowRightButton").on("click", function() {
        MovePosters(allEntries, 1);
    })

    OnResize();
    HandleScroll();
    HandleHash(window.location.hash);

    $("#content").css("visibility", "visible");
});
