/*
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";

var fullscreen_elem = document.documentElement,
	aurel_window = jQuery(window),
	aurel_header = jQuery('header.aurel_main_header'),
	aurel_footer = jQuery('footer.aurel_footer'),
	aurel_header_logo_part = jQuery('.aurel_header_logo_part'),
	aurel_header_menu_part = jQuery('.aurel_header_menu_part'),
	aurel_header_socials_part = jQuery('.aurel_header_socials_part'),
	aurel_nav = jQuery('.aurel_nav'),
	aurel_menu = jQuery('.aurel_menu'),
    aurel_dp = jQuery('.aurel_dp'),
    aurel_body = jQuery('body');

$(document).ready(function() { my_resize();});
window.addEventListener("resize",function(ev){
	my_resize();
});
window.addEventListener("scroll",function(ev){
	my_scroll();
});

function my_resize()
{
	//cover width should be 85% of parent inner cont width
	$(".cover").each(function(){
		var parent_cont = $(this).closest(".aurel_inner_cont");
		var parent_width = parent_cont.width();
		var cover_width = parent_width;
		$(this).width(cover_width);
		$(this).height(cover_width * 0.63);
	});
	
	$(".single_cover_width").each(function(){
		var width = $(this).width();
		$(this).height(width * 0.63);
	});

	if(window.innerHeight <= 500)
	{
		$(".home_quote").css("display", "none");
	}
	else
	{
		$(".home_quote").css("display", "block");
		$(".home_quote").css("padding-top", "0px");
		if(window.innerWidth <= 500)
		{
			$(".home_quote").css("padding-top", "30px");
		}
	}

	if(window.innerWidth <= 600)
	{
		$(".aurel_field_search").each(function(){
			$(this).attr("placeholder", "Search...");
		});
	}

	$(".camera_model_wrapper").each(function(){
		var parent_cont = $(this).closest(".aurel_inner_cont");
		var parent_width = parent_cont.width();

		$(this).removeClass("hide");
		
		if(parent_width < 400)
		{
			$(this).addClass("hide");
		}
	});
}

function my_scroll()
{
	if(document.documentElement.scrollTop < 40)
	{
		$(".airline_name").css("z-index", "999");
	}
	else
	{
		$(".airline_name").css("z-index", "1");
	}
}

// Photoswipe Lightbox
if (jQuery('.aurel_photoswipe_wrapper').length > 0) {
	var photoswipe_html = '\
	<!-- Root element of PhotoSwipe. Must have class pswp. -->\
	<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">\
		<div class="pswp__bg"></div><!-- PSWP Background -->\
		\
		<div class="pswp__scroll-wrap">\
			<div class="pswp__container">\
				<div class="pswp__item"></div>\
				<div class="pswp__item"></div>\
				<div class="pswp__item"></div>\
			</div><!-- .pswp__container -->\
			\
			<div class="pswp__ui pswp__ui--hidden">\
				<div class="pswp__top-bar">\
					<!--  Controls are self-explanatory. Order can be changed. -->\
					<div class="pswp__counter"></div>\
					\
					<button class="pswp__button pswp__button--close" title="Close (Esc)"></button>\
					<button class="pswp__button pswp__button--share" title="Share"></button>\
					<button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>\
					\
					<!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->\
					<!-- element will get class pswp__preloader--active when preloader is running -->\
					<div class="pswp__preloader">\
						<div class="pswp__preloader__icn">\
						  <div class="pswp__preloader__cut">\
							<div class="pswp__preloader__donut"></div>\
						  </div><!-- .pswp__preloader__cut -->\
						</div><!-- .pswp__preloader__icn -->\
					</div><!-- .pswp__preloader -->\
				</div><!-- .pswp__top-bar -->\
				\
				<div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\
					<div class="pswp__share-tooltip"></div>\
				</div><!-- .pswp__share-modal -->\
				\
				<button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>\
				<button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>\
				\
				<div class="pswp__caption">\
					<div class="pswp__caption__center"></div>\
				</div><!-- .pswp__caption -->\
			</div><!-- .pswp__ui pswp__ui--hidden -->\
		</div><!-- .pswp__scroll-wrap -->\
	</div><!-- .pswp -->\
	';

	jQuery('body').append(photoswipe_html);

	var $pswp = jQuery('.pswp')[0],
		$pswp_gallery_array = [];

	jQuery('.aurel_photoswipe_wrapper').each(function(){
		var this_id = jQuery(this).attr('data-uniqid').toLowerCase();
		$pswp_gallery_array['aurel_gallery_' + this_id] = {};
		$pswp_gallery_array['aurel_gallery_' + this_id].slides = [];
		jQuery(this).find('.aurel_pswp_slide').each(function(){
			if (jQuery(this).hasClass('aurel_pswp_video_slide')) {
				var aurel_thishref = jQuery(this).attr('href');
				if(aurel_thishref.indexOf('youtu') + 1) {
					//YT Video
					var videoid_split = aurel_thishref.split('='),
						videoid = videoid_split[1],
						aurel_pswp_html = '<div class="aurel_pswp_video_wrapper"><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + videoid + '?controls=1&autoplay=0&showinfo=0&modestbranding=1&wmode=opaque&rel=0&hd=1&disablekb=1" frameborder="0" allowfullscreen></iframe></div>';
				}
				if(aurel_thishref.indexOf('vimeo') + 1) {
					//Vimeo Video
					var videoid_split = aurel_thishref.split('m/'),
						videoid = videoid_split[1],
						aurel_pswp_html = '<div class="aurel_pswp_video_wrapper"><iframe width="100%" height="100%" src="https://player.vimeo.com/video/' + videoid + '?api=1&amp;title=0&amp;byline=0&amp;portrait=0&autoplay=0&loop=0&controls=1" frameborder="0" webkitAllowFullScreen allowFullScreen></iframe></div>';0
				}
				var this_item = {
					html : aurel_pswp_html
				}
				$pswp_gallery_array['aurel_gallery_' + this_id].slides.push(this_item);
			} else {
				var item_size = jQuery(this).data('size').split('x'),
					item_width = item_size[0],
					item_height = item_size[1],
					this_item = {
						src : jQuery(this).attr('href'),
						w : item_width,
						h : item_height
					};
					var id = 'aurel_gallery_' + this_id;
				$pswp_gallery_array[id.toLowerCase()].slides.push(this_item);
			}
		});
	});
}

jQuery(document).on('contextmenu', function (e) {
    if (jQuery('.aurel_drc_trigger').length) {
        e.preventDefault();
        if (jQuery('.aurel_drc_trigger').hasClass('aurel_drc_alert_enabled')) {
            alert(jQuery('.aurel_drc_trigger').attr('data-alert'));
        }
    }
});
jQuery(document).on('click', '.aurel_pswp_slide', function (event) {
	event.preventDefault();
	popup_my_gallery_image(jQuery(this).attr('data-count'),jQuery(this).parents('.aurel_photoswipe_wrapper').attr('data-uniqid'));
});

function popup_my_gallery_image(index, gallery_id)
{
	window.location.hash = 'pid=' + index;

	var $index = parseInt(index, 10);
	var this_id = gallery_id, options = {
		index: $index,
		bgOpacity: 0.7,
		showHideOpacity: true,
		galleryUID: gallery_id,
		history: false,
		closeElClasses: ['item', 'caption', 'zoom-wrap', 'ui', 'top-bar'],
		tapToClose:true
	};

	var id = 'aurel_gallery_' + this_id;
	// Initialize PhotoSwipe
	var aurel_lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, $pswp_gallery_array[id.toLowerCase()].slides, options);
	aurel_lightBox.init();
}

$(document).ready(function() { 
	// Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash();
    if(hashData.gid && hashData.pid) {
        popup_my_gallery_image( hashData.pid,  hashData.gid);
    }
});


 // parse picture index and gallery index from URL (#&pid=1&gid=2)
function photoswipeParseHash() {
    var hash = window.location.hash.substring(1);

    if(hash.includes("pid="))
    {
    	return {
    		pid: hash.split("pid=")[1],
    		gid:window.location.href.replace(window.location.hash,'').split("/").pop()
    	}
    }

    return {};
}

jQuery(document).on('click', '.grid-item-button-approve', function (event) {
	event.preventDefault();
	var item_container = jQuery(this).parents('.grid-item-proofing'),
		this_link = jQuery(this);
	if (item_container.hasClass('approved')) {
		// Already Approved
		item_container.removeClass('approved');
		item_container.addClass('unviewed');
		this_link.find('i').removeClass().addClass('fa fa-check-circle');
	} else {
		// Not Approved
		item_container.addClass('approved');
		item_container.removeClass('unviewed');
		this_link.find('i').removeClass().addClass('fa fa-minus-circle');
	}
	if (item_container.hasClass('unapproved')) {
		// Was Unapproved
		item_container.removeClass('unapproved');
		item_container.find('.grid-item-button-unapprove i').removeClass().addClass('fa fa-times-circle');
	}
});

jQuery(document).on('click', '.grid-item-button-unapprove', function (event) {
	event.preventDefault();
	var item_container = jQuery(this).parents('.grid-item-proofing'),
		this_link = jQuery(this);
	if (item_container.hasClass('unapproved')) {
		// Already Unapprved
		item_container.removeClass('unapproved');
		item_container.addClass('unviewed');
		this_link.find('i').removeClass().addClass('fa fa-times-circle');
	} else {
		// Not Unapproved
		item_container.addClass('unapproved');
		item_container.removeClass('unviewed');
		this_link.find('i').removeClass().addClass('fa fa-minus-circle');
	}
	if (item_container.hasClass('approved')) {
		// Was Approved
		item_container.removeClass('approved');
		item_container.find('.grid-item-button-approve i').removeClass().addClass('fa fa-check-circle');
	}
});

jQuery(document).on('click', '.aurel_photo_proofing_notified', function () {
	event.preventDefault();
	var this_button = jQuery(this),
		this_wrapper = this_button.parent('.aurel_photo_proofing_notified_wrapper'),
		this_message = this_wrapper.find('.aurel_photo_proofing_notified_message');
	this_button.slideUp(300);
	this_wrapper.addClass('aurel_already_notified');
});

// Contact Form
jQuery('#contact_form input[type=submit]').on('click', function () {
	var this_contact = jQuery(this).parents('form');
	
	jQuery.post('mail.php', {
		send_mail: 'true',
		form_name: this_contact.find('input[name=your_name]').val(),
		form_email: this_contact.find('input[name=your_email]').val(),
		form_text: this_contact.find('textarea[name=your_message]').val()
	}).done(function (data) {
		alert(data);
	});

	return false;
});

jQuery(document).ready(function () {
	if (jQuery('.fadeOnLoad').length) {
        if (jQuery('.aurel_preloader_wrapper').length) {

        } else {
            setTimeout("jQuery('.fadeOnLoad').removeClass('fadeOnLoad')",500);
        }
	}

	// Count Down
	if (jQuery('.aurel_element_countdown').length > 0) {
		jQuery('html').addClass('aurel_transparent_header');
		jQuery('time').countDown({
			with_separators: false
		});
	}
	
    aurel_countdown();

    jQuery('.aurel_nav a').each(function () {
        if (jQuery(this).attr('href') == '#') {
            jQuery(this).attr('href', 'javascript:void(0)');
        }
    });

	jQuery('nav.aurel_mobile_nav').find('.sub-menu').slideUp(1);

    jQuery('nav.aurel_mobile_nav a').each(function () {
		if (jQuery(this).parent('li').hasClass('menu-item-has-children')) {
			jQuery(this).addClass('open_sub_menu');
		}
    });

    if (jQuery('#wpadminbar').length > 0) {
        jQuery('html').addClass('has_admin_bar');
    }

    var aurel_js_bg_color = jQuery('.aurel_js_bg_color'),
        aurel_js_bg_image = jQuery('.aurel_js_bg_image'),
        aurel_js_color = jQuery('.aurel_js_color'),
        aurel_js_font_size = jQuery('.aurel_js_font_size'),
        aurel_js_height = jQuery('.aurel_js_height'),
        aurel_js_min_height = jQuery('.aurel_js_min_height');

    if (jQuery(aurel_js_bg_color).length > 0) {
        jQuery(aurel_js_bg_color).each(function () {
            jQuery(this).css('background-color', jQuery(this).attr('data-bgcolor'));
        });
    }

    if (jQuery(aurel_js_bg_image).length > 0) {
        jQuery(aurel_js_bg_image).each(function () {
            jQuery(this).css('background-image', 'url(' + jQuery(this).attr('data-src') + ')');
        });
    }

    if (jQuery(aurel_js_color).length > 0) {
        jQuery(aurel_js_color).each(function () {
            jQuery(this).css('color', jQuery(this).attr('data-color'));
        });
    }

    if (jQuery(aurel_js_font_size).length > 0) {
        jQuery(aurel_js_font_size).each(function(){
            var font_size = jQuery(this).attr('data-font-size'),
                line_height = jQuery(this).attr('data-line-height');
            
            if (typeof line_height !== 'undefined') {
	            jQuery(this).css({'font-size': font_size, 'line-height': line_height});
            } else {
	            jQuery(this).css({'font-size': font_size, 'line-height': font_size});
            }
        });
    }

    if (jQuery(aurel_js_height).length > 0) {
        jQuery(aurel_js_height).each(function(){
            var block_height = jQuery(this).attr('data-height');
            jQuery(this).height(block_height);
        });
    }
    
    if (jQuery(aurel_js_min_height).length > 0) {
    	jQuery(aurel_js_min_height).each(function () {
		    var block_min_height = jQuery(this).attr('data-min-height');
		    jQuery(this).css('min-height', block_min_height + 'px');
	    });
    }

    if (jQuery('.aurel_js_opacity').length > 0) {
        jQuery('.aurel_js_opacity').each(function(){
            var block_opacity = jQuery(this).attr('data-opacity');
            jQuery(this).css('opacity', block_opacity);
        });
    }

	if(jQuery('.aurel_js_transition').length > 0) {
		jQuery('.aurel_js_transition').each(function(){
			var transition_time = jQuery(this).attr('data-transition') + 'ms';
			jQuery(this).css({'transition-duration': transition_time});
		});
	}

    if (jQuery('.aurel_testimonials_carousel').length > 0) {
        jQuery(".aurel_testimonials_carousel").each(function () {
            var autoplay = jQuery(this).attr('data-autoplay'),
                speed = parseInt(jQuery(this).attr('data-speed')),
				pause = jQuery(this).attr('data-pause'),
				infinite = jQuery(this).attr('data-infinite');
			if (autoplay == 'yes') {
				autoplay = true;
			} else {
				autoplay = false;
			}
			if (pause == 'yes') {
				pause = true;
			} else {
				pause = false;
			}
			if (infinite == 'yes') {
				infinite = true;
			} else {
				infinite = false;
			}

            jQuery(this).on("initialized.owl.carousel", function (e) {
                jQuery(this).css("opacity", "1");
            });
            jQuery(this).owlCarousel(
                {
                    items: 3,
                    autoHeight: true,
                    center: true,
                    lazyLoad: true,
                    loop: infinite,
                    autoplay: autoplay,
                    autoplayTimeout: speed,
                    autoplayHoverPause: pause,
                    navigation: false,
					responsive: {
                        // breakpoint from 0 up
                        0: {
                            items: 1
                        },
						760: {
							items: 2
						},
                        960: {
                            items: 3
                        }
                    }
                }
            );
        });
    }

    if (jQuery('.aurel_albums_carousel').length > 0) {
        jQuery(".aurel_albums_carousel").each(function () {
            var autoplay = jQuery(this).attr('data-autoplay'),
				items_padding = parseInt(jQuery(this).attr('data-setpad')),
				on_screen = parseInt(jQuery(this).attr('data-onscreen')),
                speed = parseInt(jQuery(this).attr('data-speed')),
				pause = jQuery(this).attr('data-pause'),
				infinite = jQuery(this).attr('data-infinite');
			if (autoplay === 'yes') {
				autoplay = true;
			} else {
				autoplay = false;
			}
			
			if (pause === 'yes') {
				pause = true;
			} else {
				pause = false;
			}
			
			if (infinite === 'yes') {
				infinite = true;
			} else {
				infinite = false;
			}

            jQuery(this).on("initialized.owl.carousel", function (e) {
                jQuery(this).css("opacity", "1");
            });
            jQuery(this).owlCarousel(
                {
                    items: on_screen,
                    autoHeight: true,
                    center: true,
                    lazyLoad: true,
                    loop: infinite,
                    autoplay: autoplay,
                    autoplayTimeout: speed,
                    autoplayHoverPause: pause,
                    navigation: false,
					nav: false,
					dots: false,
					margin: items_padding,
					responsive: {
                        // breakpoint from 0 up
                        0: {
                            items: 1
                        },
						760: {
							items: 2
						},
                        960: {
                            items: 3
                        },
						1200: {
                            items: on_screen
                        }
                    }
                }
            );
        });
	}

	aurel_theme_setup();

	if (jQuery('.aurel_flickr_widget_wrapper').length > 0) {
		aurel_flickr_widget();
	}

	// Filter
    jQuery('.aurel_grid_filter li').eq(0).find('a').click();

    jQuery('.aurel_grid_filter li a').on('click', function(){
        jQuery(this).parents('.aurel_grid_filter').find('a').removeClass('is-checked');
        jQuery(this).parents('.aurel_grid_filter').find('li').removeClass('is-checked');
        jQuery(this).addClass('is-checked');
        jQuery(this).parent().addClass('is-checked');
        var filterSelector = jQuery(this).attr('data-category');

        jQuery(this).parents('div.aurel_front_end_display').find('.aurel_isotope_trigger').isotope({
            filter: filterSelector
        });
        return false;
    });

	if (jQuery('.aurel_site_wrapper').hasClass('fixed_header_footer')) {
		jQuery('.aurel_site_wrapper').prepend('<div class="aurel_main_header_holder"></div>');
		jQuery('.aurel_site_wrapper').append('<div class="aurel_footer_holder"></div>');

        aurel_window.on('scroll', function () {
			var max_scroll = jQuery('body').height() - aurel_window.height();
			if (jQuery('#wpadminbar').length > 0) {
				max_scroll = max_scroll + jQuery('#wpadminbar').height();
			}
            if (aurel_window.scrollTop() > 0) {
                jQuery('html').addClass('page_scrolled');
            } else {
                jQuery('html').removeClass('page_scrolled');
            }
			if (aurel_window.scrollTop() == max_scroll) {
				jQuery('html').addClass('page_reached_bottom');
			} else {
				jQuery('html').removeClass('page_reached_bottom');
			}
        });
	}

	// Back To Top
	jQuery('.aurel_back_to_top').attr('data-bottom', parseInt(jQuery('.aurel_back_to_top').css('bottom')));
	if (aurel_window.scrollTop() > aurel_window.height()) {
		jQuery('.aurel_back_to_top').addClass('aurel_show_me');
	} else {
		jQuery('.aurel_back_to_top').removeClass('aurel_show_me');
		if (jQuery('.aurel_footer').length > 0) {
			var footer_offset = jQuery('.aurel_footer').offset().top,
				check_footer_state = aurel_window.scrollTop() + aurel_window.height(),
				aurel_footer_showed = 'no',
				aurel_b2t_fixer = 0;

			if ( check_footer_state >= footer_offset) {
				aurel_b2t_fixer = check_footer_state - footer_offset;
				aurel_footer_showed = 'yes';
			} else {
				aurel_footer_showed = 'no';
				aurel_b2t_fixer = 0;
			}
			jQuery('.aurel_back_to_top').css('bottom', parseInt(jQuery('.aurel_back_to_top').attr('data-bottom')) + aurel_b2t_fixer + 'px');
		}
	}
	aurel_window.on('scroll', function(){
		if (aurel_window.scrollTop() > aurel_window.height()) {
			jQuery('.aurel_back_to_top').addClass('aurel_show_me');
		} else {
			jQuery('.aurel_back_to_top').removeClass('aurel_show_me');
		}
		if (jQuery('.aurel_footer').length > 0) {
			var footer_offset = jQuery('.aurel_footer').offset().top,
				check_footer_state = aurel_window.scrollTop() + aurel_window.height(),
				aurel_footer_showed = 'no',
				aurel_b2t_fixer = 0;

			if ( check_footer_state >= footer_offset) {
				aurel_b2t_fixer = check_footer_state - footer_offset;
				aurel_footer_showed = 'yes';
			} else {
				aurel_footer_showed = 'no';
				aurel_b2t_fixer = 0;
			}
			jQuery('.aurel_back_to_top').css('bottom', parseInt(jQuery('.aurel_back_to_top').attr('data-bottom')) + aurel_b2t_fixer + 'px');
		}
	});
	jQuery('.aurel_back_to_top').on('click', function(){
		jQuery('html, body').stop().animate({scrollTop: 0}, 400, function(){
			jQuery('.aurel_back_to_top').removeClass('aurel_show_me');
		});
	});

	// Preloader
	if (jQuery('.aurel_preloader_wrapper').length > 0) {
		jQuery('.aurel_preloader_wrapper').addClass('run_preloader');
	}

	// Itemized Links Grid
	if (jQuery('.aurel_itemized_links_grid').length > 0) {
		jQuery('.aurel_grid_inner').each(function(){
			var setPad = Math.floor(parseInt(jQuery(this).attr('data-pad'))/2);
			if (aurel_window.width() < 1200 && setPad > 20) {
				setPad = setPad/2;
			}
			if (aurel_window.width() < 760 && setPad > 10) {
				setPad = 10;
			}

			jQuery(this).css('margin', setPad+'px');

			if (jQuery(this).hasClass('vertical_paddings_on')) {
				jQuery(this).css('margin-top', -1*setPad+'px').css('margin-bottom', -1*setPad+'px');
			}

			if (jQuery(this).hasClass('side_paddings_on')) {
				jQuery(this).css('margin-left', -1*setPad+'px').css('margin-right', -1*setPad+'px');
			}
			jQuery(this).find('.grid-item-inner').css({
				'margin-left' : setPad+'px',
				'margin-top' : setPad+'px',
				'margin-right' : setPad+'px',
				'margin-bottom' : setPad+'px'
			});
			jQuery(this).isotope('layout');
			setTimeout("jQuery('.aurel_grid_inner').isotope('layout')",1000);
		});
	}

	// Featured Video Play
	jQuery('.aurel_featured_video_play').on('click', function(){
		jQuery(this).parents('.aurel_featured_video_wrapper').addClass('show_video');
		if (jQuery(this).parents('.aurel_featured_video_wrapper').find('iframe')[0].src.indexOf('youtu') + 1) {
			jQuery(this).parents('.aurel_featured_video_wrapper').find('iframe')[0].src += "&autoplay=1";
		} else {
			jQuery(this).parents('.aurel_featured_video_wrapper').find('iframe')[0].src += "?autoplay=1";
		}
	});

	// Before-After Module
	jQuery('.aurel_before_after').on('mousemove', function(e) {
		var this_offset = jQuery(this).offset().left,
			mouse_pos = e.pageX - this_offset,
			current_pos = jQuery(this).find('.aurel_after_image').width();
		jQuery(this).find('.aurel_after_image').width(mouse_pos);
		jQuery(this).find('.aurel_before_after_divider').css('left', mouse_pos + 'px');
	});
	
	jQuery('.aurel_before_after').on('touchmove', function(e) {
		var touch = e.originalEvent.touches[0],
			this_offset = jQuery(this).offset().left,
			set_pos = touch.pageX - this_offset;
		if (set_pos < 0) set_pos = 0;
		if (set_pos > jQuery(this).width()) set_pos = jQuery(this).width();
		
		jQuery(this).find('.aurel_after_image').width(set_pos);
		jQuery(this).find('.aurel_before_after_divider').css('left', set_pos + 'px');
	});
	
	if (aurel_body.hasClass('aurel_drag_protection')) {
		aurel_dp.on('mousedown',function(e){
			e.preventDefault();
		});
	}
    
    // Shop
	if (jQuery('.aurel_select_wrapper').length) {
		jQuery('.aurel_select').on('click', function () {
			jQuery(this).toggleClass('active').next('ul.select-options').toggle();
		});
		
		jQuery('.select-options li').on('click', function () {
			var select_value = jQuery(this).html();
			
			jQuery(this).parent().parent().find('.aurel_select').html(select_value);
		});
		
		jQuery(document).on('click', function (event) {
			if (jQuery(event.target).closest('.aurel_select').length) {} else {
				jQuery('.aurel_select').removeClass('active');
				jQuery('ul.select-options').css('display', 'none');
			}
		});
	}
    
    jQuery('.aurel_add_to_cart_button').on('click', function () {
    	var add_button = jQuery(this),
		    view_button = jQuery(this).parent().find('.aurel_view_cart_button'),
		    overlay = jQuery(this).parent().find('.aurel_product_buttons_overlay');
    	
	    overlay.addClass('active');
	    
	    setTimeout(function () {
		    view_button.addClass('active');
		    overlay.removeClass('active');
	    }, 1000, view_button, overlay);
    });
    
    jQuery('.aurel_tiny .aurel_stars li').on({
	    mouseenter: function () {
	    	jQuery(this).parent().find('.choosed').removeClass('choosed');
		    jQuery(this).addClass('active');
		    jQuery(this).prevAll().addClass('active');
	    },
	    
	    mouseleave: function () {
			jQuery(this).parent().find('.active').removeClass('active');
	    },
	    
	    click: function () {
		    jQuery(this).addClass('choosed');
		    jQuery(this).prevAll().addClass('choosed');
	    }
    });
    
    // Load More Items
	// Grid Albums
	jQuery('.aurel_albums_grid_page').each(function () {
		aurel_isotop_el_loading();
		
		var items_set = [
			{category_class: 'food-drink', src: 'img/clipart/albums_grid/img_13.jpg', album_href: 'album_slider.html', category_name: 'food+drink', title: 'Autumn Evening'},
			{category_class: 'portraits', src: 'img/clipart/albums_grid/img_14.jpg', album_href: 'album_split.html', category_name: 'portraits', title: 'Business Style'},
			{category_class: 'stuff', src: 'img/clipart/albums_grid/img_15.jpg', album_href: 'album_grid.html', category_name: 'stuff', title: 'Autumn Stuff'},
			{category_class: 'stuff', src: 'img/clipart/albums_grid/img_16.jpg', album_href: 'album_masonry.html', category_name: 'stuff', title: 'Rope Bundle'},
			{category_class: 'nature', src: 'img/clipart/albums_grid/img_17.jpg', album_href: 'album_kenburns.html', category_name: 'nature', title: 'Waterfall'},
			{category_class: 'fashion', src: 'img/clipart/albums_grid/img_18.jpg', album_href: 'album_packery.html', category_name: 'fashion', title: 'Fashion Jeans'},
			{category_class: 'fashion', src: 'img/clipart/albums_grid/img_19.jpg', album_href: 'album_ribbon.html', category_name: 'fashion', title: 'Street Style'},
			{category_class: 'food-drink', src: 'img/clipart/albums_grid/img_20.jpg', album_href: 'album_slider.html', category_name: 'food-drink', title: 'Breakfast'}
		];
		
		jQuery('#list').albums_listing_addon({
			load_count: 4,
			items: items_set
		});
	});
	
	// Masonry Albums
	jQuery('.aurel_albums_masonry_page').each(function () {
		aurel_isotop_el_loading();
		
		var items_set = [
			{category_class: 'food-drink', src: 'img/clipart/albums_masonry/img_13.jpg', album_href: 'album_slider.html', category_name: 'food+drink', title: 'Autumn Evening'},
			{category_class: 'portraits', src: 'img/clipart/albums_masonry/img_14.jpg', album_href: 'album_split.html', category_name: 'portraits', title: 'Business Style'},
			{category_class: 'stuff', src: 'img/clipart/albums_masonry/img_15.jpg', album_href: 'album_grid.html', category_name: 'stuff', title: 'Autumn Stuff'},
			{category_class: 'stuff', src: 'img/clipart/albums_masonry/img_16.jpg', album_href: 'album_masonry.html', category_name: 'stuff', title: 'Rope Bundle'},
			{category_class: 'nature', src: 'img/clipart/albums_masonry/img_17.jpg', album_href: 'album_kenburns.html', category_name: 'nature', title: 'Waterfall'},
			{category_class: 'fashion', src: 'img/clipart/albums_masonry/img_18.jpg', album_href: 'album_packery.html', category_name: 'fashion', title: 'Fashion Jeans'},
			{category_class: 'fashion', src: 'img/clipart/albums_masonry/img_19.jpg', album_href: 'album_ribbon.html', category_name: 'fashion', title: 'Street Style'},
			{category_class: 'food-drink', src: 'img/clipart/albums_masonry/img_20.jpg', album_href: 'album_slider.html', category_name: 'food-drink', title: 'Breakfast'}
		];
		
		jQuery('#list').albums_listing_addon({
			load_count: 4,
			items: items_set
		});
	});
	
	// Packery Albums
	jQuery('.aurel_albums_packery_page').each(function () {
		aurel_isotop_el_loading();
		
		var items_set = [
			{count: '1', category_class: 'portraits', img_src: 'img/clipart/albums_packery/thumb-9.jpg', album_href: 'album_masonry.html', category_name: 'Portraits', title: 'Beautiful Ringlets'},
			{count: '2', category_class: 'nature', img_src: 'img/clipart/albums_packery/thumb-10.jpg', album_href: 'album_packery.html', category_name: 'Nature', title: 'In the Forest'},
			{count: '3', category_class: 'food-drink', img_src: 'img/clipart/albums_packery/thumb-11.jpg', album_href: 'album_kenburns.html', category_name: 'Food+Drink', title: 'Still Life'},
			{count: '4', category_class: 'stuff', img_src: 'img/clipart/albums_packery/thumb-12.jpg', album_href: 'album_ribbon.html', category_name: 'Stuff', title: 'Light My Fire'},
			{count: '5', category_class: 'food-drink', img_src: 'img/clipart/albums_packery/thumb-13.jpg', album_href: 'album_slider.html', category_name: 'Food+Drink', title: 'Autumn Evening'},
			{count: '6', category_class: 'portraits', img_src: 'img/clipart/albums_packery/thumb-14.jpg', album_href: 'album_split.html', category_name: 'Portraits', title: 'Business Style'},
			{count: '7', category_class: 'stuff', img_src: 'img/clipart/albums_packery/thumb-15.jpg', album_href: 'album_grid.html', category_name: 'Stuff', title: 'Autumn Stuff'},
			{count: '8', category_class: 'stuff', img_src: 'img/clipart/albums_packery/thumb-16.jpg', album_href: 'album_masonry.html', category_name: 'Stuff', title: 'Rope Bundle'},
			{count: '1', category_class: 'nature', img_src: 'img/clipart/albums_packery/thumb-17.jpg', album_href: 'album_packery.html', category_name: 'Nature', title: 'Waterfall'},
			{count: '2', category_class: 'fashion', img_src: 'img/clipart/albums_packery/thumb-18.jpg', album_href: 'album_kenburns.html', category_name: 'Fashion', title: 'Fashion Jeans'},
			{count: '3', category_class: 'fashion', img_src: 'img/clipart/albums_packery/thumb-19.jpg', album_href: 'album_ribbon.html', category_name: 'Fashion', title: 'Street Style'},
			{count: '4', category_class: 'food-drink', img_src: 'img/clipart/albums_packery/thumb-20.jpg', album_href: 'album_slider.html', category_name: 'Food+Drink', title: 'Breakfast'}
		];
		
		jQuery('#list').packery_albums_listing_addon({
			load_count: 4,
			items: items_set
		});
	});
	
    // Grid Blog
	jQuery('.aurel_grid_blog_page').each(function () {
		aurel_grid_blog_loading();
		
		var items_set = [
			{post_link: 'blog_audio.html', img_url: 'img/clipart/blog_grid/blog-grid-10.jpg', post_date: 'November 14, 2017', post_category: 'Fashion', post_title: 'Fashion Shoes', post_excerpt: 'Ihendrerit felis. Quisque ut sapien fermentum sapien iaculis condimentum. Ut eget ipsum eget justo congue dapibus vitae ac tortor. Sed gravida, arcu eget pulvinar imperdiet, neque ipsum luctus velit, in luctus elit...'},
			{post_link: 'blog_standard.html', img_url: 'img/clipart/blog_grid/blog-grid-11.jpg', post_date: 'November 14, 2017', post_category: 'Music', post_title: 'Meant to Be', post_excerpt: 'Fringilla ac est. Vestibulum arcu nibh, varius sed orci eget, convallis pretium eros. Integer dignissim sapien dolor, sit amet posuere mauris imperdiet id. Aliquam at tellus vitae nunc consectetur malesuada ut...'},
			{post_link: 'blog_image.html', img_url: 'img/clipart/blog_grid/blog-grid-12.jpg', post_date: 'November 14, 2017', post_category: 'Fashion', post_title: 'Stylish Look', post_excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis mollis tellus in dictum. Sed ultrices pharetra cursus. Integer porttitor ut arcu at semper. Aenean accumsan purus sit amet semper vulputate...'},
			{post_link: 'blog_gallery.html', img_url: 'img/clipart/blog_grid/blog-grid-13.jpg', post_date: 'November 14, 2017', post_category: 'Traveling', post_title: 'Mountain Ways', post_excerpt: 'Fringilla ac est. Vestibulum arcu nibh, varius sed orci eget, convallis pretium eros. Integer dignissim sapien dolor, sit amet posuere mauris imperdiet id. Aliquam at tellus vitae nunc consectetur malesuada ut...'},
			{post_link: 'blog_video.html', img_url: 'img/clipart/blog_grid/blog-grid-14.jpg', post_date: 'November 14, 2017', post_category: 'Nature', post_title: 'Bird’s Eye View', post_excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed facilisis mollis tellus in dictum. Sed ultrices pharetra cursus. Integer porttitor ut arcu at semper. Aenean accumsan purus sit amet semper vulputate...'},
			{post_link: 'blog_audio.html', img_url: 'img/clipart/blog_grid/blog-grid-15.jpg', post_date: 'November 14, 2017', post_category: 'Music', post_title: 'Corra Music', post_excerpt: 'Ihendrerit felis. Quisque ut sapien fermentum sapien iaculis condimentum. Ut eget ipsum eget justo congue dapibus vitae ac tortor. Sed gravida, arcu eget pulvinar imperdiet, neque ipsum luctus velit, in luctus elit...'}
		];
		
		jQuery('#list').blog_listing_addon({
			load_count: 3,
			items: items_set
		});
	});
	
	// Landing Page
	jQuery('.aurel_landing_page').each(function () {
		aurel_isotop_el_loading();
	});
	
	// Tabs Widget
	jQuery('.aurel-widget-tabs').each(function () {
		jQuery(this).find('.aurel-tab-desktop-title').first().addClass('active');
		jQuery(this).find('.aurel-tab-content').first().addClass('active');
		
		jQuery(this).find('.aurel-tab-desktop-title').on('click', function () {
			var tab_number = jQuery(this).attr('data-tab');
			
			jQuery(this).parent().find('.active').removeClass('active');
			jQuery(this).addClass('active');
			jQuery(this).parent().parent().find('.aurel-tabs-content-wrapper > .active').removeClass('active');
			jQuery(this).parent().parent().find('.aurel-tabs-content-wrapper [data-tab="' + tab_number + '"]').addClass('active');
		});
	});
	
	// Checkout Page
	jQuery('.aurel_show_coupon_button').on('click', function () {
		jQuery('.aurel_checkout_coupon_form').slideToggle();
	});
	
	jQuery('.aurel_payment_method_label').on('click', function () {
		if (jQuery(this).parent().is('.active')) {} else {
			jQuery(this).parents('.aurel_payment_methods').find('.visible').slideUp().removeClass('visible');
			jQuery(this).parents('.aurel_payment_methods').find('.active').removeClass('active');
			jQuery(this).parent().addClass('active');
			jQuery(this).parent().find('.aurel_payment_box').slideDown().addClass('visible');
		}
	});
});

jQuery(document).on('click', '.reset_variations', function(){
	var $this = jQuery(this),
		$variations_table = $this.parents('.variations');
	$variations_table.find('select').each(function(){
		var $this_select = jQuery(this),
			$this_liza_select = $this_select.next('.aurel_select'),
			$this_list = $this_liza_select.next('.select-options');
		$this_liza_select.text($this_list.find('li[rel=""]').text());
	});
});

jQuery(window).on('load', function () {
	aurel_theme_setup();
	setTimeout("aurel_window.trigger('resize')",300);
	setTimeout('aurel_theme_setup()', 300);
	setTimeout("jQuery('.aurel_coming_soon_page').css('opacity', '1')", 500);
	// Preloader
	if (jQuery('.aurel_preloader_wrapper').length > 0) {
		setTimeout("jQuery('.fadeOnLoad').removeClass('fadeOnLoad')",900);
		setTimeout("jQuery('.aurel_preloader_wrapper').addClass('remove_preloader_step01')", 300);
		setTimeout("jQuery('.aurel_preloader_wrapper').addClass('remove_preloader_step02')", 800);
		setTimeout("jQuery('.aurel_preloader_wrapper').remove()", 1200);
	}
	
	// Header Style
	if (aurel_header.hasClass('aurel_header_gradient_style')) {
		jQuery('html').addClass('aurel_header_gradient_page');
		if (jQuery('.page-template-page-centered').length < 1) {
			jQuery('html').addClass('aurel_content_under_header');
		}
	}
	if (aurel_header.hasClass('aurel_header_transparent_style')) {
		jQuery('html').addClass('aurel_header_transparent_page');
		if (jQuery('.page-template-page-centered').length < 1) {
			jQuery('html').addClass('aurel_content_under_header');
		}
	}
	if (jQuery('.aurel_404_content_wrapper').length > 0) {
		aurel_header.addClass('aurel_header_gradient_style');
		jQuery('html').addClass('aurel_header_gradient_page');
	}
	if (jQuery('.aurel_pp_content_wrapper').length > 0) {
		aurel_header.addClass('aurel_header_transparent_style');
		jQuery('html').addClass('aurel_header_transparent_page');
		if (jQuery('.aurel_pp_content_wrapper').hasClass('aurel_pp_demo')) {
			jQuery('.aurel_pp_content_wrapper').find('.post-password-form p:first').html(jQuery('.aurel_pp_content_wrapper').attr('data-text'));
		}
	}
	
	// Sticky Menu
	if (aurel_header.hasClass('aurel_sticky_menu_on') && !jQuery('.aurel_site_wrapper').hasClass('fixed_header_footer')) {
		if (aurel_header.hasClass('aurel_header_solid_style')) {
			// Add Header Holder
			aurel_header.after('<div class="aurel_header_holder"></div>');
			jQuery('.aurel_header_holder').height(aurel_header.height());
		}
		if (aurel_window.scrollTop() > 0 && aurel_window.width() > 1024) {
			//aurel_header.addClass('aurel_stick_me');//A.S. Removed stick_me
		} else {
			aurel_header.removeClass('aurel_stick_me');
		}
		aurel_window.on('scroll', function() {
			if (aurel_window.scrollTop() > 0 && aurel_window.width() > 1024) {
				//aurel_header.addClass('aurel_stick_me');//A.S. Removed stick_me
			} else {
				aurel_header.removeClass('aurel_stick_me');
			}
		});
	}
});

jQuery(window).on('resize', function () {
	aurel_theme_setup();
	setTimeout("aurel_theme_setup()",300);
});

jQuery('a[href="#"]').on('click', function(event){
    event.preventDefault();
});

function aurel_theme_setup() {
	/* Before After Module */
	if (jQuery('.aurel_before_after').length > 0) {
		jQuery('.aurel_before_after').each(function() {
			var $this = jQuery(this),
				$this_after_img = $this.find('.aurel_after_img'),
				img_w = $this.find('.aurel_before_image').width(),
				img_h = $this.find('.aurel_before_image').height();
			
			if ($this.width() > img_w) {
				$this.css('max-width', img_w+'px');
			} else {
				$this.css('max-width', 'auto');
			}
			$this_after_img.width(img_w).height(img_h).css('max-width', img_w+'px');
			$this.find('.aurel_after_image').css('width', '50%');
			$this.find('.aurel_before_after_divider').css('left', '50%');
		});
	}

	/* Header Setup */
	if (aurel_window.width() > 960) {
		if (aurel_header.hasClass('aurel_logo_middle')) {
			// Center Logo Header
			var logo_width = aurel_header_logo_part.width(),
				other_parts = (aurel_window.width() - logo_width - 1)/2;
			aurel_header_menu_part.width(other_parts);
			aurel_header_logo_part.width(logo_width);
			aurel_header_socials_part.width(other_parts);
		} else {
			// Left and Right Logo Header
			var use_width = 0,
				logo_width = aurel_header_logo_part.width(),
				socials_width = aurel_header_socials_part.width()+1;
			if (logo_width > socials_width) {
				use_width = logo_width;
			} else {
				use_width = socials_width;
			}
			var set_menu_width = aurel_header.width() - use_width*2 - 2;
			aurel_header_menu_part.width(set_menu_width);
			aurel_header_logo_part.width(use_width);
			aurel_header_socials_part.width(use_width);
		}
	}
	if (jQuery('.aurel_header_holder').length) {
		jQuery('.aurel_header_holder').height(aurel_header.height());
	}
	if (aurel_window.scrollTop() > 0 && aurel_window.width() > 1024) {
		//aurel_header.addClass('aurel_stick_me'); //A.S. Removed stick_me
	} else {
		aurel_header.removeClass('aurel_stick_me');
	}

	/* Set This After Header */
	if (jQuery('.aurel_set_this_after_header').length) {
		jQuery('.aurel_set_this_after_header').each(function(){
			var $this = jQuery(this),
				set_top = aurel_header.height();
			if (jQuery('#wpadminbar').length && aurel_window.width() > 760) {
				set_top = set_top + jQuery('#wpadminbar').height();
			}
			$this.css('top', set_top);
		});
	}

	/* Footer and Header Holder */
	if (jQuery('.aurel_site_wrapper').hasClass('fixed_header_footer')) {
		jQuery('.aurel_main_header_holder').height(jQuery('header.aurel_main_header').height());
		jQuery('.aurel_footer_holder').height(jQuery('footer.aurel_footer').height());
	}

	if (jQuery('html').hasClass('aurel_content_under_header')) {
		aurel_push_content_under_header();
	}

	/* Fullheight Sections Setup */
	if (jQuery('section.elementor-section-height-full').length > 0 && aurel_window.width() < 1200) {
		jQuery('section.elementor-section-height-full').height(aurel_window.height());
	}
	
	if (jQuery('.aurel_owlCarousel').length > 0) {
		jQuery('.aurel_owlCarousel').each(function () {
			jQuery(this).trigger('refresh.owl.carousel');
		});
	}

	/* Container Min-Height Setup*/
	if (jQuery('.aurel_content').length > 0) {
		var set_min_height = aurel_window.height();
		if (jQuery('header.aurel_main_header').length > 0) {
			set_min_height = set_min_height - jQuery('header.aurel_main_header').height();
		}
		if (jQuery('.footer_widgets_wrapper').length > 0) {
			set_min_height = set_min_height - jQuery('.footer_widgets_wrapper').height();
		}
		if (jQuery('footer.aurel_footer').length > 0) {
			set_min_height = set_min_height - jQuery('footer.aurel_footer').height();
		}
		if (jQuery('#wpadminbar').length > 0) {
			set_min_height = set_min_height - jQuery('#wpadminbar').height();
		}
		jQuery('.aurel_main_wrapper').css('min-height', set_min_height+'px');
	}

	/* PF Fullwidth Setup*/
	if (jQuery('.aurel_pf_fullwidth').length > 0 && jQuery('.aurel_sidebar').length < 1) {
		var set_width = jQuery('.aurel_site_wrapper').width();
		jQuery('.aurel_pf_fullwidth').each(function() {
			var set_mar = (jQuery('.aurel_container').width() - set_width)/2;
			jQuery(this).width(set_width).css('margin-left', set_mar+'px');
		});
	}

	/* PhotoSwipe Video Setup */
	if (jQuery('.aurel_pswp_video_wrapper').length > 0) {
		var aurel_window_height = aurel_window.height();
		if (jQuery('.pswp__top-bar').length > 0) {
			aurel_window_height = aurel_window_height - jQuery('.pswp__top-bar').height()*2;
		}
		if (jQuery('#wpadminbar').length > 0) {
			aurel_window_height = aurel_window_height - jQuery('#wpadminbar').height();
		}
		if ((aurel_window.width()/16)*9 > aurel_window_height) {
			var set_width = (aurel_window_height/9)*16,
				set_height = aurel_window_height;
		} else {
			var set_height = (aurel_window.width()/16)*9,
				set_width = aurel_window.width();
		}
		jQuery('.aurel_pswp_video_wrapper').width(set_width).height(set_height);
	}

	/* 404 Page */
	if (jQuery('.aurel_404_content_wrapper').length > 0) {
		if (jQuery('#wpadminbar').length > 0) {
			jQuery('.aurel_site_wrapper').css('min-height', aurel_window.height() - jQuery('#wpadminbar').height()+'px');
		} else {
			jQuery('.aurel_site_wrapper').css('min-height', aurel_window.height()+'px');
		}
	}

	/* Password Protected */
	if (jQuery('.aurel_pp_content_wrapper').length > 0) {
		if (jQuery('#wpadminbar').length > 0) {
			jQuery('.aurel_site_wrapper').css('min-height', aurel_window.height() - jQuery('#wpadminbar').height()+'px');
		} else {
			jQuery('.aurel_site_wrapper').css('min-height', aurel_window.height()+'px');
		}
	}

	/* Centered Page */
	if (jQuery('.aurel_verticaly_page_trigger').length > 0) {
		var centered_min_height = aurel_window.height();
		if (jQuery('#wpadminbar').length > 0) {
			centered_min_height = centered_min_height - jQuery('#wpadminbar').height();
			jQuery('.aurel_site_wrapper').css('min-height', (aurel_window.height() - jQuery('#wpadminbar').height())+'px');
		} else {
			jQuery('.aurel_site_wrapper').css('min-height', aurel_window.height()+'px');
		}
		if (aurel_header.length > 0) {
			centered_min_height = centered_min_height - aurel_header.height();
		}
		if (aurel_footer.length > 0) {
			centered_min_height = centered_min_height - aurel_footer.height();
		}
		if (jQuery('.aurel_verticaly_page_wrapper').length > 0) {
			var centered_page_container = jQuery('.aurel_verticaly_page_wrapper'),
				set_centered_top = aurel_header.height();
			if (centered_min_height > centered_page_container.height()) {
				set_centered_top = (centered_min_height - centered_page_container.height())/2 + aurel_header.height();
				centered_page_container.css('top', set_centered_top + 'px').addClass('centered_this');
				jQuery('html').addClass('aurel_html_centered_page');
				jQuery('html').removeClass('aurel_html_stick2top_page');
			} else {
				centered_page_container.css('top', '0px').addClass('stick_to_top');;
				jQuery('html').addClass('aurel_html_stick2top_page');
				jQuery('html').removeClass('aurel_html_centered_page');
				jQuery('html').removeClass('page_reached_bottom');
				jQuery('html').removeClass('page_reached_top');
			}
		} else {
			jQuery('html').addClass('aurel_centered_no_content');
		}

		// Video BG
		if (jQuery('.aurel_centered_page_video').length > 0) {
			var window_w = aurel_window.width(),
				window_h = aurel_window.height(),
				current_iframe = jQuery('.aurel_centered_page_video').find('iframe');
			if (((window_h + 150) / 9) * 16 > window_w) {
				current_iframe.height(window_h + 150).width(((window_h + 150) / 9) * 16);
				current_iframe.css({
					'margin-left': (-1 * current_iframe.width() / 2) + 'px',
					'top': "-75px",
					'margin-top': '0px'
				});
			} else {
				current_iframe.width(window_w).height(((window_w) / 16) * 9);
				current_iframe.css({
					'margin-left': (-1 * jQuery('iframe').width() / 2) + 'px',
					'margin-top': (-1 * jQuery('iframe').height() / 2) + 'px',
					'top': '50%'
				});
			}
		}
		if (jQuery('.aurel_verticaly_page_wrapper').length < 1) {
			jQuery('html').addClass('aurel_no_content_block');
		}
	}

	/* Stretched Video */
	if (jQuery('.aurel_video_stretch').length) {
		jQuery('.aurel_video_stretch').each(function(){
			var video_iframe =  jQuery(this).find('.elementor-background-video-container iframe'),
				container_h = jQuery(this).height(),
				container_w = jQuery(this).width();

			if (aurel_window.width() > 1024) {
				if (video_iframe.length > 0) {
					if (((container_h + 150) / 9) * 16 > container_w) {
						video_iframe.height(container_h + 150).width(((container_h + 150) / 9) * 16);
						video_iframe.css({
							'margin-left': (-1 * video_iframe.width() / 2) + 'px',
							'top': '-75px',
							'margin-top': '0px'
						});
					} else {
						video_iframe.width(container_w).height(((container_w) / 16) * 9);
						video_iframe.css({
							'margin-left': (-1 * video_iframe.width() / 2) + 'px',
							'margin-top': (-1 * video_iframe.height() / 2) + 'px',
							'top': '50%'
						});
					}
				}
			} else {
				video_iframe.height(aurel_window.height()).width(aurel_window.width()).css({
					'top': '0px',
					'margin-left' : '0px',
					'left' : '0px',
					'margin-top': '0px'
				});
			}
		});
	}
}

