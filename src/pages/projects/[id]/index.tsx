import { CollectionsApiListCollectionsRequest, Project } from "@imtbl/core-sdk";
import { Container, Text } from "@nextui-org/react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../../features/AppContext";

const ProjectPage: NextPage = () => {
  const { walletConnection, client } = useAppContext();
  const [project, setProject] = useState<Project>();
  const [collectionResponse, setCollectionResponse] =
    useState<CollectionsApiListCollectionsRequest>();
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const getProject = useCallback(async () => {
    if (!walletConnection || !id) {
      return;
    }
    const _project = await client.getProject(walletConnection.l1Signer, id as string);
    console.log("project", _project);
    setProject(_project);
  }, [id, walletConnection, client]);

  const getCollections = useCallback(async () => {
    if (!walletConnection || !id) {
      return;
    }
    const _collectionResponse = await client.listCollections({
      pageSize: 12,
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
    <Container lg css={{ py: 20 }}>
      <Text h1 size={32}>
        Project {project.name}
      </Text>
      <Text h2 size={28}>
        Collections
      </Text>
    </Container>
  );
};

export default ProjectPage;
