"use strict";

function OnResize() {
    let headerHeight = $("#header").height();
    $(".screen").css("padding-top", headerHeight);
    $(".screen").css("padding-bottom", headerHeight);
}

window.onload = function() {
    OnResize();
    $("#content").css("visibility", "visible");

    SetupHeader();
};

window.onresize = OnResize;