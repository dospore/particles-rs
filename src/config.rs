// use web_sys::{
    // Element,
    // Document
// };

use wasm_bindgen::prelude::*;
// use js_sys::JsString;
use serde::{Deserialize, Deserializer};
// use serde_json::{Result as JsonResult, Value as JsonValue};
use gloo_utils::format::JsValueSerdeExt;
use gloo_console::log;

macro_rules! deserialize_mode {
    ($name:ident, $first_variant:ident => $first_value:expr $(, $variant:ident => $value:expr)*) => {
        #[derive(Debug, Default)]
        enum $name {
            #[default]
            $first_variant,
            $($variant),*
        }

        impl<'de> Deserialize<'de> for $name {
            fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
            where
                D: Deserializer<'de>,
            {
                let s: String = Deserialize::deserialize(deserializer)?;
                match s.as_str() {
                    $first_value => Ok($name::$first_variant),
                    $($value => Ok($name::$variant),)*
                    _ => Err(serde::de::Error::custom("Invalid enum value")),
                }
            }
        }
    };
}

deserialize_mode!(
    OnHoverMode,
    Repulse => "repulse",
    Bubble => "bubble",
    Grab => "grab"
);

deserialize_mode!(
    OutMode,
    Bounce => "bounce",
    Out => "out"
);

deserialize_mode!(
    OnClickMode,
    Push => "push",
    Remove => "remove",
    Repulse => "repulse",
    Bubble => "bubble"
);

// This is a port from the original package written in js
// Author : Vincent Garreau  - vincentgarreau.com
// MIT license: http://opensource.org/licenses/MIT
// Demo / Generator : vincentgarreau.com/particles.js
// GitHub : github.com/VincentGarreau/particles.js
// How to use? : Check the GitHub README
// v2.0.0

// #[derive(Debug, Deserialize)]
// struct Canvas {
//     el: String,
//     w: u32,
//     h: u32,
// }

#[derive(Debug, Default, Deserialize)]
struct Density {
    enable: bool,
    value_area: u32,
}

#[derive(Debug, Default, Deserialize)]
pub struct Number {
    pub value: u32,
    density: Density,
}

#[derive(Debug, Default, Deserialize)]
struct Stroke {
    width: u32,
    color: String,
}

#[derive(Debug, Default, Deserialize)]
struct Polygon {
    nb_sides: u32,
}

#[derive(Debug, Default, Deserialize)]
struct Shape {
    r#type: String,
    stroke: Stroke,
    polygon: Polygon,
    image: Image
}

#[derive(Debug, Default, Deserialize)]
struct Image {
    src: String,
    width: u32,
    height: u32,
}

#[derive(Debug, Default, Deserialize)]
struct ParticleOpacityAnimation {
    enable: bool,
    speed: f32,
    opacity_min: f32,
    sync: bool
}

#[derive(Debug, Default, Deserialize)]
struct ParticleOpacity {
    value: f32,
    random: bool,
    anim: ParticleOpacityAnimation
}

#[derive(Debug, Default, Deserialize)]
struct ParticleSizeAnimation {
    enable: bool,
    speed: f32,
    size_min: f32,
    sync: bool
}

#[derive(Debug, Default, Deserialize)]
struct ParticleSize {
    value: f32,
    random: bool,
    anim: ParticleSizeAnimation
}

#[derive(Debug, Default, Deserialize)]
pub struct LineLinked {
    enable: bool,
    pub distance: f32,
    color: String,
    pub opacity: f32,
    width: f32,
}

#[derive(Debug, Default, Deserialize)]
struct Attract {
    enable: bool,
    rotateX: f32,
    rotateY: f32,
}

#[derive(Debug, Default, Deserialize)]
pub struct Movement {
    pub enable: bool,
    pub speed: f32,
    direction: String,
    random: bool,
    straight: bool,
    out_mode: OutMode,
    attract: Attract,
}

