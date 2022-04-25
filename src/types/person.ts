export class Person {
	id: number;
	label: string;
	color: string;
	image: string;

	constructor(id: number, label: string, color: string, image: string) {
		this.id = id;
		this.label = label;
		this.color = color;
		this.image = image;
	}
	getId() {
		return this.id;
	}
	getLabel() {
		return this.label;
	}
	getColor() {
		return this.color;
	}
	getImage() {
		return this.image;
	}
}
