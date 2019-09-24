"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const IMAGE_ANIM_MS = 250;

const HOMEPAGE_CATEGORY = "noticias";
const CATEGORY_FEATURED_URIS = {
    "noticias"   : "/content/201909/24-lo-importante",
    "cultura"    : "/content/201909/23-quesopinto-gerardina",
    "deporte"    : "/content/201908/pilotos-trailer",
    "ciencia"    : "/content/201909/14-dormir",
    "opinion"    : "/content/201908/teletrabajo",
    "nopasanada" : "/content/201908/nopasanada"
};

let allEntries_ = null;
let featuredEntries_ = null;

let entryTemplate_ = null;
let postersPerScreen_ = 5;
let posterPositionIndex_ = 0;

let prevHash_ = null;
let imgCycleInterval_ = null;
let allImagesLoaded_ = false;

function SetFeaturedContent(featuredEntries, category, instant)
{
    if (featuredEntries === null) {
        return;
    }

    let entry = featuredEntries[category];
    $("#featuredPretitle").html(entry.pretitle);
    $("#featuredTitle a").html(entry.title);
    $("#featuredTitle a").attr("href", entry.link);
    $("#featuredDecoration").html(entry.decoration);
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);
    $("#header a").unbind("mouseover mouseout");
    $("#header a").mouseover(function() {
        $(this).css("color", entry.highlightcolor)
    });
    $("#header a").mouseout(function() {
        $(this).css("color", "#ffffff");
    });

    if (!allImagesLoaded_) {
        return;
    }

    if (imgCycleInterval_ !== null) {
        clearInterval(imgCycleInterval_);
        imgCycleInterval_ = null;
    }

    let imageClass = ".featuredImage-" + category;
    let imageId = "#featuredImage-" + category + "-0";
    let $currentActive = $("#landingImageCycler img.active");
    let $currentTransition = $("#landingImageCycler img.transition");
    let $featuredImage = $(imageId);
    if (instant) {
        $currentActive.removeClass("active");
        $currentTransition.removeClass("transition");
        $featuredImage.addClass("active");
    }
    else {
        if ($currentActive.length === 0 && $currentTransition.length === 0) {
            $featuredImage.addClass("active");
        }
        else if ($currentActive.length > 0 && $currentTransition.length === 0) {
            $featuredImage.addClass("transition");
            $currentActive.fadeOut(FEATURED_IMAGE_FADE_MS, function() {
                $currentActive.removeClass("active").show();
                $(".transition").addClass("active").removeClass("transition");
            });
        }
        else if ($currentActive.length === 0 && $currentTransition.length > 0) {
            // strange case, small timing issue, but this is JS so who knows
        }
        else if ($currentActive.length > 0 && $currentTransition.length > 0) {
            $(".transition").removeClass("transition");
            $featuredImage.addClass("transition");
        }
    }

    let counter = 0;
    let counterDir = 1;
    imgCycleInterval_ = setInterval(function() {
        let numImages = featuredEntries[category].images.length;
        if (numImages === 1) {
            return;
        }
        let imageId = "#featuredImage-" + category + "-" + counter;
        let $currentActive = $("#landingImageCycler img.active");
        $currentActive.removeClass("active");
        let $featuredImage = $(imageId).addClass("active");
        if (counter >= numImages - 1) {
            counterDir = -1;
        }
        else if (counter <= 0) {
            counterDir = 1;
        }
        counter += counterDir;
    }, IMAGE_ANIM_MS);
}

function MovePosters(entries, indexDelta)
{
    let indexMax = Math.floor((entries.length - 1) / postersPerScreen_);
    posterPositionIndex_ = Math.min(Math.max(posterPositionIndex_ + indexDelta, 0), indexMax);

    $("#contentList").css("margin-left", -posterPositionIndex_ * window.innerWidth);
    if (posterPositionIndex_ == 0) {
        $("#contentArrowLeftButton").hide();
    }
    else {
        $("#contentArrowLeftButton").show();
    }
    if (posterPositionIndex_ == indexMax) {
        $("#contentArrowRightButton").hide();
    }
    else {
        $("#contentArrowRightButton").show();
    }
}

function ResetPosters(entries)
{
    if (entryTemplate_ === null) {
        return;
    }

    let $contentList = $("#contentList");
    let width = Math.ceil(entries.length / postersPerScreen_) * window.innerWidth;
    $contentList.css("width", width);
    $contentList.html("");

    $contentList.append("<div class=\"entrySpaceEdge\"></div>");
    for (let i = 0; i < entries.length; i++) {
        let entryData = entries[i];

        let $entry = $(entryTemplate_);
        $entry.find("a").attr("href", entryData.link);
        $entry.find("img").attr("src", entryData.image);
        $entry.find(".entryNumber").html(i + 1 + ".");
        $entry.find(".entryText").html(entryData.title);
        $contentList.append($entry);

        if (i !== entries.length - 1) {
            if ((i + 1) % postersPerScreen_ === 0) {
                $contentList.append("<div class=\"entrySpaceEdge\"></div>");
                if (isNarrow) {
                    $contentList.append("<div style=\"width: 100%; height: 65vw;\"></div>");
                }
                $contentList.append("<div class=\"entrySpaceEdge\"></div>");
            }
            else {
                $contentList.append("<div class=\"entrySpace\"></div>");
            }
        }
    }

    posterPositionIndex_ = 0;
    MovePosters(entries, 0);
}

