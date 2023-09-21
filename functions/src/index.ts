import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { createTransport } from 'nodemailer';
import * as Cors from 'cors';
const senderMailUsername = defineSecret('SENDER_MAIL_USERNAME');
const senderMailPassword = defineSecret('SENDER_MAIL_PASSWORD');
const receiverMailUsername = defineSecret('RECEIVER_MAIL_USERNAME');

export const sendMail = onRequest(
	{ secrets: [senderMailUsername, senderMailPassword, receiverMailUsername] },
	(request, response) => {
		const cors = Cors();
		cors(request, response, async () => {
			try {
				const emailTransporter = createTransport({
					service: 'gmail',
					auth: {
						user: senderMailUsername.value(),
						pass: senderMailPassword.value(),
					},
				});

				await emailTransporter.sendMail({
					from: `"MagoraBot 🤖" <${senderMailUsername.value()}>`,
					to: receiverMailUsername.value(),
					subject: request.body.subject as string,
					html: `<strong>Name:</strong> ${request.body.name} <br/>
					<strong>E-mail:</strong> ${request.body.email}  <br/>
					<strong>Message:</strong> ${request.body.message}`,
				});
				response.status(200).send();
			} catch (error) {
				response.status(500).send(error);
			}
		});
	}
);
