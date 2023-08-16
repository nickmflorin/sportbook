import { DrawerPortal, type DrawerPortalProps } from "./DrawerPortal";
import { DrawerView, type DrawerViewProps } from "./DrawerView";

export interface DrawerProps extends DrawerViewProps, Omit<DrawerPortalProps, "onClose"> {
  readonly insideView?: false;
}

export const Drawer = ({
  children,
  open,
  slot = 1,
  onClose,
  insideView,
  loading,
  instanceId,
  ...props
}: DrawerProps): JSX.Element => (
  <DrawerPortal instanceId={instanceId} open={open} slot={slot} loading={loading} onClose={onClose}>
    {insideView !== false ? <DrawerView {...props}>{children}</DrawerView> : <>{children}</>}
  </DrawerPortal>
);

export default Drawer;
