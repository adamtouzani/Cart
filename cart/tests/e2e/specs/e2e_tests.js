module.exports = {
    "Check number of cards on load": browser => {
        browser
            .url(process.env.VUE_DEV_SERVER_URL)
            .waitForElementVisible("#app", 5000)
            .assert.elementCount(".v-card", 6)
            .end();
    },
    "Check cart is empty on initial load": browser => {
        browser
            .url(process.env.VUE_DEV_SERVER_URL)
            .waitForElementVisible("#app", 5000)
            .click("nav button")
            .waitForElementVisible("aside", 1000)
            .assert.containsText(
                "aside",
                "Your cart is empty. Add stuff to your cart."
            )
            .end();
    },
    "Check that item is added properly to the cart": browser => {
        browser
            .url(process.env.VUE_DEV_SERVER_URL)
            .waitForElementVisible("#app", 5000)
            .click("#item_3 button")
            .assert.containsText(".v-badge__badge", "1")
            .click("nav button")
            .waitForElementVisible("aside", 1000)
            .assert.elementPresent("#cartItemTitle_3")
            .assert.containsText("#cartItemTitle_3", "Screen")
            .assert.containsText("#cartTotal", "Total: €179.99")
            .assert.containsText("#cartTaxTotal", "Total Tax: €34.20")
            .end();
    },
    "Check that added item's quantity is adjustable (and that item can be removed)": browser => {
        browser
            .url(process.env.VUE_DEV_SERVER_URL)
            .waitForElementVisible("#app", 5000)
            .click("#item_3 button")
            .click("#item_5 button")
            .assert.containsText(".v-badge__badge", "2")
            .click("nav button")
            .assert.elementCount("#cartItemsList .v-list__tile", 2)
            .waitForElementVisible("aside", 1000)
            .assert.elementPresent("#cartItemTitle_5")
            .assert.containsText("#cartItemTitle_5", "Speaker")
            .assert.elementPresent("#cartItem_3 ")
            .assert.containsText("#cartTaxTotal", "62.70")
            .assert.elementCount("#cartItem_5 button", 2) //Two buttons, one for decrement and one for increment
            .click("#cartItem_3_increment_button")
            .assert.containsText("#cartItem_3_quantity", "2")
            .click("#cartItem_5_decrement_button")
            .assert.elementNotPresent("#cartItem_5")
            .assert.containsText("#cartTotal", "359.98")
            .end();
    }
};
