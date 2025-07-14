import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

export const connection = new Connection(
  process.env.SOLANA_RPC_URL!,
  "confirmed"
);
export const platformPubkey = new PublicKey(
  process.env.PLATFORM_WALLET_PUBKEY!
);

export async function prepareTransferTx(
  fromPubkeyStr: string,
  amountSol: number
) {
  try {
    const fromPubkey = new PublicKey(fromPubkeyStr);
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey: platformPubkey,
        lamports: amountSol * LAMPORTS_PER_SOL,
      })
    );
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    tx.feePayer = fromPubkey;
    return tx;
  } catch (error) {
    throw new Error(
      `Failed to prepare transaction: ${(error as Error).message}`
    );
  }
}

export async function confirmTx(signature: string) {
  try {
    const status = await connection.confirmTransaction(signature, "confirmed");
    if (status.value.err) throw new Error("Transaction failed");
    return true;
  } catch (error) {
    throw new Error(
      `Transaction confirmation failed: ${(error as Error).message}`
    );
  }
}
