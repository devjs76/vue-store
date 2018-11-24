//debug tools
Vue.config.debug = true; 
Vue.config.devtools = true;

var eventBus = new Vue({

})

//products
var productsArray= {
	"arrayOfProducts": [
		{
			"imgUrl": "https://guesseu.scene7.com/is/image/GuessEU/M63H24W7JF0-L302-ALTGHOST?wid=1500&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0",
			"name": "CHECK PRINT SHIRT",
			"price": 19.95
		},
		{
			"imgUrl": "https://guesseu.scene7.com/is/image/GuessEU/FLGLO4FAL12-BEIBR?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
			"name": "GLORIA HIGH LOGO SNEAKER",
			"price": 45.00
		},
		{
			"imgUrl": "https://guesseu.scene7.com/is/image/GuessEU/HWVG6216060-TAN?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
			"name": "CATE RIGID BAG",
			"price": 90.00
		},
		{
			"imgUrl": "http://guesseu.scene7.com/is/image/GuessEU/WC0001FMSWC-G5?wid=520&fmt=jpeg&qlt=80&op_sharpen=0&op_usm=1.0,1.0,5,0&iccEmbed=0",
			"name": "GUESS CONNECT WATCH",
			"price": 438.99
		},
		{
			"imgUrl": "https://guesseu.scene7.com/is/image/GuessEU/AW6308VIS03-SAP?wid=700&amp;fmt=jpeg&amp;qlt=80&amp;op_sharpen=0&amp;op_usm=1.0,1.0,5,0&amp;iccEmbed=0",
			"name": "'70s RETRO GLAM KEFIAH",
			"price": 20.00
		}
	]
}

//Product review component
Vue.component('product-review', {
    template:` <form class="review-form" @submit.prevent="onSubmit">
    <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
    </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option> 
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>Would you recommend this product?</p>
    <label>Yes
    <input type="radio" id="yes" value="Yes" v-model="recommend"></label>
 
    <label>No
    <input type="radio" id="no" value="No" v-model="recommend"></label>

    <p>
      <input type="submit" value="Submit">  
    </p>    
  
  </form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors:[]
        }
    },
    methods: { 
        onSubmit() {
            if (this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }

                //send data to parent component
                eventBus.$emit('review-submitted', productReview)

                //reset data to null after submission
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if (!this.errors) {
                    if(!this.name) this.errors.push("Name required")
                    if(!this.review) this.errors.push("Review required")
                    if(!this.rating) this.errors.push("Rating required")
                    if(!this.recommend) this.errors.push("Recommendation required")
                } else {
                    this.errors = []
                    if(!this.name) this.errors.push("Name required")
                    if(!this.review) this.errors.push("Review required")
                    if(!this.rating) this.errors.push("Rating required")
                    if(!this.recommend) this.errors.push("Recommendation required")
                }
            } 
        }
    }
})

//Product tabs component
Vue.component('product-tabs', {
    props: {
        reviews: {
          type:Array,
          required: true
        }
    },
    template:`<div>
        <span class="tab"
            :class=" { activeTab: selectedTab === tab } " 
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="selectedTab = tab">
            {{ tab }}
        </span>
        
        <div v-show="selectedTab === 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet</p>
            <ul>
                <li v-for="review in reviews">
                    <p>Name: {{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>Review: {{ review.review }}</p>
                    <p>Would you recommend this product: {{ review.recommend }}</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Leave a Review'"></product-review> 

        </div>`,
    data() {
        return {
            tabs: ['Reviews', 'Leave a Review'],
            selectedTab: 'Reviews'
        }
    }
})

//Product details component
Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:`<ul><li v-for="detail in details">{{ detail }}</li></ul>`
})

//Product component
Vue.component('product', {
    props: {
      premium: {
        type: Boolean,
        required: true
      }
    },
    template:`<div class="product">
        <div class="product-image">
            <img :src="image" />
        </div>

        <div class="product-info">
            <h1>{{ brand }} {{ product }}</h1>
            <p>{{ description }}</p>
            <p v-if="onSale"><em>{{ saleStatus }}</em></p>
            <p v-if="inStock">In Stock</p>
            <p style="color:red;font-weight:bold;" v-else>Out of Stock</p>
            <p>Shipping is: {{ shipping }}</p>
            <product-details :details="details"></product-details>
            
            <div v-for="(variant, index) in variants" 
                :key="variant.variantId"
                class="color-box"
                :style="{ backgroundColor: variant.variantColor }"
                @mouseover="updateProduct(index)">
                <span>{{ variant.variantColorName }}</span>
            </div>

            <button v-on:click="addToCart"
                :disabled="!inStock"
                :class="{ disabledButton: !inStock }"
                >Add To Cart
            </button>

            <button v-on:click="removeFromCart"
                :disabled="!inStock"
                :class="{ hiddenButton: !inStock }"
                >Remove
            </button>

            <product-tabs :reviews="reviews"></product-tabs>
        </div>

    </div>`,
    data() {
        return {
            brand: "Kustom Designer",
            product: "Socks",
            description: "These are cotton handsewn socks.",
            link: "test",
            selectedVariant: 0,
            inventory: 100,
            onSale: true, 
            cart: 0,
            details: ["80% Cotton", "20% Polyester", "Gender Neutral"],
            variants: [
                {
                    variantId: 2234,
                    variantColor: "Green",
                    variantColorName: "Hunter Green",
                    variantImage: "./images/vue-socks-green.jpeg",
                    variantQuantity: 10,
                    variantRegularPrice: 15.99,
                    variantSalePrice: 7.99,
                },
                {
                    variantId: 2235,
                    variantColor: "Blue",
                    variantColorName: "Ocean Blue",
                    variantImage: "./images/vue-socks-blue.jpeg",
                    variantQuantity: 0,
                    variantRegularPrice: 15.99,
                    variantSalePrice: 8.99,
                },

            ],
            sizes: ["Small", "Medium", "Large"],
            reviews: []
        }
    },
    methods: {
        addToCart: function() {
           this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
        },
        removeFromCart: function() {
          this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
        },
        updateProduct: function(index) {
            this.selectedVariant = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].variantImage
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
        },
        saleStatus() {
            return this.brand + ' ' + this.product + ' is on sale for ' + 
            this.variants[this.selectedVariant].variantSalePrice 
        },
        shipping() {
            if(this.premium) {
                return "Free"
            }
            return 2.99
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
          this.reviews.push(productReview)
        })           
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart:[]

    },
    methods: {
        updateCart(id) {
            this.cart.push(id)
        },
        removeItem(id) {
            for(var i = this.cart.length -1; i >= 0; i--) {
                if(this.cart[i] == id) {
                    this.cart.splice(i, 1)
                }
            }
        }
    }
})
