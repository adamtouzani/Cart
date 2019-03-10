<template>
    <v-layout justify-center>
        <v-flex xs12>
            <v-container fluid grid-list-md>
                <v-layout row wrap>
                    <!--For each of the store items, display a card with an image, title, and action-->
                    <v-flex
                        v-for="item in this.$store.getters.items"
                        :key="item.id"
                        xs12
                        sm6
                        md4
                        lg3
                    >
                        <v-card>
                            <v-img
                                :src="item.imgSrc"
                                height="250px"
                                contain
                            ></v-img>
                            <v-card-title primary-title>
                                <div>
                                    <h3
                                        class="mb-0"
                                        style="font-weight: bolder;"
                                    >
                                        {{ item.name }}
                                    </h3>
                                </div>
                            </v-card-title>
                            <v-card-actions class="ma-2 pb-3">
                                <div>
                                    <h2>&euro;{{ item.cost }}</h2>
                                    <small>incl. {{ item.tax }}% VAT</small>
                                </div>
                                <v-spacer />
                                <v-btn dark v-on:click="addItemToCart(item.id)">
                                    <v-icon left>mdi-cart</v-icon>
                                    Add to Cart
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-flex>
    </v-layout>
</template>

<script>
// @ is an alias to /src
export default {
    name: "Items",
    methods: {
        /**
         * Adds an item to the cart
         * @param {number} id, the id of the item to be added to the cart
         */
        addItemToCart: function(id) {
            this.$store.dispatch("incrementItemQuantity", id);
        }
    }
};
</script>
