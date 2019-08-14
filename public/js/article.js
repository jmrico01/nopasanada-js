"use strict";

window.onload = function() {
    OnResize();
    $("#content").css("visibility", "visible");

    SetupHeader();
};

window.onresize = OnResize;