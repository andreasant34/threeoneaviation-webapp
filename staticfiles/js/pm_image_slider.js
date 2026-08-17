/*
 * Images Slider
 * Created by Pixel-Mafia
 * www.pixel-mafia.com
*/
"use strict";
var aurel_slider_object = {};
var $aurel_slider_wrapper = jQuery('.aurel_slider_wrapper'),
	aurel_slider_cur_count = jQuery('.aurel_slide_counter_current');

if ($aurel_slider_wrapper.hasClass('aurel_media_slider_wrapper')) {
	aurel_slider_object.type = 'media';
} else {
	aurel_slider_object.type = 'image';
}
aurel_slider_object.id = $aurel_slider_wrapper.attr('data-id');
aurel_slider_object.obj = $aurel_slider_wrapper;
aurel_slider_object.active_slide = 0;
aurel_slider_object.options = {
	autoplay: $aurel_slider_wrapper.attr('data-autoplay'),
	speed: $aurel_slider_wrapper.attr('data-interval'),
	thumbs: $aurel_slider_wrapper.attr('data-thumbs'),
	max: $aurel_slider_wrapper.find('.aurel_slider_slide').length,
}
aurel_slider_object.interval = setInterval("aurel_slider_object.move.call(aurel_slider_object,1)", aurel_slider_object.options.speed);

aurel_slider_object.init = function() {
	this.setup(this,'');
	if (this.active_slide == 0) 
		this.goto.call(this,1);

	// Touch and Click Events
	this.obj.on("swipeleft", function () {
		aurel_slider_object.move.call(aurel_slider_object,1);
	});
	this.obj.on("swipeup", function () {
		aurel_slider_object.move.call(aurel_slider_object,1);
	});
	this.obj.on("swiperight", function () {
		aurel_slider_object.move.call(aurel_slider_object,-1);
	});
	this.obj.on("swipedown", function () {
		aurel_slider_object.move.call(aurel_slider_object,-1);
	});

	jQuery('.aurel_slider_btn_prev').on('click', function(){
		aurel_slider_object.move.call(aurel_slider_object,-1);
	});
	jQuery('.aurel_slider_btn_next').on('click', function(){
		aurel_slider_object.move.call(aurel_slider_object,1);
	});

	// Window Events
	jQuery(window).on('load', function(){
		aurel_slider_object.obj.removeClass('aurel_module_loading');
		aurel_slider_object.setup.call(aurel_slider_object,'');
	});
	jQuery(window).on('resize', function(){
		aurel_slider_object.setup.call(aurel_slider_object,'');
	});
}

aurel_slider_object.setup = function(action) {
	switch (action) {
		case 'vframe':
			var $v_frame = this.obj.find('iframe'),
				w_check = this.obj.width(),
				h_check = this.obj.height(),
				prop_x = 16,
				prop_y = 9,
				coef = w_check/prop_x,
				h_coef = h_check/coef;
			
			$v_frame.removeClass('aurel_h_rule').removeClass('aurel_w_rule');
			if (this.obj.hasClass('video_fit') || aurel_window.width() < 1200) {
				$v_frame.height(h_check).width(w_check);
			} else {
				if (h_coef > prop_y) {
					var w_set = prop_x*h_check/prop_y;
					$v_frame.height(h_check+prop_y*10).width(w_set+prop_x*10).addClass('aurel_h_rule');
				} else {
					var h_set = prop_y*w_check/prop_x;
					$v_frame.width(w_check+prop_x*10).height(h_set+prop_y*10).addClass('aurel_w_rule');
				}				
			}
			break;

		default:
			if (this.options.thumbs == 'on') {
				var	$aurel_slider_thumbs = this.obj.find('.aurel_slider_thumbs'),
					$aurel_slider_thumbs_inner = $aurel_slider_thumbs.find('.aurel_slider_thumbs_inner');

				$aurel_slider_thumbs_inner.removeClass('centered_thumbs');
				if ($aurel_slider_thumbs_inner.height() < $aurel_slider_thumbs.height()) {
					$aurel_slider_thumbs_inner.addClass('centered_thumbs');
				}
			}			
			if (this.obj.hasClass('aurel_single_gallery_slider')) {
				var this_height = aurel_window.height();
				if (jQuery('#wpadminbar').length) {
					this_height = this_height - jQuery('#wpadminbar').height();
				}
				this.obj.height(this_height);
				
			} else if (this.obj.hasClass('auto_height')) {
				var $this_column_wrap = this.obj.parents('.elementor-column-wrap'),
					this_height = this.obj.parents('section.elementor-element').children('.elementor-container').height() - parseInt($this_column_wrap.css('padding-top'),10) - parseInt($this_column_wrap.css('padding-bottom'),10);
				this.obj.height(this_height);
				
			} else if (this.obj.hasClass('screen_height')) {
				var this_height = aurel_window.height();
				if (jQuery('#wpadminbar').length > 0) {
					this_height = this_height - jQuery('#wpadminbar').height();
				}
				if (this.obj.attr('data-header') == 'yes') {
					this_height = this_height - jQuery('header.aurel_main_header').height();
				}
				if (this.obj.attr('data-footer') == 'yes') {
					this_height = this_height - jQuery('footer.aurel_footer').height();
				}
				this_height = Math.ceil(this_height);
				this.obj.height(this_height);
			}
			if (this.obj.hasClass('video_playing')) {
				this.setup.call(this,'vframe');
			}
	}
}

