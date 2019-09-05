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
}

window.onload = function() {
    OnResize();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
