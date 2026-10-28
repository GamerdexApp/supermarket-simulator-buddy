import en from "@/i18n/messages/en";
import { describe, expect, it, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import { act } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { Button } from "@/comps/ui/Button";
import { Dialog } from "@/comps/ui/Dialog";
import { Field } from "@/comps/ui/Field";
import { IconButton } from "@/comps/ui/IconButton";
import { Input } from "@/comps/ui/Input";
import { ProgressBar } from "@/comps/ui/ProgressBar";
import { SegmentedControl } from "@/comps/ui/SegmentedControl";
import { Switch } from "@/comps/ui/Switch";
import { Tabs } from "@/comps/ui/Tabs";
import { ValueStepper } from "@/comps/ui/ValueStepper";

const withIntl = (node: ReactNode) => (
	<NextIntlClientProvider locale="en" messages={en} timeZone="UTC">
		{node}
	</NextIntlClientProvider>
);

const noop = () => {};

describe("ui kit renders with its accessibility basics", () => {
	it("Button is a button that does not submit forms, and loading disables it", () => {
		const html = renderToString(withIntl(<Button loading>Save</Button>));

		expect(html).toContain('type="button"');
		expect(html).toContain("disabled");
	});

	it("IconButton carries its label", () => {
		const html = renderToString(withIntl(<IconButton label="Close">x</IconButton>));

		expect(html).toContain('aria-label="Close"');
	});

	it("Switch announces its state", () => {
		const html = renderToString(withIntl(<Switch checked onChange={noop} label="Sync" />));

		expect(html).toContain('role="switch"');
		expect(html).toContain('aria-checked="true"');
	});

	it("Tabs marks the active tab and names the tab list", () => {
		const html = renderToString(
			withIntl(
				<Tabs
					label="Market"
					tabs={[
						{ id: "products", label: "Products", count: 186 },
						{ id: "vehicles", label: "Vehicles", locked: true },
					]}
					activeId="products"
					onChange={noop}
				>
					panel
				</Tabs>
			)
		);

		expect(html).toContain('aria-label="Market"');
		expect(html).toContain('aria-selected="true"');
		expect(html).toContain("(locked)");
	});

	it("ValueStepper labels both buttons", () => {
		const html = renderToString(
			withIntl(<ValueStepper label="Hearts" value={4} min={0} max={10} onChange={noop} />)
		);

		expect(html).toContain('aria-label="Lower Hearts"');
		expect(html).toContain('aria-label="Raise Hearts"');
	});

	it("SegmentedControl is a named group of radios", () => {
		const html = renderToString(
			withIntl(
				<SegmentedControl
					label="Theme"
					options={[
						{ id: "light", label: "Light" },
						{ id: "dark", label: "Dark" },
					]}
					value="light"
					onChange={noop}
				/>
			)
		);

		expect(html).toContain("Theme");
		expect(html.match(/type="radio"/g)).toHaveLength(2);
	});

	it("Field ties its label to the input and shows the error", () => {
		const html = renderToString(
			withIntl(
				<Field label="Name" error="Required">
					<Input />
				</Field>
			)
		);
		const labelFor = html.match(/for="([^"]+)"/)?.[1];

		expect(labelFor).toBeDefined();
		expect(html).toContain(`id="${labelFor}"`);
		expect(html).toContain('aria-invalid="true"');
		expect(html).toContain("Required");
	});

	it("ProgressBar names what it measures", () => {
		const html = renderToString(
			withIntl(<ProgressBar value={0.5} label="Licenses unlocked" />)
		);

		expect(html).toContain("Licenses unlocked");
	});

	it("Dialog mounts its children only while open", () => {
		const closed = renderToString(
			withIntl(
				<Dialog open={false} onClose={noop} title="Edit">
					body text
				</Dialog>
			)
		);
		const open = renderToString(
			withIntl(
				<Dialog open onClose={noop} title="Edit">
					body text
				</Dialog>
			)
		);

		expect(closed).not.toContain("body text");
		expect(open).toContain("body text");
		expect(open).toContain("Edit");
	});
});

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe("Tabs keyboard", () => {
	it("moves with the arrow keys and jumps with Home and End", async () => {
		const onChange = vi.fn();
		const container = document.createElement("div");
		document.body.appendChild(container);
		const root = createRoot(container);
		await act(async () => {
			root.render(
				withIntl(
					<Tabs
						label="Farm"
						tabs={[
							{ id: "a", label: "A" },
							{ id: "b", label: "B" },
							{ id: "c", label: "C" },
						]}
						activeId="b"
						onChange={onChange}
					>
						panel
					</Tabs>
				)
			);
		});
		const press = async (key: string) => {
			await act(async () => {
				container
					.querySelector('[role="tab"]')!
					.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
			});
			return onChange.mock.lastCall![0];
		};

		expect(await press("ArrowRight")).toBe("c");
		expect(await press("ArrowLeft")).toBe("a");
		expect(await press("Home")).toBe("a");
		expect(await press("End")).toBe("c");
		await act(async () => root.unmount());
		container.remove();
	});
});
