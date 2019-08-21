"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const ABOUT_TEXT_FADE_MS = 200;
const IMAGE_ANIM_MS = 250;

let IMAGE_ASPECT = 1920 / 960;

let prevHash = null;
let player = null;
let imgCycleInterval = null;
let allImagesLoaded = false;

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

window.onload = function() {
    OnResize();
    $("#screenArticle").show();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
