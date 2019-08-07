"use strict";

let warned = false;

function PixelsToVW(pixels) {
    return 100.0 * pixels / document.documentElement.clientWidth;
}

function OnResize() {
    let headerHeight = $("#header").height();
    $(".screen").css("padding-top", headerHeight);
    $(".screen").css("padding-bottom", headerHeight);

    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    if (aspect < 1.45 && !warned) {
        warned = true;
        setTimeout(function() {
            alert("WARNING\n\n"
                + "You are viewing the website at a thin aspect ratio (less than 1.5).\n"
                + "Layout and spacing will be messed up until we explicitly design\n"
                + "for these taller formats (tall windows / mobile)");
        }, 0);
    }
}

window.onload = function() {
    OnResize();
    $("#content").css("visibility", "visible");

    let $header = $("#header");
    let $headerCategories = $("#headerCategories");
    let $headerSubcategories = $("#headerSubcategories");

    $("#headerLogo").mouseenter(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });
    $("#headerLogoImageRight").mouseenter(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });

    $(".headerCategory").mouseenter(function(event) {
        let $target = $(event.target);
        let targetOffsetX = $target.offset().left - $headerCategories.offset().left;
        let baseOffsetX = parseInt($headerCategories.css("margin-left"), 10);
        let baseWidth = $headerCategories.width();
        $headerSubcategories.css("margin-left", baseOffsetX + targetOffsetX);
        $headerSubcategories.width(baseWidth - targetOffsetX);
        $headerSubcategories.css("visibility", "visible");
    });

    $header.mouseleave(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });
};

window.onresize = OnResize;