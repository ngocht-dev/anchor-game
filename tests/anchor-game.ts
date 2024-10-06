import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorGame } from "../target/types/anchor_game";
import { assert } from "chai";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  TransactionSignature,
  TransactionConfirmationStrategy,
} from "@solana/web3.js";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

const GAME_SEED = "GAME";
const PLAYER_SEED = "PLAYER";
const MONSTER_SEED = "MONSTER";
const MAX_ITEMS_PER_PLAYER = 8;
const INITIAL_MONSTER_HITPOINTS = 100;
const AIRDROP_AMOUNT = 10 * LAMPORTS_PER_SOL;
const CREATE_PLAYER_ACTION_POINTS = 100;
const SPAWN_MONSTER_ACTION_POINTS = 5;
const ATTACK_MONSTER_ACTION_POINTS = 1;
const MONSTER_INDEX_BYTE_LENGTH = 8;

const provider = anchor.AnchorProvider.env();
anchor.setProvider(provider);

const program = anchor.workspace.anchor_game as Program<AnchorGame>;

const treasury = Keypair.fromSecretKey(
  new Uint8Array([
    76, 206, 149, 209, 11, 65, 17, 94, 106, 80, 121, 204, 171, 184, 126, 247,
    30, 213, 189, 125, 203, 46, 121, 188, 137, 139, 27, 108, 151, 124, 177, 195,
    227, 184, 52, 138, 158, 82, 133, 196, 123, 34, 13, 86, 85, 76, 111, 166, 52,
    197, 251, 169, 8, 40, 164, 129, 76, 26, 41, 3, 238, 164, 2, 84,
  ])
);

const findProgramAddress = (seeds: Buffer[]): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(seeds, program.programId);

const confirmTransaction = async (
  signature: TransactionSignature,
  provider: anchor.Provider
) => {
  const latestBlockhash = await provider.connection.getLatestBlockhash();
  const confirmationStrategy: TransactionConfirmationStrategy = {
    signature,
    blockhash: latestBlockhash.blockhash,
    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
  };

  try {
    const confirmation = await provider.connection.confirmTransaction(
      confirmationStrategy
    );
    console.log("tx: ", confirmation);
    if (confirmation.value.err) {
      throw new Error(
        `Transaction failed: ${confirmation.value.err.toString()}`
      );
    }
  } catch (error) {
    throw new Error(`Transaction confirmation failed: ${error.message}`);
  }
};

const [gameAddress] = findProgramAddress([
  Buffer.from(GAME_SEED),
  treasury.publicKey.toBuffer(),
]);

const createPlayerAccountAddress = (gameAddress: PublicKey) =>
  findProgramAddress([
    Buffer.from(PLAYER_SEED),
    gameAddress.toBuffer(),
    provider.wallet.publicKey.toBuffer(),
  ]);

const createMonsterAddress = (
  gameAddress: PublicKey,
  monsterIndex: anchor.BN
) =>
  findProgramAddress([
    Buffer.from(MONSTER_SEED),
    gameAddress.toBuffer(),
    provider.wallet.publicKey.toBuffer(),
    monsterIndex.toArrayLike(Buffer, "le", MONSTER_INDEX_BYTE_LENGTH),
  ]);

describe("Anchor game", () => {
  // it("creates a new game", async () => {
  //   try {
  //     const createGameSignature = await program.methods
  //       .createGame(MAX_ITEMS_PER_PLAYER)
  //       .accounts({
  //         game: gameAddress,
  //         gameMaster: provider.wallet.publicKey,
  //         treasury: treasury.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .signers([treasury])
  //       .rpc();

  //     await confirmTransaction(createGameSignature, provider);
  //   } catch (error) {
  //     throw new Error(`Failed to create game: ${error.message}`);
  //   }
  // });

  // it("creates a new player", async () => {
  //   try {
  //     const [playerAccountAddress] = createPlayerAccountAddress(gameAddress);

  //     const createPlayerAccountAddressSignature = await program.methods
  //       .createPlayerAccountAddress()
  //       .accounts({
  //         game: gameAddress,
  //         playerAccount: playerAccountAddress,
  //         player: provider.wallet.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .rpc();

  //     await confirmTransaction(createPlayerAccountAddressSignature, provider);
  //   } catch (error) {
  //     throw new Error(`Failed to create player: ${error.message}`);
  //   }
  // });

  // it("spawns a monster", async () => {
  //   try {
  //     const [playerAccountAddress] = createPlayerAccountAddress(gameAddress);

  //     const playerAccount = await program.account.player.fetch(
  //       playerAccountAddress
  //     );
  //     const [monsterAddress] = createMonsterAddress(
  //       gameAddress,
  //       playerAccount.nextMonsterIndex
  //     );

  //     const spawnMonsterSignature = await program.methods
  //       .spawnMonster()
  //       .accounts({
  //         game: gameAddress,
  //         playerAccount: playerAccountAddress,
  //         monster: monsterAddress,
  //         player: provider.wallet.publicKey,
  //         systemProgram: anchor.web3.SystemProgram.programId,
  //       })
  //       .rpc();

  //     await confirmTransaction(spawnMonsterSignature, provider);
  //   } catch (error) {
  //     throw new Error(`Failed to spawn monster: ${error.message}`);
  //   }
  // });

  it("attacks a monster", async () => {
    try {
      const [playerAddress] = createPlayerAccountAddress(gameAddress);

      const playerAccount = await program.account.player.fetch(playerAddress);

      console.log(
        "playerAccount: ",
        playerAddress,
        playerAccount,
        playerAccount.actionPointsSpent.toNumber(),
        playerAccount.actionPointsSpent.toString(),
        playerAccount.actionPointsToBeCollected.toNumber()
      );
      const [monsterAddress] = createMonsterAddress(
        gameAddress,
        playerAccount.nextMonsterIndex.subn(1)
      );

      // const attackMonsterSignature = await program.methods
      //   .attackMonster()
      //   .accounts({
      //     playerAccount: playerAddress,
      //     monster: monsterAddress,
      //     player: provider.wallet.publicKey,
      //     systemProgram: anchor.web3.SystemProgram.programId,
      //   })
      //   .rpc();

      // await confirmTransaction(attackMonsterSignature, provider);

      const monsterAccount = await program.account.monster.fetch(
        monsterAddress
      );
      console.log("monsterAccount: ", monsterAccount.hitpoints.toNumber());

      assert(
        monsterAccount.hitpoints.eqn(INITIAL_MONSTER_HITPOINTS - 1),
        "Monster hitpoints should decrease by 1 after attack"
      );
    } catch (error) {
      throw new Error(`Failed to attack monster: ${error.message}`);
    }
  });

  //   it("deposits action points", async () => {});
});
