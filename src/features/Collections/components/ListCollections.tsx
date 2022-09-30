import { CollectionFilter } from "@imtbl/core-sdk";
import { Avatar, Button, Card, Grid, Link, Text } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useCallback } from "react";
import NextLink from "next/link";

type Props = {
  data: CollectionFilter | undefined;
  isFetching: boolean;
};

const ListCollections: React.FC<Props> = ({ data, isFetching }) => {
  const router = useRouter();
  const onClickCreateCollection = useCallback(() => {
    return router.push("/collections/create");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFetching) {
    return <div>Loading...</div>;
  }
  if (!data) {
    return <div>No data</div>;
  }
  if (!data.value?.length) {
    return (
      <div className="flex flex-col space-y-4 items-center justify-center min-h-[320px]">
        <div className="text-center">
          <div className="text-2xl font-bold">No collections found</div>
          <div className="text-gray-500">Create a new collection to get started</div>
        </div>
        <Button color="primary" onClick={onClickCreateCollection}>
          Create Collection
        </Button>
      </div>
    );
  }
  return null;
  // return (
  //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  //     {data.result.map((project) => (
  //       <NextLink
  //         href={`/projects/${project.id}`}
  //         key={project.id}
  //         className="flex flex-col space-y-4 min-h-[240px]"
  //       >
  //         <Card key={project.id} css={{ p: "$6", mw: "400px" }} isPressable isHoverable>
  //           <Card.Header>
  //             <Avatar squared text={project.name} css={{ borderRadius: 6 }} size="lg" />
  //             <Grid.Container css={{ pl: "$6" }}>
  //               <Grid xs={12}>
  //                 <Text h4 css={{ lineHeight: "$xs" }}>
  //                   {project.name}
  //                 </Text>
  //               </Grid>
  //               <Grid xs={12}>
  //                 <Text css={{ color: "$accents8", mt: -6 }}>{project.company_name}</Text>
  //               </Grid>
  //             </Grid.Container>
  //           </Card.Header>
  //           <Card.Footer>
  //             <div>
  //               <span>Contact email:</span>
  //               <Link color="primary" target="_blank" href={`mailto:${project.contact_email}`}>
  //                 {project.contact_email}
  //               </Link>
  //             </div>
  //           </Card.Footer>
  //         </Card>
  //       </NextLink>
  //     ))}
  //   </div>
  // );
};

export default ListCollections;
