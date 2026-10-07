const { test, expect } = require("@playwright/test");

test.describe("Validação de Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
  });

  test("Deve realizar login com sucesso", async ({ page }) => {
    const productsHeader = page.getByText("Products");
    await expect(page).toHaveURL(/inventory/);
    await expect(productsHeader).toBeVisible();
  });

  test("Deve realizar logout com sucesso", async ({ page }) => {
    const menuButton = page.getByRole("button", { name: "Open Menu" });
    await menuButton.click();
    const logoutLink = page.getByTestId("logout-sidebar-link");
    await expect(logoutLink).toBeVisible();
    await logoutLink.click();
    await expect(page).toHaveURL("/");
  });
});

test.describe("Validação de Autenticação - Testes Negativos", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Deve exibir erro com senha inválida", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("incorrect_password");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toContainText("do not match any user");
  });

  test("Deve exibir erro com usuário inválido", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("invalid_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toContainText("do not match any user");
  });

  test("Deve exibir erro de usuário bloqueado", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("locked_out_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toContainText(
      "Sorry, this user has been locked out.",
      "Usuário bloqueado",
    );
  });

  test("Deve exibir erro com campo usuário vazio", async ({ page }) => {
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toContainText("Username is required");
  });

  test("Deve exibir erro com campo senha vazio", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toContainText("Password is required");
  });
});
