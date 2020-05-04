import {KeyboardKey} from "../const.js";

export const isEscKey = ({key}) => {
  return key === KeyboardKey.ESCAPE || key === KeyboardKey.ESC;
};

export const isCtrlAndEnter = ({key}) => {
  return key === KeyboardKey.ENTER && (KeyboardKey.CTRL || KeyboardKey.COMMAND);
};
