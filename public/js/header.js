function SetupHeader()
{
    let $header = $("#header");
    let $headerCategories = $("#headerCategories");
    let $headerSubcategories = $("#headerSubcategories");

    $("#headerLogo").mouseenter(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });
    $("#headerLogoImageRight").mouseenter(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });

    $(".headerCategory").mouseenter(function(event) {
        let $target = $(event.target);
        let targetOffsetX = $target.offset().left - $headerCategories.offset().left;
        let baseOffsetX = parseInt($headerCategories.css("margin-left"), 10);
        let baseWidth = $headerCategories.width();
        $headerSubcategories.css("margin-left", baseOffsetX + targetOffsetX);
        $headerSubcategories.width(baseWidth - targetOffsetX);
        $headerSubcategories.css("visibility", "visible");
    });

    $header.mouseleave(function(event) {
        $headerSubcategories.css("visibility", "hidden");
    });
}