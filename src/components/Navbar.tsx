'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import logo from '@/Assets/NexgamiLogo.png';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import SearchIcon from '@mui/icons-material/Search';
import LanguageIcon from '@mui/icons-material/Language';
import { Button, IconButton, Menu, MenuItem, Skeleton, ThemeProvider } from '@mui/material';
import Link from 'next/link';
import { useUserContext } from '@/contexts/UserContext';
import { fetchUserInfo, requestAuthorization } from '@/utils/auth';
import PersonIcon from '@mui/icons-material/Person';
import { MUITheme } from '@/utils/MUITheme';
import { useRouter } from 'next/navigation';

const Navbar = () => {
	const { userData, loadingUser, setUserData, fetchUserData, signOut } = useUserContext();
	const router = useRouter();

	useEffect(() => {
		fetchUserData();

		const handleMessage = async (event: any) => {
			if (event.origin !== window.location.origin) return;
			const data = event.data;
			console.log('🚀 ~ handleMessage ~ data:', data);

			if (data.access_token) {
				const userInfo: any = await fetchUserInfo(data.access_token);
				console.log('🚀 ~ handleMessage ~ userInfo:', userInfo);
				localStorage.setItem('nexgAccessToken', data.access_token);
				localStorage.setItem('nexgRefreshToken', data.refresh_token);

				setUserData?.(userInfo);
			} else {
				console.error('Failed to get access token');
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// setAuth(event.target.checked);
	};

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<ThemeProvider theme={MUITheme}>
			<nav className="flex items-center justify-between p-3 bg-base-200 text-white sticky top-0 z-20">
				<ul className="flex items-center gap-8">
					<Link href={'/'}>
						<li className="flex items-center gap-2">
							<Image className="h-10 w-10" src={logo} alt="NexGami" />
							<div className="flex flex-col text-sm leading-4">
								<p>NexGami</p>
								<p className="pl-2">Academy</p>
							</div>
						</li>
					</Link>

					<Link href={'/courses'} className="xl:flex hidden">
						<p>Articles</p>
						<ArrowDropDownIcon />
					</Link>
					<li className="">
						<Link href={'/courses'} className="flex">
							<p>Courses</p>
							<ArrowDropDownIcon />
						</Link>
					</li>
					<Link href={`/courses`} className="xl:flex hidden">
						<p>Learn & Earn</p>
						<ArrowDropDownIcon />
					</Link>
					<Link href={`/partners`} className="xl:flex hidden">
						<p>Partnership</p>
						<ArrowDropDownIcon />
					</Link>
					<Link href={`/courses`} className="xl:flex hidden">
						<p>Study Week</p>
						<ArrowDropDownIcon />
					</Link>
				</ul>

				<ul className="xl:flex items-center gap-2 xl:gap-7 ">
					{/* <li>
					<IconButton>
						<SearchIcon htmlColor="white" />
					</IconButton>
				</li> */}

					{/* <li>
					<p className="text-xs xl:text-base">Log In</p>
				</li> */}
					{loadingUser ? (
						<>
							<Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: '#152b53' }} />
						</>
					) : (
						<>
							{!userData?.userId ? (
								<li>
									<Button
										size="small"
										variant="contained"
										sx={{
											textTransform: 'capitalize',
											fontSize: { xs: '12px', xl: '14px' },
										}}
										onClick={requestAuthorization}>
										Log In
									</Button>
								</li>
							) : (
								<li>
									{/* <Button
									size="small"
									variant="contained"
									sx={{
										textTransform: 'capitalize',
										fontSize: { xs: '12px', xl: '14px' },
									}}
									onClick={signOut}>
									Sign Out
								</Button> */}
									<IconButton size="large" aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleMenu} color="inherit">
										<PersonIcon />
									</IconButton>
									<Menu
										sx={{
											mt: '45px',
											'&.MuiMenu-paper': {
												bgcolor: '#141416',
											},
										}}
										id="menu-appbar"
										anchorEl={anchorEl}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorEl)}
										onClick={handleClose}
										onClose={handleClose}>
										{/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
										{userData?.userType == 'Admin' && <MenuItem onClick={() => router.push('/admin/upload/course')}>Upload Course</MenuItem>}

										<MenuItem onClick={signOut}>Log Out</MenuItem>
									</Menu>
								</li>
							)}
						</>
					)}
					{/* <li>
					<IconButton>
						<LanguageIcon htmlColor="white" />
					</IconButton>
				</li> */}
				</ul>
			</nav>
		</ThemeProvider>
	);
};

export default Navbar;
