(function () {
    "use strict";

    var carousels = document.querySelectorAll("[data-photo-carousel]");

    Array.prototype.forEach.call(carousels, function (carousel) {
        var slides = carousel.querySelectorAll("[data-photo-slide]");
        var facts = carousel.querySelectorAll("[data-photo-facts]");
        var thumbnails = carousel.querySelectorAll("[data-photo-thumbnail]");
        var previousButton = carousel.querySelector("[data-photo-previous]");
        var nextButton = carousel.querySelector("[data-photo-next]");
        var currentCounter = carousel.querySelector("[data-photo-current]");
        var activeIndex = 0;
        var pointerStartX = null;
        var suppressPhotoClick = false;

        if (!slides.length) {
            return;
        }

        carousel.classList.add("is-enhanced");

        if (slides.length === 1) {
            carousel.removeAttribute("tabindex");
        }

        function showPhoto(index, moveFocus) {
            activeIndex = (index + slides.length) % slides.length;

            Array.prototype.forEach.call(slides, function (slide, slideIndex) {
                var isActive = slideIndex === activeIndex;
                slide.classList.toggle("is-active", isActive);
                slide.hidden = !isActive;
            });

            Array.prototype.forEach.call(facts, function (panel, panelIndex) {
                var isActive = panelIndex === activeIndex;
                panel.classList.toggle("is-active", isActive);
                panel.hidden = !isActive;
            });

            Array.prototype.forEach.call(thumbnails, function (thumbnail, thumbnailIndex) {
                var isActive = thumbnailIndex === activeIndex;
                thumbnail.classList.toggle("is-active", isActive);

                if (isActive) {
                    thumbnail.setAttribute("aria-current", "true");

                    if (thumbnail.parentElement) {
                        thumbnail.parentElement.scrollTo({
                            left: thumbnail.offsetLeft - ((thumbnail.parentElement.clientWidth - thumbnail.offsetWidth) / 2),
                            behavior: "smooth"
                        });
                    }
                } else {
                    thumbnail.removeAttribute("aria-current");
                }
            });

            if (currentCounter) {
                currentCounter.textContent = activeIndex + 1;
            }

            if (moveFocus) {
                carousel.focus({ preventScroll: true });
            }
        }

        if (previousButton) {
            previousButton.addEventListener("click", function () {
                showPhoto(activeIndex - 1, false);
            });
        }

        if (nextButton) {
            nextButton.addEventListener("click", function () {
                showPhoto(activeIndex + 1, false);
            });
        }

        Array.prototype.forEach.call(thumbnails, function (thumbnail) {
            thumbnail.addEventListener("click", function () {
                showPhoto(parseInt(thumbnail.getAttribute("data-photo-thumbnail"), 10), false);
            });
        });

        carousel.addEventListener("keydown", function (event) {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                showPhoto(activeIndex - 1, true);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                showPhoto(activeIndex + 1, true);
            }
        });

        carousel.addEventListener("pointerdown", function (event) {
            pointerStartX = event.clientX;
        });

        carousel.addEventListener("pointerup", function (event) {
            var distance;

            if (pointerStartX === null) {
                return;
            }

            distance = event.clientX - pointerStartX;
            pointerStartX = null;

            if (Math.abs(distance) < 50) {
                return;
            }

            suppressPhotoClick = true;
            window.setTimeout(function () {
                suppressPhotoClick = false;
            }, 300);
            showPhoto(activeIndex + (distance < 0 ? 1 : -1), false);
        });

        carousel.addEventListener("pointercancel", function () {
            pointerStartX = null;
        });

        carousel.addEventListener("click", function (event) {
            if (suppressPhotoClick && event.target.closest("[data-photo-slide]")) {
                event.preventDefault();
                event.stopPropagation();
                suppressPhotoClick = false;
            }
        }, true);

        showPhoto(0, false);
    });
}());
