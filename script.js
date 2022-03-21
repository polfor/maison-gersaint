$(window).on("load", function () {
    Webflow.validClick = function () {
        return true;
    };
});

$(".content.flex--vertical.project--padding").css("display", "none");

gsap.registerPlugin(ScrollToPlugin);

var projectsDisplayed = false;
var projects = [];
var currentProject = 0;
var slideDivHeight = undefined;

$("#maisonNav").click(function () {
    $("#maisonTitle").click();
});
$("#servicesNav").click(function () {
    $("#servicesTitle").click();
});
$("#studioNav").click(function () {
    $("#studioTitle").click();
});





$(".sommaire--title").click(function () {
    let parent = $(this).parent()[0];
    window.setTimeout(function () {
        parent.scrollIntoView();
    }, 100);
});

$(".hidden-link").each(function () {
    let project = {
        url: $(this).attr("href"),
        content: undefined,
        hiddenCredits: undefined,
        visibleCredits: undefined
    };
    projects.push(project);
});

$("#prevProject, #mobPrevProject").click(function () {
    if (currentProject != 0) {
        $("#hideProject").trigger("click");
        window.setTimeout(function () {
            $(".to-pull").remove();
            $("#hiddenCredits").remove();
            $("#visibleCredits").remove();
            displayProjects(currentProject - 1);
        }, 500);
    }
    checkDisabled();
});

$("#nextProject, #mobNextProject").click(function () {
    if (currentProject < projects.length - 2) {
        $("#hideProject").trigger("click");
        window.setTimeout(function () {
            $(".to-pull").remove();
            $("#hiddenCredits").remove();
            $("#visibleCredits").remove();
            displayProjects(currentProject + 1);
        }, 500);
    } else {
        if (currentProject < projects.length - 1) {
            $("#hideProject").trigger("click");
            window.setTimeout(function () {
                $(".to-pull").remove();
                $("#hiddenCredits").remove();
                $("#visibleCredits").remove();
                displayProjects(0);
            }, 500);
        }
    }
    checkDisabled();
});

slider1();

$(".splide__arrow--inslide.splide__arrow--prev").click(function () {
    $(".splide__arrow.splide__arrow--prev").click();
});

$(".splide__arrow--inslide.splide__arrow--next").click(function () {
    $(".splide__arrow.splide__arrow--next").click();
});

if ($(window).width() > 991) {
    $(".projects__list--title").hover(
        function () {
            $(this).siblings().find(".hover-image").addClass("is--focus");
        },
        function () {
            $(".hover-image.is--focus").removeClass("is--focus");
        }
    );
}

$(".projects__list-item").each(function () {
    $(this).click(function () {
        let projectIndex = $(this).index();
        if ($(window).width() < 992) {
            $(this).find(".hover-image").addClass("is--focus");
            $(this).find(".projects__list--title").css("z-index", "40");

            window.setTimeout(() => {
                $(".hover-image.is--focus").removeClass("is--focus");
                window.setTimeout(() => {
                    $(".content.flex--vertical.project--padding").css("display", "flex"); // a animer
                    $(this).find(".projects__list--title").css("z-index", "1");
                }, 200);
            }, 1000);
        }
        if (projectsDisplayed) {
            let wrapper = document.querySelector("#projectContent");
            let content = document.querySelector(".to-pull");
            let hiddenCredits = document.querySelector("#hiddenCredits");
            let visibleCredits = document.querySelector("#visibleCredits");

            let removedChecker = new MutationObserver(function (mutationsList) {
                mutationsList.forEach(function () {
                    if (
                        !$.contains(wrapper, content) &&
                        !$.contains(wrapper, hiddenCredits) &&
                        !$.contains(wrapper, visibleCredits)
                    ) {
                        displayProjects(projectIndex);
                        removedChecker.disconnect();
                    }
                });
            });
            removedChecker.observe(wrapper, { subtree: true, childList: true });

            $(content).remove();
            $(hiddenCredits).remove();
            $(visibleCredits).remove();
        } else {
            displayProjects(projectIndex);
        }
    });
});

function displayProjects(projectNo) {
    projectsDisplayed = true;

    if (projects[projectNo].content === undefined) {
        loadProject(projectNo, true);
    } else {
        $("#ajaxTarget").append(projects[projectNo].content);
        $("#hiddenTarget").append(projects[projectNo].hiddenCredits);
        $("#visibleTarget").append(projects[projectNo].visibleCredits);
    }

    currentProject = projectNo;

    if (
        projects[projectNo + 1] === undefined &&
        projects[0].content === undefined
    ) {
        loadProject(0, false);
    } else {
        if (projects[projectNo + 1].content === undefined) {
            loadProject(projectNo + 1, false);
        }
    }

    if (
        projects[projectNo - 1] === undefined &&
        projects[projects.length - 1].content === undefined
    ) {
        loadProject(projects.length - 1, false);
    } else {
        if (
            projects[projectNo - 1] !== undefined &&
            projects[projectNo - 1].content === undefined
        ) {
            loadProject(projectNo - 1, false);
        }
    }
}

