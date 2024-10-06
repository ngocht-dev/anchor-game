// Inside `state/player.rs`
use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Player {
    // 8 bytes
    pub player: Pubkey, // 32 bytes
    pub game: Pubkey,   // 32 bytes

    pub action_points_spent: u64,           // 8 bytes
    pub action_points_to_be_collected: u64, // 8 bytes

    pub status_flag: u8,         // 8 bytes
    pub experience: u64,         // 8 bytes
    pub kills: u64,              // 8 bytes
    pub next_monster_index: u64, // 8 bytes
    #[max_len(200)]
    pub inventory: Vec<InventoryItem>, // Max 8 items
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct InventoryItem {
    pub name: [u8; 32], // Fixed Name up to 32 bytes
    pub amount: u64,
}
