"use strict";

const FEATURED_IMAGE_FADE_MS = 400;
const ABOUT_TEXT_FADE_MS = 200;
const IMAGE_ANIM_MS = 250;

const DEFAULT_RED = "#ff301b";

const ENTRIES_FEATURED = {
    "noticias": {
        images: [
            "garrote1.jpg",
            "garrote2.jpg",
            "garrote3.jpg",
            "garrote4.jpg"
        ],
        pretitle: "PROXIMAMENTE:",
        title: "NOTICIAS<br>---<b>.</b>",
        decoration: "***",
        text1: "PROXIMAMENTE",
        text2: "NOPASANADA",
        link: "#noticias",
        highlightcolor: "#fe84ff"
    },
    "deporteymoto": {
        images: [
            "moto1.jpg",
            "moto2.jpg",
            "moto3.jpg",
            "moto4.jpg"
        ],
        pretitle: "SERIE:",
        title: "PILOTOS<br><b>EP 1.</b>",
        decoration: "***",
        text1: "CONOCEMOS A UNA FAMILIA EN COSTA RICA QUE HA TRIUNFADO EN EL DEPORTE DE ENDURO POR M&Aacute;S DE 50 A&Ntilde;OS.",
        text2: "VER TRAILER",
        link: "#content-trailerp",
        highlightcolor: "#ff613c"
    },
    "arteycultura": {
        images: [
            "enfoque1.jpg",
            "enfoque2.jpg",
            "enfoque3.jpg",
            "enfoque4.jpg"
        ],
        pretitle: "SERIE:",
        title: "ENFOQUE<br><b>EP 1.</b>",
        decoration: "***",
        text1: "CONOCEMOS LAS VIDAS E HISTORIAS DE CELEBRADOS Y NUEVOS ARTISTAS VIVIENDO Y TRABAJANDO EN LATINOAM&Eacute;RICA.",
        text2: "VER TRAILER",
        link: "#content-trailere",
        highlightcolor: "#7fffcb"
    },
    "moda": {
        images: [
            "guilasexual2.jpg"
        ],
        pretitle: "TEMA SEMANAL:",
        title: "LA MUJER,<br><b>D&Iacute;A 1.</b>",
        decoration: "",
        text1: "EL CASO DE DIET PRADA Y EL ABUSO SEXUAL EN EL MUNDO DE LA MODA.<br>POR PAULINA JOARISTI<br>#OPINI&Oacute;N",
        text2: "DESCUBRIENDO LAS RELACIONES DE PODER Y EL ACOSO EN EL FASHION<br><br>EL NEGOCIO TURBIO DETR&Aacute;S DE LA FAMA Y SUS FOT&Oacute;GRAFOS",
        link: "#content-articulo1",
        highlightcolor: "#ff3c45"
    },
    "nopasanada": {
        images: [
            "garrotex1.jpg",
            "garrotex2.jpg"
        ],
        pretitle: "ESTO ES:",
        title: "<b>NO</b> PASA<br>NADA<b>.</b>",
        decoration: "***",
        text1: "LA PLATAFORMA PREMIER DE CONTENIDO ORIGINAL, REPORTAJES Y NOTICIAS EN ESPA&Ntilde;OL PARA Y POR UNA NUEVA GENERACI&Oacute;N",
        text2: "VER VIDEO",
        link: "#content-video",
        highlightcolor: "#36fffd"
    }
};

