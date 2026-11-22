# Carb Counter: Version 1 Plan

## 1. Product brief

**What it is.** A free web app that works out the carbohydrates in a home-baked recipe. You enter the ingredients, by typing or by uploading a photo of the recipe. The app shows the **total carbs** and **net carbs** (total carbs minus fiber) for the whole recipe and for one serving.

**Who it's for.** Home bakers with diabetes who need a carb count to decide their insulin dose. Most use it on a phone in the kitchen.

**Why it's needed.** Packaged food has a nutrition label and home baking doesn't. Working out carbs by hand means looking up every ingredient, converting cups and spoons into grams, adding everything up and dividing by the servings. That's slow and easy to get wrong.

**Success for version 1:**
- A typical recipe of 8–12 ingredients can be entered and give a per-serving carb count in under 3 minutes.
- Every carb number shows where it came from, so the user can judge how far to trust it.
- It costs nothing to run and nothing to use.
- Recipes stay saved on the user's device between visits.

**Safety stance.** People will use this to dose insulin, so the app treats accuracy as a safety issue:
- On first use, a warning has to be acknowledged before the app opens.
- Every result carries a visible reminder that it's an estimate.
- Every number is labelled with its source.
- The app never suggests an insulin dose.

## 2. User flow

1. **First visit.** A full-screen notice says: "Carb Counter gives estimates only. Ingredient brands vary. Check values against package labels and follow your care team's advice." The user taps **I understand** to continue, and the notice comes back after any app update that changes how carbs are calculated.
2. **Start a recipe.** The user taps **New recipe** and gives it a name, for example "Banana bread".
3. **Add ingredients**, in either of two ways:
   - **Type them in.** For each ingredient, enter the name, the amount (fractions like `1 1/2` or `½` are fine) and a unit chosen from a drop-down list: g, kg, oz, lb, ml, L, tsp, tbsp, cup (US), fl oz, pinch, each.
   - **Upload a photo** of a printed recipe or a screenshot. The app reads the text on the user's own device, splits each line into amount, unit and name, and fills in the list for checking.
4. **Check the matches.** Each ingredient row shows what the app matched it to and where the carb value came from:
   - **Built-in list**: common baking ingredients, checked values.
   - **USDA database**: looked up online when an ingredient isn't on the built-in list.
   - **Package label**: when neither source has the ingredient, the row is flagged. The user enters the label's serving size, carbs and fiber.
   - Rows the app is unsure about, such as an unclear photo line or a cup measure of an ingredient with no known weight, are highlighted until the user confirms or fixes them.
5. **Set the servings**, in either or both of two ways:
   - **By count**: "Makes 12 muffins" gives carbs per muffin.
   - **By weight**: weigh the whole finished bake, then weigh a slice to get the carbs in that slice. This is more accurate for loaves and cakes cut unevenly.
6. **See the results.**
   - Total carbs and net carbs for the whole recipe, per serving and per weighed slice.
   - A per-ingredient breakdown, so the user can see which ingredients carry the most carbs.
   - The estimate warning, shown every time.
7. **Save.** The recipe is saved on the device and appears in **My recipes**. From there the user can reopen, edit, duplicate (for example, to try a lower-sugar version) or delete it.
8. **Next bake.** The user opens a saved recipe, weighs the new loaf and slice, and gets an updated slice count with no re-entry.

## 3. Scope

### In version 1
- Typed ingredient entry with the 12 units listed above. "Cup" means the US cup (about 240 ml).
- Photo upload of printed or typed recipes, with a review step before anything is calculated.
- Built-in list of about 80 common baking ingredients: flours, sugars, syrups, dairy, eggs, fats, chocolate, nuts, fruit, leaveners and flavourings.
- USDA database lookup for anything not on the built-in list.
- Package-label entry when neither source has the ingredient.
- Total carbs and net carbs (total minus fiber).
- Servings by count and by finished weight.
- Recipes saved on the device, plus **Export backup** and **Import backup** buttons, so recipes aren't lost if browser data is cleared or the user changes phones.
- The safety warnings described above.
- BBQnstuff.com look: blue-gray and white palette, Fjalla One headings, Source Sans body text.
- Works on phones, tablets and computers.
- Hosted free on GitHub Pages at `https://gwissler.github.io/carb-counter/`.

### Not in version 1 (possible later)
- **Insulin dose suggestions.** Deliberately left out: that is a medical decision.
- **Handwritten recipes.** The free photo reader handles them poorly. Users can still type them in.
- **Accounts or syncing between devices.** These need a paid server. The backup file covers moving between devices.
- **Paid AI photo reading.** It's more accurate but costs money for every photo.
- **Other nutrients:** calories, protein, fat, sugar.
- **Subtracting sugar alcohols** such as erythritol from net carbs. Version 1 subtracts fiber only.
- **Metric (250 ml) or UK cups.** US cup only.
- **Importing a recipe from a website link.**
- **Scaling a recipe up or down**, for example doubling a batch.
- **Sharing recipes with other people.**
- **Installing as a phone app or working fully offline.** The USDA lookup and photo reader need internet access anyway.
- **Languages other than English.**

## 4. Technical choices, in plain English

