"use strict";

const FADE_TIME_MS = 500;

let prevHash = null;
let player = null;

function OnResize() {
    //const TARGET_ASPECT = 16.0 / 9.0;
    const TARGET_ASPECT = 1.0;
    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    if (aspect < TARGET_ASPECT) {
        $("#introTitle").css("font-size", "15vw");
        $("#introTitle").css("letter-spacing", "-0.6vw");
        $("#introTitle").css("line-height", "12vw");
        $("#introSubtitle").css("font-size", "3vw");
        $(".cross").css("width", "12vw");
        $(".cross").css("height", "12vw");
    }
    else {
        $("#introTitle").css("font-size", "7.5vw");
        $("#introTitle").css("letter-spacing", "-0.3vw");
        $("#introTitle").css("line-height", "6vw");
        $("#introSubtitle").css("font-size", "1.5vw");
        $(".cross").css("width", "6vw");
        $(".cross").css("height", "6vw");
    }

    let marginX, marginY;
    let playingVideo = false;
    if (!playingVideo) {
        marginX = 0;
        marginY = 0;
    }
    else if (aspect > TARGET_ASPECT) {
        let targetWidth = document.documentElement.clientHeight * TARGET_ASPECT;
        let pillarWidth = (document.documentElement.clientWidth - targetWidth) / 2.0;
        marginX = pillarWidth;
        marginY = 0;
    }
    else {
        let targetHeight = document.documentElement.clientWidth / TARGET_ASPECT;
        let letterHeight = (document.documentElement.clientHeight - targetHeight) / 2.0;
        marginX = 0;
        marginY = letterHeight;
    }

    let $website = $("#website");
    $website.css("margin-left",   marginX);
    $website.css("margin-right",  marginX);
    $website.css("margin-top",    marginY);
    $website.css("margin-bottom", marginY);
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(document.documentElement.clientHeight - marginY * 2.0);
    });
}

function HandleHash(hash)
{
    if (hash === "#video") {
        player.playVideo();
        $("#video").fadeIn(FADE_TIME_MS, function() {
            $("#intro").hide();
        });
    }
    else {
        $("#intro").show();
        $("#video").fadeOut(FADE_TIME_MS, function() {
            player.stopVideo();
        });
    }
}

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash !== prevHash) {
        prevHash = hash;
        HandleHash(hash);
    }
};


window.onload = function() {
    OnResize();
    $("#video").hide();

    try {
        player = new YT.Player("video", {
            height: "100%",
            width: "100%",
            videoId: "TzxV2HgY35s",
            playerVars: {
                modestbranding: 1,
                rel: 0
            },
            events: {
                "onReady": function() {
                    HandleHash(window.location.hash);
                },
                "onStateChange": function(event) {
                    let state = event.data;
                    if (state === YT.PlayerState.PAUSED) {
                        $("#intro").fadeIn(FADE_TIME_MS);
                    }
                    else if (state === YT.PlayerState.PLAYING) {
                        $("#intro").fadeOut(FADE_TIME_MS);
                    }
                    else if (state === YT.PlayerState.ENDED) {
                        window.location.hash = "#";
                    }
                }
            }
        });
    }
    catch (e) {
        console.log(e);
    }

    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
