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

        let $subcategories = $(event.currentTarget).find(".headerSubcategories");
        $subcategories.stop().fadeIn(FADEIN_TIME_MS);
    });

    $("#header").mouseleave(function(event) {
        $headerSubcategories.stop().fadeOut(FADEOUT_TIME_MS);
    });
}