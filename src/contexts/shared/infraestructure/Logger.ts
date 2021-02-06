import moment from "moment";
import fs from "fs-extra";
import path from 'path'
/**
 * cont types of logers
 */
const types: any = {
	server: "[SERVER]",
	database: "[DATABASE]",
	cache: "[CACHE]",
	messageQ: "[MESSAGE QUEUE]",
	request: "[REQUESTED]",
	response: "[RESPONSE]",
	error: "[ERROR]",
	files: "[FILE]",
	message: "[MESSAGE]",
	system: "[SYSTEM]",
};

/**
 * color of loggers
 */
const colors: any = {
	null: "\x1b[30m",
	error: "\x1b[31m",
	success: "\x1b[32m",
	warning: "\x1b[33m",
	info: "\x1b[34m",
	system: "\x1b[35m",
	important: "\x1b[36m",
	message: "\x1b[37m",
};

/**
 * Backgrounds of loggers
 */
const background: any = {
	null: "\x1b[40m",
	error: "\x1b[41m",
	success: "\x1b[42m",
	warning: "\x1b[43m",
	info: "\x1b[44m",
	system: "\x1b[45m",
	important: "\x1b[46m",
	message: "\x1b[47m",
};

/**
 * Typography type
 */
const decorators: any = {
	reset: "\x1b[0m",
	bright: "\x1b[1m",
	dim: "\x1b[2m",
	underscore: "\x1b[4m",
	blink: "\x1b[5m",
	reverse: "\x1b[7m",
	hidden: "\x1b[8m",
};

/**
 * Options of logger
 */
export interface IDucenloggerOptions {
	color?: string;
	type?: string;
	background?: string;
	decorator?: string;
}

/**
 * Config of the logger constructor
 */
export interface ILoggerConfig {
	mode?: string;
	format?: string;
}

/**
 * Logger class to print with colors or format epcified
 */
export class Logger {
	private mode: string;
	private format: string;

	constructor(options: ILoggerConfig = {}) {
		this.mode = options.mode || "dev";
		this.format = options.format || "iso";
	}

	get logMode() {
		return this.mode;
	}
	set logMode(newMode: string) {
		this.mode = newMode;
	}

	get dateFormat() {
		return this.format;
	}
	set dateFormat(format) {
		this.format = format;
	}

	/**
	 * Select the type of log
	 * @param type the type of log [server, database, network, file, message]
	 */
	private selectType(type: string): string {
		if (Object.keys(types).includes(type)) {
			return types[type];
		} else {
			return types.message;
		}
	}

	/**
	 * Select the color format of the title message
	 * @param color the color name
	 */
	private selectColor(color: string): string {
		if (Object.keys(colors).includes(color)) {
			return color;
		} else {
			return "message";
		}
	}

	/**
	 * Time setter
	 */
	protected date(): string {
		const currentDate = moment().utc().format("YYYY-MM-DD HH:mm:ss.SSSSSSSSS");
		const intermediateDate = moment.utc(currentDate).toDate();
		let formattedDate = "";
		switch (this.format) {
			case "large":
				formattedDate = moment(intermediateDate).local().format("dddd, MMMM Do YYYY, h:mm:ss.SSS a");
				break;
			case "utc":
				formattedDate = moment(intermediateDate).local().format("ddd, DD MMM YYYY HH:mm:ss.SSS");
				break;
			case "clf":
				formattedDate = moment(intermediateDate).local().format("DD/MMM/YYYY:HH:mm:ss.SSS");
			case "iso":
				formattedDate = moment(intermediateDate).local().format("YYYY-MM-DD HH:mm:ss.SSS");
				break;
			default:
				break;
		}

		return formattedDate;
	}

	/**
	 * Function that write the file
	 * @param message string to write
	 */
	protected fileWrite(message: any) {
		const date = new Date()
		const year = date.getFullYear();
		const month = date.getMonth().toString().length < 2 ? '0'+date.getMonth().toString() : date.getMonth()
		const day = date.getDay().toString().length < 2 ? '0'+date.getDay().toString() : date.getDay()
		let file = fs.createWriteStream(path.resolve(process.cwd(),`logs/${year}-${month}-${day}.log`), { flags: "a" });
		file.write(message + "\n");
	}

	/**
	 * return the string colorized
	 * @param msg string message
	 * @param format color format
	 */
	public text(message: string, options: IDucenloggerOptions = {}): string {
		let dec = "";
		if (options.background && Object.keys(background).includes(options.background as string)) {
			dec += background[options.background as string];
		}
		if (options.decorator && Object.keys(decorators).includes(options.decorator as string)) {
			dec += decorators[options.decorator as string];
		}
		if (!options.color) options.color = "message";
		return dec + colors[options.color as string] + message + decorators.reset;
	}

	/**
	 * the function responsable for the log
	 * @param options object tha contain the type, color and message
	 */
	public log(message: any, options: IDucenloggerOptions = {}) {
		options.type = this.selectType(options.type || "");
		options.color = this.selectColor(options.color || "");
		console.log(`${this.text(options.type, options)} ${this.text("(" + this.date() + ")", options)} ${message}`);
		if (this.mode == "prod") {
			let log = `${options.type} ${"(" + this.date() + ")"} ${message}`;
			this.fileWrite(log);
		}
	}
}

const ducenlogger = new Logger();

export default ducenlogger;
