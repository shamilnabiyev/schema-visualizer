import $ from 'jquery';

// Toggle the side navigation
$("#sidebarToggle, #sidebarToggleTop").on('click', (e) => {
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
    if ($(".sidebar").hasClass("toggled")) {
        $('.sidebar .collapse').collapse('hide');
    }
});

// Close any open menu accordions when window is resized below 768px
$(window).resize(function () {
    if ($(window).width() < 768) {
        $('.sidebar .collapse').collapse('hide');
    }
});

// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
$('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', (e) => {
    if ($(window).width() > 768) {
        const e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    }
});

// Scroll to top button appear
$(document).on('scroll', () => {
    const scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
    } else {
        $('.scroll-to-top').fadeOut();
    }
});

// Smooth scrolling using jQuery easing
$(document).on('click', 'a.scroll-to-top', (e) => {
    const $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    e.preventDefault();
});

/**
 * Find a JSONEditor instance from it's container element or id
 * @param {string | Element} selector  A query selector id like '#myEditor'
 *                                     or a DOM element
 * @return {JSONEditor | null} Returns the created JSONEditor, or null otherwise.
 */
function findJSONEditor (selector) {
    const container = (typeof selector === 'string')
        ? document.querySelector(selector)
        : selector;

    return container && container.jsoneditor || null;
}

$('#json-doc-viz-btn').on('click', (evt) => {
    console.log(findJSONEditor('#json-doc-editor'));
});

$('.jsoneditor-validation-error-icon').trigger('click');