const ARTICLES = {
    "trailerp": {
        video: "51aG1gGsULU",
        title: "Pilotos, Episodio 1<br>Trailer",
        subtitle: "",
        author: "",
        date: "",
        text: "<p><em>&ldquo;Familia&rdquo; o &ldquo;C&oacute;mo ganar en Enduro por m&aacute;s de 50 a&ntilde;os&rdquo; es el primer episodio de nuestra serie Pilotos.</em></p> <p><em>Aqu&iacute; conocemos a una familia en Costa Rica ha triunfado en el deporte de Enduro por m&aacute;s de 50 a&ntilde;os. Esta es su historia.</em></p> <p>Pilotos comienza el 23 de Agosto.</p>"
    },
    "trailere": {
        video: "g36TGvzIi5o",
        title: "Enfoque, Episodio 1<br>Trailer",
        subtitle: "",
        author: "",
        date: "",
        text: "<p><em>En Enfoque conocemos las vidas e historias de celebrados y nuevos artistas viviendo y trabajando en Latinoam&eacute;rica.</em></p>"
    },
    "articulo1": {
        image: "guilasexual1.jpg",
        title: "El caso <em>Diet Prada</em> y el abuso sexual en el mundo de la moda.",
        subtitle: "El negocio turbio detr&aacute;s de la fama<br>y sus fot&oacute;grafos",
        author: "POR: PAULINA JOARISTI",
        date: "AGOSTO 19",
        text: '<p>El acoso y las relaciones de poder en el mundo de la moda est&aacute;n lejos de ser un secreto, gracias en parte a la ola de denuncias que ha incentivado el movimiento #metoo. El caso Diet Prada deja estas conductas a&uacute;n m&aacute;s en evidencia: desde hace unos a&ntilde;os, la reconocida cuenta de instagram existe para exponer c&oacute;mo los famosos y dise&ntilde;adores se copian entre ellos, pero se volvi&oacute; viral cuando ayud&oacute; a un grupo significativo de mujeres a denunciar a sus acosadores.</p> <p>Queda demostrado adem&aacute;s que, aunque el abusador es culpable, la industria tambi&eacute;n lo es: las agencias de modelaje, los c&oacute;mplices que reciben alg&uacute;n tipo de ganancia monetaria, etc. La cultura del mundo de la moda no tiene l&iacute;mites establecidos ni oficinas de recursos humanos donde los modelos pueden acudir a pedir ayuda, y pone a los modelos en situaciones que atentan contra su dignidad y su cuerpo para poder alcanzar sus metas.</p> <p>Diet Prada, que se mantiene anónima por temas de seguridad, empezó por denunciar a <a href="https://people.com/style/kim-kardashian-photographer-marcus-hyde-accused-of-soliciting-nude-photos-from-model/">Marcus Hyde</a>, fotógrafo conocido por trabajar con Kim Kardashian y Ariana Grande. Según las tomas de pantalla que publicaron las víctimas, el hombre <a href="https://www.dazeddigital.com/fashion/article/45406/1/marcus-hyde-timur-emek-photogaphers-accused-sexual-misconduct-harassment-assault">ofrecía ayudarlas</a> con su carrera a cambio de fotos desnudas, con la excusa de que necesitaba ver sus cuerpos y determinar si merecía invertir su tiempo en ellas. Las que se negaban a cooperar eran insultadas por Hyde; las que proporcionaban las fotos eran invitadas a una sesión fotográfica donde eran manoseadas y presionadas a tener sexo.</p> <p>Lo curioso es que hay un proceso de <a href="https://www.usmagazine.com/celebrity-news/news/kim-kardashian-reacts-to-photographer-marcus-hyde-allegations/">encubrimiento</a> de las actuaciones del fotógrafo por parte de famosos. Se sabe por ejemplo, que la cuenta de Instagram de Marcus Hyde - la cuál contaba con más de un millón de seguidores - ha sido borrada, y que tanto Kim Kardashian como Ariana Grande han emitido comunicados indicando simpatizar con las víctimas y alabar la decisión de hablar públicamente sobre sus experiencias - aunque no sin detenerse a recalcar que, en lo personal, nunca fueron sujetas de acoso por parte del señor Hyde.</p> <p>Las revelaciones en torno a Hyde propiciaron que unos días después salieran nuevas acusaciones, pero esta vez en contra de Timur Emek. Emek era bien conocido por ser el fotógrafo de las modelos de Victoria Secret. Al igual que en el caso anterior, Emek se aprovechó de su posición para solicitar sexo a cambio de viajes, fama y posicionamiento en la industria del modelaje.</p> <p>Acá algunas de las imágenes que las víctimas hicieron públicas.</p> <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/p/B0OVdQHnfBu/" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:16px;"> <a href="https://www.instagram.com/p/B0OVdQHnfBu/" style=" background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"> <div style=" display: flex; flex-direction: row; align-items: center;"> <div style="background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 40px; margin-right: 14px; width: 40px;"></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 100px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 60px;"></div></div></div><div style="padding: 19% 0;"></div> <div style="display:block; height:50px; margin:0 auto 12px; width:50px;"><svg width="50px" height="50px" viewBox="0 0 60 60" version="1.1" xmlns="https://www.w3.org/2000/svg" xmlns:xlink="https://www.w3.org/1999/xlink"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-511.000000, -20.000000)" fill="#000000"><g><path d="M556.869,30.41 C554.814,30.41 553.148,32.076 553.148,34.131 C553.148,36.186 554.814,37.852 556.869,37.852 C558.924,37.852 560.59,36.186 560.59,34.131 C560.59,32.076 558.924,30.41 556.869,30.41 M541,60.657 C535.114,60.657 530.342,55.887 530.342,50 C530.342,44.114 535.114,39.342 541,39.342 C546.887,39.342 551.658,44.114 551.658,50 C551.658,55.887 546.887,60.657 541,60.657 M541,33.886 C532.1,33.886 524.886,41.1 524.886,50 C524.886,58.899 532.1,66.113 541,66.113 C549.9,66.113 557.115,58.899 557.115,50 C557.115,41.1 549.9,33.886 541,33.886 M565.378,62.101 C565.244,65.022 564.756,66.606 564.346,67.663 C563.803,69.06 563.154,70.057 562.106,71.106 C561.058,72.155 560.06,72.803 558.662,73.347 C557.607,73.757 556.021,74.244 553.102,74.378 C549.944,74.521 548.997,74.552 541,74.552 C533.003,74.552 532.056,74.521 528.898,74.378 C525.979,74.244 524.393,73.757 523.338,73.347 C521.94,72.803 520.942,72.155 519.894,71.106 C518.846,70.057 518.197,69.06 517.654,67.663 C517.244,66.606 516.755,65.022 516.623,62.101 C516.479,58.943 516.448,57.996 516.448,50 C516.448,42.003 516.479,41.056 516.623,37.899 C516.755,34.978 517.244,33.391 517.654,32.338 C518.197,30.938 518.846,29.942 519.894,28.894 C520.942,27.846 521.94,27.196 523.338,26.654 C524.393,26.244 525.979,25.756 528.898,25.623 C532.057,25.479 533.004,25.448 541,25.448 C548.997,25.448 549.943,25.479 553.102,25.623 C556.021,25.756 557.607,26.244 558.662,26.654 C560.06,27.196 561.058,27.846 562.106,28.894 C563.154,29.942 563.803,30.938 564.346,32.338 C564.756,33.391 565.244,34.978 565.378,37.899 C565.522,41.056 565.552,42.003 565.552,50 C565.552,57.996 565.522,58.943 565.378,62.101 M570.82,37.631 C570.674,34.438 570.167,32.258 569.425,30.349 C568.659,28.377 567.633,26.702 565.965,25.035 C564.297,23.368 562.623,22.342 560.652,21.575 C558.743,20.834 556.562,20.326 553.369,20.18 C550.169,20.033 549.148,20 541,20 C532.853,20 531.831,20.033 528.631,20.18 C525.438,20.326 523.257,20.834 521.349,21.575 C519.376,22.342 517.703,23.368 516.035,25.035 C514.368,26.702 513.342,28.377 512.574,30.349 C511.834,32.258 511.326,34.438 511.181,37.631 C511.035,40.831 511,41.851 511,50 C511,58.147 511.035,59.17 511.181,62.369 C511.326,65.562 511.834,67.743 512.574,69.651 C513.342,71.625 514.368,73.296 516.035,74.965 C517.703,76.634 519.376,77.658 521.349,78.425 C523.257,79.167 525.438,79.673 528.631,79.82 C531.831,79.965 532.853,80.001 541,80.001 C549.148,80.001 550.169,79.965 553.369,79.82 C556.562,79.673 558.743,79.167 560.652,78.425 C562.623,77.658 564.297,76.634 565.965,74.965 C567.633,73.296 568.659,71.625 569.425,69.651 C570.167,67.743 570.674,65.562 570.82,62.369 C570.966,59.17 571,58.147 571,50 C571,41.851 570.966,40.831 570.82,37.631"></path></g></g></g></svg></div><div style="padding-top: 8px;"> <div style=" color:#3897f0; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:550; line-height:18px;"> View this post on Instagram</div></div><div style="padding: 12.5% 0;"></div> <div style="display: flex; flex-direction: row; margin-bottom: 14px; align-items: center;"><div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(0px) translateY(7px);"></div> <div style="background-color: #F4F4F4; height: 12.5px; transform: rotate(-45deg) translateX(3px) translateY(1px); width: 12.5px; flex-grow: 0; margin-right: 14px; margin-left: 2px;"></div> <div style="background-color: #F4F4F4; border-radius: 50%; height: 12.5px; width: 12.5px; transform: translateX(9px) translateY(-18px);"></div></div><div style="margin-left: 8px;"> <div style=" background-color: #F4F4F4; border-radius: 50%; flex-grow: 0; height: 20px; width: 20px;"></div> <div style=" width: 0; height: 0; border-top: 2px solid transparent; border-left: 6px solid #f4f4f4; border-bottom: 2px solid transparent; transform: translateX(16px) translateY(-4px) rotate(30deg)"></div></div><div style="margin-left: auto;"> <div style=" width: 0px; border-top: 8px solid #F4F4F4; border-right: 8px solid transparent; transform: translateY(16px);"></div> <div style=" background-color: #F4F4F4; flex-grow: 0; height: 12px; width: 16px; transform: translateY(-4px);"></div> <div style=" width: 0; height: 0; border-top: 8px solid #F4F4F4; border-left: 8px solid transparent; transform: translateY(-4px) translateX(8px);"></div></div></div> <div style="display: flex; flex-direction: column; flex-grow: 1; justify-content: center; margin-bottom: 24px;"> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; margin-bottom: 6px; width: 224px;"></div> <div style=" background-color: #F4F4F4; border-radius: 4px; flex-grow: 0; height: 14px; width: 144px;"></div></div></a><p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/p/B0OVdQHnfBu/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none;" target="_blank">A post shared by Diet Prada ™ (@diet_prada)</a> on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2019-07-22T15:25:36+00:00">Jul 22, 2019 at 8:25am PDT</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script><p>En las fotos de arriba podemos observar como Hyde le dice a la modelo que sus photoshoots cuestan dos mil dólares, pero que si ella estuviera dispuesta a hacerlo desnuda lo haría de gratis.</p> <p>Los modelos hombres también pueden ser víctimas.</p> <p>El acoso sexual afecta tanto a la mujer como el hombre en cualquier industria, cultura o país, y el mundo de la moda no es excepción. Bruce Weber y Mario Testino, fotógrafos que en su momento fueron los más importantes de la reconocida revista Vogue, fueron también acusados por su comportamiento y reemplazados de forma definitiva, luego de que varios modelos - en este caso hombres -  los denunciaran por abusar sexualmente de ellos. Ambos negaron los cargos presentados alegando que los acusadores no pueden ser <a href="https://www.harpersbazaar.com/uk/fashion/fashion-news/a15156038/mario-testino-accused-of-sexual-assault-by-multiple-models/">tomados en serio</a>, pero la editora de Vogue, Anna Wintour, se mantuvo firme y dijo que aunque mantiene una relación de amistad con ambos profesionales, no puede ignorar acusaciones como estas.</p> <p>La revista The Cut hizo una serie de entrevistas a víctimas masculinas de acoso sexual que revelan que los hombres también enfrentan estigmas al hablar sobre el abuso; muchos llegan a cuestionarse los hechos al ser confrontados al respecto. ¿Por qué no se defendieron? es una pregunta común. ¿No pudieron haber simplemente golpeado a sus abusadores? Esto crea un ciclo de vergüenza y culpa que impide a las víctimas denunciar.</p> <p>Aunque empresas como Condé Nast han implementado nuevos <a href="https://www.vogue.com/article/anna-wintour-responds-mario-testino-bruce-weber-sexual-misconduct-allegations">códigos de conducta</a> después de haber entrevistado a modelos, estilistas, agencias, fotografos, maquillistas y encargados de sets, cambios significativos en la cultura aún deben suceder para que las víctimas puedan empoderarse y relatar sus experiencias. Imaginen los miles de casos como estos que no han salido a la luz por dinero, poder o influencia… de no ser por el movimiento #metoo, quizá no nos habríamos enterado de ninguno.</p>'
    },
    "video": {
        video: "TzxV2HgY35s",
        title: "No Pasa Nada:<br>El porqu&eacute;.",
        subtitle: "",
        author: "",
        date: "",
        text: "<p>La incertidumbre es una de nuestras respuestas m&aacute;s humanas. Aparece ante eventos inesperados, o momentos que quiebran nuestra rutina. Adem&aacute;s, la incertidumbre es tan cordial que no s&oacute;lo nos acompa&ntilde;a cuando no tenemos control e intentamos buscar orden, pero adem&aacute;s, cuando tenemos control y buscamos hacer algo diferente.</p> <p>La incertidumbre es ese sentimiento que nos abruma con impotencia, nos confunde, nos pesa como yugo de madera vieja en los hombros y nos quita el aire en ese espacio hueco entre nuestras costillas, arriba del estomago y debajo del coraz&otilde;n.</p> <p>La incertidumbre es miedo, es ansiedad, es emoci&oacute;n y felicidad. Es lo que sentimos al entender que vivimos nuestro primer amor, y que ese mismo se acab&oacute;. La incertidumbre es el no saber qu&eacute; va a pasar.</p> <p>Ante la incertidumbre siempre va a existir una respuesta. La respuesta nos encara con nuestra naturaleza, nos hace accionar sobre lo que somos. Ese momento de acci&oacute;n con el cual nos enfrentamos ante lo que se interpuso entre nosotros y lo incierto; nos analiza, nos juzga, nos hace lo que somos, y nos prepara para lo que vamos a ser.</p> <p>Lo que nos define no es no es la situaci&oacute;n que se interpone, ni el sentimiento previo a esta, ni tampoco sus consecuencias absolutas e incambiables. Lo que nos define s&oacute;lo existe en el hacer, porque en un mundo de constantes intangibles podemos s&oacute;lo decir que somos eso que realmente hacemos.</p> <p>Es entonces ese espacio, ese hueco entre nuestras costillas, arriba del estomago y debajo del coraz&oacute;n que se llena en grande de incertidumbre en el antes del hacer, que nace: &ldquo;No Pasa Nada.&rdquo;</p> <p>Es una voz que habla con amor y responsabilidad para decir:</p> <p><em>&ldquo;Anda amigo, tranquilo, no pasa nada.&rdquo;</em></p>"
    }
};

