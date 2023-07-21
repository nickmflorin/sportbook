import { ModelFactory } from "./Factory";

export const GameFactory = new ModelFactory("Game", {
  modelFields: {
    dateTime: params => params.factory.randomDate(),
  },
});