function HandleScroll()
{
    let headerOpacity = Math.min(document.documentElement.scrollTop / window.innerHeight, 1.0);
    $("#header").css("background-color", "rgba(0%, 0%, 0%, " + headerOpacity * 100.0 + "%)");
}

function HandleHash(featuredEntries, hash)
{
    let category = HOMEPAGE_CATEGORY;
    let hashIndex = hash.indexOf("#");
    if (hashIndex !== -1) {
        let hashCategory = hash.substring(hashIndex + 1, hash.length);
        if (CATEGORY_FEATURED_URIS.hasOwnProperty(hashCategory)) {
            category = hashCategory;
        }
    }

    SetFeaturedContent(featuredEntries, category, false);
}

function AspectChanged(narrow)
{
    if (narrow) {
        cssNarrow.href = "css/main-narrow.css";
        postersPerScreen_ = 3;
        $("#contentList").css("width", "100%");
    }
    else {
        cssNarrow.href = "";
        postersPerScreen_ = 5;
    }

    if (allEntries_ !== null) {
        ResetPosters(allEntries_);
    }
}

function OnResize()
{
    if (isNarrow) {
        $("#screenPosters").css("height", "auto");
    }

    let aspect = window.innerWidth / window.innerHeight;
    if (allImagesLoaded_) {
        $(".featuredImage").each(function(index) {
            let $this = $(this);
            var img = new Image();
            img.onload = function() {
                let imageAspect = img.width / img.height;
                if (aspect > imageAspect) {
                    $this.width("100%");
                    $this.height("auto");
                }
                else {
                    $this.width("auto");
                    $this.height("100%");
                    let imageWidth = document.documentElement.clientHeight * imageAspect;
                    let marginX = (imageWidth - document.documentElement.clientWidth) / 2;
                    $this.css("margin-left", -marginX);
                }
            };
            img.src = $this.attr("src");
        });
    }
}

window.onscroll = HandleScroll;

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash === "") {
        hash = null;
    }
    if (hash !== prevHash_) {
        $("html, body").animate({ scrollTop: 0 }, 200);
        let oldPrevHash = prevHash_;
        prevHash_ = hash;
        HandleHash(featuredEntries_, hash);
    }
};

$(document).ready(function() {
    entryTemplate_ = $("#entryTemplate").html();
    $("#entryTemplate").remove();

    $.post("/entries", {}, function(data, status) {
        if (status !== "success") {
            console.error("Failed to load entries");
            return;
        }

        allEntries_ = data;
        for (let i = 0; i < allEntries_.length; i++) {
            allEntries_[i].title = allEntries_[i].title.toUpperCase();
        }
        featuredEntries_ = {};
        for (let category in CATEGORY_FEATURED_URIS) {
            let uri = CATEGORY_FEATURED_URIS[category];
            let found = false;
            for (let i = 0; i < allEntries_.length; i++) {
                if (allEntries_[i].link === uri) {
                    featuredEntries_[category] = allEntries_[i].featuredInfo;
                    featuredEntries_[category].link = uri;
                    found = true;
                }
            }
            if (!found) {
                console.error("Failed to find entry " + uri + " for category " + category);
            }
        }

        ResetPosters(allEntries_);
        HandleHash(featuredEntries_, window.location.hash);

        let totalImages = 0;
        for (let key in featuredEntries_) {
            let imgClass = "featuredImage-" + key;
            for (let i = 0; i < featuredEntries_[key].images.length; i++) {
                let imgId = imgClass + "-" + i;
                let imgPath = featuredEntries_[key].images[i];
                $("#landingImageCycler").append("<img id=\"" + imgId + "\" class=\"featuredImage " + imgClass + "\" src=\"" + imgPath + "\">");
                totalImages += 1;
                console.log(imgPath);
            }
        }

        let loadedImages = 0;
        $(".featuredImage").hide();
        $(".featuredImage").on("load", function() {
            loadedImages += 1;
            console.log(loadedImages + " / " + totalImages + ": " + $(this).attr("src"));
            if (loadedImages === totalImages) {
                allImagesLoaded_ = true;
                $(".featuredImage").show();
                OnResize();
                HandleHash(featuredEntries_, window.location.hash);
            }
        });
    });

    $("#contentArrowLeftButton").on("click", function() {
        MovePosters(allEntries_, -1);
    })
    $("#contentArrowRightButton").on("click", function() {
        MovePosters(allEntries_, 1);
    })

    OnResize();
    HandleScroll();

    $("#content").css("visibility", "visible");
});
