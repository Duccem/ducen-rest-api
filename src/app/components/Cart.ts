import { Repository } from "../libs/Repositories/Repository";
import { BadRequest, InvalidID } from "../libs/Errors";
import { CrudEntity, DoubleEntity } from "../libs/Entities/Entity";

export class Cart implements CrudEntity, DoubleEntity {
	private repository: Repository;

	constructor(repository: Repository) {
		this.repository = repository;
	}

	public async list(options?: any): Promise<any> {
		const [carts, count] = await Promise.all([this.repository.list("carts", options), this.repository.count("carts", options)]);
		const cartDetailsPromises: Promise<any>[] = [];
		for (const cart of carts) {
			let cartDetailPromise = this.repository.list("cartdetails", {
				fields: ["quantity"],
				include: [
					{
						name: "products",
					},
				],
				where: {
					cartId: cart.id,
				},
			});
			cartDetailsPromises.push(cartDetailPromise);
		}
		const promiseResponses = await Promise.all(cartDetailsPromises);
		for (let index = 0; index < carts.length; index++) carts[index].products = promiseResponses[index];
		return {
			totalCount: count,
			count: carts.length,
			carts,
		};
	}

	public async get(id: number | string, options?: any): Promise<any> {
		if (isNaN(id as number)) throw new InvalidID();
		const [cart, details] = await Promise.all([
			this.repository.get("carts", id, options),
			this.repository.count("cartdetails", {
				fields: ["quantity"],
				include: [
					{
						name: "products",
					},
				],
				where: {
					cartId: id,
				},
			}),
		]);
		if (cart) cart.products = details;
		return cart;
	}

	public async insert(data: any): Promise<any> {
		const newCart: any = {
			userId: data.userId,
			total: 0,
			subtotal: 0,
			tax: 0,
		};
		const { insertId } = await this.repository.insert("carts", newCart);
		newCart.id = insertId;
		return newCart;
	}

	public async update(id: number | string, data: any): Promise<any> {
		if (isNaN(id as number)) throw new InvalidID();
		await this.repository.update("carts", id, data);
		return await this.repository.get("carts", id);
	}

	public async remove(id: number | string) {
		if (isNaN(id as number)) throw new InvalidID();
		await this.repository.remove("carts", id);
		return {
			message: "Cart deleted",
		};
	}

	public async addDetail(id: number | string, data?: any): Promise<any> {
		const [cart, product, details] = await Promise.all([
			this.repository.get("carts", id),
			this.repository.get("products", data.detailId),
			this.repository.list("cartsdetails", { where: { cartId: id, productId: data.detailId } }),
		]);
		if (!cart) throw new BadRequest("The cart doesn't exists");
		if (!product) throw new BadRequest("The product doesn't exists");
		let price,
			totalPrice,
			tax = 0;
		let quantityPassed = parseFloat(data.quantity);
		let productPrice = parseFloat(product.price);
		let cartSubtotal = parseFloat(cart.subtotal);
		let newDetail: any;
		if (details[0]) {
			let quantityofDetail = parseFloat(details[0].quantity);
			price = (quantityofDetail + quantityPassed) * productPrice;
			totalPrice = (cartSubtotal - quantityofDetail) * productPrice + price;
			details[0].quantity = quantityofDetail + quantityPassed;
			newDetail = details[0];
		} else {
			price = quantityPassed * productPrice;
			totalPrice = parseFloat(cart.subtotal) + price;
			newDetail = {
				quantity: quantityPassed,
			};
		}
		tax = totalPrice * 0.18;
		await Promise.all([
			this.repository.update("carts", details[0].id, newDetail),
			this.repository.update("carts", id, { subtotal: totalPrice, tax: tax, total: totalPrice + tax }),
		]);
		return {
			message: "Product added to the cart",
		};
	}

	public async removeDetail(id: number | string, data?: any): Promise<any> {
		const [cart, product, details] = await Promise.all([
			this.repository.get("carts", id),
			this.repository.get("products", data.detailId),
			this.repository.list("cartsdetails", { where: { cartId: id, productId: data.detailId } }),
		]);
		if (!cart) throw new BadRequest("The cart doesn't exists");
		if (!product) throw new BadRequest("The product doesn't exists");
		if (!details[0]) throw new BadRequest("The cart doesn`t have this product");
		let price,
			totalPrice,
			tax = 0;
		if (details[0].quantity - data.quantity <= 0) {
			price = details[0].quantity * product.price;
			await this.repository.remove("cartsdetail", details[0].id);
		} else {
			price = data.quantity * product.price;
			details[0].quantity = details[0].quantity - data.quantity;
			await this.repository.update("cartsdetail", details[0].id, { quantity: details[0].quantity });
		}
		totalPrice = cart.subtotal - price;
		tax = totalPrice * 0.18;
		await this.repository.update("carts", id, { subtotal: totalPrice, tax: tax, total: totalPrice + tax });
		return {
			message: "Product removed",
		};
	}
}