function loadProject(projectNo, toDisplay) {
    $.ajax({
        url: projects[projectNo].url,
        success: function (response) {
            hidden = $(response).find("#hiddenCredits");
            visible = $(response).find("#visibleCredits");

            visible.children().each(function () {
                $(this).html($(this).html().replace("-&gt;", "&rarr;"));
                $(this).html($(this).html().replace("- &gt;", "&rarr;"));
            });

            hidden.children().each(function () {
                $(this).html($(this).html().replace("-&gt;", "&rarr;"));
                $(this).html($(this).html().replace("- &gt;", "&rarr;"));
            });

            projects[projectNo].content = $(response).find(".to-pull");
            projects[projectNo].hiddenCredits = hidden;
            projects[projectNo].visibleCredits = visible;

            if (toDisplay) {
                $("#ajaxTarget").append(projects[projectNo].content);
                $("#hiddenTarget").append(projects[projectNo].hiddenCredits);
                $("#visibleTarget").append(projects[projectNo].visibleCredits);
            }
        },
        complete: function () {
            if (toDisplay) {
                $(".content.flex--vertical.project--padding").css("display", "flex");
            }
        }
    });
}

function slider1() {
    let splides = $(".slider1");
    for (let i = 0, splideLength = splides.length; i < splideLength; i++) {
        let createdSplide = new Splide(splides[i], {
            // Desktop on down
            perPage: 1,
            perMove: 1,
            focus: 0, // 0 = left and 'center' = center
            type: "slide", // 'loop' or 'slide'
            gap: "5em", // space between slides
            arrows: "slider", // 'slider' or false
            pagination: "slider", // 'slider' or false
            speed: 600, // transition speed in miliseconds
            dragAngleThreshold: 30, // default is 30
            autoWidth: false, // for cards with differing widths
            rewind: false, // go back to beginning when reach end
            rewindSpeed: 400,
            waitForTransition: false,
            updateOnMove: false,
            trimSpace: false, // true removes empty space from end of list
            breakpoints: {
                991: {},
                767: {
                    // Mobile Landscape
                },
                479: {
                    // Mobile Portrait
                }
            }
        });

        createdSplide.mount();

        $(".splide__arrow--inslide.splide__arrow--prev").css(
            "pointer-events",
            "none"
        );

        createdSplide.on("arrows:updated", function (prev, next) {
            if (prev.disabled) {
                $(".splide__arrow--inslide.splide__arrow--prev").css(
                    "pointer-events",
                    "none"
                );
                if ($(window).width() <= 991) {
                    $(".splide__arrow--inslide.splide__arrow--prev").removeClass(
                        "enabled--prev"
                    );
                }
            } else {
                $(".splide__arrow--inslide.splide__arrow--prev").css(
                    "pointer-events",
                    "auto"
                );
                if ($(window).width() <= 991) {
                    $(".splide__arrow--inslide.splide__arrow--prev").addClass(
                        "enabled--prev"
                    );
                }
            }

            if (next.disabled) {
                $(".splide__arrow--inslide.splide__arrow--next").css(
                    "pointer-events",
                    "none"
                );
                if ($(window).width() <= 991) {
                    $(".splide__arrow--inslide.splide__arrow--next").removeClass(
                        "enabled--next"
                    );
                }
            } else {
                $(".splide__arrow--inslide.splide__arrow--next").css(
                    "pointer-events",
                    "auto"
                );
                if ($(window).width() <= 991) {
                    $(".splide__arrow--inslide.splide__arrow--next").addClass(
                        "enabled--next"
                    );
                }
            }
        });
        createdSplide.on("move", function (destIndex) {
            slideDivHeight = $($(".splide__slide").get(destIndex))
                .children()
                .first()
                .height();
            $(".splide").height(slideDivHeight);
            $(".splide").closest(".container")[0].scrollIntoView();
        });
    }
}
const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
        if (slideDivHeight === undefined) {
            $(".splide").height(entry.contentRect.height);
        } else {
            $(".splide").height(slideDivHeight);
        }
    }
});
resizeObserver.observe(document.getElementById("firstSlideDiv"));

$(".p-index").each(function () {
    let index = $(this).parent().parent().index();
    console.log(index);
    if (index + 1 >= 10) {
        if (index + 1 >= 100) {
            $(this).text(`0${index + 1}`);
        } else {
            $(this).text(`00${index + 1}`);
        }
    } else {
        $(this).text(`000${index + 1}`);
    }
});

function checkDisabled() {
    if (currentProject == 0) {
        $("#prevProject").prop("disabled", true);
        $("#mobPrevProject").prop("disabled", true);
    } else {
        $("#prevProject").prop("disabled", false);
        $("#mobPrevProject").prop("disabled", false);
    }
    if (projects.length - 1 <= currentProject) {
        $("#nextProject").prop("disabled", true);
        $("#mobNextProject").prop("disabled", true);
    } else {
        $("#nextProject").prop("disabled", false);
        $("#mobNextProject").prop("disabled", false);
    }
}