#[derive(Debug, Default, Deserialize)]
struct Color {
    value: String
}

#[derive(Debug, Default, Deserialize)]
pub struct Particles {
    pub number: Number,
    color: Color,
    shape: Shape,
    opacity: ParticleOpacity,
    size: ParticleSize,
    pub line_linked: LineLinked,
    pub r#move: Movement,
}

#[derive(Debug, Default, Deserialize)]
struct OnHover {
    enable: bool,
    mode: OnHoverMode,
}

#[derive(Debug, Default, Deserialize)]
struct OnClick {
    enable: bool,
    mode: OnClickMode,
}

#[derive(Debug, Default, Deserialize)]
struct Events {
    onhover: OnHover,
    onclick: OnClick,
    resize: bool,
}

#[derive(Debug, Default, Deserialize)]
struct GrabLineLinked {
    opacity: u32
}


#[derive(Debug, Default, Deserialize)]
struct Remove {
    particles_nb: u32
}

#[derive(Debug, Default, Deserialize)]
struct Modes {
    grab: Grab,
    bubble: Bubble,
    repulse: Repulse,
    push: Push,
    remove: Remove,
}

#[derive(Debug, Default, Deserialize)]
pub struct Interactivity {
    detect_on: String,
    events: Events,
    modes: Modes
}

#[derive(Debug, Deserialize, Default)]
pub struct ParticleConfig {
    pub particles: Particles,
    pub interactivity: Interactivity,
    // retina_detect: bool,
    // config_demo: TODO
}

#[derive(Debug, Default, Deserialize)]
struct Func {
    interact: Interact,
    modes: Modes,
    vendors: Vendors,
}

// MDOES
#[derive(Debug, Default, Deserialize)]
struct Grab {
    distance: u32,
    line_linked: GrabLineLinked,
}

#[derive(Debug, Default, Deserialize)]
struct Bubble {
    distance: u32,
    size: u32,
    duration: u32,
    opacity: u32,
    speed: u32
}

#[derive(Debug, Default, Deserialize)]
struct Repulse {
    distance: u32,
}

#[derive(Debug, Default, Deserialize)]
struct Push {
    particles_nb: u32
}

#[derive(Debug, Default, Deserialize)]
struct Interact {}

#[derive(Debug, Default, Deserialize)]
struct Vendors {}

#[derive(Debug, Default, Deserialize)]
struct Mouse {}

#[derive(Debug, Default, Deserialize)]
struct Tmp {}

pub fn parse_config(obj: JsValue) -> ParticleConfig {
    // let id_info: String = format!("Initialising particles - {}", id.as_string().unwrap_or(String::from("Unknown")));
    // log!(id_info.as_str());
    log!(&obj);

    let parsed: ParticleConfig = obj.into_serde().unwrap();
    parsed
}

// {
//     "interactivity": {
//         "detect_on": "canvas",
//         "events": {
//             "onhover": {
//                 "enable": true,
//                 "mode": "repulse"
//             },
//             "onclick": {
//                 "enable": true,
//                 "mode": "push"
//             },
//             "resize": true
//         },
//         "modes": {
//             "grab": {
//                 "distance": 400,
//                 "line_linked": {
//                     "opacity": 1
//                 }
//             },
//             "bubble": {
//                 "distance": 400,
//                 "size": 40,
//                 "duration": 2,
//                 "opacity": 8,
//                 "speed": 3
//             },
//             "repulse": {
//                 "distance": 200
//             },
//             "push": {
//                 "particles_nb": 4
//             },
//             "remove": {
//                 "particles_nb": 2
//             }
//         }
//     },
//     "retina_detect": true,
//     "config_demo": {
//         "hide_card": false,
//         "background_color": "#b61924",
//         "background_image": "",
//         "background_position": "50% 50%",
//         "background_repeat": "no-repeat",
//         "background_size": "cover"
//     }
// }
