import classNames from "classnames";

import { type ComponentProps } from "~/lib/ui";
import { Actions, type Action } from "~/components/structural";
import { Text } from "~/components/typography";

export interface TileProps extends ComponentProps {
  readonly title: string;
  readonly description?: string | null | (string | null | undefined)[];
  readonly actions?: Action[];
}

export const Tile = ({ title, description, actions, ...props }: TileProps): JSX.Element => {
  const dek = (Array.isArray(description) ? description : [description]).filter(
    (v): v is string => v !== undefined && v !== null,
  );
  return (
    <div {...props} className={classNames("tile", props.className)}>
      <div className="tile__content">
        <Text className="tile__title">{title}</Text>
        {dek.length !== 0 && (
          <div className="tile__descriptions">
            {dek.map((d, i) => (
              <Text className="tile__description" key={i}>
                {d}
              </Text>
            ))}
          </div>
        )}
      </div>
      <Actions actions={actions} />
    </div>
  );
};
