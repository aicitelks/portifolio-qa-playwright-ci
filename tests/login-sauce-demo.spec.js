const { test, expect } = require("@playwright/test");

test.describe("Validação de Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Deve realizar login com sucesso", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    const productsHeader = page.getByText("Products");

    await expect(page).toHaveURL(/inventory/);
    await expect(productsHeader).toBeVisible();
  });

  test("Deve exibir erro com senha inválida", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("senhaerrada");
    await page.getByRole("button", { name: "Login" }).click();

    const errorMessage = page.locator('[data-test="error"]');

    await expect(errorMessage).toContainText("do not match any user");
  });

  test("Deve realizar logout com sucesso", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();
    await page.getByRole("button", { name: "Open Menu" }).click();

    const logoutLink = page.getByTestId("logout-sidebar-link");

    await expect(logoutLink).toBeVisible();

    await logoutLink.click();

    await expect(page).toHaveURL("/");
  });
});
