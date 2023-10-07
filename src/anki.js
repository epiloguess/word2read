import fs from "fs";
import AnkiExport from "anki-apkg-export";

const apkg = new AnkiExport("deck-name");

apkg.addCard("card #1 front", "card #1 back");
apkg.addCard("card #2 front", "card #2 back", {
  tags: ["nice", "better card"],
});

apkg
  .save()
  .then((zip) => {
    fs.writeFileSync("./output.apkg", zip, "binary");
    console.log(`Package has been generated: output.pkg`);
  })
  .catch((err) => console.log(err.stack || err));
