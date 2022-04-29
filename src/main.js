// MAIN APP
const app = Vue.createApp({
	data() {
		return {
			cart: [],
			author: {
				name: 'John Doe',
				books: [
					{ id: 1, title: 'The Perks of Being a Wallflower', quantity: 23, order: 0, soldOut: false, price: 9.99 },
					{ id: 2, title: 'Where the Wild Things Are', quantity: 0, order: 0, soldOut: true, price: 12.99 },
					{ id: 3, title: 'One Hundred Years of Solitude', quantity: 3, order: 0, soldOut: false, price: 16.99 },
					{ id: 4, title: 'Me Talk Pretty One Day', quantity: 50, order: 0, soldOut: false, price: 8.99 }
				]
			}
		};
	}
});

// CART
app.component('cart', {
	props: ['cart', 'author'],
	template: /*html*/ `
		<div class="cart">
			Items: {{ cart.length }}
			<ol style="margin:1em 0;">
				<li v-for="(item, index) in cart" :key="index">
					{{ item.title }} ({{ item.order }})
					<button @click="removeFromCart(index, item)">Remove</button>
				</li>
			</ol>
			{{ totalCartPice > 0 ? 'Total: ' + totalCartPice + '€' : ''}}
		</div>
	`,
	methods: {
		removeFromCart(index, item) {
			this.cart.splice(index, 1);
			item.quantity += item.order;
			item.order -= item.order;
			item.soldOut = item.quantity == 0 ? true : false;
		}
	},
	computed: {
		totalCartPice() {
			let total = 0;
			this.cart.map((item) => {
				total += item.price * item.order;
			});
			return total;
		}
	}
});

// BOOKS
app.component('books', {
	props: ['cart', 'author'],
	template: /*html*/ `
		<ul class="book-list">
			<book-list v-for="book in author.books" :key="book.id" :book="book" :cart="cart"></book-list>		
		</ul>
	`
});

// BOOK LIST
app.component('book-list', {
	props: ['book', 'cart', 'ids'],
	emits: ['add-to-cart'],
	template: /*html*/ `
		<li>{{ book.title }} ({{ book.quantity }})</li><span v-if="book.quantity > 0 && book.quantity < 10" class="warning">&nbsp;Almost out of stock</span>
		<div class="buttons">
			<button @click="decrementFromCart">-</button>
			<button class="add" @click="addToCart" :disabled="this.book.soldOut || this.order == 0">{{ this.book.soldOut ? 'No Stock' : 'Add(' + this.order + ')' }}</button>
			<button @click="incrementToCart">+</button>
			&nbsp;<span>{{ this.book.price }}€</span>
		</div>
	`,
	data() {
		return {
			order: 0
		};
	},
	methods: {
		decrementFromCart() {
			if (this.order > 0) {
				this.book.quantity += 1;
				this.order--;
			}
		},
		incrementToCart() {
			if (this.book.quantity > 0) {
				this.book.quantity -= 1;
				this.order++;
			}
		},
		addToCart() {
			this.book.soldOut = this.book.quantity == 0 ? true : false;
			this.book.order += this.order;
			if (!this.isInCart) this.$emit('add-to-cart', this.cart.push(this.book));
			this.order = 0;
		}
	},
	computed: {
		isInCart() {
			let isDuplicate = false;
			this.cart.map((item) => {
				if (item.title == this.book.title) isDuplicate = true;
			});
			return isDuplicate;
		}
	}
});

const vm = app.mount('#app');
