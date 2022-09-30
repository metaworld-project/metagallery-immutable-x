import { Button, Checkbox, Container, Input, Loading, Spacer } from "@nextui-org/react";
import { NextPage } from "next";
import {} from "@imtbl/core-sdk";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../features/AppContext";
import { useRouter } from "next/router";
import SelectProject from "../../../features/Collections/components/SelectProject";

type FormValues = {
  name: string;
  project_id: number;
  description?: string;
  icon_url?: string;
  collection_image_url?: string;
  contract_address: string;
  metadata_api_url?: string;
};

const CreateCollectionPage: NextPage = () => {
  const { client, walletConnection, address } = useAppContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [metadata, setMetadata] = useState<string[]>(["name", "description", "image_url"]);

  const addMetadataToCollection = useCallback(
    async (contractAddress: string) => {
      if (!walletConnection || !address) {
        return;
      }
      setIsLoading(true);
      try {
        await client.addMetadataSchemaToCollection(walletConnection.l1Signer, contractAddress, {
          metadata: metadata.map((m) => ({ name: m, type: "text", filterable: true })),
        });
        toast.success("Metadata added to collection");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Could not add metadata to collection");
        }
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [metadata, walletConnection, address, client]
  );

  const onSubmit = handleSubmit(async (data) => {
    if (!walletConnection || !address) {
      return;
    }
    setIsLoading(true);
    try {
      await client.createCollection(walletConnection.l1Signer, {
        ...data,
        owner_public_key: address,
      });
      await addMetadataToCollection(data.contract_address);
      toast.success("Collection created");
      router.push("/collections");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not create collection");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Container xs css={{ py: 40 }}>
      <form onSubmit={onSubmit}>
        <Controller
          control={control}
          name="project_id"
          render={({ field: { onChange, value } }) => (
            <SelectProject onSelect={onChange} selectedProjectId={value} />
          )}
          rules={{ required: "Project is required" }}
        />
        <Input
          {...register("name", {
            required: "Collection name is required",
            minLength: {
              value: 3,
              message: "Collection name must be at least 3 characters",
            },
            maxLength: {
              value: 50,
              message: "Collection name must be at most 50 characters",
            },
          })}
          helperColor="error"
          helperText={errors.name?.message}
          label="Collection's name"
          placeholder="My collection"
          fullWidth
          size="lg"
        />
        <Spacer y={1} />
        <Input
          {...register("description")}
          helperColor="error"
          helperText={errors.description?.message}
          label="Collection description"
          placeholder="My collection description"
          fullWidth
          size="lg"
        />
        <Spacer y={1} />
        <Input
          {...register("icon_url")}
          helperColor="error"
          helperText={errors.icon_url?.message}
          label="Collection's icon"
          placeholder="https://example.com/icon.png"
          fullWidth
          size="lg"
        />
        <Spacer y={1} />
        <Input
          {...register("collection_image_url")}
          helperColor="error"
          helperText={errors.collection_image_url?.message}
          label="Collection's image"
          placeholder="https://example.com/image.png"
          fullWidth
          size="lg"
        />
        <Spacer y={1} />
        <Input
          {...register("contract_address")}
          helperColor="error"
          helperText={errors.contract_address?.message}
          label="Collection contract address"
          placeholder="0x0000000000000000000000000000000000000000"
          fullWidth
          size="lg"
        />
        <Spacer y={1} />
        <Input
          {...register("metadata_api_url")}
          helperColor="error"
          helperText={errors.metadata_api_url?.message}
          label="Metadata API URL"
          placeholder="https://example.com/api/example"
          fullWidth
          size="lg"
        />
        <Spacer y={1} />
        <Checkbox.Group
          color="secondary"
          value={metadata}
          onChange={setMetadata}
          label="Core properties"
        >
          <Checkbox size="sm" value="name">
            Name
          </Checkbox>
          <Checkbox size="sm" value="description">
            Description
          </Checkbox>
          <Checkbox size="sm" value="image_url">
            Image URL
          </Checkbox>
          <Checkbox size="sm" value="animation_url">
            Animation URL
          </Checkbox>
          <Checkbox size="sm" value="animation_url_mime_type">
            Animation URL Mime Type
          </Checkbox>
          <Checkbox size="sm" value="youtube_url">
            Youtube URL
          </Checkbox>
        </Checkbox.Group>
        <Spacer y={1} />
        <Button type="submit" color="primary">
          {isLoading ? <Loading type="spinner" /> : null}
          <span className="ml-2">Create Collection</span>
        </Button>
      </form>
    </Container>
  );
};

export default CreateCollectionPage;