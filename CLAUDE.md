# Carb Counter: rules for Claude

Carb Counter is a free web app that works out the total carbs and net carbs in a
baking recipe, for the whole recipe and per serving. Its users are people with
diabetes, who use the results to manage their insulin. The product plan is in
`PLAN.md`.

## Standing rules

1. **The owner is not a developer.** When you finish any piece of work, explain
   every change in plain English:
   - what changed, why, and how to check it;
   - define or avoid technical terms;
   - give step-by-step instructions for anything the owner has to do themselves.
2. **Keep it a static site.** Use only HTML, CSS and JavaScript files that GitHub
   Pages can serve as they are. That means:
   - no server, database or backend code;
   - no build step;
   - nothing that costs money to run.

   Small libraries loaded in the browser, such as the free photo text reader, are
   fine. So are free public services the browser calls directly, such as the USDA
   food database.
3. **Keep files simple and well commented.**
   - Prefer plain, readable code over clever code.
   - Give each file a short comment at the top saying what it does.
   - Comment any calculation or conversion so a non-developer could follow the logic.
4. **Carb results are estimates, and the page says so.**
   - Every place that shows a carb result must also show a visible note that it
     is an estimate.
   - Label every carb value with its source: built-in list, USDA, or package label.
   - Never suggest an insulin dose.
5. **Never change `main` directly.**
   - Do all work on a new branch named `claude/<short-description>`.
   - Push the branch and open a pull request for the owner to review.
   - Never merge the pull request yourself.
   - In the pull request description, include the same plain-English summary of
     the changes.

## Project facts

- **Hosting:** GitHub Pages, published from `main`, at
  `https://gwissler.github.io/carb-counter/`.
- **Cups** are US cups (about 240 ml).
- **Units offered:** g, kg, oz, lb, ml, L, tsp, tbsp, cup, fl oz, pinch, each.
- **Carb sources, in order:**
  1. the built-in ingredient list;
  2. the USDA FoodData Central database;
  3. values the user types from the package label.
- **Net carbs** = total carbs minus fiber.
- **Saving:** recipes are saved only in the user's browser on their device.
- **Look:** BBQnstuff.com style:
  - blue-gray and white colors;
  - Fjalla One for headings and Source Sans for body text;
  - red and amber used only for warnings.
- **Testing:** check any change to the carb maths against a recipe worked out by
  hand before opening the pull request.
