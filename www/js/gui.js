function loadGui () {
    var f, ff, fm, fmm, gui_f, initPage, resizeGUI;
    window.p = {};
    p.exportConfig = function(type) {
      var data, data_css, pRS_GUI_Export, pRS_GUI_tmp, ratio;
      pRS_GUI_Export = {};
      pRS_GUI_tmp = window.pRS_GUI;
      Object.deepExtend(pRS_GUI_Export, pRS_GUI_tmp);
      ratio = pRS_GUI_tmp.canvas.pxratio;
      pRS_GUI_Export.particles.size.value = pRS_GUI_tmp.particles.size.value / ratio;
      pRS_GUI_Export.particles.size.anim.speed = pRS_GUI_tmp.particles.size.anim.speed / ratio;
      pRS_GUI_Export.particles.move.speed = pRS_GUI_tmp.particles.move.speed / ratio;
      pRS_GUI_Export.particles.line_linked.distance = pRS_GUI_tmp.particles.line_linked.distance / ratio;
      pRS_GUI_Export.interactivity.modes.grab.distance = pRS_GUI_tmp.interactivity.modes.grab.distance / ratio;
      pRS_GUI_Export.interactivity.modes.bubble.distance = pRS_GUI_tmp.interactivity.modes.bubble.distance / ratio;
      pRS_GUI_Export.particles.line_linked.width = pRS_GUI_tmp.particles.line_linked.width / ratio;
      pRS_GUI_Export.interactivity.modes.bubble.size = pRS_GUI_tmp.interactivity.modes.bubble.size / ratio;
      pRS_GUI_Export.interactivity.modes.repulse.distance = pRS_GUI_tmp.interactivity.modes.repulse.distance / ratio;
      data_css = pRS_GUI_Export.config_demo;
      delete pRS_GUI_Export.config_demo;
      delete pRS_GUI_Export.canvas;
      delete pRS_GUI_Export.fn;
      delete pRS_GUI_Export.tmp;
      delete pRS_GUI_Export.particles.array;
      delete pRS_GUI_Export.interactivity.el;
      delete pRS_GUI_Export.interactivity.mouse;
      delete pRS_GUI_Export.interactivity.status;
      delete pRS_GUI_Export.particles.color.rgb;
      delete pRS_GUI_Export.particles.line_linked.color_rgb_line;
      if (type === 'json') {
        return console.save(pRS_GUI_Export, 'particlesjs-config.json');
      } else {
        data = {
          js: pRS_GUI_Export,
          css: data_css
        };
        return data;
      }
    };
    p.exportConfigJSON = function() {
      return p.exportConfig('json');
    };
    p.update = function() {
		window.pRS.fn.particlesRefresh()
    };
    window.gui = new dat.GUI({
      autoPlace: true,
      closed: false,
      width: 340
    });
    window.pRS_GUI = config;
    window.page_settings = {
      hide_card: false,
      background_color: '#111',
      background_image: 'http://globe-views.com/dcim/dreams/image/image-03.jpg'
    };
    gui_f = {
      particles: gui.addFolder('particles'),
      interactivity: gui.addFolder('interactivity'),
      pagecss: gui.addFolder('page background (css)')
    };
    f = {
      particles: {
        number: gui_f.particles.addFolder('number'),
        color: gui_f.particles.addFolder('color'),
        shape: gui_f.particles.addFolder('shape'),
        size: gui_f.particles.addFolder('size'),
        opacity: gui_f.particles.addFolder('opacity'),
        line_linked: gui_f.particles.addFolder('line_linked'),
        move: gui_f.particles.addFolder('move')
      },
      interactivity: {
        events_onhover: gui_f.interactivity.addFolder('onhover'),
        events_onclick: gui_f.interactivity.addFolder('onclick'),
        modes: gui_f.interactivity.addFolder('modes')
      }
    };
    ff = {
      shape_stroke: f.particles.shape.addFolder('stroke'),
      shape_polygon: f.particles.shape.addFolder('polygon'),
      shape_image: f.particles.shape.addFolder('image'),
      size_anim: f.particles.size.addFolder('anim'),
      opacity_anim: f.particles.opacity.addFolder('anim')
    };
    fm = {
      grab: f.interactivity.modes.addFolder('grab'),
      bubble: f.interactivity.modes.addFolder('bubble'),
      repulse: f.interactivity.modes.addFolder('repulse'),
      push: f.interactivity.modes.addFolder('push'),
      remove: f.interactivity.modes.addFolder('remove')
    };
    fmm = {
      grab_linelinked: fm.grab.addFolder('line_linked')
    };
    gui.add(pRS_GUI, 'retina_detect').name('retina_detect').onChange(function(value) {
      pRS_GUI.retina_detect = value;
      return p.update();
    });
    f.particles.number.add(pRS_GUI.particles.number, 'value', 0, 1200).name('value').step(1).onChange(function(value) {
      pRS_GUI.particles.number.value = value;
      return p.update();
    });
    f.particles.number.add(pRS_GUI.particles.number.density, 'enable').name('density.enable').onChange(function(value) {
      pRS_GUI.particles.number.density.enable = value;
      return p.update();
    });
    f.particles.number.add(pRS_GUI.particles.number.density, 'value_area', 0, 10000).name('density.value_area').onChange(function(value) {
      pRS_GUI.particles.number.density.value_area = value;
      return p.update();
    });
    f.particles.color.addColor(pRS_GUI.particles.color, 'value').name('value (single string)').onChange(function(value) {
      pRS_GUI.particles.color.value = value;
      return p.update();
    });
    f.particles.shape.add(pRS_GUI.particles.shape, 'type', ['circle', 'edge', 'triangle', 'polygon', 'star', 'image']).name('type').onChange(function(value) {
      pRS_GUI.particles.shape.type = value;
      return p.update();
    });
    ff.shape_polygon.add(pRS_GUI.particles.shape.polygon, 'nb_sides', 3, 12).step(1).name('polygon.nb_sides').onChange(function(value) {
      pRS_GUI.particles.shape.polygon.nb_sides = value;
      return p.update();
    });
    ff.shape_stroke.add(pRS_GUI.particles.shape.stroke, 'width', 0, 20).step(1).name('stroke.width').onChange(function(value) {
      pRS_GUI.particles.shape.stroke.width = value;
      return p.update();
    });
    ff.shape_stroke.addColor(pRS_GUI.particles.shape.stroke, 'color').name('stroke.color').onChange(function(value) {
      pRS_GUI.particles.shape.stroke.color = value;
      return p.update();
    });
    ff.shape_image.add(pRS_GUI.particles.shape.image, 'src').name('image.src').onChange(function(value) {
      var type;
      pRS_GUI.particles.shape.image.src = value;
      if (pRS_GUI.particles.shape.type === 'image') {
        type = value.substr(value.length - 3);
        if (type === 'svg' && value !== 'svg/github.svg') {
          alert("Ajax request is necessary for loading SVG files. You can type this example into the 'image.src' input to solve the CORS issue: 'svg/github.svg'");
        }
      }
      return p.update();
    });
    ff.shape_image.add(pRS_GUI.particles.shape.image, 'width').name('image.width').onChange(function(value) {
      pRS_GUI.particles.shape.image.width = value;
      return p.update();
    });
    ff.shape_image.add(pRS_GUI.particles.shape.image, 'height').name('image.height').onChange(function(value) {
      pRS_GUI.particles.shape.image.height = value;
      return p.update();
    });
    f.particles.size.add(pRS_GUI.tmp.obj, 'size_value', 0, 500).name('value').onChange(function(value) {
      pRS_GUI.tmp.obj.size_value = value;
      return p.update();
    });
    f.particles.size.add(pRS_GUI.particles.size, 'random').name('random').onChange(function(value) {
      pRS_GUI.particles.size.random = value;
      return p.update();
    });
    ff.size_anim.add(pRS_GUI.particles.size.anim, 'enable').name('anim.enable').onChange(function(value) {
      pRS_GUI.particles.size.anim.enable = value;
      return p.update();
    });
    // ff.size_anim.add(pRS_GUI.tmp.obj, 'size_anim_speed', 0, 300).name('anim.speed').onChange(function(value) {
      // pRS_GUI.tmp.obj.size_anim_speed = value;
      // return p.update();
    // });
    ff.size_anim.add(pRS_GUI.particles.size.anim, 'size_min', 0, 100).name('anim.size_min').onChange(function(value) {
      pRS_GUI.particles.size.anim.size_min = value;
      return p.update();
    });
    ff.size_anim.add(pRS_GUI.particles.size.anim, 'sync').name('anim.sync').onChange(function(value) {
      pRS_GUI.particles.size.anim.sync = value;
      return p.update();
    });
    f.particles.opacity.add(pRS_GUI.particles.opacity, 'value', 0, 1).name('value').onChange(function(value) {
      pRS_GUI.particles.opacity.value = value;
      return p.update();
    });
    f.particles.opacity.add(pRS_GUI.particles.opacity, 'random').name('random').onChange(function(value) {
      pRS_GUI.particles.opacity.random = value;
      return p.update();
    });
    ff.opacity_anim.add(pRS_GUI.particles.opacity.anim, 'enable').name('anim.enable').onChange(function(value) {
      pRS_GUI.particles.opacity.anim.enable = value;
      return p.update();
    });
    ff.opacity_anim.add(pRS_GUI.particles.opacity.anim, 'speed', 0, 10).name('anim.speed').onChange(function(value) {
      pRS_GUI.particles.opacity.anim.speed = value;
      return p.update();
    });
    ff.opacity_anim.add(pRS_GUI.particles.opacity.anim, 'opacity_min', 0, 1).name('anim.opacity_min').onChange(function(value) {
      pRS_GUI.particles.opacity.anim.opacity_min = value;
      return p.update();
    });
    ff.opacity_anim.add(pRS_GUI.particles.opacity.anim, 'sync').name('anim.sync').onChange(function(value) {
      pRS_GUI.particles.opacity.anim.sync = value;
      return p.update();
    });

    f.particles.line_linked.add(pRS_GUI.particles.line_linked, 'enable').name('enable_auto').onChange(function(value) {
      pRS_GUI.particles.line_linked.enable = value;
      return p.update();
    });
    f.particles.line_linked.add(pRS_GUI.tmp.obj, 'line_linked_distance', 0, 2000).name('distance').onChange(function(value) {
      pRS_GUI.tmp.obj.line_linked_distance = value;
      return p.update();
    });
    f.particles.line_linked.addColor(pRS_GUI.particles.line_linked, 'color').name('color').onChange(function(value) {
      pRS_GUI.particles.line_linked.color = value;
      return p.update();
    });
    f.particles.line_linked.add(pRS_GUI.particles.line_linked, 'opacity', 0, 1).name('opacity').onChange(function(value) {
      pRS_GUI.particles.line_linked.opacity = value;
      return p.update();
    });
    f.particles.line_linked.add(pRS_GUI.tmp.obj, 'line_linked_width', 0, 20).name('width').onChange(function(value) {
      pRS_GUI.tmp.obj.line_linked_width = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move, 'enable').name('enable').onChange(function(value) {
      pRS_GUI.particles.move.enable = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move, 'direction', ['none', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left', 'top-left']).name('direction').onChange(function(value) {
      pRS_GUI.particles.move.direction = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move, 'random').name('random').onChange(function(value) {
      pRS_GUI.particles.move.random = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move, 'straight').name('straight').onChange(function(value) {
      pRS_GUI.particles.move.straight = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.tmp.obj, 'move_speed', 0, 200).name('speed').onChange(function(value) {
      pRS_GUI.tmp.obj.move_speed = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move, 'out_mode', ['out', 'bounce']).name('out_mode').onChange(function(value) {
      pRS_GUI.particles.move.out_mode = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move.attract, 'enable').name('attract.enable').onChange(function(value) {
      pRS_GUI.particles.move.attract.enable = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move.attract, 'rotateX', 0, 10000).name('attract.rotateX').onChange(function(value) {
      pRS_GUI.particles.move.attract.rotateX = value;
      return p.update();
    });
    f.particles.move.add(pRS_GUI.particles.move.attract, 'rotateY', 0, 10000).name('attract.rotateY').onChange(function(value) {
      pRS_GUI.particles.move.attract.rotateY = value;
      return p.update();
    });
    gui_f.interactivity.add(pRS_GUI.interactivity, 'detect_on', ['window', 'canvas']).name('detect_on').onChange(function(value) {
      pRS_GUI.interactivity.detect_on = value;
      return p.update();
    });
    f.interactivity.events_onhover.add(pRS_GUI.interactivity.events.onhover, 'enable').name('enable').onChange(function(value) {
      pRS_GUI.interactivity.events.onhover.enable = value;
      return p.update();
    });
    f.interactivity.events_onhover.add(pRS_GUI.interactivity.events.onhover, 'mode', ['grab', 'bubble', 'repulse']).name('mode').onChange(function(value) {
      pRS_GUI.interactivity.events.onhover.mode = value;
      return p.update();
    });
    f.interactivity.events_onclick.add(pRS_GUI.interactivity.events.onclick, 'enable').name('enable').onChange(function(value) {
      pRS_GUI.interactivity.events.onclick.enable = value;
      return p.update();
    });
    f.interactivity.events_onclick.add(pRS_GUI.interactivity.events.onclick, 'mode', ['push', 'remove', 'bubble', 'repulse']).name('mode').onChange(function(value) {
      pRS_GUI.interactivity.events.onclick.mode = value;
      return p.update();
    });
    // fm.grab.add(pRS_GUI.tmp.obj, 'mode_grab_distance', 0, 1500).name('distance').onChange(function(value) {
      // pRS_GUI.tmp.obj.mode_grab_distance = value;
      // return p.update();
    // });
    fmm.grab_linelinked.add(pRS_GUI.interactivity.modes.grab.line_linked, 'opacity', 0, 1).name('opacity').onChange(function(value) {
      pRS_GUI.interactivity.modes.grab.line_linked.opacity = value;
      return p.update();
    });
    // fm.bubble.add(pRS_GUI.tmp.obj, 'mode_bubble_distance', 0, 1500).name('distance').onChange(function(value) {
      // pRS_GUI.tmp.obj.mode_bubble_distance = value;
      // return p.update();
    // });
    // fm.bubble.add(pRS_GUI.tmp.obj, 'mode_bubble_size', 0, 500).name('size').onChange(function(value) {
      // pRS_GUI.tmp.obj.mode_bubble_size = value;
      // return p.update();
    // });
    fm.bubble.add(pRS_GUI.interactivity.modes.bubble, 'opacity', 0, 1).name('opacity').onChange(function(value) {
      pRS_GUI.interactivity.modes.bubble.opacity = value;
      return p.update();
    });
    fm.bubble.add(pRS_GUI.interactivity.modes.bubble, 'duration', 0, 10).name('duration (sec)').onChange(function(value) {
      pRS_GUI.interactivity.modes.bubble.duration = value;
      return p.update();
    });
    // fm.repulse.add(pRS_GUI.tmp.obj, 'mode_repulse_distance', 0, 1000).name('distance').onChange(function(value) {
      // pRS_GUI.tmp.obj.mode_repulse_distance = value;
      // return p.update();
    // });
    gui_f.pagecss.addColor(pRS_GUI.config_demo, 'background_color').name('background-color').onChange(function(value) {
      return $('#particles-rs').css('background-color', value);
    });
    gui_f.pagecss.add(pRS_GUI.config_demo, 'background_image').name('background-image url').onChange(function(value) {
      return $('#particles-rs').css('background-image', 'url(' + value + ')');
    });
    gui_f.pagecss.add(pRS_GUI.config_demo, 'background_size').name('background-size').onChange(function(value) {
      return $('#particles-rs').css('background-size', value);
    });
    gui_f.pagecss.add(pRS_GUI.config_demo, 'background_position').name('background-position').onChange(function(value) {
      return $('#particles-rs').css('background-position', value);
    });
    gui_f.pagecss.add(pRS_GUI.config_demo, 'background_repeat').name('background-repeat').onChange(function(value) {
      return $('#particles-rs').css('background-repeat', value);
    });
    gui_f.pagecss.add(pRS_GUI.config_demo, 'hide_card').name('hide card').onChange(function(value) {
      if (value) {
        $('.panel').fadeOut(200);
        return $('.js-box-bottom').fadeIn(200);
      } else {
        $('.panel').fadeIn(200);
        return $('.js-box-bottom').fadeOut(200);
      }
    });
    // gui.add(pRS_GUI.fn.vendors, 'exportImg').name('→ Export image (png)');
    gui.add(p, 'exportConfigJSON').name('→ Download current config (json)');
    initPage = function() {
      var box_bottom, config, page, panel;
      page = $(pRS_GUI.canvas.el).parent();
      panel = $('.panel');
      config = pRS_GUI.config_demo;
      box_bottom = $('.js-box-bottom');
      page.css({
        'background-color': config.background_color,
        'background-image': 'url(' + config.background_image + ')',
        'background-size': config.background_size,
        'background-repeat': config.background_repeat,
        'background-position': config.background_position
      });
      if (config.hide_card) {
        panel.css('display', 'none');
        box_bottom.css('display', 'block');
      } else {
        panel.css('display', 'block');
        box_bottom.css('display', 'none');
      }
      $('#loader').fadeOut(300);
      return $('body').addClass('loaded');
    };
    initPage();
    resizeGUI = function() {
      return $('.dg.main > ul').css('max-height', window.innerHeight - 105);
    };
    resizeGUI();
    $(window).on('resize', function() {
      return resizeGUI();
    });
    return $('.close-button').on('click', function() {
      return $('.box-top').css('width', $('.dg.main').width());
    });
}
