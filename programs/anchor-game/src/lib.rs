use anchor_lang::prelude::*;

declare_id!("rGi3t3WPmchGjQ91YCLsQtiDGX2xTjjVodycFKtdk7m");

#[program]
pub mod anchor_game {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