jQuery(document).on('click', '.aurel_header_mobile_menu_toggler', function() {
	jQuery('html').toggleClass('aurel_show_mobile_header');
	jQuery('.aurel_mobile_menu_wrapper').slideToggle(400);
});

jQuery(document).on("click", '.open_sub_menu', function () {
	jQuery(this).parent('li').toggleClass('aurel_mobile_submenu_showed');
	jQuery(this).parent('li').children('ul.sub-menu').toggleClass('aurel_mobile_submenu_showed').slideToggle(400);
});

function aurel_isotop_el_loading() {
	if (jQuery('.aurel_isotop_el_loading:first').length > 0) {
		jQuery('.aurel_isotop_el_loading:first').removeClass('aurel_isotop_el_loading');
		setTimeout("aurel_isotop_el_loading()",200);
	}

}
function aurel_grid_blog_loading() {
	if (jQuery('.aurel_grid_blog_loading:first').length > 0) {
		jQuery('.aurel_grid_blog_loading:first').removeClass('aurel_grid_blog_loading');
		setTimeout("aurel_grid_blog_loading()",200);
	}

}

function aurel_countdown() {
    jQuery('.aurel_countdown').each(function(){
        var pm_year = jQuery(this).attr('data-year'),
            pm_month = jQuery(this).attr('data-month'),
            pm_day = jQuery(this).attr('data-day'),
            austDay = new Date(pm_year, pm_month - 1, pm_day);

        jQuery(this).countdown({
            until: austDay,
            padZeroes: true
        });
    });
}

