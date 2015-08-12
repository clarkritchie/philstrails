Template.image.onRendered(function() {
    // animate the icon
    $(".large-image").removeClass('hidden').animate({
        left: '250px',
        opacity: '0.5',
        height: '300px',
        width: '300px'
    });
});
