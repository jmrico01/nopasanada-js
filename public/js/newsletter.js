"use strict";

function AspectChanged(narrow)
{
    if (narrow) {
        cssNarrow.href = "../../../css/article-narrow.css";
        $("#headerDesktop").hide();
        $("#headerMobile").show();
    }
    else {
        cssNarrow.href = "";
        $("#headerMobile").hide();
        $("#headerDesktop").show();
    }
}

function OnResize()
{
    // Called from resize.js
}

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash === "") {
        return;
    }

    let target = null;
    if (hash === "#1") {
        target = "#loc1";
    }
    else if (hash === "#2") {
        target = "#loc2";
    }
    else if (hash === "#3") {
        target = "#loc3";
    }
    else if (hash === "#4") {
        target = "#loc4";
    }

    if (target !== null) {
        $([document.documentElement, document.body]).animate({
            scrollTop: $(target).offset().top
        }, 500)
    }
    window.location.hash = "";
}

$(document).ready(function() {
    if ($(".articleAudio").attr("src") === "") {
        $(".articleAudio").remove();
    }
    $("#content").css("visibility", "visible");
});
