const fs = require("fs");
const Joi = require("joi");

const _MARK = 1;
const _UN_MARK = 0;

class Board {
  constructor(height, width) {
    const board = this.make2dBoard(height, width);
    this.board = board;
    this.height = height;
    this.width = width;
  }

  make2dBoard = (height, width) => {
    const board = new Array(height);
    for (let h = 0; h < height; h++) {
      board[h] = new Array(width);
      for (let w = 0; w < width; w++) {
        board[h][w] = _UN_MARK;
      }
    }

    return board;
  };

  printBoard = () => {
    for (let h = this.board.length - 1; h >= 0; h--) {
      console.log(this.board[h].map((o) => (o === _MARK ? "*" : "_")).join(""));
    }
  };

  findBottomIndex = (rectangle) => {
    // top to bottom
    for (let h = this.board.length - 1; h >= 0; h--) {
      for (let w = rectangle.x; w < rectangle.x + rectangle.w; w++) {
        if (this.board[h][w] === _MARK) {
          return h;
        }
      }
    }

    return -1;
  };

  fillTheBoardWithRectangle = (rectangle, bottom) => {
    for (let h = bottom + 1; h < bottom + 1 + rectangle.h; h++) {
      for (let w = rectangle.x; w < rectangle.x + rectangle.w; w++) {
        this.board[h][w] = _MARK;
      }
    }
  };

  _isFullBoard = (bottom, rectangle) => bottom + rectangle.h >= this.height;
}

const validateInput = async (data) => {
  // ・1 ≦ H, W, N ≦ 30
  // ・1 ≦ h_i ≦ H
  // ・1 ≦ w_i ≦ W
  // ・0 ≦ x_i ≦ W - w_i

  const Schema = Joi.object({
    height: Joi.number().min(1).max(30).required(),
    width: Joi.number().min(1).max(30).required(),
    number_of_rectangle: Joi.number().min(1).max(30).required(),
    rectangles: Joi.array()
      .items(
        Joi.object({
          w: Joi.number().min(1).max(Joi.ref("....width")).required(),
          h: Joi.number().min(1).max(Joi.ref("....height")).required(),
          x: Joi.number()
            .min(0)
            .max(Joi.expression("{{....width - w}}"))
            .required(),
        }).required()
      )
      .length(Joi.ref("number_of_rectangle")),
  }).required();

  await Schema.validateAsync(data);
};

const readFileInput = async (fileName) => {
  try {
    const data = {};
    const text = fs.readFileSync(fileName, "utf-8");

    const lines = text.split("\n");
    data.height = +lines[0].split(" ")[0];
    data.width = +lines[0].split(" ")[1];
    data.number_of_rectangle = +lines[0].split(" ")[2];
    data.rectangles = [];

    for (let i = 1; i < lines.length; i++) {
      data.rectangles.push({
        h: +lines[i].split(" ")[0],
        w: +lines[i].split(" ")[1],
        x: +lines[i].split(" ")[2],
      });
    }

    return data;
  } catch (error) {
    console.log(`Read file ${fileName} fail!`);
  }
};

const main = async () => {
  const data = await readFileInput(`${__dirname}/input.txt`);
  await validateInput(data);

  // build a board
  const board = new Board(data.height, data.width);

  // fill the board with rectangle
  for (let i = 0; i < data.number_of_rectangle; i++) {
    console.log("\n#####################\n");
    console.log("STEP", i + 1);
    const rectangle = data.rectangles[i];
    const bottom = board.findBottomIndex(rectangle);
    if (board._isFullBoard(bottom, rectangle)) {
      break;
    }
    board.fillTheBoardWithRectangle(rectangle, bottom);
    board.printBoard();
    console.log("\n#####################\n");
  }
  console.log("Game Over!");
};

main();
