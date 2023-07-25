import React from "react";

import classNames from "classnames";

import { logger } from "~/application/logger";

import { Tile, type TileProps } from "./tiles";
import { View, type WithViewProps } from "./View";

type RendererFn<M extends Record<string, unknown>, P extends TileProps> = (datum: M, props?: P) => JSX.Element;

type Renderer<M extends Record<string, unknown>, P extends TileProps> =
  | RendererFn<M, P>
  | {
      readonly isDefault: true;
      readonly renderer: RendererFn<M, P>;
    };

export type TilesViewDataProps<M extends Record<string, unknown>, P extends TileProps = TileProps> = {
  readonly data: M[];
  readonly children?: never;
  readonly tileProps?: P;
  readonly renderTileContent?: (datum: M) => JSX.Element;
  readonly renderTile?: Renderer<M, P>;
};

export type TilesViewChildrenProps = {
  readonly children: JSX.Element | JSX.Element[];
  readonly data?: never;
  readonly renderTileContent?: never;
  readonly renderTile?: never;
  readonly tileProps?: never;
};

export type TilesViewProps<M extends Record<string, unknown>, P extends TileProps = TileProps> =
  | WithViewProps<TilesViewDataProps<M, P>>
  | WithViewProps<TilesViewChildrenProps>;

export const TilesView = <M extends Record<string, unknown>, P extends TileProps = TileProps>({
  children,
  data,
  tileProps,
  renderTileContent,
  renderTile,
  ...props
}: TilesViewProps<M, P>): JSX.Element => (
  <View {...props} className={classNames("tiles-view", props.className)}>
    {data !== undefined
      ? data.map((datum, i) => {
          const tileRenderer = typeof renderTile === "function" ? renderTile : renderTile?.renderer;
          /* The default case is to prioritize the tile renderer if both renderers are provided.  If the tile renderer
             is provided such that it indicates that it is just the default, the content renderer should be prioritized
             if it is also provided. */
          const contentRendererPrioritized = typeof renderTile === "function" ? false : renderTile?.isDefault === true;
          if (tileRenderer !== undefined && (!contentRendererPrioritized || renderTileContent === undefined)) {
            return <React.Fragment key={i}>{tileRenderer(datum, tileProps)}</React.Fragment>;
          } else if (renderTileContent !== undefined) {
            return (
              <Tile key={i} {...tileProps}>
                {renderTileContent(datum)}
              </Tile>
            );
          } else {
            logger.error("Neither 'renderTile' or 'renderTileContent' renderers were provided.");
            return <React.Fragment key={i} />;
          }
        })
      : children}
  </View>
);
