/*
  app.js - what Carb Counter does when you press Calculate.

  1. Splits the ingredient box into lines.
  2. For each line, finds the amount in grams and the ingredient name.
  3. Looks the name up in the built-in ingredient list below. It only accepts
     exact matches (after removing words like "melted" or "chopped"), so it
     never guesses.
  4. Works out the carbs: grams x (carbs per 100 g) / 100.
  5. Shows a results table, the total, the carbs per serving, and a list of
     any lines it could not count.

  All results are estimates.
*/

/* ------------------------------------------------------------------------
   Built-in ingredient list.

   Each entry has:
     name         - the name shown in the results
     carbsPer100g - grams of total carbohydrate in 100 g of the ingredient
     aliases      - other ways people write the ingredient in recipes

   Values are typical figures based on USDA FoodData Central (mostly the
   "SR Legacy" data set), rounded to one decimal place. Real products vary
   by brand.
   ------------------------------------------------------------------------ */
const INGREDIENTS = [
  // Flours and starches
  { name: "All-purpose flour", carbsPer100g: 76.3, aliases: ["flour", "plain flour", "white flour", "ap flour", "all purpose flour"] },
  { name: "Bread flour", carbsPer100g: 72.5, aliases: ["strong flour", "strong white flour"] },
  { name: "Cake flour", carbsPer100g: 78.0, aliases: [] },
  { name: "Self-rising flour", carbsPer100g: 74.2, aliases: ["self rising flour", "self-raising flour", "self raising flour"] },
  { name: "Whole wheat flour", carbsPer100g: 72.0, aliases: ["whole-wheat flour", "wholemeal flour", "whole wheat"] },
  { name: "Almond flour (blanched)", carbsPer100g: 18.7, aliases: ["almond flour", "ground almonds", "almond meal"] },
  { name: "Cornstarch", carbsPer100g: 91.3, aliases: ["corn starch", "cornflour"] },
  { name: "Cornmeal", carbsPer100g: 79.5, aliases: ["yellow cornmeal", "polenta"] },
  { name: "Rolled oats", carbsPer100g: 67.7, aliases: ["oats", "old-fashioned oats", "old fashioned oats", "quick oats", "oatmeal"] },

  // Sugars and syrups
  { name: "Granulated sugar", carbsPer100g: 100.0, aliases: ["sugar", "white sugar", "caster sugar", "superfine sugar"] },
  { name: "Brown sugar", carbsPer100g: 98.1, aliases: ["light brown sugar", "dark brown sugar"] },
  { name: "Powdered sugar", carbsPer100g: 99.8, aliases: ["icing sugar", "confectioners sugar", "confectioners' sugar"] },
  { name: "Honey", carbsPer100g: 82.4, aliases: [] },
  { name: "Maple syrup", carbsPer100g: 67.0, aliases: [] },
  { name: "Molasses", carbsPer100g: 74.7, aliases: [] },
  { name: "Light corn syrup", carbsPer100g: 76.8, aliases: ["corn syrup"] },

  // Fats
  { name: "Butter", carbsPer100g: 0.1, aliases: ["unsalted butter", "salted butter"] },
  { name: "Vegetable oil", carbsPer100g: 0, aliases: ["oil", "canola oil", "sunflower oil", "olive oil"] },
  { name: "Vegetable shortening", carbsPer100g: 0, aliases: ["shortening"] },

  // Eggs and dairy
  { name: "Whole egg", carbsPer100g: 0.7, aliases: ["egg", "eggs", "whole eggs"] },
  { name: "Egg white", carbsPer100g: 0.7, aliases: ["egg whites"] },
  { name: "Egg yolk", carbsPer100g: 3.6, aliases: ["egg yolks"] },
  { name: "Whole milk", carbsPer100g: 4.8, aliases: ["milk"] },
  { name: "Buttermilk", carbsPer100g: 4.8, aliases: [] },
  { name: "Heavy cream", carbsPer100g: 2.8, aliases: ["heavy whipping cream", "whipping cream", "double cream"] },
  { name: "Sour cream", carbsPer100g: 4.6, aliases: [] },
  { name: "Cream cheese", carbsPer100g: 4.1, aliases: [] },
  { name: "Plain yogurt (whole milk)", carbsPer100g: 4.7, aliases: ["yogurt", "plain yogurt", "yoghurt", "plain yoghurt"] },
  { name: "Sweetened condensed milk", carbsPer100g: 54.4, aliases: ["condensed milk"] },
  { name: "Evaporated milk", carbsPer100g: 10.0, aliases: [] },

  // Chocolate and cocoa
  { name: "Unsweetened cocoa powder", carbsPer100g: 57.9, aliases: ["cocoa powder", "cocoa", "unsweetened cocoa"] },
  { name: "Semisweet chocolate chips", carbsPer100g: 63.9, aliases: ["chocolate chips", "semi-sweet chocolate chips", "semisweet chocolate", "semi-sweet chocolate"] },
  { name: "Milk chocolate", carbsPer100g: 59.4, aliases: ["milk chocolate chips"] },
  { name: "Dark chocolate (70-85% cocoa)", carbsPer100g: 45.9, aliases: ["dark chocolate"] },
  { name: "White chocolate", carbsPer100g: 59.2, aliases: ["white chocolate chips"] },

  // Leaveners, salt and flavourings
  { name: "Baking soda", carbsPer100g: 0, aliases: ["bicarbonate of soda", "bicarb soda"] },
  { name: "Baking powder", carbsPer100g: 27.7, aliases: [] },
  { name: "Active dry yeast", carbsPer100g: 41.2, aliases: ["yeast", "dry yeast", "instant yeast"] },
  { name: "Salt", carbsPer100g: 0, aliases: ["table salt", "kosher salt", "sea salt"] },
  { name: "Vanilla extract", carbsPer100g: 12.7, aliases: ["vanilla"] },
  { name: "Ground cinnamon", carbsPer100g: 80.6, aliases: ["cinnamon"] },
  { name: "Water", carbsPer100g: 0, aliases: ["warm water", "cold water"] },

  // Fruit, nuts and add-ins
  { name: "Banana", carbsPer100g: 22.8, aliases: ["bananas", "mashed banana", "mashed bananas", "ripe bananas"] },
  { name: "Raisins", carbsPer100g: 79.2, aliases: [] },
  { name: "Dried cranberries (sweetened)", carbsPer100g: 82.4, aliases: ["dried cranberries", "craisins"] },
  { name: "Blueberries", carbsPer100g: 14.5, aliases: ["fresh blueberries"] },
  { name: "Pumpkin puree (canned)", carbsPer100g: 8.1, aliases: ["pumpkin puree", "canned pumpkin", "pumpkin"] },
  { name: "Unsweetened applesauce", carbsPer100g: 11.3, aliases: ["applesauce", "apple sauce"] },
  { name: "Walnuts", carbsPer100g: 13.7, aliases: ["walnut"] },
  { name: "Pecans", carbsPer100g: 13.9, aliases: ["pecan"] },
  { name: "Almonds", carbsPer100g: 21.6, aliases: ["sliced almonds", "slivered almonds"] },
  { name: "Smooth peanut butter", carbsPer100g: 20.0, aliases: ["peanut butter", "creamy peanut butter"] },
  { name: "Sweetened shredded coconut", carbsPer100g: 47.7, aliases: ["shredded coconut", "coconut", "desiccated coconut"] },
];

