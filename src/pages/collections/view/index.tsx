import { Button, Container, Input, Spacer, Text } from "@nextui-org/react";
import { NextPage } from "next";
import { NextSeo } from "next-seo";
import { useState } from "react";

const CollectionsPage: NextPage = () => {
  const [collection, setCollection] = useState<string>("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    window.open(`https://3d.brolab.io/gallery-rfox/?collection=${collection}`, "_blank");
  };
  return (
    <>
      <NextSeo title="View Your Collection" />
      <Container lg css={{ py: 20 }}>
        <Text h1 size={32}>
          View Your Collection
        </Text>
        <form onSubmit={onSubmit}>
          <Input
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            label="Collection ID"
            placeholder="0x..."
            fullWidth
            size="lg"
          />
          <Spacer y={1} />

          <Button type="submit" color="primary">
            <span className="ml-2">View</span>
          </Button>
        </form>
      </Container>
    </>
  );
};

export default CollectionsPage;
