type HandActions = "fold" | "blackjack" | "lose" | "win" | "tie" | "simple";

type HandMachine = {
  [key in Hand["gameStatus"]]: {
    [key in HandActions]?: () => void;
  };
};

export class Hand {
  id: Symbol;
  bet: number;
  gameStatus: "normal" | "blackjack" | "folded";

  thereIsSecure: boolean;
  secure: number;

  private endHand: Player["endHand"];
  private endSecure: Player["endSecure"];

  history: { bet: number; gameStatus: Hand["gameStatus"] }[];

  constructor({
    id,
    bet,
    endHand,
    endSecure,
  }: {
    id: Symbol;
    bet: number;
    endHand: Player["endHand"];
    endSecure: Player["endSecure"];
  }) {
    this.id = id;
    this.endHand = endHand;
    this.endSecure = endSecure;

    this.gameStatus = "normal";
    this.thereIsSecure = false;
    this.bet = bet;
    this.secure = bet / 2;
    this.history = [];
  }

  gameDispatch(action: HandActions) {
    const commonActions = {
      lose: () => this.endHand(this.id, this.bet, "lose"),
      win: () => this.endHand(this.id, this.bet, "win"),
      tie: () => this.endHand(this.id, this.bet, "tie"),
    };

    const machine: HandMachine = {
      normal: {
        fold: () => {
          this.bet *= 2;
          this.gameStatus = "folded";
        },
        blackjack: () => {
          this.gameStatus = "blackjack";
        },

        ...commonActions,
      },
      blackjack: {
        simple: () => this.endHand(this.id, this.bet, "win"),
        win: () => this.endHand(this.id, this.bet * 1.5, "win"),
        tie: () => this.endHand(this.id, this.bet, "tie"),
      },
      folded: {
        ...commonActions,
      },
    };

    machine[this.gameStatus][action]?.();
  }

  secureDispatch(action: "win" | "lose") {
    this.endSecure(this.secure, action);
    this.thereIsSecure = false;
  }
}

export class Player {
  money: number;
  hands: Map<Symbol, Hand>;

  constructor(initialMoney: number) {
    this.hands = new Map();
    this.money = initialMoney;
  }

  addHand(bet: number) {
    const newHandId = Symbol();
    const newHand = new Hand({
      id: newHandId,
      bet,
      endHand: this.endHand,
      endSecure: this.endSecure,
    });
    this.hands.set(newHandId, newHand);
  }

  endSecure(secure: number, status: "win" | "lose") {
    if (status === "win") this.money += secure;
    if (status === "lose") this.money -= secure;
  }

  endHand(handId: Symbol, beth: number, status: "win" | "lose" | "tie") {
    if (status === "win") this.money += beth;
    if (status === "lose") this.money -= beth;

    this.hands.delete(handId);
  }

  // "fold" | "blackjack" | "lose" | "win" | "tie" | "simple"
  handGameDispatch(handId: Symbol, action: HandActions) {
    const hand = this.hands.get(handId);
    if (hand === undefined) return;

    if (action === "fold" && this.money < hand.bet * 2) return;

    hand.gameDispatch(action);
  }

  openHand(handId: Symbol) {
    const hand = this.hands.get(handId);
    if (hand === undefined) return;
    if (this.money < hand.bet * 2) return;

    this.addHand(hand.bet);
  }
}
