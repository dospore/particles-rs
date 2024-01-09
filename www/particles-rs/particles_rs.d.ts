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
* @param {number} height
* @param {number} width
* @param {any} obj
* @returns {Particles}
*/
  static new(height: number, width: number, obj: any): Particles;
/**
* @returns {number}
*/
  width(): number;
/**
* @param {number} width
*/
  set_width(width: number): void;
/**
* @returns {number}
*/
  height(): number;
/**
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
