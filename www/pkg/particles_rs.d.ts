/* tslint:disable */
/* eslint-disable */
/**
*/
export enum Cell {
  Dead = 0,
  Alive = 1,
}
/**
*/
export class Config {
  free(): void;
/**
* @param {number} opacity
* @param {number} num_particles
* @param {number} distance
* @param {number} width
* @param {number} height
* @returns {Config}
*/
  static new(opacity: number, num_particles: number, distance: number, width: number, height: number): Config;
}
/**
*/
export class Line {
  free(): void;
}
/**
*/
export class Particle {
  free(): void;
}
/**
*/
export class Particles {
  free(): void;
/**
*/
  tick(): void;
/**
* @param {Config} c
* @returns {Particles}
*/
  static new(c: Config): Particles;
/**
* @returns {number}
*/
  width(): number;
/**
* Set the width of the universe.
* @param {number} width
*/
  set_width(width: number): void;
/**
* @returns {number}
*/
  height(): number;
/**
* Set the height of the universe.
* @param {number} height
*/
  set_height(height: number): void;
/**
* @returns {number}
*/
  get_num_particles(): number;
/**
* @returns {number}
*/
  particles(): number;
/**
* @returns {number}
*/
  get_num_lines(): number;
/**
* @returns {number}
*/
  get_lines(): number;
/**
* @returns {(Particle)[]}
*/
  particles_vec(): (Particle)[];
}
