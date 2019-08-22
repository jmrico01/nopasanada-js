"use strict";

function OnResize() {
    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(document.documentElement.clientHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    if (aspect < 1.45) {
        $("#headerCategories").hide();
        $("#headerLogo").css("font-size", "5vw");
        $("#header").css("height", "18vh");
        $("#articleContainer").css("padding-left", "5vw");
        $("#articleContainer").css("padding-right", "5vw");
        $("#articleTitle").css("font-size", "24pt");
        $("#articleTitle").css("line-height", "24pt");
        $("#articleSubtitle").css("font-size", "20pt");
        $("#articleSubtitle").css("line-height", "20pt");
        $("#articleSubtext").css("font-size", "10pt");
        $("#articleText p").css("font-size", "14pt");
        $("#articleText p").css("line-height", "16pt");
    }
    else {
        $("#headerCategories").show();
        $("#headerLogo").css("font-size", "2.35vw");
        $("#header").css("header", "7.9166666vw");
        $("#articleContainer").css("padding-left", "23vw");
        $("#articleContainer").css("padding-right", "23vw");
        $("#articleTitle").css("font-size", "5.4vw");
        $("#articleTitle").css("line-height", "6.25vw");
        $("#articleSubtitle").css("font-size", "3.4vw");
        $("#articleSubtitle").css("line-height", "3.9vw");
        $("#articleSubtext").css("font-size", "1vw");
        $("#articleText p").css("font-size", "1.4vw");
        $("#articleText p").css("line-height", "2.2vw");
        $(".entryText").css("font-size", "0.95vw");
        $(".entryText").css("line-height", "1.6vw");
        $(".entryText").css("margin-bottom", "0");
        $("#color1").css("display", "block");
        $("#color2").css("display", "block");
    }
}

window.onload = function() {
    OnResize();

    $("#screenArticle").show();
    $("#content").css("visibility", "visible");

    try {
        let player = new YT.Player("articleVideo", {
            height: "100%",
            width: "100%",
            videoId: VIDEO_ID, // must be declared in the HTML
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
};

window.onresize = OnResize;
