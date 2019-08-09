let playingVideo = false;

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

    let $header = $("#header");
    $header.css("left",   marginX);
    $header.css("right",  marginX);
    $header.css("top",    marginY);

    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(document.documentElement.clientHeight - marginY * 2.0);
    });
}
