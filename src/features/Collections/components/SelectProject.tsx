import { Avatar, Col, Dropdown, Spacer, Text } from "@nextui-org/react";
import { useListProjects } from "../../Projects/services/project.service";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { GetProjectsResponse } from "@imtbl/core-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";

type Key = string | number;

type Props = {
  onSelect: (project: Key) => void;
  selectedProjectId?: Key;
};

const SelectProject: React.FC<Props> = ({ onSelect }) => {
  const { data, isFetching } = useListProjects();

  const [selected, setSelected] = useState<number>();

  const onSelectionChange = useCallback((keys: Set<Key> | "all") => {
    if (typeof keys === "string") {
      return setSelected(undefined);
    }
    const key = keys.values().next().value;
    setSelected(Number(key));
  }, []);

  useEffect(() => {
    if (selected) {
      onSelect(selected);
    }
  }, [selected, onSelect]);

  const selectedValue = useMemo(
    () => data?.result.find((project) => project.id === selected),
    [data?.result, selected]
  );

  const selectedKeys = useMemo(() => {
    if (selected) {
      return new Set([selected]);
    }
    return new Set<string>();
  }, [selected]);

  return (
    <Dropdown>
      <Col>
        <Text size={20}>Project</Text>
        <Spacer y={0.1} />
        <Dropdown.Button flat color="default" css={{ width: "100%" }}>
          {selectedValue?.name || "Select Project"}
        </Dropdown.Button>
        <Spacer y={1} />
      </Col>
      <Dropdown.Menu
        selectionMode="single"
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        color="default"
        aria-label="Projects"
        css={{ $$dropdownMenuWidth: "280px" }}
      >
        <Dropdown.Section title="My Projects">
          {!data?.result.length ? (
            <Dropdown.Item css={{ pointerEvents: "none", userSelect: "none" }}>
              No Projects Found
            </Dropdown.Item>
          ) : (
            (data?.result || []).map((project) => (
              <Dropdown.Item
                key={project.id}
                description={project.company_name}
                icon={<Avatar squared text={project.name} css={{ borderRadius: 6 }} size="sm" />}
              >
                {project.name}
              </Dropdown.Item>
            ))
          )}
        </Dropdown.Section>
        <Dropdown.Section title="Want to create new project?">
          <Dropdown.Item
            key="delete"
            color="primary"
            icon={<PlusCircleIcon height={22} width={22} fill="currentColor" />}
          >
            Create New Project
          </Dropdown.Item>
        </Dropdown.Section>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SelectProject;
