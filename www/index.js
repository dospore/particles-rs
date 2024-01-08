import { Particles, Cell, Config } from "particles-rs";
import { memory } from "particles-rs/particles_rs_bg";

const pRS = {
  particles: {},
  config: {},
  fn: {
    vendors: {}
  },
  tmp: {}
}

window.pRS = pRS;
window.pJS = config;
// pRS.config = config;

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("particles-rs");

/* CONSTANTS */
const particleSize = 16; // bytes
const lineSize = 20 // bytes

// Construct the pRs, and get its width and height.
const ctx = canvas.getContext('2d');
let animationId = null;

pRS.fn.init = () => {
  config.particles.line_linked.color_rgb_line = hexToRgb(config.particles.line_linked.color);

  const rsConfig = Config.new(
    config.particles.line_linked.opacity,
    config.particles.number.value,
    config.particles.line_linked.distance,
    canvas.width,
    canvas.height
  );

  pRS.particles = Particles.new(rsConfig);
}

pRS.fn.start = () => {
  pRS.fn.renderLoop();
};

pRS.fn.stop = () => {
  cancelAnimationFrame(animationId);
}

pRS.fn.particlesRefresh = () => {
  pRS.fn.stop();

  pRS.fn.retinaInit();

  pRS.fn.init();

  pRS.fn.start();
}

pRS.fn.renderLoop = () => {
  pRS.fn.clearPage();
  pRS.fn.drawCells();

  pRS.particles.tick();

  pRS.tmp.count = pRS.particles.get_num_particles();

  animationId = requestAnimationFrame(pRS.fn.renderLoop);
};

const parseParticle = (ptr) => {
  let pos = new Float32Array(memory.buffer, ptr, 2);
  // let velocity = new Float32Array(memory.buffer, ptr + 8, 2);

  return ({
    x: pos[0],
    y: pos[1],
    // vX: velocity[0],
    // vY: velocity[1],
  })
}

pRS.fn.clearPage = () => {
  ctx.beginPath();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.closePath();
}

pRS.fn.drawCells = () => {
  const numLines = pRS.particles.get_num_lines();
  const linesPtr = pRS.particles.get_lines();

  const halfCell = config.particles.size.value / 2;
  for (let i = 0; i < numLines; i++) {
    let offset = lineSize * i;
    let p = new Float32Array(memory.buffer, linesPtr + offset, 5);
    const opacity_line = p[4];

    if(opacity_line > 0) {
      const color_line = config.particles.line_linked.color_rgb_line;
      ctx.strokeStyle = 'rgba('+color_line.r+','+color_line.g+','+color_line.b+','+opacity_line+')';
      ctx.lineWidth = config.particles.line_linked.width;
      // ctx.lineCap = 'round'; /* performance issue */

      ctx.beginPath();
      ctx.moveTo(p[0] + halfCell, p[2] + halfCell);
      ctx.lineTo(p[1] + halfCell, p[3] + halfCell);
      ctx.stroke();
      ctx.closePath();
    }
  }

  const particlesPtr = pRS.particles.particles();

  ctx.fillStyle = config.particles.color.value;
  for (let i = 0; i < config.particles.number.value; i++) {
    ctx.beginPath();
    let offset = particleSize * i;
    let p = parseParticle(particlesPtr + offset);

    // TODO move this into rust
    // const radius = (config.particles.size.random ? Math.random() : 1) * config.particles.size.value;

    const radius = config.particles.size.value;

    switch(config.particles.shape.type) {
      case 'circle':
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
      break;

      case 'edge':
        ctx.rect(p.x-radius, p.y-radius, radius*2, radius*2);
      break;

      case 'triangle':
        pRS.fn.vendors.drawShape(ctx, p.x-radius, p.y+radius / 1.66, radius*2, 3, 2);
      break;

      case 'polygon':
        pRS.fn.vendors.drawShape(
          ctx,
          p.x - radius / (config.particles.shape.polygon.nb_sides/3.5), // startX
          p.y - radius / (2.66/3.5), // startY
          radius*2.66 / (config.particles.shape.polygon.nb_sides/3), // sideLength
          config.particles.shape.polygon.nb_sides, // sideCountNumerator
          1 // sideCountDenominator
        );
      break;

      case 'star':
        pRS.fn.vendors.drawShape(
          ctx,
          p.x - radius*2 / (config.particles.shape.polygon.nb_sides/4), // startX
          p.y - radius / (2*2.66/3.5), // startY
          radius*2*2.66 / (config.particles.shape.polygon.nb_sides/3), // sideLength
          config.particles.shape.polygon.nb_sides, // sideCountNumerator
          2 // sideCountDenominator
        );
      break;
      // case 'image':

        // function draw(){
          // pJS.canvas.ctx.drawImage(
            // img_obj,
            // p.x-radius,
            // p.y-radius,
            // radius*2,
            // radius*2 / p.img.ratio
          // );
        // }

        // if(pJS.tmp.img_type == 'svg'){
          // var img_obj = p.img.obj;
        // }else{
          // var img_obj = pJS.tmp.img_obj;
        // }

        // if(img_obj){
          // draw();
        // }

      // break;
    }

    ctx.closePath();
    ctx.fill();
  }
};


