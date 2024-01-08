extern crate cfg_if;
extern crate wasm_bindgen;
extern crate web_sys;
extern crate rand;

mod utils;

use std::fmt;
use wasm_bindgen::prelude::*;
use web_sys::console;
use rand::Rng;

pub struct Timer<'a> {
    name: &'a str,
}

impl<'a> Timer<'a> {
    pub fn new(name: &'a str) -> Timer<'a> {
        console::time_with_label(name);
        Timer { name }
    }
}

impl<'a> Drop for Timer<'a> {
    fn drop(&mut self) {
        console::time_end_with_label(self.name);
    }
}

#[wasm_bindgen]
#[repr(u8)]
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Cell {
    Dead = 0,
    Alive = 1,
}

#[wasm_bindgen]
#[repr(C)]
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Particle {
    x: f32,
    y: f32,
    v_x: f32,
    v_y: f32 
}

#[wasm_bindgen]
pub struct Line {
    p1_x: f32,
    p2_x: f32,
    p1_y: f32,
    p2_y: f32,
    opacity: f32
}

#[wasm_bindgen]
impl Particle {
    // pub fn get_x(&self) -> u32 {
        // self.x
    // }

    // pub fn get_y(&self) -> u32 {
        // self.y
    // }
}

#[wasm_bindgen]
#[derive(Default)]
pub struct Particles {
    c: Config,

    particles: Vec<Particle>,
    lines: Vec<Line>
}

#[wasm_bindgen]
#[derive(Default)]
pub struct Config {
    opacity: f32,
    num_particles: u32,
    distance: f32,
    width: u32,
    height: u32
}

#[wasm_bindgen]
impl Config {
    // TODO parse js object into rust
    pub fn new(
        opacity: f32,
        num_particles: u32,
        distance: f32,
        width: u32,
        height: u32
    ) -> Self {
        Config {
            opacity,
            num_particles,
            distance,
            width,
            height
        }
    }
}

/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl Particles {
    pub fn tick(&mut self) {
        // let _timer = Timer::new("Universe::tick");

        let mut lines: Vec<Line> = vec!();
        let mut next_particles: Vec<&Particle> = vec!();

        for particle in self.particles.iter_mut() {
            // let mut particle = particle; 
            particle.y += particle.v_y;

            if particle.y >= self.c.height as f32{
                particle.y = self.c.height as f32;
                particle.v_y *= -1.0;
            }
            else if particle.y <= 0.0 {
                particle.y = 0.0;
                particle.v_y *= -1.0;
            }

            particle.x += particle.v_x;
            if particle.x >= self.c.width as f32 {
                particle.x = self.c.width as f32;
                particle.v_x *= -1.0;
            }
            else if particle.x <= 0.0 {
                particle.x = 0.0;
                particle.v_x *= -1.0;
            }


            for p2 in next_particles.iter() {
                let dx = particle.x - p2.x;
                let dy = particle.y - p2.y;
                let dist = (dx*dx + dy*dy).sqrt();

                let opacity_line = self.c.opacity - (dist / (1.0 / self.c.opacity)) / self.c.distance;

                if dist <= self.c.distance {
                    lines.push(Line { 
                        p1_x: particle.x,
                        p2_x: p2.x,
                        p1_y: particle.y,
                        p2_y: p2.y,
                        opacity: opacity_line
                    })
                }
            }

            next_particles.push(particle)
        }
        self.lines = lines;
    }

    pub fn new(c: Config) -> Particles {
        utils::set_panic_hook();

        let mut rng = rand::thread_rng();

        let particles: Vec<Particle> = (0..c.num_particles).map(|_i| {
            Particle {
                x: rng.gen_range(0.0..c.width as f32),
                y: rng.gen_range(0.0..c.height as f32),
                v_x: rng.gen_range(-0.5..0.5),
                v_y: rng.gen_range(-0.5..0.5)
            }
        }).collect();

        Particles {
            c,

            particles,
            lines: vec!()
        }
    }

    pub fn width(&self) -> u32 {
        self.c.width
    }

    /// Set the width of the universe.
    pub fn set_width(&mut self, width: u32) {
        self.c.width = width;
    }

    pub fn height(&self) -> u32 {
        self.c.height
    }

    /// Set the height of the universe.
    pub fn set_height(&mut self, height: u32) {
        self.c.height = height;
    }

    pub fn get_num_particles(&self) -> usize {
        self.particles.len()
    }

    pub fn particles(&self) -> *const Particle {
        self.particles.as_ptr()
    }

    pub fn get_num_lines(&self) -> usize {
        self.lines.len()
    }

    pub fn get_lines(&mut self) -> *const Line {
        self.lines.as_ptr()
        // let mut lines: Vec<Line> = vec!();

        // for (i, p1) in self.particles.iter().enumerate() {
            // for p2 in self.particles.iter().skip(i + 1) {
                // let dx = p1.x - p2.x;
                // let dy = p1.y - p2.y;
                // let dist = (dx*dx + dy*dy).sqrt();

                // let opacity_line = self.c.opacity - (dist / (1.0 / self.c.opacity)) / self.c.distance;

                // if dist <= self.c.distance {
                    // lines.push(Line { 
                        // p1_x: p1.x,
                        // p2_x: p2.x,
                        // p1_y: p1.y,
                        // p2_y: p2.y,
                        // opacity: opacity_line
                    // })
                // }
            // }
        // }
        // let lines_ptr = lines.as_ptr();

        // self.lines = lines;

        // lines_ptr

        // var dx = p1.x - p2.x,
            // dy = p1.y - p2.y,
            // dist = Math.sqrt(dx*dx + dy*dy);

        // /* draw a line between p1 and p2 if the distance between them is under the config distance */
        // if(dist <= pJS.particles.line_linked.distance){

          // var opacity_line = pJS.particles.line_linked.opacity - (dist / (1/pJS.particles.line_linked.opacity)) / pJS.particles.line_linked.distance;

          // if(opacity_line > 0){        
            
            // /* style */
            // var color_line = pJS.particles.line_linked.color_rgb_line;
            // pJS.canvas.ctx.strokeStyle = 'rgba('+color_line.r+','+color_line.g+','+color_line.b+','+opacity_line+')';
            // pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
            // pJS.canvas.ctx.lineCap = 'round'; /* performance issue */
            
            // /* path */
            // pJS.canvas.ctx.beginPath();
            // pJS.canvas.ctx.moveTo(p1.x, p1.y);
            // pJS.canvas.ctx.lineTo(p2.x, p2.y);
            // pJS.canvas.ctx.stroke();
            // pJS.canvas.ctx.closePath();

          // }

        // }
    }

    pub fn particles_vec(&self) -> Vec<Particle> {
        self.particles.clone()
    }
}

impl fmt::Display for Particles {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // for line in self.cells.as_slice().chunks(self.c.width as usize) {
            // for &cell in line {
                // let symbol = if cell == Cell::Dead { '◻' } else { '◼' };
                // write!(f, "{}", symbol)?;
            // }
            // write!(f, "\n")?;
        // }

        Ok(())
    }
}
