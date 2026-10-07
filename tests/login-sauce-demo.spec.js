const { test, expect } = require("@playwright/test");

test.describe("Validação de Autenticação", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Deve realizar login com sucesso", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("secret_sauce");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page).toHaveURL(/inventory/);
    await expect(page.getByText("Products")).toBeVisible();
  });

  test("Deve exibir erro com senha inválida", async ({ page }) => {
    await page.getByPlaceholder("Username").fill("standard_user");
    await page.getByPlaceholder("Password").fill("senhaerrada");
    await page.getByRole("button", { name: "Login" }).click();

    await expect(page.locator('[data-test="error"]')).toContainText(
      "do not match any user",
    );
  });
});
