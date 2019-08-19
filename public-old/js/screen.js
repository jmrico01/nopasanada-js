function OnResize() {
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        let thisHeight = $this.height();
        let topSpacing = headerHeight;
        let bottomSpacing = document.documentElement.clientHeight - thisHeight - topSpacing;
        $this.css("padding-top", topSpacing);
        $this.css("padding-bottom", bottomSpacing);
    })

    //$("#screen2").css("padding-top", 0);

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
