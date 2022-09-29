import { Button, Container, Input, Loading, Spacer } from "@nextui-org/react";
import { NextPage } from "next";
import {} from "@imtbl/core-sdk";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../../features/AppContext";
import { useRouter } from "next/router";

type FormValues = {
  company_name: string;
  contact_email: string;
  name: string;
};

const CreateProjectPage: NextPage = () => {
  const { client, walletConnection } = useAppContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    if (!walletConnection) {
      return;
    }
    setIsLoading(true);
    try {
      await client.createProject(walletConnection.l1Signer, data);
      toast.success("Project created");
      router.push("/projects");
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
          {...register("company_name", {
            required: "Company name is required",
            minLength: {
              value: 3,
              message: "Company name must be at least 3 characters",
            },
            maxLength: {
              value: 50,
              message: "Company name must be at most 50 characters",
            },
          })}
          helperColor="error"
          helperText={errors.company_name?.message}
          label="Company's name"
          placeholder="My Company"
          fullWidth
          size="lg"
        />
        <Spacer y={2} />
        <Input
          {...register("contact_email", {
            required: "Contact email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          helperColor="error"
          helperText={errors.contact_email?.message}
          label="Contact email"
          placeholder="project@company.com"
          fullWidth
          size="lg"
        />
        <Spacer y={2} />
        <Input
          {...register("name", {
            required: "Project name is required",
            minLength: {
              value: 3,
              message: "Project name must be at least 3 characters",
            },
            maxLength: {
              value: 32,
              message: "Project name must be at most 32 characters",
            },
          })}
          helperColor="error"
          helperText={errors.name?.message}
          label="Project's name"
          placeholder="My First Project"
          fullWidth
          size="lg"
        />
        <Spacer y={2} />
        <Button type="submit" color="primary">
          {isLoading ? <Loading type="spinner" /> : null}
          <span className="ml-2">Create Project</span>
        </Button>
      </form>
    </Container>
  );
};

export default CreateProjectPage;