// PM Flicker Widget
function aurel_flickr_widget () {
	jQuery('.aurel_flickr_widget_wrapper').each(function () {
		var flickrid = jQuery(this).attr('data-flickrid'),
			widget_id = jQuery(this).attr('data-widget_id'),
			widget_number = jQuery(this).attr('data-widget_number');

		jQuery(this).addClass('aurel_flickr_widget_wrapper'+flickrid);

		jQuery.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?id="+widget_id+"&lang=en-us&format=json&jsoncallback=?", function(data){
			jQuery.each(data.items, function(i,item){
				if(i<widget_number){
					jQuery("<img/>").attr("src", item.media.m).appendTo(".aurel_flickr_widget_wrapper"+flickrid).wrap("<div class=\'aurel_flickr_badge_image\'><a href=\'" + item.link + "\' target=\'_blank\' class=\'aurel_no_select\' title=\'Flickr\'></a></div>");
				}
			});
		});
	});
}

function aurel_push_content_under_header() {
	var header_height = aurel_header.height();
	/*aurel_header.css('margin-bottom', -1*header_height+'px');
	jQuery('.aurel_mobile_menu_wrapper').css('margin-bottom', header_height+'px');*/ /*A.S. Removed big spacing*/
}

jQuery(document).on('click', '#swipebox-slider .current', function() {
    jQuery('a#swipebox-next').click();
});

