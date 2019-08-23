"use strict";

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
    if (aspect < 1.45) {
        cssNarrow.href = "../../../css/article-narrow.css";
    }
    else {
        cssNarrow.href = "";
    }
}

window.onload = function() {
    OnResize();
    $("#screenArticle").show();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
