"use strict";

// All pages that include this script must have the following functions defined:
//     function AspectChanged(isNarrow) {}
//     function OnResize() {}

let cssNarrow = null;
let isNarrow = null;

function OnResizeBase()
{
    const TRANSITION_ASPECT = 1.45;

    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(window.innerHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    let aspect = window.innerWidth / window.innerHeight;
    let narrow = aspect < TRANSITION_ASPECT;
    if (narrow !== isNarrow) {
        isNarrow = narrow;
        if (isNarrow) {
            cssNarrow.href = "css/main-narrow.css";
        }
        else {
            cssNarrow.href = "";
        }
        AspectChanged(isNarrow);
    }

    OnResize();
}

$(document).ready(function() {
    cssNarrow = document.createElement("link");
    cssNarrow.rel = "stylesheet";
    cssNarrow.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(cssNarrow);

    $(window).resize(OnResizeBase);
    OnResizeBase();
});