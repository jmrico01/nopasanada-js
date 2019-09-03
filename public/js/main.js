"use strict";

const TRANSITION_ASPECT = 1.45;

const FEATURED_IMAGE_FADE_MS = 400;
const IMAGE_ANIM_MS = 250;

const DEFAULT_RED = "#ff301b";

const DEFAULT_CATEGORY = "noticias";

const ENTRIES_FEATURED = {
    /*"home": {
        images: [
            "teletrabajo.jpg"
        ],
        pretitle: "LA LEY DEL",
        title: "TELE-<br>TRABAJO",
        decoration: "",
        text1: "UN RESPIRO PARA EMPLEADOS, EMPRESAS - Y EL PA&Iacute;S.<br>POR ALICIA CASTRO",
        text2: "",
        link: "/content/201908/teletrabajo",
        highlightcolor: "#44f6be"
    },*/
    "noticias": {
        images: [
            "newsletter0903.jpg"
        ],
        pretitle: "NO PASA NADA:",
        title: "NEWSLETTER<br><b>03-09-19. *</b>",
        decoration: "",
        text1: "4 HISTORIAS IMPORTANTES DE LAS M&Aacute;S RECIENTES NOTICIAS INTERACIONALES.",
        text2: "CURADAS POR<br>NO PASA NADA",
        link: "/content0/201909/newsletter-03",
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
    "temasemanal": {
        images: [
            "coral.jpg"
        ],
        pretitle: "TEMA SEMANAL, D&Iacute;A 1:",
        title: "EL MEDIO<br><b>AMBIENTE. *</b>",
        decoration: "",
        text1: "MITOS Y VERDADES SOBRE EL EFECTO DEL BLOQUEADOR SOLAR EN LOS CORALES.<br>POR DIANA GONZ&Aacute;LEZ",
        text2: "PROTEGER LA PIEL DEL SOL VS. PROTEGER A LOS CORALES, &iquest;DE VERDAD SON EXCLUYENTES?",
        link: "/content/201909/los-corales",
        highlightcolor: "#ff613c"
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

const ENTRIES_OTHER = [
    {
        link: "/content/201909/los-corales",
        image: "images/coral.jpg",
        text: "MITOS Y VERDADES SOBRE EL EFECTO DEL BLOQUEADOR SOLAR EN LOS CORALES"
    },
    {
        link: "/content/201908/teletrabajo",
        image: "images/teletrabajo.jpg",
        text: "LA NUEVA LEY PARA REGULAR EL TELETRABAJO ES UN RESPIRO PARA EMPLEADOS, EMPRESAS - Y EL PAÍS"
    },
    {
        link: "/content0/201908/el-amazonas",
        image: "images/amazonas.jpg",
        text: "INFORMACI&Oacute;N EXCLUSIVA DESDE AMAZON&Iacute;A"
    },
    {
        link: "/content/201908/fuimos-a-la-feria",
        image: "images/garlic.jpg",
        text: "FUIMOS A LA FERIA CON 5 ROJOS Y ESTO FUE LO QUE COMPRAMOS"
    },
    {
        link: "/content/201908/el-sindrome-de-burnout",
        image: "images/burnout.jpg",
        text: "EL S&Iacute;NDROME DE BURNOUT: LA CONDICI&Oacute;N IGNORADA QUE ACECHA LOS LUGARES DE TRABAJO"
    },
    {
        link: "/content/201908/moda-sostenible",
        image: "images/fashion.jpg",
        text: "LOS DISE&Ntilde;OS SOSTENIBLES DE ANDREA KADER: AIRE FRESCO EN UN MUNDO CADA VEZ M&Aacute;S CONTAMINADO"
    },
    {
        link: "/content/201908/jefas-de-hogar-como-ceos",
        image: "images/h1.jpg",
        text: "JEFAS DE HOGAR COMO CEOS: LOS DILEMAS QUE ENFRENTAN LAS MUJERES AL TRABAJAR"
    },
    {
        link: "/content/201908/preguntas-frecuentes-sobre-la-copa-menstrual",
        image: "images/copanoise.jpg",
        text: "8 PREGUNTAS FRECUENTES SOBRE LA COPA MENSUAL RESPONDIDAS CON LA CIENCIA"
    },
    {
        link: "/content/201908/la-cerveza-si-es-cosa-de-mujeres",
        image: "images/mujer2poster.jpeg",
        text: "ABAJO EL ESTEREOTIPO: LA CERVEZA S&Iacute; ES COSA DE MUJERES"
    },
    {
        link: "/content/201908/el-caso-diet-prada",
        image: "images/guilasexual1.jpg",
        text: "EL CASO DIET PRADA Y EL ABUSO SEXUAL EN EL MUNDO DE LA MODA"
    },
    /*{
        link: "/content/201908/pilotos-trailer",
        image: "images/poster-pilotos.png",
        text: "PILOTOS: EPISODIO 1<br>TRAILER"
    },*/
    /*{
        link: "/content/201908/nopasanada",
        image: "images/poster-nopasanada.png",
        text: "ESTO ES: NO PASA NADA"
    },*/ // only support 10 things at the moment
    /*{
        link: "/content/201908/enfoque-trailer",
        image: "images/poster-enfoque.png",
        text: "ENFOQUE: EPISODIO 1<br>TRAILER"
    }*/
];

let entryTemplate = null;
let postersPerScreen = 5;
let posterPositionIndex = 0;

let cssNarrow = null;

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

function OnResize() {
    let aspect = window.innerWidth / window.innerHeight;

    if (cssNarrow === null) {
        cssNarrow = document.createElement("link");
        cssNarrow.rel = "stylesheet";
        cssNarrow.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(cssNarrow);
    }
    if (aspect < TRANSITION_ASPECT) {
        cssNarrow.href = "css/main-narrow.css";
        postersPerScreen = ENTRIES_OTHER.length;
        $("#contentList").css("width", "100%");
    }
    else {
        cssNarrow.href = "";
        postersPerScreen = 5;
        $("#contentList").css("width", "1000%");
    }
    ResetPosters();

    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(window.innerHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

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

function MovePosters(right)
{
    if (right) {
        $("#contentList").css("margin-left", -window.innerWidth);
        $("#contentArrowLeftButton").show();
        $("#contentArrowRightButton").hide();
    }
    else {
        $("#contentList").css("margin-left", 0);
        $("#contentArrowLeftButton").hide();
        $("#contentArrowRightButton").show();
    }

}

function ResetPosters()
{
    let $contentList = $("#contentList");
    $contentList.html("");

    $contentList.append("<div class=\"entrySpaceEdge\"></div>");
    for (let i = 0; i < ENTRIES_OTHER.length; i++) {
        let entryData = ENTRIES_OTHER[i];

        let $entry = $(entryTemplate);
        $entry.find("a").attr("href", entryData.link);
        $entry.find("img").attr("src", entryData.image);
        $entry.find(".entryText").html(entryData.text);
        $contentList.append($entry);

        if (i !== ENTRIES_OTHER.length - 1) {
            if ((i + 1) % postersPerScreen === 0) {
                $contentList.append("<div class=\"entrySpaceEdge\"></div>");
                $contentList.append("<div class=\"entrySpaceEdge\"></div>");
            }
            else {
                $contentList.append("<div class=\"entrySpace\"></div>");
            }
        }
    }

    $("#contentArrowLeftButton").hide();
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
    entryTemplate = $("#entryTemplate").html();
    $("#entryTemplate").remove();
    ResetPosters();

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

    $("#contentArrowLeftButton").on("click", function() {
        MovePosters(false);
    })
    $("#contentArrowRightButton").on("click", function() {
        MovePosters(true);
    })

    OnResize();
    HandleScroll();
    HandleHash(window.location.hash);

    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