// Grid Albums Listing
jQuery.fn.albums_listing_addon = function (addon_options) {
	"use strict";
	//Set Variables
	var addon_el = jQuery(this),
		addon_base = this,
		img_count = addon_options.items.length,
		img_per_load = addon_options.load_count,
		$newEls = '',
		loaded_object = '',
		$container = jQuery('.aurel_albums_grid');
	
	jQuery('.grid_albums_trigger').on('click', function () {
		$newEls = '';
		loaded_object = '';
		var loaded_images = $container.find('.added').length;
		if ((img_count - loaded_images) > img_per_load) {
			var now_load = img_per_load;
		} else {
			now_load = img_count - loaded_images;
		}
		
		if ((loaded_images + now_load) == img_count) {
			jQuery(this).fadeOut();
			jQuery(this).parent().addClass('all_posts_loaded');
		}
		
		if (loaded_images < 1) {
			var i_start = 1;
		} else {
			i_start = loaded_images + 1;
		}
		
		if (now_load > 0) {
			// load more elements
			for (var i = i_start - 1; i < i_start + now_load - 1; i++) {
				loaded_object = loaded_object +
					'<div class="aurel_albums_grid_item columns_4 ' + addon_options.items[i].category_class + ' added aurel_isotop_el_loading">' +
						'<div class="aurel_inner_cont">' +
							'<a href="' + addon_options.items[i].album_href + '" class="aurel_dp aurel_no_select">' +
								'<img src="' + addon_options.items[i].src + '" alt=""/>' +
					
								'<span class="aurel_albums_grid_content">' +
									'<span class="aurel_albums_category">' + addon_options.items[i].category_name + '</span>' +
									'<span class="aurel_albums_title">' + addon_options.items[i].title + '</span>' +
								'</span>' +
							'</a>' +
						'</div>' +
					'</div>';
			}
			
			$newEls = jQuery(loaded_object);
			$container.isotope('insert', $newEls, function () {
				$container.isotope('reLayout');
			});
			setTimeout("aurel_isotop_el_loading()", 300);
			setTimeout("jQuery('.aurel_albums_grid').isotope();", 500);
			setTimeout("jQuery('.aurel_albums_grid').isotope();", 1000);
			setTimeout("jQuery('.aurel_albums_grid').isotope();", 2000);
			setTimeout("jQuery('.aurel_albums_grid').isotope();", 3000);
		}
	});
};

