extern crate cfg_if;
extern crate wasm_bindgen;
extern crate web_sys;
extern crate rand;
extern crate js_sys;
extern crate serde;
extern crate serde_json;
extern crate gloo_utils;
extern crate gloo_console;

mod utils;
pub mod config;

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
    c: config::ParticleConfig,
    height: u32,
    width: u32,

    particles: Vec<Particle>,
    lines: Vec<Line>
}

/// Public methods, exported to JavaScript.
#[wasm_bindgen]
impl Particles {
    pub fn tick(&mut self) {
        // let _timer = Timer::new("Universe::tick");

        let mut lines: Vec<Line> = vec!();
        let mut next_particles: Vec<&Particle> = vec!();

        let (distance, opacity) = self.get_line_details();
        let move_enabled = self.c.particles.r#move.enable;
        let speed = self.c.particles.r#move.speed / 2.0;

        if !move_enabled {
            return
        }

        for particle in self.particles.iter_mut() {

            particle.y += speed * particle.v_y;

            if particle.y >= self.height as f32{
                particle.y = self.height as f32;
                particle.v_y *= -1.0;
            }
            else if particle.y <= 0.0 {
                particle.y = 0.0;
                particle.v_y *= -1.0;
            }

            particle.x += speed * particle.v_x;
            if particle.x >= self.width as f32 {
                particle.x = self.width as f32;
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

                let opacity_line = opacity - (dist / (1.0 / opacity)) / distance;

                if dist <= distance {
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

    pub fn new(height: u32, width: u32, obj: JsValue) -> Particles {
        utils::set_panic_hook();

        let c = config::parse_config(obj);

        let mut rng = rand::thread_rng();

        let particles: Vec<Particle> = (0..c.particles.number.value).map(|_i| {
            Particle {
                x: rng.gen_range(0.0..width as f32),
                y: rng.gen_range(0.0..height as f32),
                v_x: rng.gen_range(-0.5..0.5),
                v_y: rng.gen_range(-0.5..0.5)
            }
        }).collect();

        Particles {
            c,
            height,
            width,

            particles,
            lines: vec!()
        }
    }

    pub fn width(&self) -> u32 {
        self.width
    }

    pub fn set_width(&mut self, width: u32) {
        self.width = width;
    }

    pub fn height(&self) -> u32 {
        self.height
    }

    pub fn set_height(&mut self, height: u32) {
        self.height = height;
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
    }

    pub fn particles_vec(&self) -> Vec<Particle> {
        self.particles.clone()
    }

    fn get_line_details (&mut self) -> (f32, f32) {
        (
            self.c.particles.line_linked.distance,
            self.c.particles.line_linked.opacity,
        )
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