| Choice | What it means | Why |
|---|---|---|
| **GitHub Pages for hosting** | GitHub stores the app's files and serves them to anyone who visits the web address. | Free, reliable, and already tied to your repo. The catch is that it only hands out files and can't run a server, so everything else below happens inside the user's browser. |
| **Plain HTML, CSS and JavaScript, no frameworks** | The app is a handful of ordinary web files. HTML is the page structure, CSS is the look, and JavaScript is the behaviour. | Nothing to install or "build" before publishing, so there are fewer things to break and any developer can pick it up later. |
| **Free in-browser photo reading (Tesseract.js)** | A free, open-source text reader that runs inside the browser. | No cost per photo, and the photo never leaves the user's device, which is good for privacy. The first photo takes a few extra seconds while the reader downloads (about 10 MB, once). It reads print well and handwriting badly, which is why there's a review step. |
| **Ingredient line splitting** | Rules that turn "2 ¼ cups all-purpose flour, sifted" into amount 2.25, unit cup, name "all-purpose flour". | Turns photo text and pasted text into rows the app can calculate. Anything it can't split cleanly is flagged for the user. |
| **Built-in ingredient list** | A file in the repo listing, for each ingredient, carbs and fiber per 100 g plus how much a cup, tablespoon, teaspoon or "each" weighs. Values come from USDA data. | Instant, free, works without the USDA service, and the values can be checked by a person. Weights are needed because carbs are measured per gram, and a cup of flour (about 125 g) weighs far less than a cup of sugar (about 200 g). |
| **USDA FoodData Central lookup** | The US government's free food database, searched over the internet when an ingredient isn't on the built-in list. | Covers thousands of foods at no cost. It uses the USDA's public demo key, about 30 lookups an hour per user, and a settings box lets anyone paste their own free key for more. The key is visible to anyone who opens the app; that's acceptable because it's free and only lets someone read public data. |
| **Package-label fallback** | The user types serving size, carbs and fiber from the packet. | Covers brand-name and specialty products that neither source knows, such as a particular sugar-free chocolate chip. |
| **Saving on the device (browser storage)** | Recipes are kept in the browser's own storage on that phone or computer. | Free and private, and nothing is sent anywhere. The downside is that clearing browser data erases recipes and they don't appear on other devices, which is why version 1 includes backup export and import. |
| **Rounding** | Calculations keep full precision. Results show whole grams, the way nutrition labels do, and the per-ingredient breakdown shows one decimal place. | Matches what people with diabetes are used to reading, while the detail stays available. |
| **Automated checks** | Small test scripts check the maths and the line splitting against recipes worked out by hand. | Catches calculation mistakes before they reach someone dosing insulin. |

## 5. Build plan

Each stage is small, ends with something you can open and try at the GitHub Pages address, and is saved to the repo before the next one starts.

| Stage | What gets built | What you can check when it's done |
|---|---|---|
| **0. Set-up** | Turn on GitHub Pages and publish a placeholder page in the BBQnstuff style. | The web address loads on your phone. |
| **1. Typed entry and totals** | Ingredient rows (name, amount, unit drop-down), the built-in list for about 20 core ingredients, and a running total of carbs and net carbs. | Enter a simple recipe and compare the total with a hand calculation. |
| **2. Servings** | Servings by count and by finished weight and slice weight. | "Makes 12" and "loaf weighs 900 g, slice weighs 75 g" both give sensible numbers. |
| **3. Safety layer** | First-use notice, a warning on every result, source labels, and highlighting of rows that need a decision. | Nothing can be calculated silently from a guessed value. |
| **4. Full ingredient list and checks** | Expand the built-in list to about 80 ingredients and add automated checks of the maths using worked examples. | A list of ingredients and values you can spot-check against package labels. |
| **5. Saving** | My recipes (save, open, edit, duplicate, delete) plus backup export and import. | Close the browser, come back, and your recipes are still there. |
| **6. USDA lookup and label entry** | Search USDA when an ingredient isn't built in; fall back to package-label entry; settings box for an optional personal key. | Enter an unusual ingredient, such as "teff flour", and see it found, labelled "USDA". |
| **7. Photo upload** | Read a recipe photo, split the lines, and show the review screen before calculating. | Photograph a printed recipe card and correct anything misread. |
| **8. Polish and launch** | Phone layout check, accessibility basics (readable text sizes, keyboard use), a final accuracy pass on three real recipes, and a short user guide in the README. | Version 1 is ready to share. |

## 6. Assumptions to confirm
- The USDA public demo key is fine to start with (section 4).
- The safety design (first-use notice, warning on every result, source labels) matches what you want.
- The app is called **Carb Counter**, in the BBQnstuff.com visual style.

## 7. Known risks
- **Carb values vary by brand and by how ingredients are measured.** A scooped cup of flour can weigh 20% more than a spooned one. Weighing in grams is the most accurate, and the app will encourage it.
- **The photo reader makes mistakes**, especially with fractions like ½ and with poor lighting. The review step is there to catch them.
- **The USDA service could be slow, down or rate-limited.** The built-in list and label entry still work without it.
- **Recipes saved only in the browser can be lost.** Backup export reduces this risk.
