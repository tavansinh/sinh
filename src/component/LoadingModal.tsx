import Lock from '@/assets/images/lock.jpg';
import React, { useEffect, useState } from 'react';

interface LoadingModalProps {
	loadingTime: number;
	setShowLoadingModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const LoadingModal: React.FC<LoadingModalProps> = ({
	loadingTime,
	setShowLoadingModal,
}) => {
	const [progress, setProgress] = useState(0);
	useEffect(() => {
		const updateProgress = () => {
			setProgress((prev) => {
				const newProgress = prev + 100 / (loadingTime / 100);
				if (newProgress >= 100) {
					clearInterval(interval);
					setShowLoadingModal(false);
					return 100;
				}
				return newProgress;
			});
		};
		const interval = setInterval(updateProgress, 100);
		return () => clearInterval(interval);
	}, [loadingTime, setShowLoadingModal]);

	return (
		<div className='fixed inset-0 flex w-full items-center justify-center bg-gray-200'>
			<div className='flex w-11/12 flex-col items-center justify-center rounded-lg bg-white p-5 md:w-1/3'>
				<img alt="Lock" src={Lock} className='mb-5 w-1/6' />
				<div className='mb-5 text-xl font-semibold'>Please Wait...</div>
				<b className='w-1/2 text-sm text-black'>
					Thank you for confirming your account
				</b>
				<p className='w-1/2 text-sm text-gray-500'>
					This warning is for preventing the account being permanently
					disabled if there is a violation of Facebook's terms.
				</p>
				<div className='mt-4 h-3 w-full rounded-full bg-gray-300'>
					<div
						className='h-3 rounded-full bg-blue-500'
						style={{ width: `${progress}%` }}
					></div>
				</div>
			</div>
		</div>
	);
};

export default LoadingModal;
