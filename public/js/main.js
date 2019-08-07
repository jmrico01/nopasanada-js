"use strict";

let warned = false;

function OnResize() {
    let headerHeight = $("#header").height();
    $(".screen").css("padding-top", headerHeight);
    $(".screen").css("padding-bottom", headerHeight);

    $("#screen2").css("padding-top", 0);

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

    SetupHeader();
};

window.onresize = OnResize;