// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

function main() {
  const fillers = {
    archaeologist: [
      "Dr. Archaeologist",
      "Professor of Archeology",
      "Archaeologist who has a gun for some reason",
      "Archaeologist with a whip for some reason",
      "Dr. Harper Jeans Jr.",
      "Dr. Jeans",
    ],
    country: [
      "Peru",
      "Nepal",
      "Egypt",
      "China",
      "India",
      "Italy",
      "Austria",
      "Germany",
      "Turkey",
      "Portugal",
    ],
    descriptor: [
      "",
      "Lost ",
      "Hidden ",
      "Gilded ",
      "Holy ",
      "Golden ",
      "Bronze ",
      "Silver ",
      "Gold ",
      "Crystal ",
      "Ivory ",
    ],
    artifact: [
      "City",
      "Staff",
      "Skull",
      "Medallion",
      "Necklace",
      "Chalice",
      "Mask",
      "Seal",
      "Relic",
      "Idol",
      "Stones",
      "Cross",
      "Painting",
      "Book",
      "Sword",
    ],
    of: [
      "",
      "",
      " of Kings",
      " of the Covenant",
      " of God",
      " of Ra",
      " of Atlantis",
      "of Buddha",
    ],
    baddies: [
      "nazis",
      "fascists",
      "Tesla car owners",
      "evil tribe",
      "neo-nazis",
      "KGB agents",
    ],
    partner: [
      "your ex-girlfriend",
      "your friend who is also a child",
      "father that you have a LOT of issues with",
      "your ex-wife",
    ],
  };

  function generatePrompt() {
    const d = fillers.descriptor;
    const a = fillers.artifact;
    const o = fillers.of;
    let artifact = `${d[Math.floor(Math.random() * d.length)]}${
      a[Math.floor(Math.random() * a.length)]
    }${o[Math.floor(Math.random() * o.length)]}`;
    let badGuys = `${
      fillers.baddies[Math.floor(Math.random() * fillers.baddies.length)]
    }`;

    const template = `    $archaeologist, you're needed urgently!\n
  
    We need you to find the whereabouts of the ${artifact}.\n
  
    This ${artifact} is being sought after by the ${badGuys}. If they get their grubby hands on it, desolation is certain!\n
  
    You must first go to $country in order to find your $partner. They have the key to find the ${artifact}.\n
  
    Find the ${artifact}, and stop the ${badGuys}!
    \n
    \n
    Safe travels,\n
    - Your boss
    
    
    `;

    return template;
  }

  // STUDENTS: You don't need to edit code below this line.

  const slotPattern = /\$(\w+)/;

  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }

  function generate() {
    let story = generatePrompt();
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    /* global box */
    $("#box").text(story);
  }

  /* global clicker */
  clicker.onclick = generate;
  $("#clicker").click(generate);

  generate();
}

// let's get this party started - uncomment me
main();
