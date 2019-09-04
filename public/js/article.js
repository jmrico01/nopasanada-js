"use strict";

function AspectChanged(narrow)
{
    if (narrow) {
        $("#headerDesktop").hide();
        $("#headerMobile").show();
    }
    else {
        $("#headerMobile").hide();
        $("#headerDesktop").show();
    }
}

window.onload = function() {
    OnResize();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
