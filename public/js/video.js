"use strict";

function AspectChanged(narrow)
{
    if (narrow) {
        cssNarrow.href = "../../../css/article-narrow.css";
    }
    else {
        cssNarrow.href = "";
    }
}

function OnResize()
{
}

window.onload = function() {
    OnResize();
    $("#content").css("visibility", "visible");

    if (YOUTUBE_VIDEO_ID !== null) {
        try {
            let player = new YT.Player("articleVideo", {
                height: "100%",
                width: "100%",
                videoId: YOUTUBE_VIDEO_ID, // must be declared in the HTML
                playerVars: {
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    "onReady": function() {
                    },
                    "onStateChange": function(event) {
                        let state = event.data;
                        if (state === YT.PlayerState.PAUSED) {
                        }
                        else if (state === YT.PlayerState.PLAYING) {
                        }
                        else if (state === YT.PlayerState.ENDED) {
                        }
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
};

window.onresize = OnResize;