// Packery Albums Listing
jQuery.fn.packery_albums_listing_addon = function (addon_options) {
	"use strict";
	//Set Variables
	var addon_el = jQuery(this),
		addon_base = this,
		img_count = addon_options.items.length,
		img_per_load = addon_options.load_count,
		$newEls = '',
		loaded_object = '',
		$container = jQuery('.aurel_albums_packery');
	
	jQuery('.packery_albums_trigger').on('click', function () {
		$newEls = '';
		loaded_object = '';
		var loaded_images = $container.find('.added').length;
		if ((img_count - loaded_images) > img_per_load) {
			var now_load = img_per_load;
		} else {
			now_load = img_count - loaded_images;
		}
		
		if ((loaded_images + now_load) == img_count) {
			jQuery(this).fadeOut();
			jQuery(this).parent().addClass('all_posts_loaded');
		}
		
		if (loaded_images < 1) {
			var i_start = 1;
		} else {
			i_start = loaded_images + 1;
		}
		
		if (now_load > 0) {
			// load more elements
			for (var i = i_start - 1; i < i_start + now_load - 1; i++) {
				loaded_object = loaded_object +
					'<div class="aurel_albums_packery_item packery-item element packery-item' + addon_options.items[i].count + ' anim_el anim_el2 load_anim packery_b2p aurel_isotop_el_loading added ' + addon_options.items[i].category_class + ' other_loaded_item" data-count="' + addon_options.items[i].count + '">' +
						'<div class="aurel_inner_cont packery-item-inner aurel_bg_image_load" data-src="' + addon_options.items[i].img_src + '">' +
							'<a href="' + addon_options.items[i].album_href + '" class="aurel_dp aurel_no_select">' +
								'<div class="aurel_albums_grid_content">' +
									'<h6 class="aurel_albums_category">' + addon_options.items[i].category_name + '</h6>' +
									'<h4 class="aurel_albums_title">' + addon_options.items[i].title + '</h4>' +
								'</div>' +
							'</a>' +
						'</div>' +
					'</div>';
			}
			
			$newEls = jQuery(loaded_object);
			$container.isotope('insert', $newEls, function () {
				$container.isotope('reLayout');
			});
			
			jQuery($container).find('.aurel_bg_image_load').each(function () {
				jQuery(this).css('background-image', 'url(' + jQuery(this).attr('data-src') + ')').removeClass('aurel_bg_image_load');
			});
			
			$container.find('.other_loaded_item').each(function () {
				var current_count = jQuery(this).attr('data-count'),
					current_width = jQuery(this).parent().find('.first_load.packery-item' + current_count + '').width(),
					current_height = jQuery(this).parent().find('.first_load.packery-item' + current_count + '').height();
				
				jQuery(this).width(current_width).height(current_height).removeClass('other_loaded_item');
			});
			
			setTimeout("jQuery('.aurel_albums_packery').isotope();", 500);
			setTimeout("jQuery('.aurel_albums_packery').isotope();", 1000);
			setTimeout("aurel_isotop_el_loading()", 1200);
			setTimeout("jQuery('.aurel_albums_packery').isotope();", 2000);
			setTimeout("jQuery('.aurel_albums_packery').isotope();", 3000);
		}
	});
};

