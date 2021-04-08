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
    exponent: 0.5,

    update(diff) {

      if (hasUpgrade("S", 11)) {
        buyUpgrade("d", 11)
        buyUpgrade("d", 12)
        buyUpgrade("d", 22)
        buyUpgrade("d", 23)
        buyUpgrade("d", 24)
      }


},

    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasChallenge("d", 11) || hasUpgrade("S", 14)) mult = mult.times(2)
        if (hasUpgrade("W", 11)) mult = mult.times(upgradeEffect("W", 11))
        if (hasMilestone("W", 0)) mult = mult.times(1.5)
        if (hasUpgrade("W", 22)) mult = mult.times(1.2)
        if (hasUpgrade("W", 25)) mult = mult.times(2)
        if (hasUpgrade("S", 12)) mult = mult.times(upgradeEffect("S", 12))
        if (inChallenge("W", 11)) mult = mult.times(0.0001)
        if (hasChallenge("W", 11)) mult = mult.times(3)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    passiveGeneration() {
      passive = new Decimal(0)
      if (hasUpgrade("W", 23))  passive = new Decimal(0.1)
      if (hasChallenge("d", 12) || hasUpgrade("S", 14)) passive = new Decimal(0.25)
      if (hasUpgrade("S", 15)) passive = new Decimal(0.5)
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
    rows: 3,
    cols: 2,
    11: {
        name: "Ouch ",
        challengeDescription: "description of ouchie, you are dirty and square rooted lol.",
        goal: new Decimal(500),
        rewardDescription: "2x dirt",
        unlocked() {return (hasUpgrade(this.layer, 24) && !hasUpgrade("S", 14))},
    },
    11: {
        name: "Ouch ",
        challengeDescription: "description of ouchie, you are dirty and square rooted lol.",
        goal: new Decimal(500),
        rewardDescription: "2x dirt",
        unlocked() {return (hasUpgrade(this.layer, 24) && !hasUpgrade("S", 14))},
    },
    12: {
      name: "HUNGERY ep 1.",
      challengeDescription: "You are HUNGARY, only apple buyables work.",
      goal: new Decimal(500),
      rewardDescription: "Upgrade passive generation to 25%",
      unlocked() {return (hasMilestone("W", 2) && hasChallenge("d", 11) && !hasUpgrade("S", 14))}
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
      unlocked() {return (hasChallenge("d", 12) || hasUpgrade("S", 14) && hasMilestone("W", 2))}
    },
    22: {
      name: "Is that a...pickaxe?",
      challengeDescription: "Challenge the pickaxe! First 2 challenges are applied.",
      goal: new Decimal(1000),
      rewardDescription: "Unlock a new layer.",
      countsAs: [11, 12],
      unlocked() {return (hasChallenge("d", 21))}
    },
    23: {
      name: "Is that an...axe?",
      challengeDescription: "First 2 challenges are applied, except goal is higher.",
      goal: new Decimal(10000),
      rewardDescription: "Unlock a new layer.(Not done but stay tuned)",
      countsAs: [11, 12],
      unlocked() {return (hasChallenge("d", 22) && hasUpgrade("S", 22))}
    },
    31: {
      name: "Is that an...axe?",
      challengeDescription: "First 2 challenges are applied, except goal is higher.",
      goal: new Decimal(2000),
      rewardDescription: "Unlock a something new",
      countsAs: [11, 12],
      unlocked() {return (hasChallenge("d", 22) && hasUpgrade("S", 22))}
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
  requires: new Decimal (10000),
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
    if (hasUpgrade("S", 13)) mult = mult.times(upgradeEffect("S", 13))
    if (inChallenge("W", 12)) player[this.layer].points = new Decimal(0)
    return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
    return new Decimal(1)
    },

    layerShown() { return hasChallenge("d", 11) || player[this.layer].points.gte(1) || hasUpgrade("W", 11) || player["S"].points.gte(1) || hasUpgrade("S", 14) }   ,
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
          if (ret.gte("2")) ret = ret.sqrt().times("1.41")
          if (ret.gte("10")) ret = ret.sqrt().times("3")
          if (ret.gte("25")) ret = ret.sqrt().times("5")
          return ret;
        },

        effectDisplay() { return format(this.effect())+"x" },

      },
      12: {
        title: "Jump Boost!",
        description: "You train your feet in order to reach higher, which allows for 1.5x wood! Looks like you are extremely tired though...",
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
            cost(x) {
              let cost = new Decimal(1).mul(x || getBuyableAmount(this.layer, this.id)).pow(1.3)
              if (hasUpgrade("S", 21)) cost = cost.times(0.9)
              if (getBuyableAmount(this.layer, this.id).lt(100) & hasMilestone("i", 1)) {cost = new Decimal(0)}
              return cost
            },
            display() {
              let data = tmp[this.layer].buyables[this.id]
               let display = ("Cost: " + formatWhole(data.cost) + " Wood. Apples boosts energy gain.") + "\n\ Amount: " + format(player[this.layer].buyables[this.id]) + "\n\ Currently " + format(buyableEffect(this.layer, this.id)) + "x"
               return display
            },
            canAfford() { return player[this.layer].points.gte(this.cost()) },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect() {
              let ret = new Decimal(getBuyableAmount(this.layer, this.id))
              ret = ret.times(4).sqrt().add(1)
              if (hasUpgrade("S", 21)) ret = ret.times(2)
              return ret;
            },

        },

    },
