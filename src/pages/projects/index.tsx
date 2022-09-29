import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../../features/AppContext";
import { GetProjectsResponse } from "@imtbl/core-sdk";
import { Button, Container, Text } from "@nextui-org/react";
import ListProjects from "../../features/Projects/components/ListProjects";
import { toast } from "react-toastify";

const ProjectsPage: NextPage = () => {
  const { walletConnection, client } = useAppContext();
  const [projectsResponse, setProjectsResponse] = useState<GetProjectsResponse>();
  const [isFetching, setIsFetching] = useState(false);

  const getProjects = useCallback(async () => {
    if (!walletConnection) {
      return;
    }

    // await client.registerOffchain({
    //   ethSigner: walletConnection.l1Signer,
    //   starkSigner: walletConnection.l2Signer,
    // });

    try {
      setIsFetching(true);
      const projects = await client.getProjects(walletConnection.l1Signer);
      setProjectsResponse(projects);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Could not fetch projects");
      }
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [walletConnection, client]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <Container lg css={{ py: 20 }}>
      <div className="flex items-center space-x-6">
        <Text h1 size={32}>
          Projects
        </Text>
        <Button auto color="secondary" size="sm" css={{ mt: -4 }}>
          Create New Project
        </Button>
      </div>
      <ListProjects isFetching={isFetching} data={projectsResponse} />
    </Container>
  );
};

export default ProjectsPage;