aurel_slider_object.move = function(dir) {
	if (dir > 0)
		this.active_slide++;
	if (dir < 0)
		this.active_slide--;
	if (this.active_slide < 1) 
		this.active_slide = this.options.max;
	if (this.active_slide > this.options.max) 
		this.active_slide = 1;

	this.update.call(this,this.active_slide);
}

aurel_slider_object.update = function(active) {
	this.obj.removeClass('video_playing');
	clearInterval(this.interval);
	
	var aurel_slides = this.obj.find('.aurel_slider_slide'),
		this_active = this.obj.find('[data-count='+ active +']');
	
	aurel_slides.removeClass('active');
	this_active.addClass('active');

	aurel_slides.find('iframe').remove();
	aurel_slides.find('div').remove();

	var counter_text = this.active_slide;
	if (counter_text < 10) 
		counter_text = '0'+counter_text;
	aurel_slider_cur_count.text(counter_text);

	if (this.type == 'media' && !this_active.hasClass('aurel_image_slide')) {
		this.obj.addClass('video_playing');
		if (this_active.attr('data-type') == 'youtube') {
			this.addYT.call(this, this_active);
		} else {
			this.addVimeo.call(this, this_active);
		}
	}

	if (this.options.autoplay == 'on' && !this.obj.hasClass('video_playing')) {
		aurel_slider_object.interval = setInterval("aurel_slider_object.move.call(aurel_slider_object,1)", aurel_slider_object.options.speed);
	}
}

aurel_slider_object.goto = function(slide) {
	this.active_slide = slide;

	if (this.active_slide < 1) 
		this.active_slide = this.options.max;
	if (this.active_slide > this.options.max)
		this.active_slide = 1;

	this.update.call(this,this.active_slide);
}

aurel_slider_object.addYT = function(slide) {
	if (slide == -1) {
		slide = this.obj.find('[data-count='+ this.active_slide +']');
	}
	var player;
	slide.append('<div id="player"></div>');

	if (jQuery('body').find('.aurel_youtube_api').length){
		player = new YT.Player('player', {
			height: '1600',
			width: '900',
			playerVars: { 'rel': 0, 'disablekb': 1 },
			videoId: slide.attr('data-src'),
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
		this.setup.call(this,'vframe');
	} else {
		setTimeout("aurel_slider_object.addYT.call(aurel_slider_object, -1)", 300);
	}
}

aurel_slider_object.addVimeo = function(slide) {
	slide.append('<div id="vimeo_player"></div>');
	var $this = this;
	var vimeo_options = {
		id: slide.attr('data-src'),
		width: '1600',
		loop: false,
		autoplay: true
	};
	var v_player = new Vimeo.Player('vimeo_player', vimeo_options);
	this.setup.call(this,'vframe');
	v_player.on('play', function() {});
	v_player.on('ended', function() {
		$this.obj.removeClass('video_playing');
		if ($this.options.autoplay == 'on') {
			$this.move.call($this,1);
		}
	});
	v_player.on('loaded', function() {
		$this.setup.call($this,'vframe');
	});
}

jQuery(document.documentElement).keyup(function (event) {
	if ((event.keyCode == 37 || event.keyCode == 38)) {
		event.preventDefault();
		aurel_slider_object.move.call(aurel_slider_object,-1);
	}
	if ((event.keyCode == 39 || event.keyCode == 40)) {
		event.preventDefault();
		aurel_slider_object.move.call(aurel_slider_object,1);
	}
});

jQuery(document).ready(function(){
	aurel_slider_object.init.apply(aurel_slider_object);
});

/* 
 * Youtube Iframe API 
 * https://developers.google.com/youtube/iframe_api_reference?hl=en
*/

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
	jQuery('body').append('<div class="aurel_youtube_api"/>');
}
function onPlayerReady(event) {
	event.target.playVideo();
}
function onPlayerStateChange(event) {
	var yt_cut_state = event.data;
	if (yt_cut_state == 0) {
		// Video Ended
		aurel_slider_object.obj.removeClass('video_playing');
		if (aurel_slider_object.options.autoplay == 'on') {
			aurel_slider_object.move.call(aurel_slider_object,1);
		}
	}
	if (yt_cut_state == 1) {
		// Video Played
	}
}