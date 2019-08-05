"use strict";

function PixelsToVW(pixels) {
    return 100.0 * pixels / document.documentElement.clientWidth;
}

function OnResize() {
    let $website = $("#website");
    let paddingTop = parseInt($website.css("padding-top"), 10);
    let paddingBottom = parseInt($website.css("padding-bottom"), 10);
    let headerHeight = $("#header").height();
    let clientHeight = document.documentElement.clientHeight;
    let contentHeight = clientHeight - paddingTop - paddingBottom - headerHeight - 5;
    let maxContentHeight = document.documentElement.clientWidth / 1.85;
    if (contentHeight >= maxContentHeight) {
        contentHeight = maxContentHeight;
    }
    $("#featuredContainer").height(contentHeight);
}

window.onload = function() {
    OnResize();

    let $header = $("#header");
    let $headerCategories = $("#headerCategories");
    let $headerSubcategories = $("#headerSubcategories");

    $("#headerLogo").mouseenter(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });
    $("#headerLogoImageRight").mouseenter(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });

    let subcategoriesWidth = $headerSubcategories.width();
    let subcategoriesOffsetX = parseInt($headerSubcategories.css("margin-left"), 10);

    $(".headerCategory").mouseenter(function(event) {
        let $target = $(event.target);
        let targetOffsetX = $target.offset().left - $headerCategories.offset().left;
        $headerSubcategories.css("margin-left", subcategoriesOffsetX + targetOffsetX);
        $headerSubcategories.width(subcategoriesWidth - targetOffsetX);
        $headerSubcategories.css("visibility", "visible");
    });

    $header.mouseleave(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });
};

window.onresize = OnResize;