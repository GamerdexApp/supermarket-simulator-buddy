"use client";

import Image from "next/image";
import Link from "next/link";
import { FaCopyright } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";

export function AppFooter() {
	return (
		<footer>
			<div className="mx-auto border-t border-gray-200 px-6 py-16 lg:px-8 dark:border-white/10">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					<div className="space-y-8">
						<Image
							src="/logo.jpg"
							alt="Supermarket Simulator Buddy"
							width={64}
							height={64}
							className="h-16 w-auto rounded-xl"
						/>
						<p className="text-sm/6 text-gray-600 dark:text-gray-400">
							Track your Supermarket Simulator progress with ease.
						</p>
					</div>
					<div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div>
							<h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">
								Support
							</h3>
							<ul role="list" className="mt-6 space-y-4">
								<li>
									<Link
										href="/settings"
										className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
									>
										Settings
									</Link>
								</li>
								<li>
									<a
										href="https://discord.gg/gc773YF9Jh"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
									>
										<FaDiscord className="size-4 text-indigo-500" />
										Discord
									</a>
								</li>
								<li>
									<a
										href="https://github.com/chiefpansancolt/supermarket-simulator-buddy"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-2 text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
									>
										<SiGithub className="size-4" />
										GitHub
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">
								About
							</h3>
							<ul role="list" className="mt-6 space-y-4">
								<li>
									<a
										href="https://supermarketsimulator.com/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
									>
										Official Game
									</a>
								</li>
							</ul>
							<div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
								<h4 className="text-xs font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
									Disclaimer
								</h4>
								<p className="mt-2 text-xs/5 text-gray-600 dark:text-gray-400">
									This application is not affiliated with, endorsed by, or
									connected to Supermarket Simulator or its developers. All
									trademarks and game content are the property of their respective
									owners.
								</p>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-white/10">
					<p className="inline-flex items-center gap-1 text-xs/5 text-gray-500 dark:text-gray-400">
						<FaCopyright className="size-3" />
						{new Date().getFullYear()} Supermarket Simulator Buddy
					</p>
				</div>
			</div>
		</footer>
	);
}
