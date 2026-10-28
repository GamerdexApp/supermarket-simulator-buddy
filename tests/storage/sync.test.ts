import {
  type FirstSyncChoice,
  MemoryProvider,
  sync,
  type SyncResult,
  type SyncState,
} from "@gamerdexapp/gamerdex-sync";
import { beforeEach, describe, expect, it } from "vitest";
import type { AppData, Playthrough } from "@/types/playthrough";
import {
  applyDocument,
  isSyncDocument,
  readLocalDocument,
  type SyncDocument,
} from "@/lib/sync/document";
import { syncSchema } from "@/lib/sync/schema";
import { parseBackup } from "@/service/backup";
import { storageService } from "@/service/storage";
import {
  emptyPlaythrough,
  playthroughWithUnknownFields,
  progressedPlaythrough,
} from "./fixtures";

const APP_ID = "supermarket-simulator-buddy";
const FIRST = "22222222-2222-4222-8222-222222222222";
const SECOND = "11111111-1111-4111-8111-111111111111";

class Device {
  state: SyncState | null = null;
  constructor(
    readonly id: string,
    public playthroughs: Playthrough[],
    public activePlaythroughId: string | null = playthroughs[0]?.id ?? null,
  ) {}

  document(): SyncDocument {
    return structuredClone({
      playthroughs: this.playthroughs,
      activePlaythroughId: this.activePlaythroughId,
    });
  }

  async sync(
    cloud: MemoryProvider,
    firstSync?: FirstSyncChoice,
  ): Promise<SyncResult> {
    const result = await sync({
      appId: APP_ID,
      deviceId: this.id,
      deviceName: this.id,
      provider: cloud,
      schema: syncSchema,
      local: this.document(),
      state: this.state,
      firstSync,
      validate: isSyncDocument,
      now: () => "2026-01-02T00:00:00.000Z",
    });
    if (result.status === "synced") {
      // The app applies the playthroughs only, so the device keeps its own active one.
      this.playthroughs = structuredClone(
        (result.data as SyncDocument).playthroughs,
      );
      this.state = structuredClone(result.state);
    }
    return result;
  }

  edit(id: string, change: (playthrough: Playthrough) => void) {
    change(this.get(id)!);
  }

  get(id: string) {
    return this.playthroughs.find((playthrough) => playthrough.id === id);
  }
}

const synced = async (result: Promise<SyncResult>) => {
  const outcome = await result;
  if (outcome.status !== "synced") throw new Error("expected a finished sync");
  return outcome;
};

const twoDevices = async () => {
  const cloud = new MemoryProvider();
  const a = new Device("a", [progressedPlaythrough(), emptyPlaythrough()]);
  await a.sync(cloud);
  const b = new Device("b", []);
  await synced(b.sync(cloud, "keep-cloud"));
  return { cloud, a, b };
};

/** Device a edits, syncs, then device b edits and syncs and takes the result of both. */
const bothEdit = async (
  editA: (p: Playthrough) => void,
  editB: (p: Playthrough) => void,
  id = FIRST,
) => {
  const { cloud, a, b } = await twoDevices();
  a.edit(id, editA);
  b.edit(id, editB);
  await a.sync(cloud);
  const result = await synced(b.sync(cloud));
  await a.sync(cloud);
  return { cloud, a, b, result, merged: b.get(id)! };
};

describe("the data file", () => {
  it("is the backup file of the app", async () => {
    const cloud = new MemoryProvider();
    const a = new Device("a", [progressedPlaythrough()]);
    await a.sync(cloud);

    const file = await cloud.read(
      "Gamerdex/supermarket-simulator-buddy/data.json",
    );
    const parsed = parseBackup(file!.content);

    expect(parsed.ok && parsed.data.playthroughs).toEqual([
      progressedPlaythrough(),
    ]);
  });

  it("matches the saved data of the app", () => {
    const saved: AppData = {
      playthroughs: [progressedPlaythrough()],
      activePlaythroughId: FIRST,
    };
    storageService.save(saved);

    expect(readLocalDocument()).toEqual(saved);
  });

  it("is refused when it is not a backup file", () => {
    expect(isSyncDocument({ hello: "world" })).toBe(false);
    expect(
      isSyncDocument({ playthroughs: [], activePlaythroughId: null }),
    ).toBe(true);
  });
});

describe("syncing two devices", () => {
  it("copies the data to a new device that has none", async () => {
    const { b } = await twoDevices();

    expect(b.playthroughs.map((p) => p.id)).toEqual([FIRST, SECOND]);
  });

  it("asks before it replaces anything when both sides have data", async () => {
    const cloud = new MemoryProvider();
    await new Device("a", [progressedPlaythrough()]).sync(cloud);

    const result = await new Device("b", [emptyPlaythrough()]).sync(cloud);

    expect(result.status).not.toBe("synced");
  });

  it("keeps fields that this version does not know about", async () => {
    const cloud = new MemoryProvider();
    const odd = playthroughWithUnknownFields();
    await new Device("a", [odd]).sync(cloud);
    const b = new Device("b", []);
    await synced(b.sync(cloud, "keep-cloud"));

    expect(b.playthroughs[0]).toEqual(odd);
  });
});

