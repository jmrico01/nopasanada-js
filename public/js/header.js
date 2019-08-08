function SetupHeader()
{
    let subcategoriesTemplate = $("#headerSubcategoriesTemplate").html();
    $("#headerSubcategoriesTemplate").remove();

    let $header = $("#header");
    let $headerCategories = $("#headerCategories");
    let $headerSubcategories = $(".headerSubcategories");
    $headerSubcategories.hide();

    $("#headerLogo").mouseenter(function(event) {
        $headerSubcategories.fadeOut(400);
    });

    $(".headerCategory").mouseenter(function(event) {
        let $target = $(event.target);
        let targetOffsetX = $target.offset().left - $headerCategories.offset().left;
        let baseOffsetX = parseInt($headerCategories.css("margin-left"), 10);
        let baseWidth = $headerCategories.width();
        $headerSubcategories.css("margin-left", baseOffsetX + targetOffsetX);
        $headerSubcategories.width(baseWidth - targetOffsetX);
        $headerSubcategories.fadeIn(400);
    });

    $header.mouseleave(function(event) {
        $headerSubcategories.fadeOut(400);
    });
}