import {
  addPlaythrough,
  deletePlaythrough,
  loadAppData,
  setActivePlaythrough,
  storageService,
  updatePlaythrough,
} from "../reference/storage";
import { describeStorageContract } from "./contract";

describeStorageContract("old storage code", () => ({
  load: loadAppData,
  add: (input) => storageService.save(addPlaythrough(loadAppData(), input)),
  update: (id, updates) =>
    storageService.save(updatePlaythrough(loadAppData(), id, updates)),
  remove: (id) => storageService.save(deletePlaythrough(loadAppData(), id)),
  setActive: (id) =>
    storageService.save(setActivePlaythrough(loadAppData(), id)),
  exportJson: () => storageService.exportData(),
  importText: (text) => storageService.importData(text),
  clear: () => storageService.clear(),
}));