describe("unlocks", () => {
  it("keeps what both devices unlocked and carries a removal", async () => {
    const { merged } = await bothEdit(
      (p) => {
        p.unlockedLicenses = [
          ...p.unlockedLicenses!.filter((id) => id !== "license_5"),
          "license_6",
        ];
      },
      (p) => {
        p.unlockedLicenses = [...p.unlockedLicenses!, "license_7"];
        p.hiredEmployees = [...p.hiredEmployees!, "cashier_2"];
      },
    );

    expect([...merged.unlockedLicenses!].sort()).toEqual([
      "license_0",
      "license_1",
      "license_2",
      "license_6",
      "license_7",
    ]);
    expect(merged.hiredEmployees).toContain("cashier_2");
  });

  it("takes the higher store level", async () => {
    const { merged, result } = await bothEdit(
      (p) => {
        p.storeLevel = 48;
      },
      (p) => {
        p.storeLevel = 40;
      },
    );

    expect(merged.storeLevel).toBe(48);
    expect(result.conflicts).toEqual([]);
  });

  it("keeps a loan taken on each device and carries a removed loan", async () => {
    const loan = (loanIndex: number) => ({
      loanIndex,
      termLength: 10,
      activatedDate: "2026-03-05T00:00:00.000Z",
    });
    const { merged } = await bothEdit(
      (p) => {
        p.activeLoans = [loan(3)];
      },
      (p) => {
        p.activeLoans = [...p.activeLoans!, loan(0)];
      },
    );

    expect(merged.activeLoans!.map((l) => l.loanIndex).sort()).toEqual([0, 3]);
  });
});

describe("the shopping list", () => {
  it("keeps items added on each device and merges an item by id", async () => {
    const item = (id: string, productName: string) => ({
      id,
      productName,
      boxes: 1,
      purchased: false,
      store: "",
    });
    const { merged } = await bothEdit(
      (p) => {
        p.shoppingList = [...p.shoppingList!, item("c", "Milk")];
        p.shoppingList[0] = { ...p.shoppingList[0], purchased: true };
      },
      (p) => {
        p.shoppingList = [...p.shoppingList!, item("d", "Cheese")];
        p.shoppingList[0] = { ...p.shoppingList[0], boxes: 5 };
      },
    );

    expect(merged.shoppingList!.map((i) => i.productName).sort()).toEqual([
      "Avacado",
      "Bread",
      "Cheese",
      "Milk",
    ]);
    expect(merged.shoppingList![0]).toMatchObject({
      purchased: true,
      boxes: 5,
    });
  });
});

describe("conflicts", () => {
  it("reports a conflict when both devices rename a playthrough", async () => {
    const { result } = await bothEdit(
      (p) => {
        p.name = "North";
      },
      (p) => {
        p.name = "South";
      },
    );

    expect(result.conflicts.map((c) => c.path.at(-1))).toContain("name");
  });

  it("deletes a playthrough everywhere when one device deletes it", async () => {
    const { cloud, a, b } = await twoDevices();
    a.playthroughs = a.playthroughs.filter((p) => p.id !== SECOND);
    await a.sync(cloud);
    await b.sync(cloud);

    expect(b.playthroughs.map((p) => p.id)).toEqual([FIRST]);
  });
});

describe("the choice of each device", () => {
  it("never syncs the active playthrough", async () => {
    const { cloud, a, b } = await twoDevices();
    a.activePlaythroughId = SECOND;
    b.activePlaythroughId = FIRST;
    a.edit(FIRST, (p) => {
      p.storeLevel = 50;
    });
    await a.sync(cloud);
    await b.sync(cloud);

    expect(b.activePlaythroughId).toBe(FIRST);
    expect(b.get(FIRST)!.storeLevel).toBe(50);
  });
});

describe("applying the merged data", () => {
  beforeEach(() => localStorage.clear());

  it("writes the merged playthroughs and leaves the active one alone", () => {
    storageService.save({
      playthroughs: [emptyPlaythrough(), progressedPlaythrough()],
      activePlaythroughId: SECOND,
    });

    applyDocument({
      playthroughs: [
        { ...emptyPlaythrough(), name: "Renamed" },
        progressedPlaythrough(),
      ],
      activePlaythroughId: FIRST,
    });

    expect(storageService.load().activePlaythroughId).toBe(SECOND);
    expect(storageService.load().playthroughs[0].name).toBe("Renamed");
  });

  it("writes nothing when the merged playthroughs equal the saved ones", () => {
    storageService.save({
      playthroughs: [emptyPlaythrough()],
      activePlaythroughId: SECOND,
    });

    expect(
      applyDocument({
        playthroughs: [emptyPlaythrough()],
        activePlaythroughId: null,
      }),
    ).toBe(false);
  });

  it("leaves no active playthrough when a sync deleted the active one", () => {
    storageService.save({
      playthroughs: [emptyPlaythrough(), progressedPlaythrough()],
      activePlaythroughId: SECOND,
    });

    applyDocument({
      playthroughs: [progressedPlaythrough()],
      activePlaythroughId: FIRST,
    });

    expect(storageService.load().activePlaythroughId).toBeNull();
  });
});
