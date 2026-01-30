import type { Hex } from 'viem';
import type { WalletConfig } from '@skillzmarket/sdk';

/**
 * Gets the wallet private key from environment.
 * Returns a hex string that can be used with the SDK's WalletConfig.
 */
export function getWalletFromEnv(): WalletConfig | null {
  const privateKey = process.env.SKILLZ_PRIVATE_KEY;
  if (!privateKey) {
    return null;
  }
  // Return the private key as a hex string - the SDK will convert it to an account
  return privateKey as Hex;
}
