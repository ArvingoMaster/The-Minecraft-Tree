addLayer("d", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    color: "#964B00",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Dirt", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasChallenge("d", 11)) mult = mult.times(2)
        if (hasUpgrade("W", 11)) mult = mult.times(upgradeEffect("W", 11))
        if (hasMilestone("W", 0)) mult = mult.times(1.5)
        if (hasUpgrade("W", 22)) mult = mult.times(1.2)
        if (hasUpgrade("W", 25)) mult = mult.times(2)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
      passive = new Decimal(0)
      if (hasUpgrade("W", 23))  passive = new Decimal(0.1)
      if (hasChallenge("d", 12)) passive = new Decimal(0.25)
      return passive
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "d", description: "D: Reset for D.", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],







    layerShown(){return true},
    upgrades: {
    rows: 3,
    cols: 5,
    11: {
        description: "UPGRADE YOUR HANDS! x2 Energy",
        cost: new Decimal(1),
        effect(){
          ret = new Decimal(player[this.layer].points.times(2))
          return ret;
        }
    },
    12: {
        title: "Motivation",
        description: "Point generation is faster based on your unspent Dirt.",
        cost: new Decimal(5),
        unlocked() { return (hasUpgrade(this.layer, 11))},
        effect() { // Calculate bonuses from the upgrade. Can return a single value or an object with multiple values
            let ret = player[this.layer].points.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5))
            if (ret.gte("100")) ret = ret.sqrt().times("10")
            if (ret.gte("1000")) ret = ret.sqrt().times("33")
            if (ret.gte("10000")) ret = ret.sqrt().times("100")
            if (ret.gte("100000")) ret = ret.sqrt().times("330")

            return ret;
        },
        effectDisplay() { return format(this.effect())+"x" }, // Add formatting to the effect
    },

    22: {
      title: "Powersurge",
      description: "Increase Energy Gain by Time passed",
      cost: new Decimal(10),
      unlocked() { return (hasUpgrade(this.layer, 12))},
      effect() {
        let get = new Decimal(player.timePlayed)
        let ret = get.times(0.002).add(2)
        if (ret.gte("3")) ret = ret.sqrt().times("1.732")
        return ret;

      },
      effectDisplay() { return format(this.effect())+"x" },
    },
    23: {
      title: "Dirty Shovela",
      description: "Double Energy Gain, again!",
      cost: new Decimal(25),
      unlocked() { return (hasUpgrade(this.layer, 22))},
    },
    24: {
      title: "Dorty Challenge",
      description: "Unlock a challenge",
      cost: new Decimal(50),
      unlocked() {return (hasUpgrade(this.layer, 23))}
    }
},

