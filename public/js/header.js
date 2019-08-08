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

        let $target = $(event.target);
        let $headerCategories = $("#headerCategories");
        let targetOffsetX = $target.offset().left - $headerCategories.offset().left;
        let baseOffsetX = parseInt($headerCategories.css("margin-left"), 10);
        let baseWidth = $headerCategories.width();

        let categoryLink;
        if ($target.is("a")) {
            categoryLink = $target.attr("href");
        }
        else {
            categoryLink = $target.find("a").attr("href");
        }
        let categoryName = categoryLink.substring(
            categoryLink.indexOf("#") + 1, categoryLink.length);

        let selector = "#subcategories-" + categoryName;
        let $subcategories = $(selector).stop().fadeIn(FADEIN_TIME_MS);
    });

    $("#header").mouseleave(function(event) {
        $headerSubcategories.stop().fadeOut(FADEOUT_TIME_MS);
    });
}