pRS.fn.retinaInit = () => {
  if(config.retina_detect && window.devicePixelRatio > 1){
    canvas.pxratio = window.devicePixelRatio; 
    // pJS.tmp.retina = true;
  } else{
    canvas.pxratio = 1;
    // pJS.tmp.retina = false;
  }

  canvas.width = canvas.offsetWidth * canvas.pxratio;
  canvas.height = canvas.offsetHeight * canvas.pxratio;

  config.particles.size.value = config.tmp.obj.size_value * canvas.pxratio;
  // config.particles.size.anim.speed = pJS.tmp.obj.size_anim_speed * pJS.canvas.pxratio;
  config.particles.move.speed = config.tmp.obj.move_speed * canvas.pxratio;
  config.particles.line_linked.distance = config.tmp.obj.line_linked_distance * canvas.pxratio;
  // config.interactivity.modes.grab.distance = pJS.tmp.obj.mode_grab_distance * pJS.canvas.pxratio;
  // config.interactivity.modes.bubble.distance = pJS.tmp.obj.mode_bubble_distance * pJS.canvas.pxratio;
  config.particles.line_linked.width = config.tmp.obj.line_linked_width * canvas.pxratio;
  // config.interactivity.modes.bubble.size = pJS.tmp.obj.mode_bubble_size * pJS.canvas.pxratio;
  // config.interactivity.modes.repulse.distance = pJS.tmp.obj.mode_repulse_distance * pJS.canvas.pxratio;

};

pRS.fn.vendors.drawShape = function(c, startX, startY, sideLength, sideCountNumerator, sideCountDenominator) {
  // By Programming Thomas - https://programmingthomas.wordpress.com/2013/04/03/n-sided-shapes/
  var sideCount = sideCountNumerator * sideCountDenominator;
  var decimalSides = sideCountNumerator / sideCountDenominator;
  var interiorAngleDegrees = (180 * (decimalSides - 2)) / decimalSides;
  var interiorAngle = Math.PI - Math.PI * interiorAngleDegrees / 180; // convert to radians
  c.save();
  c.beginPath();
  c.translate(startX, startY);
  c.moveTo(0,0);
  for (var i = 0; i < sideCount; i++) {
    c.lineTo(sideLength,0);
    c.translate(sideLength,0);
    c.rotate(interiorAngle);
  }
  //c.stroke();
  c.fill();
  c.restore();

};

canvas.addEventListener("click", event => {
  // const boundingRect = canvas.getBoundingClientRect();

  // const scaleX = canvas.width / boundingRect.width;
  // const scaleY = canvas.height / boundingRect.height;

  // const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
  // const canvasTop = (event.clientY - boundingRect.top) * scaleY;

  // const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
  // const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

  // pRS.particles.toggle_cell(row, col);

  // pRS.fn.drawCells();
  // pRS.fn.clearPage();
});

pRS.fn.retinaInit();
pRS.fn.init();
pRS.fn.start();
