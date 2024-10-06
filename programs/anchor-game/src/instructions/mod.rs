// Inside src/instructions/mod.rs
pub mod attack_monster;
pub mod collect_points;
pub mod create_game;
pub mod create_player;
pub mod spawn_monster;

pub use attack_monster::*; // Expose attack_monster functions
pub use collect_points::*; // Expose collect_points functions
pub use create_game::*; // Expose create_game functions
pub use create_player::*; // Expose create_player functions
pub use spawn_monster::*; // Expose spawn_monster functions