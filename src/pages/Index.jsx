import React, { useState } from "react";
import { Box, Grid, GridItem, Circle, useMediaQuery, Button, Text } from "@chakra-ui/react";

const BOARD_SIZE = 8;

const Index = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState("green");
  const [isLargerThan600] = useMediaQuery("(min-width: 600px)");

  function initializeBoard() {
    const initialBoard = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(null));
    initialBoard[3][3] = initialBoard[4][4] = "white";
    initialBoard[3][4] = initialBoard[4][3] = "green";
    return initialBoard;
  }

  function isValidMove(row, col) {
    if (board[row][col] !== null) return false;

    const opponent = currentPlayer === "green" ? "white" : "green";
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      let hasOpponent = false;

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (board[x][y] === opponent) {
          hasOpponent = true;
        } else if (board[x][y] === currentPlayer && hasOpponent) {
          return true;
        } else {
          break;
        }
        x += dx;
        y += dy;
      }
    }

    return false;
  }

  function placePiece(row, col) {
    if (!isValidMove(row, col)) return;

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;

    const opponent = currentPlayer === "green" ? "white" : "green";
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      let x = row + dx;
      let y = col + dy;
      const captured = [];

      while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) {
        if (newBoard[x][y] === opponent) {
          captured.push([x, y]);
        } else if (newBoard[x][y] === currentPlayer && captured.length > 0) {
          captured.forEach(([capturedX, capturedY]) => {
            newBoard[capturedX][capturedY] = currentPlayer;
          });
          break;
        } else {
          break;
        }
        x += dx;
        y += dy;
      }
    }

    setBoard(newBoard);
    setCurrentPlayer(opponent);
    checkGameEnd(newBoard);
  }

  function checkGameEnd(board) {
    const isBoardFull = board.every((row) => row.every((cell) => cell !== null));
    const hasValidMoves = board.some((row, rowIndex) => row.some((cell, colIndex) => isValidMove(rowIndex, colIndex)));

    if (isBoardFull || !hasValidMoves) {
      const greenCount = board.flat().filter((cell) => cell === "green").length;
      const whiteCount = board.flat().filter((cell) => cell === "white").length;

      if (greenCount > whiteCount) {
        alert("Green wins!");
      } else if (whiteCount > greenCount) {
        alert("White wins!");
      } else {
        alert("It's a tie!");
      }
    }
  }

  function resetGame() {
    setBoard(initializeBoard());
    setCurrentPlayer("green");
  }

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Current Player: {currentPlayer}
      </Text>
      <Grid templateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1} width={isLargerThan600 ? "500px" : "100%"} mx="auto">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GridItem key={`${rowIndex}-${colIndex}`} bg="gray.100" borderWidth={1} borderColor="gray.300" display="flex" justifyContent="center" alignItems="center" onClick={() => placePiece(rowIndex, colIndex)} cursor="pointer">
              {cell && <Circle size={isLargerThan600 ? "40px" : "20px"} bg={cell} />}
            </GridItem>
          )),
        )}
      </Grid>
      <Button mt={4} onClick={resetGame}>
        New Game
      </Button>
    </Box>
  );
};

export default Index;
