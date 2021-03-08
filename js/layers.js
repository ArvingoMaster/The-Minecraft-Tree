addLayer("d", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "D", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
        points: new Decimal(0)
    }},
    color: "#964B00",
    requires: new Decimal(1), // Can be a function that takes requirement increases into account
    resource: "Dirt", // Name of prestige currency
    baseResource: "energy", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasChallenge("d", 11)) mult = mult.times(2)
        if (hasUpgrade("W", 11)) mult = mult.times(upgradeEffect("W", 11))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
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
            if (ret.gte("100")) ret = ret.sqrt().times("2")
            if (ret.gte("1000")) ret = tet.sqrt().times("1")
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
        if (ret.gte("3")) ret = ret.sqrt().times("1")
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
      cost: new Decimal(100),
      unlocked() {return (hasUpgrade(this.layer, 23))}
    }
},

challenges: {
    rows: 1,
    cols: 1,
    11: {
        name: "Ouch ",
        challengeDescription: "description of ouchie, you are dirty and square rooted lol.",
        goal: new Decimal(500),
        rewardDescription: "2x dirt",
        unlocked() {return (hasUpgrade(this.layer, 24))},
    }
}

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
  baseAmount() { return player.points },
    // A function to return the current amount of baseResource.




  type: "normal",                         // Determines the formula used for calculating prestige currency.
  exponent: 0.5,                          // "normal" prestige gain is (currency^exponent).

  gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
    return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
    return new Decimal(1)
    },

    layerShown() { return true }   ,
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
      cols: 3,
      11: {
        title: "Motivating 2.0",
        description: "Wood boosts your dirt gain by small amount.",
        cost: new Decimal(3),
        unlocked() {return (player[this.layer].points.gte("1")) || hasUpgrade(this.layer, 11)},
        effect() {
          let ret = player[this.layer].points.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5))
          if (ret.gte("1")) ret = ret.sqrt()
          if (ret.gte("10")) ret = ret.sqrt().times("2")
          if (ret.gte("25")) ret = ret.sqrt().times("5")
          return ret;
        },

        effectDisplay() { return format(this.effect())+"x" },

      },
    },


})