let IMAGE_ASPECT = 1920 / 960;

let prevHash = null;
let player = null;
let imgCycleInterval = null;
let allImagesLoaded = false;

function Shuffle(array)
{
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};

function SetFeaturedContent(category, instant)
{
    let entry = ENTRIES_FEATURED[category];
    $("#featuredPretitle").html(entry.pretitle);
    $("#featuredTitle a").html(entry.title);
    $("#featuredTitle a").attr("href", entry.link);
    $("#featuredDecoration").html(entry.decoration);
    $("#featuredText1").html(entry.text1);
    $("#featuredText2").html(entry.text2);
    $("#header a").unbind("mouseover");
    $("#header a").mouseover(function() {
        $(this).css("color", entry.highlightcolor)
    });

    if (!allImagesLoaded) {
        return;
    }

    if (imgCycleInterval !== null) {
        clearInterval(imgCycleInterval);
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
    imgCycleInterval = setInterval(function() {
        let numImages = ENTRIES_FEATURED[category].images.length;
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

function SetArticle(articleName)
{
    console.log("SetArticle: " + articleName);
    let article = ARTICLES[articleName];

    $("#articleTitle").html(article.title);
    if (article.author === "") {
        $("#articleSubtitle").css("display", "none");
        $("#articleSubtext").css("display", "none");
        $("#color1").hide();
        $("#color2").hide();
    }
    else {
        $("#color1").show();
        $("#color2").show();
        $("#articleSubtitle").css("display", "block");
        $("#articleSubtext").css("display", "block");
        $("#articleSubtitle").html(article.subtitle);
        $("#articleAuthor").html(article.author);
        $("#articleDate").html(article.date);
    }
    $("#articleText").html(article.text);

    if (article.hasOwnProperty("video")) {
        $("#articleImage").hide();
        $("#articleVideo").show();
        try {
            player = new YT.Player("articleVideo", {
                height: "100%",
                width: "100%",
                videoId: article.video,
                playerVars: {
                    modestbranding: 1,
                    rel: 0
                },
                events: {
                    "onReady": function() {
                    },
                    "onStateChange": function(event) {
                        let state = event.data;
                        if (state === YT.PlayerState.PAUSED) {
                        }
                        else if (state === YT.PlayerState.PLAYING) {
                        }
                        else if (state === YT.PlayerState.ENDED) {
                        }
                    }
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        $("#articleVideo").hide();
        $("#articleImage").show();
        $("#articleImage").css("background-image", "url(\"" + "../images/" + article.image + "\")");
    }

    OnResize();
}

function HandleScroll() {
    let scrollTopMax = Math.max(document.body.scrollHeight, document.body.offsetHeight,
        document.documentElement.clientHeight, document.documentElement.scrollHeight,
        document.documentElement.offsetHeight) - document.documentElement.clientHeight;
    let headerOpacity = document.documentElement.scrollTop / scrollTopMax;
    if (!$("#article").is(':visible')) {
        $("#header").css("background-color", "rgba(0%, 0%, 0%, " + headerOpacity * 100.0 + "%)");
    }
    else {
        $("#header").css("background-color", "rgba(100%, 100%, 100%, 100%)");
    }
}

function HandleHash(hash, prevHash)
{
    let isCategory = hash === null || hash === "";
    let category = "arteycultura";
    if (!isCategory) {
        let hashIndex = hash.indexOf("#");
        if (hashIndex !== -1) {
            let hashCategory = hash.substring(hashIndex + 1, hash.length);
            if (ENTRIES_FEATURED.hasOwnProperty(hashCategory)) {
                isCategory = true;
                category = hashCategory;
            }
        }
    }

    if (player !== null) {
        player.destroy();
        player = null;
    }
    if (isCategory) {
        $("#header a").unbind("mouseover mouseout");
        $("#header a").css("color", "");
        $("#header").css("color", "#fff");
        $("#header a").mouseout(function() {
            $(this).css("color", "#fff");
        });
        $("#article").hide();
        $("#screenLanding").show();
        $("#screenPosters").show();
        HandleScroll();
        SetFeaturedContent(category, false);
    }
    else {
        $("#header a").unbind("mouseover mouseout");
        $("#header a").css("color", "");
        $("#header").css("color", "#000");
        $("#header a").mouseover(function() {
            $(this).css("color", DEFAULT_RED)
        });
        $("#header a").mouseout(function() {
            $(this).css("color", "#000");
        });
        let articleName = hash.substring(hash.indexOf("-") + 1, hash.length);
        $("#screenLanding").hide();
        $("#screenPosters").hide();
        $("#article").show();
        HandleScroll();
        SetArticle(articleName);
    }
}

function OnResize() {
    let aspect = document.documentElement.clientWidth / document.documentElement.clientHeight;
    let headerHeight = $("#header").height();
    $(".screen").each(function(index) {
        let $this = $(this);
        $this.height(document.documentElement.clientHeight - headerHeight);
        $this.css("padding-top", headerHeight);
        $this.css("padding-bottom", 0);
    });

    $(".featuredImage").each(function(index) {
        let $this = $(this);
        if (aspect > IMAGE_ASPECT) {
            $this.width("100%");
            $this.height("auto");
        }
        else {
            $this.width("auto");
            $this.height("100%");
            let imageWidth = document.documentElement.clientHeight * IMAGE_ASPECT;
            let marginX = (imageWidth - document.documentElement.clientWidth) / 2;
            $this.css("margin-left", -marginX);
        }
    });

    if (aspect < 1.45) {
        $("#headerCategories").hide();
        $("#headerLogo").css("font-size", "5vw");
        $("#screenLanding").css("max-height", "78vh");
        $("#header").css("height", "18vh")
        $("#featuredText").hide();
        $(".entry").css("width", "25vw");
        $("#articleTitle").css("font-size", "24pt");
        $("#articleTitle").css("line-height", "24pt");
        $("#articleSubtitle").css("font-size", "20pt");
        $("#articleSubtitle").css("line-height", "20pt");
        $("#articleSubtext").css("font-size", "10pt");
        $("#articleText p").css("font-size", "14pt");
        $("#articleText p").css("line-height", "16pt");
        $("#screenPosters").css("height", "120vh");
        $(".entryText").css("font-size", "3vw");
        $(".entryText").css("line-height", "3vw");
        $(".entryText").css("margin-bottom", "15vw");
        $("#color1").css("display", "none");
        $("#color2").css("display", "none");
        $("")
    }
    else {
        $("#headerCategories").show();
        $("#headerLogo").css("font-size", "2.35vw");
        $("#screenLanding").css("max-height", "");
        $("#header").css("header", "7.9166666vw")
        $("#featuredText").show();
        $(".entry").css("width", "15.625vw");
        $("#articleTitle").css("font-size", "5.4vw");
        $("#articleTitle").css("line-height", "6.25vw");
        $("#articleSubtitle").css("font-size", "3.4vw");
        $("#articleSubtitle").css("line-height", "3.9vw");
        $("#articleSubtext").css("font-size", "1vw");
        $("#articleText p").css("font-size", "1.4vw");
        $("#articleText p").css("line-height", "2.2vw");
        $(".entryText").css("font-size", "0.95vw");
        $(".entryText").css("line-height", "1.6vw");
        $(".entryText").css("margin-bottom", "0");
        $("#color1").css("display", "block");
        $("#color2").css("display", "block");
    }
}

window.onscroll = HandleScroll;

window.onhashchange = function() {
    let hash = window.location.hash;
    if (hash === "") {
        hash = null;
    }
    if (hash !== prevHash) {
        $("html, body").animate({ scrollTop: 0 }, 200);
        let oldPrevHash = prevHash;
        prevHash = hash;
        HandleHash(hash, oldPrevHash);
    }
};

window.onload = function() {
    let totalImages = 0;
    for (let key in ENTRIES_FEATURED) {
        let imgClass = "featuredImage-" + key;
        for (let i = 0; i < ENTRIES_FEATURED[key].images.length; i++) {
            let imgId = imgClass + "-" + i;
            let imgPath = "images/" + ENTRIES_FEATURED[key].images[i];
            $("#landingImageCycler").append("<img id=\"" + imgId + "\" class=\"featuredImage " + imgClass + "\" src=\"" + imgPath + "\">");
            totalImages += 1;
        }
    }

    let loadedImages = 0;
    $(".featuredImage").hide();
    $(".featuredImage").on("load", function() {
        loadedImages += 1;
        if (loadedImages === totalImages) {
            allImagesLoaded = true;
            $(".featuredImage").show();
            HandleHash(window.location.hash);
        }
    });

    OnResize();
    HandleHash(window.location.hash);

    $("#screenArticle").hide();
    $("#content").css("visibility", "visible");
};

window.onresize = OnResize;
