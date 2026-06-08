import { gameModel } from "../../database/model/games.model.js";
import { notFoundError } from "../../common/responce/errors.responce.js";
export const getAllGames = async () => {
  const games = await gameModel.find().populate("userId");
  if (games) {
    return { message: "Games: ", users: games };
  } else {
    return notFoundError({ message: "No games" });
  }
};

export const getGameById = async (id) => {
  const game = await gameModel.findOne({ _id: id }).populate("userId");
  if (game) {
    return { message: "Game: ", game };
  } else {
    return notFoundError({ message: "No game" });
  }
};
