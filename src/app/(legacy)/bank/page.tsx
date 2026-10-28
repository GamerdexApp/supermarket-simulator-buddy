"use client";

import { Badge, Button, Card, Label, RangeSlider } from "flowbite-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import type { Loan } from "@/types";
import { usePlaythrough } from "@/lib/contexts/PlaythroughContext";
import { bank } from "@/data/supermarket-simulator/bank";

export default function BankPage() {
	const { activePlaythrough, updatePlaythrough } = usePlaythrough();

	if (!activePlaythrough) {
		redirect("/");
	}

	const activeLoans = activePlaythrough.activeLoans || [];

	const [termLengths, setTermLengths] = useState<Record<number, number>>(
		bank.loans.reduce(
			(acc, loan, index) => {
				const activeLoan = activeLoans.find((al) => al.loanIndex === index);
				acc[index] = activeLoan?.termLength || loan.minTermLength;
				return acc;
			},
			{} as Record<number, number>
		)
	);

	const handleSliderChange = (loanIndex: number, value: number) => {
		setTermLengths((prev) => ({
			...prev,
			[loanIndex]: value,
		}));
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

	const isLoanActive = (loanIndex: number) => {
		return activeLoans.some((al) => al.loanIndex === loanIndex);
	};

	const handleActivateLoan = (loanIndex: number) => {
		const updatedActiveLoans = [
			...activeLoans,
			{
				loanIndex,
				termLength: termLengths[loanIndex],
				activatedDate: new Date().toISOString(),
			},
		];

		updatePlaythrough(activePlaythrough.id, {
			activeLoans: updatedActiveLoans,
		});
	};

	const handleDeactivateLoan = (loanIndex: number) => {
		const updatedActiveLoans = activeLoans.filter((al) => al.loanIndex !== loanIndex);

		updatePlaythrough(activePlaythrough.id, {
			activeLoans: updatedActiveLoans,
		});
	};

	return (
		<main className="min-h-screen bg-gray-50 p-8 dark:bg-gray-900">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white">Bank Loans</h1>
					<p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
						Manage your loans for {activePlaythrough.name}
					</p>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{bank.loans.map((loan, index) => {
						const termLength = termLengths[index];
						const { dailyPayment, totalPayment, totalInterest } = calculateLoanDetails(
							loan,
							termLength
						);
						const active = isLoanActive(index);
						const activeLoan = activeLoans.find((al) => al.loanIndex === index);
						const currentStoreLevel = activePlaythrough.storeLevel ?? 0;
						const meetsLevelRequirement = currentStoreLevel >= loan.storeLevel;

						return (
							<Card key={index} className="relative">
								{active && (
									<Badge
										color="success"
										className="absolute top-4 right-4"
										icon={HiCheckCircle}
									>
										Active
									</Badge>
								)}

								<h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
									Loan #{index + 1}
								</h2>

								<div className="mb-6 space-y-2 text-gray-700 dark:text-gray-300">
									<div className="flex justify-between">
										<span className="font-medium">Principal Amount:</span>
										<span>${loan.originalAmount.toLocaleString()}</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium">Daily Interest Rate:</span>
										<span>{(loan.dailyInterest * 100).toFixed(1)}%</span>
									</div>
									<div className="flex justify-between">
										<span className="font-medium">Store Level Required:</span>
										<span>{loan.storeLevel}</span>
									</div>
								</div>

								<div className="mb-6">
									<Label
										htmlFor={`term-${index}`}
										className="mb-2 block text-sm font-medium"
									>
										Term Length: {termLength} days
									</Label>
									<RangeSlider
										id={`term-${index}`}
										min={loan.minTermLength}
										max={loan.maxTermLength}
										value={termLength}
										onChange={(e) =>
											handleSliderChange(index, Number(e.target.value))
										}
										disabled={active}
									/>
									<div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
										<span>{loan.minTermLength} days</span>
										<span>{loan.maxTermLength} days</span>
									</div>
								</div>

								<div className="mb-6 space-y-2 rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
									<h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
										Loan Details
									</h3>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Total Interest:
										</span>
										<span className="font-medium text-gray-900 dark:text-white">
											${totalInterest.toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-400">
											Total Payment:
										</span>
										<span className="font-medium text-gray-900 dark:text-white">
											${totalPayment.toFixed(2)}
										</span>
									</div>
									<div className="flex justify-between border-t border-gray-300 pt-2 dark:border-gray-600">
										<span className="font-semibold text-gray-900 dark:text-white">
											Daily Payment:
										</span>
										<span className="text-lg font-bold text-blue-600 dark:text-blue-400">
											${dailyPayment.toFixed(2)}
										</span>
									</div>
								</div>

								{active ? (
									<div className="space-y-2">
										<p className="text-sm text-gray-600 dark:text-gray-400">
											Activated on:{" "}
											{activeLoan &&
												new Date(
													activeLoan.activatedDate
												).toLocaleDateString()}
										</p>
										<Button
											color="red"
											onClick={() => handleDeactivateLoan(index)}
											className="w-full"
										>
											Deactivate Loan
										</Button>
									</div>
								) : (
									<div className="space-y-2">
										{!meetsLevelRequirement && (
											<p className="text-sm text-red-600 dark:text-red-400">
												Store level {loan.storeLevel} required (currently{" "}
												{currentStoreLevel})
											</p>
										)}
										<Button
											color="blue"
											onClick={() => handleActivateLoan(index)}
											disabled={!meetsLevelRequirement}
											className="w-full"
										>
											Activate Loan
										</Button>
									</div>
								)}
							</Card>
						);
					})}
				</div>
			</div>
		</main>
	);
}
