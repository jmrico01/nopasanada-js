"use strict";

function OnResize() {
    let aspect = window.innerWidth / window.innerHeight;
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(window.innerHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    if (aspect < 1.45) {
        $("#headerCategories").hide();
        $("#headerLogo").css("font-size", "5vw");
        $("#header").css("height", "18vh");
        $("#articleContainer").css("padding-left", "5vw");
        $("#articleContainer").css("padding-right", "5vw");
        $("#articleTitle").css("font-size", "24pt");
        $("#articleTitle").css("line-height", "24pt");
        $("#articleSubtitle").css("font-size", "20pt");
        $("#articleSubtitle").css("line-height", "20pt");
        $("#articleSubtext").css("font-size", "10pt");
        $("#articleAuthor").css("width", "auto");
        $("#articleDate").css("float", "right");
        $("#articleText p").css("font-size", "14pt");
        $("#articleText p").css("line-height", "16pt");
    }
    else {
        $("#headerCategories").show();
        $("#headerLogo").css("font-size", "2.35vw");
        $("#header").css("header", "7.9166666vw");
        $("#articleContainer").css("padding-left", "23vw");
        $("#articleContainer").css("padding-right", "23vw");
        $("#articleTitle").css("font-size", "5.4vw");
        $("#articleTitle").css("line-height", "6.25vw");
        $("#articleSubtitle").css("font-size", "3.4vw");
        $("#articleSubtitle").css("line-height", "3.9vw");
        $("#articleSubtext").css("font-size", "1vw");
        $("#articleAuthor").css("width", "20.3vw");
        $("#articleDate").css("float", "left");
        $("#articleText p").css("font-size", "1.4vw");
        $("#articleText p").css("line-height", "2.2vw");
    }
}

window.onload = function() {
    OnResize();
    $("#screenArticle").show();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
