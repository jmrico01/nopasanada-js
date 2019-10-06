let imageRowTemplate_ = null;

function UpdateImageList(images)
{
    let $imageList = $("#imagesList");
    $imageList.html("");

    for (let i = 0; i < images.length; i++) {
        let $imageRow = $(imageRowTemplate_);
        $imageRow.find(".rowImage img").attr("src", "http://localhost:6060" + images[i].uri); // TODO url here oops
        $imageRow.find(".rowText h2").html(images[i].name);
        $imageList.append($imageRow);
    }
}

function GetEntryPath()
{
    let url = new URL(window.location.href);
    return url.searchParams.get("entry");
}

function OnContentTypeChanged()
{
    let selectedContentType = document.getElementById("contentType").value;

    $("*[class*=\"input-\"]").hide();
    $(".input-" + selectedContentType).show();
}

function LoadEntryData(entryData)
{
    let images = [];
    images.push({
        name: "header",
        uri: entryData.image
    });
    if (entryData.imagePoster) {
        images.push({
            name: "poster",
            uri: entryData.imagePoster
        });
    }
    for (let i = 0; i < entryData.featured.images.length; i++) {
        images.push({
            name: "featured" + (i + 1),
            uri: entryData.featured.images[i]
        });
    }
    for (let i = 0; i < 4; i++) {
        images.push({
            name: "header-desktop" + (i + 1),
            uri: entryData.imageDirectory + "/vertical" + (i + 1) + ".jpg"
        });
    }
    for (let i = 0; i < 4; i++) {
        images.push({
            name: "header-mobile" + (i + 1),
            uri: entryData.imageDirectory + "/square" + (i + 1) + ".jpg"
        });
    }

    let imagesDedup = [];
    for (let i = 0; i < images.length; i++) {
        let duplicate = false;
        for (let j = 0; j < imagesDedup.length; j++) {
            if (images[i].uri === imagesDedup[j].uri) {
                duplicate = true;
                break;
            }
        }
        if (!duplicate) {
            imagesDedup.push(images[i]);
        }
    }
    UpdateImageList(imagesDedup);

    document.getElementById("contentType").value = entryData.contentType;
    OnContentTypeChanged();

    document.getElementsByName("featuredPretitle")[0].value = entryData.featured.pretitle;
    document.getElementsByName("featuredTitle")[0].value = entryData.featured.title;
    document.getElementsByName("featuredText1")[0].value = entryData.featured.text1;
    document.getElementsByName("featuredText2")[0].value = entryData.featured.text2;

    document.getElementsByName("title")[0].value = entryData.title;
    let titlePoster = entryData.titlePoster;
    if (titlePoster === undefined) {
        titlePoster = "";
    }
    document.getElementsByName("titlePoster")[0].value = titlePoster;
    document.getElementsByName("description")[0].value = entryData.description;
    let dateString = entryData.day + "/" + entryData.month + "/" + entryData.year;
    document.getElementsByName("date")[0].value = dateString;
    document.getElementsByName("color")[0].value = entryData.color;

    document.getElementsByName("author")[0].value = entryData.author;
    document.getElementsByName("youtubeID")[0].value = entryData.id;

    document.getElementsByName("audioSource")[0].value = entryData.audioSource;
    document.getElementsByName("title1")[0].value = entryData.title1;
    document.getElementsByName("author1")[0].value = entryData.author1;
    document.getElementsByName("text1")[0].value = entryData.text1;
    document.getElementsByName("title2")[0].value = entryData.title2;
    document.getElementsByName("author2")[0].value = entryData.author2;
    document.getElementsByName("text2")[0].value = entryData.text2;
    document.getElementsByName("title3")[0].value = entryData.title3;
    document.getElementsByName("author3")[0].value = entryData.author3;
    document.getElementsByName("text3")[0].value = entryData.text3;
    document.getElementsByName("title4")[0].value = entryData.title4;
    document.getElementsByName("author4")[0].value = entryData.author4;
    document.getElementsByName("text4")[0].value = entryData.text4;
    document.getElementsByName("subtitle")[0].value = entryData.subtitle;
    document.getElementsByName("text")[0].value = entryData.text;
}

function SaveEntryData()
{
    let date = document.getElementsByName("date")[0].value; // TODO split into day/month/year
    let entryData = {
        contentType: document.getElementById("contentType").value,
        featured: {
            pretitle: document.getElementsByName("featuredPretitle")[0].value,
            title:    document.getElementsByName("featuredTitle")[0].value,
            text1:    document.getElementsByName("featuredText1")[0].value,
            text2:    document.getElementsByName("featuredText2")[0].value
        },
        title:       document.getElementsByName("title")[0].value,
        titlePoster: document.getElementsByName("titlePoster")[0].value,
        description: document.getElementsByName("description")[0].value,
        day:         "04",
        month:       "10",
        year:        "2019",
        author:      document.getElementsByName("author")[0].value,
        id:          document.getElementsByName("youtubeID")[0].value,
        audioSource: document.getElementsByName("audioSource")[0].value,
        title1:      document.getElementsByName("title1")[0].value,
        author1:     document.getElementsByName("author1")[0].value,
        text1:       document.getElementsByName("text1")[0].value,
        title2:      document.getElementsByName("title2")[0].value,
        author2:     document.getElementsByName("author2")[0].value,
        text2:       document.getElementsByName("text2")[0].value,
        title3:      document.getElementsByName("title3")[0].value,
        author3:     document.getElementsByName("author3")[0].value,
        text3:       document.getElementsByName("text3")[0].value,
        title4:      document.getElementsByName("title4")[0].value,
        author4:     document.getElementsByName("author4")[0].value,
        text4:       document.getElementsByName("text4")[0].value,
        subtitle:    document.getElementsByName("subtitle")[0].value,
        text:        document.getElementsByName("text")[0].value
    };

    $.ajax({
        type: "POST",
        url: GetEntryPath(),
        contentType: "application/json",
        dataType: "json",
        async: true,
        data: JSON.stringify(entryData),
        success: function(data) {
            console.log("sent entryData");
            console.log(entryData);
        },
        failure: function(error) {
            console.error(error);
        }
    });
}

$(document).ready(function() {
    imageRowTemplate_ = $("#imagesListRowTemplate").html();
    $("#imagesListRowTemplate").remove();

    let sizeAttr = $("input").attr("size");
    if (typeof(sizeAttr) !== typeof(undefined) && sizeAttr !== false) {
        $("input").attr("size", "100");
    }
    $(".taSmall").attr("cols", "100");
    $(".taSmall").attr("rows", "8");
    $(".taMedium").attr("cols", "100");
    $(".taMedium").attr("rows", "50");
    $(".taLarge").attr("cols", "100");
    $(".taLarge").attr("rows", "100");

    $.ajax({
        type: "GET",
        url: GetEntryPath(),
        contentType: "application/json",
        dataType: "json",
        async: true,
        data: "",
        success: function(data) {
            LoadEntryData(data);

            $("#contentType").change(function() {
                OnContentTypeChanged();
            });

            $("#saveButton").click(function() {
                SaveEntryData();
            });

            $("#rowAddButton").click(function() {
                document.getElementById("imagesListAddForm").submit();
            })
        },
        failure: function(error) {
            console.error(error);
        }
    });
});
