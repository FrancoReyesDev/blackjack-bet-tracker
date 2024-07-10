"use client";

import { useEffect, useState } from "react";
import { Hand } from "./Hand";

export const Player: React.FC = () => {
  const [money, setMoney] = useState(0);
  const [hands, setHands] = useState<
    Map<Symbol, { id: Symbol; initialBet: number }>
  >(new Map());

  const bet = (betAmmount: number, changeMoney: boolean = true) => {
    const canBet = (money - betAmmount >= 0)
    if (canBet && changeMoney)
      setMoney(money - betAmmount)

    return canBet
  }

  const addHand = (betAmmount: number) => {
    if (!bet(betAmmount)) return alert("no tienes suficiente dinero!");
    const newHandId = Symbol();
    hands.set(newHandId, { id: newHandId, initialBet: betAmmount });
    setHands(new Map(hands));
  };

  const endSecure = (secure: number, status: "win" | "lose") => {
    if (status === "win") setMoney(money + secure);
    if (status === "lose") setMoney(money - secure);
  };


  const endHand = (
    handId: Symbol,
    bet: number,
    status: "win" | "lose" | "tie"
  ) => {
    alert(status)
    if (status === "win") setMoney(money + bet * 2);
    if (status === "tie") setMoney(money + bet);

    hands.delete(handId);
    setHands(new Map(hands))
  };

  const openHand = (betAmmount: number) => {
    addHand(betAmmount);
  };

  const setInitialMoney = () => {
    const money = prompt("Mete plata capo");
    const moneyToNumber = Number(money);

    if (isNaN(moneyToNumber)) {
      alert("Debes colocar un numero!");
      return setInitialMoney();
    }

    if (moneyToNumber <= 0) {
      alert("Tenes que tener mas de 0!");
      return setInitialMoney();
    }

    return setMoney(moneyToNumber);
  };

  const startHandHandler = () => {
    const bet = prompt("Hace tu apuesta");
    const betToNumber = Number(bet);

    if (isNaN(betToNumber)) {
      alert("Debes colocar un numero!");
      return startHandHandler();
    }

    if (betToNumber <= 0) {
      alert("Tenes que apostar mas de 0!");
      return startHandHandler();
    }

    if (betToNumber > money) {
      alert("No podes apostar mas de lo que tenes!");
      return startHandHandler();
    }

    return addHand(betToNumber);
  };

  const init = () => {
    if (money === 0 && hands.size === 0) return setInitialMoney();

  };

  useEffect(() => {
    init();
  }, [money, hands]);

  return (
    <div className="flex flex-col gap-3 p-4 ">
      <div className="flex flex-row gap-10">
        Money:{" "}
        <input
          type="number"
          value={money}
          min={0}
          onChange={(e) => setMoney(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-row gap-10">
        {hands.size === 0 ? <button onClick={startHandHandler}>apostar</button> : <></>}
        {Array.from(hands.values()).map(({ initialBet, id }, key) => (
          <Hand
            key={key}
            bet={bet}
            openHand={openHand}
            initialBet={initialBet}
            id={id}
            endHand={endHand}
            endSecure={endSecure}
          />
        ))}
      </div>
    </div>
  );
};
