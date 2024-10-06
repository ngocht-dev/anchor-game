// Insider src/lib.rs
use anchor_lang::prelude::*;
use anchor_lang::solana_program::log::sol_log_compute_units;

mod constants;
mod error;
mod helpers;
mod instructions;
mod state;

use constants::*;
use instructions::*;
use state::*;

declare_id!("rGi3t3WPmchGjQ91YCLsQtiDGX2xTjjVodycFKtdk7m");

#[program]
pub mod anchor_game {
    use super::*;

    pub fn create_game(ctx: Context<CreateGame>, max_items_per_player: u8) -> Result<()> {
        run_create_game(ctx, max_items_per_player)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn create_player(ctx: Context<CreatePlayer>) -> Result<()> {
        run_create_player(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn spawn_monster(ctx: Context<SpawnMonster>) -> Result<()> {
        run_spawn_monster(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn attack_monster(ctx: Context<AttackMonster>) -> Result<()> {
        run_attack_monster(ctx)?;
        sol_log_compute_units();
        Ok(())
    }

    pub fn deposit_action_points(ctx: Context<CollectActionPoints>) -> Result<()> {
        run_collect_action_points(ctx)?;
        sol_log_compute_units();
        Ok(())
    }
}
