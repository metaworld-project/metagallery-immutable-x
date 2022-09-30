import { CollectionFilter, Project } from "@imtbl/core-sdk";
import { Container, Text } from "@nextui-org/react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../features/AppContext";
import ListCollections from "../../../features/Collections/components/ListCollections";

const ProjectPage: NextPage = () => {
  const { walletConnection, client } = useAppContext();
  const [project, setProject] = useState<Project>();
  const [collectionResponse, setCollectionResponse] = useState<CollectionFilter>();
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const getProject = useCallback(async () => {
    if (!walletConnection || !id) {
      return;
    }
    setIsFetching(true);
    try {
      const _project = await client.getProject(walletConnection.l1Signer, id as string);
      console.log("project", _project);
      setProject(_project);
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
  }, [id, walletConnection, client]);

  const getCollections = useCallback(async () => {
    if (!walletConnection || !id) {
      return;
    }
    const _collectionResponse = await client.listCollectionFilters({
      pageSize: 12,
      address: process.env.NEXT_PUBLIC_IMMUTABLE_COLLECTION_CONTRACT_ADDRESS!,
    });
    console.log("collectionResponse", _collectionResponse);
    setCollectionResponse(_collectionResponse);
  }, [id, walletConnection, client]);

  useEffect(() => {
    getProject();
  }, [getProject]);

  useEffect(() => {
    if (project) {
      getCollections();
    }
  }, [getCollections, project]);

  if (!project) {
    return null;
  }
  return (
    <>
      <NextSeo title="Project Detail" />
      <Container lg css={{ py: 20 }}>
        <Text h1 size={32}>
          Project {project.name}
        </Text>
        <Text h2 size={28}>
          Collections
        </Text>
        <ListCollections isFetching={false} data={collectionResponse} />
      </Container>
    </>
  );
};

export default ProjectPage;
