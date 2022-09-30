import { Button, Navbar as NextUINavbar, Text } from "@nextui-org/react";
import Link from "next/link";
import { useCallback } from "react";
import { useAppContext } from "../AppContext";
import useGlobalStore from "../store";
import Logo from "./Logo";
import { toast } from "react-toastify";

const menus = [
  {
    title: "Home",
    href: "/",
  },
  // {
  //   title: "Marketplace",
  //   href: "/marketplace",
  // },
  {
    title: "Projects",
    href: "/projects",
  },
  {
    title: "Collections",
    href: "/collections",
  },
  // {
  //   title: "NFTs",
  //   href: "/nfts",
  // },
  {
    title: "Mint Token",
    href: "/nfts/mint",
  },
  {
    title: "View Your Collection in 3D Gallery",
    href: "/collections/view",
  },
];

const Navbar = () => {
  const { connectWallet, address } = useAppContext();
  const isConnected = !!address;

  const [addLoading, removeLoading] = useGlobalStore(
    useCallback((state) => [state.addLoading, state.removeLoading] as const, [])
  );

  const onPressConnect = useCallback(async () => {
    addLoading();
    try {
      await connectWallet();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not connect to wallet");
      }
    } finally {
      removeLoading();
    }
  }, [addLoading, connectWallet, removeLoading]);

  return (
    <NextUINavbar variant="sticky">
      <NextUINavbar.Content hideIn="xs">
        <Link href="/" passHref>
          <NextUINavbar.Brand className="mr-8 cursor-pointer">
            <Logo />
            <Text b color="inherit" hideIn="xs">
              MetaGallery
            </Text>
          </NextUINavbar.Brand>
        </Link>
        {menus.map((menu, index) => {
          const isActive = location.pathname === menu.href;
          return (
            <Link key={index} href={menu.href} passHref>
              <NextUINavbar.Link isActive={isActive} as="a">
                <span className="font-medium text-[16px]">{menu.title}</span>
              </NextUINavbar.Link>
            </Link>
          );
        })}
      </NextUINavbar.Content>
      <NextUINavbar.Content>
        {/* <NextUINavbar.Item>
          <Button auto color="secondary" flat>
            <span className="font-semibold">0 BRO2</span>
          </Button>
        </NextUINavbar.Item> */}
        <NextUINavbar.Item>
          {isConnected ? (
            <Button color="gradient" auto>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </Button>
          ) : (
            <Button color="gradient" auto onPress={onPressConnect}>
              Connect Wallet
            </Button>
          )}
        </NextUINavbar.Item>
      </NextUINavbar.Content>
    </NextUINavbar>
  );
};

export default Navbar;
