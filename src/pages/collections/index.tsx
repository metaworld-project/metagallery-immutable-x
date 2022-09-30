import { Collection, CollectionFilter, ListCollectionsResponse } from "@imtbl/core-sdk";
import { Button, Container, Text } from "@nextui-org/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../features/AppContext";
import ListCollections from "../../features/Collections/components/ListCollections";

const CollectionsPage: NextPage = () => {
  const { walletConnection, client, address } = useAppContext();
  const [collectionResponse, setCollectionResponse] = useState<Collection>();
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();

  const getCollections = useCallback(async () => {
    if (!walletConnection || !address) {
      return;
    }
    setIsFetching(true);
    try {
      console.log(address.toLocaleLowerCase());
      const _collectionResponse = await client.listCollectionFilters({
        pageSize: 24,
        address: address.toLocaleLowerCase(),
      });
      console.log("collectionResponse", _collectionResponse);
      // setCollectionResponse(_collectionResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not fetch projects");
      }
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  }, [walletConnection, address, client]);

  const navigateToCreateCollection = useCallback(() => {
    router.push("/collections/create");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getCollections();
  }, [getCollections]);

  return (
    <Container lg css={{ py: 20 }}>
      <div className="flex items-center space-x-6">
        <Text h1 size={32}>
          Collections
        </Text>
        <Button
          onPress={navigateToCreateCollection}
          auto
          color="secondary"
          size="sm"
          css={{ mt: -4 }}
        >
          Create New Collection
        </Button>
      </div>
      {/* <ListCollections isFetching={isFetching} data={collectionResponse} /> */}
    </Container>
  );
};

export default CollectionsPage;