// Grid Blog Listing
jQuery.fn.blog_listing_addon = function (addon_options) {
	"use strict";
	//Set Variables
	var addon_el = jQuery(this),
		addon_base = this,
		img_count = addon_options.items.length,
		img_per_load = addon_options.load_count,
		$newEls = '',
		loaded_object = '',
		$container = jQuery('.aurel_grid_blog_listing_cont');
	
	jQuery('.grid_blog_trigger').on('click', function () {
		$newEls = '';
		loaded_object = '';
		var loaded_images = $container.find('.added').length;
		if ((img_count - loaded_images) > img_per_load) {
			var now_load = img_per_load;
		} else {
			now_load = img_count - loaded_images;
		}
		
		if ((loaded_images + now_load) == img_count) {
			jQuery(this).fadeOut();
			jQuery(this).parent().addClass('all_posts_loaded');
		}
		
		if (loaded_images < 1) {
			var i_start = 1;
		} else {
			i_start = loaded_images + 1;
		}
		
		if (now_load > 0) {
			// load more elements
			for (var i = i_start - 1; i < i_start + now_load - 1; i++) {
				loaded_object = loaded_object +
					'<div class="aurel_grid_blog_item added aurel_grid_blog_loading">' +
						'<a class="aurel_grid_blog_image aurel_dp aurel_no_select" href="' + addon_options.items[i].post_link + '">' +
							'<img src="' + addon_options.items[i].img_url + '" alt=""/>' +
						'</a>' +
						'<div class="aurel_post_content">' +
							'<div class="aurel_post_meta">' +
								'<div class="aurel_post_meta_item">' + addon_options.items[i].post_date + '</div>' +
								'<div class="aurel_post_meta_item aurel_dp">' +
									'<a class="category tag" href="javascript:void(0)">' + addon_options.items[i].post_category + '</a>' +
								'</div>' +
							'</div>' +
							'<h4 class="aurel_post_title">' +
								'<a href="' + addon_options.items[i].post_link + '" class="aurel_dp">' + addon_options.items[i].post_title + '</a>' +
							'</h4>' +
							'<div class="aurel_post_excerpt">' +
								'' + addon_options.items[i].post_excerpt + '' +
							'</div>' +
						'</div>' +
					'</div>';
			}
			
			$newEls = jQuery(loaded_object);
			$container.isotope('insert', $newEls, function () {
				$container.isotope('reLayout');
			});
			
			// aurel_grid_blog_loading();
			setTimeout("aurel_grid_blog_loading()", 600);
			setTimeout("jQuery('.aurel_grid_blog_listing_cont').isotope();", 500);
			setTimeout("jQuery('.aurel_grid_blog_listing_cont').isotope();", 1000);
			setTimeout("jQuery('.aurel_grid_blog_listing_cont').isotope();", 2000);
			setTimeout("jQuery('.aurel_grid_blog_listing_cont').isotope();", 3000);
		}
	});
};