/*
  Words that describe how an ingredient is prepared but don't change its carbs.
  They are removed before looking a name up, so "chopped walnuts" matches
  "Walnuts". Words that DO change carbs (like "sweetened") are not removed.
*/
const PREP_WORDS = [
  "sifted", "melted", "softened", "cold", "chilled", "cubed", "diced",
  "at room temperature", "room temperature", "packed", "lightly", "firmly",
  "chopped", "finely", "roughly", "coarsely", "toasted", "large", "medium",
  "small", "beaten", "lightly beaten", "fresh", "about", "approximately", "of",
];

/* ------------------------------------------------------------------------
   Lookup table: every name and alias, in lower case, pointing to its entry.
   Built once when the page loads.
   ------------------------------------------------------------------------ */
const LOOKUP = new Map();
for (const item of INGREDIENTS) {
  for (const word of [item.name, ...item.aliases]) {
    LOOKUP.set(word.toLowerCase(), item);
  }
}

/*
  Tidies an ingredient name so it can be looked up:
  "Unsalted Butter, melted (1 stick)" becomes "unsalted butter".
*/
function cleanName(text) {
  let name = text.toLowerCase();
  name = name.replace(/\([^)]*\)/g, " ");   // drop anything in brackets
  name = name.split(",")[0];                // drop anything after a comma
  for (const word of PREP_WORDS) {
    // Remove each preparation word when it appears as a whole word.
    name = name.replace(new RegExp("\\b" + word + "\\b", "g"), " ");
  }
  name = name.replace(/[^a-z0-9%'\- ]/g, " "); // drop stray punctuation
  // Drop loose numbers such as the "2" in "2 eggs (100 g)".
  return name
    .split(/\s+/)
    .filter((word) => word !== "" && !/^\d+(\.\d+)?$/.test(word))
    .join(" ");
}

/*
  Finds the ingredient for a cleaned-up name. Tries the name as written,
  then without a final "s" (so "pecans" and "pecan" both work).
  Returns null if there is no exact match. It never guesses.
*/
function findIngredient(name) {
  if (LOOKUP.has(name)) return LOOKUP.get(name);
  if (name.endsWith("s") && LOOKUP.has(name.slice(0, -1))) {
    return LOOKUP.get(name.slice(0, -1));
  }
  return null;
}

/*
  Reads one ingredient line, such as "250 g flour" or "flour 250g".
  Returns either:
    { ok: true,  line, grams, ingredient, carbs }   when it could be counted
    { ok: false, line, reason }                       when it could not
*/
function parseLine(line) {
  // Look for a number followed by "g", "gram" or "grams" (not "kg").
  const match = line.match(/(\d+(?:\.\d+)?)\s*(?:g|gr|gram|grams)\b/i);

  if (!match) {
    return {
      ok: false,
      line,
      reason: "No amount in grams found. This version only understands grams, for example \"250 g flour\".",
    };
  }

  const grams = parseFloat(match[1]);
  if (!(grams > 0)) {
    return { ok: false, line, reason: "The amount must be more than 0 grams." };
  }

  // The ingredient name is the rest of the line once the amount is removed.
  const rawName = line.replace(match[0], " ");
  const name = cleanName(rawName);

  if (!name) {
    return { ok: false, line, reason: "No ingredient name found next to the amount." };
  }

  const ingredient = findIngredient(name);
  if (!ingredient) {
    return {
      ok: false,
      line,
      reason: "\"" + name + "\" is not in the built-in ingredient list yet, so its carbs are not counted.",
    };
  }

  // The core sum: carbs = grams x carbs per 100 g / 100.
  const carbs = (grams * ingredient.carbsPer100g) / 100;
  return { ok: true, line, grams, ingredient, carbs };
}

/*
  Works out the whole recipe from the text box and the servings number.
  Returns the counted rows, the flagged lines, and the totals.
*/
function calculateRecipe(text, servings) {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== ""); // ignore blank lines

  const results = lines.map(parseLine);
  const counted = results.filter((r) => r.ok);
  const flagged = results.filter((r) => !r.ok);

  const totalGrams = counted.reduce((sum, r) => sum + r.grams, 0);
  const totalCarbs = counted.reduce((sum, r) => sum + r.carbs, 0);
  // Per serving uses the unrounded total, so rounding happens only once.
  const carbsPerServing = totalCarbs / servings;

  return { counted, flagged, totalGrams, totalCarbs, carbsPerServing };
}

