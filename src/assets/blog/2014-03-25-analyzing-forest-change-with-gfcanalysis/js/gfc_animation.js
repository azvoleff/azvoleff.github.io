(function($) {
    $(document).ready(function() {
	
	$('#gfc_animation').scianimator({
	    'images': ['gfc_animation_imgs/gfc_animation1.png', 'gfc_animation_imgs/gfc_animation2.png', 'gfc_animation_imgs/gfc_animation3.png', 'gfc_animation_imgs/gfc_animation4.png', 'gfc_animation_imgs/gfc_animation5.png', 'gfc_animation_imgs/gfc_animation6.png', 'gfc_animation_imgs/gfc_animation7.png', 'gfc_animation_imgs/gfc_animation8.png', 'gfc_animation_imgs/gfc_animation9.png', 'gfc_animation_imgs/gfc_animation10.png', 'gfc_animation_imgs/gfc_animation11.png', 'gfc_animation_imgs/gfc_animation12.png', 'gfc_animation_imgs/gfc_animation13.png'],
	    'width': 900,
	    'delay': 1000,
	    'loopMode': 'loop'
	});
	$('#gfc_animation').scianimator('play');
    });
})(jQuery);
