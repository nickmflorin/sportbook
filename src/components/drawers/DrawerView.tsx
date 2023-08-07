import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { CloseButton } from "~/components/buttons/CloseButton";
import { Loading } from "~/components/loading/Loading";
import { Header, type HeaderProps } from "~/components/views/Header";

export interface DrawerViewProps extends ComponentProps, Omit<HeaderProps, keyof ComponentProps> {
  readonly children: JSX.Element;
  readonly loading?: boolean;
  readonly onClose?: () => void;
}

export const DrawerView = ({
  title,
  description,
  actions,
  titleProps,
  descriptionProps,
  children,
  image,
  tags,
  loading,
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
      tags={tags}
      image={image}
      style={onClose ? { marginRight: 24 } : {}}
    />
    <Loading loading={loading === true} overlay />
    {onClose && <CloseButton className="drawer__close-button" onClick={onClose} />}
    <div className="drawer-view__content">{children}</div>
  </div>
);
