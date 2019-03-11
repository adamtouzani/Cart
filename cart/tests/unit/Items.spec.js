import { mount } from "@vue/test-utils";
import Vue from "vue";
import Vuetify from "vuetify";
import Items from "@/views/Items.vue";
import store from "@/store";

describe("Items", () => {
    let wrp;
    beforeEach(() => {
        Vue.use(Vuetify);
        wrp = mount(Items, {
            store
        });
    });
    it("is a Vue instance", () => {
        expect(wrp.isVueInstance()).toBe(true);
    });
    it("can render cards", () => {
        expect(wrp.contains(".v-card")).toBe(true);
    });
    it("renders card for each item in store.state.items", () => {
        expect(wrp.findAll(".v-card")).toHaveLength(6);
    });
    it("can add an item to the cart", () => {
        const spy = jest.spyOn(wrp.vm, "addItemToCart");
        wrp.setMethods({ addItemToCart: spy });
        wrp.find("#item_6 button").trigger("click");
        expect(spy).toHaveBeenCalled();
        expect(store.state.cartItems).toHaveLength(1);
        expect(store.state.cartItems).toEqual([{ id: 6, qty: 1 }]);
    });
});
