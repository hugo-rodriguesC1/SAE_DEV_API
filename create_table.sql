CREATE TABLE User (
    user_id INTEGER PRIMARY KEY,
    name TEXT,
    password TEXT
);

CREATE TABLE Montre (
    montre_id INTEGER PRIMARY KEY,
    boitier BOOL,
    fond_id INTEGER,
    bracelet_id INTEGER,
    FOREIGN KEY (fond_id) REFERENCES Fond(fond_id),
    FOREIGN KEY (bracelet_id) REFERENCES Bracelet(bracelet_id)
);

CREATE TABLE Bracelet (
    bracelet_id INTEGER PRIMARY KEY,
    url TEXT,
    prix INTEGER
);

CREATE TABLE Fond (
    fond_id INTEGER PRIMARY KEY,
    url TEXT,
    prix INTEGER
);

CREATE TABLE Sauvegarde (
    user_id INTEGER,
    montre_id INTEGER,
    PRIMARY KEY(user_id, montre_id)
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (montre_id) REFERENCES Montre(montre_id)
);

CREATE TABLE Panier (
    user_id INTEGER,
    montre_id INTEGER,
    PRIMARY KEY(user_id, montre_id)
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (montre_id) REFERENCES Montre(montre_id)
);








-- Table "Cuisines" (Cuisines)
CREATE TABLE Cuisines (
    cuisine_id INTEGER PRIMARY KEY,
    name TEXT
);

-- Table "Goals" (Objectifs)
CREATE TABLE Goals (
    goal_id INTEGER PRIMARY KEY,
    name TEXT
);

-- Table "DietaryInformation" (Informations Diététiques)
CREATE TABLE DietaryInformation (
    diet_id INTEGER PRIMARY KEY,
    name TEXT
);

-- Table "AllergiesInformation" (Informations sur les Allergies)
CREATE TABLE AllergiesInformation (
    allergy_id INTEGER PRIMARY KEY,
    name TEXT
);

-- Table "Ingredients" (Ingrédients)
CREATE TABLE Ingredients (
    ingredient_id INTEGER PRIMARY KEY,
    name TEXT,
    unit TEXT
);

-- Table "Recipes" (Recettes)
CREATE TABLE Recipes (
    recipe_id INTEGER PRIMARY KEY,
    recipe_name TEXT,
    recipe_description TEXT,
    image_url TEXT,
    cuisine_id INTEGER,
    goal_id INTEGER,
    FOREIGN KEY (cuisine_id) REFERENCES Cuisines(cuisine_id),
    FOREIGN KEY (goal_id) REFERENCES Goals(goal_id)
);

-- Table "RecipeAllergiesInfo"
CREATE TABLE RecipeAllergiesInfo (
    recipe_id INTEGER,
    allergy_id INTEGER,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
    FOREIGN KEY (allergy_id) REFERENCES AllergiesInformation(allergy_id)
);

-- Table "RecipeDietaryInfo"
CREATE TABLE RecipeDietaryInfo (
    recipe_id INTEGER,
    diet_id INTEGER,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
    FOREIGN KEY (diet_id) REFERENCES DietaryInformation(diet_id)
);

-- Table "RecipeIngredients" (Table de liaison pour les ingrédients de la recette)
CREATE TABLE RecipeIngredients (
    recipe_id INTEGER,
    ingredient_id INTEGER,
    quantity REAL,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
    FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
);

-- Table "RecipeInstructions" (Instructions de la Recette)
CREATE TABLE InstructionStep (
    instruction_id INTEGER PRIMARY KEY,
    recipe_id INTEGER,
    step_number INTEGER,
    StepInstruction TEXT,
    FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id)
);
