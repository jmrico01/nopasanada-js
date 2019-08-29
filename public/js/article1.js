"use strict";

const TRANSITION_ASPECT = 1.45;

let cssNarrow = null;

function OnResize() {
    let aspect = window.innerWidth / window.innerHeight;
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(window.innerHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    if (cssNarrow === null) {
        cssNarrow = document.createElement("link");
        cssNarrow.rel = "stylesheet";
        cssNarrow.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(cssNarrow);
    }
    if (aspect < TRANSITION_ASPECT) {
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

window.onload = function() {
    OnResize();
    $("#screenArticle").show();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
