import { Button, Container, Input, Loading, Spacer } from "@nextui-org/react";
import { NextPage } from "next";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAppContext } from "../../../features/AppContext";

type FormValues = {
  token_id: string;
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
      await client.mint(walletConnection.l1Signer, {
        contract_address: process.env.NEXT_PUBLIC_IMMUTABLE_TOKEN_CONTRACT_ADDRESS!,
        users: [
          {
            user: address,
            tokens: [
              {
                id: data.token_id,
                blueprint: "onchain-metadata",
              },
            ],
          },
        ],
      });
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
    <Container xs css={{ py: 40 }}>
      <form onSubmit={onSubmit}>
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
        <Button disabled={isLoading} type="submit" color="primary">
          {isLoading ? <Loading type="spinner" /> : null}
          <span className="ml-2">Mint Token</span>
        </Button>
      </form>
    </Container>
  );
};

export default MintNFTPage;
