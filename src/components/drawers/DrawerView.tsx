import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface DrawerViewProps extends ComponentProps, Omit<HeaderProps, keyof ComponentProps> {
  readonly children: JSX.Element;
  readonly onClose?: () => void;
}

export const DrawerView = ({
  title,
  description,
  actions,
  titleProps,
  descriptionProps,
  children,
  onClose,
  ...props
}: DrawerViewProps): JSX.Element => (
  <div {...props} className={classNames("drawer-view", props.className)}>
    <Header
      className="form__header"
      title={title}
      description={description}
      actions={actions}
      titleProps={titleProps}
      descriptionProps={descriptionProps}
    />
    {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
    <div className="drawer-view__content">{children}</div>
  </div>
);
