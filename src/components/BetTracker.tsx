"use client";

import { useEffect, useState } from "react";
import { Hand } from "./Hand";

export const BetTracker: React.FC = () => {
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
  };


  const endHand = (
    handId: Symbol,
    bet: number,
    status: "win" | "lose" | "tie"
  ) => {
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
  }, [money, hands]);

  return (
    <div id="BetTracker" className="flex flex-col h-full ">
      <div id="Money" className="flex flex-row py-3 bg-gradient-to-r justify-center from-transparent via-black to-transparent">
        <div className="cursor-pointer text-5xl text-yellow-600 font-bold hover:before:content-['+']" onClick={setInitialMoney}>${money}</div>
      </div>
      <div className="flex flex-row justify-center align-center flex-grow  gap-10">
        {hands.size === 0 ? <button onClick={startHandHandler}>nueva mano</button> : <></>}
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
