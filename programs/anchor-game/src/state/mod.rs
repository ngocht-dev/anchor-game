// Inside src/state/mod.rs
pub mod game;
pub mod monster;
pub mod player;
 
pub use game::*;      // Expose game state
pub use monster::*;   // Expose monster state
pub use player::*;    // Expose player state

