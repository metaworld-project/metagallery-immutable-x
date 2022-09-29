import { Transition } from "@headlessui/react";
import { Loading } from "@nextui-org/react";
import { useCallback } from "react";
import useGlobalStore from "../store";

const LoadingOverlay = () => {
  const loadingCount = useGlobalStore(useCallback((state) => state.loadingCount, []));

  return (
    <Transition
      show={loadingCount > 0}
      enter="transition-opacity duration-150"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      as="div"
      className="fixed inset-0 z-[999999] flex items-center justify-center bg-black bg-opacity-50"
    >
      <Loading color="secondary" size="xl"></Loading>
    </Transition>
  );
};

export default LoadingOverlay;
