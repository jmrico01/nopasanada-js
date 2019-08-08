const FADEIN_TIME_MS = 400;
const FADEOUT_TIME_MS = 200;

function SetupHeader()
{
    let $headerSubcategories = $(".headerSubcategories");
    $headerSubcategories.hide();

    $("#headerLogo").mouseenter(function(event) {
        $headerSubcategories.stop().fadeOut(FADEOUT_TIME_MS);
    });

    $(".headerCategory").mouseenter(function(event) {
        $headerSubcategories.stop().fadeOut(FADEOUT_TIME_MS);

        let $headerCategory = $(event.target);
        if ($headerCategory.is("a")) {
            $headerCategory = $headerCategory.parent();
        }
        let $headerCategories = $("#headerCategories");
        let targetOffsetX = $headerCategory.offset().left - $headerCategories.offset().left;
        let baseOffsetX = parseInt($headerCategories.css("margin-left"), 10);
        let baseWidth = $headerCategories.width();

        let categoryLink = $headerCategory.find("a").attr("href");
        let categoryName = categoryLink.substring(
            categoryLink.indexOf("#") + 1, categoryLink.length);

        let selector = "#subcategories-" + categoryName;
        let $subcategories = $(selector);
        $subcategories.css("margin-left", targetOffsetX);
        $subcategories.stop().fadeIn(FADEIN_TIME_MS);
    });

    $("#header").mouseleave(function(event) {
        $headerSubcategories.stop().fadeOut(FADEOUT_TIME_MS);
    });
}