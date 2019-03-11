<template>
    <span>
        <!--Cart Sidebar-->
        <v-navigation-drawer
            app
            v-model="drawer"
            class="white"
            right
            width="320"
        >
            <v-layout column fill-height>
                <!--If items are present in the cart, display list of items-->
                <v-list
                    v-if="this.$store.getters.cartItems.length > 0"
                    two-line
                    id="cartItemsList"
                >
                    <template v-for="item in this.$store.getters['cartItems']">
                        <v-list-tile :key="item.id" :id="`cartItem_${item.id}`">
                            <v-list-tile-content>
                                <v-list-tile-title
                                    style="font-weight: bolder; font-size: larger"
                                    :id="`cartItemTitle_${item.id}`"
                                >
                                    {{ getCartItemProperty(item.id, "name") }}
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    Price:
                                    <span class="text--primary"
                                        >&euro;{{
                                            (
                                                parseFloat(
                                                    getCartItemProperty(
                                                        item.id,
                                                        "cost"
                                                    )
                                                ) *
                                                parseInt(
                                                    getItemQuantity(item.id)
                                                )
                                            ).toFixed(2)
                                        }}</span
                                    >
                                </v-list-tile-sub-title>
                            </v-list-tile-content>

                            <v-list-tile-action
                                style="justify-content: center; align-items: center"
                            >
                                <small>Quantity</small>
                                <div class="qty_buttons">
                                    <v-btn
                                        icon
                                        small
                                        @click="decrementItemQuantity(item.id)"
                                        :id="
                                            `cartItem_${
                                                item.id
                                            }_decrement_button`
                                        "
                                    >
                                        <v-icon
                                            v-if="
                                                parseInt(
                                                    getItemQuantity(item.id)
                                                ) === 1
                                            "
                                            :color="'red'"
                                            >mdi-delete</v-icon
                                        >
                                        <v-icon v-else :color="'blue'"
                                            >mdi-minus</v-icon
                                        >
                                    </v-btn>
                                    <span
                                        class="px-3"
                                        :id="`cartItem_${item.id}_quantity`"
                                        >{{ getItemQuantity(item.id) }}</span
                                    >
                                    <v-btn
                                        icon
                                        small
                                        @click="incrementItemQuantity(item.id)"
                                        :id="
                                            `cartItem_${
                                                item.id
                                            }_increment_button`
                                        "
                                    >
                                        <v-icon :color="'blue'"
                                            >mdi-plus</v-icon
                                        >
                                    </v-btn>
                                </div>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :key="`divider-${item.id}`"></v-divider>
                    </template>
                </v-list>
                <!--Else display generic message-->
                <v-list v-else>
                    <v-list-tile>
                        <v-list-tile-sub-title>
                            Your cart is empty. Add stuff to your cart.
                        </v-list-tile-sub-title>
                    </v-list-tile>
                </v-list>
                <v-spacer></v-spacer>
                <v-list
                    two-line
                    v-if="this.$store.getters.cartItems.length > 0"
                >
                    <v-list-tile>
                        <v-list-tile-content>
                            <v-list-tile-title
                                style="font-weight: bold"
                                id="cartTotal"
                            >
                                Total: &euro;{{ getCartTotalAndTax()[0] }}
                            </v-list-tile-title>
                            <v-list-tile-sub-title id="cartTaxTotal"
                                >Total Tax: &euro;{{
                                    getCartTotalAndTax()[1]
                                }}</v-list-tile-sub-title
                            >
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn :color="'green'" @click="checkout()"
                                >Checkout</v-btn
                            >
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
            </v-layout>
        </v-navigation-drawer>
        <!--App navigation bar-->
        <v-toolbar app color="black" dark prominent>
            <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--Displays a badge on the "View Cart" button only when the quantity of items in the cart is > 1-->
            <v-badge color="success" overlap :value="totalItems() > 0">
                <template v-slot:badge>
                    <span>{{ totalItems() }}</span>
                </template>
                <v-btn @click="drawer = !drawer" class="ma-0">
                    <v-icon left>mdi-cart</v-icon>
                    {{ viewCartButtonText }}
                </v-btn>
            </v-badge>
        </v-toolbar>
    </span>
</template>

<script>
export default {
    name: "Navigation",
    data: function() {
        return {
            appTitle: "Dummy Cart",
            drawer: false,
            viewCartButtonText: this.drawer ? "Hide Cart" : "View Cart"
        };
    },
    watch: {
        /**
         * Updates the value of the "View Cart" button based on whether the
         * navigation drawer (the "Cart") is visible or not
         */
        drawer(newVal) {
            this.viewCartButtonText = newVal ? "Hide Cart" : "View Cart";
        }
    },
    methods: {
        /**
         * Gets the property of an item in the cart
         * @param {number} id, the id of the item in the cart
         * @param {string} property, the property we want returned
         * @returns {string|number} the value of the property
         */
        getCartItemProperty(id, property) {
            return this.$store.getters["cartItemProperty"](id, property);
        },
        /**
         * Gets the quantity of an item in the cart
         * @param {number} id, the id of the item in the cart
         * @returns {number} the quantity of that item
         */
        getItemQuantity(id) {
            return this.$store.getters["itemQuantity"](id);
        },
        /**
         * Gets the cart's total price/cost and total tax amount
         * @returns {Array} the cart's total cost and total tax amount, formatted as a string.
         * Array[0] = Cart Total, Array[1] = Cart Tax Total
         */
        getCartTotalAndTax() {
            return this.$store.getters["totalCostAndTax"];
        },
        /**
         * Increments a cart item's quantity by 1 (one)
         * @param {number} id, the id of the item to be incremented
         */
        incrementItemQuantity(id) {
            this.$store.dispatch("incrementItemQuantity", id);
        },
        /**
         * Decrements a cart item's quantity by 1 (one)
         * @param {number} id, the id of the item to be decremented
         */
        decrementItemQuantity(id) {
            this.$store.dispatch("decrementItemQuantity", id);
        },
        /**
         * Displays JS alert with message
         */
        checkout() {
            alert("Coming soon!");
        },
        /**
         * Returns the total amount of items currently in the cart
         * @returns {number} The total amount of items in the cart
         */
        totalItems() {
            return this.$store.getters["totalItems"];
        }
    }
};
</script>

<style scoped>
/** Custom style for the qty buttons */
.qty_buttons {
    width: 70px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    flex-wrap: nowrap;
}
</style>
