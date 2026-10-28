"use client";

import { Button } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
	HiChartBar,
	HiCheckCircle,
	HiClipboardList,
	HiCurrencyDollar,
	HiShoppingCart,
	HiTrendingUp,
} from "react-icons/hi";

export default function Home() {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	const toggleFaq = (index: number) => {
		setOpenFaq(openFaq === index ? null : index);
	};

	const faqs = [
		{
			question: "What is Supermarket Simulator Buddy?",
			answer: "Supermarket Simulator Buddy is a comprehensive progress tracking tool for the game Supermarket Simulator. It helps you manage multiple playthroughs, track your store growth, manage licenses, and monitor your financial progress all in one place.",
		},
		{
			question: "How does it store my data?",
			answer: "All your data is stored locally in your browser using localStorage. This means your progress is private and doesn't require any server or account creation. You can also export and import your data as JSON files for backup or sharing.",
		},
		{
			question: "Can I track multiple playthroughs?",
			answer: "Yes! You can create and manage multiple playthroughs, each with its own progress tracking. Switch between them easily using the sidebar dropdown and track different strategies or challenge runs separately.",
		},
		{
			question: "What features can I track?",
			answer: "Track your store level, licenses, storage sections, growth areas, furniture, paint, tools, vehicles, and shopping lists. Monitor your financial progress with detailed budget tracking across all categories.",
		},
		{
			question: "Is this app free to use?",
			answer: "Yes, Supermarket Simulator Buddy is completely free to use. There are no subscriptions, no ads, and no hidden costs. All features are available to everyone.",
		},
	];

	return (
		<div className="bg-white dark:bg-gray-900">
			<main>
				<div className="relative isolate overflow-hidden pt-14 pb-16 sm:pb-20">
					<Image
						src="/assets/images/Background.png"
						alt=""
						fill
						className="absolute inset-0 -z-10 size-full object-cover opacity-20 dark:opacity-10"
						priority
					/>
					<div
						aria-hidden="true"
						className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
					>
						<div
							style={{
								clipPath:
									"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
							}}
							className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-288.75"
						></div>
					</div>
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
							<div className="text-center">
								<h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl dark:text-white">
									Track Your Supermarket Empire
								</h1>
								<p className="mt-8 text-lg font-medium text-pretty text-gray-600 sm:text-xl/8 dark:text-gray-400">
									The ultimate companion app for Supermarket Simulator. Manage
									multiple playthroughs, track your progress, and build your
									supermarket empire with confidence.
								</p>
								<div className="mt-10 flex items-center justify-center gap-x-6">
									<Button as={Link} href="/dashboard" color="blue" size="lg">
										Get Started
									</Button>
									<Link
										href="#features"
										className="text-sm/6 font-semibold text-gray-900 dark:text-white"
									>
										Learn more <span aria-hidden="true">→</span>
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div
						aria-hidden="true"
						className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
					>
						<div
							style={{
								clipPath:
									"polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
							}}
							className="relative left-[calc(50%+3rem)] aspect-1155/678 w-144.5 -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-288.75"
						></div>
					</div>
				</div>

				<div className="mt-32 sm:mt-56" id="features">
					<div className="mx-auto max-w-7xl px-6 lg:px-8">
						<div className="mx-auto max-w-2xl sm:text-center">
							<h2 className="text-base/7 font-semibold text-blue-600 dark:text-blue-400">
								Everything you need
							</h2>
							<p className="mt-2 text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl dark:text-white">
								All your progress in one place
							</p>
							<p className="mt-6 text-lg/8 text-gray-600 dark:text-gray-300">
								Supermarket Simulator Buddy provides comprehensive tracking for
								every aspect of your supermarket business. From licenses to storage,
								we&apos;ve got you covered.
							</p>
						</div>
					</div>
					<div className="relative overflow-hidden pt-16">
						<div className="mx-auto max-w-7xl px-6 lg:px-8">
							<Image
								src="/screenshot.png"
								alt="App screenshot"
								width={2432}
								height={1442}
								className="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
							/>
							<div aria-hidden="true" className="relative">
								<div className="absolute -inset-x-20 bottom-0 bg-linear-to-t from-white pt-[7%] dark:from-gray-900"></div>
							</div>
						</div>
					</div>
					<div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
						<dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base/7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 dark:text-gray-400">
							<div className="relative pl-9">
								<dt className="inline font-semibold text-gray-900 dark:text-white">
									<HiShoppingCart className="absolute top-1 left-1 size-5 text-blue-600 dark:text-blue-400" />
									Multiple Playthroughs
								</dt>
								<dd>
									Create and manage unlimited playthroughs. Track different
									strategies and challenge runs separately.
								</dd>
							</div>
							<div className="relative pl-9">
								<dt className="inline font-semibold text-gray-900 dark:text-white">
									<HiCheckCircle className="absolute top-1 left-1 size-5 text-blue-600 dark:text-blue-400" />
									License Management
								</dt>
								<dd>
									Track all your product licenses and see what items each license
									unlocks for your store.
								</dd>
							</div>
							<div className="relative pl-9">
								<dt className="inline font-semibold text-gray-900 dark:text-white">
									<HiTrendingUp className="absolute top-1 left-1 size-5 text-blue-600 dark:text-blue-400" />
									Store Growth
								</dt>
								<dd>
									Monitor your store expansion with detailed tracking of storage
									and growth sections.
								</dd>
							</div>
							<div className="relative pl-9">
								<dt className="inline font-semibold text-gray-900 dark:text-white">
									<HiCurrencyDollar className="absolute top-1 left-1 size-5 text-blue-600 dark:text-blue-400" />
									Budget Tracking
								</dt>
								<dd>
									Keep tabs on your spending across all categories with
									comprehensive financial summaries.
								</dd>
							</div>
							<div className="relative pl-9">
								<dt className="inline font-semibold text-gray-900 dark:text-white">
									<HiClipboardList className="absolute top-1 left-1 size-5 text-blue-600 dark:text-blue-400" />
									Shopping Lists
								</dt>
								<dd>
									Create custom shopping lists to know what to get at each store.
								</dd>
							</div>
							<div className="relative pl-9">
								<dt className="inline font-semibold text-gray-900 dark:text-white">
									<HiChartBar className="absolute top-1 left-1 size-5 text-blue-600 dark:text-blue-400" />
									Data Export/Import
								</dt>
								<dd>
									Export your progress as JSON for backup or share with friends.
									Import data anytime.
								</dd>
							</div>
						</dl>
					</div>
				</div>

				<div className="mx-auto mt-32 px-6 sm:mt-56 lg:px-8">
					<div className="mx-auto max-w-4xl">
						<h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
							Frequently asked questions
						</h2>
						<dl className="mt-16 divide-y divide-gray-900/10 dark:divide-white/10">
							{faqs.map((faq, index) => (
								<div key={index} className="py-6 first:pt-0 last:pb-0">
									<dt>
										<button
											type="button"
											onClick={() => toggleFaq(index)}
											className="flex w-full items-start justify-between text-left text-gray-900 dark:text-white"
											aria-expanded={openFaq === index}
										>
											<span className="text-base/7 font-semibold">
												{faq.question}
											</span>
											<span className="ml-6 flex h-7 items-center">
												<svg
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.5"
													aria-hidden="true"
													className={`size-6 ${openFaq === index ? "hidden" : ""}`}
												>
													<path
														d="M12 6v12m6-6H6"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												<svg
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													strokeWidth="1.5"
													aria-hidden="true"
													className={`size-6 ${openFaq === index ? "" : "hidden"}`}
												>
													<path
														d="M18 12H6"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											</span>
										</button>
									</dt>
									{openFaq === index && (
										<dd className="mt-2 pr-12">
											<p className="text-base/7 text-gray-600 dark:text-gray-400">
												{faq.answer}
											</p>
										</dd>
									)}
								</div>
							))}
						</dl>
					</div>
				</div>
			</main>

			<footer className="mt-32">
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
							<div className="md:grid md:grid-cols-2 md:gap-8">
								<div>
									<h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">
										Features
									</h3>
									<ul role="list" className="mt-6 space-y-4">
										<li>
											<Link
												href="/dashboard"
												className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
											>
												Dashboard
											</Link>
										</li>
										<li>
											<Link
												href="/management"
												className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
											>
												Management
											</Link>
										</li>
										<li>
											<Link
												href="/market"
												className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
											>
												Market
											</Link>
										</li>
										<li>
											<Link
												href="/shopping-list"
												className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
											>
												Shopping List
											</Link>
										</li>
									</ul>
								</div>
								<div className="mt-10 md:mt-0">
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
												href="https://github.com/chiefpansancolt/supermarket-simulator-buddy"
												target="_blank"
												rel="noopener noreferrer"
												className="text-sm/6 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
											>
												GitHub
											</a>
										</li>
									</ul>
								</div>
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
										trademarks and game content are the property of their
										respective owners.
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24 dark:border-white/10">
						<p className="text-xs/5 text-gray-500 dark:text-gray-400">
							&copy; {new Date().getFullYear()} Supermarket Simulator Buddy
						</p>
					</div>
				</div>
			</footer>
		</div>
	);
}