/* ------------------------------------------------------------------------
   Number formatting. Totals are shown to the nearest whole gram, like a
   nutrition label. The per-ingredient rows show one decimal place.
   ------------------------------------------------------------------------ */
function wholeGrams(n) {
  return Math.round(n).toLocaleString("en-US") + " g";
}
function oneDecimal(n) {
  return n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

/* ------------------------------------------------------------------------
   Page behaviour: runs only in a web browser (not in the test script).
   ------------------------------------------------------------------------ */
if (typeof document !== "undefined") {
  const form = document.getElementById("recipe-form");
  const ingredientsBox = document.getElementById("ingredients");
  const servingsBox = document.getElementById("servings");
  const formError = document.getElementById("form-error");
  const resultsSection = document.getElementById("results");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); // stay on the page instead of reloading it

    // Check the inputs first and explain any problem.
    const servings = Number(servingsBox.value);
    if (ingredientsBox.value.trim() === "") {
      showError("Add at least one ingredient, one per line.");
      return;
    }
    if (!Number.isFinite(servings) || servings < 1) {
      showError("Servings must be a number of 1 or more.");
      return;
    }
    formError.hidden = true;

    showResults(calculateRecipe(ingredientsBox.value, servings), servings);
  });

  function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
    resultsSection.hidden = true;
  }

  function showResults(result, servings) {
    // Totals
    document.getElementById("total-carbs").textContent = wholeGrams(result.totalCarbs);
    document.getElementById("per-serving").textContent = wholeGrams(result.carbsPerServing);
    document.getElementById("servings-note").textContent =
      "Based on " + servings + (servings === 1 ? " serving" : " servings");

    // Warning if some lines were left out of the total.
    const incomplete = document.getElementById("incomplete");
    const n = result.flagged.length;
    if (n > 0) {
      incomplete.textContent =
        "Incomplete estimate: " + n + (n === 1 ? " line was" : " lines were") +
        " not counted, so the real carbs are probably higher. See \"Lines not counted\" below.";
      incomplete.hidden = false;
    } else {
      incomplete.hidden = true;
    }

    // Table rows: one per counted ingredient.
    // textContent is used (not innerHTML) so typed text is always shown as plain text.
    const body = document.getElementById("results-body");
    body.replaceChildren();
    for (const row of result.counted) {
      const tr = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = row.line;
      const matched = document.createElement("span");
      matched.className = "matched";
      matched.textContent =
        "Matched: " + row.ingredient.name + " (" + oneDecimal(row.ingredient.carbsPer100g) +
        " g carbs per 100 g, built-in list)";
      nameCell.appendChild(matched);

      const gramsCell = document.createElement("td");
      gramsCell.className = "num";
      gramsCell.textContent = oneDecimal(row.grams);

      const carbsCell = document.createElement("td");
      carbsCell.className = "num";
      carbsCell.textContent = oneDecimal(row.carbs);

      tr.append(nameCell, gramsCell, carbsCell);
      body.appendChild(tr);
    }
    if (result.counted.length === 0) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 3;
      td.textContent = "No lines could be counted.";
      tr.appendChild(td);
      body.appendChild(tr);
    }
    document.getElementById("total-grams").textContent = oneDecimal(result.totalGrams);
    document.getElementById("total-carbs-table").textContent = oneDecimal(result.totalCarbs);

    // List of lines that could not be counted, with the reason for each.
    const flaggedBox = document.getElementById("flagged");
    const list = document.getElementById("flag-list");
    list.replaceChildren();
    for (const item of result.flagged) {
      const li = document.createElement("li");
      const lineText = document.createElement("span");
      lineText.className = "flag-line";
      lineText.textContent = item.line;
      const reason = document.createElement("span");
      reason.className = "flag-reason";
      reason.textContent = item.reason;
      li.append(lineText, reason);
      list.appendChild(li);
    }
    flaggedBox.hidden = n === 0;

    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/* Lets the automated check script use these functions outside the browser. */
if (typeof module !== "undefined") {
  module.exports = { INGREDIENTS, parseLine, calculateRecipe, cleanName };
}
