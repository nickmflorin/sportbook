import React, { useImperativeHandle, useState, useRef } from "react";

import { Menu, Flex, type MenuProps } from "@mantine/core";

import { type icons, type Color } from "~/lib/ui";
import { EllipsisButton } from "~/components/buttons";
import { Icon } from "~/components/display/icons";

type DataTableActionItem = {
  readonly setLoading: (v: boolean) => void;
};

const InitialDataTableActionItem: DataTableActionItem = {
  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  setLoading: () => {},
};

export type DataTableAction = {
  /**
   * Whether or not the {@link DataTableActionMenuItem} is in a loading state and should indicate as such with a loading
   * indicator.
   *
   * Note: The loading state on the {@link DataTableActionMenuItem} can also be set via
   * {@link React.MutableRefObject<DataTableActionItem>} that is included in the 'onClick' callback.
   *
   * Default: false
   */
  readonly loading?: boolean;
  /**
   * Whether or not the the {@link DataTableActionMenuItem} should be disabled.
   *
   * Default: false
   */
  readonly disabled?: boolean;
  /**
   * Whether or not the the {@link DataTableActionMenuItem} should be visible, and included in the dropdown.
   *
   * Default: true
   */
  readonly visible?: boolean;
  /**
   * Whether or not the the {@link DataTableActionMenuItem} should be hidden, and excluded from the dropdown.
   *
   * Default: false
   */
  readonly hidden?: boolean;
  /**
   * The color of the 'icon' ({@link Icon}) that is used in the {@link DataTableActionMenuItem}.
   *
   * Default: "gray.5"
   */
  readonly iconColor?: Color;
  /**
   * The optional icon, {@link icons.IconProp}, that should be rendered in the {@link DataTableActionMenuItem}.
   */
  readonly icon?: icons.IconProp;
  /**
   * The text content of the {@link DataTableActionMenuItem}.
   */
  readonly label: string;
  /**
   * An optional callback that is invoked when the {@link DataTableActionMenuItem} is clicked.  The callback includes
   * the original, native event, {@link React.MouseEvent<HTMLButtonElement>}, along with the
   * {@link DataTableActionItem} ref that can be used to control the item's behavior during the handling context:
   *
   * @example
   * actions={[
   *   {
   *     label: "Get Data",
   *     icon: IconSearch,
   *     onClick: (e, item) => {
   *       item.setLoading(true);
   *       const data = await makeRequest(...);
   *       setData(data);
   *       item.setLoading(false);
   *     }
   *   }
   * ]}
   */
  readonly onClick?: (e: React.MouseEvent<HTMLButtonElement>, item: DataTableActionItem) => void;
};

const DataTableActionMenuItem = ({
  loading,
  disabled,
  visible,
  hidden,
  icon,
  iconColor = "gray.5",
  label,
  onClick,
}: DataTableAction) => {
  const [_loading, setLoading] = useState<boolean | undefined>(false);
  const menuItem = useRef<DataTableActionItem>(InitialDataTableActionItem);

  useImperativeHandle(menuItem, () => ({
    setLoading: (v: boolean) => setLoading(v),
  }));

  const isLoading = _loading || loading;

  const isVisible = !(visible === false) && hidden !== true;

  if (isVisible) {
    return (
      <Menu.Item
        icon={<Icon color={iconColor} icon={icon} loading={isLoading} />}
        h="28px"
        onClick={e => {
          e.stopPropagation();
          onClick?.(e, menuItem.current);
        }}
        p="sm"
        color="gray.7"
        fz="xs"
        pos="relative"
        disabled={disabled}
        sx={t => ({ fontWeight: t.other.fontWeights.medium })}
      >
        {label}
      </Menu.Item>
    );
  }
  return <></>;
};

export interface DataTableActionMenuProps extends MenuProps {
  readonly actions: DataTableAction[];
}

/**
 * A Menu implementation (with an ellipsis dropdown button) that can be used in the {@link DataTable} component to show
 * a series of actions that are associated with a given row in a dropdown menu.
 */
export const DataTableActionMenu = ({ actions, ...props }: DataTableActionMenuProps) => (
  <Menu
    {...props}
    styles={{
      itemIcon: {
        marginRight: "6px",
      },
    }}
  >
    <Menu.Target>
      <Flex direction="column" align="center" justify="center">
        <EllipsisButton />
      </Flex>
    </Menu.Target>
    <Menu.Dropdown>
      {actions.map((action, index) => (
        <DataTableActionMenuItem key={index} {...action} />
      ))}
    </Menu.Dropdown>
  </Menu>
);
