"use strict";

const TRANSITION_ASPECT = 1.45;

let cssNarrow = null;

function OnResize() {
    let aspect = window.innerWidth / window.innerHeight;
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(window.innerHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    if (cssNarrow === null) {
        cssNarrow = document.createElement("link");
        cssNarrow.rel = "stylesheet";
        cssNarrow.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(cssNarrow);
    }
    if (aspect < TRANSITION_ASPECT) {
        cssNarrow.href = "../../../css/article-narrow.css";
    }
    else {
        cssNarrow.href = "";
    }
}

window.onload = function() {
    OnResize();

    $("#screenArticle").show();
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
