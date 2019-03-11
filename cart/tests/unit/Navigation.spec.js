import { shallowMount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Navigation from "@/components/Navigation";
import store from "@/store";

describe("Navigation", () => {
    let wrp;

    beforeEach(() => {
        Vue.use(Vuetify);
        wrp = shallowMount(Navigation, {
            store
        });
    });
    it("is a Vue instance", () => {
        expect(wrp.isVueInstance()).toBe(true);
    });
    it("has button to show and hide the cart", () => {
        expect(wrp.contains("v-btn-stub")).toBe(true);
    });
    it("can get a cart item's property", () => {
        const result = wrp.vm.getCartItemProperty(3, "name");
        expect(result).toBe("Screen");
    });
    it("can get the quantity of an item in the cart", () => {
        store.state.cartItems = [{ id: 3, qty: 6 }, { id: 5, qty: 2 }];
        const result1 = wrp.vm.getItemQuantity(3);
        expect(result1).toBe(6);
        const result2 = wrp.vm.getItemQuantity(5);
        expect(result2).toBe(2);
        const result3 = wrp.vm.getItemQuantity(2);
        expect(result3).toBe(0);
    });
    it("can get the cart's total and total tax", () => {
        store.state.cartItems = [{ id: 5, qty: 2 }, { id: 2, qty: 1 }];
        const result = wrp.vm.getCartTotalAndTax();
        let total = result[0];
        let taxTotal = result[1];
        expect(total).toBe("349.99");
        expect(taxTotal).toBe("66.50");
    });
    it("can increment and decrement item quantities", () => {
        store.state.cartItems = [{ id: 3, qty: 6 }, { id: 5, qty: 2 }];
        wrp.vm.incrementItemQuantity(5);
        wrp.vm.decrementItemQuantity(3);
        expect(store.state.cartItems).toEqual([
            { id: 3, qty: 5 },
            { id: 5, qty: 3 }
        ]);
    });
});
