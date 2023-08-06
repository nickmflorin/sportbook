"use client";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

import { SolidButton } from "~/components/buttons/SolidButton";
import { useMutableSearchParams } from "~/hooks/useMutableSearchParams";

export const CreateLeagueButton = (): JSX.Element => {
  const { updateParams } = useMutableSearchParams();
  const [pending, startTransition] = useTransition();

  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <SolidButton.Primary
        key="0"
        loading={pending}
        onClick={() => {
          const updated = updateParams({ drawerId: "createLeague" });
          if (updated.queryString) {
            startTransition(() => {
              router.push(`${pathname}?${updated.queryString}`);
            });
          }
        }}
      >
        Create League
      </SolidButton.Primary>
    </>
  );
};

export default CreateLeagueButton;
