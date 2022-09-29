import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ENVIRONMENTS, WalletSDK, L1_PROVIDERS, WalletConnection } from "@imtbl/wallet-sdk-web";
import useGlobalStore from "./store";
import { ImmutableX, Config } from "@imtbl/core-sdk";

type TAppContext = {
  walletSDK: WalletSDK;
  walletConnection: WalletConnection;
  connectWallet: () => Promise<void>;
  address: string | null;
  client: ImmutableX;
};

const AppContext = createContext<TAppContext>({} as TAppContext);

const config = Config.SANDBOX;

const AppContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [walletSDK, setWalletSDK] = useState<WalletSDK | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
  const client = useMemo(() => new ImmutableX(config), []);
  const removeLoading = useGlobalStore(useCallback((state) => state.removeLoading, []));

  const initWalletSDK = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_ALCHEMY_API_URL) {
      throw new Error("Missing NEXT_PUBLIC_ALCHEMY_API_URL environment variable");
    }
    const sdk = await WalletSDK.build({
      env: "staging" as ENVIRONMENTS,
      rpc: {
        5: process.env.NEXT_PUBLIC_ALCHEMY_API_URL,
      },
      chainID: 5,
    });
    setWalletSDK(sdk);
    removeLoading();
  }, [removeLoading]);

  const connectWallet = useCallback(async () => {
    if (!walletSDK) {
      return;
    }
    const connection = await walletSDK.connect({
      provider: L1_PROVIDERS.METAMASK,
    });
    const address = await connection.l1Signer.getAddress();
    setWalletConnection(connection);
    setAddress(address);
  }, [walletSDK]);

  useEffect(() => {
    initWalletSDK();
  }, [initWalletSDK]);

  const contextValue = useMemo(
    () => ({ walletSDK, connectWallet, walletConnection, address, client }),
    [walletSDK, connectWallet, walletConnection, address, client]
  );

  if (!walletSDK) {
    return null;
  }

  return <AppContext.Provider value={contextValue as TAppContext}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
export default AppContextProvider;
