"use client";

import { Badge, Button, Card } from "flowbite-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";
import {
	HiCurrencyDollar,
	HiOfficeBuilding,
	HiPencil,
	HiShoppingCart,
	HiTrash,
	HiTrendingUp,
} from "react-icons/hi";
import type { Loan } from "@/types";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { bank } from "@/data/supermarket-simulator/bank";
import { management } from "@/data/supermarket-simulator/management";
import { market } from "@/data/supermarket-simulator/market";
import { DeleteConfirmModal } from "@/comps/modals/DeleteConfirmModal";
import { EditPlaythroughModal } from "@/comps/modals/EditPlaythroughModal";

export default function Dashboard() {
	const { activePlaythrough, updatePlaythrough, deletePlaythrough } = usePlaythrough();

	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	if (!activePlaythrough) {
		redirect("/");
	}

	const handleDelete = () => {
		deletePlaythrough(activePlaythrough.id);
		setIsDeleteModalOpen(false);
	};

	const calculateLoanDetails = (loan: Loan, termLength: number) => {
		const totalInterest = loan.originalAmount * loan.dailyInterest * termLength;
		const totalPayment = loan.originalAmount + totalInterest;
		const dailyPayment = totalPayment / termLength;

		return {
			totalInterest,
			totalPayment,
			dailyPayment,
		};
	};

	const activeLoans = activePlaythrough.activeLoans || [];
	const totalLoanDebt = activeLoans.reduce((sum, activeLoan) => {
		const loan = bank.loans[activeLoan.loanIndex];
		const { totalPayment } = calculateLoanDetails(loan, activeLoan.termLength);
		return sum + totalPayment;
	}, 0);
	const totalDailyPayment = activeLoans.reduce((sum, activeLoan) => {
		const loan = bank.loans[activeLoan.loanIndex];
		const { dailyPayment } = calculateLoanDetails(loan, activeLoan.termLength);
		return sum + dailyPayment;
	}, 0);

	const unlockedLicenses = activePlaythrough.unlockedLicenses || [];
	const licensesSpent = management.licenses
		.filter((license) => unlockedLicenses.includes(license.id))
		.reduce((sum, license) => sum + license.price, 0);

	const unlockedGrowth = activePlaythrough.unlockedGrowth || [];
	const growthSpent = management.growth
		.filter((growth) => unlockedGrowth.includes(growth.sectionNum))
		.reduce((sum, growth) => sum + growth.price, 0);

	const unlockedStorage = activePlaythrough.unlockedStorage || [];
	const storageSpent = management.storage
		.filter((storage) => unlockedStorage.includes(storage.sectionNum))
		.reduce((sum, storage) => sum + storage.price, 0);

	const hiredEmployees = activePlaythrough.hiredEmployees || [];
	const cashiersDailyWage = management.hiring.cashiers
		.filter((c) => hiredEmployees.includes(c.id))
		.reduce((sum, c) => sum + c.dailyWage, 0);
	const restockersDailyWage = management.hiring.restockers
		.filter((r) => hiredEmployees.includes(r.id))
		.reduce((sum, r) => sum + r.dailyWage, 0);
	const helpersDailyWage = management.hiring.customerHelpers
		.filter((h) => hiredEmployees.includes(h.id))
		.reduce((sum, h) => sum + h.dailyWage, 0);
	const guardsDailyWage = management.hiring.securityGuards
		.filter((g) => hiredEmployees.includes(g.id))
		.reduce((sum, g) => sum + g.dailyWage, 0);
	const janitorsDailyWage = management.hiring.janitors
		.filter((j) => hiredEmployees.includes(j.id))
		.reduce((sum, j) => sum + j.dailyWage, 0);
	const totalDailyWage =
		cashiersDailyWage +
		restockersDailyWage +
		helpersDailyWage +
		guardsDailyWage +
		janitorsDailyWage;

	const unlockedTools = activePlaythrough.unlockedTools || [];
	const toolsSpent = market.tools
		.filter((tool) => unlockedTools.includes(tool.name))
		.reduce((sum, tool) => sum + tool.unitPrice, 0);

	const unlockedVehicles = activePlaythrough.unlockedVehicles || [];
	const vehiclesSpent = market.vehicles
		.filter((vehicle) => unlockedVehicles.includes(vehicle.name))
		.reduce((sum, vehicle) => sum + vehicle.unitPrice, 0);

	const totalManagementSpent = licensesSpent + growthSpent + storageSpent;
	const totalMarketSpent = toolsSpent + vehiclesSpent;
	const totalInvestment = totalManagementSpent + totalMarketSpent;

	const totalEmployees =
		management.hiring.cashiers.length +
		management.hiring.restockers.length +
		management.hiring.customerHelpers.length +
		management.hiring.securityGuards.length +
		management.hiring.janitors.length;

	return (
		<main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
			<div className="mx-auto max-w-7xl">
				<div className="mb-8">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-4xl font-bold text-gray-900 dark:text-white">
								{activePlaythrough.name}
							</h1>
							{activePlaythrough.description && (
								<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
									{activePlaythrough.description}
								</p>
							)}
							<div className="mt-4 flex gap-4 text-sm text-gray-500 dark:text-gray-400">
								<span>
									Created:{" "}
									{new Date(activePlaythrough.createdAt).toLocaleDateString()}
								</span>
								<span>
									Last Modified:{" "}
									{new Date(activePlaythrough.lastModified).toLocaleDateString()}
								</span>
							</div>
						</div>
						<div className="flex gap-2">
							<Button color="light" onClick={() => setIsEditModalOpen(true)}>
								<HiPencil className="mr-2 size-5" />
								Edit
							</Button>
							<Button color="red" onClick={() => setIsDeleteModalOpen(true)}>
								<HiTrash className="mr-2 size-5" />
								Delete
							</Button>
						</div>
					</div>
				</div>

				<Card className="mb-6">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-xl font-bold text-gray-900 dark:text-white">
								Store Level
							</h2>
							<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
								Current progression level
							</p>
						</div>
						<div className="flex items-center gap-3">
							<HiTrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
							<span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
								{activePlaythrough.storeLevel ?? 0}
							</span>
						</div>
					</div>
				</Card>

				<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card>
						<div className="mb-4 flex items-center gap-2">
							<HiCurrencyDollar className="h-6 w-6 text-gray-900 dark:text-white" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Financial Overview
							</h2>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
							<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Active Loans
								</p>
								<p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
									{activeLoans.length}
								</p>
							</div>
							<div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Daily Payments
								</p>
								<p className="mt-1 text-2xl font-bold text-orange-600 dark:text-orange-400">
									${totalDailyPayment.toLocaleString()}
								</p>
							</div>
						</div>
						<div className="mt-4">
							<Button as={Link} href="/bank" color="blue" size="sm">
								View Bank Details
							</Button>
						</div>
					</Card>
					<Card className="flex justify-start">
						<div>
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Total Investment
							</h2>
							<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
								Combined spending across management and market
							</p>
						</div>
						<div>
							<p className="text-4xl font-bold text-green-600 dark:text-green-400">
								${totalInvestment.toLocaleString()}
							</p>
						</div>
					</Card>
				</div>

				<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
					<Card>
						<div className="mb-4 flex items-center gap-2">
							<HiOfficeBuilding className="h-6 w-6 text-gray-900 dark:text-white" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Management
							</h2>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Licenses
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{unlockedLicenses.length} of {management.licenses.length}{" "}
										unlocked
									</p>
								</div>
								<Badge color="purple" className="text-sm">
									${licensesSpent.toLocaleString()}
								</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Growth Upgrades
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{unlockedGrowth.length} of {management.growth.length}{" "}
										unlocked
									</p>
								</div>
								<Badge color="purple" className="text-sm">
									${growthSpent.toLocaleString()}
								</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Storage Upgrades
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{unlockedStorage.length} of {management.storage.length}{" "}
										unlocked
									</p>
								</div>
								<Badge color="purple" className="text-sm">
									${storageSpent.toLocaleString()}
								</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Employees
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{hiredEmployees.length} of {totalEmployees} hired
									</p>
								</div>
								<Badge color="green" className="text-sm">
									${totalDailyWage.toLocaleString()}/day
								</Badge>
							</div>
						</div>
						<div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
							<span className="font-semibold text-gray-900 dark:text-white">
								Total Invested
							</span>
							<span className="text-lg font-bold text-blue-600 dark:text-blue-400">
								${totalManagementSpent.toLocaleString()}
							</span>
						</div>
						<div className="mt-3">
							<Button as={Link} href="/management" color="blue" size="sm">
								View Management
							</Button>
						</div>
					</Card>

					<Card>
						<div className="mb-4 flex items-center gap-2">
							<HiShoppingCart className="h-6 w-6 text-gray-900 dark:text-white" />
							<h2 className="text-2xl font-bold text-gray-900 dark:text-white">
								Market
							</h2>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Products
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{unlockedLicenses.length} licenses unlocked
									</p>
								</div>
								<Badge color="info" className="text-sm">
									{
										market.products.filter((p) =>
											unlockedLicenses.includes(p.licenseId)
										).length
									}{" "}
									available
								</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Tools
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{unlockedTools.length} of {market.tools.length} unlocked
									</p>
								</div>
								<Badge color="purple" className="text-sm">
									${toolsSpent.toLocaleString()}
								</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Vehicles
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{unlockedVehicles.length} of {market.vehicles.length}{" "}
										unlocked
									</p>
								</div>
								<Badge color="purple" className="text-sm">
									${vehiclesSpent.toLocaleString()}
								</Badge>
							</div>
							<div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
								<div>
									<p className="text-sm font-medium text-gray-900 dark:text-white">
										Furniture
									</p>
									<p className="text-xs text-gray-600 dark:text-gray-400">
										{market.furnitures.length} items available
									</p>
								</div>
							</div>
						</div>
						<div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
							<span className="font-semibold text-gray-900 dark:text-white">
								Total Invested
							</span>
							<span className="text-lg font-bold text-blue-600 dark:text-blue-400">
								${totalMarketSpent.toLocaleString()}
							</span>
						</div>
						<div className="mt-3">
							<Button as={Link} href="/market" color="blue" size="sm">
								View Market
							</Button>
						</div>
					</Card>
				</div>
			</div>

			<EditPlaythroughModal
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
				}}
				currentPlaythrough={activePlaythrough}
			/>

			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
				}}
				onConfirm={handleDelete}
				title="Delete Playthrough"
				itemName={activePlaythrough.name}
			/>
		</main>
	);
}
