let imageRowTemplate_ = null;
let images_ = null;

let entryMedia_ = null;

function UpdateImageList(images)
{
    $.ajax({
        type: "GET",
        url: "/previewSite",
        contentType: "application/json",
        dataType: "json",
        async: true,
        data: "",
        success: function(data) {
            let previewUrl = data.url;
            let $imageList = $("#imagesList");
            $imageList.html("");

            for (let i = 0; i < images.length; i++) {
                let $imageRow = $(imageRowTemplate_);
                $imageRow.find(".rowImage img").attr("src", previewUrl + images[i].uri);
                $imageRow.find(".rowText h2").html(images[i].name);
                $imageList.append($imageRow);
            }

            images_ = images;
        },
        error: function(error) {
            console.error("UpdateImageList failed");
            console.error(error);
        }
    });
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
    if (entryData.imageDirectory) {
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
    document.getElementsByName("highlightColor")[0].value = entryData.featured.highlightColor;

    entryMedia_ = entryData.media;

    document.getElementsByName("tags")[0].value = entryData.tags.join(", ");

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
    document.getElementsByName("youtubeID")[0].value = entryData.videoID;

    document.getElementsByName("customTop")[0].value = entryData.customTop;
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

function GetImageByName(name, images)
{
    for (let i = 0; i < images.length; i++) {
        if (images[i].name === name) {
            return images[i];
        }
    }

    return null;
}

function SaveEntryData()
{
    let date = document.getElementsByName("date")[0].value;
    let dateSplit = date.split("/");
    for (let i = 0; i < dateSplit.length; i++) {
        dateSplit[i] = dateSplit[i].trim();
    }
    let dateError = null;
    if (dateSplit.length !== 3) {
        dateError = "expected 2 slashes";
    }
    if (dateSplit[0].length !== 2) {
        dateError = "bad day format";
    }
    if (dateSplit[1].length !== 2) {
        dateError = "bad month format";
    }
    let monthInt = parseInt(dateSplit[1]);
    if (monthInt <= 0 || monthInt > 12) {
        dateError = "month not 1 through 12";
    }
    if (dateSplit[2].length !== 4) {
        dateError = "bad year format";
    }
    if (dateError !== null) {
        alert("Incorrect date \"" + date + "\", should be dd/mm/yyyy (" + dateError + ")");
        return;
    }

    let tags = document.getElementsByName("tags")[0].value.split(",");
    for (let i = 0; i < tags.length; i++) {
        tags[i] = tags[i].trim();
    }

    let entryData = {
        contentType: document.getElementById("contentType").value,
        featured: {
            pretitle:       document.getElementsByName("featuredPretitle")[0].value,
            title:          document.getElementsByName("featuredTitle")[0].value,
            text1:          document.getElementsByName("featuredText1")[0].value,
            text2:          document.getElementsByName("featuredText2")[0].value,
            highlightColor: document.getElementsByName("highlightColor")[0].value
        },

        media:       entryMedia_,

        tags:        tags,

        title:       document.getElementsByName("title")[0].value,
        titlePoster: document.getElementsByName("titlePoster")[0].value,
        description: document.getElementsByName("description")[0].value,
        day:         dateSplit[0],
        month:       dateSplit[1],
        year:        dateSplit[2],
        color:       document.getElementsByName("color")[0].value,

        author:      document.getElementsByName("author")[0].value,
        videoID:     document.getElementsByName("youtubeID")[0].value,
        customTop:   document.getElementsByName("customTop")[0].value,
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

    let images = images_;
    let imageHeader = GetImageByName("header", images);
    if (imageHeader === null) {
        alert("Missing header image");
        return;
    }
    entryData.featured.images = [ imageHeader.uri ];
    entryData.image = imageHeader.uri;

    let imagePoster = GetImageByName("poster", images);
    if (imagePoster !== null) {
        entryData.imagePoster = imagePoster.uri;
    }

    let anyPresent = false;
    let allPresent = true;
    let imagesDesktop = [];
    let imagesMobile = [];
    for (let i = 0; i < 4; i++) {
        let imageDesktop = GetImageByName("header-desktop" + (i + 1), images);
        let imageMobile = GetImageByName("header-mobile" + (i + 1), images);
        if (imageDesktop !== null || imageMobile !== null) {
            anyPresent = true;
        }
        if (imageDesktop === null || imageMobile === null) {
            allPresent = false;
        }
        imagesDesktop.push(imageDesktop);
        imagesMobile.push(imageMobile);
    }
    if (anyPresent && !allPresent) {
        alert("Missing some newsletter images");
        return;
    }
    if (!anyPresent && allPresent) {
        alert("Unexpected error with newsletter images");
        return;
    }

    if (anyPresent) {
        let uri0 = imagesDesktop[0].uri;
        let commonPath = uri0.substring(0, uri0.lastIndexOf("/"));
        for (let i = 0; i < 4; i++) {
            let uri = imagesDesktop[i].uri;
            if (commonPath !== uri.substring(0, uri.lastIndexOf("/"))) {
                alert("Upload path error with newsletter desktop images");
                return;
            }
            uri = imagesMobile[i].uri;
            if (commonPath !== uri.substring(0, uri.lastIndexOf("/"))) {
                alert("Upload path error with newsletter mobile images");
                return;
            }
        }
        entryData.imageDirectory = commonPath;
    }

    $("#statusMessage").html("Saving...");
    $.ajax({
        type: "POST",
        url: GetEntryPath(),
        contentType: "application/json",
        async: true,
        data: JSON.stringify(entryData),
        success: function(data) {
            $("#statusMessage").html("Entry save successful.");
        },
        error: function(error) {
            $("#statusMessage").html("Entry save failed, error: " + error);
        }
    });
}

// TODO(important) change local image URLs so that they are updated in entry data
// TODO(important) featured image url???
Dropzone.options.imageDropzone = {
    paramName: "imageFile",
    acceptedFiles: "image/jpeg",
    maxFiles: 1,
    dictDefaultMessage: "Click here to upload, or drag an image (JPG only)",
    init: function() {
        this.on("sending", function(file, xhr, formData) {
            formData.set("npnEntryPath", GetEntryPath());
            formData.set("npnLabel", file.npnLabel);
        });
        this.on("success", function(file, response) {
            let parser = new DOMParser();
            let xmlDoc = parser.parseFromString(response, "text/xml");
            let imageUri = xmlDoc.getElementsByTagName("uri")[0].textContent;
            console.log(imageUri);
            let image = GetImageByName(file.npnLabel, images_);
            if (image === null) {
                images_.push({
                    name: file.npnLabel,
                    url: imageUri
                });
            }
            else {
                image.uri = imageUri;
            }

            $("#statusMessage").html("Successfully uploaded " + file.name + " as " + file.npnLabel);
            this.removeFile(file);
        });
        this.on("complete", function(file) {
        });
    },
    accept: function(file, done) {
        if (file.type !== "image/jpeg") {
            done("Image format must be .jpg");
            return;
        }

        let modalHtml = "<h3>Image Type</h3><select id=\"imageType\" name=\"imageType\"><option disabled selected value>-- select image type --</option></option><option value=\"header\">Header</option><option value=\"poster\">Poster</option>";
        let contentType = document.getElementById("contentType").value;
        if (contentType === "newsletter") {
            for (let i = 0; i < 4; i++) {
                modalHtml += "<option value=\"header-desktop" + (i + 1) + "\">Newsletter Desktop Header, Article " + (i + 1) + "</option>";
            }
            for (let i = 0; i < 4; i++) {
                modalHtml += "<option value=\"header-mobile" + (i + 1) + "\">Newsletter Mobile Header, Article " + (i + 1) + "</option>";
            }
        }
        modalHtml += "</select>";
        $(".modal").show();
        $(".modal").click(function(event) {
            if (event.target === this) {
                $(".modal").hide();
                done("Cancelled");
            }
        });
        $(".modal-content").html(modalHtml);
        $("#imageType").change(function(event) {
            file.npnLabel = $("#imageType").val();
            $(".modal").hide();
            done();
        });
    }
};

$(document).ready(function() {
    $(".modal").hide();

    imageRowTemplate_ = $("#imagesListRowTemplate").html();
    $("#imagesListRowTemplate").remove();

    $(".taSmall").attr("rows", "8");
    $(".taMedium").attr("rows", "50");
    $(".taLarge").attr("rows", "100");

    $.ajax({
        type: "GET",
        url: "/previewSite",
        contentType: "application/json",
        dataType: "json",
        async: true,
        data: "",
        success: function(data) {
            let previewUrl = data.url;
            $("#previewLink").attr("href", previewUrl + GetEntryPath());
        },
        error: function(error) {
            console.error(error);
        }
    });

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

            $("#deleteButton").click(function() {
                let requestData = {
                    uri: GetEntryPath()
                };
                $.ajax({
                    type: "POST",
                    url: "/deleteEntry",
                    contentType: "application/json",
                    async: true,
                    data: JSON.stringify(requestData),
                    success: function(data) {
                        $("#statusMessage").html("Entry deleted successfully.");
                        window.location = '/';
                    },
                    error: function(error) {
                        console.error(error);
                        $("#statusMessage").html("Delete failed, error: " + error);
                    }
                });
            });
        },
        error: function(error) {
            console.error(error);
        }
    });
});
