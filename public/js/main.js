"use strict";

const FADE_TIME_MS = 500;

let playingVideo = false;
let prevHash = null;
let player = null;

function OnResize() {
    const TARGET_ASPECT = 16.0 / 9.0;
    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    let marginX, marginY;
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

function ShowVideoOnly()
{
}

function ShowVideoAndIntroText()
{
}

function ShowIntroOnly()
{
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

    player = new YT.Player("video", {
        height: "100%",
        width: "100%",
        videoId: "yKUGwlFJAHw",
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

    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
