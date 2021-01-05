import { EmailEventsSubscriber } from "../../../contexts/ClientAttention/Emails/application/EmailEventsSubscriber";
import Container from "typedi";


export function register() {
	const emailEventSubscriber = Container.get<EmailEventsSubscriber>("EmailSubscriber")
	return emailEventSubscriber;
}
