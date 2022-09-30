import { NextPage } from "next";
import { useCallback } from "react";
import { Button, Container, Text } from "@nextui-org/react";
import ListProjects from "../../features/Projects/components/ListProjects";
import { useListProjects } from "../../features/Projects/services/project.service";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

const ProjectsPage: NextPage = () => {
  const { data, isFetching } = useListProjects();
  const router = useRouter();
  const navigateToCreateCollection = useCallback(() => {
    router.push("/projects/create");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NextSeo title="Projects" />
      <Container lg css={{ py: 20 }}>
        <div className="flex items-center space-x-6">
          <Text h1 size={32}>
            Projects
          </Text>
          <Button
            onPress={navigateToCreateCollection}
            auto
            color="secondary"
            size="sm"
            css={{ mt: -4 }}
          >
            Create New Project
          </Button>
        </div>
        <ListProjects isFetching={isFetching} data={data} />
      </Container>
    </>
  );
};

export default ProjectsPage;