challenges: {
    rows: 2,
    cols: 2,
    11: {
        name: "Ouch ",
        challengeDescription: "description of ouchie, you are dirty and square rooted lol.",
        goal: new Decimal(500),
        rewardDescription: "2x dirt",
        unlocked() {return (hasUpgrade(this.layer, 24))},
    },
    12: {
      name: "HUNGERY ep 1.",
      challengeDescription: "You are HUNGARY, only apple buyables work.",
      goal: new Decimal(500),
      rewardDescription: "Upgrade passive generation to 25%",
      unlocked() {return (hasMilestone("W", 2)) && hasChallenge("d", 11)}
    },
    13: {
      name: "Sleeping Dirty",
      challengeDescription: "You are asleep, having /100,000,000 Energy Gain also square rooted, have fun!",
      goal: new Decimal(1),
      rewardDescription: "You have +1 energy gain protected from all challenge debuffs",
      unlocked() {return (hasChallenge("d", 12))}

    },
    21: {
      name: "Sleeping Dirty",
      challengeDescription: "You are asleep, having /100,000,000 Energy Gain also square rooted, have fun!",
      goal: new Decimal(1),
      rewardDescription: "You have +1 energy gain protected from all challenge debuffs",
      unlocked() {return (hasChallenge("d", 12))}
    }
},

}
)
addLayer("W", {
  name: "Wood",
  symbol: "W",
  position: 0,
  row: 1,
  startData() { return {
      unlocked: true,
      points: new Decimal(0),
      Dirt: new Decimal(0),
  }},
  color: "#964B00",
  requires: new Decimal (1),
  resource: "Wood",
  baseResource: "energy",
  branches: ["d"],
  baseAmount() { return player.points },
    // A function to return the current amount of baseResource.




  type: "normal",                         // Determines the formula used for calculating prestige currency.
  exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

  gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
    mult = new Decimal(1)
    if (hasUpgrade("W", 21)) mult = mult.times(1.2)
    if (hasUpgrade("W", 22)) mult = mult.times(1.2)
    if (hasUpgrade("W", 23)) mult = mult.times(1.1)
    if (hasUpgrade("W", 24)) mult = mult.times(2)
    if (hasUpgrade("W", 25)) mult = mult.times(2)
    if (hasUpgrade("W", 12)) mult = mult.times(1.5)
    return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
    return new Decimal(1)
    },

    layerShown() { return hasChallenge("d", 11) || player[this.layer].points.gte(1) || hasUpgrade("W", 11) }   ,
    milestones: {
        0: {
            requirementDescription: "5 Wood",
            effectDescription: "Keep your sanity, 1.5x Dirt.",
            done() { return player[this.layer].points.gte(5) }
        },
        1: {
          requirementDescription: "50 Wood",
          effectDescription: "Unlock buyable.",
          done() { return player[this.layer].points.gte(50) }
        },
        2: {
          requirementDescription: "1000 Wood",
          effectDescription: "Unlock more dirt challenges.",
          done() { return player[this.layer].points.gte(1000) }
        }         // Returns a bool for if this layer's node should be visible in the tree.
},
    upgrades: {
      rows: 2,
      cols: 5,
      11: {
        title: "Motivating Motivation",
        description: "Wood boosts your dirt gain by small amount.",
        cost: new Decimal(1),
        unlocked() {return (player[this.layer].points.gte("1")) || hasUpgrade(this.layer, 11)},
        effect() {
          let ret = player[this.layer].points.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5))
          if (ret.gte("2")) ret = ret.sqrt()
          if (ret.gte("10")) ret = ret.sqrt().times("2")
          if (ret.gte("25")) ret = ret.sqrt().times("5")
          return ret;
        },

        effectDisplay() { return format(this.effect())+"x" },

      },
      12: {
        title: "Jump Boost!",
        description: "You train your feet in order to reach higher, whihc allows for 1.5x wood! Looks like you are extremely tired though...",
        cost: new Decimal(10),
        unlocked() {return hasUpgrade("W", 22)}
      },
      21: {
        title: "Karate 20%",
        description: "Start learning karate to up your wood gain, will also give other boosts. This one give 1.2x Wood.",
        cost: new Decimal(5),
        unlocked() {return hasUpgrade("W", 11)}
      },
      22: {
        title: "Karate 40%",
        description: "You can chop harder, increasing both dirt and wood gain by 1.2x",
        cost: new Decimal(7),
        unlocked() {return hasUpgrade("W", 21)}
      },
      23: {
        title: "Karate 60%",
        description: "You can multitask, increasing your dirt by 10% of your dirt gain per second and wood gain by 1.1x",
        cost: new Decimal(10),
        unlocked() {return hasUpgrade("W", 22)}
      },
      24: {
        title: "Karate 80%",
        description: "You focus more strongly on wood chopping, wtih 2x more wood!",
        cost: new Decimal(15),
        unlocked() {return hasUpgrade("W", 23)}
      },
      25: {
        title: "Karate 100%",
        description: "You seem to mastered this art, 2x wood gain, 2x dirt gain, and 2x energy gain!",
        cost: new Decimal(25),
        unlocked() {return hasUpgrade("W", 24)}
      },
    },
    buyables: {
        rows: 1,
        cols: 1,
        11: {
          title: "Apples",
            unlocked() {return hasMilestone(this.layer, 1)},
            cost(x) { return new Decimal(1).mul(x || getBuyableAmount(this.layer, this.id)).pow(1.3)},
            display() {
              let data = tmp[this.layer].buyables[this.id]
               let display = ("Cost: " + formatWhole(data.cost) + " Wood. Apples boosts energy gain.") + "\n\ Amount: " + formatWhole(player[this.layer].buyables[this.id]) + "\n\ Currently " + formatWhole(buyableEffect(this.layer, this.id)) + "x"
               return display
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
              let ret = new Decimal(getBuyableAmount(this.layer, this.id).times(4).sqrt())
              return ret;
            },

        },

    }


})