challenges: {
  rows: 1,
  cols: 2,
  11: {
    name: "I NEED DIRT",
    challengeDescription: "Dirt gain is very bad so ya",
    goalDescription: "100 Dirt",
    rewardDescription: "Unlock more challenge and 3x Dirt",
    canComplete() {
      return player["d"].points.gte(100)
    },
    unlocked() {return hasChallenge("d", 31) || inChallenge("W", 11) || hasChallenge("W", 11)}
  },
  12: {
    name: "Burn Baby Burn!",
    challengeDescription: "Wood will be set to nada",
    rewardDescription: "Unlock new stuff again(NOT DONE)",
    goal: new Decimal(100000000000),
    unlocked() {return hasChallenge("W", 11)}
  }
}

})
addLayer("S", {
  name: "Stone",
  symbol: "S",
  position: 0,
  row: 2,
  startData() { return {
      unlocked: true,
      points: new Decimal(0),
      total: new Decimal(0)
  }},
  color: "#C0C0C0",
  requires: new Decimal (10000),
  resource: "Stone",
  baseResource: "Wood",
  branches: ["W"],
  baseAmount() { return player["W"].points },
    // A function to return the current amount of baseResource.



  type: "normal",                         // Determines the formula used for calculating prestige currency.
  exponent: 0.30103,                          // "normal" prestige gain is (currency^exponent).

  gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
    mult = new Decimal(1)
    if (hasMilestone("i", 2)) mult = mult.times(2)
    if (getBuyableAmount("F", 11).gt(0)) mult = mult.times(buyableEffect("F", 11))
    return mult              // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
    return new Decimal(1)
    },

    layerShown() { return hasChallenge("d", 22) || player[this.layer].points.gte(1) || hasUpgrade("S", 11)},


upgrades: {
  rows: 3,
  cols: 5,
  11: {
    title: "Experience",
    description: "Knowing what to do after you reset after this point, you can auto buy dirt upgrades.",
    cost: new Decimal(1)
  },
  12: {
    title: "Hatred...",
    description: "Stone resetting everything increases your hatred...increase your dirt gain by total stone.",
    cost: new Decimal(1),
    effect() {
      let ret = player[this.layer].total.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5))
      if (ret.gte("2")) ret = ret.sqrt().times("1.41")
      if (ret.gte("3")) ret = ret.sqrt().times("1.77")
      if (ret.gte("4")) ret = ret.sqrt().times("2")
      if (ret.gte("9")) ret = ret.sqrt().times("3")
      if (ret.gte("16")) ret = ret.sqrt().times("4")
      if (ret.gte("25")) ret = ret.sqrt().times("5")
      return ret;
  },
  effectDisplay() { return format(this.effect())+"x" },
},
  13: {
    title: "Motivating the Motivating Motivation",
    description: "Boost wood gain a little by unspent stone",
    cost: new Decimal(1),
    effect() {
      let ret = player[this.layer].points.add(1).pow(player[this.layer].upgrades.includes(24)?1.1:(player[this.layer].upgrades.includes(14)?0.75:0.5))
      if (ret.gte("2")) ret = ret.sqrt().times("1.41")
      if (ret.gte("4")) ret = ret.sqrt().times("2")
      if (ret.gte("9")) ret = ret.sqrt().times("3")
      if (ret.gte("16")) ret = ret.sqrt().times("4")
      if (ret.gte("25")) ret = ret.sqrt().times("5")
      return ret;
    },
    effectDisplay() { return format(this.effect())+"x" },
  },
  14: {
    title: "OverOverOvercome",
    description: "OverOverOvercome first 2 dirt challenges, not able to complete them but get the buffs!",
    cost: new Decimal(2),
    unlocked() {return hasUpgrade("S", 11) && hasUpgrade("S", 12) && hasUpgrade("S", 13)}
  },
  15: {
    title: "OverOverOverpowered.",
    description: "With your new come power, dirt passive generation boosts to 50%",
    cost: new Decimal(3),
    unlocked() {return hasUpgrade("S", 14)}
  },
  21: {
    title: "How do you like them apples?",
    description: "Boost your apples buff by 2x and price by 0.9x",
    cost: new Decimal(5),
    unlocked() {return hasUpgrade("S", 15)}
  },
  22: {
    title: "There's a point to that dirt challenge?!",
    description: "Beating 'Is that a...pickaxe?' will grant an additional reward if you have this upgrade.",
    cost: new Decimal(5),
    unlocked() {return hasUpgrade("S", 21)}
  },
  23: {
    title: "Furnace 100%",
    description: "Get a 1.5x buff to coal buff. Get the next upgrade to totally unlock secret!",
    cost: new Decimal(10),
    unlocked() {return hasUpgrade("c", 13)},
  }

},
})
addLayer("c", {
    startData() { return {                  // startData is a function that returns default data for a layer.
        unlocked: true,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#777777",                       // The color for this layer, which affects many elements.
    resource: "Coal",            // The name of this layer's main prestige resource.
    row: 2,
    position: 1,                                 // The row this layer is on (0 is the first row).
    branches: ["W"],
    baseResource: "energy",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },  // A function to return the current amount of baseResource.

    requires: new Decimal(1e10),              // The amount of the base needed to  gain 1 of the prestige currency.
    base: 4,                              // Also the amount required to unlock the layer.

    type: "static",                         // Determines the formula used for calculating prestige currency.
    exponent: 1.2,                          // "normal" prestige gain is (currency^exponent).
    canBuyMax() { return false},
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },

    layerShown() { return hasChallenge("W", 12) || hasUpgrade("c", 11) || player[this.layer].points.gte(1) },
    upgrades: {
      rows: 1,
      cols: 5,
      11: {
        title: "Make it actually do stuff",
        description: "Coal multiplies your point gain. Can be softcapped.",
        cost: new Decimal(1),
        effect() {
          let ret = new Decimal(1)
          let exp = new Decimal(player[this.layer].points)
          let base = new Decimal(2)
          if (hasUpgrade("c", 12)) base = base.times(upgradeEffect("c", 12))
          ret = base.pow(exp)
          if (hasUpgrade("S", 23)) ret = ret.times(1.5)
          if (ret.lte(1)) ret = new Decimal(1)
          if (ret.gte("100")) ret = ret.sqrt().times("10")
          if (ret.gte("200")) ret = ret.sqrt().times("14.5")
          if (ret.gte("300")) ret = ret.sqrt().times("17.2")
          if (ret.gte("400")) ret = ret.sqrt().times("20")
          if (ret.gte("900")) ret = ret.sqrt().times("30")
          if (ret.gte("1600")) ret = ret.sqrt().times("40")
          return ret
        },
        effectDisplay() { return format(upgradeEffect("c", 11))+"x" },
      },
      12: {
        title: "I burn woodemon go everyday.",
        description: "Wood increases your coal multi",
        cost: new Decimal(1),
        unlocked() {return hasUpgrade("c", 11)},
        effect() {
          let ret = player["W"].points.times(0.001)
          if (ret.gte("2")) ret = ret.sqrt().times("1.41")
          if (ret.gte("3")) ret = ret.sqrt().times("1.77")
          if (ret.gte("4")) ret = ret.sqrt().times("2")
          if (ret.gte("9")) ret = ret.sqrt().times("3")
          if (ret.gte("16")) ret = ret.sqrt().times("4")
          if (ret.gte("25")) ret = ret.sqrt().times("5")
          ret = ret.add(3)
          return ret
        },
        effectDisplay() { return format(upgradeEffect("c", 12))+"x" },
      },
      13: {
        title: "Furnace 50%",
        description: "Nada, NADA *cricket noises*, 0",
        cost: new Decimal(3),
        unlocked() {return hasUpgrade("c", 12)},
      },
      14: {
        title: "THE PROPHECY",
        description: "You realise there is no iron in the ground to continue...",
        cost: new Decimal(1),
        unlocked() {return hasUpgrade("S", 23)}
      },
      15: {
        title: "THE PROPHECY 2.0",
        description: "You must create 1e15 energy to reach iron, good luck! (NOT DONE)",
        cost: new Decimal(1),
        unlocked() {return hasUpgrade("c", 14)}
      }
    }

  })
  addLayer("F", {
    startData() { return {                  // startData is a function that returns default data for a layer.
        unlocked: false,                     // You can add more variables here to add them to your layer.
        points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
    }},

    color: "#d4f1f9",                       // The color for this layer, which affects many elements.
    resource: "Fluid",            // The name of this layer's main prestige resource.
    row: 3,
    position: 1,
    type: "normal",
    exponent: "0.5",
    requires: new Decimal(1e15),                                // The row this layer is on (0 is the first row).
    branches: ["S", "c"],
    baseResource: "energy",                 // The name of the resource your prestige gain is based on.
    baseAmount() { return player.points },
    layerShown() { return hasUpgrade("i", 11) || player[this.layer].points.gte(1)},
    gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
        return new Decimal(1)               // Factor in any bonuses multiplying gain here.
    },
    gainExp() {                             // Returns your exponent to your gain of the prestige resource.
        return new Decimal(1)
    },
    buyables: {
      rows: 1,
      cols: 2,
    11: {
      title: "Water",
        unlocked() {return true},
        cost(x) {
          let cost = new Decimal(1).mul(x || getBuyableAmount(this.layer, this.id)).pow(1.3)
          return cost
        },
        display() {
          let data = tmp[this.layer].buyables[this.id]
           let display = ("Cost: " + formatWhole(data.cost) + " Fluid. Water boosts stone gain.") + "\n\ Amount: " + format(player[this.layer].buyables[this.id]) + "\n\ Currently " + format(buyableEffect(this.layer, this.id)) + "x"
           return display
        },
        canAfford() { return player[this.layer].points.gte(this.cost()) },
        buy() {
            player[this.layer].points = player[this.layer].points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
        },
        effect() {
          let ret = new Decimal(getBuyableAmount(this.layer, this.id).add(1))
          ret = ret.times(15).log(10)
          return ret;
        },
      }
    }
}),
addLayer("i", {
  startData() { return {                  // startData is a function that returns default data for a layer.
      unlocked: false,                     // You can add more variables here to add them to your layer.
      points: new Decimal(0),             // "points" is the internal name for the main resource of the layer.
  }},

  color: "#D3D3D3",                       // The color for this layer, which affects many elements.
  resource: "Iron",            // The name of this layer's main prestige resource.
  row: 3,
  position: 2,
  type: "normal",
  exponent: "0.5",
  requires: new Decimal(1e15),                                // The row this layer is on (0 is the first row).
  branches: ["S", "c"],
  baseResource: "energy",                 // The name of the resource your prestige gain is based on.
  baseAmount() { return player.points },
  layerShown() { return hasUpgrade("c", 15) || player[this.layer].points.gte(1)},
  gainMult() {                            // Returns your multiplier to your gain of the prestige resource.
      return new Decimal(1)               // Factor in any bonuses multiplying gain here.
  },
  gainExp() {                             // Returns your exponent to your gain of the prestige resource.
      return new Decimal(1)
  },
  milestones: {
      0: {
          requirementDescription: "1 Iron",
          effectDescription: "5x energy unaffected by hungary and ouch.",
          done() { return player[this.layer].points.gte(1) }
      },
      1: {
        requirementDescription: "2 Iron",
        effectDescription: "First 100 apples are free",
        done() { return player[this.layer].points.gte(2) }
      },
      2: {
        requirementDescription: "3 Iron",
        effectDescription: "2x Stone",
        done() { return player[this.layer].points.gte(4) }
      },
    },
upgrades: {
  rows: 3,
  cols: 3,
  11: {
    title: "Gimme that bucket",
    description: "Unlock a new Layer, wait wat?!?!",
    cost: new Decimal(3)
  }
},

})
