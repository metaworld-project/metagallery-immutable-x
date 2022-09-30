import { Button, Container, Input, Loading, Spacer } from "@nextui-org/react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppContext } from "../../../features/AppContext";
import { writeMetadata } from "../../../features/NFT/services/nft.service";

type FormValues = {
  token_id: string;
  contract_address: string;
  name: string;
  description?: string;
  image_url?: string;
};

const MintNFTPage: NextPage = () => {
  const { client, walletConnection, address } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (data) => {
    if (!walletConnection || !address) {
      return;
    }
    setIsLoading(true);
    try {
      const { contract_address, token_id, ...metadata } = data;
      await client.mint(walletConnection.l1Signer, {
        contract_address,
        users: [
          {
            user: address,
            tokens: [
              {
                id: token_id,
                blueprint: "onchain-metadata",
              },
            ],
          },
        ],
      });
      await writeMetadata(data.contract_address, data.token_id, metadata);
      toast.success("Token minted");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not create project");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <NextSeo title="Mint NFT" />
      <Container xs css={{ py: 40 }}>
        <form onSubmit={onSubmit}>
          <Input
            {...register("contract_address", {
              required: "Contract address is required",
            })}
            helperColor="error"
            helperText={errors.contract_address?.message}
            label="Contract Address"
            placeholder="0x..."
            fullWidth
            size="lg"
          />
          <Spacer y={1} />
          <Input
            {...register("token_id", {
              required: "TokenId is required",
            })}
            helperColor="error"
            helperText={errors.token_id?.message}
            label="TokenId"
            placeholder="TokenId"
            fullWidth
            size="lg"
          />
          <Spacer y={1} />
          <Input
            {...register("name", {
              required: "Token name is required",
            })}
            helperColor="error"
            helperText={errors.name?.message}
            label="Token name"
            placeholder="Token name"
            fullWidth
            size="lg"
          />
          <Spacer y={1} />
          <Input
            {...register("description")}
            helperColor="error"
            helperText={errors.description?.message}
            label="Description"
            placeholder="Description"
            fullWidth
            size="lg"
          />
          <Spacer y={1} />
          <Input
            {...register("image_url")}
            helperColor="error"
            helperText={errors.image_url?.message}
            label="Token image url"
            placeholder="https://example.com/image.png"
            fullWidth
            size="lg"
          />
          <Spacer y={1} />
          <Button disabled={isLoading} type="submit" color="primary">
            {isLoading ? <Loading type="spinner" /> : null}
            <span className="ml-2">Mint Token</span>
          </Button>
        </form>
      </Container>
    </>
  );
};

export default MintNFTPage;
