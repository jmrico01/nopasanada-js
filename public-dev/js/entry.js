function OnContentTypeChanged()
{
    let selectedContentType = document.getElementById("contentType").value;

    $("*[class*=\"input-\"]").hide();
    $(".input-" + selectedContentType).show();
}

function LoadEntryData(entryData)
{
    console.log(entryData);
    document.getElementById("contentType").value = entryData.contentType;
    OnContentTypeChanged();

    document.getElementsByName("featuredPretitle")[0].value = entryData.featured.pretitle;
    document.getElementsByName("featuredTitle")[0].value = entryData.featured.title;
    document.getElementsByName("featuredText1")[0].value = entryData.featured.text1;
    document.getElementsByName("featuredText2")[0].value = entryData.featured.text2;

    document.getElementsByName("title")[0].value = entryData.title;
    document.getElementsByName("titlePoster")[0].value = entryData.titlePoster;
    document.getElementsByName("description")[0].value = entryData.description;
    let dateString = entryData.day + "/" + entryData.month + "/" + entryData.year;
    document.getElementsByName("date")[0].value = dateString;
    document.getElementsByName("author")[0].value = entryData.author;
    document.getElementsByName("youtubeID")[0].value = entryData.id;
    document.getElementsByName("audioSource")[0].value = entryData.audioSource;
    document.getElementsByName("title1")[0].value = entryData.title1;
    document.getElementsByName("text1")[0].value = entryData.text1;
    document.getElementsByName("title2")[0].value = entryData.title2;
    document.getElementsByName("text2")[0].value = entryData.text2;
    document.getElementsByName("title3")[0].value = entryData.title3;
    document.getElementsByName("text3")[0].value = entryData.text3;
    document.getElementsByName("title4")[0].value = entryData.title4;
    document.getElementsByName("text4")[0].value = entryData.text4;
    document.getElementsByName("subtitle")[0].value = entryData.subtitle;
    document.getElementsByName("text")[0].value = entryData.text;
}

$(document).ready(function() {
    $("input").attr("size", "100");
    $(".taSmall").attr("cols", "100");
    $(".taSmall").attr("rows", "8");
    $(".taMedium").attr("cols", "100");
    $(".taMedium").attr("rows", "50");
    $(".taLarge").attr("cols", "100");
    $(".taLarge").attr("rows", "100");

    let url = new URL(window.location.href);
    let entryPath = url.searchParams.get("entry");

    $.post(entryPath, {}, function(data, status) {
        LoadEntryData(data);

        $("#contentType").change(function() {
            OnContentTypeChanged();
        });
    });
});
