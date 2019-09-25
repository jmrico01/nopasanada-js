"use strict";

// All pages that include this script must have the following functions defined:
//     function AspectChanged(isNarrow) {}
//     function OnResize() {}

let cssNarrow_ = null;
let isNarrow_ = null;

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
    if (narrow !== isNarrow_) {
        isNarrow_ = narrow;
        AspectChanged(isNarrow_);
    }

    OnResize();
}

$(document).ready(function() {
    cssNarrow_ = document.createElement("link");
    cssNarrow_.rel = "stylesheet";
    cssNarrow_.type = "text/css";
    document.getElementsByTagName("head")[0].appendChild(cssNarrow_);

    $(window).resize(OnResizeBase);
    OnResizeBase();
});