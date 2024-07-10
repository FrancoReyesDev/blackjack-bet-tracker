import { HandAction } from "@/types";
import { useReducer, useState } from "react";

type HandStatus = "normal" | "blackjack" | "folded";

type HandState = {
  state: HandStatus;
  bet: number;
  secure: 0;
};

type HandMachine = {
  [key in HandStatus]: {
    [key in HandAction]?: () => HandState | void;
  };
};

type HandProps = {
  id: Symbol;
  initialBet: number;
  openHand: (betAmmount: number) => void;
  bet: (betAmmount: number, changeMoney?: boolean) => boolean;
  endHand: (
    handId: Symbol,
    betAmmount: number,
    status: "win" | "lose" | "tie"
  ) => void;
  endSecure: (secure: number, status: "win" | "lose") => void;
}

export const Hand: React.FC<HandProps> = ({ id, initialBet, endHand, bet, endSecure, openHand }) => {
  const [state, dispatch] = useReducer(
    (state: HandState, action: HandAction) => {

      const endActions = {
        lose: () => endHand(id, state.bet, "lose"),
        win: () => endHand(id, state.bet, "win"),
        tie: () => endHand(id, state.bet, "tie"),
      };

      const blackjackEndActions = {
        simple: () => endHand(id, state.bet, "win"),
        win: () => endHand(id, state.bet * 1.25, "win"),
        tie: () => endHand(id, state.bet, "tie"),
      };

      const machine: HandMachine = {
        normal: {
          fold: () =>
            bet(initialBet) ? ({
              bet: state.bet * 2,
              state: "folded",
              secure: state.secure
            }) : state satisfies HandState

          ,
          blackjack: () => ({
            state: "blackjack",
            bet: initialBet
            , secure: state.secure
          })
          , ...endActions,
        },
        blackjack: {
          ...blackjackEndActions,
        },
        folded: {
          ...endActions,
        },
      };

      return machine[state.state][action]?.() || state;
    },
    {
      state: "normal",
      bet: initialBet,
      secure: 0
    } satisfies HandState
  );

  const [thereIsSecure, setThereIsSecure] = useState(false);

  const endSecureHandler = (status: "win" | "lose") => {
    endSecure(initialBet / 2, status);
    setThereIsSecure(false);
  };

  const openHandHandler = () => openHand(initialBet);

  if (state.state === "blackjack")
    return (
      <HandUI handState={state}>
        <button onClick={() => dispatch("simple")}>ganado simple</button>
        <button onClick={() => dispatch("win")}>ganado</button>
        <button onClick={() => dispatch("tie")}>empate</button>

      </HandUI>
    );

  if (state.state === "folded")
    return (
      <HandUI handState={state}>
        <button onClick={() => dispatch("lose")}>perdido</button>
        <button onClick={() => dispatch("win")}>ganado</button>
        <button onClick={() => dispatch("tie")}>empate</button>

      </HandUI>
    );


  return (
    <HandUI handState={state}>
      {bet(initialBet, false) ? (<>
        <button onClick={openHandHandler}>abrir</button>
        <button onClick={() => dispatch("fold")}>doblar</button>
      </>) : null}
      <button onClick={() => dispatch("blackjack")}>blackjack</button>
      <button onClick={() => dispatch("lose")}>perdido</button>
      <button onClick={() => dispatch("win")}>ganado</button>
      <button onClick={() => dispatch("tie")}>empate</button>

    </HandUI>
  );


};

const HandUI: React.FC<{ handState: HandState, children: React.ReactNode }> = ({ handState, children }) => (
  <div className="flex flex-col">
    <div className="flex flex-row">
      <div>bet: {handState.bet}</div>
      <div>state:{handState.state}</div>
    </div>
    <div className="flex flex-row gap-3 ">
      {children}
    </div>
  </div>


)
