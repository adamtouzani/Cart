import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        /**
         * cartItems: store of the items currently in the cart, identified by id.
         * Format: [{id:itemID, qty:itemQty}, {...}] (JS objects in JS array).
         */
        cartItems: [],
        /**
         * items: the items currently being sold by the store, identified by id.
         * Format: [{id:itemID, name:itemName, cost:itemCost, tax: itemTaxPercent, imgSrc: itemImgSrc}, {...}]
         * (JS objects in JS array).
         */
        items: [
            {
                id: 1,
                name: "Keyboard",
                cost: 69.99,
                tax: 19,
                imgSrc:
                    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/image/AppleInc/aos/published/images/M/RM/MRMH2/MRMH2?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5%2C0.5&.v=1520629359080"
            },
            {
                id: 2,
                name: "Mouse",
                cost: 49.99,
                tax: 19,
                imgSrc:
                    "https://store.storeimages.cdn-apple.com/8756/as-images.apple.com/is/image/AppleInc/aos/published/images/M/RM/MRME2/MRME2?wid=1144&hei=1144&fmt=jpeg&qlt=95&op_usm=0.5%2C0.5&.v=1520531651846"
            },
            {
                id: 3,
                name: "Screen",
                cost: 179.99,
                tax: 19,
                imgSrc:
                    "https://images.philips.com/is/image/PhilipsConsumer/278E8QJAB_00-IMS-en_GB?$jpglarge$&wid=1250"
            },
            {
                id: 4,
                name: "Printer",
                cost: 99.99,
                tax: 19,
                imgSrc:
                    "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6042/6042708_sd.jpg"
            },
            {
                id: 5,
                name: "Speaker",
                cost: 150,
                tax: 19,
                imgSrc:
                    "https://images-na.ssl-images-amazon.com/images/I/710Dq0xYIsL._SL1300_.jpg"
            },
            {
                id: 6,
                name: "External SSD",
                cost: 129.99,
                tax: 19,
                imgSrc:
                    "https://images.techhive.com/images/article/2016/02/t3_007_dynamaic_silver-100645386-orig.jpg"
            }
        ]
    },
    getters: {
        /**
         * Returns the items array from state.
         * @param state, the state to get the items object from.
         * @return {Array} items, the array containing individual JS objects for each item.
         */
        items: state => {
            return state.items;
        },
        /**
         * Returns the cartItems array from state.
         * @param state, the state to get the cartItems array from.
         * @return {Array} cartItems, the array containing the JS objects for each cart item.
         */
        cartItems: state => {
            return state.cartItems;
        },
        /**
         * Returns a function which takes the ID of the item and the property we want to retrieve,
         * then returns the value of that property from the item with the corresponding ID from
         * the items array.
         * @param state, the state to get the item's property from.
         * @return {function(number, string):{number|string|null}}, returns a function that takes ID
         * and property as parameters, which then finds a match and returns the value of that property.
         * If no match is found, null is returned.
         */
        cartItemProperty: state => (id, property) => {
            for (let i = 0; i < state.items.length; i++) {
                if (state.items[i].id === id) return state.items[i][property];
            }
            return null;
        },
        /**
         * Returns a function which takes the ID of the cart item, which then returns
         * the quantity of that cart item.
         * @param state, the state to get the cartItem's quantity from.
         * @return {function(number):number}, returns a function that takes the cart item's ID
         * as a parameter, which then returns the quantity of that cart item. If no match is found,
         * 0 is returned.
         */
        itemQuantity: state => id => {
            for (let i = 0; i < state.cartItems.length; i++) {
                if (state.cartItems[i].id === id) return state.cartItems[i].qty;
            }
            return 0;
        },
        /**
         * Returns the total number/quantity of items in the cart.
         * @param state, the state to get the total quantity from.
         * @return {number}, the total number of items in the cart, i.e. the
         * sum of all individual quantities.
         */
        totalItems: state => {
            let sum = 0;
            for (let i = 0; i < state.cartItems.length; i++) {
                sum += state.cartItems[i].qty;
            }
            return sum;
        },
        /**
         * Returns the total price of the cart and total tax of the cart as a string array
         * @param state, the state to get the cart items' id
         * @param getters, to provide access to the getter methods
         * @return {string[]}, the string array containing the cart total and cart tax total
         * formatted to two decimal places
         */
        totalCostAndTax: (state, getters) => {
            let sum = 0;
            let taxSum = 0;
            for (let i = 0; i < state.cartItems.length; i++) {
                let cost = getters["cartItemProperty"](
                    state.cartItems[i].id,
                    "cost"
                );
                let qty = state.cartItems[i].qty;
                let tax = getters["cartItemProperty"](
                    state.cartItems[i].id,
                    "tax"
                );
                sum += cost * qty;
                taxSum += cost * qty * tax * 0.01;
            }
            return [sum.toFixed(2), taxSum.toFixed(2)];
        }
    },
    mutations: {
        /**
         * Increments quantity of item stored in cartItems by 1. If item does not exist
         * in the cartItems array, the item is pushed to the cartItems array with a qty of 1.
         * @param state, the state containing the cartItems array.
         * @param {number} itemID, the ID of the item to add to the cart/increment its value.
         */
        increaseQuantity(state, itemID) {
            for (let i = 0; i < state.cartItems.length; i++) {
                if (state.cartItems[i].id === itemID) {
                    state.cartItems[i].qty++;
                    return;
                }
            }
            state.cartItems.push({ id: itemID, qty: 1 });
        },
        /**
         * Decrements the quantity of item stored in cartItems by 1. If item's current quantity
         * is 1, the item is removed from the cartItems array.
         * @param state, the state containing the cartItems array.
         * @param itemID, the ID of the item to decrement the quantity of/remove from the cart.
         */
        reduceQuantity(state, itemID) {
            for (let i = 0; i < state.cartItems.length; i++) {
                if (state.cartItems[i].id === itemID) {
                    if (state.cartItems[i].qty > 1) state.cartItems[i].qty--;
                    else state.cartItems.splice(i, 1);
                    return;
                }
            }
        }
    },
    actions: {
        /**
         * Increases the quantity of an item/adds that item from the cart by committing the
         * "increaseQuantity" mutation on that item.
         * @param commit, to provide access to the mutation methods.
         * @param itemID, the ID of the item to perform the mutation on.
         */
        incrementItemQuantity({ commit }, itemID) {
            commit("increaseQuantity", itemID);
        },
        /**
         * Decreases the quantity of an item/removes that item from the cart by committing the
         * "decreaseQuantity" mutation on that item.
         * @param commit, to provide access to the mutation methods.
         * @param itemID, the ID of the item to perform the mutation on.
         */
        decrementItemQuantity({ commit }, itemID) {
            commit("reduceQuantity", itemID);
        }
    }
});
